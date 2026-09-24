'use client';

import React from 'react';

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

      {/* Right Slot: Nav Options (reserved for future options) */}
      <div
        ref={navActionsRef}
        className="pointer-events-auto flex items-center gap-2 sm:gap-3 min-h-[44px] h-[44px] opacity-0"
      />
    </header>
  );
};

export default Navbar;
