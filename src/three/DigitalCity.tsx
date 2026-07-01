import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useApp } from '../context/AppContext';

interface BuildingProps {
  position: [number, number, number];
  height: number;
  isActive: boolean;
  color: string;
}

const Building: React.FC<BuildingProps> = ({ position, height, isActive, color }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.LineSegments>(null);
  const beamRef = useRef<THREE.Mesh>(null);

  // Smoothly interpolate emissive and scale values based on active state
  useFrame((_, delta) => {
    const targetEmissive = isActive ? 1.0 : 0.05;
    const targetOpacity = isActive ? 0.35 : 0.1;
    const targetBeamScale = isActive ? 1.0 : 0.0;
    
    const lerpFactor = 1 - Math.exp(-6 * delta);

    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetEmissive, lerpFactor);
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, lerpFactor);
    }

    if (wireRef.current) {
      const mat = wireRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, isActive ? 0.9 : 0.2, lerpFactor);
    }

    if (beamRef.current) {
      beamRef.current.scale.y = THREE.MathUtils.lerp(beamRef.current.scale.y, targetBeamScale, lerpFactor);
      const mat = beamRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, isActive ? 0.6 : 0.0, lerpFactor);
    }
  });

  return (
    <group position={position}>
      {/* 1. Glassmorphic Building Body */}
      <mesh ref={meshRef} position={[0, height / 2, 0]}>
        <boxGeometry args={[1.2, height, 1.2]} />
        <meshStandardMaterial
          color="#121212"
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.1}
          emissive={color}
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* 2. Neon Wireframe Outline */}
      <lineSegments ref={wireRef} position={[0, height / 2, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(1.2, height, 1.2)]} />
        <lineBasicMaterial color={color} transparent opacity={0.2} linewidth={1} />
      </lineSegments>

      {/* 3. Glowing Laser Beam from top */}
      <mesh ref={beamRef} position={[0, height + 5, 0]} scale={[1, 0, 1]}>
        <cylinderGeometry args={[0.03, 0.03, 10, 8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

export const DigitalCity: React.FC = () => {
  const { activeSection } = useApp();
  const groupRef = useRef<THREE.Group>(null);
  
  // Track scroll position to calculate active building locally
  const [activeBuildingIndex, setActiveBuildingIndex] = React.useState(-1);

  useFrame(() => {
    if (activeSection !== 1) {
      if (activeBuildingIndex !== -1) setActiveBuildingIndex(-1);
      return;
    }

    const scrollY = window.scrollY;
    const height = window.innerHeight;
    
    // The Story section is active between scrollY = height and scrollY = height * 2
    const start = height;
    const end = height * 2;
    
    if (scrollY >= start && scrollY <= end) {
      const progress = (scrollY - start) / (end - start);
      // Map progress (0 to 1) to building index (0 to 6)
      const index = Math.min(Math.floor(progress * 7), 6);
      if (index !== activeBuildingIndex) {
        setActiveBuildingIndex(index);
      }
    }
  });

  // 7 buildings representing milestones
  const buildings = useMemo(() => [
    { height: 4.0, x: -2.5, z: 6, color: '#0055ff' }, // Curiosity
    { height: 5.0, x: 2.5, z: 4, color: '#00f5ff' },  // Learning Programming
    { height: 6.0, x: -2.5, z: 2, color: '#8b5cf6' }, // Building Websites
    { height: 6.5, x: 2.5, z: 0, color: '#0055ff' },  // Discovering AI
    { height: 7.5, x: -2.5, z: -2, color: '#00f5ff' }, // Machine Learning
    { height: 8.0, x: 2.5, z: -4, color: '#8b5cf6' },  // Creating Real Projects
    { height: 9.5, x: 0, z: -6.5, color: '#00f5ff' },  // Future Innovations (Central Tower)
  ], []);

  return (
    <group ref={groupRef} position={[0, -23, 0]}>
      {/* City Grid floor */}
      <gridHelper args={[30, 30, '#0055ff', '#111122']} position={[0, 0, 0]}>
        <lineBasicMaterial attach="material" transparent opacity={0.15} />
      </gridHelper>
      
      {buildings.map((b, idx) => (
        <Building
          key={idx}
          position={[b.x, 0, b.z]}
          height={b.height}
          isActive={idx === activeBuildingIndex}
          color={b.color}
        />
      ))}

      {/* Some extra ambient small background buildings to fill the scene */}
      {Array.from({ length: 16 }).map((_, idx) => {
        const x = (Math.random() > 0.5 ? 1 : -1) * (6 + Math.random() * 8);
        const z = -10 + Math.random() * 20;
        const height = 3 + Math.random() * 5;
        return (
          <mesh key={`bg-b-${idx}`} position={[x, height / 2, z]}>
            <boxGeometry args={[0.8, height, 0.8]} />
            <meshStandardMaterial
              color="#0f0f15"
              roughness={0.8}
              transparent
              opacity={0.15}
              wireframe
            />
          </mesh>
        );
      })}
    </group>
  );
};
