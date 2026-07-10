// Single source of truth for breakpoints and device capability checks.

export const BREAKPOINT_MOBILE = 768;
export const BREAKPOINT_HERO_GEOMETRY = 900;
export const BREAKPOINT_TERMINAL_FULLSCREEN = 760;

// Phones / touch devices: skip the WebGL shader and the per-frame parallax so
// scrolling stays on the native, GPU-accelerated path.
export const MOBILE_QUERY = '(max-width: 767px), (pointer: coarse)';

export function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

// True on phones / touch devices, where animated blur filters and JS-driven
// smooth scroll cost more than they're worth. Evaluated lazily and cached;
// test-safe when matchMedia is absent (jsdom).
export function prefersLightFx(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  try {
    return window.matchMedia(MOBILE_QUERY).matches;
  } catch {
    return false;
  }
}

let lowEnd: boolean | null = null;

// Weak hardware gets the same visuals at a lower internal shader
// resolution/frame rate; capable machines render exactly as before.
export function isLowEndDevice(): boolean {
  if (lowEnd === null) {
    const cores = navigator.hardwareConcurrency ?? 8;
    const memory =
      (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    lowEnd = cores <= 4 || memory <= 4;
  }
  return lowEnd;
}
