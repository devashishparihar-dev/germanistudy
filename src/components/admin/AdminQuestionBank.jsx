import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Pencil, Trash2, Plus, Search, CheckCircle, XCircle } from 'lucide-react';

const AdminQuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form Fields
  const [formData, setFormData] = useState({
    question: '',
    section: 'quantitative',
    difficulty: 'medium',
    options: ['', '', '', ''],
    correct_answer: '',
    explanation: '',
    status: 'draft'
  });

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      let query = supabase.from('core_test_questions').select('*').order('created_at', { ascending: false });
      
      if (sectionFilter !== 'all') {
        query = query.eq('section', sectionFilter);
      }
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      setQuestions(data || []);
    } catch (err) {
      console.error("Error fetching questions:", err);
      alert("Failed to load questions: " + (err.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [sectionFilter, statusFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      const { error } = await supabase.from('core_test_questions').delete().eq('id', id);
      if (error) throw error;
      setQuestions(questions.filter(q => q.id !== id));
    } catch (err) {
      console.error("Error deleting:", err);
      alert("Failed to delete question: " + (err.message || err.details || "Unknown error"));
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      const { error } = await supabase.from('core_test_questions').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      setQuestions(questions.map(q => q.id === id ? { ...q, status: newStatus } : q));
    } catch (err) {
      console.error("Error toggling status:", err);
      alert("Failed to update status: " + (err.message || err.details || "Unknown error"));
    }
  };

  const openForm = (q = null) => {
    if (q) {
      setEditingId(q.id);
      setFormData({
        question: q.question || '',
        section: q.section || 'quantitative',
        difficulty: q.difficulty || 'medium',
        options: q.options || ['', '', '', ''],
        correct_answer: q.correct_answer || '',
        explanation: q.explanation || '',
        status: q.status || 'draft'
      });
    } else {
      setEditingId(null);
      setFormData({
        question: '',
        section: 'quantitative',
        difficulty: 'medium',
        options: ['', '', '', ''],
        correct_answer: '',
        explanation: '',
        status: 'draft'
      });
    }
    setIsFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.question.trim() || formData.options.some(opt => !opt.trim())) {
      alert("Please fill in the question and all options.");
      return;
    }
    
    try {
      if (editingId) {
        const { error } = await supabase.from('core_test_questions').update(formData).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('core_test_questions').insert([formData]);
        if (error) throw error;
      }
      setIsFormOpen(false);
      fetchQuestions();
    } catch (err) {
      console.error("Error saving:", err);
      alert("Failed to save question: " + (err.message || err.details || "Unknown error"));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
    
    // Auto-update correct answer if it matches the old option text
    // (A more robust way is to store index, but schema uses text)
  };

  const filteredQuestions = questions.filter(q => 
    q.question?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>Question Bank</h2>
        <button 
          onClick={() => openForm()}
          className="btn-premium" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
        >
          <Plus size={18} /> Add Question
        </button>
      </div>

      {/* Filters */}
      <div className="premium-card" style={{ padding: '16px', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search questions..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 16px 10px 40px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-light)', color: 'var(--text-main)' }} 
          />
        </div>
        <select 
          value={sectionFilter} 
          onChange={(e) => setSectionFilter(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-light)', color: 'var(--text-main)' }}
        >
          <option value="all">All Sections</option>
          <option value="quantitative">Quantitative</option>
          <option value="relationships">Relationships</option>
          <option value="patterns">Patterns</option>
          <option value="numerical_series">Numerical Series</option>
        </select>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-light)', color: 'var(--text-main)' }}
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Table */}
      <div className="premium-card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-light)' }}>
              <th style={{ padding: '16px', fontWeight: 600, color: 'var(--text-muted)' }}>Question</th>
              <th style={{ padding: '16px', fontWeight: 600, color: 'var(--text-muted)' }}>Section</th>
              <th style={{ padding: '16px', fontWeight: 600, color: 'var(--text-muted)' }}>Status</th>
              <th style={{ padding: '16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</td></tr>
            ) : filteredQuestions.length === 0 ? (
              <tr><td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No questions found.</td></tr>
            ) : (
              filteredQuestions.map(q => (
                <tr key={q.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px', maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {q.question}
                  </td>
                  <td style={{ padding: '16px', textTransform: 'capitalize' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'var(--bg-light)', fontSize: '0.85rem' }}>
                      {q.section?.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <button 
                      onClick={() => handleToggleStatus(q.id, q.status)}
                      style={{ 
                        padding: '4px 12px', borderRadius: '16px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                        backgroundColor: q.status === 'published' ? 'var(--success-light, #d1fae5)' : 'var(--warning-light, #fef3c7)',
                        color: q.status === 'published' ? 'var(--success-dark, #065f46)' : 'var(--warning-dark, #92400e)'
                      }}
                    >
                      {q.status === 'published' ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button onClick={() => openForm(q)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', marginRight: '16px' }}>
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => handleDelete(q.id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '24px' }}>
          <div className="premium-card" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>{editingId ? 'Edit Question' : 'New Question'}</h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Question Text</label>
                <textarea 
                  required rows="3" value={formData.question} onChange={e => setFormData({...formData, question: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-light)', color: 'var(--text-main)', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Section</label>
                  <select value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-light)' }}>
                    <option value="quantitative">Quantitative</option>
                    <option value="relationships">Relationships</option>
                    <option value="patterns">Patterns</option>
                    <option value="numerical_series">Numerical Series</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Difficulty</label>
                  <select value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-light)' }}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Options (4 required)</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {formData.options.map((opt, i) => (
                    <input 
                      key={i} required type="text" placeholder={`Option ${i+1}`} value={opt} 
                      onChange={e => handleOptionChange(i, e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-light)' }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Correct Answer (Must match one of the options exactly)</label>
                <select 
                  required value={formData.correct_answer} 
                  onChange={e => setFormData({...formData, correct_answer: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-light)' }}
                >
                  <option value="" disabled>Select Correct Option</option>
                  {formData.options.map((opt, i) => (
                    <option key={i} value={opt} disabled={!opt.trim()}>{opt || `Option ${i+1} (empty)`}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Explanation</label>
                <textarea 
                  rows="2" value={formData.explanation} onChange={e => setFormData({...formData, explanation: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-light)', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px' }}>
                <button type="button" onClick={() => setIsFormOpen(false)} style={{ padding: '10px 24px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>Save Question</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuestionBank;
