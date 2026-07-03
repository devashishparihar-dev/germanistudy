import React, { useEffect, useState } from 'react';

const ExamTimer = ({ initialSeconds, onTimeUp }) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) {
      onTimeUp();
      return;
    }
    const timer = setInterval(() => {
      setSeconds(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds, onTimeUp]);

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const timeString = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

  let color = 'var(--accent)'; // Golden timer
  let pulseClass = '';

  if (seconds <= 60) {
    color = 'var(--error)';
    pulseClass = 'timer-pulse';
  } else if (seconds <= 300) {
    color = 'var(--error)';
  } else if (seconds <= 600) {
    color = 'var(--warning)';
  }

  return (
    <div className={`${pulseClass} mono-text`} style={{ fontSize: '1.5rem', fontWeight: 700, color, transition: 'color 0.3s' }}>
      {timeString}
    </div>
  );
};

export default ExamTimer;
