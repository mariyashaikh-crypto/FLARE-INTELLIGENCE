import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import {
  createEarthDayTexture,
  createEarthCloudsTexture,
  createEarthNightTexture
} from '../../utils/earthTextures.js';

// Atmospheric Glow Vertex & Fragment Shaders
const AtmosphereShader = {
  vertexShader: `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
      gl_FragColor = vec4(0.0, 0.85, 1.0, 1.0) * intensity * 1.6;
    }
  `
};

/**
 * ISS & Microgravity Orbit Ring and Marker
 */
function OrbitalSystem({
  radius = 2.45,
  inclination = 51.6 * (Math.PI / 180),
  color = '#00f0ff',
  name = 'ISS',
  speed = 0.25
}) {
  const markerRef = useRef();

  // Create smooth circular orbit line
  const orbitPoints = useMemo(() => {
    const pts = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
    }
    return pts;
  }, [radius]);

  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(orbitPoints);
  }, [orbitPoints]);

  useFrame(({ clock }) => {
    if (markerRef.current) {
      const t = clock.getElapsedTime() * speed;
      markerRef.current.position.x = Math.cos(t) * radius;
      markerRef.current.position.z = Math.sin(t) * radius;
    }
  });

  return (
    <group rotation={[inclination, 0, 0.2]}>
      {/* Orbit Trajectory Line */}
      <line geometry={lineGeometry}>
        <lineBasicMaterial color={color} transparent opacity={0.35} />
      </line>

      {/* Orbiting Platform Marker (ISS or Cygnus) */}
      <group ref={markerRef}>
        {/* Core satellite dot */}
        <mesh>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial color={color} />
        </mesh>
        {/* Pulsing beacon glow */}
        <mesh>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.4} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Earth Globe with Clouds, Night Lights, and Atmospheric Halo
 */
function EarthGlobe() {
  const earthRef = useRef();
  const cloudsRef = useRef();

  // Generate procedural textures once
  const dayTexture = useMemo(() => createEarthDayTexture(2048, 1024), []);
  const cloudsTexture = useMemo(() => createEarthCloudsTexture(2048, 1024), []);
  const nightTexture = useMemo(() => createEarthNightTexture(2048, 1024), []);

  useFrame((_, delta) => {
    // Smooth natural axial rotation
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.05;
    }
    // Atmospheric clouds rotate independently and slightly faster
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.065;
    }
  });

  return (
    <group rotation={[0.41, 0, 0]}>
      {/* 1. Earth Core Sphere */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2.0, 64, 64]} />
        <meshStandardMaterial
          map={dayTexture}
          roughness={0.65}
          metalness={0.12}
          emissiveMap={nightTexture}
          emissive={new THREE.Color('#ffb040')}
          emissiveIntensity={0.85}
        />
      </mesh>

      {/* 2. Atmospheric Cloud Shell */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.025, 64, 64]} />
        <meshStandardMaterial
          map={cloudsTexture}
          transparent
          opacity={0.82}
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </mesh>

      {/* 3. Electric Cyan Atmospheric Glow Halo */}
      <mesh>
        <sphereGeometry args={[2.075, 48, 48]} />
        <shaderMaterial
          vertexShader={AtmosphereShader.vertexShader}
          fragmentShader={AtmosphereShader.fragmentShader}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          transparent
        />
      </mesh>

      {/* 4. ISS Orbit (BASS-II, FLEX, SPICE, E-FIELD) */}
      <OrbitalSystem
        radius={2.42}
        inclination={51.6 * (Math.PI / 180)}
        color="#00f0ff"
        name="ISS"
        speed={0.3}
      />

      {/* 5. Cygnus Flight Path (SAFFIRE-I) */}
      <OrbitalSystem
        radius={2.65}
        inclination={-38.5 * (Math.PI / 180)}
        color="#ff6b00"
        name="Cygnus"
        speed={0.18}
      />
    </group>
  );
}

/**
 * Main Interactive 3D Earth Component with OrbitControls
 */
export default function InteractiveEarth() {
  return (
    <div className="interactive-earth-container">
      <Canvas
        camera={{ position: [0, 0.8, 5.2], fov: 45 }}
        dpr={[1, 1.5]} // Clamped pixel ratio for optimal performance
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        {/* Lighting: Directional Sun + Ambient Light */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[6, 3, 5]} intensity={2.2} color="#ffffff" />
        <pointLight position={[-6, -2, -4]} intensity={0.25} color="#00f0ff" />

        {/* Deep Space Starfield */}
        <Stars
          radius={80}
          depth={40}
          count={2500}
          factor={4}
          saturation={0.1}
          fade
          speed={0.8}
        />

        {/* 3D Earth and Orbital Systems */}
        <EarthGlobe />

        {/* Interactive Mouse & Touch Orbit Controls */}
        <OrbitControls
          enableZoom={true}
          minDistance={3.2}
          maxDistance={7.5}
          enablePan={false}
          rotateSpeed={0.55}
          dampingFactor={0.05}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
