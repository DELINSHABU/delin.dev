import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxBackgroundProps {
  children: React.ReactNode;
  offset?: number;
}

const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({ 
  children, 
  offset = 50 
}) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, offset]);

  return (
    <motion.div
      style={{ y }}
      className="parallax-background"
    >
      {children}
    </motion.div>
  );
};

export default ParallaxBackground;