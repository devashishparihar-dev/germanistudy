import React from 'react';
import { PlayCircle, Target, Clock, BookOpen, AlertCircle, ChevronRight, Monitor, Zap } from 'lucide-react';
import ExamSidebar from '../components/ExamSidebar';
import { motion } from 'framer-motion';
import ErrorBoundary from '../components/ErrorBoundary';
import { trackEvent } from '../utils/analytics';

const DigitalSubjectTest = ({ setCurrentView }) => {
  const startModule = (moduleId) => {
    localStorage.setItem('selectedDigitalSubjectModule', moduleId);
    trackEvent('mock_started', { type: 'subject_module', moduleId });
    setCurrentView('DigitalSimulator');
  };

  return (
    <ErrorBoundary>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
        <ExamSidebar setCurrentView={setCurrentView} />
      
      <main style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          <header style={{ textAlign: 'center', marginBottom: '56px', marginTop: '32px' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '16px', letterSpacing: '-1px' }}>Digital TestAS Subject Module</h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
              Choose your specialized field. Evaluate your comprehension and analytical skills under strict digital conditions.
            </p>
          </header>

          {/* Info Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '48px' }}>
            {[
              { label: 'Format', value: 'Digital', icon: <Monitor size={20} /> },
              { label: 'Structure', value: '10-15 Testlets', icon: <BookOpen size={20} /> },
              { label: 'Time', value: '~90 Minutes', icon: <Clock size={20} /> },
              { label: 'Language', value: 'English', icon: <AlertCircle size={20} /> },
            ].map((stat, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="premium-card" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--accent)', marginBottom: '12px' }}>{stat.icon}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>{stat.value}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase' }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
          
          <div className="premium-card" style={{ padding: '32px', marginBottom: '48px', textAlign: 'center', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid var(--error)' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--error)' }}>Strict Mode Active: Forward Navigation Only. No Note-Taking. Single-Choice Only.</div>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>Select Subject Module</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '56px' }}>
            {[
              { id: 'humanities', name: 'Humanities, Cultural Studies and Social Sciences', digitalExclusive: false },
              { id: 'engineering', name: 'Engineering', digitalExclusive: false },
              { id: 'math_cs', name: 'Mathematics, Computer Science and Natural Sciences', digitalExclusive: false },
              { id: 'economics', name: 'Economics', digitalExclusive: false },
              { id: 'medicine', name: 'Medicine', digitalExclusive: true },
              { id: 'life_sciences', name: 'Life Sciences', digitalExclusive: true },
            ].map((module, idx) => (
              <button 
                key={idx} 
                onClick={() => startModule(module.id)}
                className="premium-card module-card" 
                style={{ 
                  padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                  border: '1px solid var(--border)', cursor: 'pointer', background: 'var(--card-bg)',
                  transition: 'all 0.2s', textAlign: 'left', outline: 'none'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text)' }}>{module.name}</h3>
                    {module.digitalExclusive && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                        <Zap size={12} fill="var(--success)" /> Digital Exclusive
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    {module.digitalExclusive ? 'Only available in the new digital TestAS format.' : 'Available in both paper and digital formats.'}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <ChevronRight size={20} color="var(--primary)" />
                </div>
              </button>
            ))}
          </div>

        </div>
      </main>
    </div>
    </ErrorBoundary>
  );
};

export default DigitalSubjectTest;
