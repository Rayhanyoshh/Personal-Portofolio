import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';

// ─── Individual Floating Skill Tag ───
interface SkillTagProps {
  text: string;
  position: [number, number, number];
  color: string;
  index: number;
}

const SkillTag: React.FC<SkillTagProps> = ({ text, position, color, index }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);

  // Each tag orbits slightly differently
  const orbitSpeed = useMemo(() => 0.15 + Math.random() * 0.15, []);
  const orbitRadius = useMemo(() => Math.sqrt(position[0] ** 2 + position[2] ** 2), [position]);
  const initialAngle = useMemo(() => Math.atan2(position[2], position[0]), [position]);
  const yOffset = useMemo(() => position[1], [position]);
  const floatAmplitude = useMemo(() => 0.15 + Math.random() * 0.2, []);
  const floatSpeed = useMemo(() => 0.5 + Math.random() * 0.5, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Orbit around center
    const angle = initialAngle + t * orbitSpeed;
    groupRef.current.position.x = Math.cos(angle) * orbitRadius;
    groupRef.current.position.z = Math.sin(angle) * orbitRadius;
    groupRef.current.position.y = yOffset + Math.sin(t * floatSpeed + index) * floatAmplitude;

    // Always face camera (billboard effect)
    groupRef.current.lookAt(state.camera.position);

    // Hover scale
    const targetScale = hovered ? 1.3 : 1;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Glow background plane */}
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[text.length * 0.22 + 0.4, 0.5]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.2 : 0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Border */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(text.length * 0.22 + 0.4, 0.5)]} />
        <lineBasicMaterial color={color} transparent opacity={hovered ? 0.8 : 0.3} />
      </lineSegments>

      {/* Text — uses drei's built-in Roboto (always bundled, no network needed) */}
      <Text
        fontSize={0.2}
        color={hovered ? '#ffffff' : color}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.05}
      >
        {`[ ${text} ]`}
      </Text>
    </group>
  );
};

// ─── Connecting Lines Between Nearby Tags ───
const ConnectionLines: React.FC<{ positions: [number, number, number][] }> = ({ positions }) => {
  const ref = useRef<THREE.Group>(null!);

  const connections = useMemo(() => {
    const lines: { from: number; to: number }[] = [];
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const dist = Math.sqrt(
          (positions[i][0] - positions[j][0]) ** 2 +
          (positions[i][1] - positions[j][1]) ** 2 +
          (positions[i][2] - positions[j][2]) ** 2
        );
        if (dist < 3) {
          lines.push({ from: i, to: j });
        }
      }
    }
    return lines;
  }, [positions]);

  const lineGeometries = useMemo(() => {
    return connections.map((conn) =>
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...positions[conn.from]),
        new THREE.Vector3(...positions[conn.to]),
      ])
    );
  }, [connections, positions]);

  return (
    <group ref={ref}>
      {connections.map((conn, i) => (
        <line key={i} geometry={lineGeometries[i]}>
          <lineBasicMaterial
            color="#06b6d4"
            transparent
            opacity={0.06}
            blending={THREE.AdditiveBlending}
          />
        </line>
      ))}
    </group>
  );
};

// ─── Central Glow Core ───
const CenterGlow: React.FC = () => {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (ref.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
      ref.current.scale.setScalar(s);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshBasicMaterial color="#06b6d4" transparent opacity={0.1} />
    </mesh>
  );
};

// ─── Scene ───
interface SceneProps {
  skills: string[];
}

const SKILL_COLORS: Record<string, string> = {
  'Node.js': '#68a063',
  'Vue.js': '#42b883',
  'Next.js': '#ffffff',
  '.NET 8': '#512bd4',
  'C#': '#68217a',
  'SQL Server': '#cc2927',
  'MySQL': '#00758f',
  'Python': '#3776ab',
  'SignalR': '#512bd4',
  'TypeScript': '#3178c6',
  'Tailwind CSS': '#06b6d4',
};

const Scene: React.FC<SceneProps> = ({ skills }) => {
  // Distribute skills in a 3D sphere
  const positions = useMemo<[number, number, number][]>(() => {
    return skills.map((_, i) => {
      const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // fibonacci sphere
      const y = 1 - (i / (skills.length - 1)) * 2; // -1 to 1
      const radius = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;

      const scale = 2.5;
      return [
        Math.cos(theta) * radius * scale,
        y * scale * 0.8,
        Math.sin(theta) * radius * scale,
      ];
    });
  }, [skills]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 3, 3]} intensity={0.3} color="#06b6d4" />

      <CenterGlow />
      <ConnectionLines positions={positions} />

      {skills.map((skill, i) => (
        <SkillTag
          key={skill}
          text={skill}
          position={positions[i]}
          color={SKILL_COLORS[skill] || '#06b6d4'}
          index={i}
        />
      ))}
    </>
  );
};

// ─── Main Export ───
interface SkillCloud3DProps {
  skills: string[];
}

export const SkillCloud3D: React.FC<SkillCloud3DProps> = ({ skills }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
    <div ref={containerRef} className="relative w-full h-[450px] sm:h-[500px]">
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(6,182,212,0.06) 0%, transparent 60%)',
        }}
      />

      {isVisible && (
        <Canvas
          camera={{ position: [0, 0, 6], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ background: 'transparent', cursor: 'grab' }}
        >
          <Scene skills={skills} />
        </Canvas>
      )}

      {/* Overlay label */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 font-tech text-[10px] text-cyan-500/30 tracking-widest pointer-events-none select-none uppercase">
        [ Drag to explore • Hover for details ]
      </div>
    </div>
  );
};
