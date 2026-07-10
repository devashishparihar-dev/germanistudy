import React, { useState, useEffect } from 'react';
import { LayoutDashboard, BookOpen, BarChart3, Settings, User, Compass, Target, FolderOpen, History, Menu, X, Shield } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

const ExamSidebar = ({ setCurrentView }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    
    // Check if user is admin
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(session?.user?.email === 'devashishparihar6@gmail.com');
    });

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, view: 'Dashboard' },
    { label: 'Core Module', icon: <BookOpen size={20} />, view: 'Digital Core Test' },
    { label: 'Subject Module', icon: <Target size={20} />, view: 'Digital Subject Test' },
    { label: 'Practice', icon: <Target size={20} />, view: 'Practice' },
    { label: 'Library', icon: <FolderOpen size={20} />, view: 'Library' },
    { label: 'Analytics', icon: <BarChart3 size={20} />, view: 'Analytics' },
    { label: 'History', icon: <History size={20} />, view: 'History' },
    { label: 'Blogs', icon: <Compass size={20} />, view: 'Blogs' },
    { label: 'Settings', icon: <Settings size={20} />, view: 'Settings', bottom: true },
    { label: 'Profile', icon: <User size={20} />, view: 'Profile', bottom: true },
  ];

  if (isAdmin) {
    menuItems.push({ label: 'Admin Panel', icon: <Shield size={20} />, view: 'Admin Panel', bottom: true });
  }

  return (
    <>
      {!isMobile && (
        <div style={{ width: 70, flexShrink: 0, display: 'block', height: '100vh', position: 'sticky', top: 0, zIndex: 10 }} />
      )}
      
      {isMobile && (
        <button 
          onClick={() => setMobileOpen(true)}
          style={{
            position: 'fixed', top: '16px', left: '16px', zIndex: 90,
            background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px',
            color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-soft)', cursor: 'pointer'
          }}
        >
          <Menu size={24} />
        </button>
      )}

      <AnimatePresence>
        {isMobile && mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mobile-sidebar-backdrop"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ 
          width: isMobile ? 280 : (collapsed ? 70 : 250),
          x: isMobile ? (mobileOpen ? 0 : -280) : 0
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onMouseEnter={() => !isMobile && setCollapsed(false)}
        onMouseLeave={() => !isMobile && setCollapsed(true)}
        style={{
          height: '100vh', background: 'var(--background)', color: 'var(--text)',
          display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)',
          position: 'fixed', top: 0, left: 0, overflow: 'hidden', flexShrink: 0, zIndex: 100,
          boxShadow: collapsed ? 'none' : '4px 0 24px rgba(0,0,0,0.2)'
        }}
      >
      <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => !isMobile && setCollapsed(!collapsed)}>
        <div style={{ width: (isMobile || !collapsed) ? '230px' : '48px', height: '64px', overflow: 'hidden', transition: 'width 0.2s ease', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          {(isMobile || !collapsed) ? (
            <>
              <img src="/assets/branding/logo_wide_light.png" alt="GermaniStudy Logo" className="logo-light-mode" style={{ height: '64px', width: '100%', objectFit: 'contain', objectPosition: 'left center', transform: 'scale(1.15)', transformOrigin: 'left center' }} />
              <img src="/assets/branding/logo_wide_dark.png" alt="GermaniStudy Logo" className="logo-dark-mode" style={{ height: '64px', width: '100%', objectFit: 'contain', objectPosition: 'left center', transform: 'scale(1.15)', transformOrigin: 'left center' }} />
            </>
          ) : (
            <>
              <img src="/assets/branding/logo_light.png" alt="GermaniStudy Logo" className="logo-light-mode" style={{ height: '48px', width: 'auto', maxWidth: 'none' }} />
              <img src="/assets/branding/logo_dark.png" alt="GermaniStudy Logo" className="logo-dark-mode" style={{ height: '48px', width: 'auto', maxWidth: 'none' }} />
            </>
          )}
        </div>
        {isMobile && (
          <button onClick={() => setMobileOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', display: 'flex', padding: '4px', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        )}
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px 12px', flex: 1, overflowY: 'auto' }}>
        {menuItems.filter(i => !i.bottom).map((item, idx) => (
          <button
            key={idx}
            onClick={() => {
              if(setCurrentView) setCurrentView(item.view);
              if(isMobile) setMobileOpen(false);
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: '16px', padding: '12px',
              background: 'transparent', color: 'var(--text-muted)', border: 'none',
              borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', width: '100%',
              fontFamily: 'var(--font-body)'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 212, 130, 0.1)'; e.currentTarget.style.color = 'var(--accent)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <div style={{ flexShrink: 0 }}>{item.icon}</div>
            <AnimatePresence>
              {(isMobile || !collapsed) && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}
      </nav>

      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {menuItems.filter(i => i.bottom).map((item, idx) => (
          <button
            key={idx}
            onClick={() => {
              if(setCurrentView) setCurrentView(item.view);
              if(isMobile) setMobileOpen(false);
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: '16px', padding: '12px',
              background: 'transparent', color: 'var(--text-muted)', border: 'none',
              borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', width: '100%',
              fontFamily: 'var(--font-body)'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 212, 130, 0.1)'; e.currentTarget.style.color = 'var(--accent)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <div style={{ flexShrink: 0 }}>{item.icon}</div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}
      </div>
    </motion.aside>
    </>
  );
};

export default ExamSidebar;
