import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { useApp } from '../context/AppContext';

export const JourneyPath: React.FC = () => {
  const { activeSection } = useApp();
  const pulseRefs = useRef<THREE.Mesh[]>([]);

  // 1. Define the 3D spline curve points
  const points = useMemo(() => [
    new THREE.Vector3(-5, -44, 8),     // Start B.Tech
    new THREE.Vector3(-2, -42.5, 4),   // B.Sc. AI & DS
    new THREE.Vector3(3, -43.5, 0),    // IIT Jodhpur
    new THREE.Vector3(1, -41.0, -4),   // Building AI Applications
    new THREE.Vector3(-3, -42.0, -8),  // Open Source
    new THREE.Vector3(0, -40.0, -12),  // Career Growth / Future
  ], []);

  // Create a CatmullRomCurve3 from the points
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(points);
  }, [points]);

  // Generate dense points for drawing the line
  const linePoints = useMemo(() => {
    return curve.getPoints(100).map(p => [p.x, p.y, p.z] as [number, number, number]);
  }, [curve]);

  // 2. Local state/refs to animate pulses along the path
  const pulseCount = 3;
  const pulseSpeeds = [0.15, 0.22, 0.10];
  const pulseOffsets = [0, 0.35, 0.7];

  useFrame((state) => {
    if (activeSection !== 4 && activeSection !== 3 && activeSection !== 5) return;
    const elapsed = state.clock.getElapsedTime();

    // Animate each glowing energy packet along the curve
    pulseRefs.current.forEach((pulse, idx) => {
      if (pulse) {
        const speed = pulseSpeeds[idx];
        const offset = pulseOffsets[idx];
        // Calculate progress (0 to 1) along the path
        const progress = (elapsed * speed + offset) % 1.0;
        const position = curve.getPointAt(progress);
        pulse.position.copy(position);
      }
    });
  });

  const isVisible = activeSection === 4 || activeSection === 3 || activeSection === 5;

  return (
    <group visible={isVisible}>
      {/* The main glowing timeline path */}
      <Line
        points={linePoints}
        color="#00f5ff"
        lineWidth={2}
        transparent
        opacity={0.7}
      />
      
      {/* Faded parallel path for depth */}
      <Line
        points={linePoints.map(([x, y, z]) => [x + 0.15, y - 0.1, z - 0.15])}
        color="#8b5cf6"
        lineWidth={1}
        transparent
        opacity={0.2}
      />

      {/* Milestone Nodes */}
      {points.map((p, idx) => {
        const colors = ['#0055ff', '#00f5ff', '#8b5cf6', '#00f5ff', '#8b5cf6', '#0055ff'];
        const color = colors[idx % colors.length];
        
        return (
          <group key={idx} position={p}>
            {/* Glowing sphere */}
            <mesh>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={0.85}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
            {/* Outer halo */}
            <mesh>
              <sphereGeometry args={[0.38, 16, 16]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={0.25}
                blending={THREE.AdditiveBlending}
                wireframe
              />
            </mesh>
          </group>
        );
      })}

      {/* Energy Pulses (moving along the path) */}
      {Array.from({ length: pulseCount }).map((_, idx) => {
        const colors = ['#00f5ff', '#8b5cf6', '#ffffff'];
        const color = colors[idx % colors.length];

        return (
          <mesh
            key={`pulse-${idx}`}
            ref={(el) => {
              if (el) pulseRefs.current[idx] = el;
            }}
          >
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.9}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}
    </group>
  );
};
