import React from 'react';

const QuestionGrid = ({ totalQuestions, currentQuestionIndex, userAnswers, flaggedQuestions, visitedQuestions, onNavigate }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(36px, 1fr))', gap: '8px' }}>
      {Array.from({ length: totalQuestions }).map((_, idx) => {
        let className = 'grid-item ';
        if (currentQuestionIndex === idx) {
          className += 'grid-item-current ';
        }
        if (flaggedQuestions[idx]) {
          className += 'grid-item-flagged';
        } else if (userAnswers[idx] !== null) {
          className += 'grid-item-answered';
        } else if (visitedQuestions[idx]) {
          className += 'grid-item-visited';
        } else {
          className += 'grid-item-unvisited';
        }

        return (
          <button
            key={idx}
            className={className}
            onClick={() => onNavigate(idx)}
          >
            {idx + 1}
          </button>
        );
      })}
    </div>
  );
};

export default QuestionGrid;
