import { useEffect } from 'react';
import { motionValue } from 'framer-motion';

// Singleton pointer bus: one passive mousemove listener for the whole app,
// fanned out as MotionValues. Viewport size is cached on resize instead of
// being read on every move.

/** Raw client coordinates; start offscreen like the cursor did. */
export const pointerClientX = motionValue(-100);
export const pointerClientY = motionValue(-100);

/** Normalized 0..1, top-left origin; 0.5/0.5 until the first move. */
export const pointerNormX = motionValue(0.5);
export const pointerNormY = motionValue(0.5);

/** Centered -1..1; 0/0 until the first move. */
export const pointerCenteredX = motionValue(0);
export const pointerCenteredY = motionValue(0);

let vw = typeof window !== 'undefined' ? window.innerWidth : 1;
let vh = typeof window !== 'undefined' ? window.innerHeight : 1;
let subscribers = 0;

const onResize = () => {
  vw = window.innerWidth || 1;
  vh = window.innerHeight || 1;
};

const onMove = (e: MouseEvent) => {
  const nx = e.clientX / vw;
  const ny = e.clientY / vh;
  pointerClientX.set(e.clientX);
  pointerClientY.set(e.clientY);
  pointerNormX.set(nx);
  pointerNormY.set(ny);
  pointerCenteredX.set((nx - 0.5) * 2);
  pointerCenteredY.set((ny - 0.5) * 2);
};

/** Ref-counted subscription; the listener detaches at zero subscribers. */
export function subscribePointer(): () => void {
  if (subscribers === 0) {
    onResize();
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
  }
  subscribers += 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    subscribers -= 1;
    if (subscribers === 0) {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
    }
  };
}

/** Keeps the shared listener attached while the component is mounted. */
export function usePointer(): void {
  useEffect(() => subscribePointer(), []);
}
