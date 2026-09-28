'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import LetterSwapPingPong from './ui/letter-swap-pingpong-anim';
import { ChimeSynthesizer } from '@/lib/chime-synth';

interface NavbarProps {
  headerRef?: React.RefObject<HTMLElement | null>;
  navActionsRef?: React.RefObject<HTMLDivElement | null>;
  navBrandRef?: React.RefObject<HTMLDivElement | null>;
  onStartProject?: () => void;
  onAboutClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ headerRef, navActionsRef, navBrandRef, onStartProject, onAboutClick }) => {
  const chimeRef = useRef<ChimeSynthesizer | null>(null);

  const playHoverSound = (index: number) => {
    if (!chimeRef.current) chimeRef.current = new ChimeSynthesizer();
    chimeRef.current.strike(index, 10, 'glockenspiel');
  };

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 w-full z-50 pointer-events-none px-4 sm:px-6 md:px-8 lg:px-10 pt-8 sm:pt-10 md:pt-12 pb-5 sm:pb-6 md:pb-7 flex justify-between items-center transition-colors duration-300"
      aria-label="Main Navigation"
    >
      {/* Left Slot: Fixed Navbar Brand Wordmark Target */}
      <div
        ref={navBrandRef}
        className="pointer-events-auto flex items-center min-h-[44px] h-[44px] select-none"
      >
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          onMouseEnter={() => playHoverSound(5)}
          className="focus:outline-none cursor-pointer flex items-center gap-2.5 sm:gap-3 md:gap-3.5 group"
          aria-label="MAGNM Home"
        >
          {/* Dual Logo Container: Light (for dark surfaces) & Dark (for light surfaces) */}
          <div className="nav-logo-container relative shrink-0 flex items-center justify-center h-[34px] sm:h-[35px] md:h-[36px] aspect-[1.5/1] opacity-0">
            <Image
              src="/magnm light.png"
              alt="MAGNM Logo"
              width={1536}
              height={1024}
              className="nav-logo-light absolute inset-0 w-full h-full object-contain select-none pointer-events-none brightness-105 contrast-105 transition-opacity duration-300 group-hover:brightness-125"
              priority
            />
            <Image
              src="/magnm dark.png"
              alt="MAGNM Logo Dark"
              width={1536}
              height={1024}
              className="nav-logo-dark absolute inset-0 w-full h-full object-contain select-none pointer-events-none opacity-0 brightness-105 contrast-105 transition-opacity duration-300 group-hover:brightness-90"
              priority
            />
          </div>

          {/* Thin Vertical Divider Line between Logo and MAGNM Text */}
          <div
            className="nav-brand-divider hidden lg:block w-[1px] h-[20px] bg-white/20 shrink-0 opacity-0 transition-colors duration-200"
            aria-hidden="true"
          />

          <span className="nav-brand-text hidden lg:inline-block font-['Familjen_Grotesk',sans-serif] text-[1.35rem] sm:text-[1.5rem] md:text-[1.65rem] font-normal tracking-[-0.035em] text-[#cccccc] group-hover:text-white transition-colors duration-200 uppercase leading-none opacity-0">
            MAGNM
          </span>
        </button>
      </div>

      {/* Right Slot: Nav Action Buttons (hidden on Hero, appears on scroll) */}
      <div
        ref={navActionsRef}
        className="pointer-events-none flex items-center gap-1.5 sm:gap-2 md:gap-2.5 min-h-[44px] h-[44px] opacity-0 transition-opacity duration-300"
      >
        {/* Outline / Without Fill: About Us */}
        <button
          type="button"
          onClick={() => {
            if (onAboutClick) {
              onAboutClick();
            } else {
              const isDesktop = window.innerWidth >= 1024;
              const target = isDesktop
                ? document.body.scrollHeight * 0.22
                : window.innerHeight * 0.85;
              window.scrollTo({ top: target, behavior: 'smooth' });
            }
          }}
          onMouseEnter={() => playHoverSound(0)}
          className="nav-secondary-btn group cursor-pointer hidden sm:inline-flex items-center justify-center text-center px-3 sm:px-3.5 md:px-4 h-[27px] sm:h-[28px] md:h-[29px] rounded-full border border-white/20 bg-transparent text-[#cccccc] hover:text-white hover:border-white/50 text-[9.5px] sm:text-[10px] md:text-[10.5px] font-medium tracking-[0.05em] uppercase select-none transition-all duration-200 active:scale-[0.98] focus:outline-none"
          aria-label="About Us"
        >
          <LetterSwapPingPong
            label="ABOUT US"
            className="font-['Familjen_Grotesk',sans-serif] font-medium transition-colors duration-200 leading-none"
          />
        </button>

        {/* Filled Pill: Start a Project */}
        <button
          type="button"
          onClick={() => {
            if (onStartProject) {
              onStartProject();
            } else {
              const page4 = document.getElementById('page-4');
              if (page4 && window.innerWidth < 1024) {
                page4.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
              }
            }
          }}
          onMouseEnter={() => playHoverSound(2)}
          className="nav-action-btn group cursor-pointer inline-flex items-center justify-center text-center px-3 sm:px-3.5 md:px-4 h-[27px] sm:h-[28px] md:h-[29px] rounded-full bg-white text-[#171717] text-[9.5px] sm:text-[10px] md:text-[10.5px] font-medium tracking-[0.05em] uppercase select-none transition-all duration-200 hover:opacity-90 active:scale-[0.98] focus:outline-none"
          aria-label="Start a project"
        >
          <LetterSwapPingPong
            label="START A PROJECT"
            className="font-['Familjen_Grotesk',sans-serif] font-medium transition-colors duration-200 leading-none"
          />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
