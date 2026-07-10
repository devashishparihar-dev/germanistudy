import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import GridMotif from '../components/GridMotif';

const Home = ({ setCurrentView }) => {
  const [openFaq, setOpenFaq] = useState(null);

  React.useEffect(() => {
    trackEvent('landing_page_visit', { path: '/' });
  }, []);

  const faqs = [
    { question: "What is the DMAT?", answer: "The DMAT (Digital Master's Admissions Test) is a comprehensive exam designed to assess your readiness for Master's programs in Germany." },
    { question: "Do I need German language skills?", answer: "While many Master's programs are offered in English, having basic German language skills can significantly enhance your daily life and career prospects." },
    { question: "What is TestAS and do I need it?", answer: "TestAS is a central standardized scholastic aptitude test for foreign students. Many German universities use it to assess cognitive skills, and a good score can significantly improve your chances of admission." },
    { question: "How can I prepare for the TestAS?", answer: "We offer specialized simulation tests and practice materials tailored to both the core test and subject-specific modules of the TestAS to help you achieve a top percentile score." },
    { question: "How do I apply for a student visa?", answer: "We provide detailed guides and resources to help you independently navigate the APS Certification, Blocked Account setup, and the student visa application process." },
    { question: "Are public universities in Germany really free?", answer: "Yes, most public universities in Germany do not charge tuition fees for international students, only a small semester contribution." }
  ];

  return (
    <div className="view-container home-view" style={{ maxWidth: '100%', padding: '0', background: 'var(--background)' }}>
      
      {/* Hero Section */}
      <section className="bg-grid-pattern" style={{ width: '100%', padding: '120px 32px 100px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <div style={{ maxWidth: '1200px', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
          
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <GridMotif size={16} color="var(--primary)" />
              <span>Realistic Exam Simulator</span>
            </div>
            
            <h1 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '24px', lineHeight: 1.1 }}>
              Master the TestAS Digital.
            </h1>
            
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '40px', lineHeight: 1.6, maxWidth: '500px' }}>
              20 questions, 25 minutes, same timing as the real exam. Experience the true interface before test day.
            </p>
            
            <button className="btn-primary" onClick={() => setCurrentView('UnauthPreview')}>
              Start Free Mock Test <ArrowRight size={20} style={{ marginLeft: '8px' }} />
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} style={{ position: 'relative' }}>
            {/* Live Mock Widget Mockup */}
            <div className="premium-card" style={{ padding: '32px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
                <span style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>FIGURE SEQUENCES</span>
                <span className="timer-pulse" style={{ fontWeight: 600, color: 'var(--warning)', fontFamily: 'var(--font-mono)' }}>24:59</span>
              </div>
              <p style={{ marginBottom: '24px', fontWeight: 500 }}>Which of the figures completes the sequence?</p>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', justifyContent: 'center' }}>
                {/* Simulated Latin Square / Figure Grid */}
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ width: '64px', height: '64px', border: '2px solid var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '32px', height: '32px', border: '2px solid var(--text)', borderRadius: i === 2 ? '50%' : '0' }} />
                  </div>
                ))}
                <div style={{ width: '64px', height: '64px', border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '2rem' }}>?</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {['A', 'B', 'C', 'D'].map(opt => (
                  <button key={opt} className="btn-secondary" style={{ padding: '12px', fontSize: '1rem' }}>{opt}</button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Section Asymmetric */}
      <section style={{ backgroundColor: 'var(--surface)', width: '100%', padding: '120px 32px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '64px' }}>
            <div style={{ width: '40px', height: '1px', background: 'var(--primary)' }} />
            <span style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-heading)', letterSpacing: '1px' }}>WHY GERMANISTUDY</span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '64px', alignItems: 'center', marginBottom: '80px' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '24px', lineHeight: 1.2 }}>Identical Test Environment</h2>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Don't get caught off guard by the digital interface. Our simulator reproduces the exact layout, non-linear navigation constraints, and strict per-subtest timing of the official TestAS Core Module.
              </p>
            </div>
            <div style={{ background: 'var(--background)', padding: '40px', border: '1px solid var(--border)' }}>
              <GridMotif size={48} color="var(--primary)" style={{ marginBottom: '24px' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>Strict Timing</h3>
              <p style={{ color: 'var(--text-muted)' }}>25 minutes per section. No going back once submitted.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '64px', alignItems: 'center' }}>
            <div style={{ background: 'var(--background)', padding: '40px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                <div style={{ width: '24px', height: '24px', background: 'var(--accent)' }} />
                <div style={{ width: '24px', height: '24px', border: '2px solid var(--accent)' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>Real Question Formats</h3>
              <p style={{ color: 'var(--text-muted)' }}>Latin squares, figure sequences, and typed equations.</p>
            </div>
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '24px', lineHeight: 1.2 }}>Authentic Question Grids</h2>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Practice with questions designed specifically to match the logic and difficulty of the real exam, from visual relationship puzzles to quantitative text problems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ backgroundColor: 'var(--background)', width: '100%', padding: '120px 32px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '64px', justifyContent: 'center' }}>
            <div style={{ width: '40px', height: '1px', background: 'var(--primary)' }} />
            <span style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-heading)', letterSpacing: '1px' }}>COMMON QUESTIONS</span>
            <div style={{ width: '40px', height: '1px', background: 'var(--primary)' }} />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {faqs.map((faq, idx) => (
              <div key={idx} style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  style={{ width: '100%', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--text)' }}
                >
                  <span style={{ fontSize: '1.15rem', fontWeight: 600, fontFamily: 'var(--font-heading)', letterSpacing: '0.5px' }}>{faq.question}</span>
                  <ChevronDown size={20} style={{ transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', color: 'var(--primary)' }} />
                </button>
                <motion.div initial={false} animate={{ height: openFaq === idx ? 'auto' : 0, opacity: openFaq === idx ? 1 : 0 }} style={{ overflow: 'hidden' }}>
                  <div style={{ padding: '0 24px 24px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {faq.answer}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO About Section & Footer */}
      <footer style={{ backgroundColor: 'var(--surface)', width: '100%', borderTop: '1px solid var(--border)' }}>
        
        <section style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 32px', textAlign: 'left' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '24px', fontFamily: 'var(--font-heading)' }}>About GermaniStudy</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.6 }}>
            GermaniStudy is a free practice platform for the TestAS exam — the standardized aptitude test used to assess international students applying to universities in Germany. If you're preparing for TestAS Digital and want to know what the real exam feels like before test day, this is where you practice.
          </p>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.6 }}>
            The Core Module simulator mirrors the actual TestAS structure: Figure Sequences, Mathematical Equations, and Latin Squares, each timed to match the real 25-minute per-subtest limit, with no back-navigation — just like the exam you'll actually sit. We built it because most TestAS prep resources online are outdated PDFs or paid courses; we wanted something that behaves like the real test and costs nothing to start.
          </p>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Whether you're applying through uni-assist, weighing a Studienkolleg alternative, or just starting to research what studying abroad in Germany requires, GermaniStudy gives you real TestAS practice questions and honest feedback on where you stand — not just another study guide.
          </p>
        </section>

        <div style={{ padding: '40px 32px', textAlign: 'center', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <GridMotif size={32} color="var(--primary)" style={{ marginBottom: '24px' }} />
          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '32px', flexWrap: 'wrap' }}>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600, fontFamily: 'var(--font-heading)', letterSpacing: '1px' }}>DMAT PREP</a>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600, fontFamily: 'var(--font-heading)', letterSpacing: '1px' }}>MASTER'S</a>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600, fontFamily: 'var(--font-heading)', letterSpacing: '1px' }}>RESOURCES</a>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>© 2026 GermaniStudy. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default Home;
