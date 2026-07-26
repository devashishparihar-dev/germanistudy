import React, { useState, useEffect } from 'react';
import { FileText, Download, Loader2 } from 'lucide-react';
import ExamSidebar from '../components/ExamSidebar';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';

const Library = ({ setCurrentView }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('study_notes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setNotes(data || []);
    } catch (err) {
      console.error("Error fetching notes:", err);
    } finally {
      setLoading(false);
    }
  };

  const toDirectDownloadUrl = (driveUrl) => {
    if (!driveUrl) return '#';
    const match = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (!match) return driveUrl; // fallback
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      <ExamSidebar setCurrentView={setCurrentView} />
      
      <main style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', marginTop: '32px' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '8px', letterSpacing: '-1px' }}>Library</h1>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Your personal collection of notes, cheat sheets, and study materials.</p>
            </div>
          </header>

          {loading ? (
             <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
               <Loader2 className="spin" size={32} style={{ color: 'var(--primary)' }} />
             </div>
          ) : notes.length === 0 ? (
             <div className="premium-card" style={{ padding: '40px', textAlign: 'center' }}>
               <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No study notes available yet.</p>
             </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {notes.map((note, idx) => (
                <motion.a 
                  key={note.id} 
                  href={toDirectDownloadUrl(note.drive_url)}
                  className="premium-card" 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: idx * 0.1 }} 
                  style={{ 
                    padding: '24px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    textDecoration: 'none', 
                    color: 'inherit',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ padding: '10px', background: 'rgba(136, 192, 208, 0.15)', color: 'var(--primary)', borderRadius: '10px' }}>
                      <FileText size={24} />
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, background: 'var(--surface)', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                      {note.module}
                    </span>
                  </div>
                  
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
                    {note.title}
                  </h3>
                  
                  <div style={{ flex: 1 }}></div>
                  
                  <div 
                    className="btn-secondary" 
                    style={{ 
                      width: '100%', 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      gap: '8px', 
                      padding: '10px', 
                      marginTop: '24px' 
                    }}
                  >
                    <Download size={16} /> Download PDF
                  </div>
                </motion.a>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Library;
