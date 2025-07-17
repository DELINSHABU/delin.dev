import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  showCursor?: boolean;
  cursorChar?: string;
  startDelay?: number;
  onComplete?: () => void;
  trigger?: boolean;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 100,
  className = '',
  showCursor = true,
  cursorChar = '|',
  startDelay = 0,
  onComplete,
  trigger = true
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showCursorBlink, setShowCursorBlink] = useState(true);

  useEffect(() => {
    if (trigger && currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, currentIndex === 0 ? startDelay : speed);

      return () => clearTimeout(timer);
    } else if (trigger && !isComplete && currentIndex >= text.length) {
      setIsComplete(true);
      if (onComplete) {
        onComplete();
      }
    }
  }, [currentIndex, text, speed, startDelay, isComplete, onComplete, trigger]);

  useEffect(() => {
    if (showCursor) {
      const cursorInterval = setInterval(() => {
        setShowCursorBlink(prev => !prev);
      }, 500);

      return () => clearInterval(cursorInterval);
    }
  }, [showCursor]);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {displayText}
      {showCursor && (
        <span 
          className="typewriter-cursor" 
          style={{ 
            opacity: showCursorBlink ? 1 : 0,
            color: '#4a90e2',
            fontWeight: 'normal',
            animation: 'none'
          }}
        >
          {cursorChar}
        </span>
      )}
    </motion.span>
  );
};

export default TypewriterText;
