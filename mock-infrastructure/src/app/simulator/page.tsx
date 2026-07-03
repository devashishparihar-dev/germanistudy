"use client";

import React, { useState, useEffect } from 'react';
import { Flag, CheckCircle, ChevronLeft, ChevronRight, PenTool } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SimulatorPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [flagged, setFlagged] = useState<boolean[]>([]);
  const [visited, setVisited] = useState<boolean[]>([]);
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45 * 60);

  useEffect(() => {
    // Fetch mock test by ID
    const fetchMockTest = async () => {
      try {
        const res = await fetch(`/api/mock-tests/1`); // Hardcoding 1 for now, or use params.id
        const json = await res.json();
        // Since we are mocking without real data, let's setup dummy if empty
        if (json?.mock_test_questions?.length > 0) {
          const fetchedQuestions = json.mock_test_questions.map((mtq: any) => mtq.core_test_questions);
          setQuestions(fetchedQuestions);
          setAnswers(new Array(fetchedQuestions.length).fill(null));
          setFlagged(new Array(fetchedQuestions.length).fill(false));
          setVisited(new Array(fetchedQuestions.length).fill(false));
        } else {
          // Dummy data for preview if no DB data
          const dummy = Array.from({ length: 22 }).map((_, i) => ({
            id: i + 1,
            question: `[Placeholder for Question ${i + 1} Text]\n\nThis area will display the actual question text and diagrams when real data is loaded.`,
            options: ["[A] Placeholder Option A", "[B] Placeholder Option B", "[C] Placeholder Option C", "[D] Placeholder Option D"],
          }));
          setQuestions(dummy);
          setAnswers(new Array(dummy.length).fill(null));
          setFlagged(new Array(dummy.length).fill(false));
          setVisited(new Array(dummy.length).fill(false));
        }
      } catch (error) {
        console.error("Error fetching mock test:", error);
      }
      setLoading(false);
    };
    
    fetchMockTest();
  }, []);

  useEffect(() => {
    if (isFinished || loading) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished, loading]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (questions.length === 0) return;
    const newVisited = [...visited];
    newVisited[currentQIndex] = true;
    setVisited(newVisited);
  }, [currentQIndex, questions.length]);

  const handleAnswer = (idx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQIndex] = idx;
    setAnswers(newAnswers);
    // Auto-save logic could be added here
  };

  const toggleFlag = () => {
    const newFlagged = [...flagged];
    newFlagged[currentQIndex] = !newFlagged[currentQIndex];
    setFlagged(newFlagged);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">Loading simulator...</div>;

  const unansweredCount = answers.filter(a => a === null).length;
  const flaggedCount = flagged.filter(f => f).length;
  const isTimeCritical = timeLeft < 300;

  if (isFinished) {
    return (
      <div className="flex flex-col h-screen bg-gray-50 items-center justify-center">
        <div className="bg-white p-12 rounded-2xl shadow-xl text-center max-w-2xl w-full border border-gray-100">
          <CheckCircle size={80} className="text-green-500 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Exam Completed</h2>
          <p className="text-gray-500 mb-8 text-lg">Your answers have been securely saved.</p>
          <div className="flex gap-4 justify-center">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium transition-colors" onClick={() => router.push('/')}>Exit</button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-sm transition-colors" onClick={() => router.push('/results')}>View Analytics</button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentQIndex];

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] text-gray-900 overflow-hidden font-sans">
      {/* Header */}
      <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 sticky top-0 z-10 shadow-sm">
        <div className="w-1/3 font-bold text-xl text-blue-700 tracking-tight">
          Germanistudy
        </div>
        <div className="w-1/3 text-center font-semibold text-lg text-gray-800">
          Core Test Mock 1
        </div>
        <div className="w-1/3 flex justify-end">
          <div className={`text-3xl font-bold font-mono tracking-wider ${isTimeCritical ? 'text-red-600 animate-pulse' : 'text-gray-800'}`}>
            {formatTime(timeLeft)}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Main Content */}
        <main className="flex-1 flex flex-col relative overflow-y-auto">
          {showConfirm && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-8 w-[450px] text-center shadow-2xl animate-in zoom-in-95 duration-200">
                <h3 className="text-2xl font-bold mb-4">Submit Test?</h3>
                <div className="bg-gray-50 p-4 rounded-xl mb-6">
                  <p className="text-gray-600 mb-2">You still have:</p>
                  <p className="font-bold text-red-500 text-lg mb-1">{unansweredCount} unanswered</p>
                  <p className="font-bold text-orange-500 text-lg">{flaggedCount} flagged</p>
                </div>
                <div className="flex gap-4 justify-center">
                  <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-xl font-medium transition-colors" onClick={() => setShowConfirm(false)}>Continue</button>
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-medium shadow-sm transition-colors" onClick={() => setIsFinished(true)}>Submit Final</button>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 px-[10%] py-12 flex flex-col max-w-5xl mx-auto w-full">
            <div className="text-lg font-bold text-blue-600 mb-6 uppercase tracking-wider">Question {currentQIndex + 1} of {questions.length}</div>
            
            <div className="text-xl whitespace-pre-wrap leading-relaxed mb-10 text-gray-800 font-medium">
              {q.question}
            </div>

            {q.image_url && (
              <div className="mb-10 max-w-md bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <img src={q.image_url} alt="Question Diagram" className="w-full h-auto" />
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 mt-auto">
              {q.options.map((opt: string, idx: number) => {
                const isSelected = answers[currentQIndex] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full p-6 rounded-xl text-left text-lg transition-all flex items-center group
                      ${isSelected 
                        ? 'bg-blue-50 border-2 border-blue-600 text-blue-900 shadow-sm' 
                        : 'bg-white border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50/30'}`}
                  >
                    <div className={`w-7 h-7 rounded-full border-2 mr-6 flex items-center justify-center flex-shrink-0 transition-colors
                      ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}>
                      {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                    </div>
                    <span className="leading-relaxed">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Footer Navigation */}
          <div className="flex justify-between items-center px-[10%] py-6 border-t border-gray-200 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <button 
              className="px-6 py-3 rounded-xl font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
              onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))} 
              disabled={currentQIndex === 0}
            >
              <ChevronLeft size={20} /> Previous
            </button>
            
            <div className="flex gap-4">
              <button 
                className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors border-2
                  ${flagged[currentQIndex] ? 'bg-orange-50 border-orange-400 text-orange-700' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'}`}
                onClick={toggleFlag} 
              >
                <Flag size={20} className={flagged[currentQIndex] ? 'fill-orange-400 text-orange-400' : 'text-gray-500'} /> 
                {flagged[currentQIndex] ? 'Flagged' : 'Flag Question'}
              </button>
            </div>

            {currentQIndex === questions.length - 1 ? (
              <button className="px-8 py-3 rounded-xl font-bold bg-green-600 hover:bg-green-700 text-white shadow-sm transition-colors" onClick={() => setShowConfirm(true)}>
                Submit Test
              </button>
            ) : (
              <button 
                className="px-8 py-3 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-2 transition-colors" 
                onClick={() => setCurrentQIndex(prev => Math.min(questions.length - 1, prev + 1))}
              >
                Next <ChevronRight size={20} />
              </button>
            )}
          </div>
        </main>

        {/* Sidebar */}
        <aside className="w-80 border-l border-gray-200 bg-white flex flex-col flex-shrink-0 z-10 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">Question Navigator</h3>
            <div className="flex flex-col gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-3"><div className="w-5 h-5 rounded bg-gray-100 border border-gray-200"></div> Unanswered</div>
              <div className="flex items-center gap-3"><div className="w-5 h-5 rounded bg-blue-600"></div> Answered</div>
              <div className="flex items-center gap-3"><div className="w-5 h-5 rounded bg-orange-500"></div> Flagged</div>
            </div>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-5 gap-2.5">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentQIndex;
                const isAnswered = answers[idx] !== null;
                const isFlagged = flagged[idx];
                
                let bgColor = 'bg-gray-100';
                let textColor = 'text-gray-500';
                let borderColor = 'border-gray-200';

                if (isFlagged) {
                  bgColor = 'bg-orange-500';
                  textColor = 'text-white';
                  borderColor = 'border-orange-600';
                } else if (isAnswered) {
                  bgColor = 'bg-blue-600';
                  textColor = 'text-white';
                  borderColor = 'border-blue-700';
                }

                if (isCurrent) {
                  borderColor = 'border-gray-900';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentQIndex(idx)}
                    className={`aspect-square rounded-lg border-2 font-bold text-sm flex items-center justify-center transition-transform hover:scale-105 active:scale-95 ${bgColor} ${textColor} ${borderColor}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
