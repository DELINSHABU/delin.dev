import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useActiveSection } from '../hooks/useActiveSection';
import { useScrollToSection } from '../lib/SmoothScrollProvider';
import { staggerContainer, fadeInUp } from '../utils/animations';
import '../styles/Header.css';

const NAV_ITEMS = [
  { id: 'home', index: '01', label: 'home' },
  { id: 'about', index: '02', label: 'about' },
  { id: 'projects', index: '03', label: 'projects' },
  { id: 'contact', index: '04', label: 'contact' },
];

const Header: React.FC = () => {
  const activeSection = useActiveSection();
  const scrollToSection = useScrollToSection();
  const navigate = useNavigate();

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    event.preventDefault();
    (document.activeElement as HTMLElement | null)?.blur();
    scrollToSection(id);
  };

  return (
    <motion.header
      className="header"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.nav variants={fadeInUp}>
        <motion.button
          className="admin-toggle"
          onClick={() => navigate('/admin')}
          aria-label="Admin Panel"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <i className="fas fa-cog" aria-hidden="true"></i>
        </motion.button>

        <motion.ul className="nav-links" variants={staggerContainer}>
          {NAV_ITEMS.map((item) => (
            <motion.li key={item.id} variants={fadeInUp}>
              <a
                onClick={(e) => handleNavClick(e, item.id)}
                href={`#${item.id}`}
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
              >
                <span className="nav-link__index">{item.index}</span>
                <span className="nav-link__label">{item.label}</span>
              </a>
            </motion.li>
          ))}
        </motion.ul>
      </motion.nav>
    </motion.header>
  );
};

export default Header;
