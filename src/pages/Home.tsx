import React, { useState, Suspense, lazy } from 'react';
import { motion, useScroll } from 'framer-motion';
import TypewriterText from '../components/TypewriterText';
import { useScrollToSection } from '../lib/SmoothScrollProvider';
import { useMagnetic } from '../hooks/useMagnetic';
import { useParallax } from '../hooks/useParallax';
import { socials as SOCIAL_LINKS, identity } from '../data/profile';
import '../styles/Home.css';

const HeroTitle = lazy(() => import('../components/hero/HeroTitle'));
const HeroGeometry = lazy(() => import('../components/hero/HeroGeometry'));

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
      data-cursor="hover"
    >
      {children}
    </motion.button>
  );
};

const Home: React.FC = () => {
  const scrollToSection = useScrollToSection();
  const [roleDone, setRoleDone] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroParallax = useParallax(0.05);

  return (
    <div className="home">
      <motion.div
        ref={heroParallax.ref}
        style={{ y: heroParallax.y }}
        className="hero-content"
      >
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
            text={identity.role}
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
                data-cursor="hover"
              >
                <i className={link.icon} aria-hidden="true"></i>
              </a>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <Suspense fallback={null}>
        <HeroGeometry scrollYProgress={scrollYProgress} />
      </Suspense>
    </div>
  );
};

export default Home;
