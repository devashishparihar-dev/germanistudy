import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PlayCircle, Target, Clock, ArrowRight, BookOpen, AlertCircle, BarChart3, History, ChevronDown, CheckCircle, TrendingUp, Award, Zap, Sun, Moon } from 'lucide-react';
import ExamSidebar from '../components/ExamSidebar';

const mockChartData = [
  { name: 'Mock 1', score: 55, date: 'Jun 10' },
  { name: 'Mock 2', score: 62, date: 'Jun 15' },
  { name: 'Mock 3', score: 68, date: 'Jun 22' },
  { name: 'Mock 4', score: 75, date: 'Jun 28' },
  { name: 'Mock 5', score: 82, date: 'Jul 02' },
];

const mockRecentActivity = [
  { id: 1, type: 'Exam', title: 'TestAS Baseline Mock', score: '82%', date: '2 days ago', status: 'completed' },
  { id: 2, type: 'Practice', title: 'Quantitative Problems', score: '18/22', date: '4 days ago', status: 'completed' },
  { id: 3, type: 'Exam', title: 'Cognitive Abilities Mini-Mock', score: '75%', date: '1 week ago', status: 'completed' },
];

const StatCard = ({ icon: Icon, title, value, trend, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="premium-card" 
    style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ padding: '12px', background: 'rgba(242, 175, 0, 0.1)', color: 'var(--primary)', borderRadius: '12px' }}>
        <Icon size={24} />
      </div>
      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600, background: 'rgba(16, 185, 129, 0.1)', padding: '4px 8px', borderRadius: '12px' }}>
          <TrendingUp size={14} /> {trend}
        </div>
      )}
    </div>
    <div>
      <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, marginBottom: '4px' }}>{title}</h4>
      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)' }}>{value}</div>
    </div>
  </motion.div>
);

const Dashboard = ({ setCurrentView, session, isDarkMode, setIsDarkMode }) => {
  const [selectedExam, setSelectedExam] = useState('TestAS');
  const [showExamDropdown, setShowExamDropdown] = useState(false);
  
  const studentName = session?.user?.user_metadata?.full_name || 'Student';

  return (
    <div className="view-container" style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      <ExamSidebar setCurrentView={setCurrentView} />

      <main style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <div>
              <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>
                Welcome back, {studentName}
              </motion.h1>
              <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                Your {selectedExam} preparation is looking strong today.
              </motion.p>
            </div>
            
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: '12px', borderRadius: '50%', boxShadow: 'var(--shadow-soft)' }}
                title="Toggle Dark Mode"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button 
                onClick={() => setShowExamDropdown(!showExamDropdown)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px', borderRadius: '12px', 
                  border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)',
                  fontWeight: 600, cursor: 'pointer', boxShadow: 'var(--shadow-soft)'
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Selected Exam</span>
                  <span style={{ fontSize: '1.1rem' }}>{selectedExam}</span>
                </div>
                <ChevronDown size={20} color="var(--text-muted)" style={{ transform: showExamDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
              </button>

              {/* Dropdown Menu */}
              {showExamDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ 
                    position: 'absolute', top: '100%', right: 0, marginTop: '8px',
                    background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)', overflow: 'hidden', zIndex: 50,
                    width: '100%', minWidth: '220px'
                  }}
                >
                  {['TestAS', 'DMAT', 'TestDaF', 'Goethe-Zertifikat'].map((exam) => (
                    <button
                      key={exam}
                      onClick={() => { setSelectedExam(exam); setShowExamDropdown(false); }}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left', padding: '12px 24px',
                        background: selectedExam === exam ? 'rgba(242, 175, 0, 0.1)' : 'transparent',
                        border: 'none', color: selectedExam === exam ? 'var(--primary)' : 'var(--text)',
                        fontWeight: selectedExam === exam ? 600 : 500, cursor: 'pointer', transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => { if(selectedExam !== exam) e.currentTarget.style.background = 'var(--border)'; }}
                      onMouseLeave={(e) => { if(selectedExam !== exam) e.currentTarget.style.background = 'transparent'; }}
                    >
                      {exam}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </header>

          {selectedExam === 'TestAS' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              {/* Stats Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
                <StatCard icon={Target} title="Average Score" value="78%" trend="+5%" delay={0.1} />
                <StatCard icon={BookOpen} title="Mocks Completed" value="5" delay={0.2} />
                <StatCard icon={Clock} title="Study Time" value="14h 30m" delay={0.3} />
                <StatCard icon={Zap} title="Current Streak" value="4 Days" delay={0.4} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                
                {/* Chart Section */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="premium-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text)' }}>Performance Trend</h3>
                    <button onClick={() => setCurrentView('Analytics')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Full Report <ArrowRight size={16} />
                    </button>
                  </div>
                  
                  <div style={{ flex: 1, minHeight: '300px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dx={-10} domain={[40, 100]} />
                        <Tooltip 
                          contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', boxShadow: 'var(--shadow-soft)' }}
                          itemStyle={{ color: 'var(--primary)', fontWeight: 600 }}
                        />
                        <Area type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" activeDot={{ r: 6, fill: 'var(--primary)', stroke: 'var(--surface)', strokeWidth: 2 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* Next Action & Activity Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Action Banner */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="premium-card" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-50%', right: '-50%', width: '100%', height: '200%', background: 'radial-gradient(circle, rgba(242, 175, 0, 0.15) 0%, transparent 60%)', zIndex: 0 }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ padding: '8px', background: 'var(--primary)', color: '#13151A', borderRadius: '8px' }}>
                          <PlayCircle size={20} />
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.85rem' }}>Next Up</span>
                      </div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px', lineHeight: 1.2 }}>Take Mock Exam 6</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px' }}>You're on track! Take your next baseline mock to calibrate your progress.</p>
                      <button className="btn-primary" style={{ width: '100%' }} onClick={() => setCurrentView('Core Test')}>
                        Start Exam
                      </button>
                    </div>
                  </motion.div>

                  {/* Recent Activity */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="premium-card" style={{ padding: '24px', flex: 1 }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)', marginBottom: '20px' }}>Recent Activity</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {mockRecentActivity.map(activity => (
                        <div key={activity.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                          <div style={{ padding: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', color: 'var(--text-muted)' }}>
                            {activity.type === 'Exam' ? <Award size={18} /> : <BookOpen size={18} />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>{activity.title}</h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{activity.date}</span>
                              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>{activity.score}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button style={{ width: '100%', padding: '12px 0 0 0', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
                      View History <ChevronDown size={16} />
                    </button>
                  </motion.div>

                </div>
              </div>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="premium-card" style={{ padding: '64px', textAlign: 'center', background: 'var(--surface)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '32px', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--text-muted)' }}>
                <AlertCircle size={32} />
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '16px' }}>{selectedExam} Modules</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 32px' }}>
                We are currently prioritizing the TestAS module. Preparation materials for {selectedExam} will be available soon.
              </p>
              <button className="btn-secondary" style={{ padding: '12px 24px' }}>Notify Me When Available</button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
