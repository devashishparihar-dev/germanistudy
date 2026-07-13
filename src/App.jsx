import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import TopNav from './components/TopNav';
import WhatsAppWidget from './components/WhatsAppWidget';
import Home from './views/Home';
import Dashboard from './views/Dashboard';
import TopicPractice from './views/TopicPractice';
import Library from './views/Library';
import Analytics from './views/Analytics';
import AdminPanel from './views/AdminPanel';
import Auth from './views/Auth';
import NotFound from './views/NotFound';
import Profile from './views/Profile';
import Settings from './views/Settings';
import Blogs from './views/Blogs';
import BlogPost from './views/BlogPost';
import MockHistory from './views/MockHistory';
import DigitalCoreTest from './views/DigitalCoreTest';
import DigitalSubjectTest from './views/DigitalSubjectTest';
import DigitalSimulator from './views/DigitalSimulator';
import UnauthPreview from './views/UnauthPreview';
import PricingCards from './components/PricingCards';
const publicViews = ['Home', 'Auth', 'Practice', 'Library', 'Blogs', 'BlogPost', 'digital-core-test', 'digital-subject-test', 'DigitalSimulator', 'UnauthPreview', 'Pricing'];

function App() {
  const getInitialView = () => {
    try {
      const hash = window.location.hash.replace('#', '');
      return hash ? decodeURIComponent(hash) : 'Home';
    } catch {
      return 'Home';
    }
  };

  const [currentView, setCurrentView] = useState(getInitialView);

  useEffect(() => {
    try {
      const hash = window.location.hash.replace('#', '');
      if (decodeURIComponent(hash) !== currentView) {
        if (!hash) {
          window.history.replaceState(null, '', `#${encodeURIComponent(currentView)}`);
        } else {
          window.history.pushState(null, '', `#${encodeURIComponent(currentView)}`);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentView]);

  useEffect(() => {
    const handlePopState = () => {
      try {
        const hash = window.location.hash.replace('#', '');
        setCurrentView(hash ? decodeURIComponent(hash) : 'Home');
      } catch {
        setCurrentView('Home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsInitializing(false);
      checkAdminStatus(session);
    });

    const checkAdminStatus = async (currentSession) => {
      if (currentSession?.user) {
        const { data } = await supabase.from('profiles').select('role').eq('id', currentSession.user.id).single();
        setIsAdmin(data?.role === 'admin');
      } else {
        setIsAdmin(false);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      checkAdminStatus(session);
      // If user logs out and is on a private route, redirect home or auth
      const isPublic = publicViews.includes(currentView) || currentView.startsWith('BlogPost:');
      if (!session && !isPublic) {
        setCurrentView('Auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [currentView]);

  useEffect(() => {
    if (session && currentView === 'Home') {
      setCurrentView('Dashboard');
    }
  }, [session, currentView]);

  const renderView = () => {
    // Auth Guard
    const isPublic = publicViews.includes(currentView) || currentView.startsWith('BlogPost:');
    if (!session && !isPublic) {
      // Force redirect to Auth if not logged in
      return <Auth setCurrentView={setCurrentView} />;
    }

    switch (currentView) {
      case 'Home':
        return <Home setCurrentView={setCurrentView} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />;
      case 'UnauthPreview':
        return <UnauthPreview setCurrentView={setCurrentView} />;
      case 'Auth':
        return <Auth setCurrentView={setCurrentView} />;
      case 'Dashboard':
        return <Dashboard setCurrentView={setCurrentView} session={session} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />;
      case 'Blogs':
        return <Blogs setCurrentView={setCurrentView} />;
      case 'History':
        return <MockHistory setCurrentView={setCurrentView} />;
      case 'Analytics':
        return <Analytics setCurrentView={setCurrentView} />;
      case 'admin-panel':
        if (!session?.user) {
          return <NotFound setCurrentView={setCurrentView} />;
        }
        // Admin access is checked in the AdminPanel component via Supabase profiles
        // OR we can do a check here. Since it's a synchronous switch statement, 
        // we'll let AdminPanel handle the loading state & redirect if unauthorized.
        return <AdminPanel setCurrentView={setCurrentView} session={session} />;
      case 'digital-core-test':
        return <DigitalCoreTest setCurrentView={setCurrentView} />;
      case 'digital-subject-test':
        return <DigitalSubjectTest setCurrentView={setCurrentView} />;
      case 'Practice':
        return <TopicPractice setCurrentView={setCurrentView} />;
      case 'Library':
        return <Library setCurrentView={setCurrentView} />;
      case 'Profile':
        return <Profile setCurrentView={setCurrentView} session={session} />;
      case 'Settings':
        return <Settings setCurrentView={setCurrentView} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />;
      case 'DigitalSimulator':
        return <DigitalSimulator setCurrentView={setCurrentView} />;
      case 'Pricing':
        return (
          <div style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--background)' }}>
            <PricingCards setCurrentView={setCurrentView} />
          </div>
        );
      default:
        if (currentView.startsWith('BlogPost:')) {
          const blogId = currentView.split(':')[1];
          return <BlogPost setCurrentView={setCurrentView} blogId={blogId} />;
        }
        return <Home setCurrentView={setCurrentView} />;
    }
  };

  if (isInitializing) {
    return <div style={{ minHeight: '100vh', background: 'var(--background)' }} />;
  }

  return (
    <div className="platform-container">
      {(['Home', 'admin-panel', 'Blogs', 'Pricing'].includes(currentView) || currentView.startsWith('BlogPost:')) && (
        <TopNav 
          currentView={currentView} 
          setCurrentView={setCurrentView} 
          session={session} 
          isAdmin={isAdmin}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />
      )}
      {(['Home', 'Blogs', 'Pricing'].includes(currentView) || currentView.startsWith('BlogPost:')) && (
        <WhatsAppWidget />
      )}
      <div className={`platform-content ${!(['Home', 'admin-panel', 'Blogs', 'Pricing'].includes(currentView) || currentView.startsWith('BlogPost:')) ? 'simulator-active' : ''}`}>
        {renderView()}
      </div>
    </div>
  );
}

export default App;
