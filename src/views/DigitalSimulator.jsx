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
  const [serverResults, setServerResults] = useState(null);

  // Global Test State
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [examStage, setExamStage] = useState('rules'); // 'rules', 'instruction', 'subtest', 'break', 'calculating', 'results'
  const [breakTimeLeft, setBreakTimeLeft] = useState(0);
  
  // These represent the answers and flags for each section
  const [globalAnswers, setGlobalAnswers] = useState([]);
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [unverifiableSession, setUnverifiableSession] = useState(false);

  // Current Section State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  // Simulated Freemium State
  const [isPremium, setIsPremium] = useState(false); // Can be tied to Auth/Supabase later
  const [reviewModeSection, setReviewModeSection] = useState(0);

  // Tab switch tracking
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showTabWarning, setShowTabWarning] = useState(false);

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
          let mockDuration = null;
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
              const { data: mockDetails, error: mockDetailsError } = await supabase
                .from('mock_tests')
                .select('duration')
                .eq('id', selectedCoreModule)
                .single();
                
              mockDuration = mockDetails?.duration;

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
                  .select('id, question, options, section, difficulty, explanation, type:question_type, image_url')
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

          // If duration is provided in the DB, use it (divided by 3 sections). 
          // However, if it's a short mock (<= 15 questions), enforce 20 mins total. Otherwise 75 mins total (or mockDuration).
          let durationPerSection = 25 * 60;
          const displayTotalDuration = rawData.length <= 15 ? 20 : (mockDuration || 75);
          durationPerSection = Math.floor((displayTotalDuration * 60) / 3);
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
              .select('id, question, options, section, difficulty, explanation, type:question_type, image_url')
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
            const { data: coreQuestions } = await supabase.from('core_test_questions').select('id, question, options, section, difficulty, explanation, type:question_type, image_url');
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

        // Fetch active session from Supabase
        const moduleId = selectedCoreModule || selectedSubjectModule || 'core';
        let loadedState = null;
        
        try {
          const { data: sessionData, error: sessionError } = await supabase
            .from('active_test_sessions')
            .select('*')
            .eq('test_module_id', moduleId)
            .maybeSingle();

          if (sessionData) {
            // Get secure server time to verify expiry
            let serverTimeData = null;
            let retries = 2;
            while (retries >= 0) {
              const res = await supabase.rpc('get_server_time');
              if (res.data) {
                serverTimeData = res.data;
                break;
              }
              if (retries === 0) break;
              await new Promise(r => setTimeout(r, 1000));
              retries--;
            }
            
            if (!serverTimeData) {
              // Critical Failure: Could not fetch server time
              setUnverifiableSession(true);
              setLoading(false);
              return; // Halt execution
            }

            const serverTime = new Date(serverTimeData).getTime();
            
            const updatedAt = new Date(sessionData.updated_at).getTime();
            
            // 120-minute expiry window check
            if (serverTime - updatedAt > 120 * 60 * 1000) {
              await supabase.from('active_test_sessions').delete().eq('id', sessionData.id);
            } else {
              loadedState = {
                 ...sessionData,
                 globalAnswers: sessionData.answers,
                 flaggedQuestions: sessionData.flagged_questions,
                 currentSectionIndex: sessionData.current_section_index,
                 currentQIndex: sessionData.current_q_index,
              };
              
              if (sessionData.tab_switch_count) {
                 setTabSwitchCount(sessionData.tab_switch_count);
              }

              if (sessionData.section_end_time) {
                 const endTime = new Date(sessionData.section_end_time).getTime();
                 const remaining = Math.max(0, Math.floor((endTime - serverTime) / 1000));
                 loadedState.timeLeft = remaining;
                 loadedState.examStage = remaining > 0 ? 'subtest' : 'section_loading';
              } else {
                 loadedState.examStage = 'rules';
              }
            }
          }
        } catch (e) {
          console.warn('Failed to fetch active session from Supabase', e);
        }

        setActiveSectionConfig(config);
        setSectionsData(grouped);
        
        if (loadedState) {
           setGlobalAnswers(loadedState.globalAnswers || grouped.map(sec => new Array(sec.length).fill(null)));
           setFlaggedQuestions(loadedState.flaggedQuestions || grouped.map(sec => new Array(sec.length).fill(false)));
           setCurrentSectionIndex(loadedState.currentSectionIndex || 0);
           setCurrentQIndex(loadedState.currentQIndex || 0);
           setExamStage(loadedState.examStage || 'rules');
           if (loadedState.timeLeft !== undefined) {
             setTimeLeft(loadedState.timeLeft);
             if (loadedState.timeLeft === 0 && loadedState.examStage === 'section_loading') {
               // Auto-submit/advance if time expired while away
               setTimeout(() => {
                 if (loadedState.currentSectionIndex === config.length - 1) {
                   finishExam(loadedState.globalAnswers); // Passed directly to avoid state race
                 } else {
                   const nextIdx = loadedState.currentSectionIndex + 1;
                   setCurrentSectionIndex(nextIdx);
                   setCurrentQIndex(0);
                   setExamStage('instruction');
                 }
               }, 400);
             }
           }
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

  // Auto-save State to Supabase
  useEffect(() => {
    if (loading || error || examStage === 'results' || activeSectionConfig.length === 0) return;
    if (examStage === 'rules') return; // Don't persist until they actually start
    
    const saveToSupabase = async () => {
      const moduleId = localStorage.getItem('selectedDigitalModule') || localStorage.getItem('selectedDigitalSubjectModule') || 'core';
      try {
        await supabase.rpc('save_session_progress', {
          p_module_id: moduleId,
          p_current_section_index: currentSectionIndex,
          p_current_q_index: currentQIndex,
          p_answers: globalAnswers,
          p_flagged_questions: flaggedQuestions,
          p_tab_switch_count: tabSwitchCount
        });
      } catch(e) {
        console.warn('Failed to autosave session to Supabase', e);
      }
    };
    
    // Debounce saves slightly to prevent spamming on rapid clicks
    const timeoutId = setTimeout(saveToSupabase, 1000);
    return () => clearTimeout(timeoutId);
  }, [globalAnswers, flaggedQuestions, currentSectionIndex, currentQIndex, activeSectionConfig, loading, error]);

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
    
    const handleFocusLoss = () => {
       if (examStage === 'subtest') {
         setTabSwitchCount(c => c + 1);
         setShowTabWarning(true);
         setTimeout(() => setShowTabWarning(false), 5000);
       }
    };
    
    const handleVisibilityChange = () => {
      if (document.hidden) handleFocusLoss();
    };

    window.addEventListener('blur', handleFocusLoss);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('blur', handleFocusLoss);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
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
    setExamStage('section_loading');
    setTimeout(() => {
      if (currentSectionIndex === activeSectionConfig.length - 1) {
        finishExam();
      } else {
        startNextSection();
      }
    }, 400);
  };

  const finishExam = async (overrideAnswers = null) => {
    setExamStage('calculating');
    const finalAnswers = overrideAnswers || globalAnswers;
    
    const formattedAnswers = [];
    sectionsData.forEach((sectionQs, sIdx) => {
      sectionQs.forEach((q, qIdx) => {
        formattedAnswers.push({
          question_id: q.id,
          selected_answer: finalAnswers[sIdx] ? finalAnswers[sIdx][qIdx] : null
        });
      });
    });

    try {
      const selectedCoreModule = localStorage.getItem('selectedDigitalModule');
      
      const { data, error } = await supabase.functions.invoke('submit-test', {
        body: { mock_test_id: selectedCoreModule, answers: formattedAnswers }
      });
      
      if (error) throw error;
      
      setServerResults(data);
      
      const updatedSectionsData = [...sectionsData];
      data.question_results.forEach(res => {
        for (let sIdx = 0; sIdx < updatedSectionsData.length; sIdx++) {
           const qIndex = updatedSectionsData[sIdx].findIndex(q => q.id === res.question_id);
           if (qIndex !== -1) {
             updatedSectionsData[sIdx][qIndex] = {
               ...updatedSectionsData[sIdx][qIndex],
               correct_answer: res.correct_answer,
               explanation: res.explanation
             };
             break;
           }
        }
      });
      setSectionsData(updatedSectionsData);

      // Clean up the active session securely
      const moduleId = selectedCoreModule || localStorage.getItem('selectedDigitalSubjectModule') || 'core';
      await supabase.rpc('delete_active_session', { p_module_id: moduleId });
      
      trackEvent('mock_completed', {
        examName: activeSectionConfig.length > 1 ? 'Digital Core Test Mock' : 'Digital Subject Test Mock',
        score: data.score,
        totalQuestions: formattedAnswers.length
      });
      
      setExamStage('results');
      
      // Store tab switch count locally for EndTestScreen if it's decoupled
      if (tabSwitchCount > 0) {
        localStorage.setItem('last_exam_tab_switches', tabSwitchCount.toString());
      } else {
        localStorage.removeItem('last_exam_tab_switches');
      }
    } catch(err) {
      console.error("Failed to submit test:", err);
      alert("Failed to submit test results. Please try again.");
      setExamStage('subtest');
    }
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

  const handleStartSection = async () => {
    setExamStage('subtest');
    const duration = activeSectionConfig[currentSectionIndex].duration;
    setTimeLeft(duration);
    
    const moduleId = localStorage.getItem('selectedDigitalModule') || localStorage.getItem('selectedDigitalSubjectModule') || 'core';
    try {
      // Use the RPC to securely set section_end_time on the server (duration calculated on backend)
      await supabase.rpc('start_subtest_timer', { p_module_id: moduleId });
    } catch(e) {
      console.error('Failed to start secure subtest timer', e);
    }
  };

  const preventIntegrityEvents = (e) => {
    e.preventDefault();
    return false;
  };

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', color: 'var(--ink-primary)' }}>
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        style={{ width: '64px', height: '64px', borderRadius: '50%', border: '4px solid var(--border-hairline)', borderTopColor: 'var(--accent-primary)', marginBottom: '24px' }}
      />
      <h2 style={{ fontSize: '1.25rem', color: 'var(--ink-muted)' }}>Loading Test Environment...</h2>
    </div>
  );
  if (error) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', color: 'var(--accent-danger)' }}>{error}</div>;

  const currentQ = sectionsData[currentSectionIndex] ? sectionsData[currentSectionIndex][currentQIndex] : null;
  const isTestlet = currentQ ? !!currentQ.testletPassage : false;

  // Render different stages
  if (unverifiableSession) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-base)', fontFamily: 'sans-serif' }}>
        <AlertCircle size={48} color="var(--coral)" style={{ marginBottom: '16px' }} />
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', fontSize: '1.5rem', marginBottom: '8px' }}>Session Unverifiable</h2>
        <p style={{ color: 'var(--ink-muted)', marginBottom: '24px', textAlign: 'center', maxWidth: '400px', lineHeight: '1.6' }}>
          We could not securely verify your timer with the server. Please check your internet connection and try again.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-base)', fontFamily: 'sans-serif', position: 'relative' }}>
      
      <AnimatePresence>
        {showTabWarning && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            style={{
              position: 'absolute',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--coral)',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(228, 87, 74, 0.3)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <AlertCircle size={20} />
            Tab-switching or losing focus is tracked, matching real exam conditions.
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        
        {examStage === 'rules' && (
          <motion.div 
            key="rules"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
          >
            <div className="premium-card" style={{ maxWidth: '600px', width: '100%', padding: '48px', background: 'var(--surface)', textAlign: 'center' }}>
              <AlertCircle size={48} style={{ color: 'var(--accent-primary)', margin: '0 auto 24px' }} />
              <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--ink-primary)' }}>Exam Rules</h2>
              <div style={{ textAlign: 'left', marginBottom: '32px', color: 'var(--ink-muted)' }}>
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
              <h2 style={{ fontSize: '1.75rem', marginBottom: '16px', color: 'var(--ink-primary)', fontWeight: 'bold' }}>
                Instructions: {activeSectionConfig[currentSectionIndex].title}
              </h2>
              <p style={{ color: 'var(--ink-muted)', fontSize: '1.1rem', marginBottom: '32px', lineHeight: '1.6' }}>
                {activeSectionConfig[currentSectionIndex].rules}
              </p>

              {activeSectionConfig[currentSectionIndex].example && (
                <div style={{ background: 'var(--bg-base)', padding: '24px', borderRadius: '12px', marginBottom: '32px', border: '1px solid var(--border-hairline)' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', color: 'var(--ink-primary)' }}>Worked Example</h3>
                  <div style={{ whiteSpace: 'pre-wrap', color: 'var(--ink-muted)', marginBottom: '16px', fontFamily: 'monospace' }}>
                    {activeSectionConfig[currentSectionIndex].example.question}
                  </div>
                  <div style={{ paddingLeft: '12px', borderLeft: '4px solid var(--accent-primary)', color: 'var(--ink-primary)', fontSize: '0.95rem' }}>
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

        {examStage === 'section_loading' && (
          <motion.div 
            key="section_loading"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
            style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                style={{ width: '48px', height: '48px', border: '4px solid var(--border-hairline)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', marginBottom: '24px' }}
              />
              <h2 style={{ color: 'var(--ink-muted)', fontSize: '1.25rem', letterSpacing: '0.5px' }}>Loading next section...</h2>
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
              <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--ink-primary)' }}>Break Time</h2>
              <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: '32px', fontFamily: 'monospace' }}>
                {formatTime(breakTimeLeft)}
              </div>
              <p style={{ color: 'var(--ink-muted)', marginBottom: '40px', fontSize: '1.1rem' }}>
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
              style={{ width: '64px', height: '64px', borderRadius: '50%', border: '4px solid var(--border-hairline)', borderTopColor: 'var(--accent-primary)', marginBottom: '24px' }}
            />
            <h2 style={{ fontSize: '1.5rem', color: 'var(--ink-primary)' }}>Calculating your results...</h2>
          </motion.div>
        )}

        {examStage === 'results' && (
          <motion.div 
             key="results"
             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
             style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}
          >
            {/* Results Header */}
            <header style={{ height: '70px', background: 'var(--surface)', borderBottom: '1px solid var(--border-hairline)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', flexShrink: 0 }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--ink-primary)' }}>Mock Exam Results</div>
              <button onClick={() => setCurrentView('Dashboard')} className="btn-secondary" style={{ padding: '8px 16px' }}>
                Exit to Dashboard
              </button>
            </header>

            <div style={{ padding: '48px 10%', flex: 1 }}>
              <div className="premium-card" style={{ padding: '48px', textAlign: 'center', marginBottom: '48px', background: 'var(--surface)' }}>
                <CheckCircle size={64} style={{ color: 'var(--success)', margin: '0 auto 24px' }} />
                <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--ink-primary)', fontWeight: 'bold' }}>Test Submitted</h2>
                
                {serverResults && (() => {
                  const totalScore = serverResults.score;
                  const totalQuestions = serverResults.question_results.length;
                  const sectionScores = serverResults.section_breakdown;

                  // Simulated percentile (just a mock for now, 60-99 range based on score)
                  const scorePercent = totalScore / totalQuestions;
                  const estimatedPercentile = Math.max(1, Math.min(99, Math.round((scorePercent * 100) * 0.8 + 20)));

                  return (
                    <>
                      {tabSwitchCount > 0 && (
                        <div style={{ background: 'rgba(228, 87, 74, 0.1)', color: 'var(--coral)', padding: '12px 24px', borderRadius: '8px', marginBottom: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                          <AlertCircle size={20} />
                          {tabSwitchCount} tab {tabSwitchCount === 1 ? 'switch' : 'switches'} detected during exam
                        </div>
                      )}
                      <div style={{ fontSize: '1.25rem', color: 'var(--ink-muted)', marginBottom: '40px' }}>
                        You scored <strong style={{ color: 'var(--accent-primary)', fontSize: '1.5rem' }}>{totalScore} / {totalQuestions}</strong>
                        <div style={{ marginTop: '12px', fontSize: '1.1rem', color: 'var(--success)' }}>
                          Better than ~{estimatedPercentile}% of test-takers
                        </div>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', textAlign: 'left' }}>
                        {sectionScores.map((sec, idx) => (
                          <div key={idx} style={{ padding: '24px', background: 'var(--bg-base)', border: '1px solid var(--border-hairline)', borderRadius: '12px' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--ink-muted)', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>{sec.section}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--ink-primary)' }}>
                              {sec.correct} <span style={{ fontSize: '1rem', color: 'var(--ink-muted)', fontWeight: 'normal' }}>/ {sec.total}</span>
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
                <h3 style={{ fontSize: '1.75rem', marginBottom: '24px', color: 'var(--ink-primary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  Item-by-Item Review
                  {!isPremium && <Lock size={20} style={{ color: 'var(--ink-muted)' }} />}
                </h3>
                
                {!isPremium ? (
                  <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--bg-base)', borderRadius: '12px', border: '1px solid var(--border-hairline)' }}>
                    <Lock size={48} style={{ color: 'var(--ink-muted)', margin: '0 auto 16px' }} />
                    <h4 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--ink-primary)' }}>Premium Feature</h4>
                    <p style={{ color: 'var(--ink-muted)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
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
                               background: reviewModeSection === idx ? 'var(--accent-primary)' : 'var(--bg-base)',
                               color: reviewModeSection === idx ? '#fff' : 'var(--ink-primary)',
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
                             <div key={idx} style={{ padding: '24px', background: 'var(--bg-base)', border: `1px solid ${isCorrect ? 'var(--success)' : 'var(--border-hairline)'}`, borderRadius: '12px' }}>
                               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                 <strong style={{ color: 'var(--ink-primary)' }}>Question {idx + 1}</strong>
                                 <span style={{ color: isCorrect ? 'var(--success)' : 'var(--accent-danger)', fontWeight: 'bold' }}>
                                   {isCorrect ? 'Correct' : 'Incorrect'}
                                 </span>
                               </div>
                               <div style={{ whiteSpace: 'pre-wrap', color: 'var(--ink-primary)', marginBottom: '16px' }}>{q.question}</div>
                               <div style={{ background: 'var(--surface)', padding: '16px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.95rem' }}>
                                 <div><strong>Your Answer:</strong> {q.type === 'input' ? (userAns || 'None') : (userAns !== null ? q.options[userAns] : 'None')}</div>
                                 <div style={{ marginTop: '8px' }}><strong>Correct Answer:</strong> {q.correct_answer}</div>
                               </div>
                               {q.explanation && (
                                 <div style={{ fontSize: '0.95rem', color: 'var(--ink-muted)' }}>
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
              height: '70px', background: 'var(--surface)', borderBottom: '1px solid var(--border-hairline)', display: 'flex', alignItems: 'center', 
              justifyContent: 'space-between', padding: '0 32px', flexShrink: 0 
            }}>
              <div style={{ width: '30%', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--ink-muted)', fontWeight: 'bold' }}>
                  {isTestlet ? 'Subject Module' : 'Core Module'}
                </span>
                <span style={{ color: 'var(--ink-primary)', fontWeight: 600, fontSize: '1.05rem' }}>
                  {activeSectionConfig[currentSectionIndex].title}
                </span>
              </div>
              
              <div style={{ width: '40%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'var(--ink-muted)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Question {currentQIndex + 1} of {sectionsData[currentSectionIndex].length}
                </div>
                <div style={{ width: '200px', height: '4px', background: 'var(--border-hairline)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${((currentQIndex + 1) / sectionsData[currentSectionIndex].length) * 100}%`, height: '100%', background: 'var(--accent-primary)', transition: 'width 0.3s ease-out' }} />
                </div>
              </div>
              
              <div style={{ width: '30%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <div style={{ 
                  fontSize: '1.1rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums', 
                  color: timeLeft <= 120 ? '#FFFFFF' : 'var(--ink-primary)', 
                  padding: '6px 16px', background: timeLeft <= 120 ? 'var(--accent-danger)' : 'var(--bg-base)', borderRadius: '6px',
                  transition: 'all 0.3s', display: 'flex', alignItems: 'center', pointerEvents: 'none'
                }}>
                  <Clock size={16} style={{ marginRight: '8px', opacity: timeLeft <= 120 ? 1 : 0.7 }} />
                  {formatTime(timeLeft)}
                </div>
              </div>
            </header>

            {/* Horizontal Wrapper for Content + Sidebar */}
            <div 
              style={{ flex: 1, display: 'flex', overflow: 'hidden', userSelect: 'none' }} 
              onCopy={preventIntegrityEvents}
              onPaste={preventIntegrityEvents}
              onContextMenu={preventIntegrityEvents}
            >
              
              {/* Main Content Area */}
              <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                
                {/* Testlet Passage (Left Side) */}
                {isTestlet && (
                  <div style={{ width: '50%', background: 'var(--surface)', borderRight: '1px solid var(--border-hairline)', overflowY: 'auto', padding: '40px' }}>
                     <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '24px', color: 'var(--ink-primary)' }}>{currentQ.testletTitle}</h2>
                     <div style={{ fontSize: '1rem', lineHeight: '1.8', color: 'var(--ink-primary)', whiteSpace: 'pre-wrap', fontFamily: 'serif' }}>
                       {currentQ.testletPassage}
                     </div>
                  </div>
                )}

                {/* Question Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: isTestlet ? 'var(--bg-base)' : 'var(--surface)', overflowY: 'auto' }}>
                  <main style={{ flex: 1, padding: '40px 10%', maxWidth: isTestlet ? '100%' : '800px', margin: '0 auto', width: '100%' }}>
                    
                    {(() => {
                      const hasPattern = currentQ.section === 'figure_sequences' && (currentQ.question.includes('Row 1:') || currentQ.question.includes('Sequence:'));
                      const sectionAnswers = globalAnswers[currentSectionIndex];

                      return (
                        <motion.div
                          key={currentQIndex} // Animate on question change
                          initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.15 }}
                        >
                          {hasPattern ? (
                            <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'center' }}>
                              <PatternDiagram text={currentQ.question} />
                            </div>
                          ) : (
                            <div style={{ fontSize: '1.15rem', whiteSpace: 'pre-wrap', lineHeight: '1.6', marginBottom: '32px', color: 'var(--ink-primary)' }}>
                              {currentQ.question}
                            </div>
                          )}

                          {currentQ.type === 'input' ? (
                            <div style={{ marginBottom: '24px' }}>
                              <input 
                                type="text" 
                                inputMode="numeric"
                                value={sectionAnswers[currentQIndex] || ''}
                                onChange={(e) => handleAnswer(e.target.value)}
                                placeholder="Type your numeric answer here..."
                                style={{
                                  width: '100%', padding: '20px', fontSize: '1.5rem', background: 'var(--surface)', textAlign: 'center',
                                  border: '2px solid var(--border-hairline)', color: 'var(--ink-primary)', outline: 'none', borderRadius: '8px',
                                  transition: 'border-color 0.2s', fontWeight: 'bold'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border-hairline)'}
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
                                      padding: '16px 20px', background: isSelected ? 'var(--accent-primary)' : 'var(--surface)',
                                      border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-hairline)'}`,
                                      borderRadius: '8px',
                                      textAlign: 'left', fontSize: '1rem', 
                                      color: isSelected ? '#fff' : 'var(--ink-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center',
                                      transition: 'all 0.15s', outline: 'none'
                                    }}
                                    onFocus={(e) => {
                                      if(!isSelected) e.currentTarget.style.borderColor = 'var(--accent-primary)';
                                      e.currentTarget.style.boxShadow = '0 0 0 2px rgba(30, 78, 140, 0.2)';
                                    }}
                                    onBlur={(e) => {
                                      if(!isSelected) e.currentTarget.style.borderColor = 'var(--border-hairline)';
                                      e.currentTarget.style.boxShadow = 'none';
                                    }}
                                  >
                                    <div style={{ 
                                      width: '28px', height: '28px', borderRadius: '50%', background: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--bg-base)',
                                      color: isSelected ? '#fff' : 'var(--ink-muted)',
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

              {/* Right Sidebar Navigation */}
              <aside style={{ width: '320px', background: 'var(--surface)', borderLeft: '1px solid var(--border-hairline)', display: 'flex', flexDirection: 'column', padding: '24px', flexShrink: 0 }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <button 
                    onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQIndex === 0}
                    title={currentQIndex === 0 ? "You are on the first question" : "Previous Question"}
                    style={{ flex: 1, padding: '12px 16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', border: '1px solid var(--border-hairline)', background: 'var(--bg-base)', borderRadius: '6px 0 0 6px', color: currentQIndex === 0 ? 'var(--ink-muted)' : 'var(--ink-primary)', cursor: currentQIndex === 0 ? 'not-allowed' : 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
                  >
                    <ChevronLeft size={18} /> Prev
                  </button>
                  <button 
                    onClick={() => setCurrentQIndex(prev => Math.min(sectionsData[currentSectionIndex].length - 1, prev + 1))}
                    disabled={currentQIndex === sectionsData[currentSectionIndex].length - 1}
                    title={currentQIndex === sectionsData[currentSectionIndex].length - 1 ? "You are on the last question" : "Next Question"}
                    style={{ flex: 1, padding: '12px 16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', border: '1px solid var(--border-hairline)', borderLeft: 'none', background: 'var(--bg-base)', borderRadius: '0 6px 6px 0', color: currentQIndex === sectionsData[currentSectionIndex].length - 1 ? 'var(--ink-muted)' : 'var(--ink-primary)', cursor: currentQIndex === sectionsData[currentSectionIndex].length - 1 ? 'not-allowed' : 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
                  >
                    Next <ChevronRight size={18} />
                  </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '12px', letterSpacing: '0.5px' }}>Question Overview</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                    {sectionsData[currentSectionIndex].map((_, idx) => {
                      const isAnswered = globalAnswers[currentSectionIndex][idx] !== null && globalAnswers[currentSectionIndex][idx] !== '';
                      const isFlagged = flaggedQuestions[currentSectionIndex][idx];
                      const isActive = currentQIndex === idx;
                      
                      let bgColor = 'var(--surface)';
                      let borderColor = 'var(--border-hairline)';
                      let color = 'var(--ink-primary)';

                      if (isAnswered) {
                        bgColor = 'var(--accent-primary)';
                        borderColor = 'var(--accent-primary)';
                        color = '#fff';
                      }
                      
                      if (isActive) {
                        borderColor = 'var(--ink-primary)';
                        if (!isAnswered) {
                          bgColor = 'var(--bg-base)';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => setCurrentQIndex(idx)}
                          tabIndex={0}
                          style={{
                            aspectRatio: '1', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.1s',
                            background: bgColor, border: isActive ? `2px solid ${borderColor}` : `1px solid ${borderColor}`, color: color,
                            position: 'relative', outline: 'none'
                          }}
                          onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px rgba(30, 78, 140, 0.3)'}
                          onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
                        >
                          {idx + 1}
                          {isFlagged && (
                            <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '10px', height: '10px', background: 'var(--accent-flag)', borderRadius: '50%', border: '2px solid var(--surface)' }} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button 
                    onClick={toggleFlag}
                    style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--bg-base)', border: '1px solid var(--border-hairline)', borderRadius: '6px', color: flaggedQuestions[currentSectionIndex][currentQIndex] ? 'var(--accent-flag)' : 'var(--ink-primary)', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
                  >
                    <Flag size={18} fill={flaggedQuestions[currentSectionIndex][currentQIndex] ? "currentColor" : "none"} /> 
                    {flaggedQuestions[currentSectionIndex][currentQIndex] ? 'Remove Flag' : 'Flag for Review'}
                  </button>
                  
                  <button 
                    onClick={() => setShowSubmitModal(true)}
                    style={{ padding: '16px', borderRadius: '6px', fontWeight: 'bold', border: 'none', background: 'var(--accent-primary)', color: '#fff', cursor: 'pointer', fontSize: '1rem', transition: 'background 0.2s' }}
                  >
                    Submit Section
                  </button>
                </div>
              </aside>
            </div>

            {/* Submit Confirmation Modal */}
            <AnimatePresence>
              {showSubmitModal && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ position: 'fixed', inset: 0, background: 'rgba(27, 36, 48, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}
                >
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                    style={{ background: 'var(--surface)', padding: '40px', borderRadius: '8px', maxWidth: '480px', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
                  >
                    <h2 style={{ fontSize: '1.5rem', color: 'var(--ink-primary)', marginBottom: '16px', fontWeight: 'bold' }}>Submit Section?</h2>
                    
                    <p style={{ color: 'var(--ink-primary)', marginBottom: '24px', lineHeight: 1.6 }}>
                      You are about to submit <strong>{activeSectionConfig[currentSectionIndex].title}</strong>. You will not be able to return to this section once submitted.
                    </p>

                    {(() => {
                      const unansweredCount = sectionsData[currentSectionIndex].length - globalAnswers[currentSectionIndex].filter(a => a !== null && a !== '').length;
                      if (unansweredCount > 0) {
                        return (
                          <div style={{ padding: '16px', background: 'rgba(184, 134, 43, 0.1)', borderLeft: '4px solid var(--accent-flag)', color: 'var(--ink-primary)', marginBottom: '32px', borderRadius: '0 4px 4px 0' }}>
                            <strong>Warning:</strong> You have {unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''} in this section.
                          </div>
                        );
                      }
                      return <div style={{ marginBottom: '32px' }} />;
                    })()}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                      <button 
                        onClick={() => setShowSubmitModal(false)}
                        style={{ padding: '12px 24px', background: 'transparent', border: '1px solid var(--border-hairline)', borderRadius: '6px', color: 'var(--ink-primary)', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Return to Test
                      </button>
                      <button 
                        onClick={() => { setShowSubmitModal(false); handleSectionComplete(); }}
                        style={{ padding: '12px 24px', background: 'var(--accent-primary)', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Confirm Submission
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </ErrorBoundary>
  );
};

export default DigitalSimulator;
