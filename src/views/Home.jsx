import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, BookOpen, GraduationCap, Globe2, 
  FileText, School, Compass, Target, 
  FileCheck, PlaneTakeoff, ChevronRight, Star, ChevronDown
} from 'lucide-react';

const Home = ({ setCurrentView }) => {
  const pathways = [
    { icon: <BookOpen size={24} />, title: "Master's Excellence", desc: "Conquer the DMAT and secure your admission to Germany's top Master's programs." },
    { icon: <GraduationCap size={24} />, title: "Master's Admissions", desc: "Prepare for DMAT & GRE, build a standout profile, and apply directly to top-tier Master's programs." },
    { icon: <Globe2 size={24} />, title: "Language Mastery", desc: "Comprehensive resources for TestDaF, DSH, and Goethe-Zertifikat to meet university requirements." },
    { icon: <FileText size={24} />, title: "Informational Resources", desc: "Access comprehensive articles and guides on APS Certification, Blocked Accounts, and Student Visas." },
    { icon: <School size={24} />, title: "University Research", desc: "Use our guides to independently shortlist the best zero-tuition public universities for your academic profile." },
    { icon: <Target size={24} />, title: "Exam Simulation", desc: "Realistic digital mock exams for the DMAT with AI-driven performance analytics." }
  ];

  const journeySteps = [
    { icon: <Compass size={32} />, title: 'Discover Your Path', desc: 'Identify exact requirements based on your background.' },
    { icon: <Target size={32} />, title: 'Conquer the Exams', desc: 'Achieve top percentiles in the DMAT and Language tests.' },
    { icon: <FileCheck size={32} />, title: 'Prepare Your Applications', desc: 'Read our extensive guides to independently navigate APS, Visas, and Uni-Assist.' },
    { icon: <PlaneTakeoff size={32} />, title: 'Arrive in Germany', desc: 'Enroll in your dream university and start your journey.' }
  ];

  const faqs = [
    { question: "What is the DMAT?", answer: "The DMAT (Digital Master's Admissions Test) is a comprehensive exam designed to assess your readiness for Master's programs in Germany." },
    { question: "Do I need German language skills?", answer: "While many Master's programs are offered in English, having basic German language skills can significantly enhance your daily life and career prospects." },
    { question: "What is TestAS and do I need it?", answer: "TestAS is a central standardized scholastic aptitude test for foreign students. Many German universities use it to assess cognitive skills, and a good score can significantly improve your chances of admission." },
    { question: "How can I prepare for the TestAS?", answer: "We offer specialized simulation tests and practice materials tailored to both the core test and subject-specific modules of the TestAS to help you achieve a top percentile score." },
    { question: "How do I apply for a student visa?", answer: "We provide detailed guides and resources to help you independently navigate the APS Certification, Blocked Account setup, and the student visa application process." },
    { question: "Are public universities in Germany really free?", answer: "Yes, most public universities in Germany do not charge tuition fees for international students, only a small semester contribution." }
  ];

  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="view-container home-view" style={{ maxWidth: '100%', padding: '0', background: 'var(--background)' }}>
      
      {/* Hero Section */}
      <section className="hero-section" style={{ width: '100%', padding: '120px 32px 100px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100vw', height: '100%', background: 'radial-gradient(ellipse at top, rgba(255, 212, 130, 0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} style={{ position: 'relative', zIndex: 1, maxWidth: '1200px' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--surface)', color: 'var(--text-muted)', borderRadius: '24px', fontWeight: 600, marginBottom: '32px', fontSize: '0.9rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-soft)' }}>
            <Star size={16} color="var(--accent)" fill="var(--accent)" /> 
            <span>The Ultimate Gateway to Germany</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px', position: 'relative' }}>
            {/* Glow effect behind logo */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '250px', height: '100px', background: 'var(--primary)', filter: 'blur(80px)', opacity: 0.15, zIndex: 0, pointerEvents: 'none' }} />
            <img src="/assets/branding/logo_light.png" alt="GermaniStudy Logo" className="logo-light-mode" style={{ height: '240px', objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(242, 175, 0, 0.15))', position: 'relative', zIndex: 1, transform: 'scale(1.05)' }} />
            <img src="/assets/branding/logo_dark.png" alt="GermaniStudy Logo" className="logo-dark-mode" style={{ height: '240px', objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(242, 175, 0, 0.1))', position: 'relative', zIndex: 1, transform: 'scale(1.05)' }} />
          </div>
          
          <h1 style={{ fontSize: 'clamp(3rem, 5vw, 5rem)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-1.5px', marginBottom: '24px', lineHeight: 1.1, fontFamily: 'var(--font-heading)' }}>
            Your Complete Journey to <br />
            <span style={{ color: 'var(--primary)', position: 'relative' }}>
              Studying in Germany
            </span>
          </h1>
          
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '750px', margin: '0 auto 48px', lineHeight: 1.6 }}>
            We provide the ultimate exam preparation platform and comprehensive informational resources you need to independently conquer your admissions tests and secure your spot in a top-tier German university.
          </p>
          
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" style={{ fontSize: '1.1rem', padding: '16px 48px', display: 'flex', alignItems: 'center', gap: '12px', borderRadius: '12px' }} onClick={() => setCurrentView('Auth')}>
              <BookOpen size={24} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.9 }}>Get Started</div>
                <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>Prepare Now</div>
              </div>
            </button>
          </div>
        </motion.div>
      </section>

      {/* The Ecosystem Section */}
      <section style={{ backgroundColor: 'var(--surface)', width: '100%', padding: '100px 32px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>The Complete Ecosystem</h2>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>Everything you need to successfully navigate the complex German university admission system.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
            {pathways.map((feature, index) => (
              <motion.div key={index} className="premium-card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', background: 'var(--background)' }}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
              >
                <div style={{ background: 'rgba(242, 175, 0, 0.15)', color: 'var(--primary)', padding: '16px', borderRadius: '16px', marginBottom: '24px', border: '1px solid rgba(242, 175, 0, 0.3)' }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text)', marginBottom: '16px' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, textAlign: 'left', fontSize: '1.05rem' }}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ width: '100%', padding: '120px 32px', background: 'var(--background)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>Your Roadmap to Germany</h2>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)' }}>A proven, step-by-step methodology to secure your admission.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', position: 'relative' }}>
            {journeySteps.map((step, idx) => (
              <motion.div key={idx} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.15 }}
              >
                <div style={{ 
                  width: '96px', height: '96px', borderRadius: '48px', 
                  background: 'var(--surface)', border: '2px solid var(--border)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  marginBottom: '24px', color: 'var(--primary)', position: 'relative', zIndex: 2,
                  boxShadow: 'var(--shadow-soft)'
                }}>
                  {step.icon}
                  <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '32px', height: '48px', background: 'var(--primary)', color: 'var(--accent)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', border: '2px solid var(--background)' }}>
                    {idx + 1}
                  </div>
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text)', marginBottom: '12px' }}>{step.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ backgroundColor: 'var(--surface)', width: '100%', padding: '100px 32px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>Frequently Asked Questions</h2>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)' }}>Common questions about studying in Germany.</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                style={{ 
                  background: 'var(--background)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '12px', 
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  style={{ 
                    width: '100%', 
                    padding: '24px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    background: 'transparent', 
                    border: 'none', 
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: 'var(--text)'
                  }}
                >
                  <span style={{ fontSize: '1.15rem', fontWeight: 600 }}>{faq.question}</span>
                  <ChevronDown 
                    size={20} 
                    style={{ 
                      transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                      color: 'var(--primary)'
                    }} 
                  />
                </button>
                <motion.div 
                  initial={false}
                  animate={{ height: openFaq === idx ? 'auto' : 0, opacity: openFaq === idx ? 1 : 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ padding: '0 24px 24px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {faq.answer}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--surface)', width: '100%', padding: '64px 32px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <img src="/assets/branding/logo_light.png" alt="GermaniStudy Logo" className="logo-light-mode" style={{ height: '96px', objectFit: 'contain', filter: 'grayscale(1) opacity(0.5)' }} />
          <img src="/assets/branding/logo_dark.png" alt="GermaniStudy Logo" className="logo-dark-mode" style={{ height: '96px', objectFit: 'contain', filter: 'grayscale(1) opacity(0.5)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>DMAT Prep</a>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>Master's</a>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>Language Prep</a>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>Resources</a>
        </div>
        <p style={{ color: 'var(--text-muted)' }}>© 2026 GermaniStudy. The Gateway to Germany. All rights reserved.</p>
      </footer>

    </div>
  );
};

export default Home;
