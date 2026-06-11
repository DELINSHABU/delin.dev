import React, { useState } from 'react';
import { motion } from 'framer-motion';
import HeroTitle from '../components/hero/HeroTitle';
import TypewriterText from '../components/TypewriterText';
import { useScrollToSection } from '../lib/SmoothScrollProvider';
import { useMagnetic } from '../hooks/useMagnetic';
import '../styles/Home.css';

const SOCIAL_LINKS = [
  { href: 'https://github.com/DELINSHABU', icon: 'fab fa-github', label: 'GitHub' },
  { href: 'https://linkedin.com', icon: 'fab fa-linkedin', label: 'LinkedIn' },
  { href: 'https://twitter.com', icon: 'fab fa-twitter', label: 'Twitter' },
];

const MagneticButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
}> = ({ children, className = '', onClick }) => {
  const magnetic = useMagnetic(6);
  return (
    <motion.button
      ref={magnetic.ref as React.RefObject<HTMLButtonElement>}
      className={className}
      onClick={onClick}
      style={magnetic.style}
      onPointerMove={magnetic.onPointerMove}
      onPointerLeave={magnetic.onPointerLeave}
    >
      {children}
    </motion.button>
  );
};

const Home: React.FC = () => {
  const scrollToSection = useScrollToSection();
  const [roleDone, setRoleDone] = useState(false);

  return (
    <div className="home">
      <div className="hero-content">
        <motion.p
          className="prompt-line hero-prompt"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="prompt-symbol">delin@dev:~$</span> whoami
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <HeroTitle text="DELIN SHABU" />
        </motion.div>

        <motion.p
          className="prompt-line hero-prompt"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <span className="prompt-symbol">delin@dev:~$</span> cat role.txt
        </motion.p>

        <p className="hero-description">
          <span className="hero-description__caret">&gt;</span>{' '}
          <TypewriterText
            text="Front-end developer building fast, expressive interfaces with React, TypeScript and a sprinkle of AI magic."
            speed={22}
            startDelay={1300}
            onComplete={() => setRoleDone(true)}
          />
        </p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: roleDone ? 1 : 0, y: roleDone ? 0 : 16 }}
          transition={{ duration: 0.5 }}
        >
          <div className="cta-buttons">
            <MagneticButton
              className="terminal-button terminal-button--primary"
              onClick={() => scrollToSection('projects')}
            >
              [ ./view-projects ]
            </MagneticButton>
            <MagneticButton
              className="terminal-button"
              onClick={() => scrollToSection('contact')}
            >
              [ ./contact ]
            </MagneticButton>
          </div>

          <div className="social-links">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
              >
                <i className={link.icon} aria-hidden="true"></i>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
