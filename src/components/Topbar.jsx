import React, { useEffect } from 'react';
import { GraduationCap } from 'lucide-react';

const Topbar = ({ timeRemaining, setTimeRemaining, testEnded, endTest }) => {
  useEffect(() => {
    if (testEnded || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          endTest();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [testEnded, timeRemaining, setTimeRemaining, endTest]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  const isUrgent = timeRemaining <= 300 && timeRemaining > 0;

  return (
    <header className="topbar" style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 32px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
      <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text)', margin: 0 }}>Quantitative Problems</h1>
      </div>
      <div className="topbar-right">
        <div 
          className="timer-container" 
          title="Time Remaining"
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            background: isUrgent ? '#fef2f2' : 'var(--background)', 
            padding: '8px 16px', borderRadius: '8px', 
            border: `1px solid ${isUrgent ? 'var(--error)' : 'var(--border)'}`,
            color: isUrgent ? 'var(--error)' : 'var(--accent)',
            fontFamily: 'var(--font-mono)'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isUrgent ? 'timer-pulse' : ''}>
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span id="countdown-timer" style={{ fontSize: '1.2rem', fontWeight: 700 }}>{timeString}</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
