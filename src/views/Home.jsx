import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import HandDrawnCheck from '../components/HandDrawnCheck';
import ConfettiBurst from '../components/ConfettiBurst';

const ScrollSection = ({ children, style, className, id }) => (
  <motion.section
    id={id}
    className={className}
    style={style}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    {children}
  </motion.section>
);

const InteractiveWidget = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="premium-card" style={{ padding: '32px', background: 'var(--surface)', border: '1px solid var(--border)', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
        <span style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>MATHEMATICAL EQUATIONS</span>
        <span className="timer-pulse" style={{ fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>24:59</span>
      </div>
      <p style={{ marginBottom: '24px', fontWeight: 500, fontSize: '1.1rem' }}>Solve the equation for x:</p>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '40px', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
        3x + 12 = 27
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {['3', '5', '7', '9'].map((opt, i) => {
          const isCorrect = opt === '5';
          const isSelected = selected === opt;
          return (
            <button 
              key={opt} 
              className="btn-secondary" 
              style={{ position: 'relative', padding: '16px', fontSize: '1.1rem', backgroundColor: isSelected ? 'var(--paper)' : 'transparent' }}
              onClick={() => setSelected(opt)}
            >
              {opt}
              {isSelected && isCorrect && (
                <>
                  <HandDrawnCheck color="var(--coral)" />
                  <ConfettiBurst isActive={true} />
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const Home = ({ setCurrentView }) => {
  const [openFaq, setOpenFaq] = useState(null);

  React.useEffect(() => {
    trackEvent('landing_page_visit', { path: '/' });
  }, []);

  const faqs = [
    { question: "Do I need German language skills?", answer: "While many Master's programs are offered in English, having basic German language skills can significantly enhance your daily life and career prospects." },
    { question: "What is TestAS and do I need it?", answer: "TestAS is a central standardized scholastic aptitude test for foreign students. Many German universities use it to assess cognitive skills, and a good score can significantly improve your chances of admission." },
    { question: "How can I prepare for the TestAS?", answer: "We offer specialized simulation tests and practice materials tailored to both the core test and subject-specific modules of the TestAS to help you achieve a top percentile score." },
    { question: "How do I apply for a student visa?", answer: "We provide detailed guides and resources to help you independently navigate the APS Certification, Blocked Account setup, and the student visa application process." },
    { question: "Are public universities in Germany really free?", answer: "Yes, most public universities in Germany do not charge tuition fees for international students, only a small semester contribution." }
  ];

  return (
    <div className="view-container home-view" style={{ maxWidth: '100%', padding: '0', background: 'var(--background)' }}>
      
      {/* Hero Section */}
      <section style={{ width: '100%', padding: '120px 32px 100px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <div style={{ maxWidth: '1200px', width: '100%', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '64px', alignItems: 'center' }}>
          
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '24px', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>
              <div style={{ width: '32px', height: '2px', background: 'var(--primary)' }} />
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
            <InteractiveWidget />
          </motion.div>
        </div>
      </section>

      {/* Feature Section Asymmetric */}
      <ScrollSection style={{ backgroundColor: 'var(--surface)', width: '100%', padding: '120px 32px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '80px' }}>
            <div style={{ width: '40px', height: '2px', background: 'var(--primary)' }} />
            <span style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-heading)', letterSpacing: '1px' }}>WHY GERMANISTUDY</span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '64px', alignItems: 'center', marginBottom: '100px' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '24px', lineHeight: 1.2 }}>Identical Test Environment</h2>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Don't get caught off guard by the digital interface. Our simulator reproduces the exact layout and strict per-subtest timing of the official TestAS Core Module.
              </p>
            </div>
            <div style={{ background: 'var(--paper)', padding: '48px', border: '1px solid var(--border)', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', color: 'var(--ink)' }}>Strict Timing</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>25 minutes per section. No pausing, no back-navigation. Practice under real pressure.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '64px', alignItems: 'center' }}>
            <div style={{ background: 'var(--paper)', padding: '48px', border: '1px solid var(--border)', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', color: 'var(--ink)' }}>Real Question Formats</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>Latin squares, figure sequences, and typed equations.</p>
            </div>
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '24px', lineHeight: 1.2 }}>Authentic Question Types</h2>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Practice with questions designed specifically to match the logic and difficulty of the real exam, from visual relationship puzzles to quantitative text problems.
              </p>
            </div>
          </div>
        </div>
      </ScrollSection>

      {/* FAQ */}
      <ScrollSection style={{ backgroundColor: 'var(--background)', width: '100%', padding: '120px 32px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '64px', justifyContent: 'center' }}>
            <div style={{ width: '40px', height: '2px', background: 'var(--primary)' }} />
            <span style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-heading)', letterSpacing: '1px' }}>COMMON QUESTIONS</span>
            <div style={{ width: '40px', height: '2px', background: 'var(--primary)' }} />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {faqs.map((faq, idx) => (
              <div key={idx} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }}>
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
      </ScrollSection>

      {/* SEO About Section & Footer */}
      <footer id="about-section" style={{ backgroundColor: 'var(--surface)', width: '100%', borderTop: '1px solid var(--border)' }}>
        <ScrollSection style={{ maxWidth: '800px', margin: '0 auto', padding: '100px 32px', textAlign: 'left' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '32px', fontFamily: 'var(--font-heading)' }}>About GermaniStudy</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.7, fontSize: '1.1rem' }}>
            GermaniStudy is a free practice platform for the TestAS exam — the standardized aptitude test used to assess international students applying to universities in Germany. If you're preparing for TestAS Digital and want to know what the real exam feels like before test day, this is where you practice.
          </p>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.7, fontSize: '1.1rem' }}>
            The Core Module simulator mirrors the actual TestAS structure: Figure Sequences, Mathematical Equations, and Latin Squares, each timed to match the real 25-minute per-subtest limit, with no back-navigation — just like the exam you'll actually sit. We built it because most TestAS prep resources online are outdated PDFs or paid courses; we wanted something that behaves like the real test and costs nothing to start.
          </p>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1.1rem' }}>
            Whether you're applying through uni-assist, weighing a Studienkolleg year, or just starting to research what studying in Germany requires, GermaniStudy gives you real TestAS practice questions and honest feedback on where you stand — not just another study guide.
          </p>
        </ScrollSection>

        <div style={{ padding: '40px 32px', textAlign: 'left', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '32px', marginBottom: '32px', flexWrap: 'wrap' }}>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600, fontFamily: 'var(--font-heading)', letterSpacing: '1px' }}>TESTAS PREP</a>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600, fontFamily: 'var(--font-heading)', letterSpacing: '1px' }}>RESOURCES</a>
            <a href="#PrivacyPolicy" onClick={(e) => { e.preventDefault(); setCurrentView('PrivacyPolicy'); window.scrollTo(0, 0); }} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600, fontFamily: 'var(--font-heading)', letterSpacing: '1px' }}>PRIVACY POLICY</a>
            <a href="#TermsOfService" onClick={(e) => { e.preventDefault(); setCurrentView('TermsOfService'); window.scrollTo(0, 0); }} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600, fontFamily: 'var(--font-heading)', letterSpacing: '1px' }}>TERMS OF SERVICE</a>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>© 2026 GermaniStudy. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default Home;
