import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useApp } from '../context/AppContext';

export const AICore: React.FC = () => {
  const { activeSection } = useApp();
  
  const coreRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Core properties that change based on section
  const targetPos = new THREE.Vector3(0, 0, 0);
  const targetScale = new THREE.Vector3(1, 1, 1);
  const targetColor = new THREE.Color('#00f5ff'); // Cyan highlight

  // Animate core state based on active section
  if (activeSection === 0) {
    // Hero: Large, center
    targetPos.set(0, 0, 0);
    targetScale.set(1.4, 1.4, 1.4);
    targetColor.set('#00f5ff');
  } else if (activeSection === 1) {
    // Story: High above the city, acting as a distant beacon
    targetPos.set(0, 5, -10);
    targetScale.set(0.6, 0.6, 0.6);
    targetColor.set('#0055ff');
  } else if (activeSection === 2) {
    // Skills: Center sun of the solar system
    targetPos.set(0, 0, 0);
    targetScale.set(1.0, 1.0, 1.0);
    targetColor.set('#8b5cf6'); // Purple accent
  } else if (activeSection === 3) {
    // Projects: Faded/distant
    targetPos.set(22, 8, -15);
    targetScale.set(0.4, 0.4, 0.4);
    targetColor.set('#0055ff');
  } else if (activeSection === 4) {
    // Journey: In the distance
    targetPos.set(0, -35, -20);
    targetScale.set(0.5, 0.5, 0.5);
    targetColor.set('#8b5cf6');
  } else if (activeSection === 5) {
    // Playground: Faded
    targetPos.set(-22, 12, -10);
    targetScale.set(0.5, 0.5, 0.5);
    targetColor.set('#00f5ff');
  } else if (activeSection === 6) {
    // Contact: Sunrise! Rises and glows warm orange/gold
    targetPos.set(0, 4, -12);
    targetScale.set(2.5, 2.5, 2.5);
    targetColor.set('#ff7700'); // Warm orange-gold
  }

  useFrame((_, delta) => {
    // 1. Smoothly interpolate position, scale, and color
    const lerpFactor = 1 - Math.exp(-3 * delta);
    
    if (coreRef.current) {
      coreRef.current.position.lerp(targetPos, lerpFactor);
      coreRef.current.scale.lerp(targetScale, lerpFactor);
      
      const mat = coreRef.current.material as THREE.MeshBasicMaterial;
      mat.color.lerp(targetColor, lerpFactor);
    }

    if (shellRef.current) {
      shellRef.current.position.lerp(targetPos, lerpFactor);
      shellRef.current.scale.lerp(
        new THREE.Vector3().copy(targetScale).multiplyScalar(1.15),
        lerpFactor
      );
      
      const mat = shellRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.color.lerp(targetColor, lerpFactor);
      }
    }

    if (ringRef.current) {
      ringRef.current.position.lerp(targetPos, lerpFactor);
      ringRef.current.scale.lerp(
        new THREE.Vector3().copy(targetScale).multiplyScalar(1.4),
        lerpFactor
      );
      
      // Rotate rings
      ringRef.current.rotation.x += 0.2 * delta;
      ringRef.current.rotation.y += 0.4 * delta;

      // Dynamically transition ring colors to match the target color scheme
      ringRef.current.children.forEach((child, idx) => {
        if (child instanceof THREE.Mesh) {
          const mat = child.material as THREE.MeshBasicMaterial;
          if (mat) {
            if (idx === 0) {
              mat.color.lerp(targetColor, lerpFactor);
            } else {
              // Complementary cyan shift for secondary ring structure
              const shiftedColor = new THREE.Color('#00f5ff');
              mat.color.lerp(shiftedColor, lerpFactor);
            }
          }
        }
      });
    }

    // Rotate core and shell
    if (coreRef.current) {
      coreRef.current.rotation.y += 0.3 * delta;
    }
    if (shellRef.current) {
      shellRef.current.rotation.y -= 0.15 * delta;
      shellRef.current.rotation.x += 0.1 * delta;
    }

    // Rotate background star particles
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.02 * delta;
      
      // If contact section, make particles float upwards (fireflies)
      if (activeSection === 6) {
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 1; i < positions.length; i += 3) {
          positions[i] += 0.5 * delta; // move up in Y
          if (positions[i] > 15) {
            positions[i] = -15; // wrap around
          }
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });

  // Generate 1000 star particles
  const particleCount = 1200;
  const [positions, colors] = React.useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const cols = new Float32Array(particleCount * 3);
    const color1 = new THREE.Color('#0055ff');
    const color2 = new THREE.Color('#00f5ff');
    const color3 = new THREE.Color('#8b5cf6');

    for (let i = 0; i < particleCount; i++) {
      // Distribute stars in a sphere shell
      const r = 8 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Mix colors
      const rand = Math.random();
      const mixedColor = rand < 0.33 ? color1 : rand < 0.66 ? color2 : color3;
      cols[i * 3] = mixedColor.r;
      cols[i * 3 + 1] = mixedColor.g;
      cols[i * 3 + 2] = mixedColor.b;
    }
    return [pos, cols];
  }, []);

  return (
    <group>
      {/* Background Starfield */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 1. Inner Core (Solid Glowing Sphere) */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#00f5ff"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 2. Outer Shell (Wireframe Sphere for Holographic look) */}
      <mesh ref={shellRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color="#0055ff"
          wireframe
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. Orbiting Energy Rings */}
      <group ref={ringRef}>
        {/* Ring 1 */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.4, 0.015, 8, 64]} />
          <meshBasicMaterial
            color="#8b5cf6"
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {/* Ring 2 */}
        <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <torusGeometry args={[1.5, 0.01, 8, 64]} />
          <meshBasicMaterial
            color="#00f5ff"
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Ambient point light emitted from core */}
      <pointLight position={[0, 0, 0]} intensity={2.5} distance={25} color={targetColor} />
    </group>
  );
};
