import React from 'react';
import { PlayCircle, Target, Clock, BookOpen, AlertCircle, ChevronRight, Monitor } from 'lucide-react';
import ExamSidebar from '../components/ExamSidebar';
import { motion } from 'framer-motion';

const DigitalCoreTest = ({ setCurrentView }) => {
  const startModule = (moduleId) => {
    localStorage.setItem('selectedDigitalModule', moduleId);
    setCurrentView('DigitalSimulator');
  };

  const startFullTest = () => {
    localStorage.removeItem('selectedDigitalModule');
    setCurrentView('DigitalSimulator');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      <ExamSidebar setCurrentView={setCurrentView} />
      
      <main style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          <header style={{ textAlign: 'center', marginBottom: '56px', marginTop: '32px' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '16px', letterSpacing: '-1px' }}>Digital TestAS Mock Test</h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
              Experience the strictly controlled Digital format. No going back, no scratchpads. Just you and the screen.
            </p>
          </header>

          {/* Info Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '48px' }}>
            {[
              { label: 'Format', value: 'Digital', icon: <Monitor size={20} /> },
              { label: 'Questions', value: '88', icon: <Target size={20} /> },
              { label: 'Time', value: '110 Minutes', icon: <Clock size={20} /> },
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
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--error)' }}>Strict Mode Active: Forward Navigation Only. No Note-Taking.</div>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>Subtests</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '56px' }}>
            {[
              { id: 'quantitative', name: '1. Solving Quantitative Problems', q: '22 Questions', t: '45 Minutes' },
              { id: 'relationships', name: '2. Inferring Relationships', q: '22 Questions', t: '10 Minutes' },
              { id: 'patterns', name: '3. Completing Patterns', q: '22 Questions', t: '22 Minutes' },
              { id: 'numerical_series', name: '4. Continuing Numerical Series', q: '22 Questions', t: '25 Minutes' }
            ].map((subtest, idx) => (
              <button 
                key={idx} 
                onClick={() => startModule(subtest.id)}
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
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>{subtest.name}</h3>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <span>{subtest.q}</span>
                    <span>•</span>
                    <span>{subtest.t}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '6px 12px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 600 }}>
                    Status: Ready
                  </div>
                  <ChevronRight size={20} color="var(--primary)" />
                </div>
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '80px' }}>
            <button 
              className="btn-primary" 
              onClick={startFullTest} 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', 
                padding: '16px 48px', fontSize: '1.25rem', borderRadius: '32px',
                boxShadow: '0 10px 25px -5px rgba(59, 0, 0, 0.3)'
              }}
            >
              <PlayCircle size={24} /> Start Full Digital Mock
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default DigitalCoreTest;
