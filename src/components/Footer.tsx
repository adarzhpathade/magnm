'use client';

import React, { forwardRef, useState, useEffect, useRef } from 'react';
import XylophoneHelix from './originkit/ui/xylophone-helix';
import { AnimatePresence, motion } from 'motion/react';
import KineticShiftButton from './KineticShiftButton';
import LetterSwapPingPong from './ui/letter-swap-pingpong-anim';
import BlurText from './BlurText';
import { chimeSynth } from '@/lib/chime-synth';
import { cn } from '@/lib/utils';

const DYNAMIC_WORDS = ['CREATE.', 'EXPLORE.', 'BUILD.', 'SHIP.'];

export interface FooterProps {
  className?: string;
  items?: string[];
  prefix?: string;
  magnmRef?: React.RefObject<HTMLSpanElement | null>;
  onStartProject?: () => void;
  triggerReveal?: boolean;
}

const Footer = forwardRef<HTMLDivElement, FooterProps>(
  (
    {
      className,
      items = ['Create', 'Explore', 'Build', 'Ship'],
      prefix = 'Let’s',
      magnmRef,
      onStartProject,
      triggerReveal: triggerProp,
    },
    ref
  ) => {
    const [wordIndex, setWordIndex] = useState(0);
    const [helixScale, setHelixScale] = useState(210);
    const [cameraSettings, setCameraSettings] = useState({ tilt: 42, sideTilt: -38 });
    const [helixSpeed, setHelixSpeed] = useState(45);
    const [barsCount, setBarsCount] = useState(48);
    const [hasRevealed, setHasRevealed] = useState(false);

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 1024);
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
      if (isMobile || triggerProp || triggerProp === undefined) {
        setHasRevealed(true);
      }
    }, [triggerProp, isMobile]);

    useEffect(() => {
      if (!hasRevealed) return;
      const timer = setInterval(() => {
        setWordIndex((prev) => (prev + 1) % DYNAMIC_WORDS.length);
      }, 3200);
      return () => clearInterval(timer);
    }, [hasRevealed]);

    useEffect(() => {
      const updateDimensions = () => {
        const w = window.innerWidth;
        if (w < 640) {
          setHelixScale(185);
          setCameraSettings({ tilt: 42, sideTilt: -30 });
          setHelixSpeed(40); // Optimized fluid rotation on mobile (visible, elegant, continuous)
          setBarsCount(42);  // Lightweight GPU optimization for mobile WebGL
        } else if (w < 1024) {
          setHelixScale(175);
          setCameraSettings({ tilt: 43, sideTilt: -34 });
          setHelixSpeed(38);
          setBarsCount(46);
        } else {
          setHelixScale(210);
          setCameraSettings({ tilt: 42, sideTilt: -38 });
          setHelixSpeed(45);
          setBarsCount(48);
        }
      };
      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const isInteractive = isMobile || Boolean(triggerProp || triggerProp === undefined);
    const cameraControllerRef = useRef({
      tilt: cameraSettings.tilt,
      sideTilt: cameraSettings.sideTilt,
      interactive: isInteractive,
    });
    cameraControllerRef.current.interactive = isInteractive;

    useEffect(() => {
      cameraControllerRef.current.tilt = cameraSettings.tilt;
      cameraControllerRef.current.sideTilt = cameraSettings.sideTilt;
      cameraControllerRef.current.interactive = isMobile || Boolean(triggerProp || triggerProp === undefined);
    }, [cameraSettings, triggerProp, isMobile]);

    return (
      <footer
        ref={ref}
        id="site-footer"
        className={cn(
          'relative w-full h-full min-h-[100svh] lg:min-h-full overflow-hidden bg-transparent select-none',
          className
        )}
      >
        {/* Interactive Xylophone Helix WebGL Background (z-20 renders above all text) */}
        <div
          className={cn(
            'absolute inset-0 z-20 w-full h-full flex items-center justify-center -translate-y-2 sm:-translate-y-4 md:translate-y-0 translate-x-2 sm:translate-x-8 md:translate-x-16 lg:translate-x-24 transition-opacity duration-300',
            isInteractive ? 'pointer-events-auto opacity-100 visible' : 'pointer-events-none opacity-0 invisible'
          )}
        >
          <XylophoneHelix
            soundMode="vibraphone"
            background="transparent"
            baseColor="#171717"
            bars={barsCount}
            shape="helix"
            speed={helixSpeed}
            drag={100}
            scale={helixScale}
            metal={{ reflect: 90, polish: 100 }}
            hover={{ colors: ['#cccccc'], strength: 0, tint: 0, glow: 0 }}
            camera={cameraSettings}
            cameraControllerRef={cameraControllerRef}
          />
        </div>

        {/* Foreground Content: Layout matches Hero precisely (header sits at z-10 behind helix; bottom row sits at z-30 above helix) */}
        <div className="relative w-full h-full pointer-events-none px-4 sm:px-6 md:px-8 lg:px-10 pt-8 sm:pt-10 md:pt-12 pb-5 sm:pb-6 md:pb-7 flex flex-col justify-between">
          <header className="relative w-full flex flex-col pointer-events-none">
            {/* Main MAGNM Display Heading Slot (layout anchor for nav MAGNM text on desktop) */}
            <div
              ref={magnmRef as unknown as React.RefObject<HTMLDivElement>}
              className="relative z-10 w-full flex items-start pointer-events-none"
              style={{
                /* Reserve the exact height the hero-sized MAGNM occupies: fontSize × lineHeight (0.8) */
                minHeight: 'calc(clamp(4.25rem, 16vw, 15.5rem) * 0.8)',
              }}
            >
              {/* Mobile-only: visible MAGNM text (on desktop, the nav-brand-text grows via fontSize animation instead) */}
              <span
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="footer-magnm-mobile lg:hidden font-['Familjen_Grotesk',sans-serif] text-[clamp(4.25rem,16vw,15.5rem)] font-normal tracking-[-0.035em] leading-[0.8] text-[#cccccc] uppercase opacity-100 pointer-events-auto cursor-pointer -ml-[0.055em]"
                role="button"
                tabIndex={0}
                aria-label="MAGNM Home"
              >
                MAGNM
              </span>
            </div>

            {/* Tagline matching Hero Tagline positioning exactly with Page 3's signature BlurText effect */}
            <div className="relative z-30 mt-3.5 sm:mt-4 md:mt-5 flex flex-col items-start text-left space-y-2 sm:space-y-2.5">
              <div className="min-h-[1.15em] flex items-baseline justify-start flex-nowrap whitespace-nowrap font-['Familjen_Grotesk',sans-serif] text-[clamp(1.15rem,2.4vw,2.25rem)] font-normal tracking-[-0.035em] leading-[1.05] text-[#cccccc] -ml-[0.055em]">
                <BlurText
                  key={hasRevealed ? 'lets-revealed' : 'lets-idle'}
                  text="LET'S"
                  animateBy="letters"
                  direction="none"
                  randomize={true}
                  delay={24}
                  startDelay={0}
                  stepDuration={0.2}
                  trigger={hasRevealed}
                  className="!inline-flex items-baseline m-0 p-0"
                  spanClassName="font-['Familjen_Grotesk',sans-serif] text-[clamp(1.15rem,2.4vw,2.25rem)] font-normal tracking-[-0.035em] leading-[1.05] text-[#cccccc] uppercase"
                />
                <span className="inline-block relative ml-[0.28em] text-[clamp(1.15rem,2.4vw,2.25rem)] font-normal tracking-[-0.035em] leading-[1.05] text-[#cccccc] uppercase">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={wordIndex}
                      initial={{ opacity: 1 }}
                      exit={{ filter: 'blur(12px)', opacity: 0 }}
                      transition={{ duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
                      className="inline-block will-change-[filter,opacity]"
                    >
                      <BlurText
                        key={wordIndex}
                        text={DYNAMIC_WORDS[wordIndex]}
                        animateBy="letters"
                        direction="none"
                        randomize={true}
                        delay={24}
                        startDelay={0}
                        stepDuration={0.2}
                        trigger={hasRevealed}
                        className="!inline-flex items-baseline m-0 p-0"
                        spanClassName="font-['Familjen_Grotesk',sans-serif] text-[clamp(1.15rem,2.4vw,2.25rem)] font-normal tracking-[-0.035em] leading-[1.05] text-[#cccccc] uppercase"
                      />
                    </motion.div>
                  </AnimatePresence>
                </span>
              </div>

              {/* Mobile-only Contact Action Button directly below the tagline */}
              <div className="pt-2 sm:pt-2.5 md:pt-3 pointer-events-auto lg:hidden">
                <KineticShiftButton
                  text="CONTACT"
                  ariaLabel="Contact MAGNM"
                  soundType="vibraphone"
                  soundIndex={2}
                  size="md"
                  onClick={onStartProject}
                />
              </div>
            </div>
          </header>

          {/* Bottom Row: Desktop Action Button (Bottom Left) + Studio Location & Developer Credits (Right) */}
          <div className="pointer-events-none relative z-30 w-full flex justify-between items-end pb-0.5 sm:pb-1">
            {/* Desktop-only: Discuss Your Project on the bottom left */}
            <div className="pointer-events-auto hidden lg:flex items-center">
              <KineticShiftButton
                text="DISCUSS YOUR PROJECT"
                ariaLabel="Discuss your project"
                soundType="vibraphone"
                soundIndex={2}
                onClick={onStartProject}
              />
            </div>

            {/* Right: Studio Location & Email + Developer Credits */}
            <div className="pointer-events-auto flex flex-col sm:flex-row items-end gap-6 sm:gap-8 md:gap-12 text-right select-none ml-auto">
              {/* Studio Info: Based in Indore & Contact Email */}
              <div className="flex flex-col items-end gap-1.5">
                <span className="font-['Martian_Mono',monospace] text-[9.5px] sm:text-[10px] md:text-[10.5px] font-medium tracking-[0.14em] uppercase text-[#777777]">
                  STUDIO
                </span>
                <div className="flex flex-col items-end gap-1">
                  <div
                    onMouseEnter={() => chimeSynth.playWoodTap(0.18)}
                    className="group relative inline-flex flex-col items-end cursor-default"
                  >
                    <div className="flex items-center py-0.5">
                      <LetterSwapPingPong
                        label="Based in Indore"
                        className="font-['Familjen_Grotesk',sans-serif] text-[13px] sm:text-[14px] md:text-[14.5px] font-normal tracking-[-0.01em] text-[#cccccc] group-hover:text-white transition-colors duration-200 leading-none"
                      />
                    </div>
                  </div>

                  <a
                    href="mailto:adarshpathade79@gmail.com"
                    onMouseEnter={() => chimeSynth.playWoodTap(0.22)}
                    className="group relative inline-flex flex-col items-end cursor-pointer focus:outline-none"
                    aria-label="Email adarshpathade79@gmail.com"
                  >
                    <div className="flex items-center py-0.5">
                      <LetterSwapPingPong
                        label="adarshpathade79@gmail.com"
                        className="font-['Familjen_Grotesk',sans-serif] text-[13px] sm:text-[14px] md:text-[14.5px] font-normal tracking-[-0.01em] text-[#cccccc] group-hover:text-white transition-colors duration-200 leading-none"
                      />
                    </div>
                  </a>
                </div>
              </div>

              {/* Developer Credits — Matches Reference Design */}
              <div className="flex flex-col items-end gap-1.5">
                <span className="font-['Martian_Mono',monospace] text-[9.5px] sm:text-[10px] md:text-[10.5px] font-medium tracking-[0.14em] uppercase text-[#777777]">
                  DEVELOPED BY
                </span>
                <div className="flex flex-col items-end gap-1">
                  <a
                    href="https://github.com/NetPranav"
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => chimeSynth.playWoodTap(0.18)}
                    className="group relative inline-flex flex-col items-end cursor-pointer focus:outline-none"
                    aria-label="Developer Pranav Dubey"
                  >
                    <div className="flex items-center py-0.5">
                      <LetterSwapPingPong
                        label="Pranav Dubey"
                        className="font-['Familjen_Grotesk',sans-serif] text-[13px] sm:text-[14px] md:text-[14.5px] font-normal tracking-[-0.01em] text-[#cccccc] group-hover:text-white transition-colors duration-200 leading-none"
                      />
                    </div>
                  </a>

                  <a
                    href="https://github.com/adarzhpathade"
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => chimeSynth.playWoodTap(0.18)}
                    className="group relative inline-flex flex-col items-end cursor-pointer focus:outline-none"
                    aria-label="Developer Adarsh Pathade"
                  >
                    <div className="flex items-center py-0.5">
                      <LetterSwapPingPong
                        label="Adarsh Pathade"
                        className="font-['Familjen_Grotesk',sans-serif] text-[13px] sm:text-[14px] md:text-[14.5px] font-normal tracking-[-0.01em] text-[#cccccc] group-hover:text-white transition-colors duration-200 leading-none"
                      />
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
);

Footer.displayName = 'Footer';

export default Footer;
