import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileCheck, ClipboardList, PenTool, BookOpen, MonitorPlay, Mail, GraduationCap, AlertCircle, Info, ChevronDown } from 'lucide-react';

const JourneyTimeline = () => {
  const [expandedStep, setExpandedStep] = useState(null);

  const steps = [
    {
      id: 1,
      title: "Research Universities",
      desc: "Explore German universities and shortlist Master's programs that match your academic background and career goals.",
      icon: <Search size={24} />,
      color: "var(--primary)"
    },
    {
      id: 2,
      title: "Check Admission Requirements",
      desc: "Review eligibility criteria, language, APS requirements, and if the dMAT is needed.",
      note: "Requirements vary by university.",
      icon: <FileCheck size={24} />,
      color: "var(--text)"
    },
    {
      id: 3,
      title: "Apply for APS",
      desc: "Submit your academic documents to APS India for verification as required for eligible applicants.",
      icon: <ClipboardList size={24} />,
      color: "var(--text)"
    },
    {
      id: 4,
      title: "Register for the dMAT",
      desc: "If required, register for the Digital Master Test through the official examination process.",
      badge: "Only for eligible applicants",
      icon: <PenTool size={24} />,
      color: "var(--text)"
    },
    {
      id: 5,
      title: "Prepare for the Exam",
      desc: "Study concepts, practice topic-wise questions, take realistic mock tests, and analyze your performance.",
      highlight: true,
      icon: <MonitorPlay size={24} />,
      color: "var(--primary)"
    },
    {
      id: 6,
      title: "Take the dMAT",
      desc: "Complete both the Core Module and Subject Module under official testing conditions.",
      icon: <BookOpen size={24} />,
      color: "var(--text)"
    },
    {
      id: 7,
      title: "Receive Your Results",
      desc: "Your results become part of your application process where applicable.",
      icon: <Mail size={24} />,
      color: "var(--text)"
    },
    {
      id: 8,
      title: "Apply to Universities",
      desc: "Complete applications using required documents, APS certificate, and applicable dMAT results.",
      icon: <GraduationCap size={24} />,
      color: "var(--text)"
    }
  ];

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Title Area */}
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '16px' }}>Your Journey to a Master's Degree in Germany</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '700px', margin: '0 auto' }}>
          Understand each step of the admission process and where the dMAT fits into your journey.
        </p>
      </div>

      {/* Timeline Wrapper (Horizontal on Desktop, Vertical on Mobile handled by CSS flex wrap/direction) */}
      <div className="journey-timeline" style={{ 
        display: 'flex', 
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '24px', 
        marginBottom: '80px',
        justifyContent: 'center'
      }}>
        {steps.map((step, index) => {
          const isExpanded = expandedStep === step.id;
          return (
            <div 
              key={step.id}
              onClick={() => setExpandedStep(isExpanded ? null : step.id)}
              style={{
                flex: '1 1 250px',
                minWidth: '250px',
                maxWidth: '350px',
                background: step.highlight ? 'rgba(217, 164, 65, 0.05)' : 'var(--background)',
                border: step.highlight ? '1px solid var(--primary)' : '1px solid var(--border)',
                borderRadius: '12px',
                padding: '24px',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.3s ease',
                boxShadow: isExpanded ? 'var(--shadow-soft)' : 'none',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => {
                if(!isExpanded && !step.highlight) e.currentTarget.style.borderColor = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                if(!isExpanded && !step.highlight) e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              {/* Step Number & Icon */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', 
                  background: step.highlight ? 'var(--primary)' : 'var(--surface)', 
                  color: step.highlight ? 'white' : 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.9rem'
                }}>
                  {step.id}
                </div>
                <div style={{ color: step.highlight ? 'var(--primary)' : 'var(--text-muted)' }}>
                  {step.icon}
                </div>
              </div>

              {/* Title & Desc */}
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>{step.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '16px', flexGrow: 1 }}>{step.desc}</p>

              {/* Badges/Notes */}
              {(step.note || step.badge) && (
                <div style={{ marginBottom: '16px' }}>
                  {step.note && <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>* {step.note}</span>}
                  {step.badge && <span style={{ fontSize: '0.8rem', padding: '4px 8px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>{step.badge}</span>}
                </div>
              )}

              {/* Expand Trigger */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600, marginTop: 'auto' }}>
                {isExpanded ? 'Close' : 'Learn More'} 
                <ChevronDown size={16} style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ paddingTop: '16px', marginTop: '16px', borderTop: '1px solid var(--border)' }}>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                        Detailed guide coming soon. This section will contain official links, tips, and common FAQs for this specific step.
                      </p>
                      <button className="btn-secondary" style={{ width: '100%', padding: '8px', fontSize: '0.9rem' }}>Read Detailed Guide</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          )
        })}
      </div>

      {/* Common Mistakes & Reminder */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
        
        {/* Mistakes */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <AlertCircle size={24} color="var(--error, #e53e3e)" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>Common Mistakes Students Make</h3>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              "Assuming every Master's program requires the dMAT.",
              "Not checking the latest university-specific admission requirements.",
              "Waiting too long to begin preparation.",
              "Ignoring time management during practice."
            ].map((mistake, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--error, #e53e3e)', marginTop: '8px', flexShrink: 0 }} />
                <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Reminder */}
        <div style={{ background: 'rgba(47, 93, 138, 0.05)', border: '1px solid var(--accent)', borderRadius: '12px', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Info size={24} color="var(--accent)" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>Remember</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
            Admission requirements and testing policies may change. Always verify the latest information on the official university, APS India, and dMAT websites before applying.
          </p>
        </div>

      </div>

    </div>
  );
};

export default JourneyTimeline;
