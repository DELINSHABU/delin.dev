/* eslint-disable react/no-unknown-property */
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useInView, useReducedMotion } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import * as THREE from 'three';
import usePageVisible from '../../hooks/usePageVisible';
import { BREAKPOINT_HERO_GEOMETRY } from '../../utils/device';

interface MeshProps {
  scrollYProgress: MotionValue<number>;
}

const IcosahedronMesh: React.FC<MeshProps> = ({ scrollYProgress }) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const m = meshRef.current;
    m.rotation.x = state.clock.elapsedTime * 0.18;
    m.rotation.y = state.clock.elapsedTime * 0.12;
    m.position.y = THREE.MathUtils.lerp(
      m.position.y,
      scrollYProgress.get() * 2,
      0.05
    );
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.3, 1]} />
      <meshStandardMaterial wireframe color="#5ea2ff" opacity={0.28} transparent />
    </mesh>
  );
};

interface HeroGeometryProps {
  scrollYProgress: MotionValue<number>;
}

const HeroGeometry: React.FC<HeroGeometryProps> = ({ scrollYProgress }) => {
  const reducedMotion = useReducedMotion() ?? false;
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { margin: '200px' });
  const pageVisible = usePageVisible();
  const [show] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.innerWidth >= BREAKPOINT_HERO_GEOMETRY
  );

  if (reducedMotion || !show) return null;

  return (
    <div ref={containerRef} className="hero-geometry" aria-hidden="true">
      <Canvas
        frameloop={inView && pageVisible ? 'always' : 'demand'}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
        camera={{ position: [0, 0, 4] }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[3, 3, 2]} intensity={1.5} color="#5ea2ff" />
        <IcosahedronMesh scrollYProgress={scrollYProgress} />
      </Canvas>
    </div>
  );
};

export default HeroGeometry;
