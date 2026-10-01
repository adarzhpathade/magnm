'use client';

import React, { forwardRef, useState, useEffect } from 'react';
import XylophoneHelix from './originkit/ui/xylophone-helix';
import { AnimatePresence, motion } from 'motion/react';
import KineticShiftButton from './KineticShiftButton';
import { cn } from '@/lib/utils';

const DYNAMIC_WORDS = ['CREATE.', 'EXPLORE.', 'BUILD.', 'SHIP.'];

export interface FooterProps {
  className?: string;
  items?: string[];
  prefix?: string;
  magnmRef?: React.RefObject<HTMLSpanElement | null>;
  onStartProject?: () => void;
}

const Footer = forwardRef<HTMLDivElement, FooterProps>(
  (
    {
      className,
      items = ['Create', 'Explore', 'Build', 'Ship'],
      prefix = 'Let’s',
      magnmRef,
      onStartProject,
    },
    ref
  ) => {
    const [wordIndex, setWordIndex] = useState(0);
    const [helixScale, setHelixScale] = useState(140);

    useEffect(() => {
      const timer = setInterval(() => {
        setWordIndex((prev) => (prev + 1) % DYNAMIC_WORDS.length);
      }, 3200);
      return () => clearInterval(timer);
    }, []);

    useEffect(() => {
      const updateScale = () => {
        const w = window.innerWidth;
        if (w < 640) {
          setHelixScale(88);
        } else if (w < 1024) {
          setHelixScale(115);
        } else {
          setHelixScale(140);
        }
      };
      updateScale();
      window.addEventListener('resize', updateScale);
      return () => window.removeEventListener('resize', updateScale);
    }, []);

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
        <div className="absolute inset-0 z-20 w-full h-full pointer-events-auto flex items-center justify-center">
          <XylophoneHelix
            soundMode="glockenspiel"
            background="transparent"
            baseColor="#171717"
            bars={48}
            shape="helix"
            speed={45}
            drag={100}
            scale={helixScale}
            metal={{ reflect: 90, polish: 100 }}
            hover={{ colors: ['#cccccc'], strength: 0, tint: 0, glow: 0 }}
            camera={{ tilt: 40, sideTilt: -25 }}
          />
        </div>

        {/* Foreground Content: Layout matches Hero precisely (z-10 sits behind helix) */}
        <div className="relative z-10 w-full h-full pointer-events-none px-4 sm:px-6 md:px-8 lg:px-10 pt-8 sm:pt-10 md:pt-12 pb-5 sm:pb-6 md:pb-7 flex flex-col justify-between">
          <header className="relative w-full flex flex-col pointer-events-none">
            {/* Main MAGNM Display Heading Slot (layout anchor for nav MAGNM text on desktop) */}
            <div
              ref={magnmRef as unknown as React.RefObject<HTMLDivElement>}
              className="w-full flex items-start pointer-events-none"
              style={{
                /* Reserve the exact height the hero-sized MAGNM occupies: fontSize × lineHeight (0.8) */
                minHeight: 'calc(clamp(4.25rem, 16vw, 15.5rem) * 0.8)',
              }}
            >
              {/* Mobile-only: visible MAGNM text (on desktop, the nav-brand-text grows via fontSize animation instead) */}
              <span
                className="footer-magnm-mobile lg:hidden font-['Familjen_Grotesk',sans-serif] text-[clamp(4.25rem,16vw,15.5rem)] font-normal tracking-[-0.035em] leading-[0.8] text-[#cccccc] uppercase opacity-0"
                aria-hidden="true"
              >
                MAGNM
              </span>
            </div>

            {/* Tagline matching Hero Tagline positioning exactly */}
            <div className="relative z-10 mt-3.5 sm:mt-4 md:mt-5 flex flex-col items-start text-left space-y-0.5 sm:space-y-1">
              <div className="min-h-[1.15em] flex items-baseline justify-start flex-nowrap whitespace-nowrap text-[clamp(1.15rem,2.4vw,2.25rem)] font-normal tracking-[-0.035em] leading-[1.05] text-[#cccccc]">
                <span className="text-[clamp(1.15rem,2.4vw,2.25rem)] font-normal tracking-[-0.035em] leading-[1.05] text-[#cccccc] uppercase">
                  LET'S
                </span>
                <span className="inline-block relative ml-[0.28em] text-[clamp(1.15rem,2.4vw,2.25rem)] font-normal tracking-[-0.035em] leading-[1.05] text-[#cccccc] uppercase">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={wordIndex}
                      initial={{ filter: 'blur(18px)', opacity: 0, y: 8 }}
                      animate={{ filter: ['blur(18px)', 'blur(8px)', 'blur(0px)'], opacity: [0, 0.6, 1], y: [8, 2, 0] }}
                      exit={{ filter: ['blur(0px)', 'blur(8px)', 'blur(18px)'], opacity: [1, 0.4, 0], y: [0, -2, -8] }}
                      transition={{ duration: 0.48, times: [0, 0.45, 1], ease: [0.22, 1, 0.36, 1] }}
                      style={{ display: 'inline-block', willChange: 'transform, filter, opacity' }}
                    >
                      <span className="inline-block will-change-[filter,opacity]">
                        {DYNAMIC_WORDS[wordIndex]}
                      </span>
                    </motion.span>
                  </AnimatePresence>
                </span>
              </div>
            </div>
          </header>

          {/* Bottom Row: Action Button & Copyright */}
          <div className="pointer-events-auto relative z-30 w-full flex justify-between items-end pb-0.5 sm:pb-1">
            <div className="flex flex-row items-center gap-6 sm:gap-8 md:gap-10">
              <KineticShiftButton
                text="DISCUSS YOUR PROJECT"
                ariaLabel="Discuss your project"
                soundIndex={0}
                onClick={onStartProject}
              />
            </div>
            <div className="hidden sm:flex items-center gap-3 text-[10px] md:text-xs font-mono tracking-wider text-[#777777] uppercase select-none">
              <span>© {new Date().getFullYear()} MAGNM</span>
              <span>•</span>
              <span>ALL RIGHTS RESERVED</span>
            </div>
          </div>
        </div>
      </footer>
    );
  }
);

Footer.displayName = 'Footer';

export default Footer;

