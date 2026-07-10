import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { AdminProvider } from './context/AdminContext';
import { SmoothScrollProvider, useLenis } from './lib/SmoothScrollProvider';
import TerminalBackground from './components/background/TerminalBackground';
import CustomCursor from './components/CustomCursor';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Header from './components/Header';
import ScrollProgress from './components/ScrollProgress';
import './styles/App.css';
import { EASE_OUT } from './utils/animations';

const ProjectDetails = lazy(() => import('./pages/ProjectDetails'));
const AdminPage = lazy(() => import('./pages/admin/AdminPage'));
const Terminal = lazy(() => import('./components/terminal/Terminal'));

const pageVariants = {
  initial: { opacity: 0, y: 16, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -16, filter: 'blur(4px)' },
};

const pageTransition = { duration: 0.4, ease: EASE_OUT };

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}

function MainPage() {
  return (
    <PageWrapper>
      <main>
        <section id="home">
          <Home />
        </section>
        <section id="about">
          <About />
        </section>
        <section id="projects">
          <Projects />
        </section>
        <section id="contact">
          <Contact />
        </section>
      </main>
    </PageWrapper>
  );
}

function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const lenis = useLenis();
  const isAdmin = location.pathname === '/admin';
  const isMainPage = location.pathname === '/';

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        navigate(location.pathname === '/admin' ? '/' : '/admin');
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate, location.pathname]);

  useEffect(() => {
    if (!lenis) return;
    if (isAdmin) lenis.stop();
    else lenis.start();
  }, [lenis, isAdmin]);

  return (
    <>
      {isMainPage && <ScrollProgress />}
      {isMainPage && <Header />}
      <Suspense fallback={null}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<MainPage />} />
            <Route
              path="/project/:slug"
              element={
                <PageWrapper>
                  <ProjectDetails />
                </PageWrapper>
              }
            />
            <Route
              path="/admin"
              element={
                <PageWrapper>
                  <AdminPage />
                </PageWrapper>
              }
            />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AdminProvider>
        <SmoothScrollProvider>
          <div className="app">
            <CustomCursor />
            <TerminalBackground />
            <AppRoutes />
            <Suspense fallback={null}>
              <Terminal />
            </Suspense>
          </div>
        </SmoothScrollProvider>
      </AdminProvider>
    </MotionConfig>
  );
}

export default App;
