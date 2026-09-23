'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface FloatingRockProps {
  className?: string;
  size?: number;
}

export const FloatingRock: React.FC<FloatingRockProps> = ({
  className = '',
  size = 380,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || size;
    const height = container.clientHeight || size;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 3D Faceted Rock Geometry (Icosahedron with detail 1 creates ~80 architectural facets)
    const geometry = new THREE.IcosahedronGeometry(1.65, 1);

    // Deterministic vertex displacement to create an organic, craggy boulder shape
    const pos = geometry.attributes.position;
    const seed = 42;
    const pseudoRandom = (n: number) => {
      const x = Math.sin(n * seed) * 10000;
      return x - Math.floor(x);
    };

    for (let i = 0; i < pos.count; i++) {
      let vx = pos.getX(i);
      let vy = pos.getY(i);
      let vz = pos.getZ(i);

      // Asymmetric scaling: flatter base, elongated horizontal width, angular peak
      vx *= 1.25 + (pseudoRandom(i * 3 + 1) - 0.5) * 0.28;
      vy *= 0.85 + (pseudoRandom(i * 3 + 2) - 0.5) * 0.32;
      vz *= 0.95 + (pseudoRandom(i * 3 + 3) - 0.5) * 0.25;

      // Slight upward taper like a floating meteorite/sculpture
      if (vy > 0) {
        vx *= 0.92;
        vz *= 0.92;
      }

      pos.setXYZ(i, vx, vy, vz);
    }
    geometry.computeVertexNormals();

    // Sculptural Stone Material with flatShading for sharp facet definition
    const material = new THREE.MeshStandardMaterial({
      color: 0xc4c4c4,
      roughness: 0.86,
      metalness: 0.08,
      flatShading: true,
    });

    const rock = new THREE.Mesh(geometry, material);
    rock.rotation.set(-0.15, 0.4, 0.08);
    scene.add(rock);

    // Lighting setup matching museum-grade studio lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Key directional light casting sharp highlights across the top facets
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 5, 3.5);
    scene.add(keyLight);

    // Fill light softening the lower shadows
    const fillLight = new THREE.DirectionalLight(0x8c8c8c, 0.9);
    fillLight.position.set(-3.5, -2, 2.5);
    scene.add(fillLight);

    // Top rim light
    const topLight = new THREE.DirectionalLight(0xffffff, 1.4);
    topLight.position.set(0, 6, 1);
    scene.add(topLight);

    // Mouse movement listener for subtle interactive parallax
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = nx * 0.35;
      mouseRef.current.targetY = ny * 0.35;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || size;
      const h = container.clientHeight || size;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Gentle levitation float
      rock.position.y = Math.sin(elapsedTime * 1.3) * 0.09;
      rock.position.x = Math.cos(elapsedTime * 0.8) * 0.04;

      // Base rotation + subtle mouse parallax tilt
      rock.rotation.x = -0.15 + Math.sin(elapsedTime * 0.6) * 0.05 + mouseRef.current.y * 0.3;
      rock.rotation.y = 0.4 + elapsedTime * 0.08 + mouseRef.current.x * 0.4;
      rock.rotation.z = 0.08 + Math.sin(elapsedTime * 0.9) * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [size]);

  return (
    <div
      ref={containerRef}
      className={`relative select-none pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  );
};

export default FloatingRock;
