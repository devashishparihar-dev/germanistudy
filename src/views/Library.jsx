import React from 'react';
import { BookMarked, FileText, Download, PlusCircle } from 'lucide-react';
import ExamSidebar from '../components/ExamSidebar';
import { motion } from 'framer-motion';

const Library = ({ setCurrentView }) => {
  const notes = [
    { title: "Quantitative Reasoning Cheat Sheet", type: "PDF", size: "2.4 MB" },
    { title: "Common Logical Fallacies", type: "Note", size: "12 KB" },
    { title: "Numerical Series Patterns", type: "PDF", size: "1.8 MB" },
    { title: "Vocabulary for TestAS", type: "Note", size: "45 KB" }
  ];

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
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PlusCircle size={20} /> Add Note
            </button>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {notes.map((note, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: idx * 0.1 }} 
                className="premium-card" 
                style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ padding: '10px', background: 'rgba(136, 192, 208, 0.15)', color: 'var(--primary)', borderRadius: '10px' }}>
                    {note.type === 'PDF' ? <FileText size={24} /> : <BookMarked size={24} />}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, background: 'var(--surface)', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                    {note.type}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>{note.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px', flex: 1 }}>
                  Size: {note.size}
                </p>
                <button 
                  className="btn-secondary" 
                  style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '10px' }}
                >
                  <Download size={16} /> Open
                </button>
              </motion.div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
};

export default Library;
