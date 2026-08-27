import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import TopNav from './components/TopNav';
import WhatsAppWidget from './components/WhatsAppWidget';
import Home from './views/Home';
import Dashboard from './views/Dashboard';
import Library from './views/Library';
import Analytics from './views/Analytics';
import AdminPanel from './views/AdminPanel';
import Auth from './views/Auth';
import NotFound from './views/NotFound';
import Profile from './views/Profile';
import Settings from './views/Settings';
import Blogs from './views/Blogs';
import APSGuide from './views/APSGuide';
import BlogPost from './views/BlogPost';
import MockHistory from './views/MockHistory';
import DigitalCoreTest from './views/DigitalCoreTest';
import DigitalSubjectTest from './views/DigitalSubjectTest';
import DigitalSimulator from './views/DigitalSimulator';
import UnauthPreview from './views/UnauthPreview';
import PricingCards from './components/PricingCards';
import PrivacyPolicy from './views/PrivacyPolicy';
import TermsOfService from './views/TermsOfService';
import DMATHandbook from './views/DMATHandbook';

// Study Materials
import StudyCoreFigureSequences from './views/study/StudyCoreFigureSequences';
import StudyCoreMathEquations from './views/study/StudyCoreMathEquations';
import StudyCoreLatinSquares from './views/study/StudyCoreLatinSquares';
import StudySubjectMath from './views/study/StudySubjectMath';
import StudySubjectEngineering from './views/study/StudySubjectEngineering';
import StudySubjectNaturalSciences from './views/study/StudySubjectNaturalSciences';
import StudySubjectBusiness from './views/study/StudySubjectBusiness';
import StudySubjectEconomics from './views/study/StudySubjectEconomics';
import StudySubjectSocialSciences from './views/study/StudySubjectSocialSciences';

// Practice
import PracticeCoreFigureSequences from './views/practice/PracticeCoreFigureSequences';
import PracticeCoreMathEquations from './views/practice/PracticeCoreMathEquations';
import PracticeCoreLatinSquares from './views/practice/PracticeCoreLatinSquares';
import PracticeSubjectMath from './views/practice/PracticeSubjectMath';
import PracticeSubjectEngineering from './views/practice/PracticeSubjectEngineering';
import PracticeSubjectNaturalSciences from './views/practice/PracticeSubjectNaturalSciences';
import PracticeSubjectBusiness from './views/practice/PracticeSubjectBusiness';
import PracticeSubjectEconomics from './views/practice/PracticeSubjectEconomics';
import PracticeSubjectSocialSciences from './views/practice/PracticeSubjectSocialSciences';

// Mocks
import MockTestsFull from './views/mocks/MockTestsFull';
import MockTestsCore from './views/mocks/MockTestsCore';
import MockTestsSubject from './views/mocks/MockTestsSubject';

const publicViews = ['Home', 'Auth', 'Library', 'Blogs', 'BlogPost', 'digital-core-test', 'digital-subject-test', 'DigitalSimulator', 'UnauthPreview', 'Pricing', 'PrivacyPolicy', 'TermsOfService', 'APSGuide', 'DMATHandbook'];

