import React from 'react';

const EndTestScreen = ({ score, totalQuestions }) => {
  return (
    <section className="question-area">
      <div className="question-card">
        <div className="question-header">
          <span className="question-number">Test Complete</span>
        </div>
        <div className="question-content">
          <div style={{ textAlign: 'center', width: '100%' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--primary-color)', marginBottom: '16px' }}>Test Finished</h2>
            <p style={{ fontSize: '1.25rem', fontWeight: 500 }}>Your Score: {score}/{totalQuestions} Correct Answers</p>
            <p style={{ color: 'var(--text-muted)', marginTop: '16px' }}>No negative marking applied. Unanswered or wrong questions scored 0.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EndTestScreen;

