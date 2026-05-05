import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// ─── Mouse tracker (normalized -1 to 1) ───
const useMousePosition = () => {
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);
  return mouse;
};

// ─── Central Icosahedron Core ───
const CoreGeometry: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const wireRef = useRef<THREE.LineSegments>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const mouse = useMousePosition();

  const wireframeGeo = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.4, 1);
    return new THREE.EdgesGeometry(geo);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Smooth mouse follow
    if (meshRef.current) {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        mouse.current.y * 0.3 + t * 0.1,
        0.05
      );
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        mouse.current.x * 0.3 + t * 0.15,
        0.05
      );
    }

    // Wireframe counter-rotation
    if (wireRef.current) {
      wireRef.current.rotation.x = -t * 0.08;
      wireRef.current.rotation.y = t * 0.12;
      wireRef.current.rotation.z = t * 0.05;
    }

    // Glow pulse
    if (glowRef.current) {
      const pulse = 1 + Math.sin(t * 2) * 0.08;
      glowRef.current.scale.setScalar(pulse * 1.6);
    }
  });

  return (
    <group>
      {/* Inner solid core */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.2, 1]} />
          <MeshDistortMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={0.4}
            roughness={0.2}
            metalness={0.8}
            distort={0.15}
            speed={3}
            transparent
            opacity={0.15}
          />
        </mesh>
      </Float>

      {/* Wireframe shell */}
      <lineSegments ref={wireRef} geometry={wireframeGeo}>
        <lineBasicMaterial color="#06b6d4" transparent opacity={0.7} linewidth={1} />
      </lineSegments>

      {/* Outer glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.03} side={THREE.BackSide} />
      </mesh>
    </group>
  );
};

// ─── Orbiting Particle Ring ───
interface ParticleRingProps {
  count?: number;
  radius?: number;
  color?: string;
  speed?: number;
  axis?: [number, number, number];
  size?: number;
}

const ParticleRing: React.FC<ParticleRingProps> = ({
  count = 120,
  radius = 2.2,
  color = '#06b6d4',
  speed = 0.3,
  axis = [0, 0, 0],
  size = 0.02,
}) => {
  const ref = useRef<THREE.Points>(null!);

  const [positions, opacities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const opac = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = radius + (Math.random() - 0.5) * 0.3;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.15;
      pos[i * 3 + 2] = Math.sin(angle) * r;
      opac[i] = 0.3 + Math.random() * 0.7;
    }
    return [pos, opac];
  }, [count, radius]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * speed;
      ref.current.rotation.x = axis[0];
      ref.current.rotation.z = axis[2];
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// ─── Floating Ambient Particles ───
const FloatingParticles: React.FC<{ count?: number }> = ({ count = 200 }) => {
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribute in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.5 + Math.random() * 3;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.03;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#06b6d4"
        size={0.015}
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// ─── Energy Beams (thin lines radiating from core) ───
const EnergyBeams: React.FC = () => {
  const ref = useRef<THREE.Group>(null!);
  
  const beams = useMemo(() => {
    const lines: { start: THREE.Vector3; end: THREE.Vector3; opacity: number }[] = [];
    for (let i = 0; i < 8; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const startR = 1.3;
      const endR = 2.5 + Math.random() * 1.5;
      
      const dir = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.sin(phi) * Math.sin(theta),
        Math.cos(phi)
      );
      
      lines.push({
        start: dir.clone().multiplyScalar(startR),
        end: dir.clone().multiplyScalar(endR),
        // Memoize opacity so it doesn't randomly flicker on every frame
        opacity: 0.2 + Math.random() * 0.3,
      });
    }
    return lines;
  }, []);

  // Memoize geometries — created once, reused every frame
  const beamGeometries = useMemo(() =>
    beams.map(beam =>
      new THREE.BufferGeometry().setFromPoints([beam.start, beam.end])
    ),
  [beams]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={ref}>
      {beams.map((beam, i) => (
        <line key={i} geometry={beamGeometries[i]}>
          <lineBasicMaterial
            color="#d946ef"
            transparent
            opacity={beam.opacity}
            blending={THREE.AdditiveBlending}
          />
        </line>
      ))}
    </group>
  );
};

// ─── Hexagonal Grid Floor (subtle) ───
const HexGrid: React.FC = () => {
  const ref = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.03 + Math.sin(state.clock.elapsedTime) * 0.01;
    }
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
      <planeGeometry args={[12, 12]} />
      <meshBasicMaterial color="#06b6d4" transparent opacity={0.03} side={THREE.DoubleSide} />
    </mesh>
  );
};

// ─── Scene Setup ───
const Scene: React.FC = () => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#06b6d4" />
      <pointLight position={[-5, -3, -5]} intensity={0.3} color="#d946ef" />
      <pointLight position={[0, 3, 0]} intensity={0.2} color="#ffffff" />

      {/* Core */}
      <CoreGeometry />

      {/* Particle Rings — different axes for depth */}
      <ParticleRing count={150} radius={2.2} speed={0.25} axis={[0.3, 0, 0.1]} size={0.025} color="#06b6d4" />
      <ParticleRing count={100} radius={2.8} speed={-0.15} axis={[-0.5, 0, 0.3]} size={0.018} color="#d946ef" />
      <ParticleRing count={80} radius={3.3} speed={0.1} axis={[0.2, 0, -0.4]} size={0.015} color="#22d3ee" />

      {/* Floating particles */}
      <FloatingParticles count={250} />

      {/* Energy beams */}
      <EnergyBeams />

      {/* Subtle grid floor */}
      <HexGrid />
    </>
  );
};

// ─── Main Export ───
export const HeroCoreScene: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lazy mount: only render Canvas when in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[400px]"
      style={{ cursor: 'grab' }}
    >
      {/* Radial glow background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(6,182,212,0.08) 0%, transparent 60%)',
        }}
      />

      {isVisible && (
        <Canvas
          camera={{ position: [0, 0, 6], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          style={{ background: 'transparent' }}
        >
          <Scene />
        </Canvas>
      )}

      {/* Label overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-tech text-[10px] text-cyan-500/40 tracking-widest pointer-events-none select-none uppercase">
        [ Neural Core v3.0 — Online ]
      </div>
    </div>
  );
};
