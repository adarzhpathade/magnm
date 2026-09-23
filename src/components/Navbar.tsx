'use client';

import React from 'react';
import { Letter3DSwap } from './ui/letter-3d-swap';

interface NavbarProps {
  headerRef?: React.RefObject<HTMLElement | null>;
  navActionsRef?: React.RefObject<HTMLDivElement | null>;
  navBrandRef?: React.RefObject<HTMLDivElement | null>;
}

export const Navbar: React.FC<NavbarProps> = ({ headerRef, navActionsRef, navBrandRef }) => {
  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 w-full z-50 pointer-events-none px-4 sm:px-6 md:px-8 lg:px-10 pt-8 sm:pt-10 md:pt-12 pb-5 sm:pb-6 md:pb-7 flex justify-between items-center transition-colors duration-300"
      aria-label="Main Navigation"
    >
      {/* Left Slot: Fixed Navbar Brand Wordmark Target */}
      <div
        ref={navBrandRef}
        className="pointer-events-auto flex items-center min-h-[44px] h-[44px] select-none opacity-0"
      >
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="focus:outline-none cursor-pointer flex items-center"
          aria-label="MAGNM Home"
        >
          <span className="nav-brand-text font-['Familjen_Grotesk',sans-serif] text-[1.85rem] sm:text-[2.1rem] md:text-[2.4rem] font-normal tracking-[-0.035em] text-[#cccccc] hover:text-white transition-colors duration-200 uppercase leading-none">
            MAGNM
          </span>
        </button>
      </div>

      {/* Right Slot: Nav Options (styled in the same design system as the Hero buttons) */}
      <div
        ref={navActionsRef}
        className="pointer-events-auto flex items-center gap-2 sm:gap-3 min-h-[44px] h-[44px] opacity-0"
      >
        {/* Discuss Your Project / Contact Button */}
        <button
          type="button"
          className="nav-action-btn group relative cursor-pointer flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/15 bg-black/60 hover:border-white/40 hover:bg-white/[0.08] transition-all duration-300 backdrop-blur-md focus:outline-none select-none shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
          aria-label="Discuss your project"
        >
          <span className="font-['Martian_Mono',monospace] text-[0.62rem] sm:text-[0.68rem] text-[#666666] group-hover:text-[#ffffff] transition-transform duration-300 group-hover:rotate-90 inline-block select-none">
            +
          </span>
          <Letter3DSwap
            as="span"
            rotateDirection="top"
            staggerDuration={0.015}
            staggerFrom="first"
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            mainClassName="flex-nowrap whitespace-nowrap [perspective:800px] font-['Martian_Mono',monospace] font-light text-[0.64rem] sm:text-[0.74rem] tracking-[0.06em] text-[#cccccc] select-none"
            frontFaceClassName="text-[#cccccc]"
            secondFaceClassName="text-[#ffffff]"
          >
            DISCUSS YOUR PROJECT
          </Letter3DSwap>
        </button>

        {/* Menu Button */}
        <button
          type="button"
          className="nav-action-btn group relative cursor-pointer flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full border border-white/15 bg-black/60 hover:border-white/40 hover:bg-white/[0.08] transition-all duration-300 backdrop-blur-md focus:outline-none select-none shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
          aria-label="Toggle menu"
        >
          <Letter3DSwap
            as="span"
            rotateDirection="top"
            staggerDuration={0.015}
            staggerFrom="first"
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            mainClassName="flex-nowrap whitespace-nowrap [perspective:800px] font-['Martian_Mono',monospace] font-light text-[0.64rem] sm:text-[0.74rem] tracking-[0.06em] text-[#cccccc] select-none"
            frontFaceClassName="text-[#cccccc]"
            secondFaceClassName="text-[#ffffff]"
          >
            MENU
          </Letter3DSwap>
          <span className="font-['Martian_Mono',monospace] text-[0.65rem] sm:text-[0.72rem] text-[#777777] group-hover:text-[#ffffff] transition-transform duration-300 group-hover:rotate-90 inline-block select-none ml-0.5">
            =
          </span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
