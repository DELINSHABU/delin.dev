import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const JSDOS_JS = 'https://v8.js-dos.com/latest/js-dos.js';
const JSDOS_CSS = 'https://v8.js-dos.com/latest/js-dos.css';
// Self-hosted (public/doom/) — cdn.dos.zone doesn't send CORS headers, so the
// bundle must be served same-origin.
const DOOM_BUNDLE = '/doom/doom.jsdos';

const DEFAULT_W = 720;
const DEFAULT_H = 480;
const MIN_W = 420;
const MIN_H = 320;
const MOBILE_BREAKPOINT = 760;

interface DosProps {
  stop: () => Promise<void>;
}

declare global {
  interface Window {
    Dos?: (el: HTMLDivElement, opts: Record<string, unknown>) => DosProps;
  }
}

// Shared loader so the js-dos runtime is only injected once, no matter how
// many times the window is opened. Reset on failure so a retry can re-inject.
let jsDosLoader: Promise<void> | null = null;
function loadJsDos(): Promise<void> {
  if (window.Dos) return Promise.resolve();
  if (!jsDosLoader) {
    jsDosLoader = new Promise<void>((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = JSDOS_CSS;
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = JSDOS_JS;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        jsDosLoader = null;
        script.remove();
        link.remove();
        reject(new Error('failed to load js-dos runtime'));
      };
      document.head.appendChild(script);
    });
  }
  return jsDosLoader;
}

type Status = 'loading' | 'running' | 'error';

const DoomWindow: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [fullscreen, setFullscreen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ w: DEFAULT_W, h: DEFAULT_H });
  const [status, setStatus] = useState<Status>('loading');
  const screenRef = useRef<HTMLDivElement>(null);

  // Center-ish on first mount; fullscreen on small screens.
  useEffect(() => {
    setPos({
      x: Math.max(16, Math.round((window.innerWidth - DEFAULT_W) / 2) - 40),
      y: Math.max(16, Math.round((window.innerHeight - DEFAULT_H) / 2) - 24),
    });
    if (window.innerWidth < MOBILE_BREAKPOINT) setFullscreen(true);
  }, []);

  // Boot the engine: load js-dos from CDN, then hand it the screen element.
  useEffect(() => {
    let cancelled = false;
    let dos: DosProps | null = null;
    loadJsDos()
      .then(() => {
        if (cancelled || !screenRef.current || !window.Dos) return;
        dos = window.Dos(screenRef.current, {
          url: DOOM_BUNDLE,
          autoStart: true,
          kiosk: true,
        });
        setStatus('running');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
      dos?.stop();
    };
  }, []);

  // --- dragging (title bar) ---
  const dragRef = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(
    null
  );
  const onDragMove = useCallback((e: PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const x = Math.min(
      Math.max(0, d.ox + (e.clientX - d.sx)),
      window.innerWidth - 200
    );
    const y = Math.min(
      Math.max(0, d.oy + (e.clientY - d.sy)),
      window.innerHeight - 80
    );
    setPos({ x, y });
  }, []);
  const onDragUp = useCallback(() => {
    dragRef.current = null;
    window.removeEventListener('pointermove', onDragMove);
    window.removeEventListener('pointerup', onDragUp);
  }, [onDragMove]);
  const onTitlePointerDown = (e: React.PointerEvent) => {
    if (fullscreen) return;
    if ((e.target as HTMLElement).closest('button')) return;
    dragRef.current = { sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y };
    window.addEventListener('pointermove', onDragMove);
    window.addEventListener('pointerup', onDragUp);
  };

  // --- resizing (bottom-right handle) ---
  const resizeRef = useRef<{ sx: number; sy: number; ow: number; oh: number } | null>(
    null
  );
  const onResizeMove = useCallback((e: PointerEvent) => {
    const r = resizeRef.current;
    if (!r) return;
    setSize({
      w: Math.max(MIN_W, r.ow + (e.clientX - r.sx)),
      h: Math.max(MIN_H, r.oh + (e.clientY - r.sy)),
    });
  }, []);
  const onResizeUp = useCallback(() => {
    resizeRef.current = null;
    window.removeEventListener('pointermove', onResizeMove);
    window.removeEventListener('pointerup', onResizeUp);
  }, [onResizeMove]);
  const onResizePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    resizeRef.current = { sx: e.clientX, sy: e.clientY, ow: size.w, oh: size.h };
    window.addEventListener('pointermove', onResizeMove);
    window.addEventListener('pointerup', onResizeUp);
  };

  const windowStyle: React.CSSProperties = fullscreen
    ? {}
    : { left: pos.x, top: pos.y, width: size.w, height: size.h };

  return (
    <motion.div
      className={`terminal-window term-window doom-window${
        fullscreen ? ' term-window--fullscreen' : ''
      }`}
      style={windowStyle}
      data-lenis-prevent
      role="dialog"
      aria-label="DOOM"
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="terminal-window__bar term-bar"
        onPointerDown={onTitlePointerDown}
      >
        <button
          type="button"
          className="dot dot--red"
          aria-label="Close doom"
          onClick={onClose}
        />
        <button
          type="button"
          className="dot dot--yellow"
          aria-label="Close doom"
          onClick={onClose}
        />
        <button
          type="button"
          className="dot dot--green"
          aria-label="Toggle fullscreen"
          onClick={() => setFullscreen((f) => !f)}
        />
        <span className="terminal-window__title term-bar__title">doom.exe</span>
      </div>

      <div className="doom-window__body">
        {/* js-dos owns this element's DOM — keep it free of React children */}
        <div ref={screenRef} className="doom-window__screen" />

        {status !== 'running' && (
          <div className="doom-window__status">
            {status === 'loading' ? (
              <p className="term-muted">loading doom.exe …</p>
            ) : (
              <p className="term-error">
                failed to load doom — check your connection and run{' '}
                <span className="term-accent">play doom</span> again.
              </p>
            )}
          </div>
        )}
      </div>

      {!fullscreen && (
        <span
          className="term-resize"
          onPointerDown={onResizePointerDown}
          aria-hidden="true"
        />
      )}
    </motion.div>
  );
};

export default DoomWindow;
