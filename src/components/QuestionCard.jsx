import React from 'react';

const QuestionCard = ({ 
  question, 
  currentQuestionIndex, 
  totalQuestions, 
  userAnswer, 
  onAnswerChange,
  scratchpadNote,
  onScratchpadChange,
  onPrev,
  onNext,
  testEnded
}) => {
  return (
    <section className="question-area">
      <div className="question-card">
        <div className="question-header">
          <span className="question-number">Question {currentQuestionIndex + 1} of {totalQuestions}</span>
        </div>
        <div className="question-split-container">
          <div className="question-left-col">
            <p className="question-text">{question.text}</p>
            <div className="options-container">
              {question.options.map((opt, index) => (
                <label className="option-label" key={index}>
                  <input 
                    type="radio" 
                    name={`question-${question.id}`} 
                    value={index} 
                    checked={userAnswer === index}
                    onChange={() => onAnswerChange(index)}
                    disabled={testEnded}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
          <div className="question-right-col">
            <textarea
              className="scratchpad-textarea"
              placeholder="Type your notes or scratch calculations here... (Physical paper is forbidden on the actual exam)"
              value={scratchpadNote}
              onChange={(e) => onScratchpadChange(e.target.value)}
              disabled={testEnded}
            ></textarea>
          </div>
        </div>
      </div>

      <div className="navigation-buttons">
        <button 
          className="btn-secondary" 
          onClick={onPrev}
          disabled={currentQuestionIndex === 0 || testEnded}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Previous
        </button>
        <button 
          className="btn-primary" 
          onClick={onNext}
          disabled={currentQuestionIndex === totalQuestions - 1 || testEnded}
        >
          Next
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </section>
  );
};

export default QuestionCard;
