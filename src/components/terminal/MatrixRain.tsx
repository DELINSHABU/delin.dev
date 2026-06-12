import React, { useEffect, useRef } from 'react';

interface MatrixRainProps {
  /** Called when the user presses Esc / any key / clicks to dismiss. */
  onExit: () => void;
}

const GLYPHS =
  'アァカサタナハマヤャラワガザダバパ0123456789ABCDEFｱｲｳｴｵｶｷｸｹｺ<>=*+-/';

/**
 * Full-screen "digital rain" canvas overlay used by the `matrix` command.
 * Mounts only while active and tears down its animation frame on exit.
 */
const MatrixRain: React.FC<MatrixRainProps> = ({ onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let columns = 0;
    let drops: number[] = [];
    const fontSize = 16;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = new Array(columns).fill(1);
    };
    resize();

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 11, 14, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#5eff9e';
      ctx.font = `${fontSize}px "JetBrains Mono", ui-monospace, monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillText(char, x, y);
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      raf = window.requestAnimationFrame(draw);
    };
    draw();

    window.addEventListener('resize', resize);
    const dismiss = () => onExit();
    window.addEventListener('keydown', dismiss);
    window.addEventListener('pointerdown', dismiss);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', dismiss);
      window.removeEventListener('pointerdown', dismiss);
    };
  }, [onExit]);

  return (
    <div className="term-matrix" role="presentation">
      <canvas ref={canvasRef} className="term-matrix__canvas" />
      <p className="term-matrix__hint">press any key to wake up…</p>
    </div>
  );
};

export default MatrixRain;
