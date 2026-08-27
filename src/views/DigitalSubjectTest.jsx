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
            <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '16px', letterSpacing: '-1px' }}>General Academic Module</h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
              Practice applying reasoning to academic material across Math, Science, Engineering, and Business domains.
            </p>
          </header>

          {/* Info Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '48px' }}>
            {[
              { label: 'Format', value: 'Passage-based', icon: <Monitor size={20} /> },
              { label: 'Scope', value: 'All Disciplines', icon: <BookOpen size={20} /> },
              { label: 'Time', value: '~90 Minutes', icon: <Clock size={20} /> },
              { label: 'Audience', value: 'APS India', icon: <AlertCircle size={20} /> },
            ].map((stat, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="premium-card" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--accent)', marginBottom: '12px' }}>{stat.icon}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>{stat.value}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase' }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
          

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>Select Practice Set</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '56px' }}>
            {[
              { id: 'general_academic_1', name: 'General Academic Practice Test 1', tag: 'Recommended' },
              { id: 'general_academic_2', name: 'General Academic Practice Test 2', tag: '' },
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
                    {module.tag && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(217, 164, 65, 0.1)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                        <Zap size={12} fill="var(--primary)" /> {module.tag}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Contains passage-based questions testing data interpretation and logical reasoning.
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
