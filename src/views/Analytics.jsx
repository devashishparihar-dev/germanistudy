import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Target, Award, ArrowUpRight } from 'lucide-react';
import ExamSidebar from '../components/ExamSidebar';

const SECTION_TITLES = ['Quantitative Problems', 'Relationships', 'Completing Patterns', 'Numerical Series'];

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

  return (
    <div className="view-container" style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      <ExamSidebar setCurrentView={setCurrentView} />

      <main style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text)' }}>Performance Analytics</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Detailed breakdown of your TestAS preparation metrics.</p>
          </div>

          {!hasData ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="premium-card" style={{ padding: '64px 32px', textAlign: 'center', background: 'var(--surface)' }}>
              <div style={{ width: '80px', height: '80px', background: 'rgba(255, 212, 130, 0.1)', color: 'var(--primary)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Target size={40} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text)', marginBottom: '16px' }}>No Data Available Yet</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 32px' }}>Complete your first TestAS Mock Test to unlock detailed performance analytics, accuracy breakdowns, and subject competency profiles.</p>
              <button className="btn-primary" onClick={() => setCurrentView('digital-core-test')} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', fontSize: '1.1rem' }}>
                Take TestAS Mock <ArrowUpRight size={18} />
              </button>
            </motion.div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              {/* Top Overview Cards */}
              <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                <div className="premium-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'rgba(26, 86, 219, 0.1)', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Award size={32} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Overall Score</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {testData?.score} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {testData?.totalQuestions}</span>
                    </div>
                  </div>
                </div>

                <div className="premium-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Target size={32} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Accuracy</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {testData?.totalQuestions ? Math.round((testData.score / testData.totalQuestions) * 100) : 0}%
                    </div>
                  </div>
                </div>

                <div className="premium-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp size={32} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Percentile Est.</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {(() => {
                        if (!testData?.totalQuestions) return 'N/A';
                        const acc = (testData.score / testData.totalQuestions) * 100;
                        if (acc >= 90) return 'Top 5%';
                        if (acc >= 80) return 'Top 15%';
                        if (acc >= 70) return 'Top 30%';
                        if (acc >= 60) return 'Top 50%';
                        return 'Below Avg';
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Breakdown */}
              <div className="premium-card" style={{ padding: '32px' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '24px' }}>Section Breakdown</h3>
                <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                  {testData?.sectionScores?.map((sec, idx) => {
                    const percentage = sec.total > 0 ? (sec.score / sec.total) * 100 : 0;
                    return (
                      <div key={idx} style={{ background: 'var(--bg-main)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{SECTION_TITLES[idx]}</div>
                          <div style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{sec.score}/{sec.total}</div>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${percentage}%`, height: '100%', background: 'var(--primary-color)', borderRadius: '4px' }}></div>
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
