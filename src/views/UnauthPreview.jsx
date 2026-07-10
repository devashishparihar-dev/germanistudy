import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from '../utils/analytics';
import { ArrowRight, Lock, Clock, FileCheck, ArrowLeft } from 'lucide-react';

// Fixed set of questions for SEO and predictable preview
const PREVIEW_QUESTIONS = [
  {
    id: 1,
    type: 'figure_sequences',
    title: 'Figure Sequences',
    prompt: 'Which of the figures completes the sequence?',
    grid: [1, 2, 3], // Simplified representation
    options: ['A', 'B', 'C', 'D'],
  },
  {
    id: 2,
    type: 'mathematical_equations',
    title: 'Mathematical Equations',
    prompt: 'Fill in the correct operator to make the equation true: 12 _ 4 = 3',
    options: ['+', '-', '*', '/'],
  },
  {
    id: 3,
    type: 'latin_squares',
    title: 'Latin Squares',
    prompt: 'Find the missing element in the grid so that each row and column has exactly one of each shape.',
    options: ['Circle', 'Square', 'Triangle', 'Diamond'],
  }
];

const UnauthPreview = ({ setCurrentView }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showWall, setShowWall] = useState(false);

  React.useEffect(() => {
    trackEvent('unauth_preview_start');
  }, []);

  const handleAnswer = (opt) => {
    setAnswers({ ...answers, [currentIdx]: opt });
    
    // Auto advance
    setTimeout(() => {
      if (currentIdx < PREVIEW_QUESTIONS.length - 1) {
        setCurrentIdx(currentIdx + 1);
      } else {
        setShowWall(true);
        trackEvent('unauth_preview_completed');
      }
    }, 500);
  };

  if (showWall) {
    return (
      <div className="view-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', padding: '32px' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="premium-card" 
          style={{ maxWidth: '600px', width: '100%', textAlign: 'center', padding: '64px 32px' }}
        >
          <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(217, 164, 65, 0.1)', borderRadius: '50%', color: 'var(--accent)', marginBottom: '32px' }}>
            <FileCheck size={48} />
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px', color: 'var(--text)', fontFamily: 'var(--font-heading)' }}>
            Great Job!
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '40px', lineHeight: 1.6 }}>
            You've completed the preview. To see your results, review detailed explanations, and access the full 25-minute mock exams, create your free account.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="btn-secondary" onClick={() => setCurrentView('Home')}>
              Go Back
            </button>
            <button className="btn-primary" onClick={() => setCurrentView('Auth')}>
              Create Free Account <ArrowRight size={20} style={{ marginLeft: '8px' }} />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const q = PREVIEW_QUESTIONS[currentIdx];

  return (
    <div className="view-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
      {/* Simulator Header */}
      <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button 
            onClick={() => setCurrentView('Home')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}
          >
            <ArrowLeft size={20} /> Exit Preview
          </button>
          <div style={{ width: '1px', height: '24px', background: 'var(--border)' }} />
          <span style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-heading)', fontSize: '1.2rem', letterSpacing: '1px' }}>
            {q.title.toUpperCase()}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--warning)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
          <Clock size={20} /> Preview Mode
        </div>
      </header>

      <main style={{ flex: 1, padding: '48px 32px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: '800px', width: '100%' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', color: 'var(--text-muted)', fontWeight: 600 }}>
            <span>Question {currentIdx + 1} of {PREVIEW_QUESTIONS.length}</span>
          </div>

          <motion.div 
            key={q.id}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="premium-card" 
            style={{ background: 'var(--surface)', padding: '48px', border: '1px solid var(--border)' }}
          >
            <p style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--text)', marginBottom: '48px', lineHeight: 1.6 }}>
              {q.prompt}
            </p>

            {q.type === 'figure_sequences' && (
              <div style={{ display: 'flex', gap: '24px', marginBottom: '48px', justifyContent: 'center' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ width: '80px', height: '80px', border: '2px solid var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '40px', height: '40px', border: '2px solid var(--text)', borderRadius: i === 2 ? '50%' : '0' }} />
                  </div>
                ))}
                <div style={{ width: '80px', height: '80px', border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '2rem' }}>?</div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {q.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  className="btn-secondary"
                  style={{ 
                    padding: '24px', 
                    fontSize: '1.1rem',
                    background: answers[currentIdx] === opt ? 'var(--primary)' : 'transparent',
                    color: answers[currentIdx] === opt ? '#fff' : 'var(--text)',
                    borderColor: answers[currentIdx] === opt ? 'var(--primary)' : 'var(--border)'
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
};

export default UnauthPreview;
