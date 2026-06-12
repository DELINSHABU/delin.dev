import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLenis } from '../../lib/SmoothScrollProvider';
import { identity } from '../../data/profile';
import { useTerminal } from './useTerminal';
import { TerminalBusyContext } from './commands';
import TerminalLauncher from './TerminalLauncher';
import MatrixRain from './MatrixRain';
import DoomWindow from './DoomWindow';
import '../../styles/Terminal.css';

const DEFAULT_W = 860;
const DEFAULT_H = 380;
const MIN_W = 420;
const MIN_H = 220;
const MOBILE_BREAKPOINT = 760;

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

const Terminal: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lenis = useLenis();

  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ w: DEFAULT_W, h: DEFAULT_H });
  const initialized = useRef(false);

  // Smooth-scroll to a section, hopping back to the main page first if needed.
  const scrollToSection = useCallback(
    (id: string) => {
      const go = () => {
        if (lenis) {
          lenis.scrollTo(`#${id}`, {
            duration: 1.1,
            easing: (t: number) => 1 - Math.pow(1 - t, 4),
          });
        } else {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }
      };
      if (location.pathname !== '/') {
        navigate('/');
        window.setTimeout(go, 350);
      } else {
        go();
      }
    },
    [lenis, location.pathname, navigate]
  );

  const term = useTerminal({
    navigate: (to) => navigate(to),
    scrollToSection,
    close: () => setOpen(false),
  });
  const {
    boot,
    focusInput,
    matrixOn,
    exitMatrix,
    doomOn,
    exitDoom,
    printSecret,
    busy,
    busyApi,
  } = term;

  // Position the window bottom-right on first mount.
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    setPos({
      x: Math.max(16, window.innerWidth - DEFAULT_W - 32),
      y: Math.max(16, window.innerHeight - DEFAULT_H - 48),
    });
  }, []);

  // On open: boot the shell, focus input, and go fullscreen on small screens.
  useEffect(() => {
    if (!open) return;
    boot();
    if (window.innerWidth < MOBILE_BREAKPOINT) setFullscreen(true);
    const t = window.setTimeout(() => focusInput(), 60);
    return () => window.clearTimeout(t);
  }, [open, boot, focusInput]);

  // when a running command finishes, the prompt returns — refocus the input
  // (unless doom is running — it needs the keyboard)
  useEffect(() => {
    if (!open || busy || doomOn) return;
    const t = window.setTimeout(() => focusInput(), 0);
    return () => window.clearTimeout(t);
  }, [open, busy, doomOn, focusInput]);

  // Global hotkeys: Ctrl/Cmd+` toggles, Esc closes (or exits matrix first).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === 'Escape' && open) {
        if (doomOn) return; // Esc is doom's menu key — close via the red dot
        if (matrixOn) exitMatrix();
        else setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, matrixOn, exitMatrix, doomOn]);

  // Konami code → secret unlock (only while the terminal is open).
  const konamiRef = useRef<string[]>([]);
  useEffect(() => {
    if (!open || doomOn) return; // arrows/b/a are game controls while doom runs
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const seq = [...konamiRef.current, key].slice(-KONAMI.length);
      konamiRef.current = seq;
      if (seq.join(',') === KONAMI.join(',')) {
        konamiRef.current = [];
        printSecret();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, doomOn, printSecret]);

  // Pause Lenis smooth-scroll while fullscreen so the page doesn't drift.
  useEffect(() => {
    if (!lenis) return;
    if (open && fullscreen) lenis.stop();
    else lenis.start();
  }, [lenis, open, fullscreen]);

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

  const title = `${identity.handle}@${identity.host} — bash`;
  const windowStyle: React.CSSProperties = fullscreen
    ? {}
    : { left: pos.x, top: pos.y, width: size.w, height: size.h };

  return (
    <>
      {!open && <TerminalLauncher onOpen={() => setOpen(true)} />}

      <AnimatePresence>
        {open && (
          <motion.div
            key="terminal-window"
            className={`terminal-window term-window${
              fullscreen ? ' term-window--fullscreen' : ''
            }`}
            style={windowStyle}
            data-lenis-prevent
            role="dialog"
            aria-label="Interactive portfolio terminal"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="terminal-window__bar term-bar"
              onPointerDown={onTitlePointerDown}
            >
              <button
                type="button"
                className="dot dot--red"
                aria-label="Close terminal"
                onClick={() => setOpen(false)}
              />
              <button
                type="button"
                className="dot dot--yellow"
                aria-label="Minimize terminal"
                onClick={() => setOpen(false)}
              />
              <button
                type="button"
                className="dot dot--green"
                aria-label="Toggle fullscreen"
                onClick={() => setFullscreen((f) => !f)}
              />
              <span className="terminal-window__title term-bar__title">{title}</span>
            </div>

            <div
              className="term-body"
              ref={term.scrollRef}
              data-lenis-prevent
              onScroll={term.onBodyScroll}
              onClick={() => focusInput()}
            >
              <div className="term-content" ref={term.setContentRef}>
                <TerminalBusyContext.Provider value={busyApi}>
                  {term.lines.map((line) => (
                    <div key={line.id} className="term-line">
                      {line.node}
                    </div>
                  ))}
                </TerminalBusyContext.Provider>

                {/* hide the prompt while a command is still running (real-shell feel) */}
                {!busy && (
                  <div className="term-inputrow">
                    <span className="term-prompt">{term.prompt}</span>
                    <input
                      ref={term.inputRef}
                      className="term-input"
                      value={term.input}
                      onChange={(e) => term.setInput(e.target.value)}
                      onKeyDown={term.onInputKeyDown}
                      spellCheck={false}
                      autoComplete="off"
                      autoCapitalize="off"
                      autoCorrect="off"
                      aria-label="Terminal command input"
                    />
                  </div>
                )}
              </div>
            </div>

            {!fullscreen && (
              <span
                className="term-resize"
                onPointerDown={onResizePointerDown}
                aria-hidden="true"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {matrixOn && <MatrixRain onExit={exitMatrix} />}
      {doomOn && <DoomWindow onClose={exitDoom} />}
    </>
  );
};

export default Terminal;
