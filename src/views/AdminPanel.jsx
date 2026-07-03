import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, BookOpen, BarChart3, DollarSign, Activity, Search, Filter, Download, Plus, LayoutDashboard, Settings } from 'lucide-react';
import QuestionCard from '../components/QuestionCard';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('questions');

  // Existing Question Manager State
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [category, setCategory] = useState('Quantitative Problems');
  const [difficulty, setDifficulty] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handlePublish = () => {
    setSuccessMessage("Content successfully published to database!");
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const previewQuestion = {
    id: 999,
    text: questionText || 'Preview Question Text...',
    options: options.map((opt, i) => opt || `Option ${String.fromCharCode(65 + i)}`),
    correctAnswer: parseInt(correctAnswer, 10)
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'students', label: 'Students', icon: <Users size={20} /> },
    { id: 'questions', label: 'Question Bank', icon: <BookOpen size={20} /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 size={20} /> },
    { id: 'revenue', label: 'Revenue', icon: <DollarSign size={20} /> },
    { id: 'health', label: 'System Health', icon: <Activity size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', paddingTop: '70px', backgroundColor: 'var(--bg-light)' }}>
      {/* Admin Sidebar */}
      <div style={{ width: '260px', backgroundColor: 'var(--card-bg)', borderRight: '1px solid var(--border-color)', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', paddingLeft: '12px' }}>Admin Workspace</div>
        {sidebarItems.map(item => (
          <button 
            key={item.id} 
            onClick={() => setActiveTab(item.id)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', width: '100%',
              backgroundColor: activeTab === item.id ? 'var(--bg-light)' : 'transparent',
              color: activeTab === item.id ? 'var(--primary-color)' : 'var(--text-muted)',
              border: 'none', borderRadius: '8px', cursor: 'pointer',
              fontWeight: activeTab === item.id ? 600 : 500, transition: 'all 0.2s', textAlign: 'left'
            }}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </div>

      {/* Main Admin Content */}
      <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>{sidebarItems.find(i => i.id === activeTab)?.label}</h2>
            <p style={{ color: 'var(--text-muted)' }}>Manage platform settings and content.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="text" placeholder="Search everywhere..." style={{ padding: '10px 16px 10px 40px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-main)', width: '250px' }} />
            </div>
            <button className="btn-secondary-premium" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px' }}><Filter size={18} /> Filters</button>
            <button className="btn-secondary-premium" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px' }}><Download size={18} /> Export</button>
          </div>
        </div>

        {activeTab === 'questions' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="admin-grid-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            
            <div className="premium-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>Create New Question</h3>
                {successMessage && <span style={{ color: 'var(--success)', fontSize: '0.9rem', fontWeight: 500 }}>{successMessage}</span>}
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Question Text</label>
                <textarea 
                  rows="4" value={questionText} onChange={(e) => setQuestionText(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-light)', color: 'var(--text-main)', resize: 'vertical' }}
                  placeholder="Enter question text here..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {options.map((opt, i) => (
                  <div key={i}>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Option {String.fromCharCode(65 + i)}</label>
                    <input 
                      type="text" value={opt} onChange={(e) => handleOptionChange(i, e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-light)', color: 'var(--text-main)' }}
                      placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    />
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Correct Answer</label>
                  <select value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-light)', color: 'var(--text-main)' }}>
                    {options.map((_, i) => <option value={i} key={i}>Option {String.fromCharCode(65 + i)}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-light)', color: 'var(--text-main)' }}>
                    <option value="Quantitative Problems">Quantitative</option>
                    <option value="Completing Patterns">Patterns</option>
                    <option value="Language">Language</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Difficulty (1-5)</label>
                  <input type="number" min="1" max="5" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-light)', color: 'var(--text-main)' }} />
                </div>
              </div>

              <button className="btn-premium" onClick={handlePublish} style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} /> Add Question to Bank
              </button>
            </div>

            <div className="premium-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '24px' }}>Live Preview</h3>
              <div style={{ flex: 1, border: '1px dashed var(--border-color)', borderRadius: '12px', overflow: 'hidden', padding: '16px', background: 'var(--bg-light)' }}>
                <QuestionCard 
                  question={previewQuestion} currentQuestionIndex={0} totalQuestions={1}
                  userAnswer={parseInt(correctAnswer, 10)} onAnswerChange={() => {}}
                  scratchpadNote={""} onScratchpadChange={() => {}}
                  onPrev={() => {}} onNext={() => {}} testEnded={false}
                />
              </div>
            </div>

          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="premium-card" style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ display: 'inline-flex', padding: '24px', borderRadius: '50%', background: 'var(--bg-light)', marginBottom: '24px' }}>
              {sidebarItems.find(i => i.id === activeTab)?.icon}
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>Module Under Construction</h3>
            <p>The {sidebarItems.find(i => i.id === activeTab)?.label} dashboard is currently being integrated with the backend.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

