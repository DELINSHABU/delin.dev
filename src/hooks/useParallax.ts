import { useRef } from 'react';
import { useReducedMotion, useScroll, useTransform } from 'framer-motion';

export function useParallax(speed: number = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const distance = speed * 100;
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? ['0px', '0px'] : [`${-distance}px`, `${distance}px`]
  );
  return { ref, y };
}
