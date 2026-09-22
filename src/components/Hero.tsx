'use client';

import React from 'react';
import BlurText from './BlurText';
import ParticleSaturn from './originkit/ui/particle-saturn';
import XylophoneHelix from './originkit/ui/xylophone-helix';
import { Letter3DSwap } from './ui/letter-3d-swap';
import { TextRepel } from './ui/text-repel';

const DYNAMIC_TAGLINE_PREFIXES = [
  'Translating bold vision',
  'Choreographing pure motion',
  'Sculpting digital form',
  'Engineering aesthetics',
];

const STATIC_TAGLINE_SUFFIX = 'into lasting impact.';

export default function Hero() {
  const [phraseIndex, setPhraseIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % DYNAMIC_TAGLINE_PREFIXES.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-screen min-h-[500px] bg-[#000000] text-[#cccccc] overflow-hidden flex flex-col justify-between px-3 sm:px-5 md:px-7 lg:px-8 py-3 sm:py-4 md:py-5 lg:py-6 select-none">
      {/* Top Header: Brand Wordmark (Left) & Nav Options (Right) */}
      <header className="relative w-full flex justify-between items-center pt-1 sm:pt-1.5 md:pt-2 lg:pt-2.5 pointer-events-none">
        <div className="pointer-events-auto relative z-0">
          <BlurText
            text="MAGNM"
            animateBy="letters"
            direction="none"
            randomize={true}
            delay={80}
            stepDuration={0.45}
            className="text-[clamp(3.5rem,14.5vw,13.5rem)] font-normal tracking-[-0.04em] leading-[0.8] text-[#cccccc] uppercase justify-start flex-nowrap"
          />
        </div>

        {/* Right Side Nav: CONTACT and MENU Centrally Aligned with MAGNM */}
        <nav
          className="pointer-events-auto relative z-20 flex items-center gap-5 sm:gap-7 md:gap-9"
          aria-label="Main Navigation"
        >
          <button
            type="button"
            className="group relative cursor-pointer flex items-center gap-2 py-1.5 focus:outline-none text-left"
            aria-label="Contact"
          >
            <span className="font-['Martian_Mono',monospace] text-[0.68rem] text-[#666666] group-hover:text-[#cccccc] transition-transform duration-300 group-hover:rotate-90 inline-block select-none">
              +
            </span>
            <Letter3DSwap
              as="span"
              rotateDirection="top"
              staggerDuration={0.018}
              staggerFrom="first"
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              mainClassName="flex-nowrap whitespace-nowrap [perspective:800px] font-['Martian_Mono',monospace] font-light text-[clamp(0.68rem,0.85vw,0.82rem)] tracking-[0.06em] text-[#cccccc] select-none"
              frontFaceClassName="text-[#cccccc]"
              secondFaceClassName="text-[#cccccc]"
            >
              CONTACT
            </Letter3DSwap>
          </button>

          <button
            type="button"
            className="group relative cursor-pointer flex items-center gap-2 py-1.5 focus:outline-none text-left"
            aria-label="Menu"
          >
            <span className="font-['Martian_Mono',monospace] text-[0.68rem] text-[#666666] group-hover:text-[#cccccc] transition-transform duration-300 group-hover:rotate-90 inline-block select-none">
              +
            </span>
            <Letter3DSwap
              as="span"
              rotateDirection="top"
              staggerDuration={0.018}
              staggerFrom="first"
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              mainClassName="flex-nowrap whitespace-nowrap [perspective:800px] font-['Martian_Mono',monospace] font-light text-[clamp(0.68rem,0.85vw,0.82rem)] tracking-[0.06em] text-[#cccccc] select-none"
              frontFaceClassName="text-[#cccccc]"
              secondFaceClassName="text-[#cccccc]"
            >
              MENU
            </Letter3DSwap>
          </button>
        </nav>
      </header>

      {/* Bottom Row: Bottom-Left Options & Bottom-Right Tagline */}
      <div className="relative w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-5 md:gap-4 pointer-events-none">
        {/* Bottom Left Options (Minimal Typographic with 3D Letter Swap) */}
        <div className="pointer-events-auto relative z-20 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 md:gap-10 pb-0.5 sm:pb-1">
          <button
            type="button"
            className="group relative cursor-pointer flex items-center gap-2 py-1.5 focus:outline-none text-left"
            aria-label="Discuss your project"
          >
            <span className="font-['Martian_Mono',monospace] text-[0.68rem] text-[#666666] group-hover:text-[#cccccc] transition-transform duration-300 group-hover:rotate-90 inline-block select-none">
              +
            </span>
            <Letter3DSwap
              as="span"
              rotateDirection="top"
              staggerDuration={0.018}
              staggerFrom="first"
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              mainClassName="flex-nowrap whitespace-nowrap [perspective:800px] font-['Martian_Mono',monospace] font-light text-[clamp(0.68rem,0.85vw,0.82rem)] tracking-[0.06em] text-[#cccccc] select-none"
              frontFaceClassName="text-[#cccccc]"
              secondFaceClassName="text-[#cccccc]"
            >
              DISCUSS YOUR PROJECT
            </Letter3DSwap>
          </button>

          <button
            type="button"
            className="group relative cursor-pointer flex items-center gap-2 py-1.5 focus:outline-none text-left"
            aria-label="Book a 30-minute call"
          >
            <span className="font-['Martian_Mono',monospace] text-[0.68rem] text-[#666666] group-hover:text-[#cccccc] transition-transform duration-300 group-hover:rotate-90 inline-block select-none">
              +
            </span>
            <Letter3DSwap
              as="span"
              rotateDirection="top"
              staggerDuration={0.018}
              staggerFrom="first"
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              mainClassName="flex-nowrap whitespace-nowrap [perspective:800px] font-['Martian_Mono',monospace] font-light text-[clamp(0.68rem,0.85vw,0.82rem)] tracking-[0.06em] text-[#cccccc] select-none"
              frontFaceClassName="text-[#cccccc]"
              secondFaceClassName="text-[#cccccc]"
            >
              BOOK A 30-MINUTE CALL
            </Letter3DSwap>
          </button>
        </div>

        {/* Bottom Right Tagline (Dynamic Changing Prefix, Static Suffix) */}
        <div className="pointer-events-auto relative z-0 flex flex-col items-start md:items-end text-left md:text-right space-y-0.5 sm:space-y-1">
          <div className="min-h-[1.15em] flex justify-start md:justify-end">
            <BlurText
              key={phraseIndex}
              text={DYNAMIC_TAGLINE_PREFIXES[phraseIndex]}
              animateBy="words"
              direction="none"
              randomize={true}
              delay={90}
              stepDuration={0.4}
              className="text-[clamp(1.5rem,3.8vw,3.25rem)] font-normal tracking-[-0.035em] leading-[1.02] text-[#cccccc] justify-start md:justify-end text-left md:text-right"
            />
          </div>
          <div>
            <BlurText
              text={STATIC_TAGLINE_SUFFIX}
              animateBy="words"
              direction="none"
              randomize={false}
              delay={140}
              stepDuration={0.45}
              className="text-[clamp(1.5rem,3.8vw,3.25rem)] font-normal tracking-[-0.035em] leading-[1.02] text-[#cccccc] justify-start md:justify-end text-left md:text-right"
            />
          </div>
        </div>
      </div>

      {/* Interactive 3D Canvas (Layered ABOVE Text) - Xylophone Helix Wheel */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-auto translate-y-5 sm:translate-y-7 md:translate-y-9">
        <XylophoneHelix
          soundMode="glockenspiel"
          background="transparent"
          baseColor="#0E0E1A"
          bars={44}
          shape="wheel"
          speed={59}
          drag={100}
          scale={90}
          metal={{ reflect: 100, polish: 100 }}
          hover={{ colors: ['#D8782B'], strength: 0, tint: 0, glow: 0 }}
          camera={{ tilt: 36, sideTilt: -35 }}
        />
      </div>
    </section>
  );
}
