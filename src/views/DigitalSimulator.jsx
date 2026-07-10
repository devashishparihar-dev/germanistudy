import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Clock, Flag, ChevronRight, ChevronLeft, Lock } from 'lucide-react';
import PatternDiagram from '../components/PatternDiagram';
import { figureSequencesQuestions } from '../data/figureSequencesQuestions';
import { mathematicalEquationsQuestions } from '../data/mathematicalEquationsQuestions';
import { latinSquaresQuestions } from '../data/latinSquaresQuestions';
import { medicineQuestions } from '../data/medicineQuestions';
import { freeMockTestQuestions } from '../data/freeMockTest';
import { supabase } from '../supabaseClient';
import ErrorBoundary from '../components/ErrorBoundary';
import { trackEvent } from '../utils/analytics';

const CORE_SECTION_CONFIG = [
  { 
    id: 'figure_sequences', 
    title: 'Figure Sequences', 
    duration: 25 * 60, 
    rules: 'Identify the pattern in the sequence and choose the correct next figure.',
    example: {
      question: "Which figure comes next?\nRow 1: [Circle], [Square], [Circle], [Square]\nRow 2: [Triangle], [Star], [Triangle], [?]",
      explanation: "The pattern alternates between two shapes. The missing shape is a Star."
    }
  },
  { 
    id: 'mathematical_equations', 
    title: 'Mathematical Equations', 
    duration: 25 * 60, 
    rules: 'Solve the equation for the unknown variable and type your numeric answer in the box.',
    example: {
      question: "Solve for x:\n2x + 4 = 10",
      explanation: "Subtract 4 from both sides to get 2x = 6. Divide by 2 to get x = 3."
    }
  },
  { 
    id: 'latin_squares', 
    title: 'Latin Squares', 
    duration: 25 * 60, 
    rules: 'Complete the grid following logical rules so that each letter appears exactly once per row and column.',
    example: {
      question: "In a 3x3 grid with A, B, C. Row 1 has A and B. What is the last letter?",
      explanation: "Each row must contain A, B, and C exactly once. The missing letter is C."
    }
  }
];

