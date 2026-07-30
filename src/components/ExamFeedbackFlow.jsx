import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { CheckCircle, AlertCircle, Send, X, Star } from 'lucide-react';

const ExamFeedbackFlow = ({ examId, examName, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [feedback, setFeedback] = useState({
    difficultyRating: 0,
    timeManagement: 'just_right', // too_short, just_right, too_long
    topicsEncountered: '',
    memoryRecall: '',
    generalComments: ''
  });

  const handleRating = (rating) => {
    setFeedback({ ...feedback, difficultyRating: rating });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error: insertError } = await supabase
        .from('dmat_exam_feedback')
        .insert([{
          user_id: user?.id,
          exam_id: examId,
          exam_name: examName,
          difficulty_rating: feedback.difficultyRating,
          time_management: feedback.timeManagement,
          topics_encountered: feedback.topicsEncountered,
          memory_recall: feedback.memoryRecall,
          general_comments: feedback.generalComments
        }]);
      
      if (insertError) throw insertError;
      
      setStep(4); // Success step
      setTimeout(() => {
        if (onComplete) onComplete();
        if (onClose) onClose();
      }, 3000);

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="premium-card"
        style={{ width: '100%', maxWidth: '600px', background: 'var(--surface)', padding: '40px', position: 'relative', overflow: 'hidden' }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={24} />
        </button>

        {error && (
          <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={20} /> {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>How was the mock exam?</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Your feedback helps us calibrate the dMAT simulator.</p>
              
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600, color: 'var(--text)' }}>Overall Difficulty</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star} 
                      onClick={() => handleRating(star)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                    >
                      <Star size={32} fill={feedback.difficultyRating >= star ? 'var(--primary)' : 'none'} color={feedback.difficultyRating >= star ? 'var(--primary)' : 'var(--border)'} />
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600, color: 'var(--text)' }}>Time Management</label>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {[
                    { id: 'too_short', label: 'Not enough time' },
                    { id: 'just_right', label: 'Just right' },
                    { id: 'too_long', label: 'Too much time' }
                  ].map(option => (
                    <button
                      key={option.id}
                      onClick={() => setFeedback({ ...feedback, timeManagement: option.id })}
                      style={{ 
                        padding: '12px 24px', 
                        borderRadius: '24px', 
                        border: `1px solid ${feedback.timeManagement === option.id ? 'var(--primary)' : 'var(--border)'}`,
                        background: feedback.timeManagement === option.id ? 'rgba(217, 164, 65, 0.1)' : 'transparent',
                        color: feedback.timeManagement === option.id ? 'var(--primary)' : 'var(--text)',
                        cursor: 'pointer',
                        fontWeight: 500
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                className="btn-primary" 
                onClick={() => setStep(2)} 
                disabled={feedback.difficultyRating === 0}
                style={{ width: '100%', padding: '16px', opacity: feedback.difficultyRating === 0 ? 0.5 : 1 }}
              >
                Next Step
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>Content & Topics</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>What kind of questions did you encounter the most?</p>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600, color: 'var(--text)' }}>Which topics or patterns appeared frequently?</label>
                <textarea 
                  value={feedback.topicsEncountered}
                  onChange={(e) => setFeedback({ ...feedback, topicsEncountered: e.target.value })}
                  placeholder="e.g., Lots of algebra in math, 3D rotations in figures..."
                  style={{ width: '100%', minHeight: '100px', padding: '16px', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontFamily: 'var(--font-body)', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button onClick={() => setStep(1)} style={{ padding: '16px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', cursor: 'pointer', flex: 1, fontWeight: 600 }}>Back</button>
                <button className="btn-primary" onClick={() => setStep(3)} style={{ padding: '16px', flex: 2 }}>Next Step</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>Memory Recall (Optional)</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Help us build a better question bank. Do you remember any specific questions?</p>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600, color: 'var(--text)' }}>Describe a tough question or scenario</label>
                <textarea 
                  value={feedback.memoryRecall}
                  onChange={(e) => setFeedback({ ...feedback, memoryRecall: e.target.value })}
                  placeholder="e.g., There was a passage about solar energy efficiency with a tricky graph..."
                  style={{ width: '100%', minHeight: '120px', padding: '16px', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontFamily: 'var(--font-body)', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button onClick={() => setStep(2)} style={{ padding: '16px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', cursor: 'pointer', flex: 1, fontWeight: 600 }}>Back</button>
                <button 
                  className="btn-primary" 
                  onClick={handleSubmit} 
                  disabled={loading}
                  style={{ padding: '16px', flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {loading ? 'Submitting...' : <><Send size={20} /> Submit Feedback</>}
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', color: 'var(--success)' }}>
                <CheckCircle size={64} />
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '16px' }}>Thank You!</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Your feedback is invaluable. We are constantly updating our dMAT question bank based on your input.</p>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ExamFeedbackFlow;
