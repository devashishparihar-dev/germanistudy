import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flag, CheckCircle, ChevronLeft, ChevronRight, PenTool, Clock, Lightbulb, PanelRightClose, PanelRightOpen } from 'lucide-react';
import ScratchNotebook from '../components/ScratchNotebook';
import PatternDiagram from '../components/PatternDiagram';
import { quantitativeQuestions } from '../data/quantitativeQuestions';
import { inferringRelationshipsQuestions } from '../data/inferringRelationshipsQuestions';
import { completingPatternsQuestions } from '../data/completingPatternsQuestions';
import { continuingNumericalSeriesQuestions } from '../data/continuingNumericalSeriesQuestions';

const SECTION_CONFIG = [
  { id: 'quantitative', title: 'Solving Quantitative Problems', duration: 45 * 60 },
  { id: 'relationships', title: 'Inferring Relationships', duration: 10 * 60 },
  { id: 'patterns', title: 'Completing Patterns', duration: 22 * 60 },
  { id: 'numerical_series', title: 'Continuing Numerical Series', duration: 25 * 60 }
];

const Simulator = ({ setCurrentView }) => {
  const [sectionsData, setSectionsData] = useState([[], [], [], []]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Global Test State
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [showTransitionScreen, setShowTransitionScreen] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [isExamFinished, setIsExamFinished] = useState(false);
  
  // These represent the answers, flags, and visited states for each of the 4 sections
  const [globalAnswers, setGlobalAnswers] = useState([[], [], [], []]);
  const [globalFlagged, setGlobalFlagged] = useState([[], [], [], []]);
  const [globalVisited, setGlobalVisited] = useState([[], [], [], []]);

  // Current Section State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [scratchOpen, setScratchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const selectedModule = localStorage.getItem('selectedSimulatorModule');
        let formattedQuestions = [];

        if (selectedModule === 'quantitative') {
          formattedQuestions = quantitativeQuestions;
        } else if (selectedModule === 'relationships') {
          formattedQuestions = inferringRelationshipsQuestions;
        } else if (selectedModule === 'patterns') {
          formattedQuestions = completingPatternsQuestions;
        } else if (selectedModule === 'numerical_series') {
          formattedQuestions = continuingNumericalSeriesQuestions;
        } else {
          formattedQuestions = [
            ...quantitativeQuestions,
            ...inferringRelationshipsQuestions,
            ...completingPatternsQuestions,
            ...continuingNumericalSeriesQuestions
          ];
        }
        
        const grouped = [[], [], [], []];
        formattedQuestions.forEach(q => {
          const sIdx = SECTION_CONFIG.findIndex(sc => sc.id === q.section);
          if(sIdx !== -1) grouped[sIdx].push(q);
        });

        let startingSectionIdx = 0;
        if (selectedModule) {
          const sIdx = SECTION_CONFIG.findIndex(sc => sc.id === selectedModule);
          if (sIdx !== -1) startingSectionIdx = sIdx;
        }
        setCurrentSectionIndex(startingSectionIdx);
        setSectionsData(grouped);
        
        setGlobalAnswers(grouped.map(sec => new Array(sec.length).fill(null)));
        setGlobalFlagged(grouped.map(sec => new Array(sec.length).fill(false)));
        setGlobalVisited(grouped.map(sec => new Array(sec.length).fill(false)));
        
        setTimeLeft(SECTION_CONFIG[startingSectionIdx].duration);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to load test data. Please try again.");
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (isExamFinished || showTransitionScreen || loading || sectionsData[currentSectionIndex]?.length === 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowConfirmSubmit(false);
          handleSectionComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isExamFinished, showTransitionScreen, loading, currentSectionIndex, sectionsData]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!loading && !showTransitionScreen && !isExamFinished && sectionsData[currentSectionIndex]?.length > 0) {
      const newVisitedList = [...globalVisited];
      if (!newVisitedList[currentSectionIndex][currentQIndex]) {
        const newSectionVisited = [...newVisitedList[currentSectionIndex]];
        newSectionVisited[currentQIndex] = true;
        newVisitedList[currentSectionIndex] = newSectionVisited;
        setGlobalVisited(newVisitedList);
      }
    }
  }, [currentQIndex, currentSectionIndex, loading, showTransitionScreen, isExamFinished]);

  const handleAnswer = (idx) => {
    const newAnswersList = [...globalAnswers];
    const newSectionAnswers = [...newAnswersList[currentSectionIndex]];
    newSectionAnswers[currentQIndex] = idx;
    newAnswersList[currentSectionIndex] = newSectionAnswers;
    setGlobalAnswers(newAnswersList);
  };

  const toggleFlag = () => {
    const newFlaggedList = [...globalFlagged];
    const newSectionFlagged = [...newFlaggedList[currentSectionIndex]];
    newSectionFlagged[currentQIndex] = !newSectionFlagged[currentQIndex];
    newFlaggedList[currentSectionIndex] = newSectionFlagged;
    setGlobalFlagged(newFlaggedList);
  };

  const handleSectionComplete = () => {
    const isSingleModule = !!localStorage.getItem('selectedSimulatorModule');
    if (currentSectionIndex === 3 || isSingleModule) {
      setIsExamFinished(true);
    } else {
      setShowTransitionScreen(true);
    }
  };

  useEffect(() => {
    if (isExamFinished) {
      let totalScore = 0;
      let totalQuestions = 0;
      const sectionScores = SECTION_CONFIG.map(() => ({ score: 0, total: 0 }));

      sectionsData.forEach((sectionQs, sIdx) => {
        sectionQs.forEach((q, qIdx) => {
          totalQuestions++;
          sectionScores[sIdx].total++;
          const userAnsIdx = globalAnswers[sIdx][qIdx];
          if (userAnsIdx !== null) {
            if (q.options[userAnsIdx] === q.correct_answer) {
              totalScore++;
              sectionScores[sIdx].score++;
            }
          }
        });
      });

      const isSingleModule = !!localStorage.getItem('selectedSimulatorModule');
      const examName = isSingleModule ? `TestAS Core Test - ${SECTION_CONFIG[currentSectionIndex].title}` : 'TestAS Core Test - Full Mock';
      const accuracy = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
      const timeTakenMinutes = Math.round((SECTION_CONFIG[currentSectionIndex].duration - timeLeft) / 60);

      const newResult = {
        id: Date.now(),
        examName,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        score: totalScore,
        totalQuestions,
        accuracy,
        timeTaken: `${timeTakenMinutes}m`,
        status: "Completed",
        sectionScores,
        examType: 'Core Test'
      };

      const existingHistory = JSON.parse(localStorage.getItem('mockTestHistory') || '[]');
      existingHistory.unshift(newResult);
      localStorage.setItem('mockTestHistory', JSON.stringify(existingHistory));
      localStorage.setItem('lastTestResult', JSON.stringify(newResult));
    }
  }, [isExamFinished, sectionsData, globalAnswers]);

  const startNextSection = () => {
    const nextIdx = currentSectionIndex + 1;
    setCurrentSectionIndex(nextIdx);
    setCurrentQIndex(0);
    setTimeLeft(SECTION_CONFIG[nextIdx].duration);
    setShowTransitionScreen(false);
  };

  if (loading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>Loading Test Data...</div>;
  if (error) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', color: 'red' }}>{error}</div>;

  if (showTransitionScreen) {
    const completedSection = SECTION_CONFIG[currentSectionIndex];
    const nextSection = SECTION_CONFIG[currentSectionIndex + 1];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-main)', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="premium-card" style={{ padding: '64px', textAlign: 'center', maxWidth: '600px', width: '100%' }}>
          <CheckCircle size={64} style={{ color: 'var(--success)', margin: '0 auto 24px' }} />
          <h2 style={{ fontSize: '2rem', marginBottom: '8px', color: 'var(--text)' }}>Section {currentSectionIndex + 1} Complete</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '40px' }}>You have finished:<br/><strong style={{ color: 'var(--text)' }}>{completedSection.title}</strong></p>
          
          <div style={{ background: 'var(--surface)', padding: '32px', borderRadius: '12px', marginBottom: '40px', border: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Next Section</p>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text)', marginBottom: '8px' }}>{nextSection.title}</h3>
            <p style={{ color: 'var(--primary)', fontWeight: 600 }}>Timer: {nextSection.duration / 60} Minutes</p>
          </div>

          <button className="btn-primary" onClick={startNextSection} style={{ width: '100%', padding: '20px', fontSize: '1.25rem' }}>
            Start Next Section
          </button>
        </motion.div>
      </div>
    );
  }

  if (isExamFinished) {
    let totalScore = 0;
    let totalQuestions = 0;
    const sectionScores = SECTION_CONFIG.map(() => ({ score: 0, total: 0 }));

    sectionsData.forEach((sectionQs, sIdx) => {
      sectionQs.forEach((q, qIdx) => {
        totalQuestions++;
        sectionScores[sIdx].total++;
        const userAnsIdx = globalAnswers[sIdx][qIdx];
        if (userAnsIdx !== null) {
          if (q.options[userAnsIdx] === q.correct_answer) {
            totalScore++;
            sectionScores[sIdx].score++;
          }
        }
      });
    });

    const ratio = totalQuestions > 0 ? totalScore / totalQuestions : 0;
    let improvementTip = "You have significant room for improvement. Take time to carefully read the explanations below.";
    if (ratio >= 0.9) improvementTip = "Excellent work! Keep practicing under time pressure to maintain this level of accuracy.";
    else if (ratio >= 0.7) improvementTip = "Good job! You have a solid grasp of the material. Review the explanations to fine-tune your understanding.";
    else if (ratio >= 0.5) improvementTip = "Fair performance. Focus on identifying which specific question types cost you points.";

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-main)' }}>
        <header style={{ height: '80px', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary)' }}>Germanistudy - Test Results</div>
          <button className="btn-secondary" onClick={() => setCurrentView('Dashboard')}>Back to Dashboard</button>
        </header>

        <div style={{ flex: 1, overflowY: 'auto', padding: '48px 10%' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="premium-card" style={{ padding: '48px', textAlign: 'center', marginBottom: '48px' }}>
            <CheckCircle size={64} style={{ color: 'var(--success)', margin: '0 auto 24px' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--text)' }}>Exam Completed</h2>
            <div style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '32px' }}>
              Overall Score: <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '2rem' }}>{totalScore} / {totalQuestions}</span>
            </div>

            <div style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid var(--warning)', borderRadius: '12px', padding: '24px', textAlign: 'left', marginBottom: '32px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <Lightbulb size={24} style={{ color: 'var(--warning)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '8px', fontSize: '1.1rem' }}>Analysis & Recommendation</div>
                <div style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{improvementTip}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '32px' }}>
              {SECTION_CONFIG.map((sec, idx) => {
                if (sectionsData[idx].length === 0) return null;
                return (
                  <div key={idx} style={{ padding: '24px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'left' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '12px', minHeight: '40px' }}>{sec.title}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>
                      {sectionScores[idx].score} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ {sectionScores[idx].total}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border)', color: 'var(--text)' }}>Detailed Section Breakdown</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
            {sectionsData.map((sectionQs, sIdx) => {
              if (sectionQs.length === 0) return null;
              return (
                <div key={sIdx}>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px', color: 'var(--primary)' }}>{SECTION_CONFIG[sIdx].title}</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {sectionQs.map((q, qIdx) => {
                      const userAnsIdx = globalAnswers[sIdx][qIdx];
                      const userAnswer = userAnsIdx !== null ? q.options[userAnsIdx] : 'Unanswered';
                      const isCorrect = userAnswer === q.correct_answer;
                      const hasPattern = q.section === 'patterns' && (q.question.includes('Row 1:') || q.question.includes('Sequence:'));

                      return (
                        <div key={qIdx} className="premium-card" style={{ padding: '32px', borderLeft: `6px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>Question {qIdx + 1}</h4>
                            <span style={{ padding: '4px 12px', borderRadius: '16px', background: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: isCorrect ? 'var(--success)' : 'var(--error)', fontWeight: 600, fontSize: '0.9rem' }}>
                              {isCorrect ? 'Correct' : 'Incorrect'}
                            </span>
                          </div>

                          {hasPattern ? (
                            <PatternDiagram text={q.question} />
                          ) : (
                            <div style={{ fontSize: '1.1rem', whiteSpace: 'pre-wrap', marginBottom: '24px', color: 'var(--text)' }}>{q.question}</div>
                          )}

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px', padding: '16px', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                            <div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px' }}>Your Answer</div>
                              <div style={{ color: isCorrect ? 'var(--success)' : 'var(--error)', fontWeight: 600 }}>{userAnswer}</div>
                            </div>
                            <div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px' }}>Correct Answer</div>
                              <div style={{ color: 'var(--success)', fontWeight: 600 }}>{q.correct_answer}</div>
                            </div>
                          </div>

                          <div style={{ padding: '16px', background: 'rgba(242, 175, 0, 0.05)', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>Explanation</div>
                            <div style={{ color: 'var(--text)', lineHeight: 1.5 }}>{q.explanation || 'No explanation provided.'}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const currentSectionQuestions = sectionsData[currentSectionIndex] || [];
  if (currentSectionQuestions.length === 0) return null;

  const currentQ = currentSectionQuestions[currentQIndex];
  const hasPattern = currentQ.section === 'patterns' && (currentQ.question.includes('Row 1:') || currentQ.question.includes('Sequence:'));

  const sectionAnswers = globalAnswers[currentSectionIndex];
  const sectionFlagged = globalFlagged[currentSectionIndex];

  const unansweredCount = sectionAnswers.filter(a => a === null).length;
  const isTimeCritical = timeLeft < 300;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--background)' }}>
      {showConfirmSubmit && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="premium-card" style={{ background: 'var(--surface)', padding: '32px', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--text)', fontWeight: 700 }}>Submit Section?</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '1.1rem' }}>
              Are you sure you want to finish this section? {unansweredCount > 0 ? `You have ${unansweredCount} unanswered question(s).` : 'All questions are answered.'}
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button className="btn-secondary" onClick={() => setShowConfirmSubmit(false)}>Cancel</button>
              <button className="btn-primary" onClick={() => { setShowConfirmSubmit(false); handleSectionComplete(); }}>Confirm Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* Zen Mode Header */}
      <header style={{ 
        height: '72px', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', 
        justifyContent: 'space-between', padding: '0 32px', flexShrink: 0, position: 'relative', zIndex: 10 
      }}>
        <div style={{ width: '30%', display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)', letterSpacing: '-0.5px' }}>
            GermaniStudy
          </div>
          <div style={{ padding: '4px 12px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Section {currentSectionIndex + 1} of 4
          </div>
        </div>
        
        <div style={{ width: '40%', textAlign: 'center', fontWeight: 600, fontSize: '1rem', color: 'var(--text-muted)' }}>
          {SECTION_CONFIG[currentSectionIndex].title}
        </div>
        
        <div style={{ width: '30%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '24px' }}>
          <div style={{ 
            fontSize: '1.5rem', fontWeight: 700, fontFamily: 'monospace', 
            color: isTimeCritical ? 'var(--error)' : 'var(--text)', 
            animation: isTimeCritical ? 'pulseAccent 1s infinite' : 'none',
            letterSpacing: '1px'
          }}>
            {formatTime(timeLeft)}
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {sidebarOpen ? <PanelRightClose size={24} /> : <PanelRightOpen size={24} />}
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflowY: 'auto' }}>
          
          <div style={{ flex: 1, padding: '48px 10%', display: 'flex', flexDirection: 'column', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', opacity: 0.8 }}>Question {currentQIndex + 1}</div>
            </div>
            
            {hasPattern ? (
              <div style={{ marginBottom: '40px' }}>
                <PatternDiagram text={currentQ.question} />
              </div>
            ) : (
              <div style={{ fontSize: '1.4rem', whiteSpace: 'pre-wrap', lineHeight: 1.6, marginBottom: '48px', color: 'var(--text)', fontWeight: 500 }}>
                {currentQ.question}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {currentQ.options.map((opt, idx) => {
                const isSelected = sectionAnswers[currentQIndex] === idx;
                const letter = ['A', 'B', 'C', 'D', 'E'][idx];
                return (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    style={{
                      padding: '20px 24px', background: isSelected ? 'rgba(242, 175, 0, 0.05)' : 'var(--surface)',
                      border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-lg)', textAlign: 'left', fontSize: '1.1rem', 
                      color: 'var(--text)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center',
                      boxShadow: isSelected ? '0 0 0 1px var(--primary)' : '0 2px 8px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{ 
                      width: '32px', height: '32px', borderRadius: '8px', 
                      background: isSelected ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                      color: isSelected ? '#13151A' : 'var(--text-muted)',
                      border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`, 
                      marginRight: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      flexShrink: 0, fontWeight: 700, fontSize: '0.9rem'
                    }}>
                      {letter}
                    </div>
                    {hasPattern ? (
                      <div style={{ flex: 1, marginTop: '-8px', marginBottom: '-8px' }}>
                        <PatternDiagram text={opt} inline={true} />
                      </div>
                    ) : (
                      <span style={{ fontWeight: isSelected ? 600 : 400 }}>{opt}</span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
          
          {/* Zen Bottom Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '24px 10%', background: 'var(--background)', marginTop: 'auto' }}>
            <button className="btn-secondary" onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))} disabled={currentQIndex === 0} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', border: 'none', background: 'var(--surface)' }}>
              <ChevronLeft size={20} /> Previous
            </button>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <button className="btn-secondary" onClick={() => setScratchOpen(!scratchOpen)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', border: 'none', background: 'var(--surface)' }}>
                <PenTool size={20} /> Scratch
              </button>
              <button className="btn-secondary" onClick={toggleFlag} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', border: 'none', color: sectionFlagged[currentQIndex] ? 'var(--warning)' : 'var(--text)', background: sectionFlagged[currentQIndex] ? 'rgba(245, 158, 11, 0.1)' : 'var(--surface)' }}>
                <Flag size={20} fill={sectionFlagged[currentQIndex] ? 'var(--warning)' : 'none'} /> {sectionFlagged[currentQIndex] ? 'Flagged' : 'Flag'}
              </button>
            </div>

            {currentQIndex === currentSectionQuestions.length - 1 ? (
              <button className="btn-primary" onClick={() => setShowConfirmSubmit(true)} style={{ padding: '12px 32px' }}>Review Section</button>
            ) : (
              <button className="btn-secondary" onClick={() => setCurrentQIndex(prev => Math.min(currentSectionQuestions.length - 1, prev + 1))} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 32px', border: 'none', background: 'var(--surface)' }}>
                Next <ChevronRight size={20} />
              </button>
            )}
          </div>
        </main>

        <AnimatePresence>
          {scratchOpen && (
            <motion.div initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} style={{ position: 'absolute', right: sidebarOpen ? '320px' : '0', top: 0, bottom: 0, width: '400px', background: 'var(--surface)', borderLeft: '1px solid var(--border)', zIndex: 5, boxShadow: '-5px 0 30px rgba(0,0,0,0.1)' }}>
              <div style={{ padding: '24px', height: '100%', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Scratch Notebook</h3>
                  <button onClick={() => setScratchOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>Close</button>
                </div>
                <ScratchNotebook />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside 
              initial={{ x: '100%', opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }} 
              exit={{ x: '100%', opacity: 0 }} 
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ width: '320px', borderLeft: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', flexDirection: 'column', flexShrink: 0, zIndex: 10, height: '100%' }}
            >
              <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '20px' }}>Question Grid</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--border)' }}></div> Unanswered</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }}></div> Answered</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--warning)' }}></div> Flagged</div>
                </div>
              </div>
              
              <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                  {currentSectionQuestions.map((q, idx) => {
                    const isCurrent = idx === currentQIndex;
                    const isAnswered = sectionAnswers[idx] !== null;
                    const isFlagged = sectionFlagged[idx];
                    
                    let bg = 'transparent';
                    let border = '1px solid var(--border)';
                    let color = 'var(--text)';
                    
                    if (isAnswered) {
                      bg = 'rgba(242, 175, 0, 0.1)';
                      border = '1px solid var(--primary)';
                      color = 'var(--primary)';
                    }
                    if (isFlagged) {
                      bg = 'rgba(245, 158, 11, 0.1)';
                      border = '1px solid var(--warning)';
                      color = 'var(--warning)';
                    }
                    if (isCurrent) {
                      border = '2px solid var(--text)';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentQIndex(idx)}
                        style={{
                          aspectRatio: '1', borderRadius: '8px', background: bg, color: color,
                          border: border, fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                        }}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div style={{ padding: '24px', borderTop: '1px solid var(--border)' }}>
                 <button className="btn-primary" onClick={() => setShowConfirmSubmit(true)} style={{ width: '100%', padding: '16px', fontSize: '1rem' }}>
                  Review & Submit
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Simulator;
