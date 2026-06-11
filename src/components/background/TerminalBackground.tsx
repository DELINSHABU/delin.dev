import React, { useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import AtmosphereShader from './AtmosphereShader';
import './background.css';

const springConfig = { stiffness: 50, damping: 20 };

const TerminalBackground: React.FC = () => {
  const reducedMotion = useReducedMotion() ?? false;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const gridX = useTransform(springX, (v) => v * 8);
  const gridY = useTransform(springY, (v) => v * 8);
  const glowX = useTransform(springX, (v) => v * 4);
  const glowY = useTransform(springY, (v) => v * 4);

  useEffect(() => {
    if (reducedMotion) return;
    if (window.matchMedia('(hover: none)').matches) return;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set((event.clientX / window.innerWidth - 0.5) * 2);
      mouseY.set((event.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [reducedMotion, mouseX, mouseY]);

  return (
    <div className="terminal-bg" aria-hidden="true">
      <AtmosphereShader reducedMotion={reducedMotion} />
      <motion.div
        className="terminal-bg__layer terminal-bg__glow"
        style={{ x: glowX, y: glowY }}
      />
      <motion.div
        className="terminal-bg__grid-wrap"
        style={{ x: gridX, y: gridY }}
      >
        <div className="terminal-bg__grid" />
      </motion.div>
      <div className="terminal-bg__layer terminal-bg__scanlines" />
      <div className="terminal-bg__layer terminal-bg__grain" />
    </div>
  );
};

export default TerminalBackground;