const DigitalSimulator = ({ setCurrentView }) => {
  const [activeSectionConfig, setActiveSectionConfig] = useState([]);
  const [sectionsData, setSectionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Global Test State
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [examStage, setExamStage] = useState('rules'); // 'rules', 'instruction', 'subtest', 'break', 'calculating', 'results'
  const [breakTimeLeft, setBreakTimeLeft] = useState(0);
  
  // These represent the answers and flags for each section
  const [globalAnswers, setGlobalAnswers] = useState([]);
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);

  // Current Section State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  // Simulated Freemium State
  const [isPremium, setIsPremium] = useState(false); // Can be tied to Auth/Supabase later
  const [reviewModeSection, setReviewModeSection] = useState(0);

  useEffect(() => {
    // Determine premium status (mocking for now, in reality fetch from Supabase profile)
    setIsPremium(localStorage.getItem('isPremium') === 'true' || localStorage.getItem('subscription') === 'premium');
    
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const selectedCoreModule = localStorage.getItem('selectedDigitalModule');
        const selectedSubjectModule = localStorage.getItem('selectedDigitalSubjectModule');

        let isSubjectMode = !!selectedSubjectModule;
        let isFreeMock = selectedCoreModule === 'free_mock';
        let config = [];
        let grouped = [];

        const mapSectionId = (sec) => {
          if (!sec) return '';
          const s = sec.toLowerCase();
          if (s.includes('math') || s.includes('quant') || s === 'numerical_series' || s.includes('equation')) {
            return 'mathematical_equations';
          }
          if (s.includes('pattern') || s.includes('figur') || s.includes('sequence')) {
            return 'figure_sequences';
          }
          if (s.includes('latin') || s.includes('relation') || s === 'latin_squares') {
            return 'latin_squares';
          }
          return sec;
        };

        const subtests = ['figure_sequences', 'mathematical_equations', 'latin_squares'];
        const isSubtestMode = selectedCoreModule && subtests.includes(selectedCoreModule);
        const isCustomMock = selectedCoreModule && !subtests.includes(selectedCoreModule);

        if (isCustomMock) {
          let rawData = [];
          let testName = 'Custom Mock Test';
          try {
            const { data: mockTestData } = await supabase
              .from('mock_tests')
              .select('*')
              .eq('id', selectedCoreModule)
              .single();
              
            if (mockTestData && mockTestData.questions) {
              rawData = mockTestData.questions;
              testName = mockTestData.test_name;
            } else {
              // Fetch questions linked to this mock test via junction table
              const { data: mappings, error: mapError } = await supabase
                .from('mock_test_questions')
                .select('question_id')
                .eq('mock_test_id', selectedCoreModule);
                
              if (mapError) {
                console.error("Error fetching mappings:", mapError);
                throw new Error("Database error fetching mock test mappings");
              }
                
              if (mappings && mappings.length > 0) {
                const qIds = mappings.map(m => m.question_id);
                const { data: questions, error: qError } = await supabase
                  .from('core_test_questions')
                  .select('*')
                  .in('id', qIds);
                  
                if (qError) {
                   console.error("Error fetching questions by IDs:", qError);
                   throw new Error("Database error fetching core questions");
                }
                rawData = questions || [];
                if (rawData.length === 0) {
                   throw new Error("Questions found in mappings but failed to load from core_test_questions (possibly due to RLS).");
                }
              } else {
                console.error("Mappings array was empty for mock_test_id:", selectedCoreModule);
                throw new Error("No questions found in mock test");
              }
            }
          } catch (e) {
            console.warn("Could not fetch custom mock from Supabase, using free mock fallback.", e);
            rawData = freeMockTestQuestions;
          }

          // If it's a short mock (e.g. 15 questions), give 5 mins per section. Otherwise 25 mins.
          const durationPerSection = rawData.length <= 15 ? 5 * 60 : 25 * 60;
          config = CORE_SECTION_CONFIG.map(c => ({...c, duration: durationPerSection}));

          let tempGrouped = [[], [], []];
          rawData.forEach(q => {
            const targetSec = mapSectionId(q.section);
            const sIdx = config.findIndex(sc => sc.id === targetSec);
            if(sIdx !== -1) tempGrouped[sIdx].push(q);
          });
          
          const finalConfig = [];
          grouped = [];
          config.forEach((c, idx) => {
            if (tempGrouped[idx].length > 0) {
              finalConfig.push(c);
              grouped.push(tempGrouped[idx]);
            }
          });
          
          if (grouped.length === 0) {
             throw new Error("No valid questions mapped to standard sections. Check your section names.");
          }
          config = finalConfig;
        } else if (isSubjectMode) {
          config = [{ id: selectedSubjectModule, title: 'Subject Module', duration: 90 * 60, rules: 'Read the provided information carefully and answer the subsequent questions.', example: { question: "Carefully read the text on the left and answer the questions on the right.", explanation: "All information needed is in the text." } }];
          let rawData = medicineQuestions; // Subject tests are not currently added via Admin Panel
          
          let flatQs = [];
          rawData.forEach(q => {
            if (q.type === 'testlet') {
              q.questions.forEach(subQ => {
                flatQs.push({ ...subQ, testletTitle: q.title, testletPassage: q.passage });
              });
            } else {
              flatQs.push(q);
            }
          });
          grouped = [flatQs];
        } else if (isSubtestMode) {
          // Individual Subtest Practice Mode
          const subtestConfig = CORE_SECTION_CONFIG.find(c => c.id === selectedCoreModule);
          config = [subtestConfig];
          
          let rawData = [];
          try {
            // Find both new and old section names for query compatibility
            let querySection = selectedCoreModule;
            if (selectedCoreModule === 'mathematical_equations') querySection = 'quantitative';
            else if (selectedCoreModule === 'figure_sequences') querySection = 'patterns';
            else if (selectedCoreModule === 'latin_squares') querySection = 'relationships';

            const { data: coreQuestions } = await supabase
              .from('core_test_questions')
              .select('*')
              .or(`section.eq.${selectedCoreModule},section.eq.${querySection}`);
              
            if (coreQuestions && coreQuestions.length > 0) {
              rawData = coreQuestions;
            } else {
              throw new Error("No questions in DB");
            }
          } catch (e) {
            console.warn("Could not fetch subtest from Supabase, using local fallback.", e);
            if (selectedCoreModule === 'figure_sequences') rawData = figureSequencesQuestions;
            else if (selectedCoreModule === 'mathematical_equations') rawData = mathematicalEquationsQuestions;
            else if (selectedCoreModule === 'latin_squares') rawData = latinSquaresQuestions;
          }
          
          grouped = [rawData];
        } else {
          // Core Mode (Full Standard Mock Test)
          config = CORE_SECTION_CONFIG;
          
          let rawData = [];
          try {
            const { data: coreQuestions } = await supabase.from('core_test_questions').select('*');
            if (coreQuestions && coreQuestions.length > 0) {
               rawData = coreQuestions;
            } else {
               rawData = [
                 ...figureSequencesQuestions,
                 ...mathematicalEquationsQuestions,
                 ...latinSquaresQuestions
               ];
            }
          } catch (e) {
             console.warn("Could not fetch from Supabase, using local fallback.", e);
             rawData = [
               ...figureSequencesQuestions,
               ...mathematicalEquationsQuestions,
               ...latinSquaresQuestions
             ];
          }

          let tempGrouped = [[], [], []];
          rawData.forEach(q => {
            const targetSec = mapSectionId(q.section);
            const sIdx = config.findIndex(sc => sc.id === targetSec);
            if(sIdx !== -1) tempGrouped[sIdx].push(q);
          });
          
          const finalConfig = [];
          grouped = [];
          config.forEach((c, idx) => {
            if (tempGrouped[idx].length > 0) {
              finalConfig.push(c);
              grouped.push(tempGrouped[idx]);
            }
          });
          
          if (grouped.length === 0) {
             grouped = tempGrouped;
          } else {
             config = finalConfig;
          }
        }

        const savedStateJson = localStorage.getItem('simulator_autosave');
        let loadedState = null;
        if (savedStateJson) {
          try {
            const parsed = JSON.parse(savedStateJson);
            if (parsed.selectedCoreModule === selectedCoreModule && parsed.selectedSubjectModule === selectedSubjectModule) {
              loadedState = parsed;
            }
          } catch(e) {}
        }

        setActiveSectionConfig(config);
        setSectionsData(grouped);
        
        if (loadedState) {
           setGlobalAnswers(loadedState.globalAnswers || grouped.map(sec => new Array(sec.length).fill(null)));
           setFlaggedQuestions(loadedState.flaggedQuestions || grouped.map(sec => new Array(sec.length).fill(false)));
           setCurrentSectionIndex(loadedState.currentSectionIndex || 0);
           setCurrentQIndex(loadedState.currentQIndex || 0);
           setExamStage(loadedState.examStage || 'rules');
           if (loadedState.timeLeft !== undefined) setTimeLeft(loadedState.timeLeft);
           if (loadedState.breakTimeLeft !== undefined) setBreakTimeLeft(loadedState.breakTimeLeft);
        } else {
           setGlobalAnswers(grouped.map(sec => new Array(sec.length).fill(null)));
           setFlaggedQuestions(grouped.map(sec => new Array(sec.length).fill(false)));
           setCurrentSectionIndex(0);
           setCurrentQIndex(0);
           setExamStage('rules');
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to load test data. Please try again.");
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // Exam Integrity: Warn on reload/close
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (['subtest', 'break'].includes(examStage)) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [examStage]);

  // Auto-save State to localStorage
  useEffect(() => {
    if (loading || error || examStage === 'results' || activeSectionConfig.length === 0) return;
    
    const stateToSave = {
      selectedCoreModule: localStorage.getItem('selectedDigitalModule') || null,
      selectedSubjectModule: localStorage.getItem('selectedDigitalSubjectModule') || null,
      globalAnswers,
      flaggedQuestions,
      currentSectionIndex,
      currentQIndex,
      examStage,
      timeLeft,
      breakTimeLeft
    };
    localStorage.setItem('simulator_autosave', JSON.stringify(stateToSave));
  }, [globalAnswers, flaggedQuestions, currentSectionIndex, currentQIndex, examStage, timeLeft, breakTimeLeft, activeSectionConfig, loading, error]);

  // Track Question Views
  useEffect(() => {
    if (examStage === 'subtest') {
      trackEvent('question_viewed', { 
        sectionIndex: currentSectionIndex, 
        questionIndex: currentQIndex,
        sectionId: activeSectionConfig[currentSectionIndex]?.id
      });
    }
  }, [examStage, currentSectionIndex, currentQIndex, activeSectionConfig]);

  // Main Section Timer
  useEffect(() => {
    if (examStage !== 'subtest' || sectionsData[currentSectionIndex]?.length === 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSectionComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [examStage, currentSectionIndex, sectionsData]);

  // Break Timer
  useEffect(() => {
    if (examStage !== 'break') return;
    const timer = setInterval(() => {
      setBreakTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          startNextSection();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [examStage]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (val) => {
    if (examStage !== 'subtest') return;
    const newAnswersList = [...globalAnswers];
    const newSectionAnswers = [...newAnswersList[currentSectionIndex]];
    newSectionAnswers[currentQIndex] = val;
    newAnswersList[currentSectionIndex] = newSectionAnswers;
    setGlobalAnswers(newAnswersList);
  };

  const toggleFlag = () => {
    if (examStage !== 'subtest') return;
    const newFlagsList = [...flaggedQuestions];
    const newSectionFlags = [...newFlagsList[currentSectionIndex]];
    newSectionFlags[currentQIndex] = !newSectionFlags[currentQIndex];
    newFlagsList[currentSectionIndex] = newSectionFlags;
    setFlaggedQuestions(newFlagsList);
  };

  const handleSectionComplete = () => {
    const isSingleModule = activeSectionConfig.length === 1;
    
    if (currentSectionIndex === activeSectionConfig.length - 1) {
      if (!isSingleModule && currentSectionIndex === 2) {
        // Last core section finished -> 30 min skippable break
        setBreakTimeLeft(30 * 60);
        setExamStage('break');
      } else {
        finishExam();
      }
    } else {
      // 2 minute optional break between core subtests
      setBreakTimeLeft(2 * 60);
      setExamStage('break');
    }
  };

  const finishExam = () => {
    setExamStage('calculating');
    setTimeout(() => {
      // Calculate final results
      const pastTests = JSON.parse(localStorage.getItem('mockTestHistory') || '[]');
      
      let totalScore = 0;
      let totalQs = 0;
      const sectionScores = activeSectionConfig.map(() => ({ score: 0, total: 0 }));

      sectionsData.forEach((sectionQs, sIdx) => {
        sectionQs.forEach((q, qIdx) => {
          totalQs++;
          sectionScores[sIdx].total++;
          const userAns = globalAnswers[sIdx][qIdx];
          if (userAns !== null && userAns !== '') {
            if (q.type === 'input') {
              if (userAns.trim().toLowerCase() === q.correct_answer.trim().toLowerCase()) {
                totalScore++;
                sectionScores[sIdx].score++;
              }
            } else {
              if (q.options[userAns] === q.correct_answer) {
                totalScore++;
                sectionScores[sIdx].score++;
              }
            }
          }
        });
      });

      const newTest = {
        id: Date.now().toString(),
        examName: activeSectionConfig.length > 1 ? 'Digital Core Test Mock' : 'Digital Subject Test Mock',
        date: new Date().toLocaleDateString(),
        timeTaken: 'Completed',
        status: 'Completed',
        score: totalScore,
        totalQuestions: totalQs,
        accuracy: Math.round((totalScore / totalQs) * 100) || 0,
        answers: globalAnswers,
        sectionScores: sectionScores
        // Persist to MockHistory local storage
      };
      
      localStorage.setItem('mockTestHistory', JSON.stringify([newTest, ...pastTests]));
      localStorage.removeItem('simulator_autosave');
      
      trackEvent('mock_completed', {
        examName: newTest.examName,
        score: totalScore,
        totalQuestions: totalQs,
        accuracy: newTest.accuracy
      });
      
      setExamStage('results');
    }, 2500); // 2.5s loader
  };

  const startNextSection = () => {
    if (currentSectionIndex === activeSectionConfig.length - 1) {
      finishExam();
      return;
    }
    const nextIdx = currentSectionIndex + 1;
    setCurrentSectionIndex(nextIdx);
    setCurrentQIndex(0);
    setExamStage('instruction');
  };

  const handleStartSection = () => {
    setTimeLeft(activeSectionConfig[currentSectionIndex].duration);
    setExamStage('subtest');
  };

  const preventIntegrityEvents = (e) => {
    e.preventDefault();
    return false;
  };

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', color: 'var(--text)' }}>
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        style={{ width: '64px', height: '64px', borderRadius: '50%', border: '4px solid var(--border)', borderTopColor: 'var(--primary)', marginBottom: '24px' }}
      />
      <h2 style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>Loading Test Environment...</h2>
    </div>
  );
  if (error) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', color: 'var(--error)' }}>{error}</div>;

  const currentQ = sectionsData[currentSectionIndex] ? sectionsData[currentSectionIndex][currentQIndex] : null;
  const isTestlet = currentQ ? !!currentQ.testletPassage : false;

  // Render different stages
  return (
    <ErrorBoundary>
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-main)', fontFamily: 'sans-serif' }}>
      
      <AnimatePresence mode="wait">
        
        {examStage === 'rules' && (
          <motion.div 
            key="rules"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
          >
            <div className="premium-card" style={{ maxWidth: '600px', width: '100%', padding: '48px', background: 'var(--surface)', textAlign: 'center' }}>
              <AlertCircle size={48} style={{ color: 'var(--primary)', margin: '0 auto 24px' }} />
              <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--text)' }}>Exam Rules</h2>
              <div style={{ textAlign: 'left', marginBottom: '32px', color: 'var(--text-muted)' }}>
                <ul style={{ lineHeight: '2', fontSize: '1.1rem' }}>
                  <li><strong>No calculators</strong> or external aids permitted.</li>
                  <li><strong>No scratch paper</strong> or notes allowed during the exam.</li>
                  <li>Please <strong>close other tabs</strong> and use full screen for the best experience.</li>
                  <li>Do not refresh the page or use the back button, as progress may be lost.</li>
                </ul>
              </div>
              <button onClick={() => setExamStage('instruction')} className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}>
                I understand, begin setup
              </button>
            </div>
          </motion.div>
        )}

        {examStage === 'instruction' && (
          <motion.div 
            key="instruction"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
          >
            <div className="premium-card" style={{ maxWidth: '700px', width: '100%', padding: '48px', background: 'var(--surface)' }}>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '16px', color: 'var(--text)', fontWeight: 'bold' }}>
                Instructions: {activeSectionConfig[currentSectionIndex].title}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '32px', lineHeight: '1.6' }}>
                {activeSectionConfig[currentSectionIndex].rules}
              </p>

              {activeSectionConfig[currentSectionIndex].example && (
                <div style={{ background: 'var(--bg-main)', padding: '24px', borderRadius: '12px', marginBottom: '32px', border: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', color: 'var(--text)' }}>Worked Example</h3>
                  <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-muted)', marginBottom: '16px', fontFamily: 'monospace' }}>
                    {activeSectionConfig[currentSectionIndex].example.question}
                  </div>
                  <div style={{ paddingLeft: '12px', borderLeft: '4px solid var(--primary)', color: 'var(--text)', fontSize: '0.95rem' }}>
                    <strong>Explanation:</strong> {activeSectionConfig[currentSectionIndex].example.explanation}
                  </div>
                </div>
              )}

              <button onClick={handleStartSection} className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}>
                Begin Subtest
              </button>
            </div>
          </motion.div>
        )}

        {examStage === 'break' && (
          <motion.div 
            key="break"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
          >
            <div className="premium-card" style={{ maxWidth: '600px', width: '100%', padding: '48px', background: 'var(--surface)', textAlign: 'center' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--text)' }}>Break Time</h2>
              <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '32px', fontFamily: 'monospace' }}>
                {formatTime(breakTimeLeft)}
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '40px', fontSize: '1.1rem' }}>
                Take a moment to stretch and rest your eyes before the next section.
              </p>
              
              <button onClick={startNextSection} className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}>
                Skip Break & Continue
              </button>
            </div>
          </motion.div>
        )}

        {examStage === 'calculating' && (
          <motion.div 
            key="calculating"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              style={{ width: '64px', height: '64px', borderRadius: '50%', border: '4px solid var(--border)', borderTopColor: 'var(--primary)', marginBottom: '24px' }}
            />
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text)' }}>Calculating your results...</h2>
          </motion.div>
        )}

        {examStage === 'results' && (
          <motion.div 
             key="results"
             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
             style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}
          >
            {/* Results Header */}
            <header style={{ height: '70px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', flexShrink: 0 }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--text)' }}>Mock Exam Results</div>
              <button onClick={() => setCurrentView('Dashboard')} className="btn-secondary" style={{ padding: '8px 16px' }}>
                Exit to Dashboard
              </button>
            </header>

            <div style={{ padding: '48px 10%', flex: 1 }}>
              <div className="premium-card" style={{ padding: '48px', textAlign: 'center', marginBottom: '48px', background: 'var(--surface)' }}>
                <CheckCircle size={64} style={{ color: 'var(--success)', margin: '0 auto 24px' }} />
                <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--text)', fontWeight: 'bold' }}>Test Submitted</h2>
                
                {(() => {
                  let totalScore = 0;
                  let totalQuestions = 0;
                  const sectionScores = activeSectionConfig.map(() => ({ score: 0, total: 0 }));

                  sectionsData.forEach((sectionQs, sIdx) => {
                    sectionQs.forEach((q, qIdx) => {
                      totalQuestions++;
                      sectionScores[sIdx].total++;
                      const userAns = globalAnswers[sIdx][qIdx];
                      if (userAns !== null && userAns !== '') {
                        if (q.type === 'input') {
                          if (userAns.trim().toLowerCase() === q.correct_answer.trim().toLowerCase()) {
                            totalScore++;
                            sectionScores[sIdx].score++;
                          }
                        } else {
                          if (q.options[userAns] === q.correct_answer) {
                            totalScore++;
                            sectionScores[sIdx].score++;
                          }
                        }
                      }
                    });
                  });

                  // Simulated percentile (just a mock for now, 60-99 range based on score)
                  const scorePercent = totalScore / totalQuestions;
                  const estimatedPercentile = Math.max(1, Math.min(99, Math.round((scorePercent * 100) * 0.8 + 20)));

                  return (
                    <>
                      <div style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '40px' }}>
                        You scored <strong style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>{totalScore} / {totalQuestions}</strong>
                        <div style={{ marginTop: '12px', fontSize: '1.1rem', color: 'var(--success)' }}>
                          Better than ~{estimatedPercentile}% of test-takers
                        </div>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', textAlign: 'left' }}>
                        {activeSectionConfig.map((sec, idx) => (
                          <div key={idx} style={{ padding: '24px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '12px' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>{sec.title}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text)' }}>
                              {sectionScores[idx].score} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/ {sectionScores[idx].total}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Review Section */}
              <div className="premium-card" style={{ padding: '48px', background: 'var(--surface)' }}>
                <h3 style={{ fontSize: '1.75rem', marginBottom: '24px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  Item-by-Item Review
                  {!isPremium && <Lock size={20} style={{ color: 'var(--text-muted)' }} />}
                </h3>
                
                {!isPremium ? (
                  <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <Lock size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
                    <h4 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--text)' }}>Premium Feature</h4>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
                      Upgrade to unlock comprehensive explanations and review every question to understand your mistakes.
                    </p>
                    <button className="btn-primary" onClick={() => alert('Redirect to upgrade/subscription page')}>
                      Upgrade to Premium
                    </button>
                  </div>
                ) : (
                  <div>
                     <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '12px' }}>
                        {activeSectionConfig.map((sec, idx) => (
                           <button 
                             key={idx} 
                             onClick={() => setReviewModeSection(idx)}
                             style={{ 
                               padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                               background: reviewModeSection === idx ? 'var(--primary)' : 'var(--bg-main)',
                               color: reviewModeSection === idx ? '#fff' : 'var(--text)',
                               transition: 'all 0.2s'
                             }}>
                             {sec.title}
                           </button>
                        ))}
                     </div>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {sectionsData[reviewModeSection].map((q, idx) => {
                           const userAns = globalAnswers[reviewModeSection][idx];
                           let isCorrect = false;
                           if (q.type === 'input') {
                             isCorrect = userAns && userAns.trim().toLowerCase() === q.correct_answer.trim().toLowerCase();
                           } else {
                             isCorrect = userAns !== null && q.options[userAns] === q.correct_answer;
                           }

                           return (
                             <div key={idx} style={{ padding: '24px', background: 'var(--bg-main)', border: `1px solid ${isCorrect ? 'var(--success)' : 'var(--border)'}`, borderRadius: '12px' }}>
                               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                 <strong style={{ color: 'var(--text)' }}>Question {idx + 1}</strong>
                                 <span style={{ color: isCorrect ? 'var(--success)' : 'var(--error)', fontWeight: 'bold' }}>
                                   {isCorrect ? 'Correct' : 'Incorrect'}
                                 </span>
                               </div>
                               <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text)', marginBottom: '16px' }}>{q.question}</div>
                               <div style={{ background: 'var(--surface)', padding: '16px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.95rem' }}>
                                 <div><strong>Your Answer:</strong> {q.type === 'input' ? (userAns || 'None') : (userAns !== null ? q.options[userAns] : 'None')}</div>
                                 <div style={{ marginTop: '8px' }}><strong>Correct Answer:</strong> {q.correct_answer}</div>
                               </div>
                               {q.explanation && (
                                 <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                                   <strong>Explanation:</strong> {q.explanation}
                                 </div>
                               )}
                             </div>
                           );
                        })}
                     </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {examStage === 'subtest' && currentQ && (
          <motion.div 
            key="subtest"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            {/* Minimal Header */}
            <header style={{ 
              height: '60px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', 
              justifyContent: 'space-between', padding: '0 24px', flexShrink: 0 
            }}>
              <div style={{ width: '30%', color: 'var(--text)', fontWeight: 'bold', fontSize: '0.9rem' }}>
                {activeSectionConfig[currentSectionIndex].title}
              </div>
              
              <div style={{ width: '40%', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Question {currentQIndex + 1} of {sectionsData[currentSectionIndex].length}
              </div>
              
              <div style={{ width: '30%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <div style={{ 
                  fontSize: '1.2rem', fontWeight: 'bold', fontFamily: 'monospace', 
                  color: timeLeft <= 120 ? 'var(--error)' : 'var(--text)', 
                  padding: '4px 12px', background: 'var(--bg-main)', borderRadius: '6px',
                  transition: 'color 0.3s', display: 'flex', alignItems: 'center'
                }}>
                  <Clock size={16} style={{ marginRight: '8px' }} />
                  {formatTime(timeLeft)}
                </div>
              </div>
            </header>

            {/* Main Content Area */}
            <div 
              style={{ flex: 1, display: 'flex', overflow: 'hidden', userSelect: 'none' }} 
              onCopy={preventIntegrityEvents}
              onPaste={preventIntegrityEvents}
              onContextMenu={preventIntegrityEvents}
            >
              
              {/* Testlet Passage (Left Side) */}
              {isTestlet && (
                <div style={{ width: '50%', background: 'var(--surface)', borderRight: '1px solid var(--border)', overflowY: 'auto', padding: '40px' }}>
                   <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '24px', color: 'var(--text)' }}>{currentQ.testletTitle}</h2>
                   <div style={{ fontSize: '1rem', lineHeight: '1.8', color: 'var(--text)', whiteSpace: 'pre-wrap', fontFamily: 'serif' }}>
                     {currentQ.testletPassage}
                   </div>
                </div>
              )}

              {/* Question Area */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: isTestlet ? 'var(--bg-main)' : 'var(--surface)', overflowY: 'auto' }}>
                <main style={{ flex: 1, padding: '40px 10%', maxWidth: isTestlet ? '100%' : '800px', margin: '0 auto', width: '100%' }}>
                  
                  {(() => {
                    const hasPattern = currentQ.section === 'figure_sequences' && (currentQ.question.includes('Row 1:') || currentQ.question.includes('Sequence:'));
                    const sectionAnswers = globalAnswers[currentSectionIndex];

                    return (
                      <motion.div
                        key={currentQIndex} // Animate on question change
                        initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}
                      >
                        {hasPattern ? (
                          <div style={{ marginBottom: '32px' }}>
                            <PatternDiagram text={currentQ.question} />
                          </div>
                        ) : (
                          <div style={{ fontSize: '1.15rem', whiteSpace: 'pre-wrap', lineHeight: '1.6', marginBottom: '32px', color: 'var(--text)' }}>
                            {currentQ.question}
                          </div>
                        )}

                        {currentQ.type === 'input' ? (
                          <div style={{ marginBottom: '24px' }}>
                            <input 
                              type="text" 
                              value={sectionAnswers[currentQIndex] || ''}
                              onChange={(e) => handleAnswer(e.target.value)}
                              placeholder="Type your numeric answer here..."
                              style={{
                                width: '100%', padding: '16px', fontSize: '1.25rem', background: 'var(--surface)',
                                border: '2px solid var(--border)', color: 'var(--text)', outline: 'none', borderRadius: '8px',
                                transition: 'border-color 0.2s'
                              }}
                              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                              autoComplete="off"
                            />
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {currentQ.options?.map((opt, idx) => {
                              const isSelected = sectionAnswers[currentQIndex] === idx;
                              const letter = ['A', 'B', 'C', 'D', 'E'][idx];
                              return (
                                <button
                                  key={idx}
                                  onClick={() => handleAnswer(idx)}
                                  style={{
                                    padding: '16px', background: isSelected ? 'var(--primary)' : 'var(--surface)',
                                    border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                                    borderRadius: '8px',
                                    textAlign: 'left', fontSize: '1rem', 
                                    color: isSelected ? '#fff' : 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center',
                                    transition: 'all 0.2s'
                                  }}
                                >
                                  <div style={{ 
                                    width: '28px', height: '28px', borderRadius: '50%', background: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--bg-main)',
                                    color: isSelected ? '#fff' : 'var(--text-muted)',
                                    marginRight: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                    flexShrink: 0, fontWeight: 'bold', fontSize: '0.85rem'
                                  }}>
                                    {letter}
                                  </div>
                                  {hasPattern ? (
                                    <div style={{ flex: 1, marginTop: '-8px', marginBottom: '-8px' }}>
                                      <PatternDiagram text={opt} inline={true} />
                                    </div>
                                  ) : (
                                    <span>{opt}</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </motion.div>
                    );
                  })()}

                </main>
              </div>
            </div>

            {/* Bottom Navigation Bar */}
            <div style={{ height: '70px', background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQIndex === 0}
                  className="btn-secondary" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', opacity: currentQIndex === 0 ? 0.5 : 1, border: '1px solid var(--border)', background: 'var(--bg-main)', borderRadius: '6px', color: 'var(--text)', cursor: currentQIndex === 0 ? 'not-allowed' : 'pointer' }}
                >
                  <ChevronLeft size={18} /> Prev
                </button>
                <button 
                  onClick={() => setCurrentQIndex(prev => Math.min(sectionsData[currentSectionIndex].length - 1, prev + 1))}
                  disabled={currentQIndex === sectionsData[currentSectionIndex].length - 1}
                  className="btn-secondary" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', opacity: currentQIndex === sectionsData[currentSectionIndex].length - 1 ? 0.5 : 1, border: '1px solid var(--border)', background: 'var(--bg-main)', borderRadius: '6px', color: 'var(--text)', cursor: currentQIndex === sectionsData[currentSectionIndex].length - 1 ? 'not-allowed' : 'pointer' }}
                >
                  Next <ChevronRight size={18} />
                </button>
              </div>

              {/* Question Jump Map */}
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '0 16px', flex: 1, justifyContent: 'center' }}>
                {sectionsData[currentSectionIndex].map((_, idx) => {
                  const isAnswered = globalAnswers[currentSectionIndex][idx] !== null && globalAnswers[currentSectionIndex][idx] !== '';
                  const isFlagged = flaggedQuestions[currentSectionIndex][idx];
                  const isActive = currentQIndex === idx;
                  
                  let bgColor = 'transparent';
                  let borderColor = 'var(--border)';
                  let color = 'var(--text)';

                  if (isActive) {
                    borderColor = 'var(--primary)';
                    bgColor = 'rgba(37, 99, 235, 0.1)';
                  } else if (isAnswered) {
                    bgColor = 'var(--bg-main)';
                    borderColor = 'var(--border)';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentQIndex(idx)}
                      style={{
                        width: '32px', height: '32px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s',
                        background: bgColor, border: `1px solid ${borderColor}`, color: color,
                        position: 'relative'
                      }}
                    >
                      {idx + 1}
                      {isFlagged && (
                        <div style={{ position: 'absolute', top: '-6px', right: '-6px', color: 'var(--error)' }}>
                          <Flag size={14} fill="currentColor" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <button 
                  onClick={toggleFlag}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: flaggedQuestions[currentSectionIndex][currentQIndex] ? 'var(--error)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 'bold', transition: 'color 0.2s' }}
                >
                  <Flag size={18} fill={flaggedQuestions[currentSectionIndex][currentQIndex] ? "currentColor" : "none"} /> Flag
                </button>
                
                <button 
                  onClick={handleSectionComplete}
                  className="btn-primary" style={{ padding: '8px 24px', borderRadius: '6px', fontWeight: 'bold', border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer' }}
                >
                  Submit Section
                </button>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </ErrorBoundary>
  );
};

export default DigitalSimulator;