function App() {
  const getInitialView = () => {
    try {
      const hash = window.location.hash.replace('#', '');
      return hash ? decodeURIComponent(hash) : 'Home';
    } catch {
      return 'Home';
    }
  };

  const [currentView, _setCurrentView] = useState(getInitialView);

  const setCurrentView = (view) => {
    if (typeof view === 'function') {
      view = view(currentView);
    }
    if (view === currentView) return;
    
    _setCurrentView(view);
    
    const encodedView = encodeURIComponent(view);
    if (window.location.hash.replace('#', '') !== encodedView) {
      window.location.hash = encodedView;
    }
  };

  useEffect(() => {
    if (!window.location.hash) {
      window.history.replaceState(null, '', `#${encodeURIComponent(getInitialView())}`);
    }
  }, []);

  useEffect(() => {
    const handleNavigation = () => {
      try {
        const hash = window.location.hash.replace('#', '');
        _setCurrentView(hash ? decodeURIComponent(hash) : 'Home');
      } catch {
        _setCurrentView('Home');
      }
    };
    
    window.addEventListener('hashchange', handleNavigation);
    window.addEventListener('popstate', handleNavigation);
    return () => {
      window.removeEventListener('hashchange', handleNavigation);
      window.removeEventListener('popstate', handleNavigation);
    };
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
      case 'APSGuide':
        return <APSGuide setCurrentView={setCurrentView} />;
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
      case 'DMATHandbook':
        return <DMATHandbook setCurrentView={setCurrentView} />;
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
      case 'PrivacyPolicy':
        return <PrivacyPolicy setCurrentView={setCurrentView} />;
      case 'TermsOfService':
        return <TermsOfService setCurrentView={setCurrentView} />;
        
      case 'StudyCoreFigureSequences': return <StudyCoreFigureSequences setCurrentView={setCurrentView} />;
      case 'StudyCoreMathEquations': return <StudyCoreMathEquations setCurrentView={setCurrentView} />;
      case 'StudyCoreLatinSquares': return <StudyCoreLatinSquares setCurrentView={setCurrentView} />;
      case 'StudySubjectMath': return <StudySubjectMath setCurrentView={setCurrentView} />;
      case 'StudySubjectEngineering': return <StudySubjectEngineering setCurrentView={setCurrentView} />;
      case 'StudySubjectNaturalSciences': return <StudySubjectNaturalSciences setCurrentView={setCurrentView} />;
      case 'StudySubjectBusiness': return <StudySubjectBusiness setCurrentView={setCurrentView} />;
      case 'StudySubjectEconomics': return <StudySubjectEconomics setCurrentView={setCurrentView} />;
      case 'StudySubjectSocialSciences': return <StudySubjectSocialSciences setCurrentView={setCurrentView} />;

      case 'PracticeCoreFigureSequences': return <PracticeCoreFigureSequences setCurrentView={setCurrentView} />;
      case 'PracticeCoreMathEquations': return <PracticeCoreMathEquations setCurrentView={setCurrentView} />;
      case 'PracticeCoreLatinSquares': return <PracticeCoreLatinSquares setCurrentView={setCurrentView} />;
      case 'PracticeSubjectMath': return <PracticeSubjectMath setCurrentView={setCurrentView} />;
      case 'PracticeSubjectEngineering': return <PracticeSubjectEngineering setCurrentView={setCurrentView} />;
      case 'PracticeSubjectNaturalSciences': return <PracticeSubjectNaturalSciences setCurrentView={setCurrentView} />;
      case 'PracticeSubjectBusiness': return <PracticeSubjectBusiness setCurrentView={setCurrentView} />;
      case 'PracticeSubjectEconomics': return <PracticeSubjectEconomics setCurrentView={setCurrentView} />;
      case 'PracticeSubjectSocialSciences': return <PracticeSubjectSocialSciences setCurrentView={setCurrentView} />;

      case 'MockTestsFull': return <MockTestsFull setCurrentView={setCurrentView} />;
      case 'MockTestsCore': return <MockTestsCore setCurrentView={setCurrentView} />;
      case 'MockTestsSubject': return <MockTestsSubject setCurrentView={setCurrentView} />;

      default:
        if (currentView.startsWith('BlogPost:')) {
          const blogId = currentView.split(':')[1];
          return <BlogPost setCurrentView={setCurrentView} blogId={blogId} />;
        }
        return <NotFound setCurrentView={setCurrentView} />;
    }
  };

  if (isInitializing) {
    return <div style={{ minHeight: '100vh', background: 'var(--background)' }} />;
  }

  return (
    <div className="platform-container">
      {(['Home', 'Blogs', 'Pricing', 'DMATHandbook'].includes(currentView) || currentView.startsWith('BlogPost:')) && (
        <TopNav 
          currentView={currentView} 
          setCurrentView={setCurrentView} 
          session={session} 
          isAdmin={isAdmin}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />
      )}
      {(['Home', 'Blogs', 'Pricing', 'DMATHandbook'].includes(currentView) || currentView.startsWith('BlogPost:')) && (
        <WhatsAppWidget />
      )}
      <div className={`platform-content ${!(['Home', 'Blogs', 'Pricing', 'DMATHandbook'].includes(currentView) || currentView.startsWith('BlogPost:')) ? 'simulator-active' : ''}`}>
        {renderView()}
      </div>
    </div>
  );
}

export default App;
