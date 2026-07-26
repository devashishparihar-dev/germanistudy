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
            {question.type === 'latin_square' && question.grid && (
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
                <table style={{ borderCollapse: 'collapse', textAlign: 'center', fontSize: '1.2rem', color: 'var(--text-main)', border: '2px solid var(--border-color)' }}>
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid var(--border-color)', padding: '12px' }}></th>
                      {question.grid.columns.map((col, idx) => (
                        <th key={idx} style={{ border: '1px solid var(--border-color)', padding: '12px', minWidth: '40px' }}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {question.grid.rows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        <th style={{ border: '1px solid var(--border-color)', padding: '12px' }}>{rIdx + 1}</th>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} style={{ border: '1px solid var(--border-color)', padding: '12px', minWidth: '40px', fontWeight: cell === '?' ? 'bold' : 'normal', color: cell === '?' ? 'var(--primary)' : 'inherit' }}>
                            {cell || ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {question.type === 'figural_sequence' && question.question_image && (
              <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'center' }}>
                <img src={question.question_image} alt="Figural Sequence" style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px' }} />
              </div>
            )}

            {question.type !== 'figural_sequence' && (
              <p className="question-text">{question.text || question.question}</p>
            )}
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
                  {question.type === 'figural_sequence' && typeof opt === 'object' && opt.image ? (
                     <img src={opt.image} alt={`Option`} style={{ maxWidth: '150px', maxHeight: '100px', marginLeft: '12px', borderRadius: '4px' }} />
                  ) : (
                     <span style={{ marginLeft: '12px' }}>{typeof opt === 'object' ? opt.id : opt}</span>
                  )}
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
