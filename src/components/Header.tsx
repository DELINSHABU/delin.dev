import React from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/Header.css';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`header ${theme}`}>
      <nav>
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
        </button>
        <ul className="nav-links">
          <li><a onClick={() => scrollToSection('home')} href="#home">Home</a></li>
          <li><a onClick={() => scrollToSection('about')} href="#about">About</a></li>
          <li><a onClick={() => scrollToSection('projects')} href="#projects">Projects</a></li>
          <li><a onClick={() => scrollToSection('contact')} href="#contact">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
