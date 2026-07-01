import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useApp } from '../context/AppContext';

interface MoonConfig {
  name: string;
  color: string;
  dist: number;
  speed: number;
  size: number;
}

interface PlanetProps {
  name: string;
  radius: number;
  speed: number;
  size: number;
  color: string;
  angleOffset: number;
  moons?: MoonConfig[];
}

const Planet: React.FC<PlanetProps> = ({ name, radius, speed, size, color, angleOffset, moons = [] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const moonsRefs = useRef<THREE.Group[]>([]);
  
  const { activeSection, zoomedPlanet, setZoomedPlanet, setCursorType } = useApp();
  const [hovered, setHovered] = useState(false);

  // Orbit inclination tilt (e.g. up to 20 degrees tilt)
  const tiltX = 0.35 * Math.sin(angleOffset);
  const tiltZ = 0.35 * Math.cos(angleOffset);
  const euler = useMemo(() => new THREE.Euler(tiltX, 0, tiltZ, 'XYZ'), [tiltX, tiltZ]);

  const isZoomed = zoomedPlanet === name;
  const isAnyPlanetZoomed = zoomedPlanet !== null;

  // Track and lerp opacity for cinematic focus
  const opacityRef = useRef(1.0);
  const targetOpacity = isAnyPlanetZoomed ? (isZoomed ? 1.0 : 0.12) : 1.0;

  // Orbit rotation, bobbing, and planet self-rotation
  useFrame((state, delta) => {
    if (activeSection !== 2 && activeSection !== 3) return;
    const t = state.clock.getElapsedTime();
    const orbitTime = t * speed + angleOffset;
    
    // Lerp opacity smoothly
    const lerpedOpacity = THREE.MathUtils.lerp(opacityRef.current, targetOpacity, 1 - Math.exp(-6 * delta));
    opacityRef.current = lerpedOpacity;

    if (groupRef.current && !isZoomed) {
      // Revolve around sun on tilted orbital plane with dynamic vertical floating
      const x = Math.cos(orbitTime) * radius;
      const y = Math.sin(t * 1.5 + angleOffset * 2.0) * 0.22; // Organic floating bobbing motion
      const z = Math.sin(orbitTime) * radius;
      
      const pos = new THREE.Vector3(x, y, z);
      pos.applyEuler(euler);
      
      groupRef.current.position.copy(pos);
    }

    if (meshRef.current) {
      // Self rotate
      meshRef.current.rotation.y += 0.8 * delta;
      
      // Keep opacity updated dynamically
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.transparent = true;
        mat.opacity = lerpedOpacity;
      }
    }

    if (ringRef.current) {
      // Rotate planet rings
      ringRef.current.rotation.z += 0.5 * delta;
      
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.transparent = true;
        mat.opacity = (hovered || isZoomed ? 0.8 : 0.3) * lerpedOpacity;
      }
    }

    // Rotate moons and update their opacity
    moons.forEach((moon, idx) => {
      const moonGroup = moonsRefs.current[idx];
      if (moonGroup) {
        const moonTime = t * moon.speed + idx * (Math.PI / 2);
        moonGroup.position.x = Math.cos(moonTime) * moon.dist;
        moonGroup.position.z = Math.sin(moonTime) * moon.dist;
        moonGroup.position.y = Math.sin(moonTime * 0.5) * 0.15; // subtle tilt

        moonGroup.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            const mat = child.material as THREE.MeshStandardMaterial;
            if (mat) {
              mat.transparent = true;
              mat.opacity = lerpedOpacity;
            }
          }
        });
      }
    });
  });

  return (
    <group ref={groupRef} name={`planet-${name}`}>
      {/* 1. The Planet Sphere */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          setCursorType('hover');
        }}
        onPointerOut={() => {
          setHovered(false);
          setCursorType('default');
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (isZoomed) {
            setZoomedPlanet(null);
          } else {
            setZoomedPlanet(name);
          }
        }}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.2}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={hovered || isZoomed ? 0.9 : 0.25}
        />
      </mesh>

      {/* 2. Saturn-like Ring */}
      {(hovered || isZoomed || name === 'C' || name === 'Artificial Intelligence') && (
        <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
          <ringGeometry args={[size * 1.3, size * 1.7, 32]} />
          <meshBasicMaterial
            color={color}
            side={THREE.DoubleSide}
            transparent
            opacity={hovered || isZoomed ? 0.8 : 0.3}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* 3. Small Orbiting Moons */}
      {moons.map((moon, idx) => (
        <group
          key={moon.name}
          ref={(el) => {
            if (el) moonsRefs.current[idx] = el;
          }}
        >
          <mesh>
            <sphereGeometry args={[moon.size, 16, 16]} />
            <meshStandardMaterial
              color={moon.color}
              emissive={moon.color}
              emissiveIntensity={0.6}
            />
          </mesh>
          {/* Moon label on hover */}
          {(hovered || isZoomed) && (
            <Html distanceFactor={8} position={[0, moon.size + 0.15, 0]} center className="pointer-events-none select-none">
              <span className="text-[6px] tracking-wider font-mono text-white/50 bg-black/60 px-1 py-0.5 rounded border border-white/5 whitespace-nowrap">
                {moon.name}
              </span>
            </Html>
          )}
        </group>
      ))}

      {/* 4. Planet Label */}
      {activeSection === 2 && (
        <Html
          position={[0, size + 0.45, 0]}
          center
          distanceFactor={8}
          className="pointer-events-none select-none font-space-grotesk"
        >
          <div
            className={`px-3 py-1 rounded-md text-[10px] tracking-widest font-bold border transition-all duration-300 ${
              isZoomed
                ? 'bg-highlight-cyan/25 border-highlight-cyan text-[#00f5ff] text-glow-cyan'
                : hovered
                ? 'bg-accent-blue/20 border-accent-blue/50 text-white'
                : 'bg-black/80 border-white/10 text-white/60'
            }`}
            style={{ 
              whiteSpace: 'nowrap',
              opacity: isAnyPlanetZoomed ? (isZoomed ? 1.0 : 0.0) : 1.0,
              pointerEvents: isAnyPlanetZoomed && !isZoomed ? 'none' : 'auto'
            }}
          >
            {name.toUpperCase()}
          </div>
        </Html>
      )}
    </group>
  );
};

