import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import TopNav from './components/TopNav';
import Home from './views/Home';
import Dashboard from './views/Dashboard';
import TopicPractice from './views/TopicPractice';
import Library from './views/Library';
import Analytics from './views/Analytics';
import AdminPanel from './views/AdminPanel';
import Simulator from './views/Simulator';
import Auth from './views/Auth';
import NotFound from './views/NotFound';
import CoreTest from './views/CoreTest';
import Profile from './views/Profile';
import Settings from './views/Settings';
import Blogs from './views/Blogs';
import MockHistory from './views/MockHistory';

const publicViews = ['Home', 'Auth', 'Simulator', 'Core Test', 'Practice', 'Library', 'Blogs']; // temporarily whitelist Simulator and Core Test for testing without auth

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
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // If user logs out and is on a private route, redirect home or auth
      if (!session && !publicViews.includes(currentView)) {
        setCurrentView('Auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [currentView]);

  const renderView = () => {
    // Auth Guard
    if (!session && !publicViews.includes(currentView)) {
      // Force redirect to Auth if not logged in
      return <Auth setCurrentView={setCurrentView} />;
    }

    switch (currentView) {
      case 'Home':
        return <Home setCurrentView={setCurrentView} />;
      case 'Auth':
        return <Auth setCurrentView={setCurrentView} />;
      case 'Dashboard':
        return <Dashboard setCurrentView={setCurrentView} session={session} />;
      case 'Blogs':
        return <Blogs setCurrentView={setCurrentView} />;
      case 'History':
        return <MockHistory setCurrentView={setCurrentView} />;
      case 'Analytics':
        return <Analytics setCurrentView={setCurrentView} />;
      case 'Admin Panel':
        if (session?.user?.email !== 'devashishparihar6@gmail.com') {
          return <NotFound setCurrentView={setCurrentView} />;
        }
        return <AdminPanel setCurrentView={setCurrentView} />;
      case 'Core Test':
        return <CoreTest setCurrentView={setCurrentView} />;
      case 'Practice':
        return <TopicPractice setCurrentView={setCurrentView} />;
      case 'Library':
        return <Library setCurrentView={setCurrentView} />;
      case 'Profile':
        return <Profile setCurrentView={setCurrentView} session={session} />;
      case 'Settings':
        return <Settings setCurrentView={setCurrentView} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />;
      case 'Simulator':
        return <Simulator setCurrentView={setCurrentView} />;
      default:
        return <Home setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="platform-container">
      {['Home', 'Auth', 'Admin Panel', 'Blogs'].includes(currentView) && (
        <TopNav 
          currentView={currentView} 
          setCurrentView={setCurrentView} 
          session={session} 
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />
      )}
      <div className={`platform-content ${!['Home', 'Auth', 'Admin Panel', 'Blogs'].includes(currentView) ? 'simulator-active' : ''}`}>
        {renderView()}
      </div>
    </div>
  );
}

export default App;
