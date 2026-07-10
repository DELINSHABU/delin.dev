import { useCallback, useEffect, useRef, useState } from 'react';

interface DragState {
  sx: number;
  sy: number;
  ox: number;
  oy: number;
  lx: number;
  ly: number;
}

interface ResizeState {
  sx: number;
  sy: number;
  ow: number;
  oh: number;
  lw: number;
  lh: number;
}

interface UseWindowDragOptions {
  windowRef: React.RefObject<HTMLElement | null>;
  minW: number;
  minH: number;
  defaultW: number;
  defaultH: number;
  onInteractStart?: () => void;
  onInteractEnd?: () => void;
}

/**
 * Drag/resize for floating windows (terminal, doom). Pointer moves write
 * left/top/width/height straight to the element so nothing re-renders per
 * frame; the final rect is committed to React state on pointerup so the
 * rendered style stays in sync (fullscreen toggles, remounts).
 */
export function useWindowDrag({
  windowRef,
  minW,
  minH,
  defaultW,
  defaultH,
  onInteractStart,
  onInteractEnd,
}: UseWindowDragOptions) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ w: defaultW, h: defaultH });

  const posRef = useRef(pos);
  posRef.current = pos;
  const sizeRef = useRef(size);
  sizeRef.current = size;

  const startRef = useRef(onInteractStart);
  startRef.current = onInteractStart;
  const endRef = useRef(onInteractEnd);
  endRef.current = onInteractEnd;

  const dragRef = useRef<DragState | null>(null);
  const resizeRef = useRef<ResizeState | null>(null);

  const onDragMove = useCallback(
    (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      d.lx = Math.min(
        Math.max(0, d.ox + (e.clientX - d.sx)),
        window.innerWidth - 200
      );
      d.ly = Math.min(
        Math.max(0, d.oy + (e.clientY - d.sy)),
        window.innerHeight - 80
      );
      const el = windowRef.current;
      if (el) {
        el.style.left = `${d.lx}px`;
        el.style.top = `${d.ly}px`;
      }
    },
    [windowRef]
  );

  const onDragUp = useCallback(() => {
    const d = dragRef.current;
    if (!d) return;
    dragRef.current = null;
    setPos({ x: d.lx, y: d.ly });
    endRef.current?.();
    window.removeEventListener('pointermove', onDragMove);
    window.removeEventListener('pointerup', onDragUp);
  }, [onDragMove]);

  const startDrag = useCallback(
    (e: React.PointerEvent) => {
      const p = posRef.current;
      dragRef.current = {
        sx: e.clientX,
        sy: e.clientY,
        ox: p.x,
        oy: p.y,
        lx: p.x,
        ly: p.y,
      };
      startRef.current?.();
      window.addEventListener('pointermove', onDragMove);
      window.addEventListener('pointerup', onDragUp);
    },
    [onDragMove, onDragUp]
  );

  const onResizeMove = useCallback(
    (e: PointerEvent) => {
      const r = resizeRef.current;
      if (!r) return;
      r.lw = Math.max(minW, r.ow + (e.clientX - r.sx));
      r.lh = Math.max(minH, r.oh + (e.clientY - r.sy));
      const el = windowRef.current;
      if (el) {
        el.style.width = `${r.lw}px`;
        el.style.height = `${r.lh}px`;
      }
    },
    [minW, minH, windowRef]
  );

  const onResizeUp = useCallback(() => {
    const r = resizeRef.current;
    if (!r) return;
    resizeRef.current = null;
    setSize({ w: r.lw, h: r.lh });
    endRef.current?.();
    window.removeEventListener('pointermove', onResizeMove);
    window.removeEventListener('pointerup', onResizeUp);
  }, [onResizeMove]);

  const startResize = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      const s = sizeRef.current;
      resizeRef.current = {
        sx: e.clientX,
        sy: e.clientY,
        ow: s.w,
        oh: s.h,
        lw: s.w,
        lh: s.h,
      };
      startRef.current?.();
      window.addEventListener('pointermove', onResizeMove);
      window.addEventListener('pointerup', onResizeUp);
    },
    [onResizeMove, onResizeUp]
  );

  useEffect(
    () => () => {
      window.removeEventListener('pointermove', onDragMove);
      window.removeEventListener('pointerup', onDragUp);
      window.removeEventListener('pointermove', onResizeMove);
      window.removeEventListener('pointerup', onResizeUp);
    },
    [onDragMove, onDragUp, onResizeMove, onResizeUp]
  );

  return { pos, setPos, size, setSize, startDrag, startResize };
}