export const SkillsUniverse: React.FC = () => {
  const { activeSection, zoomedPlanet, setZoomedPlanet } = useApp();

  const sunCoronaRef = useRef<THREE.Mesh>(null);
  const starsRef = useRef<THREE.Points>(null);
  const orbitsGroupRef = useRef<THREE.Group>(null);
  const asteroidsRef = useRef<THREE.Points>(null);
  const constellationsRef = useRef<THREE.LineSegments>(null);
  const constellationStarsRef = useRef<THREE.Points>(null);

  const skills = useMemo<PlanetProps[]>(() => [
    { name: 'HTML', radius: 3.3, speed: 0.45, size: 0.24, color: '#ff5252', angleOffset: 0 },
    { name: 'CSS', radius: 4.4, speed: 0.38, size: 0.25, color: '#32ff7e', angleOffset: 1 },
    {
      name: 'JavaScript',
      radius: 5.5,
      speed: 0.32,
      size: 0.27,
      color: '#fffa65',
      angleOffset: 2,
      moons: [
        { name: 'TypeScript', color: '#3178c6', dist: 0.65, speed: 2.2, size: 0.08 }
      ]
    },
    {
      name: 'C',
      radius: 6.8,
      speed: 0.26,
      size: 0.34,
      color: '#18dcff',
      angleOffset: 3,
      moons: [
        { name: 'Pointers', color: '#ffffff', dist: 0.7, speed: 2.0, size: 0.09 },
        { name: 'GCC', color: '#ff4d4d', dist: 0.95, speed: 1.5, size: 0.07 },
        { name: 'Makefiles', color: '#fffa65', dist: 1.2, speed: 1.1, size: 0.07 }
      ]
    },
    { name: 'Tailwind CSS', radius: 8.0, speed: 0.22, size: 0.27, color: '#7efff5', angleOffset: 4 },
    { name: 'Java', radius: 9.1, speed: 0.18, size: 0.30, color: '#ff9f40', angleOffset: 5 },
    { name: 'Python', radius: 10.2, speed: 0.15, size: 0.32, color: '#05c46b', angleOffset: 6 },
    { name: 'Git', radius: 11.3, speed: 0.13, size: 0.24, color: '#ff4d4d', angleOffset: 7 },
    {
      name: 'Artificial Intelligence',
      radius: 12.6,
      speed: 0.10,
      size: 0.38,
      color: '#7d5fff',
      angleOffset: 8,
      moons: [
        { name: 'PyTorch', color: '#ff3f34', dist: 0.9, speed: 1.8, size: 0.09 },
        { name: 'TensorFlow', color: '#ffa801', dist: 1.25, speed: 1.1, size: 0.08 }
      ]
    },
    { name: 'Machine Learning', radius: 13.8, speed: 0.08, size: 0.35, color: '#ff3385', angleOffset: 9 },
  ], []);

  // Generate starry universe background
  const starsCount = 1200;
  const [starPositions, starColors] = useMemo(() => {
    const positions = new Float32Array(starsCount * 3);
    const colors = new Float32Array(starsCount * 3);
    const colorPalette = [
      new THREE.Color('#0055ff'),
      new THREE.Color('#8b5cf6'),
      new THREE.Color('#00f5ff'),
      new THREE.Color('#ffffff'),
      new THREE.Color('#ff7700'),
    ];
    for (let i = 0; i < starsCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const dist = 16 + Math.random() * 32; // shell distance

      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * dist;
      positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * dist;
      positions[i * 3 + 2] = Math.cos(phi) * dist;

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return [positions, colors];
  }, []);

  // Generate asteroid belt particles
  const asteroidCount = 1000;
  const asteroidPositions = useMemo(() => {
    const positions = new Float32Array(asteroidCount * 3);
    const innerRad = 11.2;
    const outerRad = 11.9;
    
    for (let i = 0; i < asteroidCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = innerRad + Math.random() * (outerRad - innerRad);
      
      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.35; // height variation
      positions[i * 3 + 2] = Math.sin(theta) * radius;
    }
    return positions;
  }, []);

  // Generate constellation nodes and line segments in the background
  const [constellationPositions, constellationIndices] = useMemo(() => {
    const nodeCount = 55;
    const positions: THREE.Vector3[] = [];
    const indices: number[] = [];
    const shellRadius = 20.0; // Outer sphere shell

    for (let i = 0; i < nodeCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = Math.sin(phi) * Math.cos(theta) * shellRadius;
      const y = Math.sin(phi) * Math.sin(theta) * shellRadius;
      const z = Math.cos(phi) * shellRadius;
      positions.push(new THREE.Vector3(x, y, z));
    }

    // Connect close neighbors
    for (let i = 0; i < nodeCount; i++) {
      let connections = 0;
      const distances = positions.map((p, idx) => ({ idx, dist: p.distanceTo(positions[i]) }));
      distances.sort((a, b) => a.dist - b.dist);

      for (let j = 1; j < 4; j++) {
        if (distances[j] && distances[j].dist < 11.0 && connections < 2) {
          indices.push(i, distances[j].idx);
          connections++;
        }
      }
    }

    const flatPositions = new Float32Array(nodeCount * 3);
    positions.forEach((p, i) => {
      flatPositions[i * 3] = p.x;
      flatPositions[i * 3 + 1] = p.y;
      flatPositions[i * 3 + 2] = p.z;
    });

    return [flatPositions, new Uint16Array(indices)];
  }, []);

  useFrame((state, delta) => {
    if (activeSection !== 2 && activeSection !== 3) return;

    const t = state.clock.getElapsedTime();
    const isAnyPlanetZoomed = activeSection === 2 && zoomedPlanet !== null;

    // Rotate and pulse Sun Corona (breathing animation for the celestial star)
    if (sunCoronaRef.current) {
      sunCoronaRef.current.rotation.z -= 0.2 * delta;
      
      const pulseScale = 1.0 + Math.sin(t * 1.8) * 0.06;
      sunCoronaRef.current.scale.set(pulseScale, pulseScale, 1.0);
    }

    // Slow rotate starfield universe
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.012 * delta;
    }

    // Slow rotate asteroid belt and fade opacity under zoom
    if (asteroidsRef.current) {
      asteroidsRef.current.rotation.y += 0.025 * delta;
      
      const mat = asteroidsRef.current.material as THREE.PointsMaterial;
      if (mat) {
        const targetAstOpacity = isAnyPlanetZoomed ? 0.08 : 0.55;
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetAstOpacity, 1 - Math.exp(-5 * delta));
      }
    }

    // Slow rotate constellations and fade opacity under zoom
    if (constellationsRef.current) {
      constellationsRef.current.rotation.y += 0.012 * delta;
      const mat = constellationsRef.current.material as THREE.LineBasicMaterial;
      if (mat) {
        const targetConstOpacity = isAnyPlanetZoomed ? 0.02 : 0.16;
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetConstOpacity, 1 - Math.exp(-5 * delta));
      }
    }
    if (constellationStarsRef.current) {
      constellationStarsRef.current.rotation.y += 0.012 * delta;
      const mat = constellationStarsRef.current.material as THREE.PointsMaterial;
      if (mat) {
        const targetConstStarsOpacity = isAnyPlanetZoomed ? 0.1 : 0.65;
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetConstStarsOpacity, 1 - Math.exp(-5 * delta));
      }
    }

    // Fade and pulse orbit line opacities based on zoom focus
    if (orbitsGroupRef.current) {
      orbitsGroupRef.current.children.forEach((child, idx) => {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshBasicMaterial;
        if (mat) {
          const s = skills[idx];
          const isThisOrbitZoomed = s && s.name === zoomedPlanet;
          
          let baseOpacity = 0.08;
          if (isAnyPlanetZoomed) {
            baseOpacity = isThisOrbitZoomed ? 0.25 : 0.01;
          }
          
          const pulse = Math.sin(t * 1.5) * (isAnyPlanetZoomed ? 0.005 : 0.02);
          mat.opacity = THREE.MathUtils.lerp(mat.opacity, baseOpacity + pulse, 1 - Math.exp(-5 * delta));
        }
      });
    }
  });

  const isVisible = activeSection === 2 || activeSection === 3;

  return (
    <group
      visible={isVisible}
      position={[0, 0, 0]}
      onClick={() => {
        setZoomedPlanet(null);
      }}
    >
      {/* 1. Starry Universe Background */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[starPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[starColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={0.7}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 2. Constellation Lines */}
      <lineSegments ref={constellationsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[constellationPositions, 3]}
          />
          <bufferAttribute
            attach="index"
            args={[constellationIndices, 1]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#0055ff"
          transparent
          opacity={0.16}
          linewidth={1}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* 3. Constellation Node Stars */}
      <points ref={constellationStarsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[constellationPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.14}
          color="#00f5ff"
          transparent
          opacity={0.65}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 4. Grid Floor */}
      <gridHelper args={[34, 34, '#0055ff', '#112244']} position={[0, -0.05, 0]}>
        <lineBasicMaterial attach="material" transparent opacity={0.12} />
      </gridHelper>

      {/* 5. Central Glowing Sun Corona & Flares (Core body rendered by AICore) */}
      <group position={[0, 0, 0]}>
        {/* Glowing Sun Corona Aura Ring */}
        <mesh ref={sunCoronaRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.32, 1.75, 64]} />
          <meshBasicMaterial
            color="#ff007f" // Hot Magenta corona glow
            side={THREE.DoubleSide}
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Orbit Corona Flare Rings */}
        <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <ringGeometry args={[1.35, 1.55, 64]} />
          <meshBasicMaterial
            color="#00f5ff" // Electric Cyan flare
            side={THREE.DoubleSide}
            transparent
            opacity={0.18}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* 6. Orbit lines (Color-coordinated with planets) */}
      <group ref={orbitsGroupRef}>
        {skills.map((s, idx) => {
          const tiltX = 0.35 * Math.sin(s.angleOffset);
          const tiltZ = 0.35 * Math.cos(s.angleOffset);
          
          return (
            <mesh key={`orbit-${idx}`} rotation={[Math.PI / 2 + tiltX, 0, tiltZ]}>
              <ringGeometry args={[s.radius - 0.015, s.radius + 0.015, 64]} />
              <meshBasicMaterial
                color={s.color} // Dynamic color matching the planet
                transparent
                opacity={0.08}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          );
        })}
      </group>

      {/* 7. Orbiting Asteroid Belt */}
      <points ref={asteroidsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[asteroidPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.055}
          color="#8ca5cf"
          transparent
          opacity={0.55}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 8. Render Planets */}
      {skills.map((s) => (
        <Planet
          key={s.name}
          name={s.name}
          radius={s.radius}
          speed={s.speed}
          size={s.size}
          color={s.color}
          angleOffset={s.angleOffset}
          moons={s.moons}
        />
      ))}
    </group>
  );
};
export default SkillsUniverse;

