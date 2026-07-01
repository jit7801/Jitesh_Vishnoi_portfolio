import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useApp } from '../context/AppContext';

// Define camera positions and look-at targets for each section
const SCENE_CONFIGS = [
  { // 0: Hero
    cam: new THREE.Vector3(0, 0, 10),
    target: new THREE.Vector3(0, 0, 0),
  },
  { // 1: Story (City)
    cam: new THREE.Vector3(0, -15, 12),
    target: new THREE.Vector3(0, -18, 0),
  },
  { // 2: Skills (Solar System)
    cam: new THREE.Vector3(0, 12, 18),
    target: new THREE.Vector3(0, 0, 0),
  },
  { // 3: Projects (Cubes)
    cam: new THREE.Vector3(22, 0, 14),
    target: new THREE.Vector3(22, 0, 0),
  },
  { // 4: Journey (Timeline Path)
    cam: new THREE.Vector3(0, -38, 16),
    target: new THREE.Vector3(0, -42, -5),
  },
  { // 5: Playground (Sandbox)
    cam: new THREE.Vector3(-22, 5, 12),
    target: new THREE.Vector3(-22, 5, 0),
  },
  { // 6: Contact (Sunrise)
    cam: new THREE.Vector3(0, 0, 9),
    target: new THREE.Vector3(0, 1, 0),
  },
];

export const CameraController: React.FC = () => {
  const { camera } = useThree();
  const { activeSection, zoomedPlanet, zoomedProject } = useApp();
  
  // Refs to track mouse position for parallax
  const mouse = useRef({ x: 0, y: 0 });
  const currentCam = useRef(new THREE.Vector3().copy(SCENE_CONFIGS[0].cam));
  const currentTarget = useRef(new THREE.Vector3().copy(SCENE_CONFIGS[0].target));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse to -0.5 to 0.5
      mouse.current.x = (e.clientX / window.innerWidth) - 0.5;
      mouse.current.y = (e.clientY / window.innerHeight) - 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    let targetCam = new THREE.Vector3();
    let targetLook = new THREE.Vector3();

    // 1. Determine base camera position based on scroll / activeSection
    const config = SCENE_CONFIGS[activeSection] || SCENE_CONFIGS[0];
    targetCam.copy(config.cam);
    targetLook.copy(config.target);

    // 2. Handle Zoom Overrides for interactive states
    if (activeSection === 2 && zoomedPlanet) {
      // Zooming in on a planet in the Solar System
      // Find the planet mesh in the scene to get its position
      const planetMesh = state.scene.getObjectByName(`planet-${zoomedPlanet}`);
      if (planetMesh) {
        const planetPos = new THREE.Vector3();
        planetMesh.getWorldPosition(planetPos);
        
        // Position camera slightly offset from the planet
        targetCam.copy(planetPos).add(new THREE.Vector3(0, 1.5, 3.5));
        targetLook.copy(planetPos);
      }
    } else if (activeSection === 3 && zoomedProject !== null) {
      // Zooming in on a holographic project cube
      const cubeMesh = state.scene.getObjectByName(`project-cube-${zoomedProject}`);
      if (cubeMesh) {
        const cubePos = new THREE.Vector3();
        cubeMesh.getWorldPosition(cubePos);
        
        targetCam.copy(cubePos).add(new THREE.Vector3(0, 0, 4));
        targetLook.copy(cubePos);
      }
    }

    // 3. Add Cursor Parallax (subtle swaying, disabled during zooms for precision)
    const isZoomed = (activeSection === 2 && zoomedPlanet) || (activeSection === 3 && zoomedProject !== null);
    if (!isZoomed) {
      // Sway camera slightly based on mouse position
      const parallaxFactor = 1.2;
      targetCam.x += mouse.current.x * parallaxFactor;
      targetCam.y -= mouse.current.y * parallaxFactor;
    }

    // 4. Smoothly interpolate (lerp) camera position and look-at target
    // We use a frame-rate independent lerp (exponential decay)
    const lerpFactor = 1 - Math.exp(-4 * delta); // approx 4 units per second
    
    currentCam.current.lerp(targetCam, lerpFactor);
    currentTarget.current.lerp(targetLook, lerpFactor);

    // Apply to camera
    camera.position.copy(currentCam.current);
    camera.lookAt(currentTarget.current);
  });

  return null;
};
