import React, { useEffect, useState, Suspense, lazy } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  useScroll,
  useVelocity,
  useAnimationFrame,
} from 'framer-motion';
import { pointerCenteredX, pointerCenteredY, subscribePointer } from '../../lib/pointer';
import { MOBILE_QUERY } from '../../utils/device';
import './background.css';

const AtmosphereShader = lazy(() => import('./AtmosphereShader'));

const springConfig = { stiffness: 50, damping: 20 };

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return isMobile;
}

/** The static layer stack — plain divs, no per-frame work. Used on phones and,
 *  minus the WebGL shader, for reduced-motion desktops. */
const StaticLayers: React.FC<{ mobile?: boolean }> = ({ mobile }) => (
  <>
    {mobile && <div className="terminal-bg__layer terminal-bg__fallback" />}
    <div className="terminal-bg__layer terminal-bg__glow" />
    <div className="terminal-bg__grid-wrap">
      <div className="terminal-bg__grid">
        <div className="terminal-bg__grid-pattern" />
      </div>
    </div>
    <div className="terminal-bg__layer terminal-bg__scanlines" />
    <div className="terminal-bg__layer terminal-bg__grain" />
  </>
);

/**
 * The full motion pipeline: WebGL shader + JS-driven parallax. Mounted only on
 * desktop, so phones never create these scroll/velocity/spring subscriptions —
 * on a phone the whole thing collapses to <StaticLayers>, keeping scroll on the
 * native compositor path.
 */
const DesktopBackdrop: React.FC = () => {
  const reducedMotion = useReducedMotion() ?? false;

  const springX = useSpring(pointerCenteredX, springConfig);
  const springY = useSpring(pointerCenteredY, springConfig);

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

  const grainOpacity = useTransform(smoothVel, [0, 1], [0.04, 0.08]);

  useEffect(() => {
    if (reducedMotion) return;
    return subscribePointer();
  }, [reducedMotion]);

  return (
    <>
      <Suspense fallback={null}>
        <AtmosphereShader
          reducedMotion={reducedMotion}
          scrollProgress={progress}
          scrollVelocity={smoothVel}
        />
      </Suspense>
      {reducedMotion ? (
        <StaticLayers />
      ) : (
        <>
          <motion.div
            className="terminal-bg__layer terminal-bg__glow"
            style={{ x: glowX, y: glowY, scale: glowScale }}
          />
          <motion.div
            className="terminal-bg__grid-wrap"
            style={{ x: gridX, y: gridY, scale: gridScale }}
          >
            <div className="terminal-bg__grid">
              <motion.div
                className="terminal-bg__grid-pattern"
                style={{ y: gridFlowY }}
              />
            </div>
          </motion.div>
          <div className="terminal-bg__layer terminal-bg__scanlines" />
          <motion.div
            className="terminal-bg__layer terminal-bg__grain"
            style={{ opacity: grainOpacity }}
          />
        </>
      )}
    </>
  );
};

const TerminalBackground: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="terminal-bg" aria-hidden="true">
      {isMobile ? <StaticLayers mobile /> : <DesktopBackdrop />}
    </div>
  );
};

export default TerminalBackground;
