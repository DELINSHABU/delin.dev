import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { staggerContainer, fadeInUp } from '../utils/animations';
import '../styles/Header.css';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const handleToggleTheme = () => {
    toggleTheme();
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header 
      className={`header ${theme}`}
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.nav variants={fadeInUp}>
        <motion.button 
          className="theme-toggle" 
          onClick={handleToggleTheme} 
          aria-label="Toggle theme"
        >
          <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
        </motion.button>
        <motion.ul className="nav-links" variants={staggerContainer}>
          {[
            { id: 'home', label: 'Home' },
            { id: 'about', label: "About"},
            { id: 'projects', label: 'Projects' },
            { id: 'contact', label: 'Contact' }
          ].map((item) => (
            <motion.li key={item.id} variants={fadeInUp}>
              <motion.a 
                onClick={() => scrollToSection(item.id)} 
                href={`#${item.id}`}
              >
                {item.label}
              </motion.a>
            </motion.li>
          ))}
        </motion.ul>
      </motion.nav>
    </motion.header>
  );
};

export default Header;
