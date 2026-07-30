import React, { useState, useEffect, useMemo } from 'react';
import { handbookData } from '../data/handbook';
import { GuideSidebar } from '../components/handbook/GuideSidebar';
import { StickyPanel } from '../components/handbook/StickyPanel';
import { GuideHeader, InfoCard, WarningCard, SuccessCard, ResourceCard, UniversityCard } from '../components/handbook/HandbookCards';
import { Timeline, Checklist } from '../components/handbook/HandbookElements';
import { FAQAccordion } from '../components/handbook/FAQAccordion';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DMATHandbook = ({ setCurrentView }) => {
  const [activeChapterId, setActiveChapterId] = useState(handbookData[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalTime = useMemo(() => handbookData.reduce((acc, ch) => acc + ch.estimatedTime, 0), []);

  const estimatedTimeLeft = useMemo(() => {
    const currentIndex = handbookData.findIndex(ch => ch.id === activeChapterId);
    if (currentIndex === -1) return totalTime;
    return handbookData.slice(currentIndex).reduce((acc, ch) => acc + ch.estimatedTime, 0);
  }, [activeChapterId, totalTime]);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress percentage
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${(totalScroll / windowHeight) * 100}`;
      setScrollProgress(Number(scroll));

      // Determine active chapter
      const chapterElements = handbookData.map(ch => document.getElementById(ch.id));
      let currentActive = activeChapterId;
      for (let i = chapterElements.length - 1; i >= 0; i--) {
        const el = chapterElements[i];
        if (el && el.getBoundingClientRect().top <= 120) {
          currentActive = handbookData[i].id;
          break;
        }
      }
      if (currentActive !== activeChapterId) {
        setActiveChapterId(currentActive);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeChapterId]);

  const filteredChapters = useMemo(() => {
    if (!searchQuery) return handbookData;
    const query = searchQuery.toLowerCase();
    return handbookData.filter(ch => 
      ch.title.toLowerCase().includes(query) || 
      ch.content.some(block => 
        (block.content && block.content.toLowerCase().includes(query)) ||
        (block.title && block.title.toLowerCase().includes(query)) ||
        (block.type === 'faq' && block.items?.some(i => i.question.toLowerCase().includes(query)))
      )
    );
  }, [searchQuery]);

  const renderContentBlock = (block, index) => {
    switch (block.type) {
      case 'text':
        return <p key={index} style={{ marginBottom: '24px', fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--text)' }}>{block.content}</p>;
      case 'info':
        return <InfoCard key={index} title={block.title} content={block.content} />;
      case 'warning':
        return <WarningCard key={index} title={block.title} content={block.content} />;
      case 'success':
        return <SuccessCard key={index} title={block.title} content={block.content} />;
      case 'checklist':
        return <Checklist key={index} title={block.title} items={block.items} />;
      case 'timeline':
        return <Timeline key={index} steps={block.steps} />;
      case 'accordion':
        return <FAQAccordion key={index} items={block.items} />;
      case 'resource':
        return <ResourceCard key={index} title={block.title} description={block.description} link={block.link} />;
      case 'university':
        return <UniversityCard key={index} {...block} />;
      case 'table':
        return (
          <div key={index} style={{ overflowX: 'auto', marginBottom: '32px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: 'var(--surface)' }}>
              <thead>
                <tr style={{ background: 'var(--background)' }}>
                  {block.headers.map((h, i) => (
                    <th key={i} style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, i) => (
                  <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ padding: '16px', color: 'var(--text)', fontSize: '0.95rem' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--background)', color: 'var(--text)' }}>
      
      {/* Top Mobile Progress Bar */}
      <div style={{ position: 'fixed', top: '72px', left: 0, width: '100%', height: '4px', zIndex: 40, background: 'var(--background)' }}>
        <div style={{ height: '100%', width: `${scrollProgress}%`, background: 'var(--primary)' }} />
      </div>

      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '40px 32px', display: 'flex', gap: '48px', alignItems: 'flex-start' }}>
        
        <GuideSidebar 
          chapters={handbookData} 
          activeChapterId={activeChapterId} 
          onSearch={setSearchQuery} 
          searchQuery={searchQuery}
        />

        <main style={{ flex: 1, maxWidth: '850px', width: '100%' }}>
          
          <div className="hide-on-desktop" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'flex-end' }}>
             <button onClick={() => setMobileMenuOpen(true)} className="btn-secondary" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Menu size={18} /> Table of Contents
             </button>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ position: 'fixed', inset: 0, background: 'var(--background)', zIndex: 100, padding: '24px', overflowY: 'auto' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Table of Contents</h2>
                  <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text)' }}><X size={24} /></button>
                </div>
                <GuideSidebar chapters={handbookData} activeChapterId={activeChapterId} onSearch={setSearchQuery} searchQuery={searchQuery} />
              </motion.div>
            )}
          </AnimatePresence>

          {filteredChapters.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--text-muted)' }}>
              No chapters found for "{searchQuery}"
            </div>
          ) : (
            filteredChapters.map((chapter) => (
              <motion.section 
                key={chapter.id} 
                id={chapter.id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}
                style={{ paddingBottom: '80px', marginBottom: '80px', borderBottom: '1px solid var(--border)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <span>Chapter {handbookData.findIndex(c => c.id === chapter.id) + 1}</span>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--text-muted)' }} />
                  <span>{chapter.estimatedTime} min read</span>
                </div>
                <GuideHeader title={chapter.title} subtitle={chapter.subtitle} />
                <div className="chapter-content">
                  {chapter.content.map((block, index) => renderContentBlock(block, index))}
                </div>
              </motion.section>
            ))
          )}
        </main>

        <StickyPanel progress={scrollProgress} totalTime={totalTime} estimatedTimeLeft={estimatedTimeLeft} />

      </div>
    </div>
  );
};

export default DMATHandbook;
