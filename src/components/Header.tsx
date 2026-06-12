import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
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

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%';

const ScrambleText: React.FC<{ text: string; play: boolean }> = ({ text, play }) => {
  const [display, setDisplay] = useState(text);
  const frameRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!play) {
      setDisplay(text);
      return;
    }
    frameRef.current = 0;
    const total = 12;
    timerRef.current = setInterval(() => {
      const f = frameRef.current;
      setDisplay(
        text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            if (i < Math.floor((f / total) * text.length)) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );
      frameRef.current += 1;
      if (frameRef.current > total) {
        if (timerRef.current) clearInterval(timerRef.current);
        setDisplay(text);
      }
    }, 40);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [play, text]);

  return <span aria-label={text}>{display}</span>;
};

const NavItemEl: React.FC<{
  item: (typeof NAV_ITEMS)[0];
  active: boolean;
  onClick: () => void;
}> = ({ item, active, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.li key={item.id} variants={fadeInUp}>
      <a
        href={`#${item.id}`}
        className={`nav-link ${active ? 'active' : ''}`}
        onClick={(e) => {
          e.preventDefault();
          (document.activeElement as HTMLElement | null)?.blur();
          onClick();
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        data-cursor="hover"
      >
        <span className="nav-link__index">{item.index}</span>
        <ScrambleText text={item.label} play={hovered} />
      </a>
    </motion.li>
  );
};

const Header: React.FC = () => {
  const activeSection = useActiveSection();
  const scrollToSection = useScrollToSection();

  return (
    <motion.header
      className="header"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.nav variants={fadeInUp}>
        <motion.ul className="nav-links" variants={staggerContainer}>
          {NAV_ITEMS.map((item) => (
            <NavItemEl
              key={item.id}
              item={item}
              active={activeSection === item.id}
              onClick={() => scrollToSection(item.id)}
            />
          ))}
        </motion.ul>
      </motion.nav>
    </motion.header>
  );
};

export default Header;
