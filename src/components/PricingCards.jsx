import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, Zap, Globe, Shield, RefreshCw } from 'lucide-react';
import { PRICING } from '../config/pricing';

const PricingCards = ({ setCurrentView }) => {
  const [currency, setCurrency] = useState('inr'); // 'inr' or 'eur'
  const currentPricing = PRICING[currency];

  const toggleCurrency = () => {
    setCurrency(prev => prev === 'inr' ? 'eur' : 'inr');
  };

  const handleSignup = () => {
    // Navigate to Auth (signup view is handled by Auth component logic, typically defaulting to login/signup toggle)
    setCurrentView('Auth');
  };

  // Shared Animation Variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="pricing-section" className="pricing-section" style={{ width: '100%', padding: '120px 32px', backgroundColor: 'var(--background)', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Decor */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)', opacity: 0.05, filter: 'blur(100px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '30vw', height: '30vw', background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)', opacity: 0.05, filter: 'blur(100px)', zIndex: 0 }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* Header Area */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span style={{ display: 'inline-block', padding: '6px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '24px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '24px' }}>
              Pricing Plans
            </span>
          </motion.div>
          <h2 style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '24px', lineHeight: 1.1, fontFamily: 'var(--font-heading)' }}>
            Transparent pricing, <br/><span style={{ color: 'var(--primary)' }}>no surprises.</span>
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Start practicing for the TestAS immediately. Choose the plan that fits your study timeline.
          </p>

          {/* Currency Toggle */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
            <div style={{ display: 'inline-flex', background: 'var(--surface)', padding: '6px', borderRadius: '32px', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <button 
                onClick={() => setCurrency('inr')}
                style={{
                  padding: '10px 24px',
                  borderRadius: '24px',
                  border: 'none',
                  background: currency === 'inr' ? 'var(--primary)' : 'transparent',
                  color: currency === 'inr' ? 'white' : 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                ₹ INR
              </button>
              <button 
                onClick={() => setCurrency('eur')}
                style={{
                  padding: '10px 24px',
                  borderRadius: '24px',
                  border: 'none',
                  background: currency === 'eur' ? 'var(--primary)' : 'transparent',
                  color: currency === 'eur' ? 'white' : 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                € EUR
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px', alignItems: 'flex-start', maxWidth: '900px', margin: '0 auto' }}>
          
          {/* Free Card */}
          <motion.div 
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              background: 'var(--surface)',
              borderRadius: '24px',
              padding: '40px',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}
          >
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                  <Shield size={20} color="var(--text-muted)" />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-heading)' }}>Free</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.5, minHeight: '48px' }}>
                Perfect for getting a feel of the digital exam environment.
              </p>
            </div>

            <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'baseline' }}>
              <span style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1, fontFamily: 'var(--font-heading)' }}>
                {currentPricing.symbol}0
              </span>
              <span style={{ color: 'var(--text-muted)', marginLeft: '8px', fontWeight: 500 }}>/ Always free</span>
            </div>

            <button 
              className="btn-secondary"
              onClick={handleSignup}
              style={{ width: '100%', padding: '16px', borderRadius: '12px', fontWeight: 600, fontSize: '1.05rem', marginBottom: '40px' }}
            >
              Start for Free
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flexGrow: 1 }}>
              <p style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>What's included</p>
              {[
                "1 full mock exam",
                "Core question bank",
                "Score dashboard",
                "Blog access"
              ].map((feature, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ marginTop: '2px', color: 'var(--primary)', flexShrink: 0 }}>
                    <Check size={18} strokeWidth={3} />
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Premium Card */}
          <motion.div 
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              background: 'var(--surface)',
              borderRadius: '24px',
              padding: '40px',
              border: '2px solid var(--primary)',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              position: 'relative',
              boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
            }}
            whileHover={{ y: -8, boxShadow: '0 30px 60px rgba(0,0,0,0.12)' }}
          >
            {/* Launch Badge */}
            {PRICING.isBetaFree && (
              <div style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: 'white', padding: '6px 20px', borderRadius: '24px', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                <Zap size={14} fill="currentColor" /> Free During Launch
              </div>
            )}

            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                  <Star size={20} color="var(--primary)" fill="var(--primary)" />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-heading)' }}>Premium</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.5, minHeight: '48px' }}>
                Everything you need to master the TestAS and maximize your score.
              </p>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currency}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap' }}
                >
                  {PRICING.isBetaFree ? (
                    <>
                      <span style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1, fontFamily: 'var(--font-heading)' }}>
                        Free
                      </span>
                      <span style={{ color: 'var(--text-muted)', marginLeft: '12px', fontSize: '1.25rem', textDecoration: 'line-through', opacity: 0.6, fontWeight: 600 }}>
                        {currentPricing.symbol}{currentPricing.amount}
                      </span>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1, fontFamily: 'var(--font-heading)' }}>
                        {currentPricing.symbol}{currentPricing.amount}
                      </span>
                      <span style={{ color: 'var(--text-muted)', marginLeft: '8px', fontWeight: 500 }}>/{currentPricing.period}</span>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              {PRICING.isBetaFree && (
                <div style={{ marginTop: '12px', fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600, background: 'rgba(59, 130, 246, 0.05)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                  Sign up now, keep this rate locked in when we start charging.
                </div>
              )}
            </div>

            <button 
              className="btn-primary"
              onClick={handleSignup}
              style={{ width: '100%', padding: '16px', borderRadius: '12px', fontWeight: 700, fontSize: '1.05rem', marginBottom: '40px', boxShadow: '0 8px 24px rgba(59, 130, 246, 0.25)' }}
            >
              Get Premium Access
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flexGrow: 1 }}>
              <p style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Everything in Free, plus</p>
              {[
                "Unlimited mock exams",
                "All 6 subject modules",
                "Per-subtest breakdown",
                "Priority new content"
              ].map((feature, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ marginTop: '2px', color: 'var(--primary)', flexShrink: 0 }}>
                    <Check size={18} strokeWidth={3} />
                  </div>
                  <span style={{ color: 'var(--text)', fontWeight: 600 }}>{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default PricingCards;
