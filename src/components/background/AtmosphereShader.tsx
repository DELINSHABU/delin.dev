/* eslint-disable react/no-unknown-property */
import React, { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import type { MotionValue } from 'framer-motion';
import * as THREE from 'three';

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
uniform float uTime;
uniform vec2 uMouse;
uniform vec3 uBase;
uniform vec3 uAccent;
uniform float uIntensity;
uniform float uScroll;
uniform float uScrollVel;

varying vec2 vUv;

vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
}

float dither4x4(vec2 position, float brightness) {
  int x = int(mod(position.x, 4.0));
  int y = int(mod(position.y, 4.0));
  float limit = 0.0;
  if (x < 1) {
    if (y < 1) limit = 1.0/17.0;
    else if (y < 2) limit = 9.0/17.0;
    else if (y < 3) limit = 3.0/17.0;
    else limit = 11.0/17.0;
  } else if (x < 2) {
    if (y < 1) limit = 13.0/17.0;
    else if (y < 2) limit = 5.0/17.0;
    else if (y < 3) limit = 15.0/17.0;
    else limit = 7.0/17.0;
  } else if (x < 3) {
    if (y < 1) limit = 4.0/17.0;
    else if (y < 2) limit = 12.0/17.0;
    else if (y < 3) limit = 2.0/17.0;
    else limit = 10.0/17.0;
  } else {
    if (y < 1) limit = 16.0/17.0;
    else if (y < 2) limit = 8.0/17.0;
    else if (y < 3) limit = 14.0/17.0;
    else limit = 6.0/17.0;
  }
  return brightness < limit ? 0.0 : 1.0;
}

void main() {
  vec2 uv = vUv;

  // slow drifting 2-octave noise field; scroll travels through it vertically,
  // with the second octave counter-drifting for inter-octave parallax
  float travel = uScroll * 1.4;
  vec2 drift = vec2(uTime * 0.018, uTime * 0.012 + travel);
  float n1 = cnoise(uv * 2.4 + drift);
  float n2 = cnoise(uv * 5.1 - drift * 1.6 + vec2(0.0, travel * 0.6));
  float noise = n1 * 0.65 + n2 * 0.35;
  noise = noise * 0.5 + 0.5;

  // quantize + dither for the terminal texture
  float quantized = floor(noise * 6.0) / 6.0;
  float dithered = dither4x4(gl_FragCoord.xy, noise);
  float field = mix(quantized, dithered, 0.4);

  float intensity = uIntensity * (1.0 + uScroll * 0.35 + uScrollVel * 0.5);
  vec3 color = mix(uBase, uAccent, field * noise * intensity);

  // faint mouse proximity glow
  float mouseDist = distance(uv, uMouse);
  float mouseEffect = 1.0 - smoothstep(0.0, 0.45, mouseDist);
  color += uAccent * mouseEffect * 0.05;

  // vignette, tightening slightly with scroll depth
  color *= smoothstep(1.05 - uScroll * 0.08, 0.35, length(vUv - 0.5) * 1.4);

  gl_FragColor = vec4(color, 1.0);
}
`;

// per-section accent tint: home / about / projects / contact
const ACCENT_STOPS = ['#5ea2ff', '#54d8e8', '#9a7cff', '#63e6a4'].map(
  (c) => new THREE.Color(c)
);
const tmpAccent = new THREE.Color();

interface AtmospherePlaneProps {
  scrollProgress: MotionValue<number>;
  scrollVelocity: MotionValue<number>;
}

const AtmospherePlane: React.FC<AtmospherePlaneProps> = ({
  scrollProgress,
  scrollVelocity,
}) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const { viewport } = useThree();
  const mousePos = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uBase: { value: new THREE.Color('#0a0b0e') },
      uAccent: { value: new THREE.Color('#5ea2ff') },
      uIntensity: { value: 0.14 },
      uScroll: { value: 0 },
      uScrollVel: { value: 0 },
    }),
    []
  );

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePos.current.set(
        event.clientX / window.innerWidth,
        1 - event.clientY / window.innerHeight
      );
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!materialRef.current) return;
    const u = materialRef.current.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    (u.uMouse.value as THREE.Vector2).lerp(mousePos.current, 0.06);
    // the shader is the farthest layer, so it trails the scroll slightly
    u.uScroll.value = THREE.MathUtils.lerp(
      u.uScroll.value,
      scrollProgress.get(),
      0.08
    );
    u.uScrollVel.value = THREE.MathUtils.lerp(
      u.uScrollVel.value,
      scrollVelocity.get(),
      0.1
    );

    const p = THREE.MathUtils.clamp(scrollProgress.get(), 0, 1);
    const seg = Math.min(Math.floor(p * 3), 2);
    tmpAccent.copy(ACCENT_STOPS[seg]).lerp(ACCENT_STOPS[seg + 1], p * 3 - seg);
    (u.uAccent.value as THREE.Color).lerp(tmpAccent, 0.05);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

interface AtmosphereShaderProps {
  reducedMotion: boolean;
  scrollProgress: MotionValue<number>;
  scrollVelocity: MotionValue<number>;
}

const AtmosphereShader: React.FC<AtmosphereShaderProps> = ({
  reducedMotion,
  scrollProgress,
  scrollVelocity,
}) => {
  const isSmallScreen =
    typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <Canvas
      frameloop={reducedMotion ? 'never' : 'always'}
      dpr={isSmallScreen ? [1, 1.25] : [1, 1.5]}
      gl={{ antialias: false, alpha: false, powerPreference: 'low-power' }}
      camera={{ position: [0, 0, 1] }}
      onCreated={({ invalidate }) => {
        if (reducedMotion) invalidate();
      }}
      aria-hidden="true"
    >
      <AtmospherePlane
        scrollProgress={scrollProgress}
        scrollVelocity={scrollVelocity}
      />
    </Canvas>
  );
};

export default AtmosphereShader;
