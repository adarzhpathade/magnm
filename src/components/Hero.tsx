'use client';

import React from 'react';
import Image from 'next/image';
import BlurText from './BlurText';
import XylophoneHelix from './originkit/ui/xylophone-helix';
import { Letter3DSwap } from './ui/letter-3d-swap';
import KineticShiftButton from './KineticShiftButton';

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

export interface HeroProps {
  heroSectionRef?: React.RefObject<HTMLDivElement | null>;
  heroMagnmRef?: React.RefObject<HTMLDivElement | null>;
  heroTaglineRef?: React.RefObject<HTMLDivElement | null>;
  heroEmblemRef?: React.RefObject<HTMLDivElement | null>;
  heroBottomRef?: React.RefObject<HTMLDivElement | null>;
  showWheel?: boolean;
  triggerReveal?: boolean;
}

export default function Hero({
  heroSectionRef,
  heroMagnmRef,
  heroTaglineRef,
  heroEmblemRef,
  heroBottomRef,
  showWheel = true,
  triggerReveal = true,
}: HeroProps = {}) {
  const [wordIndex, setWordIndex] = React.useState(0);
  const [wheelScale, setWheelScale] = React.useState(90);

  React.useEffect(() => {
    const timer = setInterval(() => {
      if (typeof window !== 'undefined' && window.scrollY > 200) return;
      setWordIndex((prev) => (prev + 1) % DYNAMIC_TAGLINE_WORDS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    if (!showWheel) return;
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
  }, [showWheel]);

  return (
    <section
      ref={heroSectionRef}
      className="relative w-full h-screen min-h-[500px] bg-transparent text-[#cccccc] overflow-hidden flex flex-col justify-between px-4 sm:px-6 md:px-8 lg:px-10 pt-8 sm:pt-10 md:pt-12 pb-5 sm:pb-6 md:pb-7 select-none pointer-events-none"
    >
      {/* Top Header: Brand Wordmark & Tagline (Left) & Narrative Statement (Right) */}
      <header className="relative w-full flex flex-col pointer-events-none">
        {/* Top Row: MAGNM Wordmark (Left) and Emblem Narrative Unit (Right) - Centered Vertically */}
        <div className="w-full flex justify-between items-center min-h-[44px]">
          <div
            ref={heroMagnmRef}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="pointer-events-auto relative z-10 flex items-center origin-top-left cursor-pointer select-none"
            role="button"
            tabIndex={0}
            aria-label="MAGNM Home"
          >
            <BlurText
              text="MAGNM"
              animateBy="letters"
              direction="none"
              randomize={true}
              delay={80}
              stepDuration={0.45}
              trigger={triggerReveal}
              className="text-[clamp(4.25rem,16vw,15.5rem)] font-normal tracking-[-0.04em] leading-[0.8] text-[#cccccc] hover:text-white transition-colors duration-200 uppercase justify-start flex-nowrap -ml-[0.08em]"
            />
          </div>

          {/* Top-Right: Logo Emblem + Thin Line Divider + Narrative Statement (Centered Vertically with MAGNM) */}
          <div
            ref={heroEmblemRef}
            className="pointer-events-auto relative z-30 hidden md:flex items-center gap-3 sm:gap-3.5 md:gap-4 max-w-[390px]"
          >
            {/* MAGNM Metallic Logo Emblem */}
            <motion.div
              initial={{ filter: 'blur(16px)', opacity: 0 }}
              animate={triggerReveal ? { filter: 'blur(0px)', opacity: 1 } : { filter: 'blur(16px)', opacity: 0 }}
              transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="leave-blur-item relative shrink-0 flex items-center justify-center will-change-[filter,opacity]"
            >
              <Image
                src="/magnm light.png"
                alt="MAGNM Emblem"
                width={1536}
                height={1024}
                className="h-8 sm:h-9 md:h-10 w-auto object-contain select-none pointer-events-none brightness-105 contrast-105"
                priority
              />
            </motion.div>

            {/* Thin Vertical Dividing Line */}
            <motion.div
              initial={{ filter: 'blur(8px)', opacity: 0 }}
              animate={triggerReveal ? { filter: 'blur(0px)', opacity: 1 } : { filter: 'blur(8px)', opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="leave-blur-item w-[1px] h-8 sm:h-9 md:h-10 bg-white/20 shrink-0 will-change-[filter,opacity]"
              aria-hidden="true"
            />

            {/* Narrative Statement with BlurText reveal */}
            <div className="flex flex-col justify-center select-none">
              <BlurText
                text="Websites, AI products, brands,"
                animateBy="words"
                direction="none"
                randomize={false}
                delay={40}
                startDelay={160}
                stepDuration={0.35}
                trigger={triggerReveal}
                spanClassName="leave-blur-item"
                className="font-['Familjen_Grotesk',sans-serif] text-[0.75rem] sm:text-[0.8rem] md:text-[0.86rem] text-[#cccccc] font-normal leading-[1.25] tracking-[-0.012em]"
              />
              <BlurText
                text="and systems built for clarity,"
                animateBy="words"
                direction="none"
                randomize={false}
                delay={40}
                startDelay={260}
                stepDuration={0.35}
                trigger={triggerReveal}
                spanClassName="leave-blur-item"
                className="font-['Familjen_Grotesk',sans-serif] text-[0.75rem] sm:text-[0.8rem] md:text-[0.86rem] text-[#cccccc] font-normal leading-[1.25] tracking-[-0.012em]"
              />
              <BlurText
                text="scale and impact."
                animateBy="words"
                direction="none"
                randomize={false}
                delay={40}
                startDelay={360}
                stepDuration={0.35}
                trigger={triggerReveal}
                spanClassName="leave-blur-item"
                className="font-['Familjen_Grotesk',sans-serif] text-[0.75rem] sm:text-[0.8rem] md:text-[0.86rem] text-[#cccccc] font-normal leading-[1.25] tracking-[-0.012em]"
              />
            </div>
          </div>
        </div>

        {/* Tagline Part (Placed Under MAGNM text - only the last word switches) */}
        <div
          ref={heroTaglineRef}
          className="pointer-events-auto relative z-10 mt-3.5 sm:mt-4 md:mt-5 flex flex-col items-start text-left space-y-0.5 sm:space-y-1"
        >
          {/* Line 1: Static permanent statement */}
          <div className="min-h-[1.15em] flex justify-start">
            <BlurText
              text={TAGLINE_LINE_1}
              animateBy="words"
              direction="none"
              randomize={false}
              delay={90}
              startDelay={160}
              stepDuration={0.4}
              trigger={triggerReveal}
              spanClassName="leave-blur-item"
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
              startDelay={300}
              stepDuration={0.45}
              trigger={triggerReveal}
              spanClassName="leave-blur-item"
              className="text-[clamp(1.15rem,2.4vw,2.25rem)] font-normal tracking-[-0.035em] leading-[1.05] text-[#cccccc] justify-start text-left"
            />
            <span className="inline-block relative ml-[0.28em] text-[clamp(1.15rem,2.4vw,2.25rem)] font-normal tracking-[-0.035em] leading-[1.05] text-[#cccccc]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{
                    filter: 'blur(18px)',
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    filter: ['blur(18px)', 'blur(8px)', 'blur(0px)'],
                    opacity: [0, 0.6, 1],
                    y: [8, 2, 0],
                  }}
                  exit={{
                    filter: ['blur(0px)', 'blur(8px)', 'blur(18px)'],
                    opacity: [1, 0.4, 0],
                    y: [0, -2, -8],
                  }}
                  transition={{
                    duration: 0.48,
                    times: [0, 0.45, 1],
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                    display: 'inline-block',
                    willChange: 'transform, filter, opacity',
                  }}
                >
                  <span className="leave-blur-item inline-block will-change-[filter,opacity]">
                    {DYNAMIC_TAGLINE_WORDS[wordIndex]}
                  </span>
                </motion.span>
              </AnimatePresence>
            </span>
          </div>
        </div>
      </header>

      {/* Bottom Row: Bottom-Left Options */}
      <div
        ref={heroBottomRef}
        className="pointer-events-auto relative z-30 w-full flex justify-between items-end"
      >
        {/* Bottom Left Options (Interactive on all viewports) */}
        <div className="pointer-events-auto relative z-30 flex flex-wrap items-center gap-6 sm:gap-8 md:gap-10 pb-0.5 sm:pb-1">
          <KineticShiftButton
            text="DISCUSS YOUR PROJECT"
            ariaLabel="Discuss your project"
          />

          <KineticShiftButton
            text="BOOK A 30-MINUTE CALL"
            ariaLabel="Book a 30-minute call"
          />
        </div>

        {/* Mobile View: Logo Emblem + Thin Line Divider + Narrative Statement (Bottom-Right) */}
        <div className="pointer-events-auto relative z-30 flex md:hidden items-center gap-3 sm:gap-3.5 max-w-[310px] sm:max-w-[340px] self-end ml-auto pb-1">
          {/* MAGNM Metallic Logo Emblem */}
          <motion.div
            initial={{ filter: 'blur(16px)', opacity: 0 }}
            animate={triggerReveal ? { filter: 'blur(0px)', opacity: 1 } : { filter: 'blur(16px)', opacity: 0 }}
            transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="leave-blur-item relative shrink-0 flex items-center justify-center will-change-[filter,opacity]"
          >
            <Image
              src="/magnm light.png"
              alt="MAGNM Emblem"
              width={1536}
              height={1024}
              className="h-9 sm:h-10 w-auto object-contain select-none pointer-events-none brightness-105 contrast-105"
              priority
            />
          </motion.div>

          {/* Thin Vertical Dividing Line */}
          <motion.div
            initial={{ filter: 'blur(8px)', opacity: 0 }}
            animate={triggerReveal ? { filter: 'blur(0px)', opacity: 1 } : { filter: 'blur(8px)', opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="leave-blur-item w-[1px] h-9 sm:h-10 bg-white/20 shrink-0 will-change-[filter,opacity]"
            aria-hidden="true"
          />

          {/* Narrative Statement with BlurText reveal */}
          <div className="flex flex-col justify-center select-none">
            <BlurText
              text="Websites, AI products, brands,"
              animateBy="words"
              direction="none"
              randomize={false}
              delay={40}
              startDelay={160}
              stepDuration={0.35}
              trigger={triggerReveal}
              spanClassName="leave-blur-item"
              className="font-['Familjen_Grotesk',sans-serif] text-[0.68rem] sm:text-[0.74rem] text-[#cccccc] font-normal leading-[1.25] tracking-[-0.012em]"
            />
            <BlurText
              text="and systems built for clarity,"
              animateBy="words"
              direction="none"
              randomize={false}
              delay={40}
              startDelay={260}
              stepDuration={0.35}
              trigger={triggerReveal}
              spanClassName="leave-blur-item"
              className="font-['Familjen_Grotesk',sans-serif] text-[0.68rem] sm:text-[0.74rem] text-[#cccccc] font-normal leading-[1.25] tracking-[-0.012em]"
            />
            <BlurText
              text="scale and impact."
              animateBy="words"
              direction="none"
              randomize={false}
              delay={40}
              startDelay={360}
              stepDuration={0.35}
              trigger={triggerReveal}
              spanClassName="leave-blur-item"
              className="font-['Familjen_Grotesk',sans-serif] text-[0.68rem] sm:text-[0.74rem] text-[#cccccc] font-normal leading-[1.25] tracking-[-0.012em]"
            />
          </div>
        </div>
      </div>

      {/* Interactive 3D Canvas (Layered ABOVE Text) - Responsive Scaled & Centered Wheel */}
      {showWheel && (
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
      )}
    </section>
  );
}
