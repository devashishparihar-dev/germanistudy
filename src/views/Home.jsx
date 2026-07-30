import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, CheckCircle2, ChevronRight, BookOpen, Clock, Activity, Target, LayoutDashboard, BrainCircuit, ExternalLink, Shield, Info, ArrowDown } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import JourneyTimeline from '../components/JourneyTimeline';

const ScrollSection = ({ children, style, className, id }) => (
  <motion.section
    id={id}
    className={className}
    style={{ ...style, width: '100%', padding: '120px 32px' }}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.5 }}
  >
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {children}
    </div>
  </motion.section>
);

const Home = ({ setCurrentView }) => {
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    trackEvent('landing_page_visit', { path: '/' });
  }, []);

  const faqs = [
    { question: "Is dMAT mandatory?", answer: "The dMAT is increasingly becoming mandatory for Master's applicants in specific fields as part of the APS India certification process." },
    { question: "Who conducts the dMAT?", answer: "The examination is conducted by g.a.s.t. (Gesellschaft für Akademische Studienvorbereitung und Testentwicklung e. V.)." },
    { question: "Does dMAT replace APS?", answer: "No. APS India still handles document verification and issues the certificate. The dMAT is an additional academic evaluation." },
    { question: "Who needs to take it?", answer: "Applicants aiming for German Master's programs in fields like Engineering, Business, Commerce, and Economics generally require it." },
    { question: "How is the exam structured?", answer: "It consists of a general cognitive Core Module and a domain-specific Subject Module, lasting approximately 3.5 hours." },
    { question: "How should I prepare?", answer: "Focus on familiarizing yourself with the reasoning patterns (like Figure Sequences) and practice under strict time constraints." }
  ];

  return (
    <div className="view-container home-view" style={{ maxWidth: '100%', padding: '0', background: 'var(--background)' }}>
      
      {/* 1. Hero Section ("Am I on the right website?") */}
      <section style={{ width: '100%', padding: '180px 32px 100px', display: 'flex', justifyContent: 'center', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '24px', lineHeight: 1.1, letterSpacing: '-1px' }}>
            Ace the Digital Master Test (dMAT).
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '48px', lineHeight: 1.6, maxWidth: '600px' }}>
            The premium preparation platform for German Master's applicants.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn-primary" onClick={() => setCurrentView('Auth')} style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
              Start Free Practice
            </button>
            <button className="btn-secondary" onClick={() => { document.getElementById('what-is-dmat').scrollIntoView({ behavior: 'smooth' }); }} style={{ padding: '16px 32px', fontSize: '1.1rem', background: 'var(--surface)' }}>
              Learn More
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. What exactly is dMAT? */}
      <ScrollSection id="what-is-dmat" style={{ backgroundColor: 'var(--surface)' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '48px', textAlign: 'center' }}>What is the dMAT?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div className="premium-card" style={{ padding: '32px', background: 'var(--background)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text)' }}>Digital Master Test</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>A standardized academic aptitude test introduced for selected Master's applicants applying through APS India.</p>
          </div>
          <div className="premium-card" style={{ padding: '32px', background: 'var(--background)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text)' }}>Who conducts it?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>The examination is conducted by g.a.s.t., while APS India continues to handle document verification and certification.</p>
          </div>
          <div className="premium-card" style={{ padding: '32px', background: 'var(--background)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text)' }}>Why was it introduced?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>It provides an additional objective academic aptitude assessment as part of the APS process for selected applicants.</p>
          </div>
        </div>
      </ScrollSection>

      {/* Journey Timeline Section */}
      <ScrollSection style={{ backgroundColor: 'var(--background)' }}>
        <JourneyTimeline />
      </ScrollSection>

      {/* 3. Do I even need this exam? */}
      <ScrollSection style={{ backgroundColor: 'var(--background)' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '48px', textAlign: 'center' }}>Do I Need to Take It?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
          
          <div className="premium-card" style={{ padding: '48px', background: 'var(--surface)', borderTop: '4px solid var(--primary)' }}>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '24px', color: 'var(--text)' }}>Who Needs dMAT</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {['Engineering', 'Business & Management', 'Commerce', 'Accounting', 'Finance', 'Economics'].map(badge => (
                <span key={badge} style={{ padding: '8px 16px', background: 'rgba(217, 164, 65, 0.1)', color: 'var(--primary)', borderRadius: '24px', fontWeight: 600, fontSize: '0.95rem' }}>{badge}</span>
              ))}
            </div>
          </div>
          
          <div className="premium-card" style={{ padding: '48px', background: 'var(--surface)', borderTop: '4px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '24px', color: 'var(--text)' }}>Who Doesn't Need dMAT</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {['Bachelor applicants', 'PhD applicants', 'Applicants outside affected fields', 'Students with APS exemptions'].map(badge => (
                <span key={badge} style={{ padding: '8px 16px', background: 'var(--background)', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: '24px', fontWeight: 600, fontSize: '0.95rem' }}>{badge}</span>
              ))}
            </div>
          </div>
          
        </div>
      </ScrollSection>

      {/* 4. How does the exam look? */}
      <ScrollSection style={{ backgroundColor: 'var(--surface)' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '64px', textAlign: 'center' }}>Exam Structure</h2>
        
        {/* Visual Roadmap */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '24px', marginBottom: '80px' }}>
          <div style={{ padding: '16px 32px', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '8px', fontWeight: 700, color: 'var(--text)', fontSize: '1.1rem' }}>dMAT</div>
          <ArrowRight size={24} color="var(--text-muted)" className="hide-on-mobile" />
          <ArrowDown size={24} color="var(--text-muted)" className="hide-on-desktop" style={{ margin: '0 auto', display: 'block' }} />
          <div style={{ padding: '16px 32px', background: 'rgba(217, 164, 65, 0.1)', color: 'var(--primary)', border: '1px solid var(--primary)', borderRadius: '8px', fontWeight: 700, fontSize: '1.1rem' }}>Core Module</div>
          <ArrowRight size={24} color="var(--text-muted)" className="hide-on-mobile" />
          <ArrowDown size={24} color="var(--text-muted)" className="hide-on-desktop" style={{ margin: '0 auto', display: 'block' }} />
          <div style={{ padding: '16px 32px', background: 'rgba(47, 93, 138, 0.1)', color: 'var(--accent)', border: '1px solid var(--accent)', borderRadius: '8px', fontWeight: 700, fontSize: '1.1rem' }}>Subject Module</div>
          <ArrowRight size={24} color="var(--text-muted)" className="hide-on-mobile" />
          <ArrowDown size={24} color="var(--text-muted)" className="hide-on-desktop" style={{ margin: '0 auto', display: 'block' }} />
          <div style={{ padding: '16px 32px', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '8px', fontWeight: 700, color: 'var(--text)', fontSize: '1.1rem' }}>Certificate</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '48px' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '24px' }}>Core Module Sections</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
              <div style={{ padding: '24px', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                <h4 style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>Figure Sequences</h4>
              </div>
              <div style={{ padding: '24px', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                <h4 style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>Mathematical Equations</h4>
              </div>
              <div style={{ padding: '24px', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                <h4 style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>Latin Squares</h4>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '24px' }}>Subject Module</h3>
            <div style={{ padding: '32px', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                Evaluates applying academic knowledge to realistic scenarios across fields such as engineering, mathematics, business, economics, and natural sciences, rather than memorizing textbook facts.
              </p>
            </div>
          </div>
        </div>
      </ScrollSection>

      {/* 5. How do I prepare? */}
      <ScrollSection style={{ backgroundColor: 'var(--background)' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '64px', textAlign: 'center' }}>How to Prepare</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { step: '1', title: 'Learn Concepts' },
            { step: '2', title: 'Practice by Topic' },
            { step: '3', title: 'Take Mock Tests' },
            { step: '4', title: 'Review Analytics' }
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '24px', background: 'var(--surface)', padding: '24px 32px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(217, 164, 65, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.25rem' }}>
                {item.step}
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text)' }}>{item.title}</div>
            </div>
          ))}
        </div>
      </ScrollSection>

      {/* 6. Why should I prepare here? */}
      <ScrollSection style={{ backgroundColor: 'var(--surface)' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '48px', textAlign: 'center' }}>Why Prepare with GermaniStudy?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {[
            "Master Real Exam Patterns",
            "Understand Your Weak Areas",
            "Build Speed & Accuracy",
            "Practice Like the Real Exam",
            "Track Your Progress",
            "Study by Individual Topics"
          ].map((outcome, idx) => (
            <div key={idx} style={{ padding: '24px', background: 'var(--background)', borderLeft: '4px solid var(--primary)', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <CheckCircle2 size={24} color="var(--primary)" />
              <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)' }}>{outcome}</span>
            </div>
          ))}
        </div>
      </ScrollSection>

      {/* 7. What makes GermaniStudy different? */}
      <ScrollSection style={{ backgroundColor: 'var(--background)' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '48px', textAlign: 'center' }}>Credibility & Trust</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
          {[
            "Structured around the official dMAT syllabus",
            "Section-wise preparation",
            "Realistic practice experience",
            "Performance analytics",
            "Continuously updated study resources",
            "Independent preparation platform"
          ].map((indicator, idx) => (
            <div key={idx} style={{ padding: '16px 24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '24px', fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {indicator}
            </div>
          ))}
        </div>
      </ScrollSection>

      {/* 8. Can I trust this information? (Information Center) */}
      <ScrollSection style={{ backgroundColor: 'var(--surface)' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '48px', textAlign: 'center' }}>Information Center</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {[
            "What is dMAT?",
            "Who Needs dMAT?",
            "APS + dMAT Process",
            "Exam Structure",
            "Important Dates",
            "Frequently Asked Questions"
          ].map((topic, idx) => (
            <button key={idx} onClick={() => setCurrentView('DMATHandbook')} style={{ padding: '32px 24px', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>
              <span style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text)' }}>{topic}</span>
              <ArrowRight size={20} color="var(--primary)" />
            </button>
          ))}
        </div>
      </ScrollSection>

      {/* 9. Platform Preview */}
      <ScrollSection style={{ backgroundColor: 'var(--background)' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '48px', textAlign: 'center' }}>Platform Preview</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px', alignItems: 'center' }}>
          {['Dashboard', 'Study Notes', 'Practice', 'Mock Tests', 'Analytics'].map((preview, idx) => (
            <div key={idx} style={{ aspectRatio: '4/3', background: 'var(--surface)', border: '1px dashed var(--border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>
              {preview}
            </div>
          ))}
        </div>
      </ScrollSection>

      {/* 10. FAQ */}
      <ScrollSection style={{ backgroundColor: 'var(--surface)' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '48px', textAlign: 'center' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '800px', margin: '0 auto' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} style={{ background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                style={{ width: '100%', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--text)' }}
              >
                <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{faq.question}</span>
                <ChevronDown size={20} style={{ transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', color: 'var(--primary)', flexShrink: 0 }} />
              </button>
              <motion.div initial={false} animate={{ height: openFaq === idx ? 'auto' : 0, opacity: openFaq === idx ? 1 : 0 }} style={{ overflow: 'hidden' }}>
                <div style={{ padding: '0 24px 24px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {faq.answer}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </ScrollSection>

      {/* 11. Final CTA */}
      <section style={{ backgroundColor: 'var(--background)', width: '100%', padding: '120px 32px', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '32px' }}>Ready to start preparing?</h2>
        <button className="btn-primary" onClick={() => setCurrentView('Auth')} style={{ padding: '16px 40px', fontSize: '1.1rem' }}>
          Start Free
        </button>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--surface)', width: '100%', borderTop: '1px solid var(--border)' }}>
        <div style={{ padding: '60px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '24px' }}>GermaniStudy</h2>
          <div style={{ display: 'flex', gap: '32px', marginBottom: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>Home</a>
            <a href="#PrivacyPolicy" onClick={(e) => { e.preventDefault(); setCurrentView('PrivacyPolicy'); window.scrollTo(0, 0); }} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>Privacy Policy</a>
            <a href="#TermsOfService" onClick={(e) => { e.preventDefault(); setCurrentView('TermsOfService'); window.scrollTo(0, 0); }} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>Terms of Service</a>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>© 2026 GermaniStudy. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default Home;
