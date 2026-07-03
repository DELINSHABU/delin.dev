import { useState, useEffect } from 'react';
import { useLenis } from '../lib/SmoothScrollProvider';

const SECTION_IDS = ['home', 'about', 'projects', 'contact'] as const;

export const useActiveSection = () => {
  const [activeSection, setActiveSection] = useState('home');
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // Cache each section's absolute [top, bottom] range once, then re-measure
    // only on resize/content changes. This keeps the per-frame scroll handler
    // free of getBoundingClientRect() — that per-frame layout read forced a
    // synchronous reflow on every animation frame and was a source of stutter.
    let ranges: { id: string; top: number; bottom: number }[] = [];

    const measure = () => {
      const scrollY = window.scrollY;
      ranges = SECTION_IDS.flatMap((id) => {
        const el = document.getElementById(id);
        if (!el) return [];
        const rect = el.getBoundingClientRect();
        return [{ id, top: rect.top + scrollY, bottom: rect.bottom + scrollY }];
      });
    };

    const update = (scroll: number) => {
      const viewTop = scroll;
      const viewBottom = scroll + window.innerHeight;
      let maxVisible = 0;
      let active = ranges[0]?.id ?? 'home';

      for (const r of ranges) {
        const visible =
          Math.min(viewBottom, r.bottom) - Math.max(viewTop, r.top);
        if (visible > maxVisible) {
          maxVisible = visible;
          active = r.id;
        }
      }

      setActiveSection((prev) => (prev === active ? prev : active));
    };

    const onScroll = () => update(lenis.scroll);

    measure();
    update(lenis.scroll);
    lenis.on('scroll', onScroll);

    // Body height changes (images/fonts loading, viewport resize) invalidate
    // the cached ranges — recompute when they do.
    const ro = new ResizeObserver(() => {
      measure();
      update(lenis.scroll);
    });
    ro.observe(document.body);

    return () => {
      lenis.off('scroll', onScroll);
      ro.disconnect();
    };
  }, [lenis]);

  return activeSection;
};