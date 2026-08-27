import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Target, BookOpen, AlertCircle, Award, History, ChevronRight, Sun, Moon, ArrowRight, BrainCircuit, Activity, Calendar, Compass } from 'lucide-react';
import ExamSidebar from '../components/ExamSidebar';
import { supabase } from '../supabaseClient';

const SUBTEST_MAP = {
  'figure_sequences': 'Figure Sequences',
  'mathematical_equations': 'Mathematical Equations',
  'latin_squares': 'Latin Squares',
  'general_academic': 'General Academic Module'
};

const StatCard = ({ icon: Icon, title, value, delay, highlight }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="premium-card" 
    style={{ 
      padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, 
      background: highlight ? 'var(--surface)' : 'var(--surface)', 
      border: highlight ? '2px solid var(--primary)' : '1px solid var(--border)',
      boxShadow: highlight ? '0 8px 30px rgba(217, 164, 65, 0.1)' : 'var(--shadow-soft)'
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ padding: '12px', background: 'rgba(217, 164, 65, 0.1)', color: 'var(--primary)', borderRadius: '12px' }}>
        <Icon size={24} />
      </div>
    </div>
    <div>
      <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, marginBottom: '4px' }}>{title}</h4>
      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)' }}>{value}</div>
    </div>
  </motion.div>
);

