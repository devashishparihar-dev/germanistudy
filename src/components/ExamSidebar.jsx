import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, BarChart3, Settings, User, Compass, Target, FolderOpen, History, Menu, X, Shield, Layers, ChevronDown, ChevronRight } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

const ExamSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false); // Default to open for better navigation discovery
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isAdmin, setIsAdmin] = useState(false);

  // Track expanded state for nested menus
  const [expandedMenus, setExpandedMenus] = useState({});

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) setCollapsed(false); // Mobile always uses full width in its drawer
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
        setIsAdmin(data?.role === 'admin');
      }
    });

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = (menuLabel) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuLabel]: !prev[menuLabel]
    }));
    // Auto-expand sidebar if a menu is opened while collapsed
    if (collapsed && !expandedMenus[menuLabel]) {
      setCollapsed(false);
    }
  };

  const menuItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { label: 'DMAT Handbook', icon: <BookOpen size={20} />, path: '/guides/dmat' },
    { 
      label: 'Study Materials', 
      icon: <BookOpen size={20} />,
      subItems: [
        { group: 'Core Module' },
        { label: 'Figure Sequences', path: '/study/core/figure-sequences' },
        { label: 'Math Equations', path: '/study/core/math-equations' },
        { label: 'Latin Squares', path: '/study/core/latin-squares' },
        { group: 'Subject Module' },
        { label: 'Mathematics', path: '/study/subject/math' },
        { label: 'Engineering', path: '/study/subject/engineering' },
        { label: 'Natural Sciences', path: '/study/subject/natural-sciences' },
        { label: 'Business', path: '/study/subject/business' },
        { label: 'Economics', path: '/study/subject/economics' },
        { label: 'Social Sciences', path: '/study/subject/social-sciences' },
      ]
    },
    { 
      label: 'Practice', 
      icon: <Target size={20} />,
      subItems: [
        { group: 'Core Module' },
        { label: 'Figure Sequences', path: '/practice/core/figure-sequences' },
        { label: 'Math Equations', path: '/practice/core/math-equations' },
        { label: 'Latin Squares', path: '/practice/core/latin-squares' },
        { group: 'Subject Module' },
        { label: 'Mathematics', path: '/practice/subject/math' },
        { label: 'Engineering', path: '/practice/subject/engineering' },
        { label: 'Natural Sciences', path: '/practice/subject/natural-sciences' },
        { label: 'Business', path: '/practice/subject/business' },
        { label: 'Economics', path: '/practice/subject/economics' },
        { label: 'Social Sciences', path: '/practice/subject/social-sciences' },
      ]
    },
    { 
      label: 'Mock Tests', 
      icon: <Layers size={20} />,
      subItems: [
        { label: 'Full dMAT Mocks', path: '/mocks/full' },
        { label: 'Core Module Mocks', path: '/mocks/core' },
        { label: 'Subject Module Mocks', path: '/mocks/subject' }
      ]
    },
    { label: 'Analytics', icon: <BarChart3 size={20} />, path: '/analytics' },
    { label: 'Settings', icon: <Settings size={20} />, path: '/settings', bottom: true },
    { label: 'Profile', icon: <User size={20} />, path: '/profile', bottom: true },
  ];

  if (isAdmin) {
    menuItems.push({ label: 'Admin Panel', icon: <Shield size={20} />, path: '/admin', bottom: true });
  }

  // Auto-expand menu if current path matches any sub-item
  useEffect(() => {
    menuItems.forEach(item => {
      if (item.subItems) {
        const hasActiveChild = item.subItems.some(sub => sub.path === location.pathname);
        if (hasActiveChild) {
          setExpandedMenus(prev => ({ ...prev, [item.label]: true }));
        }
      }
    });
  }, [location.pathname]);

  const renderNavButton = (item, isSubItem = false, isGroupHeader = false) => {
    if (isGroupHeader) {
      return (
        <div key={item.group} style={{ padding: '16px 12px 8px 36px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--primary)' }}>
          {item.group}
        </div>
      );
    }

    const isActive = location.pathname === item.path;
    const hasSubItems = !!item.subItems;
    const isExpanded = expandedMenus[item.label];

    return (
      <div key={item.label} style={{ display: 'flex', flexDirection: 'column' }}>
        <button
          onClick={() => {
            if (hasSubItems) {
              toggleMenu(item.label);
            } else if (item.path) {
              navigate(item.path);
              if (isMobile) setMobileOpen(false);
            }
          }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', 
            padding: isSubItem ? '10px 12px 10px 36px' : '12px',
            background: isActive ? 'rgba(217, 164, 65, 0.1)' : 'transparent', 
            color: isActive ? 'var(--primary)' : 'var(--text-muted)', 
            border: 'none',
            borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', width: '100%',
            fontFamily: 'var(--font-body)', fontWeight: isActive ? 600 : 500,
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.color = 'var(--text)'; } }}
          onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; } }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {item.icon && <div style={{ flexShrink: 0 }}>{item.icon}</div>}
            <AnimatePresence>
              {(isMobile || !collapsed) && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ fontSize: isSubItem ? '0.95rem' : '1rem' }}>
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          {(isMobile || !collapsed) && hasSubItems && (
            <div style={{ color: 'var(--text-muted)' }}>
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
          )}
        </button>

        {/* Sub Items Dropdown */}
        <AnimatePresence>
          {hasSubItems && isExpanded && (isMobile || !collapsed) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}
            >
              {item.subItems.map((subItem, idx) => renderNavButton(subItem, !subItem.group, !!subItem.group))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      {!isMobile && (
        <div style={{ width: collapsed ? 90 : 280, flexShrink: 0, display: 'block', height: '100vh', position: 'sticky', top: 0, zIndex: 10, transition: 'width 0.2s' }} />
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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="mobile-sidebar-backdrop"
            onClick={() => setMobileOpen(false)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ 
          width: isMobile ? 320 : (collapsed ? 90 : 280),
          x: isMobile ? (mobileOpen ? 0 : -320) : 0
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{
          height: '100vh', background: 'var(--background)', color: 'var(--text)',
          display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)',
          position: 'fixed', top: 0, left: 0, overflow: 'hidden', flexShrink: 0, zIndex: 100,
          boxShadow: (isMobile && mobileOpen) ? '4px 0 24px rgba(0,0,0,0.2)' : 'none'
        }}
      >
        <div style={{ padding: collapsed ? '16px' : '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'padding 0.2s' }} onClick={() => !isMobile && setCollapsed(!collapsed)}>
          <div style={{ width: (isMobile || !collapsed) ? '100%' : '58px', height: (isMobile || !collapsed) ? 'auto' : '58px', overflow: 'hidden', transition: 'all 0.2s ease', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            {(isMobile || !collapsed) ? (
              <>
                <img src="/assets/branding/logo_wide_light.png" alt="GermaniStudy Logo" className="logo-light-mode" style={{ height: 'auto', width: '100%', objectFit: 'contain', objectPosition: 'left center' }} />
                <img src="/assets/branding/logo_wide_dark.png" alt="GermaniStudy Logo" className="logo-dark-mode" style={{ height: 'auto', width: '100%', objectFit: 'contain', objectPosition: 'left center' }} />
              </>
            ) : (
              <>
                <img src="/assets/branding/favicon_light.png" alt="GermaniStudy Logo" className="logo-light-mode" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                <img src="/assets/branding/favicon_dark.png" alt="GermaniStudy Logo" className="logo-dark-mode" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </>
            )}
          </div>
          {isMobile && (
            <button onClick={() => setMobileOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', display: 'flex', padding: '4px', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          )}
        </div>

        <nav className="custom-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '16px 12px', flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {menuItems.filter(i => !i.bottom).map(item => renderNavButton(item))}
        </nav>

        <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {menuItems.filter(i => i.bottom).map(item => renderNavButton(item))}
        </div>
      </motion.aside>
    </>
  );
};

export default ExamSidebar;
