import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface WordByWordTextProps {
  text: string;
  speed?: number;
  className?: string;
  startDelay?: number;
  onComplete?: () => void;
}

const WordByWordText: React.FC<WordByWordTextProps> = ({
  text,
  speed = 300,
  className = '',
  startDelay = 0,
  onComplete
}) => {
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const words = text.split(' ');

  useEffect(() => {
    if (currentIndex < words.length) {
      const timer = setTimeout(() => {
        setDisplayedWords(prev => [...prev, words[currentIndex]]);
        setCurrentIndex(currentIndex + 1);
      }, currentIndex === 0 ? startDelay : speed);

      return () => clearTimeout(timer);
    } else if (!isComplete) {
      setIsComplete(true);
      if (onComplete) {
        onComplete();
      }
    }
  }, [currentIndex, words, speed, startDelay, isComplete, onComplete]);

  return (
    <span className={className}>
      {displayedWords.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          style={{ display: 'inline-block', marginRight: '0.25em' }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

export default WordByWordText;
