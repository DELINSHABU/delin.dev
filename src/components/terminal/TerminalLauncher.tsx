import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useMagnetic } from '../../hooks/useMagnetic';

interface TerminalLauncherProps {
  onOpen: () => void;
}

const HINT_KEY = 'delin.terminal.seen';

/** Floating bottom-right button that opens the portfolio terminal. */
const TerminalLauncher: React.FC<TerminalLauncherProps> = ({ onOpen }) => {
  const magnetic = useMagnetic(8);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(HINT_KEY)) setShowHint(true);
    } catch {
      /* ignore */
    }
  }, []);

  const handleOpen = () => {
    try {
      localStorage.setItem(HINT_KEY, '1');
    } catch {
      /* ignore */
    }
    setShowHint(false);
    onOpen();
  };

  return (
    <div className="term-launcher">
      {showHint && (
        <motion.button
          type="button"
          className="term-launcher__hint"
          onClick={handleOpen}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          aria-hidden="true"
        >
          press <kbd>`</kbd> or click to open a terminal
        </motion.button>
      )}
      <motion.button
        type="button"
        ref={magnetic.ref as React.RefObject<HTMLButtonElement>}
        className="term-launcher__btn"
        onClick={handleOpen}
        style={magnetic.style}
        onPointerMove={magnetic.onPointerMove}
        onPointerLeave={magnetic.onPointerLeave}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        aria-label="Open interactive terminal"
        title="Open terminal (press `)"
      >
        <span className="term-launcher__glyph">&gt;_</span>
      </motion.button>
    </div>
  );
};

export default TerminalLauncher;
