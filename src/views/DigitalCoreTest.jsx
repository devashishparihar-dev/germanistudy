import React, { useState, useEffect } from 'react';
import { PlayCircle, Target, Clock, BookOpen, AlertCircle, ChevronRight, Monitor, Database, CheckCircle, RotateCcw } from 'lucide-react';
import ExamSidebar from '../components/ExamSidebar';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import ErrorBoundary from '../components/ErrorBoundary';
import { trackEvent } from '../utils/analytics';

const DigitalCoreTest = ({ setCurrentView }) => {
  const [mockTests, setMockTests] = useState([]);
  const [completedMocks, setCompletedMocks] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMockTests = async () => {
      try {
        const { data, error } = await supabase
          .from('mock_tests')
          .select('id, title, total_questions, duration');
        
        if (data) {
          setMockTests(data);
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: resultsData } = await supabase
            .from('mock_test_results')
            .select('mock_test_id, score')
            .eq('user_id', user.id);
            
          if (resultsData) {
            const resultsMap = {};
            resultsData.forEach(r => {
               if (!resultsMap[r.mock_test_id] || resultsMap[r.mock_test_id].score < r.score) {
                 resultsMap[r.mock_test_id] = r;
               }
            });
            setCompletedMocks(resultsMap);
          }
        }
      } catch (err) {
        console.error("Error fetching mock tests:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMockTests();
  }, []);

  const startModule = (moduleId) => {
    localStorage.setItem('selectedDigitalModule', moduleId);
    trackEvent('mock_started', { type: 'subtest', moduleId });
    setCurrentView('DigitalSimulator');
  };

  const startFullTest = () => {
    localStorage.removeItem('selectedDigitalModule');
    trackEvent('mock_started', { type: 'full_core' });
    setCurrentView('DigitalSimulator');
  };

  const startCustomMock = (testId) => {
    localStorage.setItem('selectedDigitalModule', testId);
    trackEvent('mock_started', { type: 'custom_mock', testId });
    setCurrentView('DigitalSimulator');
  };

  return (
    <ErrorBoundary>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
        <ExamSidebar setCurrentView={setCurrentView} />
      
      <main style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          <header style={{ textAlign: 'center', marginBottom: '56px', marginTop: '32px' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '16px', letterSpacing: '-1px' }}>Digital TestAS Core Module</h1>

          </header>

          {/* Info Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '48px' }}>
            {[
              { label: 'Format', value: 'Digital', icon: <Monitor size={20} /> },
              { label: 'Questions', value: '15', icon: <Target size={20} /> },
              { label: 'Time', value: '20 Minutes', icon: <Clock size={20} /> },
              { label: 'Language', value: 'English', icon: <AlertCircle size={20} /> },
            ].map((stat, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="premium-card" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--accent)', marginBottom: '12px' }}>{stat.icon}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>{stat.value}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase' }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Custom / Imported Mock Tests Section */}
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>Available Mock Tests</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '48px' }}>
            {loading ? (
              <div style={{ color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', marginBottom: '16px' }}
                />
                <div>Loading mock tests...</div>
              </div>
            ) : mockTests.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px', border: '1px dashed var(--border)', borderRadius: '12px' }}>
                No custom mock tests uploaded yet. Use the Admin Panel to import one.
              </div>
            ) : (
              mockTests.map((mock, idx) => {
                const totalQs = mock.total_questions || 0;
                const result = completedMocks[mock.id];
                const isCompleted = !!result;
                const displayDuration = totalQs <= 15 ? 20 : (mock.duration || 75);
                
                return (
                  <button 
                    key={idx} 
                    onClick={() => startCustomMock(mock.id)}
                    className="premium-card module-card" 
                    style={{ 
                      padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                      border: `1px solid ${isCompleted ? 'var(--success)' : 'var(--border)'}`, cursor: 'pointer', background: 'var(--card-bg)',
                      transition: 'all 0.2s', textAlign: 'left', outline: 'none'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.borderColor = isCompleted ? 'var(--success)' : 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isCompleted ? <CheckCircle size={18} style={{ color: 'var(--success)' }} /> : <Database size={18} style={{ color: 'var(--primary)' }} />}
                        {mock.title}
                      </h3>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        <span>{totalQs} Questions</span>
                        <span>•</span>
                        <span>{displayDuration} Minutes</span>
                        {isCompleted && (
                          <>
                            <span>•</span>
                            <span style={{ color: 'var(--success)', fontWeight: '600' }}>Score: {result.score}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ 
                        background: isCompleted ? 'rgba(16, 185, 129, 0.1)' : 'rgba(37, 99, 235, 0.1)', 
                        color: isCompleted ? 'var(--success)' : 'var(--primary)', 
                        padding: '6px 12px', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 600,
                        display: 'flex', alignItems: 'center', gap: '6px'
                      }}>
                        {isCompleted ? <><RotateCcw size={14} /> Reattempt</> : 'Start Test'}
                      </div>
                      <ChevronRight size={20} color={isCompleted ? "var(--success)" : "var(--primary)"} />
                    </div>
                  </button>
                );
              })
            )}
          </div>





        </div>
      </main>
    </div>
    </ErrorBoundary>
  );
};

export default DigitalCoreTest;
