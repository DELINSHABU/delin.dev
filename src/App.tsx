import React from 'react';
import { motion } from 'framer-motion';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Header from './components/Header';
import ParallaxBackground from './components/ParallaxBackground';
import ScrollProgress from './components/ScrollProgress';
import './styles/App.css';

function AppContent() {
  const { theme } = useTheme();
  
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    duration: 0.6,
    type: "tween" as const
  };

  return (
    <motion.div 
      className={`app ${theme}`}
      initial="initial"
      animate="animate"
      variants={pageVariants}
      transition={pageTransition}
    >
      <ScrollProgress />
      <Header />
      <main>
        <ParallaxBackground offset={30}>
          <motion.section 
            id="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <Home />
          </motion.section>
        </ParallaxBackground>

        <ParallaxBackground offset={-20}>
          <motion.section 
            id="about"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <About />
          </motion.section>
        </ParallaxBackground>

        <ParallaxBackground offset={40}>
          <motion.section 
            id="projects"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Projects />
          </motion.section>
        </ParallaxBackground>

        <ParallaxBackground offset={-30}>
          <motion.section 
            id="contact"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Contact />
          </motion.section>
        </ParallaxBackground>
      </main>
    </motion.div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
