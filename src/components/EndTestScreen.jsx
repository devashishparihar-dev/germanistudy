import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const CountUp = ({ to }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const controls = animate(count, to, {
      type: 'spring',
      stiffness: 100,
      damping: 12,
      duration: 0.8
    });
    return controls.stop;
  }, [to, count]);

  return <motion.span>{rounded}</motion.span>;
};

const EndTestScreen = ({ score, totalQuestions, onRetry, onViewExplanations }) => {
  const percent = Math.round((score / totalQuestions) * 100);
  const context = percent >= 80 ? "Great job! You're ready for the real exam." : "Keep practicing to improve your speed and accuracy.";

  return (
    <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '24px', textAlign: 'center' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 style={{ fontSize: '4rem', fontFamily: 'var(--font-heading)', color: 'var(--text)', marginBottom: '8px' }}>
          <CountUp to={score} /> / {totalQuestions}
        </h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '32px' }}>
          {context}
        </p>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          {onViewExplanations ? (
             <button className="btn-primary" onClick={onViewExplanations}>Review Explanations</button>
          ) : (
             <button className="btn-primary" onClick={() => window.location.reload()}>Return to Dashboard</button>
          )}
        </div>
      </motion.div>
    </section>
  );
};

export default EndTestScreen;

