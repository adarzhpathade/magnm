'use client';

import React from 'react';
import Image from 'next/image';
import BlurText from './BlurText';
import XylophoneHelix from './originkit/ui/xylophone-helix';
import { Letter3DSwap } from './ui/letter-3d-swap';

import { AnimatePresence, motion } from 'motion/react';

const TAGLINE_LINE_1 = 'Translating bold vision';
const TAGLINE_LINE_2_PREFIX = 'into lasting';

const DYNAMIC_TAGLINE_WORDS = [
  'impact.',
  'clarity.',
  'motion.',
  'scale.',
  'reality.',
  'form.',
];

export default function Hero() {
  const [wordIndex, setWordIndex] = React.useState(0);
  const [wheelScale, setWheelScale] = React.useState(90);
  const isFirstMount = React.useRef(true);

  React.useEffect(() => {
    isFirstMount.current = false;
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % DYNAMIC_TAGLINE_WORDS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    const updateWheelScale = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setWheelScale(48);
      } else if (width < 1024) {
        setWheelScale(70);
      } else {
        setWheelScale(90);
      }
    };
    updateWheelScale();
    window.addEventListener('resize', updateWheelScale);
    return () => window.removeEventListener('resize', updateWheelScale);
  }, []);

  return (
    <section className="relative w-full h-screen min-h-[500px] bg-[#000000] text-[#cccccc] overflow-hidden flex flex-col justify-between px-3 sm:px-5 md:px-7 lg:px-8 py-3 sm:py-4 md:py-5 lg:py-6 select-none">
      {/* Top Header: Brand Wordmark & Tagline (Left) & Narrative Statement (Right) */}
      <header className="relative w-full flex justify-between items-start pt-1 sm:pt-1.5 md:pt-2 lg:pt-2.5 pointer-events-none">
        <div className="pointer-events-auto relative z-0 flex flex-col items-start text-left">
          <BlurText
            text="MAGNM"
            animateBy="letters"
            direction="none"
            randomize={true}
            delay={80}
            stepDuration={0.45}
            className="text-[clamp(4.25rem,16vw,15.5rem)] font-normal tracking-[-0.04em] leading-[0.8] text-[#cccccc] uppercase justify-start flex-nowrap"
          />

          {/* Tagline Part (Placed Under MAGNM text - only the last word switches) */}
          <div className="mt-3.5 sm:mt-4 md:mt-5 flex flex-col items-start text-left space-y-0.5 sm:space-y-1">
            {/* Line 1: Static permanent statement */}
            <div className="min-h-[1.15em] flex justify-start">
              <BlurText
                text={TAGLINE_LINE_1}
                animateBy="words"
                direction="none"
                randomize={false}
                delay={90}
                stepDuration={0.4}
                className="text-[clamp(1.15rem,2.4vw,2.25rem)] font-normal tracking-[-0.035em] leading-[1.05] text-[#cccccc] justify-start text-left"
              />
            </div>

            {/* Line 2: Static prefix + dynamic rotating last word */}
            <div className="min-h-[1.15em] flex items-baseline justify-start flex-nowrap whitespace-nowrap text-[clamp(1.15rem,2.4vw,2.25rem)] font-normal tracking-[-0.035em] leading-[1.05] text-[#cccccc]">
              <BlurText
                text={TAGLINE_LINE_2_PREFIX}
                animateBy="words"
                direction="none"
                randomize={false}
                delay={140}
                stepDuration={0.45}
                className="text-[clamp(1.15rem,2.4vw,2.25rem)] font-normal tracking-[-0.035em] leading-[1.05] text-[#cccccc] justify-start text-left"
              />
              <span className="inline-block relative ml-[0.28em] text-[clamp(1.15rem,2.4vw,2.25rem)] font-normal tracking-[-0.035em] leading-[1.05] text-[#cccccc]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIndex}
                    initial={{
                      filter: 'blur(8px)',
                      opacity: 0,
                      y: isFirstMount.current ? 0 : 6,
                    }}
                    animate={{
                      filter: 'blur(0px)',
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      filter: 'blur(8px)',
                      opacity: 0,
                      y: -6,
                    }}
                    transition={{
                      duration: isFirstMount.current ? 0.45 : 0.35,
                      delay: isFirstMount.current ? 0.22 : 0,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="inline-block will-change-[transform,filter,opacity]"
                  >
                    {DYNAMIC_TAGLINE_WORDS[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </div>
          </div>
        </div>

        {/* Top-Right: Logo Emblem + Thin Line Divider + Narrative Statement */}
        <div className="pointer-events-auto relative z-20 hidden md:flex items-center gap-3 sm:gap-3.5 md:gap-4 max-w-[390px] pt-1 sm:pt-1.5 md:pt-2">
          {/* MAGNM Metallic Logo Emblem */}
          <div className="relative shrink-0 flex items-center justify-center">
            <Image
              src="/magnm light.png"
              alt="MAGNM Emblem"
              width={1536}
              height={1024}
              className="h-8 sm:h-9 md:h-10 w-auto object-contain select-none pointer-events-none brightness-105 contrast-105"
              priority
            />
          </div>

          {/* Thin Vertical Dividing Line */}
          <div className="w-[1px] h-8 sm:h-9 md:h-10 bg-white/20 shrink-0" aria-hidden="true" />

          {/* Narrative Statement */}
          <p className="font-['Familjen_Grotesk',sans-serif] text-[0.75rem] sm:text-[0.8rem] md:text-[0.86rem] text-[#cccccc] font-normal leading-[1.25] tracking-[-0.012em]">
            Websites, AI products, brands,<br />
            and systems built for clarity,<br />
            scale and impact.
          </p>
        </div>
      </header>

      {/* Bottom Row: Bottom-Left Options */}
      <div className="relative w-full flex justify-between items-end pointer-events-none">
        {/* Bottom Left Options (Hidden on Mobile View, Visible on Desktop/Tablet) */}
        <div className="pointer-events-auto relative z-20 hidden md:flex flex-row items-center gap-6 sm:gap-8 md:gap-10 pb-0.5 sm:pb-1">
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

        {/* Mobile View: Logo Emblem + Thin Line Divider + Narrative Statement (Bottom-Right) */}
        <div className="pointer-events-auto relative z-20 flex md:hidden items-center gap-3 sm:gap-3.5 max-w-[310px] sm:max-w-[340px] self-end ml-auto pb-1">
          {/* MAGNM Metallic Logo Emblem */}
          <div className="relative shrink-0 flex items-center justify-center">
            <Image
              src="/magnm light.png"
              alt="MAGNM Emblem"
              width={1536}
              height={1024}
              className="h-9 sm:h-10 w-auto object-contain select-none pointer-events-none brightness-105 contrast-105"
              priority
            />
          </div>

          {/* Thin Vertical Dividing Line */}
          <div className="w-[1px] h-9 sm:h-10 bg-white/20 shrink-0" aria-hidden="true" />

          {/* Narrative Statement */}
          <p className="font-['Familjen_Grotesk',sans-serif] text-[0.68rem] sm:text-[0.74rem] text-[#cccccc] font-normal leading-[1.25] tracking-[-0.012em]">
            Websites, AI products, brands,<br />
            and systems built for clarity,<br />
            scale and impact.
          </p>
        </div>
      </div>

      {/* Interactive 3D Canvas (Layered ABOVE Text) - Responsive Scaled & Centered Wheel */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-auto translate-y-0 sm:translate-y-3 md:translate-y-7 lg:translate-y-9">
        <XylophoneHelix
          soundMode="glockenspiel"
          background="transparent"
          baseColor="#0E0E1A"
          bars={44}
          shape="wheel"
          speed={59}
          drag={100}
          scale={wheelScale}
          metal={{ reflect: 100, polish: 100 }}
          hover={{ colors: ['#D8782B'], strength: 0, tint: 0, glow: 0 }}
          camera={{ tilt: 36, sideTilt: -35 }}
        />
      </div>
    </section>
  );
}
