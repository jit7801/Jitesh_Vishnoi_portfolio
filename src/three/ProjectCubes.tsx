import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useApp } from '../context/AppContext';

interface CubeProps {
  index: number;
  position: [number, number, number];
  color: string;
}

const HolographicCube: React.FC<CubeProps> = ({ index, position, color }) => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  
  const { activeSection, zoomedProject, setZoomedProject, setCursorType } = useApp();
  const [hovered, setHovered] = useState(false);
  const faceOffset = useRef(0);

  // References for the 6 faces
  const faceRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state, delta) => {
    if (activeSection !== 3 && activeSection !== 2) return;
    // 1. Slow continuous rotation of the entire group
    if (groupRef.current) {
      groupRef.current.rotation.x += 0.2 * delta;
      groupRef.current.rotation.y += 0.3 * delta;
      
      // Gentle floating up and down
      groupRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() + index * 2) * 0.15;
    }

    // 2. Animate face slide-out when hovered
    const isZoomed = zoomedProject === index;
    const targetOffset = hovered || isZoomed ? 0.45 : 0;
    faceOffset.current = THREE.MathUtils.lerp(faceOffset.current, targetOffset, 1 - Math.exp(-8 * delta));

    // Move faces along their normal directions
    const faceDirections = [
      [0, 0, 1],   // Front
      [0, 0, -1],  // Back
      [0, 1, 0],   // Top
      [0, -1, 0],  // Bottom
      [1, 0, 0],   // Right
      [-1, 0, 0],  // Left
    ];

    faceRefs.current.forEach((face, i) => {
      if (face) {
        const dir = faceDirections[i];
        const basePos = 0.5; // Half of cube size (1.0)
        face.position.set(
          dir[0] * (basePos + faceOffset.current),
          dir[1] * (basePos + faceOffset.current),
          dir[2] * (basePos + faceOffset.current)
        );
      }
    });

    // 3. Make inner core rotate and pulse
    if (coreRef.current) {
      coreRef.current.rotation.z -= 0.5 * delta;
      const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 4) * 0.1;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  const isZoomed = zoomedProject === index;

  return (
    <group
      ref={groupRef}
      position={position}
      name={`project-cube-${index}`}
      onClick={(e) => {
        e.stopPropagation();
        if (isZoomed) {
          setZoomedProject(null);
        } else {
          setZoomedProject(index);
        }
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        setCursorType('hover');
      }}
      onPointerOut={() => {
        setHovered(false);
        setCursorType('default');
      }}
    >
      {/* Outer Wireframe Box (always stays closed as reference) */}
      <mesh>
        <boxGeometry args={[1.05, 1.05, 1.05]} />
        <meshBasicMaterial
          color={color}
          wireframe
          transparent
          opacity={hovered || isZoomed ? 0.3 : 0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner Glowing Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered || isZoomed ? 0.95 : 0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 6 Sliding Glass Faces */}
      {Array.from({ length: 6 }).map((_, i) => {
        // Face rotations to orient them correctly
        const rotations: [number, number, number][] = [
          [0, 0, 0],                  // Front
          [0, Math.PI, 0],            // Back
          [-Math.PI / 2, 0, 0],       // Top
          [Math.PI / 2, 0, 0],        // Bottom
          [0, Math.PI / 2, 0],        // Right
          [0, -Math.PI / 2, 0],       // Left
        ];

        return (
          <mesh
            key={i}
            ref={(el) => {
              if (el) faceRefs.current[i] = el;
            }}
            rotation={rotations[i]}
          >
            {/* Extremely thin box representing a face panel */}
            <boxGeometry args={[0.95, 0.95, 0.02]} />
            <meshStandardMaterial
              color="#121212"
              roughness={0.1}
              metalness={0.9}
              transparent
              opacity={hovered || isZoomed ? 0.65 : 0.3}
              emissive={color}
              emissiveIntensity={hovered || isZoomed ? 0.5 : 0.1}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export const ProjectCubes: React.FC = () => {
  const { activeSection, setZoomedProject } = useApp();

  const isVisible = activeSection === 3 || activeSection === 2;

  return (
    <group
      visible={isVisible}
      onClick={() => {
        // Reset zoom if clicked background
        setZoomedProject(null);
      }}
    >
      <HolographicCube index={0} position={[18.8, 0.6, -0.5]} color="#0055ff" />
      <HolographicCube index={1} position={[22.0, 1.5, -1.5]} color="#00f5ff" />
      <HolographicCube index={2} position={[25.2, 0.6, -0.5]} color="#8b5cf6" />
      <HolographicCube index={3} position={[20.2, -0.8, 0.5]} color="#ff9f40" />
      <HolographicCube index={4} position={[23.8, -0.8, 0.5]} color="#05c46b" />
    </group>
  );
};
