import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import '../styles/CustomCursor.css';

const CustomCursor: React.FC = () => {
  const reducedMotion = useReducedMotion() ?? false;
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, { stiffness: 500, damping: 28, mass: 0.3 });
  const ringY = useSpring(dotY, { stiffness: 500, damping: 28, mass: 0.3 });

  useEffect(() => {
    if (reducedMotion) return;

    let prevHovered = false;

    const onMove = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      if (!active) setActive(true);
      const el = e.target as HTMLElement;
      const isHover = !!el.closest('[data-cursor="hover"]');
      if (isHover !== prevHovered) {
        prevHovered = isHover;
        setHovered(isHover);
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [reducedMotion, dotX, dotY, active]);

  if (reducedMotion) return null;

  return (
    <>
      <motion.div
        className="cursor-dot"
        style={{ x: dotX, y: dotY }}
        animate={{ scale: hovered ? 0 : 1, opacity: active ? 1 : 0 }}
        transition={{ duration: 0.15, opacity: { duration: 0.5 } }}
        aria-hidden="true"
      />
      <motion.div
        className="cursor-ring"
        style={{ x: ringX, y: ringY }}
        animate={{ scale: hovered ? 2.2 : 1, opacity: active ? 0.55 : 0 }}
        transition={{ duration: 0.2, opacity: { duration: 0.5 } }}
        aria-hidden="true"
      />
    </>
  );
};

export default CustomCursor;
