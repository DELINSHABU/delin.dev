import React, { useState, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

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
  cursorChar = '▌',
  startDelay = 0,
  onComplete,
  trigger = true,
}) => {
  const reducedMotion = useReducedMotion() ?? false;
  const [currentIndex, setCurrentIndex] = useState(reducedMotion ? text.length : 0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    if (currentIndex < text.length) {
      const timer = setTimeout(
        () => setCurrentIndex((i) => i + 1),
        currentIndex === 0 ? startDelay : speed
      );
      return () => clearTimeout(timer);
    }
    if (!isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentIndex, text, speed, startDelay, isComplete, onComplete, trigger]);

  return (
    <span className={className}>
      {text.substring(0, currentIndex)}
      {showCursor && <span className="typewriter-cursor">{cursorChar}</span>}
    </span>
  );
};

export default TypewriterText;
