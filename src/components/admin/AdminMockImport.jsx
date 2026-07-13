import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Upload, CheckCircle, AlertCircle, FileJson } from 'lucide-react';

const AdminMockImport = () => {
  const [jsonText, setJsonText] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setJsonText(event.target.result);
    };
    reader.readAsText(file);
  };

  const processImport = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (!jsonText.trim()) {
        throw new Error('Please provide JSON data to import.');
      }

      const parsed = JSON.parse(jsonText);

      // Validate structure
      if (!parsed.test_name || !Array.isArray(parsed.questions)) {
        throw new Error('Invalid JSON format. Requires "test_name" and "questions" array.');
      }

      // 1. Create mock test entry
      const { data: mockData, error: mockError } = await supabase
        .from('mock_tests')
        .insert({
          title: parsed.test_name,
          duration: parsed.duration || 45,
        })
        .select('id')
        .single();

      if (mockError) throw new Error(`Error creating mock test: ${mockError.message}`);

      const mockTestId = mockData.id;
      let successCount = 0;

      // 2. Insert questions and link them
      for (let i = 0; i < parsed.questions.length; i++) {
        const q = parsed.questions[i];
        
        // Insert to core_test_questions
        const { data: qData, error: qError } = await supabase
          .from('core_test_questions')
          .insert({
            question: String(q.question),
            options: q.options || [],
            correct_answer: String(q.correct_answer),
            explanation: q.explanation || '',
            section: q.section || 'quantitative',
            difficulty: q.difficulty || 'medium',
            estimated_time: q.estimated_time || 90,
            status: 'published'
          })
          .select('id')
          .single();

        if (qError) {
          console.error(`Failed to insert question ${i}:`, qError);
          continue;
        }

        // Link to mock_test_questions
        const { error: linkError } = await supabase
          .from('mock_test_questions')
          .insert({
            mock_test_id: mockTestId,
            question_id: qData.id,
            display_order: i + 1
          });

        if (linkError) {
          console.error(`Failed to link question ${i}:`, linkError);
        } else {
          successCount++;
        }
      }

      setMessage({ type: 'success', text: `Successfully imported mock test "${parsed.test_name}" with ${successCount} questions.` });
      setJsonText('');

    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'An error occurred during import.' });
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
            Upload a JSON file or paste the JSON text directly to import a new custom mock test.
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

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-main)' }}>
          Upload JSON File
        </label>
        <input 
          type="file" 
          accept=".json" 
          onChange={handleFileUpload} 
          style={{ 
            display: 'block', width: '100%', padding: '12px', border: '1px dashed var(--border-color)', 
            borderRadius: '8px', background: 'var(--bg-light)', cursor: 'pointer' 
          }}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-main)' }}>
          Or Paste JSON Content
        </label>
        <textarea 
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          placeholder='{"test_name": "My Mock", "duration": 60, "questions": [...]}'
          style={{ 
            width: '100%', height: '300px', padding: '16px', borderRadius: '8px', 
            border: '1px solid var(--border-color)', background: 'var(--bg-light)', 
            color: 'var(--text-main)', fontFamily: 'monospace', resize: 'vertical' 
          }}
        />
      </div>

      <button 
        onClick={processImport} 
        disabled={loading || !jsonText.trim()}
        className="btn-primary"
        style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '16px' }}
      >
        {loading ? 'Importing...' : 'Import Mock Test'}
        {!loading && <Upload size={18} />}
      </button>

      <div style={{ marginTop: '24px', padding: '16px', borderRadius: '8px', backgroundColor: 'var(--bg-light)', border: '1px solid var(--border-color)' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: 'var(--text-main)' }}>Expected JSON Format</h4>
        <pre style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, overflowX: 'auto' }}>
{`{
  "test_name": "New Full Mock Test",
  "duration": 75,
  "questions": [
    {
      "question": "What is 2 + 2?",
      "options": ["3", "4", "5", "6"],
      "correct_answer": "4",
      "explanation": "Basic math.",
      "section": "quantitative",
      "difficulty": "easy",
      "estimated_time": 60
    }
  ]
}`}
        </pre>
      </div>
    </div>
  );
};

export default AdminMockImport;
