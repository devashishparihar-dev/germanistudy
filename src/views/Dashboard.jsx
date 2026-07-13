import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Target, BookOpen, AlertCircle, Award, History, ChevronRight, BarChart3, Sun, Moon, ArrowRight } from 'lucide-react';
import ExamSidebar from '../components/ExamSidebar';

const SUBTEST_MAP = {
  'figure_sequences': 'Completing Patterns',
  'mathematical_equations': 'Quantitative Problems',
  'latin_squares': 'Relationships'
};

const StatCard = ({ icon: Icon, title, value, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="premium-card" 
    style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, background: 'var(--surface)', border: '1px solid var(--border)' }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ padding: '12px', background: 'rgba(242, 175, 0, 0.1)', color: 'var(--primary)', borderRadius: '12px' }}>
        <Icon size={24} />
      </div>
    </div>
    <div>
      <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, marginBottom: '4px' }}>{title}</h4>
      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)' }}>{value}</div>
    </div>
  </motion.div>
);

const SubtestProgress = ({ title, percentage, notAttempted, delay }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontWeight: 600, color: 'var(--text)', fontSize: '1rem' }}>{title}</span>
      <span style={{ fontWeight: 700, color: notAttempted ? 'var(--text-muted)' : 'var(--primary)' }}>
        {notAttempted ? 'Not attempted' : `${Math.round(percentage)}%`}
      </span>
    </div>
    <div style={{ width: '100%', height: '12px', background: 'var(--bg-main)', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border)' }}>
      {!notAttempted && (
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: delay + 0.2, ease: "easeOut" }}
          style={{ height: '100%', background: 'var(--primary)', borderRadius: '6px' }}
        />
      )}
    </div>
  </motion.div>
);

