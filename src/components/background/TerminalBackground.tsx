import React, { useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  useScroll,
  useVelocity,
  useAnimationFrame,
  useMotionTemplate,
} from 'framer-motion';
import AtmosphereShader from './AtmosphereShader';
import './background.css';

const springConfig = { stiffness: 50, damping: 20 };

const TerminalBackground: React.FC = () => {
  const reducedMotion = useReducedMotion() ?? false;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const { scrollY, scrollYProgress } = useScroll();

  // clamped + NaN-proof for short pages (/project/:slug, /admin)
  const progress = useTransform(scrollYProgress, (v) =>
    Number.isFinite(v) ? Math.min(Math.max(v, 0), 1) : 0
  );

  // scroll velocity, normalized to 0..1 and spring-smoothed
  const rawVelocity = useVelocity(scrollY);
  const velNorm = useTransform(rawVelocity, (v) => Math.min(Math.abs(v) / 2500, 1));
  const smoothVel = useSpring(velNorm, { stiffness: 100, damping: 30 });

  const gridX = useTransform(springX, (v) => v * 8);
  const glowX = useTransform(springX, (v) => v * 4);

  // mouse parallax + scroll parallax summed; near layers move more than far ones
  const glowScrollY = useTransform(progress, [0, 1], [0, -30]);
  const gridScrollY = useTransform(progress, [0, 1], [0, -70]);
  const glowScale = useTransform(progress, [0, 1], [1, 1.08]);
  const gridScale = useTransform(progress, [0, 1], [1, 1.06]);

  const glowY = useTransform([springY, glowScrollY], (v) => {
    const [m, s] = v as number[];
    return m * 4 + s;
  });
  const gridY = useTransform([springY, gridScrollY], (v) => {
    const [m, s] = v as number[];
    return m * 8 + s;
  });

  // grid flow owned in JS: idle drift + scroll travel + velocity surge
  const flow = useMotionValue(0);
  useAnimationFrame((_, delta) => {
    if (reducedMotion) return;
    // idle 4px/s (the old 56px/14s keyframe), up to +24px/s under fast scroll
    const speed = 4 + smoothVel.get() * 24;
    flow.set(flow.get() + (speed * delta) / 1000);
  });
  const gridFlowY = useTransform([flow, scrollY], (v) => {
    const [f, s] = v as number[];
    return (f + s * 0.3) % 56;
  });
  const gridBgPos = useMotionTemplate`0px ${gridFlowY}px`;

  const grainOpacity = useTransform(smoothVel, [0, 1], [0.04, 0.08]);

  useEffect(() => {
    if (reducedMotion) return;
    if (window.matchMedia('(hover: none)').matches) return;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set((event.clientX / window.innerWidth - 0.5) * 2);
      mouseY.set((event.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [reducedMotion, mouseX, mouseY]);

  return (
    <div className="terminal-bg" aria-hidden="true">
      <AtmosphereShader
        reducedMotion={reducedMotion}
        scrollProgress={progress}
        scrollVelocity={smoothVel}
      />
      <motion.div
        className="terminal-bg__layer terminal-bg__glow"
        style={reducedMotion ? undefined : { x: glowX, y: glowY, scale: glowScale }}
      />
      <motion.div
        className="terminal-bg__grid-wrap"
        style={reducedMotion ? undefined : { x: gridX, y: gridY, scale: gridScale }}
      >
        <motion.div
          className="terminal-bg__grid"
          style={reducedMotion ? undefined : { backgroundPosition: gridBgPos }}
        />
      </motion.div>
      <div className="terminal-bg__layer terminal-bg__scanlines" />
      <motion.div
        className="terminal-bg__layer terminal-bg__grain"
        style={reducedMotion ? undefined : { opacity: grainOpacity }}
      />
    </div>
  );
};

export default TerminalBackground;
