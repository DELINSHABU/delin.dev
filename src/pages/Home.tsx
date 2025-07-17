import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { useTheme } from '../context/ThemeContext';
import TypewriterText from '../components/TypewriterText';
import '../styles/Home.css';

const Home: React.FC = () => {
  const { theme } = useTheme();
  const [showContent, setShowContent] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTitleComplete = () => {
    setShowDescription(true);
  };

  const handleDescriptionComplete = () => {
    setShowContent(true);
  };

  return (
    <div className={`home ${theme}`}>
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <TypewriterText 
              text="Hi, I'm Delin" 
              speed={150}
              startDelay={800}
              cursorChar="_"
              onComplete={handleTitleComplete}
            />
          </h1>
          
          {showDescription && (
            <p className="hero-description">
              <TypewriterText 
                text="Embarking on a coding odyssey with React.js, MongoDB and a sprinkle of motion graphics. Unemployed by companies, employed by laughter."
                speed={25}
                startDelay={300}
                cursorChar="|"
                showCursor={false}
                onComplete={handleDescriptionComplete}
              />
            </p>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="cta-buttons">
              <Button variant="primary" onClick={() => scrollToSection('projects')}>
                View Projects
              </Button>
              <Button variant="secondary" onClick={() => scrollToSection('contact')}>
                Contact Me
              </Button>
            </div>
            <div className="social-links">
              <a href="https://github.com/DELINSHABU" className="social-link" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-github"></i>
              </a>
              <a href="https://linkedin.com" className="social-link" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="https://twitter.com" className="social-link" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
