import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { supabase } from './supabaseClient';
import ScrollToTop from './components/ScrollToTop';
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

const AuthGuard = ({ session, children }) => {
  if (!session) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

const AppLayout = ({ session, isAdmin, isDarkMode, setIsDarkMode }) => {
  const location = useLocation();
  const path = location.pathname;
  
  const showNavAndWidget = path === '/' || path === '/blogs' || path.startsWith('/blogs/') || path === '/pricing' || path === '/guides/dmat';
  const simulatorActive = !showNavAndWidget;

  return (
    <div className="platform-container">
      {showNavAndWidget && (
        <TopNav 
          session={session} 
          isAdmin={isAdmin}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />
      )}
      {showNavAndWidget && <WhatsAppWidget />}
      <div className={`platform-content ${simulatorActive ? 'simulator-active' : ''}`}>
        <Outlet />
      </div>
    </div>
  );
};

function App() {
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
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isInitializing) {
    return <div style={{ minHeight: '100vh', background: 'var(--background)' }} />;
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<AppLayout session={session} isAdmin={isAdmin} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}>
          
          {/* Public Routes */}
          <Route path="/" element={session ? <Navigate to="/dashboard" replace /> : <Home isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
          <Route path="/auth" element={session ? <Navigate to="/dashboard" replace /> : <Auth />} />
          <Route path="/library" element={<Library />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:blogId" element={<BlogPost />} />
          <Route path="/pricing" element={<div style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--background)' }}><PricingCards /></div>} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/guides/aps" element={<APSGuide />} />
          <Route path="/guides/dmat" element={<DMATHandbook />} />
          <Route path="/simulator/core" element={<DigitalCoreTest />} />
          <Route path="/simulator/subject" element={<DigitalSubjectTest />} />
          <Route path="/simulator" element={<DigitalSimulator />} />
          <Route path="/simulator/preview" element={<UnauthPreview />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<AuthGuard session={session}><Dashboard session={session} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} /></AuthGuard>} />
          <Route path="/history" element={<AuthGuard session={session}><MockHistory /></AuthGuard>} />
          <Route path="/analytics" element={<AuthGuard session={session}><Analytics /></AuthGuard>} />
          <Route path="/profile" element={<AuthGuard session={session}><Profile session={session} /></AuthGuard>} />
          <Route path="/settings" element={<AuthGuard session={session}><Settings isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} /></AuthGuard>} />
          <Route path="/admin" element={<AuthGuard session={session}><AdminPanel session={session} /></AuthGuard>} />

          {/* Study Routes (Protected) */}
          <Route path="/study/core/figure-sequences" element={<AuthGuard session={session}><StudyCoreFigureSequences /></AuthGuard>} />
          <Route path="/study/core/math-equations" element={<AuthGuard session={session}><StudyCoreMathEquations /></AuthGuard>} />
          <Route path="/study/core/latin-squares" element={<AuthGuard session={session}><StudyCoreLatinSquares /></AuthGuard>} />
          <Route path="/study/subject/math" element={<AuthGuard session={session}><StudySubjectMath /></AuthGuard>} />
          <Route path="/study/subject/engineering" element={<AuthGuard session={session}><StudySubjectEngineering /></AuthGuard>} />
          <Route path="/study/subject/natural-sciences" element={<AuthGuard session={session}><StudySubjectNaturalSciences /></AuthGuard>} />
          <Route path="/study/subject/business" element={<AuthGuard session={session}><StudySubjectBusiness /></AuthGuard>} />
          <Route path="/study/subject/economics" element={<AuthGuard session={session}><StudySubjectEconomics /></AuthGuard>} />
          <Route path="/study/subject/social-sciences" element={<AuthGuard session={session}><StudySubjectSocialSciences /></AuthGuard>} />

          {/* Practice Routes (Protected) */}
          <Route path="/practice/core/figure-sequences" element={<AuthGuard session={session}><PracticeCoreFigureSequences /></AuthGuard>} />
          <Route path="/practice/core/math-equations" element={<AuthGuard session={session}><PracticeCoreMathEquations /></AuthGuard>} />
          <Route path="/practice/core/latin-squares" element={<AuthGuard session={session}><PracticeCoreLatinSquares /></AuthGuard>} />
          <Route path="/practice/subject/math" element={<AuthGuard session={session}><PracticeSubjectMath /></AuthGuard>} />
          <Route path="/practice/subject/engineering" element={<AuthGuard session={session}><PracticeSubjectEngineering /></AuthGuard>} />
          <Route path="/practice/subject/natural-sciences" element={<AuthGuard session={session}><PracticeSubjectNaturalSciences /></AuthGuard>} />
          <Route path="/practice/subject/business" element={<AuthGuard session={session}><PracticeSubjectBusiness /></AuthGuard>} />
          <Route path="/practice/subject/economics" element={<AuthGuard session={session}><PracticeSubjectEconomics /></AuthGuard>} />
          <Route path="/practice/subject/social-sciences" element={<AuthGuard session={session}><PracticeSubjectSocialSciences /></AuthGuard>} />

          {/* Mock Routes (Protected) */}
          <Route path="/mocks/full" element={<AuthGuard session={session}><MockTestsFull /></AuthGuard>} />
          <Route path="/mocks/core" element={<AuthGuard session={session}><MockTestsCore /></AuthGuard>} />
          <Route path="/mocks/subject" element={<AuthGuard session={session}><MockTestsSubject /></AuthGuard>} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
