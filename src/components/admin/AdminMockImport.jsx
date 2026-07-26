import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Upload, CheckCircle, AlertCircle, FileJson, ShieldCheck } from 'lucide-react';

const AdminMockImport = () => {
  const [testName, setTestName] = useState('');
  const [section, setSection] = useState('figure_sequences');
  const [duration, setDuration] = useState(25);
  const [isPremium, setIsPremium] = useState(false);
  const [jsonText, setJsonText] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [parsedData, setParsedData] = useState(null);
  const [existingMocks, setExistingMocks] = useState([]);

  const fetchMocks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('mock_tests').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setExistingMocks(data || []);
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to fetch mocks: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const deleteMock = async (mockId) => {
    if (!window.confirm('Are you sure you want to delete this mock test? This will also delete all associated questions and results.')) return;
    
    setLoading(true);
    try {
      // 1. Delete results to clear foreign keys
      await supabase.from('mock_test_results').delete().eq('mock_test_id', mockId);
      
      // 2. Find and delete from linking table
      const { data: linkData } = await supabase.from('mock_test_questions').select('question_id').eq('mock_test_id', mockId);
      await supabase.from('mock_test_questions').delete().eq('mock_test_id', mockId);
      
      // 3. Delete actual questions
      if (linkData && linkData.length > 0) {
        const qIds = linkData.map(l => l.question_id);
        // We delete in batches if necessary, but for 50-100 questions this is fine
        await supabase.from('core_test_questions').delete().in('id', qIds);
      }
      
      // (Fallback) Try deleting by mock_test_id if the column exists
      await supabase.from('core_test_questions').delete().eq('mock_test_id', mockId);
      
      // 4. Finally delete the mock test
      const { data: deletedMock, error } = await supabase.from('mock_tests').delete().eq('id', mockId).select();
      if (error) throw error;
      
      if (!deletedMock || deletedMock.length === 0) {
        throw new Error("Row Level Security (RLS) silently blocked the deletion. You do not have permission to delete this record via the app. Please delete it directly from Supabase Studio.");
      }
      
      setMessage({ type: 'success', text: 'Mock test deleted successfully.' });
      fetchMocks();
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to delete: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setJsonText(event.target.result);
    reader.readAsText(file);
  };

  const validateImport = () => {
    setMessage({ type: '', text: '' });
    setParsedData(null);
    
    if (!jsonText.trim()) {
      setMessage({ type: 'error', text: 'Please provide JSON data.' });
      return;
    }
    
    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (e) {
      setMessage({ type: 'error', text: `JSON Parser Error: ${e.message}` });
      return;
    }
    
    if (!Array.isArray(parsed)) {
      setMessage({ type: 'error', text: 'Top-level value must be a JSON array of questions.' });
      return;
    }
    
    const seenIds = new Set();
    
    for (let i = 0; i < parsed.length; i++) {
      const q = parsed[i];
      const qRef = q.id ? `Question id: ${q.id}` : `Question at index ${i}`;
      
      if (!q.id || !q.section || !q.type || !q.question || !q.options || q.correct_answer === undefined || !q.explanation || !q.difficulty) {
        setMessage({ type: 'error', text: `${qRef}: missing one or more required fields (id, section, type, question, options, correct_answer, explanation, difficulty).` });
        return;
      }
      
      if (seenIds.has(q.id)) {
        setMessage({ type: 'error', text: `${qRef}: duplicate id '${q.id}' found.` });
        return;
      }
      seenIds.add(q.id);
      
      if (q.type === 'latin_square') {
        if (!q.grid || !Array.isArray(q.grid.columns) || !Array.isArray(q.grid.rows)) {
          setMessage({ type: 'error', text: `${qRef}: missing or invalid 'grid' object. It must have 'columns' (array) and 'rows' (array of arrays).` });
          return;
        }
        const colLength = q.grid.columns.length;
        for (let r = 0; r < q.grid.rows.length; r++) {
          if (!Array.isArray(q.grid.rows[r]) || q.grid.rows[r].length !== colLength) {
            setMessage({ type: 'error', text: `${qRef}: grid row ${r} length does not match grid columns length.` });
            return;
          }
        }
      }
      
      if (q.type === 'figural_sequence') {
        if (!q.question_image || typeof q.question_image !== 'string') {
          setMessage({ type: 'error', text: `${qRef}: missing 'question_image' URL.` });
          return;
        }
        for (let o = 0; o < q.options.length; o++) {
          const opt = q.options[o];
          if (typeof opt !== 'object' || opt === null || !opt.id || !opt.image) {
            setMessage({ type: 'error', text: `${qRef}: option ${o} must be an object with 'id' and 'image' for figural sequences.` });
            return;
          }
        }
        
        // Check correct_answer
        const optionIds = q.options.map(o => o.id);
        if (!optionIds.includes(q.correct_answer)) {
          setMessage({ type: 'error', text: `${qRef}: correct_answer '${q.correct_answer}' does not match any option id.` });
          return;
        }
        if (String(q.correct_answer).startsWith('http') || String(q.correct_answer).startsWith('![')) {
          setMessage({ type: 'error', text: `${qRef}: correct_answer should be an ID, not a URL or markdown string.` });
          return;
        }
      } else {
        // correct_answer should exist in options
        const optionStrings = q.options.map(o => (typeof o === 'object' ? o.id : o));
        if (!optionStrings.includes(q.correct_answer)) {
          setMessage({ type: 'error', text: `${qRef}: correct_answer '${q.correct_answer}' is not found in the options array.` });
          return;
        }
      }
    }
    
    setParsedData(parsed);
    setMessage({ type: 'success', text: `${parsed.length} questions parsed — ${parsed.length} valid, 0 errors. Ready to publish.` });
  };

  const publishImport = async () => {
    if (!parsedData || !testName.trim()) {
       setMessage({ type: 'error', text: 'Please validate the JSON and provide a Test Name first.' });
       return;
    }
    
    setLoading(true);
    let mockTestId = null;
    
    try {
      // 1. Insert mock test
      const { data: mockData, error: mockError } = await supabase
        .from('mock_tests')
        .insert({
          title: testName.trim(),
          section: section,
          duration: parseInt(duration) || 25,
          total_questions: parsedData.length,
          is_premium: isPremium
        })
        .select('id')
        .single();
        
      if (mockError) {
          // fallback for legacy column names if section/is_premium fails
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('mock_tests')
            .insert({
              title: testName.trim(),
              duration: parseInt(duration) || 25,
              total_questions: parsedData.length
            })
            .select('id')
            .single();
            
          if (fallbackError) throw new Error(`Failed to create mock test: ${mockError.message} / ${fallbackError.message}`);
          mockTestId = fallbackData.id;
      } else {
          mockTestId = mockData.id;
      }
      
      // 2. Insert questions
      const questionsToInsert = parsedData.map((q, idx) => ({
        section: q.section,
        question_type: q.type,
        question: String(q.question),
        options: q.options,
        correct_answer: String(q.correct_answer),
        explanation: q.explanation,
        difficulty: q.difficulty,
        grid: q.type === 'latin_square' ? q.grid : null,
        question_image: q.type === 'figural_sequence' ? q.question_image : null
      }));
      
      // Wait, we need to insert them and link to mock_test_questions OR does core_test_questions have mock_test_id?
      // Based on original AdminMockImport.jsx, it inserts to core_test_questions AND mock_test_questions.
      // The brief says: `mock_test_id | uuid, FK -> mock_tests.id`.
      // Let's try adding mock_test_id directly, and if it fails, fallback to linking.
      
      const questionsWithMockId = questionsToInsert.map(q => ({ ...q, mock_test_id: mockTestId }));
      
      const { data: insertedQs, error: insertError } = await supabase
        .from('core_test_questions')
        .insert(questionsWithMockId)
        .select('id');
        
      if (insertError) {
          if (insertError.message.includes('mock_test_id')) {
              // fallback to linking table
              const { data: legacyQs, error: legacyInsertError } = await supabase
                  .from('core_test_questions')
                  .insert(questionsToInsert)
                  .select('id');
                  
              if (legacyInsertError) throw new Error(`Database error on questions insert: ${legacyInsertError.message}`);
              
              const linkRecords = legacyQs.map((q, idx) => ({
                  mock_test_id: mockTestId,
                  question_id: q.id,
                  display_order: idx + 1
              }));
              
              const { error: linkError } = await supabase.from('mock_test_questions').insert(linkRecords);
              if (linkError) throw new Error(`Database error on linking questions: ${linkError.message}`);
          } else {
              throw new Error(`Database error on questions insert: ${insertError.message}`);
          }
      }
      
      setMessage({ type: 'success', text: `Successfully published test "${testName}" with ${parsedData.length} questions.` });
      setJsonText('');
      setTestName('');
      setParsedData(null);
    } catch (err) {
      if (mockTestId) {
        await supabase.from('mock_tests').delete().eq('id', mockTestId);
      }
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-card" style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ background: 'var(--primary-light, rgba(37, 99, 235, 0.1))', padding: '12px', borderRadius: '12px', color: 'var(--primary)' }}>
          <FileJson size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Import Mock Test</h2>
          <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0', fontSize: '0.9rem' }}>
            Paste a valid JSON array to publish a new custom mock test.
          </p>
        </div>
      </div>

      {message.text && (
        <div style={{ 
          padding: '16px', 
          borderRadius: '8px', 
          marginBottom: '24px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          backgroundColor: message.type === 'error' ? 'var(--error-light, #fee2e2)' : 'var(--success-light, #d1fae5)',
          color: message.type === 'error' ? 'var(--error-dark, #991b1b)' : 'var(--success-dark, #065f46)'
        }}>
          {message.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          <span style={{ fontWeight: 500 }}>{message.text}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-main)' }}>
            Test Name
          </label>
          <input 
            type="text" 
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            placeholder="e.g. Core Module Mock 1"
            style={{ 
              width: '100%', padding: '12px', border: '1px solid var(--border-color)', 
              borderRadius: '8px', background: 'var(--bg-light)', color: 'var(--text-main)' 
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-main)' }}>
            Section / Subtest
          </label>
          <select 
            value={section}
            onChange={(e) => setSection(e.target.value)}
            style={{ 
              width: '100%', padding: '12px', border: '1px solid var(--border-color)', 
              borderRadius: '8px', background: 'var(--bg-light)', color: 'var(--text-main)' 
            }}
          >
            <option value="figure_sequences">Figural Sequences</option>
            <option value="mathematical_equations">Mathematical Equations</option>
            <option value="latin_squares">Latin Squares</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-main)' }}>
            Duration (minutes)
          </label>
          <input 
            type="number" 
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            style={{ 
              width: '100%', padding: '12px', border: '1px solid var(--border-color)', 
              borderRadius: '8px', background: 'var(--bg-light)', color: 'var(--text-main)' 
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '28px' }}>
          <input 
            type="checkbox" 
            id="premium_toggle"
            checked={isPremium}
            onChange={(e) => setIsPremium(e.target.checked)}
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
          <label htmlFor="premium_toggle" style={{ fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer' }}>
            Premium Test
          </label>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-main)' }}>
          JSON Content
        </label>
        <textarea 
          value={jsonText}
          onChange={(e) => { setJsonText(e.target.value); setParsedData(null); }}
          placeholder='[{"id": "ls-001", "type": "latin_square", ...}]'
          style={{ 
            width: '100%', height: '300px', padding: '16px', borderRadius: '8px', 
            border: '1px solid var(--border-color)', background: 'var(--bg-light)', 
            color: 'var(--text-main)', fontFamily: 'monospace', resize: 'vertical' 
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        <button 
          onClick={validateImport} 
          disabled={loading || !jsonText.trim()}
          className="btn-secondary"
          style={{ flex: 1, padding: '16px', fontWeight: 600 }}
        >
          Validate JSON
        </button>
        <button 
          onClick={publishImport} 
          disabled={loading || !parsedData}
          className="btn-primary"
          style={{ flex: 1, padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
        >
          {loading ? 'Publishing...' : 'Publish Test'}
          {!loading && <ShieldCheck size={18} />}
        </button>
      </div>

      <div style={{ marginTop: '48px', borderTop: '1px solid var(--border-color)', paddingTop: '32px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 16px 0', color: 'var(--text-main)' }}>Manage Existing Mocks</h3>
        <button onClick={fetchMocks} disabled={loading} className="btn-secondary" style={{ marginBottom: '16px', padding: '8px 16px' }}>
          Refresh List
        </button>
        
        {existingMocks.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {existingMocks.map(mock => (
              <div key={mock.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-light)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{mock.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>ID: {mock.id} • {mock.total_questions} Questions • {mock.duration} mins</div>
                </div>
                <button 
                  onClick={() => deleteMock(mock.id)} 
                  disabled={loading}
                  style={{ background: 'var(--error-light, #fee2e2)', color: 'var(--error-dark, #991b1b)', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No mock tests found. Click Refresh to load.</div>
        )}
      </div>

    </div>
  );
};

export default AdminMockImport;
