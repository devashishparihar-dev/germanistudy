import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Target, Award, ArrowUpRight } from 'lucide-react';
import ExamSidebar from '../components/ExamSidebar';

const SECTION_TITLES = ['Figure Sequences', 'Mathematical Equations', 'Latin Squares', 'General Academic'];

const Analytics = ({ setCurrentView }) => {
  const [testData, setTestData] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('lastTestResult');
    if (saved) {
      try {
        setTestData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse test result");
      }
    }
  }, []);

  const hasData = !!testData;

  const calculatePercentile = (accuracy) => {
    // Mock percentile logic based on accuracy
    if (accuracy >= 90) return '99th';
    if (accuracy >= 80) return '90th';
    if (accuracy >= 70) return '75th';
    if (accuracy >= 60) return '50th';
    return '<50th';
  };

  const calculateStandardizedScore = (accuracy) => {
    // dMAT Standardized Score 0-200
    return Math.round((accuracy / 100) * 200);
  };

  return (
    <div className="view-container" style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      <ExamSidebar setCurrentView={setCurrentView} />

      <main style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text)' }}>Performance Analytics</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Detailed breakdown of your dMAT preparation metrics.</p>
          </div>

          {!hasData ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="premium-card" style={{ padding: '64px 32px', textAlign: 'center', background: 'var(--surface)' }}>
              <div style={{ width: '80px', height: '80px', background: 'rgba(217, 164, 65, 0.1)', color: 'var(--primary)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Target size={40} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text)', marginBottom: '16px' }}>No Data Available Yet</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 32px' }}>Complete your first dMAT Mock Test to unlock detailed performance analytics, standardized scores, and your estimated percentile rank.</p>
            </motion.div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              {/* Top Overview Cards */}
              <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                <div className="premium-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', border: '2px solid var(--primary)', background: 'var(--surface)' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'rgba(217, 164, 65, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp size={32} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Percentile</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)' }}>
                      {testData?.totalQuestions ? calculatePercentile((testData.score / testData.totalQuestions) * 100) : 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="premium-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', background: 'var(--surface)' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'rgba(47, 93, 138, 0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Award size={32} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Std. Score</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)' }}>
                      {testData?.totalQuestions ? calculateStandardizedScore((testData.score / testData.totalQuestions) * 100) : 0} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 200</span>
                    </div>
                  </div>
                </div>

                <div className="premium-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', background: 'var(--surface)' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'rgba(122, 139, 111, 0.1)', color: 'var(--sage)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Target size={32} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Accuracy</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)' }}>
                      {testData?.totalQuestions ? Math.round((testData.score / testData.totalQuestions) * 100) : 0}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Breakdown */}
              <div className="premium-card" style={{ padding: '32px', background: 'var(--surface)' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '24px' }}>Subtest Breakdown</h3>
                <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                  {testData?.sectionScores?.map((sec, idx) => {
                    const percentage = sec.total > 0 ? (sec.score / sec.total) * 100 : 0;
                    return (
                      <div key={idx} style={{ background: 'var(--background)', padding: '20px', borderRadius: '0', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text)' }}>{SECTION_TITLES[idx]}</div>
                          <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{sec.score}/{sec.total}</div>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${percentage}%`, height: '100%', background: 'var(--primary)', borderRadius: '4px' }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Analytics;
