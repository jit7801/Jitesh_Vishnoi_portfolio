import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useApp } from '../context/AppContext';
import { CameraController } from './CameraController';
import { AICore } from './AICore';
import { DigitalCity } from './DigitalCity';
import { SkillsUniverse } from './SkillsUniverse';
import { ProjectCubes } from './ProjectCubes';
import { JourneyPath } from './JourneyPath';
import { PlaygroundScene } from './PlaygroundScene';

// Internal component to manage scene-wide lighting and fog dynamically
const SceneEffects: React.FC = () => {
  const { activeSection } = useApp();
  
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const dirLightRef = useRef<THREE.DirectionalLight>(null);

  // Targets based on active section
  const targetAmbientIntensity = activeSection === 6 ? 0.8 : 0.25;
  const targetAmbientColor = new THREE.Color(activeSection === 6 ? '#201030' : '#0a0d1a');
  
  const targetDirIntensity = activeSection === 6 ? 2.5 : 0.2;
  const targetDirColor = new THREE.Color(activeSection === 6 ? '#ff7700' : '#0055ff');
  const targetDirPos = new THREE.Vector3(
    activeSection === 6 ? 0 : 5,
    activeSection === 6 ? 4 : 5,
    activeSection === 6 ? -12 : 5
  );

  const targetFogColor = new THREE.Color(activeSection === 6 ? '#160825' : '#080808');

  useFrame((state, delta) => {
    const lerpFactor = 1 - Math.exp(-3 * delta);

    // 1. Smoothly transition ambient light
    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = THREE.MathUtils.lerp(
        ambientLightRef.current.intensity,
        targetAmbientIntensity,
        lerpFactor
      );
      ambientLightRef.current.color.lerp(targetAmbientColor, lerpFactor);
    }

    // 2. Smoothly transition directional light
    if (dirLightRef.current) {
      dirLightRef.current.intensity = THREE.MathUtils.lerp(
        dirLightRef.current.intensity,
        targetDirIntensity,
        lerpFactor
      );
      dirLightRef.current.color.lerp(targetDirColor, lerpFactor);
      dirLightRef.current.position.lerp(targetDirPos, lerpFactor);
    }

    // 3. Smoothly transition fog color
    if (state.scene.fog && state.scene.fog instanceof THREE.Fog) {
      state.scene.fog.color.lerp(targetFogColor, lerpFactor);
    }
  });

  return (
    <>
      <ambientLight ref={ambientLightRef} intensity={0.25} color="#0a0d1a" />
      <directionalLight
        ref={dirLightRef}
        position={[5, 5, 5]}
        intensity={0.2}
        color="#0055ff"
      />
      <fog attach="fog" args={['#080808', 5, 42]} />
    </>
  );
};

export const SceneContainer: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[#080808] overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 45, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        dpr={[1, 1.5]} // limit pixel ratio for performance
      >
        {/* Dynamic Scene Lighting & Fog */}
        <SceneEffects />

        {/* Camera Rigging */}
        <CameraController />

        {/* Chapter 3D components */}
        <AICore />
        <DigitalCity />
        <SkillsUniverse />
        <ProjectCubes />
        <JourneyPath />
        <PlaygroundScene />
      </Canvas>
    </div>
  );
};
export default SceneContainer;