const Dashboard = ({ setCurrentView, session, isDarkMode, setIsDarkMode }) => {
  const [pastTests, setPastTests] = useState([]);
  const studentName = session?.user?.user_metadata?.full_name || 'Student';

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('mockTestHistory') || '[]');
    setPastTests(history);
  }, []);

  const totalMocks = pastTests.length;
  let avgScore = '--';
  let weakestArea = '--';
  
  const subtestStats = {
    'figure_sequences': { total: 0, score: 0, attempts: 0 },
    'mathematical_equations': { total: 0, score: 0, attempts: 0 },
    'latin_squares': { total: 0, score: 0, attempts: 0 }
  };

  if (totalMocks > 0) {
    const sumAccuracy = pastTests.reduce((acc, test) => acc + test.accuracy, 0);
    avgScore = `${Math.round(sumAccuracy / totalMocks)}%`;

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

  let nextSubtestId = null;
  const subtestOrder = ['figure_sequences', 'mathematical_equations', 'latin_squares'];
  
  if (totalMocks > 0) {
    for (const key of subtestOrder) {
      if (subtestStats[key].attempts === 0) {
        nextSubtestId = key;
        break;
      }
    }
    
    if (!nextSubtestId && weakestArea !== 'Keep testing' && weakestArea !== 'Need 2+ mocks') {
      const weakKey = Object.keys(SUBTEST_MAP).find(k => SUBTEST_MAP[k] === weakestArea);
      if (weakKey) nextSubtestId = weakKey;
    }
  }

  const handleNextAction = () => {
    if (totalMocks === 0) {
      localStorage.removeItem('selectedDigitalModule');
      setCurrentView('DigitalSimulator');
    } else {
      if (nextSubtestId) {
        localStorage.setItem('selectedDigitalModule', nextSubtestId);
        setCurrentView('DigitalSimulator');
      } else {
        localStorage.removeItem('selectedDigitalModule');
        setCurrentView('DigitalSimulator');
      }
    }
  };

  const recentActivity = pastTests.slice(0, 3);

  return (
    <div className="view-container" style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      <ExamSidebar setCurrentView={setCurrentView} />

      <main style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>
                Welcome, {studentName}
              </motion.h1>
              <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                Track your progress and continue your preparation.
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

          {/* Primary CTA Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} 
            className="premium-card" 
            style={{ 
              padding: '40px', 
              position: 'relative', 
              overflow: 'hidden',
              background: 'var(--surface)',
              border: '1px solid var(--primary)',
              boxShadow: '0 8px 30px rgba(30, 58, 95, 0.15)'
            }}
          >
            <div style={{ position: 'absolute', top: '-50%', right: '-20%', width: '100%', height: '200%', background: 'radial-gradient(circle, rgba(217, 164, 65, 0.15) 0%, transparent 50%)', zIndex: 0 }} />
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ padding: '8px', background: 'var(--primary)', color: '#FFFFFF', borderRadius: '0' }}>
                  <PlayCircle size={20} />
                </div>
                <span style={{ fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem', fontFamily: 'var(--font-heading)' }}>Next Action</span>
              </div>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '12px', lineHeight: 1.1, fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {totalMocks === 0 ? 'Start your first mock exam' : 
                 (nextSubtestId ? `Resume: ${SUBTEST_MAP[nextSubtestId]}` : 'Take your next mock exam')}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '24px', maxWidth: '600px' }}>
                {totalMocks === 0 
                  ? 'Calibrate your baseline and get detailed performance analytics.'
                  : (nextSubtestId 
                      ? 'Continue your preparation with your next incomplete subtest or weakest area.'
                      : 'Keep the momentum going. Take your next mock to track your improvement.')}
              </p>
              <button className="btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }} onClick={handleNextAction}>
                {totalMocks === 0 ? 'Start First Mock' : 'Continue Preparation'} <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            <StatCard icon={BookOpen} title="Mocks Completed" value={totalMocks > 0 ? totalMocks : '--'} delay={0.3} />
            <StatCard icon={Target} title="Average Score" value={avgScore} delay={0.4} />
            <StatCard icon={AlertCircle} title="Weakest Area" value={weakestArea} delay={0.5} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
            {/* Subtest Breakdown */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} 
              className="premium-card" 
              style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', background: 'var(--surface)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <BarChart3 size={24} color="var(--primary)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>Subtest Progress</h3>
              </div>
              
              {totalMocks === 0 ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', padding: '40px 0', textAlign: 'center' }}>
                  Complete your first mock to see your subtest breakdown.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {Object.keys(SUBTEST_MAP).map((key, idx) => {
                    const stat = subtestStats[key];
                    const hasAttempt = stat.attempts > 0;
                    const percent = hasAttempt ? (stat.score / stat.total) * 100 : 0;
                    return (
                      <SubtestProgress 
                        key={key} 
                        title={SUBTEST_MAP[key]} 
                        percentage={percent} 
                        notAttempted={!hasAttempt} 
                        delay={0.7 + (idx * 0.1)} 
                      />
                    );
                  })}
                </div>
              )}
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              {/* Start Mock Buttons */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} style={{ display: 'flex', gap: '16px' }}>
                <button 
                  className="premium-card" 
                  onClick={() => setCurrentView('digital-core-test')}
                  style={{ flex: 1, padding: '20px', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <Target size={32} color="var(--primary)" />
                  <span style={{ fontWeight: 600, color: 'var(--text)' }}>Core Mock</span>
                </button>
                <button 
                  className="premium-card" 
                  onClick={() => setCurrentView('Practice')}
                  style={{ flex: 1, padding: '20px', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <BookOpen size={32} color="var(--primary)" />
                  <span style={{ fontWeight: 600, color: 'var(--text)' }}>Topic Practice</span>
                </button>
              </motion.div>

              {/* Recent Activity */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="premium-card" style={{ padding: '32px', background: 'var(--surface)', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <History size={24} color="var(--primary)" />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>Recent Activity</h3>
                  </div>
                  {totalMocks > 3 && (
                    <button onClick={() => setCurrentView('History')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      See all <ChevronRight size={16} />
                    </button>
                  )}
                </div>
                
                {totalMocks === 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', padding: '20px 0', textAlign: 'center' }}>
                    No recent activity.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {recentActivity.map((activity, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '16px', borderBottom: idx < recentActivity.length - 1 ? '1px solid var(--border)' : 'none' }}>
                        <div style={{ padding: '10px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', color: 'var(--text-muted)' }}>
                          <Award size={20} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>{activity.examName}</h4>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{activity.date}</span>
                            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)' }}>{activity.accuracy}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
