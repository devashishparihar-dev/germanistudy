import React from 'react';

const NavigationGrid = ({ totalQuestions, currentQuestionIndex, userAnswers, onNavigate, testEnded }) => {
  return (
    <footer className="bottom-grid-container">
      <div className="grid-header">
        <h3>Question Overview</h3>
        <div className="legend">
          <span className="legend-item"><span className="box current"></span> Current</span>
          <span className="legend-item"><span className="box answered"></span> Answered</span>
          <span className="legend-item"><span className="box unanswered"></span> Unanswered</span>
        </div>
      </div>
      <div className="question-grid">
        {Array.from({ length: totalQuestions }).map((_, index) => {
          const isCurrent = index === currentQuestionIndex;
          const isAnswered = userAnswers[index] !== null;
          let className = "grid-btn";
          if (isCurrent) className += " current";
          else if (isAnswered) className += " answered";
          
          return (
            <div 
              key={index}
              className={className}
              onClick={() => {
                if (!testEnded) {
                  onNavigate(index);
                }
              }}
            >
              {index + 1}
            </div>
          );
        })}
      </div>
    </footer>
  );
};

export default NavigationGrid;
