import { useRef, useCallback } from 'react';
import { useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

const springConfig = { stiffness: 200, damping: 18, mass: 0.4 };

/**
 * Magnetic hover: the element drifts toward the cursor by up to `range` px
 * while hovered, springing back on leave. No-op on touch / reduced motion.
 */
export function useMagnetic(range: number = 6) {
  const ref = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion() ?? false;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, springConfig);
  const y = useSpring(rawY, springConfig);

  const enabled = useCallback(
    () =>
      !reducedMotion &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches,
    [reducedMotion]
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!enabled() || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const relX = (event.clientX - rect.left) / rect.width - 0.5;
      const relY = (event.clientY - rect.top) / rect.height - 0.5;
      rawX.set(relX * 2 * range);
      rawY.set(relY * 2 * range);
    },
    [enabled, range, rawX, rawY]
  );

  const onPointerLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return { ref, style: { x, y }, onPointerMove, onPointerLeave };
}
