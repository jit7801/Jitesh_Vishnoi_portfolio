import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useApp } from '../context/AppContext';

interface Particle {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  color: THREE.Color;
  size: number;
  life: number; // 0 to 1
  mode: string; // 'explode' | 'sink' | 'vortex'
  initialDist?: number;
  angleOffset?: number;
}

export const PlaygroundScene: React.FC = () => {
  const { activeSection, setCursorType } = useApp();
  
  const knotRef = useRef<THREE.Mesh>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const boxRef = useRef<THREE.Mesh>(null);
  
  const [hoveredKnot, setHoveredKnot] = useState(false);
  const [hoveredSphere, setHoveredSphere] = useState(false);
  const [hoveredBox, setHoveredBox] = useState(false);

  // Dynamic interactive sandbox state variables
  const [shape, setShape] = useState('torusKnot');
  const [color, setColor] = useState('#00f5ff');
  const [physicsMode, setPhysicsMode] = useState('explode');

  // Generate harmonized complementary colors for surrounding shapes
  const sphereColor = useMemo(() => {
    return new THREE.Color(color).clone().offsetHSL(0.3, 0, 0).getStyle();
  }, [color]);

  const boxColor = useMemo(() => {
    return new THREE.Color(color).clone().offsetHSL(-0.3, 0, 0).getStyle();
  }, [color]);

  // Particle explosion state stored in a Ref to avoid state-update thrashing in useFrame
  const particlesRef = useRef<Particle[]>([]);
  const particlesGeomRef = useRef<THREE.BufferGeometry>(null);

  // Handle particle explosion on click
  const triggerExplosion = (center: THREE.Vector3, colorHex: string, mode: string = 'explode') => {
    const newParticles: Particle[] = [];
    const colorVal = new THREE.Color(colorHex);
    
    for (let i = 0; i < 90; i++) {
      if (mode === 'explode') {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const speed = 2.5 + Math.random() * 4.5;
        
        const vel = new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta) * speed,
          Math.sin(phi) * Math.sin(theta) * speed,
          Math.cos(phi) * speed
        );

        newParticles.push({
          pos: new THREE.Vector3().copy(center),
          vel,
          color: colorVal,
          size: 0.05 + Math.random() * 0.08,
          life: 1.0,
          mode,
        });
      } else if (mode === 'sink') {
        // Spawn particles in a sphere shell surrounding the core
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 2.8 + Math.random() * 1.6;
        const spawnPos = new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta) * radius,
          Math.sin(phi) * Math.sin(theta) * radius,
          Math.cos(phi) * radius
        ).add(center);
        
        // Velocity points towards center
        const speed = 1.8 + Math.random() * 2.2;
        const vel = new THREE.Vector3().copy(center).sub(spawnPos).normalize().multiplyScalar(speed);
        
        newParticles.push({
          pos: spawnPos,
          vel,
          color: colorVal,
          size: 0.04 + Math.random() * 0.06,
          life: 1.2,
          mode,
        });
      } else if (mode === 'vortex') {
        // Spawn in a flatter disc around the core
        const theta = Math.random() * Math.PI * 2;
        const radius = 1.6 + Math.random() * 2.4;
        const spawnPos = new THREE.Vector3(
          Math.cos(theta) * radius,
          (Math.random() - 0.5) * 0.8, // slight vertical spread
          Math.sin(theta) * radius
        ).add(center);
        
        const angularSpeed = 1.8 + Math.random() * 2.8; // speed of rotation
        const verticalDrift = (Math.random() - 0.5) * 0.8;
        
        newParticles.push({
          pos: spawnPos,
          vel: new THREE.Vector3(verticalDrift, angularSpeed, 0), // store custom parameters: x = vertical drift, y = angular speed
          color: colorVal,
          size: 0.05 + Math.random() * 0.06,
          life: 1.6, // vortex lasts longer
          mode,
          initialDist: radius,
          angleOffset: theta,
        });
      }
    }
    
    // Append particles up to a maximum of 400
    particlesRef.current = [...particlesRef.current, ...newParticles].slice(-400);
  };

  useEffect(() => {
    const handleSetShape = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setShape(customEvent.detail);
    };
    const handleSetColor = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setColor(customEvent.detail);
    };
    const handleSetPhysics = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setPhysicsMode(customEvent.detail);
    };
    const handleQuantumBurst = (e: Event) => {
      const customEvent = e as CustomEvent<{ color: string; mode: string }>;
      const pos = knotRef.current?.position || new THREE.Vector3(-22, 5, 0);
      const detail = customEvent.detail || { color: '#00f5ff', mode: 'explode' };
      triggerExplosion(pos, detail.color, detail.mode);
    };

    window.addEventListener('sandbox-set-shape', handleSetShape);
    window.addEventListener('sandbox-set-color', handleSetColor);
    window.addEventListener('sandbox-set-physics', handleSetPhysics);
    window.addEventListener('trigger-quantum-burst', handleQuantumBurst);

    return () => {
      window.removeEventListener('sandbox-set-shape', handleSetShape);
      window.removeEventListener('sandbox-set-color', handleSetColor);
      window.removeEventListener('sandbox-set-physics', handleSetPhysics);
      window.removeEventListener('trigger-quantum-burst', handleQuantumBurst);
    };
  }, []);

  useFrame((state, delta) => {
    if (activeSection !== 5 && activeSection !== 4 && activeSection !== 6) return;

    const t = state.clock.getElapsedTime();
    const center = knotRef.current?.position || new THREE.Vector3(-22, 5, 0);

    // 1. Rotate the central custom shape
    if (knotRef.current) {
      const speedFactor = hoveredKnot ? 1.6 : 0.45;
      knotRef.current.rotation.x += speedFactor * delta;
      knotRef.current.rotation.y += speedFactor * 0.7 * delta;
      
      // Floating motion
      knotRef.current.position.y = 5 + Math.sin(t * 1.5) * 0.25;
    }

    // 2. Rotate and float surrounding shapes
    if (sphereRef.current) {
      sphereRef.current.position.set(
        -25 + Math.cos(t) * 2.5,
        5.5 + Math.sin(t * 2) * 0.3,
        Math.sin(t) * 2.5
      );
      sphereRef.current.rotation.y += 0.5 * delta;
    }

    if (boxRef.current) {
      boxRef.current.position.set(
        -19 + Math.sin(t * 0.8) * 2.5,
        4.5 + Math.cos(t * 1.2) * 0.3,
        Math.cos(t * 0.8) * 2.5
      );
      boxRef.current.rotation.x += 0.4 * delta;
      boxRef.current.rotation.z += 0.3 * delta;
    }

    // 3. Update active explosion particles in-place on pre-allocated buffers
    const geom = particlesGeomRef.current;
    if (geom) {
      const posAttr = geom.getAttribute('position') as THREE.BufferAttribute;
      const colAttr = geom.getAttribute('color') as THREE.BufferAttribute;

      if (posAttr && colAttr) {
        const posArray = posAttr.array as Float32Array;
        const colArray = colAttr.array as Float32Array;

        const updatedParticles: Particle[] = [];
        
        particlesRef.current.forEach((p) => {
          if (p.mode === 'explode') {
            // Apply velocity and drag
            p.pos.addScaledVector(p.vel, delta);
            p.vel.multiplyScalar(0.94); // drag friction
            p.life -= delta * 1.2; // decay life
          } else if (p.mode === 'sink') {
            // Gravity sink (pulled towards core center)
            const dir = new THREE.Vector3().copy(center).sub(p.pos);
            const dist = dir.length();
            
            if (dist < 0.15) {
              p.life = 0; // consumed by core
            } else {
              // Accelerate slightly as it gets closer
              const accel = Math.min(10, 2.5 / (dist * dist));
              p.vel.addScaledVector(dir.normalize(), accel * delta);
              p.pos.addScaledVector(p.vel, delta);
              p.life -= delta * 0.9;
            }
          } else if (p.mode === 'vortex') {
            // Swirling vortex physics
            p.angleOffset = (p.angleOffset || 0) + p.vel.y * delta;
            p.initialDist = (p.initialDist || 2.0) * (1 - 0.22 * delta); // spiral inwards
            
            if (p.initialDist < 0.18) {
              p.life = 0; // consumed
            } else {
              p.pos.x = center.x + Math.cos(p.angleOffset) * p.initialDist;
              p.pos.z = center.z + Math.sin(p.angleOffset) * p.initialDist;
              p.pos.y += p.vel.x * delta; // vertical drift
              p.life -= delta * 0.65;
            }
          }

          if (p.life > 0) {
            updatedParticles.push(p);
          }
        });

        particlesRef.current = updatedParticles;

        // Reset buffer arrays to black/zero to clear dead particles
        posArray.fill(0);
        colArray.fill(0);

        // Fill values into the pre-allocated buffer arrays
        updatedParticles.forEach((p, idx) => {
          if (idx < 400) {
            posArray[idx * 3] = p.pos.x;
            posArray[idx * 3 + 1] = p.pos.y;
            posArray[idx * 3 + 2] = p.pos.z;

            colArray[idx * 3] = p.color.r * p.life;
            colArray[idx * 3 + 1] = p.color.g * p.life;
            colArray[idx * 3 + 2] = p.color.b * p.life;
          }
        });

        // Set needsUpdate to true to let WebGL upload the modified buffer to GPU
        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;

        // Set draw range so WebGL only renders the active count of particles
        geom.setDrawRange(0, Math.min(updatedParticles.length, 400));
        geom.computeBoundingSphere();
      }
    }
  });

  const isVisible = activeSection === 5 || activeSection === 4 || activeSection === 6;

  return (
    <group visible={isVisible}>
      {/* 1. Central Interactive Custom Mesh */}
      <mesh
        ref={knotRef}
        position={[-22, 5, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredKnot(true);
          setCursorType('hover');
        }}
        onPointerOut={() => {
          setHoveredKnot(false);
          setCursorType('default');
        }}
        onClick={(e) => {
          e.stopPropagation();
          const pos = knotRef.current?.position || new THREE.Vector3(-22, 5, 0);
          triggerExplosion(pos, color, physicsMode);
        }}
      >
        {shape === 'torusKnot' && <torusKnotGeometry args={[0.65, 0.22, 100, 16]} />}
        {shape === 'icosahedron' && <icosahedronGeometry args={[0.8, 1]} />}
        {shape === 'octahedron' && <octahedronGeometry args={[0.9, 0]} />}
        {shape === 'torus' && <torusGeometry args={[0.7, 0.25, 16, 100]} />}
        
        <meshStandardMaterial
          color={color}
          roughness={0.1}
          metalness={0.9}
          emissive={color}
          emissiveIntensity={hoveredKnot ? 0.95 : 0.25}
        />
      </mesh>

      {/* 2. Surrounding Sphere */}
      <mesh
        ref={sphereRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredSphere(true);
          setCursorType('hover');
        }}
        onPointerOut={() => {
          setHoveredSphere(false);
          setCursorType('default');
        }}
        onClick={(e) => {
          e.stopPropagation();
          const pos = sphereRef.current?.position || new THREE.Vector3(-25, 5.5, 0);
          triggerExplosion(pos, sphereColor, physicsMode);
        }}
      >
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial
          color={sphereColor}
          roughness={0.2}
          metalness={0.8}
          emissive={sphereColor}
          emissiveIntensity={hoveredSphere ? 0.8 : 0.15}
        />
      </mesh>

      {/* 3. Surrounding Box */}
      <mesh
        ref={boxRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredBox(true);
          setCursorType('hover');
        }}
        onPointerOut={() => {
          setHoveredBox(false);
          setCursorType('default');
        }}
        onClick={(e) => {
          e.stopPropagation();
          const pos = boxRef.current?.position || new THREE.Vector3(-19, 4.5, 0);
          triggerExplosion(pos, boxColor, physicsMode);
        }}
      >
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial
          color={boxColor}
          roughness={0.1}
          metalness={0.9}
          emissive={boxColor}
          emissiveIntensity={hoveredBox ? 0.8 : 0.15}
        />
      </mesh>

      {/* Explosion Particles (always mounted with pre-allocated buffer arrays) */}
      <points>
        <bufferGeometry ref={particlesGeomRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(400 * 3), 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[new Float32Array(400 * 3), 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};
export default PlaygroundScene;
