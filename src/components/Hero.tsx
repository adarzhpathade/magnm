'use client';

import React from 'react';
import Image from 'next/image';
import BlurText from './BlurText';
import XylophoneHelix from './originkit/ui/xylophone-helix';
import { Letter3DSwap } from './ui/letter-3d-swap';
import KineticShiftButton from './KineticShiftButton';

import { AnimatePresence, motion } from 'motion/react';
import gsap from 'gsap';

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
  onStartProject?: () => void;
  onAboutClick?: () => void;
}

export default function Hero({
  heroSectionRef,
  heroMagnmRef,
  heroTaglineRef,
  heroEmblemRef,
  heroBottomRef,
  showWheel = true,
  triggerReveal = true,
  onStartProject,
  onAboutClick,
}: HeroProps = {}) {
  const [wordIndex, setWordIndex] = React.useState(0);
  const [wheelScale, setWheelScale] = React.useState(90);

  // Initial reveal animation for hero bottom action buttons via GSAP
  // Runs once on triggerReveal with cinematic staggered blur-dissolve and upward glide
  const hasRevealedRef = React.useRef(false);

  React.useEffect(() => {
    if (!triggerReveal || hasRevealedRef.current) return;
    if (!heroBottomRef?.current) return;

    const btns = heroBottomRef.current.querySelectorAll('.hero-reveal-btn');
    if (btns.length === 0) return;

    hasRevealedRef.current = true;

    if (typeof window !== 'undefined' && window.scrollY > 50) {
      gsap.set(btns, { opacity: 1, filter: 'blur(0px)', y: 0 });
      return;
    }

    gsap.fromTo(
      btns,
      {
        opacity: 0,
        filter: 'blur(16px)',
        y: 18,
      },
      {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 0.85,
        delay: 0.22,
        stagger: 0.12,
        ease: 'power3.out',
        immediateRender: true,
      }
    );
  }, [triggerReveal, heroBottomRef]);

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
        setWheelScale(54);
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
      className="relative w-full min-h-[100svh] lg:h-screen bg-transparent text-[#cccccc] overflow-hidden flex flex-col justify-between px-4 sm:px-6 md:px-8 lg:px-10 pt-8 sm:pt-10 md:pt-12 pb-5 sm:pb-6 md:pb-7 select-none pointer-events-none"
    >
      {/* Top Header: Brand Wordmark & Tagline (Left) & Narrative Statement (Right) */}
      <header className="relative w-full flex flex-col pointer-events-none">
        {/* Top Row: MAGNM Wordmark (Left) and Emblem Narrative Unit (Right) - Centered Vertically */}
        <div className="w-full flex justify-between items-center min-h-[44px]">
          <div
            ref={heroMagnmRef}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="pointer-events-auto relative z-10 flex items-center origin-top-left cursor-pointer select-none -ml-[0.055em]"
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
              className="font-['Familjen_Grotesk',sans-serif] text-[clamp(4.25rem,16vw,15.5rem)] font-normal tracking-[-0.035em] leading-[0.8] text-[#cccccc] hover:text-white transition-colors duration-200 uppercase justify-start flex-nowrap"
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
                alt="MAGNM Creative Studio Desktop Light Emblem"
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
          <div className="min-h-[1.15em] flex justify-start -ml-[0.055em]">
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
              className="font-['Familjen_Grotesk',sans-serif] text-[clamp(1.15rem,2.4vw,2.25rem)] font-normal tracking-[-0.035em] leading-[1.05] text-[#cccccc] justify-start text-left"
            />
          </div>

          {/* Line 2: Static prefix + dynamic rotating last word */}
          <div className="min-h-[1.15em] flex items-baseline justify-start flex-nowrap whitespace-nowrap text-[clamp(1.15rem,2.4vw,2.25rem)] font-normal tracking-[-0.035em] leading-[1.05] text-[#cccccc] -ml-[0.055em]">
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
              className="font-['Familjen_Grotesk',sans-serif] text-[clamp(1.15rem,2.4vw,2.25rem)] font-normal tracking-[-0.035em] leading-[1.05] text-[#cccccc] justify-start text-left"
            />
            <span className="inline-block relative ml-[0.28em] text-[clamp(1.15rem,2.4vw,2.25rem)] font-normal tracking-[-0.035em] leading-[1.05] text-[#cccccc]">
              <AnimatePresence mode="wait">
                {triggerReveal && (
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
                )}
              </AnimatePresence>
            </span>
          </div>
        </div>
      </header>

      {/* Bottom Row: Desktop Action Buttons (Left) & Mobile Contact (Left) + Light MAGNM Logo (Right) */}
      <div
        ref={heroBottomRef}
        style={!triggerReveal ? { visibility: 'hidden', pointerEvents: 'none' } : undefined}
        className="pointer-events-auto relative z-50 w-full flex justify-between items-end pb-0.5 sm:pb-1"
      >
        {/* Desktop-only Action Buttons: Discuss Project & About Us */}
        <div className="pointer-events-auto relative z-50 hidden md:flex flex-row items-center gap-6 sm:gap-8 md:gap-10">
          <div className="hero-reveal-btn opacity-0 filter blur-[16px] translate-y-4 will-change-[transform,filter,opacity]">
            <KineticShiftButton
              text="DISCUSS YOUR PROJECT"
              ariaLabel="Discuss your project"
              soundIndex={0}
              onClick={onStartProject}
            />
          </div>
          <div className="hero-reveal-btn opacity-0 filter blur-[16px] translate-y-4 will-change-[transform,filter,opacity]">
            <KineticShiftButton
              text="ABOUT US"
              ariaLabel="About us"
              soundIndex={1}
              onClick={onAboutClick}
            />
          </div>
        </div>

        {/* Mobile-only Action Button on the bottom left: Contact */}
        <div className="pointer-events-auto relative z-50 flex md:hidden items-center pb-0.5">
          <div className="hero-reveal-btn opacity-0 filter blur-[16px] translate-y-4 will-change-[transform,filter,opacity]">
            <KineticShiftButton
              text="CONTACT"
              ariaLabel="Contact MAGNM"
              soundIndex={0}
              size="md"
              onClick={onStartProject}
            />
          </div>
        </div>

        {/* Mobile-only: Scaled-up Light MAGNM Logo on the bottom right */}
        <div className="pointer-events-auto relative z-50 flex md:hidden items-center justify-end pb-1">
          <div className="hero-reveal-btn opacity-0 filter blur-[16px] translate-y-4 will-change-[transform,filter,opacity] relative shrink-0 flex items-center justify-end">
            <Image
              src="/magnm light.png"
              alt="MAGNM Creative Studio Mobile Light Emblem"
              width={1536}
              height={1024}
              className="h-[38px] sm:h-[42px] w-auto object-contain select-none pointer-events-none brightness-105 contrast-105"
              priority
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
