import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { startDoom, DoomHandle, DOOM_W, DOOM_H } from './doomEngine';

// DOOM runs fully offline: the engine is a self-hosted WebAssembly binary at
// /doom/doom.wasm (see doomEngine.ts) — no third-party CDN.
const DEFAULT_W = 720;
const DEFAULT_H = 480;
const MIN_W = 420;
const MIN_H = 320;
const MOBILE_BREAKPOINT = 760;

type Status = 'loading' | 'running' | 'error';

const DoomWindow: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [fullscreen, setFullscreen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ w: DEFAULT_W, h: DEFAULT_H });
  const [status, setStatus] = useState<Status>('loading');
  const screenRef = useRef<HTMLCanvasElement>(null);

  // Center-ish on first mount; fullscreen on small screens.
  useEffect(() => {
    setPos({
      x: Math.max(16, Math.round((window.innerWidth - DEFAULT_W) / 2) - 40),
      y: Math.max(16, Math.round((window.innerHeight - DEFAULT_H) / 2) - 24),
    });
    if (window.innerWidth < MOBILE_BREAKPOINT) setFullscreen(true);
  }, []);

  // Boot the engine: hand the self-hosted DOOM wasm our canvas, then keep the
  // handle so we can fully stop it (game loop + input) when the window closes.
  useEffect(() => {
    const canvas = screenRef.current;
    if (!canvas) return;
    let cancelled = false;
    let handle: DoomHandle | null = null;
    startDoom(canvas, () => {
      if (!cancelled) setStatus('error');
    })
      .then((h) => {
        // If we were unmounted while loading, tear the fresh instance down.
        if (cancelled) {
          h.stop();
          return;
        }
        handle = h;
        setStatus('running');
        // Focus so keyboard input reaches the game immediately; preventScroll
        // keeps Lenis from jumping the page to the canvas.
        canvas.focus({ preventScroll: true });
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
      handle?.stop();
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
    setInteracting(false);
    window.removeEventListener('pointermove', onDragMove);
    window.removeEventListener('pointerup', onDragUp);
  }, [onDragMove]);
  const onTitlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    // A collapsed bar acts as a restore button, not a drag handle.
    if (minimized) {
      setMinimized(false);
      return;
    }
    if (fullscreen) return;
    dragRef.current = { sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y };
    setInteracting(true);
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
    setInteracting(false);
    window.removeEventListener('pointermove', onResizeMove);
    window.removeEventListener('pointerup', onResizeUp);
  }, [onResizeMove]);
  const onResizePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    resizeRef.current = { sx: e.clientX, sy: e.clientY, ow: size.w, oh: size.h };
    setInteracting(true);
    window.addEventListener('pointermove', onResizeMove);
    window.addEventListener('pointerup', onResizeUp);
  };

  const windowStyle: React.CSSProperties = fullscreen
    ? {}
    : {
        left: pos.x,
        top: pos.y,
        width: size.w,
        ...(minimized ? {} : { height: size.h }),
      };

  return (
    <motion.div
      className={`terminal-window term-window doom-window${
        fullscreen ? ' term-window--fullscreen' : ''
      }${minimized ? ' doom-window--minimized' : ''}${
        interacting ? ' doom-window--busy' : ''
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
          aria-label={minimized ? 'Restore doom' : 'Minimize doom'}
          onClick={() => setMinimized((m) => !m)}
        />
        <button
          type="button"
          className="dot dot--green"
          aria-label="Toggle fullscreen"
          onClick={() => {
            setMinimized(false);
            setFullscreen((f) => !f);
          }}
        />
        <span className="terminal-window__title term-bar__title">doom.exe</span>
      </div>

      <div className="doom-window__body">
        <canvas
          ref={screenRef}
          className="doom-window__screen"
          width={DOOM_W}
          height={DOOM_H}
          tabIndex={0}
          aria-label="DOOM game screen"
        />

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

      {!fullscreen && !minimized && (
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
