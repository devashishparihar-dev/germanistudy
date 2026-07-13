import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History, Calendar, Clock, Target, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import ExamSidebar from '../components/ExamSidebar';
import { supabase } from '../supabaseClient';

const MockHistory = ({ setCurrentView }) => {
  const [pastTests, setPastTests] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: results, error } = await supabase
        .from('mock_test_results')
        .select('*, mock_tests(title, duration, total_questions)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (results) {
        const formattedHistory = results.map(r => {
           const totalQ = r.mock_tests?.total_questions || 1; // avoid division by zero
           return {
             id: r.id,
             examName: r.mock_tests?.title || 'Mock Test',
             date: new Date(r.created_at).toLocaleDateString(),
             timeTaken: r.mock_tests?.duration ? `${r.mock_tests.duration} Minutes` : 'Standard Time',
             score: r.score,
             totalQuestions: r.mock_tests?.total_questions || '?',
             accuracy: Math.round((r.score / totalQ) * 100),
             status: 'Completed'
           };
        });
        setPastTests(formattedHistory);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="view-container" style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      <ExamSidebar setCurrentView={setCurrentView} />

      <main style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>Mock History</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Review your past mock exams and track your progress over time.</p>
          </div>

          {pastTests.length === 0 ? (
            <div className="premium-card" style={{ padding: '64px 32px', textAlign: 'center', background: 'var(--surface)' }}>
              <History size={64} style={{ color: 'var(--border)', margin: '0 auto 24px' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text)', marginBottom: '16px' }}>No Mock Tests Taken Yet</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>When you complete a mock test, your results and analytics will appear here.</p>
              <button className="btn-primary" onClick={() => setCurrentView('digital-core-test')}>Start a Mock Test</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {pastTests.map((test, idx) => (
                <motion.div 
                  key={test.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="premium-card"
                  style={{ 
                    padding: '32px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    background: 'var(--surface)',
                    flexWrap: 'wrap',
                    gap: '24px'
                  }}
                >
                  {/* Left Section: Icon & Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: '1 1 300px' }}>
                    <div style={{ 
                      width: '64px', 
                      height: '64px', 
                      borderRadius: '16px', 
                      background: test.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                      color: test.status === 'Completed' ? 'var(--success)' : 'var(--error)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {test.status === 'Completed' ? <CheckCircle size={32} /> : <XCircle size={32} />}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>{test.examName}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={16} /> {test.date}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16} /> {test.timeTaken}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Section: Stats */}
                  {test.status === 'Completed' && (
                    <div style={{ display: 'flex', gap: '32px', flex: '0 1 auto' }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Score</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)' }}>
                          {test.score} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ {test.totalQuestions}</span>
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Accuracy</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)' }}>
                          {test.accuracy}%
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Right Section: Action */}
                  <div style={{ flex: '0 0 auto' }}>
                    <button 
                      onClick={() => {
                        localStorage.setItem('lastTestResult', JSON.stringify(test));
                        setCurrentView('Analytics');
                      }}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        padding: '12px 24px', 
                        background: test.status === 'Completed' ? 'rgba(255, 212, 130, 0.1)' : 'transparent', 
                        color: test.status === 'Completed' ? 'var(--primary)' : 'var(--text-muted)',
                        border: test.status === 'Completed' ? 'none' : '1px solid var(--border)',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (test.status === 'Completed') {
                          e.currentTarget.style.background = 'rgba(255, 212, 130, 0.2)';
                        } else {
                          e.currentTarget.style.background = 'var(--bg-main)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (test.status === 'Completed') {
                          e.currentTarget.style.background = 'rgba(255, 212, 130, 0.1)';
                        } else {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      {test.status === 'Completed' ? 'View Details' : 'Status: ' + test.status}
                      {test.status === 'Completed' && <ArrowRight size={18} />}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MockHistory;
