import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import Lenis from 'lenis';

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

/** easeInOutCubic — gentle acceleration *and* deceleration, so the scroll
 *  never launches at full velocity the way easeOutQuart does. */
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Smooth-scrolls to an element id, falling back to native when lenis is off. */
export const useScrollToSection = () => {
  const lenis = useLenis();
  // stable identity so memoized consumers (nav items) don't re-render
  return useCallback(
    (id: string) => {
      const target = document.getElementById(id);
      if (lenis && target) {
        // Scale the duration with the distance travelled so a short hop and a
        // full-page jump both feel measured. A fixed duration makes long jumps
        // (common on phones, where sections are stacked tall) feel violent.
        const distance = Math.abs(target.getBoundingClientRect().top);
        const duration = Math.min(1.5, Math.max(0.8, distance / 1800));
        lenis.scrollTo(target, { duration, easing: easeInOutCubic });
      } else if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [lenis]
  );
};

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // On touch devices Lenis can't smooth native touch scrolling (syncTouch is
    // off) — it only adds a permanent rAF loop + scroll observer that competes
    // with the compositor and makes phones stutter. Native scroll is smoother.
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const instance = new Lenis({ lerp: 0.1, autoRaf: true, anchors: true });
    setLenis(instance);

    return () => {
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
