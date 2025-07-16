import React from 'react';
import { Button } from '../components/Button';
import { useTheme } from '../context/ThemeContext';
import '../styles/Home.css';

const Home: React.FC = () => {
  const { theme } = useTheme();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`home ${theme}`}>
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Hi, I'm Delin</h1>
          <p className="hero-description">
            Embarking on a coding odyssey with React.js, MongoDB and a sprinkle of motion graphics. 
            Unemployed by companies, employed by laughter.
          </p>
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
        </div>
      </section>
    </div>
  );
};

export default Home;
