import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Loader2, Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminQuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSection, setFilterSection] = useState('All');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [filterSection, filterDifficulty]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      let query = supabase.from('core_test_questions').select('*');
      
      if (filterSection !== 'All') {
        query = query.eq('section', filterSection);
      }
      if (filterDifficulty !== 'All') {
        query = query.eq('difficulty', filterDifficulty);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      setQuestions(data || []);
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (question) => {
    setCurrentQuestion({ ...question });
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentQuestion({
      section: 'figure_sequences',
      question: '',
      options: ['', '', '', ''],
      correct_answer: '',
      explanation: '',
      difficulty: 'medium',
      question_type: 'multiple_choice'
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      try {
        const { error } = await supabase.from('core_test_questions').delete().eq('id', id);
        if (error) throw error;
        setQuestions(questions.filter(q => q.id !== id));
      } catch (err) {
        console.error('Error deleting question:', err);
        alert('Failed to delete question. See console for details.');
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...currentQuestion };
      if (!payload.id) {
        // Create
        const { error } = await supabase.from('core_test_questions').insert([payload]);
        if (error) throw error;
      } else {
        // Update
        const { error } = await supabase.from('core_test_questions').update(payload).eq('id', payload.id);
        if (error) throw error;
      }
      setIsEditing(false);
      setCurrentQuestion(null);
      fetchQuestions();
    } catch (err) {
      console.error('Error saving question:', err);
      alert('Failed to save question. See console for details.');
    } finally {
      setSaving(false);
    }
  };

  if (isEditing) {
    return (
      <div style={{ fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--ink)' }}>
            {currentQuestion.id ? 'Edit Question' : 'Create New Question'}
          </h2>
          <button 
            onClick={() => setIsEditing(false)}
            style={{ background: 'transparent', border: '1px solid var(--ink)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: 'var(--paper)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(43, 36, 56, 0.1)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Section</label>
              <select 
                value={currentQuestion.section} 
                onChange={e => setCurrentQuestion({...currentQuestion, section: e.target.value})}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(43, 36, 56, 0.2)', background: 'var(--paper)', fontFamily: 'var(--font-body)' }}
              >
                <option value="figure_sequences">Figure Sequences</option>
                <option value="mathematical_equations">Mathematical Equations</option>
                <option value="latin_squares">Latin Squares</option>
                <option value="engineering">Engineering</option>
                <option value="economics">Economics</option>
                <option value="humanities">Humanities</option>
                <option value="math_computer_science">Math & CS</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Difficulty</label>
              <select 
                value={currentQuestion.difficulty} 
                onChange={e => setCurrentQuestion({...currentQuestion, difficulty: e.target.value})}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(43, 36, 56, 0.2)', background: 'var(--paper)', fontFamily: 'var(--font-body)' }}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Question Text</label>
            <textarea 
              value={currentQuestion.question || ''} 
              onChange={e => setCurrentQuestion({...currentQuestion, question: e.target.value})}
              required
              rows={4}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(43, 36, 56, 0.2)', background: 'var(--paper)', fontFamily: 'var(--font-body)', resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Options (JSON array of strings or objects)</label>
            <textarea 
              value={typeof currentQuestion.options === 'string' ? currentQuestion.options : JSON.stringify(currentQuestion.options, null, 2)} 
              onChange={e => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  setCurrentQuestion({...currentQuestion, options: parsed});
                } catch {
                  setCurrentQuestion({...currentQuestion, options: e.target.value}); // Keep raw string while typing
                }
              }}
              required
              rows={5}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(43, 36, 56, 0.2)', background: 'var(--paper)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Correct Answer</label>
              <input 
                type="text"
                value={currentQuestion.correct_answer || ''} 
                onChange={e => setCurrentQuestion({...currentQuestion, correct_answer: e.target.value})}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(43, 36, 56, 0.2)', background: 'var(--paper)', fontFamily: 'var(--font-body)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Question Type</label>
              <input 
                type="text"
                value={currentQuestion.question_type || 'multiple_choice'} 
                onChange={e => setCurrentQuestion({...currentQuestion, question_type: e.target.value})}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(43, 36, 56, 0.2)', background: 'var(--paper)', fontFamily: 'var(--font-body)' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Explanation (Markdown supported)</label>
            <textarea 
              value={currentQuestion.explanation || ''} 
              onChange={e => setCurrentQuestion({...currentQuestion, explanation: e.target.value})}
              rows={4}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(43, 36, 56, 0.2)', background: 'var(--paper)', fontFamily: 'var(--font-body)', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button 
              type="submit"
              disabled={saving}
              style={{ 
                background: 'var(--marigold)', 
                color: 'var(--ink)', 
                border: 'none', 
                padding: '12px 32px', 
                borderRadius: '8px', 
                fontWeight: 700, 
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.7 : 1
              }}
            >
              {saving ? 'Saving...' : 'Save Question'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--ink)', marginBottom: '8px' }}>Question Bank</h1>
          <p style={{ color: 'var(--ink-muted)' }}>Manage the core module questions used in simulations.</p>
        </div>
        <button 
          onClick={handleCreate}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'var(--sky)', color: '#fff', border: 'none', 
            padding: '12px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer',
            transition: 'transform 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Plus size={18} /> New Question
        </button>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', background: 'var(--paper)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(43, 36, 56, 0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={18} color="var(--ink-muted)" />
          <span style={{ fontWeight: 600, color: 'var(--ink-muted)', fontSize: '0.9rem' }}>Filters:</span>
        </div>
        <select 
          value={filterSection} 
          onChange={e => setFilterSection(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(43, 36, 56, 0.2)', background: 'transparent', fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}
        >
          <option value="All">All Sections</option>
          <option value="figure_sequences">Figure Sequences</option>
          <option value="mathematical_equations">Mathematical Equations</option>
          <option value="latin_squares">Latin Squares</option>
          <option value="engineering">Engineering</option>
          <option value="economics">Economics</option>
          <option value="humanities">Humanities</option>
          <option value="math_computer_science">Math & CS</option>
        </select>
        
        <select 
          value={filterDifficulty} 
          onChange={e => setFilterDifficulty(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(43, 36, 56, 0.2)', background: 'transparent', fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}
        >
          <option value="All">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
          <Loader2 size={32} className="spin" color="var(--sky)" />
        </div>
      ) : questions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px', background: 'var(--paper)', borderRadius: '12px', border: '1px solid rgba(43, 36, 56, 0.1)' }}>
          <p style={{ color: 'var(--ink-muted)', fontSize: '1.1rem' }}>No questions found matching the current filters.</p>
        </div>
      ) : (
        <div style={{ background: 'var(--paper)', borderRadius: '12px', border: '1px solid rgba(43, 36, 56, 0.1)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'rgba(43, 36, 56, 0.03)', borderBottom: '1px solid rgba(43, 36, 56, 0.1)' }}>
              <tr>
                <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ink-muted)' }}>Question ID</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ink-muted)' }}>Section</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ink-muted)' }}>Snippet</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ink-muted)' }}>Diff</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ink-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, idx) => (
                <tr key={q.id || idx} style={{ borderBottom: '1px solid rgba(43, 36, 56, 0.05)' }}>
                  <td style={{ padding: '16px 24px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--ink-muted)' }}>
                    {q.id ? q.id.slice(0, 8) : 'NEW'}...
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '0.95rem' }}>
                    {q.section === 'figure_sequences' ? 'Figures' : 
                     q.section === 'mathematical_equations' ? 'Math' : 
                     q.section === 'latin_squares' ? 'Latin' : 
                     q.section.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '0.95rem', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {q.question}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase',
                      background: q.difficulty === 'hard' ? 'rgba(228, 87, 74, 0.1)' : q.difficulty === 'easy' ? 'rgba(122, 139, 111, 0.1)' : 'rgba(47, 93, 138, 0.1)',
                      color: q.difficulty === 'hard' ? 'var(--coral)' : q.difficulty === 'easy' ? 'var(--sage)' : 'var(--sky)'
                    }}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', display: 'flex', gap: '12px' }}>
                    <button 
                      onClick={() => handleEdit(q)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--sky)', display: 'flex', alignItems: 'center' }}
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(q.id)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--coral)', display: 'flex', alignItems: 'center' }}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminQuestionBank;
