import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import WindowBar from '../WindowBar';
import { useWindowDrag } from '../../hooks/useWindowDrag';
import { BREAKPOINT_TERMINAL_FULLSCREEN } from '../../utils/device';
import { startDoom, DoomHandle, DOOM_W, DOOM_H } from './doomEngine';
import { EASE_OUT } from '../../utils/animations';

// DOOM runs fully offline: the engine is a self-hosted WebAssembly binary at
// /doom/doom.wasm (see doomEngine.ts) — no third-party CDN.
const DEFAULT_W = 720;
const DEFAULT_H = 480;
const MIN_W = 420;
const MIN_H = 320;

type Status = 'loading' | 'running' | 'error';

const DoomWindow: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [fullscreen, setFullscreen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [status, setStatus] = useState<Status>('loading');
  const screenRef = useRef<HTMLCanvasElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  const onInteractStart = useCallback(() => setInteracting(true), []);
  const onInteractEnd = useCallback(() => setInteracting(false), []);
  const { pos, setPos, size, startDrag, startResize } = useWindowDrag({
    windowRef,
    minW: MIN_W,
    minH: MIN_H,
    defaultW: DEFAULT_W,
    defaultH: DEFAULT_H,
    onInteractStart,
    onInteractEnd,
  });

  // Center-ish on first mount; fullscreen on small screens.
  useEffect(() => {
    setPos({
      x: Math.max(16, Math.round((window.innerWidth - DEFAULT_W) / 2) - 40),
      y: Math.max(16, Math.round((window.innerHeight - DEFAULT_H) / 2) - 24),
    });
    if (window.innerWidth < BREAKPOINT_TERMINAL_FULLSCREEN) setFullscreen(true);
  }, [setPos]);

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

  const onTitlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    // A collapsed bar acts as a restore button, not a drag handle.
    if (minimized) {
      setMinimized(false);
      return;
    }
    if (fullscreen) return;
    startDrag(e);
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
      ref={windowRef}
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
      transition={{ duration: 0.18, ease: EASE_OUT }}
    >
      <WindowBar
        title="doom.exe"
        onPointerDown={onTitlePointerDown}
        red={{ label: 'Close doom', onClick: onClose }}
        yellow={{
          label: minimized ? 'Restore doom' : 'Minimize doom',
          onClick: () => setMinimized((m) => !m),
        }}
        green={{
          label: 'Toggle fullscreen',
          onClick: () => {
            setMinimized(false);
            setFullscreen((f) => !f);
          },
        }}
      />

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
          onPointerDown={startResize}
          aria-hidden="true"
        />
      )}
    </motion.div>
  );
};

export default DoomWindow;
