import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Loader2, FileText, Trash2, PlusCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const MODULE_OPTIONS = [
  "Core Module",
  "Latin Squares",
  "Mathematical Equations",
  "Figure Sequences",
  "Subject Modules"
];

const AdminNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [title, setTitle] = useState('');
  const [module, setModule] = useState(MODULE_OPTIONS[0]);
  const [driveUrl, setDriveUrl] = useState('');
  
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('study_notes')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setNotes(data || []);
    } catch (err) {
      console.error("Error fetching notes:", err);
      alert("Failed to load study notes.");
    } finally {
      setLoading(false);
    }
  };

  const validateDriveUrl = (url) => {
    return /\/d\/([a-zA-Z0-9_-]+)/.test(url);
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim() || !driveUrl.trim()) {
      setFormError('Title and Drive URL are required.');
      return;
    }

    if (!validateDriveUrl(driveUrl)) {
      setFormError("Couldn't find a file ID in this link — make sure it's a Drive share link and sharing is set to 'Anyone with the link'.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('study_notes')
        .insert([{ title, module, drive_url: driveUrl }])
        .select()
        .single();
        
      if (error) throw error;
      
      setNotes([data, ...notes]);
      
      // Reset form
      setTitle('');
      setDriveUrl('');
      setModule(MODULE_OPTIONS[0]);
    } catch (err) {
      console.error("Error adding note:", err);
      setFormError('Failed to save the note. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this study note?")) return;
    
    try {
      const { error } = await supabase
        .from('study_notes')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      setNotes(notes.filter(n => n.id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
      alert("Failed to delete the note.");
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <Loader2 className="spin" size={32} style={{ color: 'var(--primary)' }} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
          Study Notes
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Manage PDF study notes hosted on Google Drive.</p>
      </div>

      {/* Add Note Form */}
      <div className="premium-card" style={{ padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PlusCircle size={20} /> Add New Note
        </h3>
        
        <form onSubmit={handleAddNote} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text)', fontSize: '0.9rem' }}>Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Quantitative Reasoning Cheat Sheet"
                style={{ 
                  width: '100%', 
                  padding: '10px 12px', 
                  borderRadius: '6px', 
                  border: '1px solid var(--border)', 
                  background: 'var(--surface)', 
                  color: 'var(--text)' 
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text)', fontSize: '0.9rem' }}>Module</label>
              <select 
                value={module}
                onChange={(e) => setModule(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '10px 12px', 
                  borderRadius: '6px', 
                  border: '1px solid var(--border)', 
                  background: 'var(--surface)', 
                  color: 'var(--text)' 
                }}
              >
                {MODULE_OPTIONS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text)', fontSize: '0.9rem' }}>Google Drive Share URL</label>
            <input 
              type="text" 
              value={driveUrl}
              onChange={(e) => setDriveUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/FILE_ID/view?usp=sharing"
              style={{ 
                width: '100%', 
                padding: '10px 12px', 
                borderRadius: '6px', 
                border: '1px solid var(--border)', 
                background: 'var(--surface)', 
                color: 'var(--text)' 
              }}
            />
          </div>

          {formError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff4d4f', fontSize: '0.9rem', backgroundColor: 'rgba(255, 77, 79, 0.1)', padding: '10px', borderRadius: '6px' }}>
              <AlertCircle size={16} /> {formError}
            </div>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {isSubmitting ? <Loader2 size={16} className="spin" /> : <PlusCircle size={16} />}
              Save Note
            </button>
          </div>
        </form>
      </div>

      {/* Notes List */}
      <div className="premium-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={20} /> Existing Notes
        </h3>
        
        {notes.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>No study notes found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Title</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Module</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Created At</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {notes.map((note) => (
                  <motion.tr 
                    key={note.id} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <td style={{ padding: '16px', color: 'var(--text)', fontWeight: 500 }}>{note.title}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, background: 'rgba(136, 192, 208, 0.1)', padding: '4px 8px', borderRadius: '4px' }}>
                        {note.module}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {new Date(note.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleDelete(note.id)}
                        style={{ 
                          background: 'rgba(255, 77, 79, 0.1)', 
                          color: '#ff4d4f', 
                          border: 'none', 
                          padding: '6px 12px', 
                          borderRadius: '6px', 
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.85rem',
                          fontWeight: 500
                        }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotes;
