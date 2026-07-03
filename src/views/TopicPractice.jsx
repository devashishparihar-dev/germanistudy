import React from 'react';
import { PlayCircle, BrainCircuit } from 'lucide-react';
import ExamSidebar from '../components/ExamSidebar';
import { motion } from 'framer-motion';

const TopicPractice = ({ setCurrentView }) => {
  const topics = [
    { title: "Quantitative Reasoning", desc: "Drill mathematical problem solving and data interpretation." },
    { title: "Inferring Relationships", desc: "Practice logical deductions and identifying hidden patterns." },
    { title: "Completing Patterns", desc: "Train your spatial reasoning and visual sequence completion." },
    { title: "Numerical Series", desc: "Enhance your ability to quickly recognize numerical trends." }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      <ExamSidebar setCurrentView={setCurrentView} />
      
      <main style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <header style={{ textAlign: 'center', marginBottom: '56px', marginTop: '32px' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '16px', letterSpacing: '-1px' }}>Topic-Wise Practice</h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
              Select a core cognitive module to isolate and drill specific skills at your own pace.
            </p>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginBottom: '48px' }}>
            {topics.map((topic, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: idx * 0.1 }} 
                className="premium-card" 
                style={{ padding: '32px', display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ padding: '12px', background: 'rgba(255, 212, 130, 0.15)', color: 'var(--accent)', borderRadius: '12px' }}>
                    <BrainCircuit size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text)' }}>{topic.title}</h3>
                </div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '32px', flex: 1, lineHeight: 1.5 }}>
                  {topic.desc}
                </p>
                <button 
                  className="btn-secondary" 
                  onClick={() => setCurrentView('Simulator')} 
                  style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                >
                  <PlayCircle size={18} /> Launch Drill Module
                </button>
              </motion.div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
};

export default TopicPractice;
