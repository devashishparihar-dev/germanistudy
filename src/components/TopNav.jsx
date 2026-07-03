import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Moon, Sun, Bell, User, Menu, X, BookOpen, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TopNav = ({ currentView, setCurrentView, session, isDarkMode, setIsDarkMode }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isAdmin = session?.user?.email === 'devashishparihar6@gmail.com';
  
  // Custom navigation structure mapping to views
  const navItems = [
    { label: 'Home', view: 'Home', isPublic: true },
    { label: 'Dashboard', view: 'Dashboard', isPublic: false },
    { label: 'Core Test', view: 'Core Test', isPublic: false },
    { label: 'Analytics', view: 'Analytics', isPublic: false },
    { label: 'Pricing', view: 'Home', isPublic: true }, // Placeholder
    { label: 'About', view: 'Home', isPublic: true }, // Placeholder
    { label: 'Blog', view: 'Blogs', isPublic: true },
  ];

  if (isAdmin) {
    navItems.push({ label: 'Admin Panel', view: 'Admin Panel', isPublic: false });
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentView('Home');
    setMobileMenuOpen(false);
  };

  const isMinimized = isScrolled && !isHovered;

  return (
    <motion.header 
      className="premium-topnav" 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={false}
      animate={{
        y: isMinimized ? "-80%" : "0%",
        opacity: isMinimized ? 0.9 : 1
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, 
        backgroundColor: isScrolled ? 'var(--surface-translucent)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none',
        borderBottom: isScrolled ? '1px solid var(--border)' : 'none',
        padding: isScrolled ? '12px 32px' : '20px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        width: '100%',
        boxShadow: isScrolled ? 'var(--shadow-soft)' : 'none'
      }}>
      <div className="nav-brand" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', transition: 'transform 0.2s ease' }} onClick={() => setCurrentView('Home')} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
        <img src="/assets/branding/logo_light.png" alt="GermaniStudy Logo" className="logo-light-mode" style={{ height: '72px', objectFit: 'contain' }} />
        <img src="/assets/branding/logo_dark.png" alt="GermaniStudy Logo" className="logo-dark-mode" style={{ height: '72px', objectFit: 'contain' }} />
      </div>

      {/* Desktop Navigation */}
      <ul className="nav-links-desktop hide-on-mobile" style={{ display: 'flex', gap: '4px', listStyle: 'none', margin: 0, padding: 0, alignItems: 'center' }}>
        {navItems.filter(item => item.isPublic || session).map((item) => (
          <li key={item.label}>
            <button 
              style={{
                background: 'transparent',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: 500,
                color: currentView === item.view ? 'var(--primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--text)'}
              onMouseLeave={(e) => e.target.style.color = currentView === item.view ? 'var(--primary)' : 'var(--text-muted)'}
              onClick={() => setCurrentView(item.view)}
            >
              {item.label}
              {currentView === item.view && (
                <motion.div
                  layoutId="nav-indicator"
                  style={{ position: 'absolute', bottom: 0, left: 16, right: 16, height: '2px', background: 'var(--primary)', borderRadius: '2px' }}
                />
              )}
            </button>
          </li>
        ))}
      </ul>

      <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: '8px', borderRadius: '50%' }}
          title="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        {session ? (
          <>
            <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: '8px', borderRadius: '50%' }}>
              <Bell size={20} />
            </button>
            <div className="profile-menu" style={{ position: 'relative' }}>
              <button 
                onClick={handleLogout}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '8px', 
                  background: 'var(--surface)', border: '1px solid var(--border)', 
                  padding: '6px 12px', borderRadius: '24px', cursor: 'pointer',
                  color: 'var(--text)', fontWeight: 500
                }}
                title="Log Out"
              >
                <div style={{ background: 'var(--primary)', color: 'white', borderRadius: '50%', padding: '4px' }}>
                  <User size={14} />
                </div>
                <span style={{ fontSize: '0.9rem' }}>Log Out</span>
              </button>
            </div>
          </>
        ) : (
          <button 
            className="btn-primary hide-on-mobile"
            onClick={() => setCurrentView('Auth')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 4px 6px -1px rgba(59, 0, 0, 0.2)'
            }}
          >
            Get Started
          </button>
        )}
        
        <button 
          className="hide-on-desktop"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: '8px' }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="hide-on-desktop"
            style={{ 
              position: 'absolute', top: '100%', left: 0, right: 0, 
              background: 'var(--surface)', borderBottom: '1px solid var(--border)', 
              boxShadow: 'var(--shadow-soft)', overflow: 'hidden' 
            }}
          >
            <ul style={{ listStyle: 'none', margin: 0, padding: '16px 32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {navItems.filter(item => item.isPublic || session).map((item) => (
                <li key={item.label}>
                  <button 
                    style={{ background: 'transparent', border: 'none', fontSize: '1.1rem', fontWeight: 500, color: currentView === item.view ? 'var(--primary)' : 'var(--text)', cursor: 'pointer', padding: '8px 0', width: '100%', textAlign: 'left' }}
                    onClick={() => { setCurrentView(item.view); setMobileMenuOpen(false); }}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              {!session && (
                <li style={{ marginTop: '8px' }}>
                  <button 
                    className="btn-primary"
                    onClick={() => { setCurrentView('Auth'); setMobileMenuOpen(false); }}
                    style={{ width: '100%', padding: '12px' }}
                  >
                    Get Started
                  </button>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default TopNav;
