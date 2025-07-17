import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import TypewriterText from '../components/TypewriterText';
import '../styles/ProjectGrid.css';
import ProjectGrid from '../components/ProjectGrid';

const Projects: React.FC = () => {
  const { theme } = useTheme();
  const [startProjectsTyping, setStartProjectsTyping] = useState(false);
  
  return (
    <div className={`page ${theme}`}>
      <motion.h1 
        className="section-title"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={{
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1, 
            transition: { 
              duration: 0.5,
              onComplete: () => setStartProjectsTyping(true)
            } 
          }
        }}
      >
        <TypewriterText 
          text="Projects" 
          speed={150}
          startDelay={300}
          cursorChar="_"
          showCursor={true}
          trigger={startProjectsTyping}
        />
      </motion.h1>
      <ProjectGrid />
    </div>
  );
};

export default Projects;
