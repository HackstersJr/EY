import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, useGLTF } from '@react-three/drei';
import { Suspense, useRef, useState } from 'react';
import * as THREE from 'three';

// Simple non-interactive car model display
const CarModel = () => {
  const groupRef = useRef<THREE.Group>(null);
  const [autoRotate] = useState(true);

  // Load the Porsche 911 model
  const { scene } = useGLTF('/models/free_porsche_911_carrera_4s.glb');

  // Auto-rotate animation
  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  // Clone and enhance the scene
  const clonedScene = scene.clone();

  // Enhance materials for better visuals
  clonedScene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      if (mesh.material) {
        const material = mesh.material as THREE.MeshStandardMaterial;
        material.envMapIntensity = 1.5;
        material.metalness = Math.min((material.metalness || 0) * 1.2, 1);
        material.roughness = Math.max((material.roughness || 0.5) * 0.8, 0.1);
      }
    }
  });

  return (
    <group ref={groupRef}>
      <primitive
        object={clonedScene}
        scale={1.5}
        position={[0, -0.8, 0]}
      />
    </group>
  );
};

// Premium loading component
const LoadingFallback = () => {
  return (
    <mesh>
      <boxGeometry args={[2, 1, 1.5]} />
      <meshStandardMaterial color="#3b82f6" wireframe opacity={0.3} transparent />
    </mesh>
  );
};

export const CarViewer3D = () => {
  return (
    <div className="relative w-full h-[75vh] rounded-3xl overflow-hidden bg-gradient-to-b from-[#1a1d2e] via-[#252a3f] to-[#1a1d2e]">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-500 rounded-full filter blur-[150px]"></div>
      </div>

      <Canvas shadows className="relative z-10">
        <PerspectiveCamera makeDefault position={[5, 2, 8]} fov={50} />

        {/* Studio lighting setup */}
        <ambientLight intensity={0.5} />

        {/* Main key light */}
        <directionalLight
          position={[10, 15, 10]}
          intensity={2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />

        {/* Fill light */}
        <directionalLight position={[-5, 5, 5]} intensity={0.6} />

        {/* Rim light */}
        <spotLight position={[-5, 8, -8]} intensity={1.2} angle={0.4} penumbra={1} />

        {/* Environment for reflections */}
        <Environment preset="city" />

        {/* Car Model - purely visual, no interaction */}
        <Suspense fallback={<LoadingFallback />}>
          <CarModel />
        </Suspense>

        {/* Ground reflection shadow */}
        <ContactShadows
          position={[0, -0.79, 0]}
          opacity={0.75}
          scale={12}
          blur={2}
          far={3}
          resolution={512}
          color="#000000"
        />

        {/* Controls for drag/zoom only */}
        <OrbitControls
          enablePan={false}
          minDistance={5}
          maxDistance={15}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI / 2.5}
          autoRotate={false}
          enableDamping
          dampingFactor={0.08}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
};
