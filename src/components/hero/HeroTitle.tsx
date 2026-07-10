/* eslint-disable react/no-unknown-property */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useInView, useReducedMotion } from 'framer-motion';
import * as THREE from 'three';
import usePageVisible from '../../hooks/usePageVisible';
import { BREAKPOINT_MOBILE, supportsWebGL } from '../../utils/device';
import './HeroTitle.css';

const vertexShader = `
precision highp float;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;
uniform sampler2D uMap;
uniform float uHover;
uniform vec2 uMouse;
uniform float uTime;
varying vec2 vUv;

float rand(float n) { return fract(sin(n) * 43758.5453123); }

void main() {
  float d = distance(vUv, uMouse);
  float influence = smoothstep(0.45, 0.0, d) * uHover;
  vec2 dir = normalize(vUv - uMouse + 1e-4);

  // ripple displacement around the cursor
  vec2 uv = vUv + dir * sin(d * 28.0 - uTime * 6.0) * 0.012 * influence;

  // random horizontal glitch slices
  float band = step(0.965, rand(floor(uv.y * 22.0) + floor(uTime * 7.0)));
  uv.x += band * 0.035 * influence;

  // chromatic aberration, strongest near the cursor
  float ca = 0.002 * uHover + 0.006 * influence;
  vec4 r = texture2D(uMap, uv + dir * ca);
  vec4 g = texture2D(uMap, uv);
  vec4 b = texture2D(uMap, uv - dir * ca);

  gl_FragColor = vec4(r.r, g.g, b.b, max(r.a, max(g.a, b.a)));
}
`;

interface PointerState {
  hoverTarget: number;
  mouse: THREE.Vector2;
}

interface TitlePlaneProps {
  text: string;
  fontSize: number;
  pointer: React.MutableRefObject<PointerState>;
  onSettle: () => void;
}

const TitlePlane: React.FC<TitlePlaneProps> = ({
  text,
  fontSize,
  pointer,
  onSettle,
}) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const { size, viewport } = useThree();
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled || size.width === 0 || size.height === 0) return;
      const res = Math.min(window.devicePixelRatio || 1, 2) * 2;
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(size.width * res);
      canvas.height = Math.ceil(size.height * res);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.scale(res, res);
      ctx.font = `800 ${fontSize}px 'JetBrains Mono', monospace`;
      // match the h1's letter-spacing and left padding so the WebGL
      // text sits exactly where the DOM text does
      (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
        `${-0.03 * fontSize}px`;
      ctx.fillStyle = '#e9edf2';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, fontSize * 0.1, size.height / 2);

      const tex = new THREE.CanvasTexture(canvas);
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      setTexture((prev) => {
        prev?.dispose();
        return tex;
      });
    });
    return () => {
      cancelled = true;
    };
  }, [text, fontSize, size.width, size.height]);

  const uniforms = useMemo(
    () => ({
      uMap: { value: null as THREE.Texture | null },
      uHover: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 },
    }),
    []
  );

  useEffect(() => {
    if (texture) uniforms.uMap.value = texture;
  }, [texture, uniforms]);

  useFrame((state, delta) => {
    if (!materialRef.current) return;
    const u = materialRef.current.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uHover.value = THREE.MathUtils.damp(
      u.uHover.value,
      pointer.current.hoverTarget,
      4,
      delta
    );
    (u.uMouse.value as THREE.Vector2).lerp(pointer.current.mouse, 0.15);
    // once the ripple has fully decayed the shader output is a static blit,
    // so hand rendering back to demand mode until the next hover
    if (pointer.current.hoverTarget === 0 && u.uHover.value < 0.001) {
      u.uHover.value = 0;
      onSettle();
    }
  });

  const { invalidate } = useThree();
  useEffect(() => {
    if (texture) invalidate();
  }, [texture, invalidate]);

  if (!texture) return null;

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
};

/** Re-renders one frame whenever `value` changes (for demand/never frameloops). */
const InvalidateOn: React.FC<{ value: unknown }> = ({ value }) => {
  const { invalidate } = useThree();
  useEffect(() => {
    invalidate();
  }, [value, invalidate]);
  return null;
};

interface HeroTitleProps {
  text: string;
}

/**
 * The hero showpiece: the title rendered to a WebGL plane with a
 * hover-driven ripple + glitch + chromatic aberration shader.
 * Falls back to a styled DOM heading on mobile / reduced motion / no WebGL.
 */
const HeroTitle: React.FC<HeroTitleProps> = ({ text }) => {
  const reducedMotion = useReducedMotion() ?? false;
  const wrapRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const pointer = useRef<PointerState>({
    hoverTarget: 0,
    mouse: new THREE.Vector2(0.5, 0.5),
  });

  const [fontSize, setFontSize] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(
    () => window.innerWidth < BREAKPOINT_MOBILE
  );
  const webglOk = useMemo(supportsWebGL, []);
  const useWebGL = !reducedMotion && !isSmallScreen && webglOk;

  // render continuously only while the hover ripple is active; otherwise the
  // shader output is static, so a demand-rendered frame is pixel-identical
  const [hoverActive, setHoverActive] = useState(false);
  const inView = useInView(wrapRef, { margin: '100px' });
  const pageVisible = usePageVisible();
  const frameloop =
    !inView || !pageVisible ? 'never' : hoverActive ? 'always' : 'demand';
  const handleSettle = useCallback(() => setHoverActive(false), []);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < BREAKPOINT_MOBILE);
      if (h1Ref.current) {
        setFontSize(parseFloat(getComputedStyle(h1Ref.current).fontSize));
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    pointer.current.mouse.set(
      (event.clientX - rect.left) / rect.width,
      1 - (event.clientY - rect.top) / rect.height
    );
  };

  return (
    <div
      ref={wrapRef}
      className={`hero-title-wrap ${useWebGL ? 'hero-title-wrap--webgl' : ''}`}
      onPointerEnter={() => {
        pointer.current.hoverTarget = 1;
        setHoverActive(true);
      }}
      onPointerLeave={() => (pointer.current.hoverTarget = 0)}
      onPointerMove={handlePointerMove}
    >
      <h1 ref={h1Ref} className="hero-title">
        {text}
      </h1>
      {useWebGL && fontSize > 0 && (
        <div className="hero-title-canvas" aria-hidden="true">
          <Canvas
            orthographic
            frameloop={frameloop}
            dpr={[1, 2]}
            gl={{ antialias: false, alpha: true }}
            camera={{ position: [0, 0, 1] }}
          >
            <InvalidateOn value={frameloop} />
            <TitlePlane
              text={text}
              fontSize={fontSize}
              pointer={pointer}
              onSettle={handleSettle}
            />
          </Canvas>
        </div>
      )}
    </div>
  );
};

export default HeroTitle;
