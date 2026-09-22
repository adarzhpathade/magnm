'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface OrbitalRingsProps {
  className?: string;
}

export function OrbitalRings({ className = '' }: OrbitalRingsProps) {
  const [mounted, setMounted] = useState(false);

  // Mouse parallax motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for fluid, premium lag
  const springConfig = { damping: 30, stiffness: 120 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Subtly tilt and translate the orbital system with mouse movement
  const parallaxX = useTransform(smoothX, [-1, 1], [-18, 18]);
  const parallaxY = useTransform(smoothY, [-1, 1], [-14, 14]);
  const rotateParallaxZ = useTransform(smoothX, [-1, 1], [-4, 4]);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      if (!innerWidth || !innerHeight) return;
      // Normalized coordinates from -1 to 1
      mouseX.set((e.clientX / innerWidth) * 2 - 1);
      mouseY.set((e.clientY / innerHeight) * 2 - 1);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center select-none ${className}`}
      aria-hidden="true"
    >
      {/* Parallax Container */}
      <motion.div
        style={{
          x: parallaxX,
          y: parallaxY,
          rotate: rotateParallaxZ,
        }}
        className="relative w-full h-full flex items-center justify-center [perspective:1400px]"
      >
        {/* Subtle Horizontal & Vertical Reticle Axes */}
        <div className="absolute inset-0 flex items-center justify-center opacity-40">
          {/* Horizontal Hairline */}
          <div className="w-[85vw] max-w-[1400px] h-[1px] bg-gradient-to-r from-transparent via-[#ffffff]/[0.08] to-transparent relative">
            <span className="absolute left-[15%] -top-2 font-['Martian_Mono',monospace] text-[0.55rem] tracking-[0.2em] text-[#555555]">
              AXIS // H-01
            </span>
            <span className="absolute right-[15%] -top-2 font-['Martian_Mono',monospace] text-[0.55rem] tracking-[0.2em] text-[#555555]">
              180°
            </span>
          </div>
          {/* Vertical Hairline */}
          <div className="absolute h-[75vh] max-h-[850px] w-[1px] bg-gradient-to-b from-transparent via-[#ffffff]/[0.06] to-transparent">
            <span className="absolute top-[8%] -left-3 font-['Martian_Mono',monospace] text-[0.55rem] tracking-[0.2em] text-[#555555] -rotate-90 origin-left">
              000°
            </span>
          </div>
        </div>

        {/* 3D Tilted Plane 1: Equatorial Orbital Ring System (matches wheel pitch ~54° X, -28° Z) */}
        <div
          className="absolute w-[980px] h-[980px] flex items-center justify-center"
          style={{
            transform: 'rotateX(56deg) rotateY(12deg) rotateZ(-28deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Outer Equatorial Orbit Track */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 110, repeat: Infinity, ease: 'linear' }}
            className="absolute w-[860px] h-[860px] rounded-full border border-white/[0.08] flex items-center justify-center"
          >
            {/* Dashed Inset Ring */}
            <div className="absolute w-[830px] h-[830px] rounded-full border border-dashed border-white/[0.05]" />

            {/* Orbiting Satellite Node A */}
            <div className="absolute -top-[4px] left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#cccccc] shadow-[0_0_8px_rgba(204,204,204,0.6)]" />
              <span className="font-['Martian_Mono',monospace] text-[0.52rem] text-[#666666] tracking-[0.15em]">
                NODE.α
              </span>
            </div>

            {/* Orbiting Satellite Node B (Opposite side) */}
            <div className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full border border-[#888888] bg-[#000000]" />
              <span className="font-['Martian_Mono',monospace] text-[0.5rem] text-[#555555] tracking-[0.1em]">
                ORBIT.01
              </span>
            </div>

            {/* Angular Tick Marks */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-[1px] bg-white/[0.2]" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-[1px] bg-white/[0.2]" />
          </motion.div>

          {/* Inner Equatorial Orbit Track (Closely framing the wheel) */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 75, repeat: Infinity, ease: 'linear' }}
            className="absolute w-[620px] h-[620px] rounded-full border border-white/[0.12] flex items-center justify-center"
          >
            {/* Fine Dashed Arc Segment */}
            <div className="absolute w-[640px] h-[640px] rounded-full border border-dashed border-white/[0.06]" />

            {/* Cardinal Cross Nodes on the inner track */}
            <div className="absolute -top-1 font-['Martian_Mono',monospace] text-[0.6rem] text-[#666666]">
              +
            </div>
            <div className="absolute -bottom-1 font-['Martian_Mono',monospace] text-[0.6rem] text-[#666666]">
              +
            </div>
            <div className="absolute -left-1 font-['Martian_Mono',monospace] text-[0.6rem] text-[#666666]">
              +
            </div>
            <div className="absolute -right-1 font-['Martian_Mono',monospace] text-[0.6rem] text-[#666666]">
              +
            </div>

            {/* Orbiting Pulse Micro-Node */}
            <div className="absolute top-[22%] left-[8%] w-1.5 h-1.5 rounded-full bg-[#cccccc]/80" />
          </motion.div>
        </div>

        {/* 3D Tilted Plane 2: Inclined Polar Orbit (Gyroscopic counter-angle ~64° X, 36° Z) */}
        <div
          className="absolute w-[920px] h-[920px] flex items-center justify-center"
          style={{
            transform: 'rotateX(66deg) rotateY(-18deg) rotateZ(38deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 140, repeat: Infinity, ease: 'linear' }}
            className="absolute w-[760px] h-[760px] rounded-full border border-dashed border-white/[0.07] flex items-center justify-center"
          >
            {/* Micro Satellite Node on Polar Track */}
            <div className="absolute -top-[3px] left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#999999]" />
              <span className="font-['Martian_Mono',monospace] text-[0.5rem] text-[#555555] tracking-[0.18em]">
                POLAR // B-2
              </span>
            </div>

            {/* Orbit Segment Highlight Arc */}
            <div className="absolute inset-0 rounded-full border-t border-r border-white/[0.18] border-b-transparent border-l-transparent" />
          </motion.div>
        </div>

        {/* Outer Wide Planar Field Ring (Large subtle horizon framing the whole hero) */}
        <div className="absolute w-[1240px] h-[1240px] rounded-full border border-white/[0.035] flex items-center justify-center">
          <div className="absolute w-[1200px] h-[1200px] rounded-full border border-dashed border-white/[0.025]" />

          {/* Coordinate Indicators along the outer perimeter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 font-['Martian_Mono',monospace] text-[0.55rem] text-[#444444] tracking-[0.25em]">
            RADIAL BOUNDARY // R-620
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-['Martian_Mono',monospace] text-[0.55rem] text-[#444444] tracking-[0.25em]">
            TRAJECTORY MATRIX [044 BARS]
          </div>
          <div className="absolute left-6 top-1/2 -translate-y-1/2 font-['Martian_Mono',monospace] text-[0.52rem] text-[#444444] tracking-[0.2em] -rotate-90">
            SECTOR 01
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 font-['Martian_Mono',monospace] text-[0.52rem] text-[#444444] tracking-[0.2em] rotate-90">
            SECTOR 02
          </div>
        </div>
      </motion.div>
    </div>
  );
}