const Dashboard = ({ setCurrentView, session, isDarkMode, setIsDarkMode }) => {
  const [pastTests, setPastTests] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const studentName = session?.user?.user_metadata?.full_name || 'Student';

  useEffect(() => {
    const fetchDashboardData = async () => {
      const studyHistory = JSON.parse(localStorage.getItem('studyActivity') || '[]');

      let mockHistory = [];
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: results } = await supabase
          .from('mock_test_results')
          .select('*, mock_tests(title, section, total_questions)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (results) {
           mockHistory = results.map(r => {
             const totalQ = r.mock_tests?.total_questions || 1;
             return {
               id: r.id,
               type: 'mock',
               examName: r.mock_tests?.title || 'dMAT Mock',
               date: new Date(r.created_at).toLocaleDateString(),
               timestamp: new Date(r.created_at).getTime(),
               score: r.score,
               total: totalQ,
               accuracy: Math.round((r.score / totalQ) * 100),
               section: r.mock_tests?.section
             };
           });
        }
      } else {
        const history = JSON.parse(localStorage.getItem('mockTestHistory') || '[]');
        mockHistory = history.map(h => ({ ...h, type: 'mock', timestamp: new Date(h.date).getTime() }));
      }
      
      setPastTests(mockHistory);
      
      const combined = [...studyHistory, ...mockHistory].sort((a, b) => b.timestamp - a.timestamp);
      setRecentActivity(combined.slice(0, 3));
    };
    
    fetchDashboardData();
  }, []);

  const totalMocks = pastTests.length;
  let avgAccuracy = '--';
  let weakestArea = '--';
  let estimatedPercentile = '--';
  let standardizedScore = '--';
  
  const subtestStats = {
    'figure_sequences': { total: 0, score: 0, attempts: 0 },
    'mathematical_equations': { total: 0, score: 0, attempts: 0 },
    'latin_squares': { total: 0, score: 0, attempts: 0 },
    'general_academic': { total: 0, score: 0, attempts: 0 }
  };

  if (totalMocks > 0) {
    const sumAccuracy = pastTests.reduce((acc, test) => acc + test.accuracy, 0);
    const avgAccVal = sumAccuracy / totalMocks;
    avgAccuracy = `${Math.round(avgAccVal)}%`;
    
    standardizedScore = Math.round((avgAccVal / 100) * 200);
    estimatedPercentile = Math.round(avgAccVal * 0.95);

    pastTests.forEach(test => {
      if (test.sectionScores && test.sectionScores.length === 3) {
        const [fig, math, latin] = test.sectionScores;
        if (fig.total > 0) {
          subtestStats['figure_sequences'].score += fig.score;
          subtestStats['figure_sequences'].total += fig.total;
          subtestStats['figure_sequences'].attempts += 1;
        }
        if (math.total > 0) {
          subtestStats['mathematical_equations'].score += math.score;
          subtestStats['mathematical_equations'].total += math.total;
          subtestStats['mathematical_equations'].attempts += 1;
        }
        if (latin.total > 0) {
          subtestStats['latin_squares'].score += latin.score;
          subtestStats['latin_squares'].total += latin.total;
          subtestStats['latin_squares'].attempts += 1;
        }
      } else if (test.section && subtestStats[test.section]) {
        subtestStats[test.section].score += test.score;
        subtestStats[test.section].total += test.total || 20;
        subtestStats[test.section].attempts += 1;
      }
    });

    if (totalMocks >= 2) {
      let lowestAcc = 101;
      let lowestKey = null;
      Object.keys(subtestStats).forEach(key => {
        const stat = subtestStats[key];
        if (stat.attempts > 0) {
          const acc = (stat.score / stat.total) * 100;
          if (acc < lowestAcc) {
            lowestAcc = acc;
            lowestKey = key;
          }
        }
      });
      if (lowestKey) {
        weakestArea = SUBTEST_MAP[lowestKey];
      } else {
        weakestArea = 'Keep testing';
      }
    } else {
      weakestArea = 'Need 2+ mocks';
    }
  }

  return (
    <div className="view-container" style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      <ExamSidebar setCurrentView={setCurrentView} currentView="Dashboard" />

      <main style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>
                Welcome, {studentName}
              </motion.h1>
              <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                Track your dMAT progress and secure your APS India certification.
              </motion.p>
            </div>
            
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: '12px', borderRadius: '50%', boxShadow: 'var(--shadow-soft)' }}
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </header>

          <div style={{ display: 'flex', gap: '24px', flexDirection: 'column' }}>
            
            {/* 1. Continue Learning & Upcoming Plan */}
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} 
                className="premium-card" 
                style={{ 
                  flex: 2, padding: '32px', position: 'relative', overflow: 'hidden', background: 'var(--surface)',
                  border: '1px solid var(--primary)', boxShadow: '0 8px 30px rgba(217, 164, 65, 0.15)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ padding: '8px', background: 'var(--primary)', color: '#111413', borderRadius: '0' }}>
                    <PlayCircle size={20} />
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Continue Learning</span>
                </div>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)', marginBottom: '12px' }}>
                  Math Equations
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '24px', maxWidth: '600px' }}>
                  Pick up where you left off. Review the core concepts and jump back into the practice sets.
                </p>
                <button className="btn-primary" onClick={() => setCurrentView('StudyCoreMathEquations')} style={{ padding: '12px 24px', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  Resume Topic <ArrowRight size={20} />
                </button>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} 
                className="premium-card" 
                style={{ flex: 1, minWidth: '300px', padding: '32px', background: 'var(--surface)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <Calendar size={24} color="var(--primary)" />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>Upcoming Plan</h3>
                </div>
                <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0', border: '1px dashed var(--border)', borderRadius: '8px' }}>
                  No study plan active. <br/>
                  <span style={{ fontSize: '0.9rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>Create a plan &rarr;</span>
                </div>
              </motion.div>
            </div>

            {/* 2. Performance Snapshot */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={20} color="var(--primary)"/> Performance Snapshot</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                <StatCard icon={Target} title="Est. Percentile" value={estimatedPercentile > 0 ? `${estimatedPercentile}th` : '--'} delay={0.3} highlight={true} />
                <StatCard icon={Award} title="Std. Score (0-200)" value={standardizedScore} delay={0.4} />
                <StatCard icon={Activity} title="Avg Accuracy" value={avgAccuracy} delay={0.5} />
                <StatCard icon={AlertCircle} title="Weakest Area" value={weakestArea} delay={0.6} />
              </div>
            </div>

            {/* 3. Quick Access / Recommended Next Practice */}
            <div>
               <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Compass size={20} color="var(--primary)"/> Recommended Next Practice</h3>
               <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <motion.button 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                    className="premium-card" 
                    onClick={() => setCurrentView('MockTestsCore')}
                    style={{ flex: 1, padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    <BrainCircuit size={32} color="var(--primary)" />
                    <span style={{ fontWeight: 600, color: 'var(--text)', fontSize: '1.1rem' }}>Core Module Mock</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Figure Sequences, Math, Latin Squares</span>
                  </motion.button>

                  <motion.button 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                    className="premium-card" 
                    onClick={() => setCurrentView('MockTestsSubject')}
                    style={{ flex: 1, padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    <BookOpen size={32} color="var(--primary)" />
                    <span style={{ fontWeight: 600, color: 'var(--text)', fontSize: '1.1rem' }}>Subject Module Mock</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Passage-based Analysis</span>
                  </motion.button>
                </div>
            </div>

            {/* 4. Recent Mock Tests */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="premium-card" style={{ padding: '32px', background: 'var(--surface)', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <History size={24} color="var(--primary)" />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>Recent Mock Tests</h3>
                </div>
                {totalMocks > 3 && (
                  <button onClick={() => setCurrentView('Analytics')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    View Analytics <ChevronRight size={16} />
                  </button>
                )}
              </div>
              
              {totalMocks === 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', padding: '20px 0', textAlign: 'center' }}>
                  No recent mock tests found. Start your first mock to see analytics.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {recentActivity.map((activity, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '16px', borderBottom: idx < recentActivity.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <div style={{ padding: '10px', background: 'rgba(217, 164, 65, 0.1)', borderRadius: '0', color: 'var(--primary)' }}>
                        <Award size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>{activity.examName}</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{activity.date}</span>
                          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)' }}>
                            {`${activity.accuracy}% Accuracy`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
