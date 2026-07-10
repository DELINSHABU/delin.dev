import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useReducedMotion } from 'framer-motion';
import { pointerClientX, pointerClientY, subscribePointer } from '../lib/pointer';
import '../styles/CustomCursor.css';

const CustomCursor: React.FC = () => {
  const reducedMotion = useReducedMotion() ?? false;
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  const activeRef = useRef(false);

  const ringX = useSpring(pointerClientX, { stiffness: 500, damping: 28, mass: 0.3 });
  const ringY = useSpring(pointerClientY, { stiffness: 500, damping: 28, mass: 0.3 });

  useEffect(() => {
    if (reducedMotion) return;

    const unsubscribe = subscribePointer();

    const onFirstMove = () => {
      if (!activeRef.current) {
        activeRef.current = true;
        setActive(true);
      }
      window.removeEventListener('mousemove', onFirstMove);
    };

    // pointerover fires only when the element under the cursor changes, so the
    // closest() walk runs per hover transition instead of per mousemove
    const onOver = (e: PointerEvent) => {
      const el = e.target as HTMLElement | null;
      setHovered(!!el?.closest?.('[data-cursor="hover"]'));
    };

    window.addEventListener('mousemove', onFirstMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    return () => {
      unsubscribe();
      window.removeEventListener('mousemove', onFirstMove);
      window.removeEventListener('pointerover', onOver);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <>
      <motion.div
        className="cursor-dot"
        style={{ x: pointerClientX, y: pointerClientY }}
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
