'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { chimeSynth } from '@/lib/chime-synth';
import BlurText from './BlurText';

export interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const [modalTheme, setModalTheme] = useState<'light' | 'dark'>('dark');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Lock body scroll and listen for Escape key when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      
      // Determine theme:
      // If currently scrolled on/to footer, modal card is always dark
      let isDark = false;
      const footerEl = document.getElementById('page-footer');
      if (footerEl) {
        const cs = window.getComputedStyle(footerEl);
        if (cs.visibility !== 'hidden' && parseFloat(cs.opacity || '1') > 0.3) {
          isDark = true;
        }
      }

      if (!isDark) {
        // Check if Navbar is in dark-elements mode (meaning current section has light background)
        const navLogoDark = document.querySelector('.nav-logo-dark');
        const isNavDarkLogo = navLogoDark ? parseFloat(window.getComputedStyle(navLogoDark).opacity) > 0.4 : false;

        // Check if Section 3 (#page-3) or Section 4 (#page-4) is visible in view
        const page3 = document.getElementById('page-3');
        const isPage3Active = page3 ? (window.getComputedStyle(page3).visibility !== 'hidden' && parseFloat(window.getComputedStyle(page3).opacity || '1') > 0.3) : false;

        // If either nav logo is dark or light page-3 is active, modal should match light surface
        if (isNavDarkLogo || isPage3Active) {
          isDark = false;
        } else {
          isDark = true;
        }
      }

      const newTheme = isDark ? 'dark' : 'light';
      setModalTheme(newTheme);

      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="about-modal-backdrop-container"
          className="fixed inset-0 z-[100] flex items-center justify-center lg:justify-end p-4 sm:p-6 lg:p-8 select-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 pointer-events-auto cursor-pointer"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, x: isMobile ? (typeof window !== 'undefined' ? window.innerWidth : '100%') : '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isMobile ? (typeof window !== 'undefined' ? window.innerWidth : '100%') : '100%' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="group/modal relative w-full h-full max-w-[380px] lg:max-w-[340px] bg-white data-[theme=dark]:bg-[#0a0a0a] border border-gray-200 data-[theme=dark]:border-white/10 rounded-xl overflow-hidden pointer-events-auto flex flex-col"
            data-theme={modalTheme}
            onClick={(e) => e.stopPropagation()}
            style={{
              willChange: 'transform, opacity',
              transform: 'translateZ(0)',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
            }}
          >

            {/* Scrollable Content */}
            <div className="flex-1 flex flex-col overflow-y-auto px-6 sm:px-8 py-10 sm:py-12 hide-scrollbar">
              <h2 className="font-['Familjen_Grotesk',sans-serif] text-[1.75rem] sm:text-[2rem] leading-tight tracking-[-0.03em] text-[#171717] group-data-[theme=dark]/modal:text-white font-medium mb-4 flex flex-wrap">
                {/* Mobile View: Crisp, instant, solid typography (zero blur filter GPU overhead) */}
                <span className="lg:hidden">MAGNM</span>
                {/* Desktop View: Split Blur reveal */}
                <span className="hidden lg:inline-flex">
                  <BlurText
                    text="MAGNM"
                    animateBy="words"
                    direction="none"
                    randomize={true}
                    delay={25}
                    startDelay={150}
                    stepDuration={0.3}
                    trigger={isOpen}
                    className="!inline-flex m-0 p-0 flex-wrap"
                    spanClassName="font-['Familjen_Grotesk',sans-serif] text-[1.75rem] sm:text-[2rem] leading-tight tracking-[-0.03em] text-[#171717] group-data-[theme=dark]/modal:text-white font-medium"
                  />
                </span>
              </h2>
              
              <div className="space-y-6 text-[#171717]/70 group-data-[theme=dark]/modal:text-[#a3a3a3] text-[0.85rem] leading-[1.6]">
                {/* Mobile View: Crisp, instant, solid typography */}
                <div className="space-y-6 lg:hidden">
                  <p className="m-0">
                    We are an independent digital studio crafting meaningful brand experiences through strategy, design, and technology.
                  </p>
                  <p className="m-0">
                    Our work bridges the gap between aesthetic precision and robust engineering, creating digital flagships that feel both intuitive and impactful.
                  </p>
                  <p className="m-0">
                    From brand identity systems to complex 3D interactive web experiences, we focus on producing work that moves the needle and leaves a lasting impression.
                  </p>
                </div>

                {/* Desktop View: Interactive Split/Blur Reveal */}
                <div className="hidden lg:block space-y-6">
                  <BlurText
                    text="We are an independent digital studio crafting meaningful brand experiences through strategy, design, and technology."
                    animateBy="words"
                    direction="none"
                    randomize={true}
                    delay={20}
                    startDelay={300}
                    stepDuration={0.25}
                    trigger={isOpen}
                    as="p"
                    className="m-0"
                    spanClassName="text-[#171717]/70 group-data-[theme=dark]/modal:text-[#a3a3a3] text-[0.85rem] leading-[1.6]"
                  />
                  <BlurText
                    text="Our work bridges the gap between aesthetic precision and robust engineering, creating digital flagships that feel both intuitive and impactful."
                    animateBy="words"
                    direction="none"
                    randomize={true}
                    delay={20}
                    startDelay={450}
                    stepDuration={0.25}
                    trigger={isOpen}
                    as="p"
                    className="m-0"
                    spanClassName="text-[#171717]/70 group-data-[theme=dark]/modal:text-[#a3a3a3] text-[0.85rem] leading-[1.6]"
                  />
                  <BlurText
                    text="From brand identity systems to complex 3D interactive web experiences, we focus on producing work that moves the needle and leaves a lasting impression."
                    animateBy="words"
                    direction="none"
                    randomize={true}
                    delay={20}
                    startDelay={600}
                    stepDuration={0.25}
                    trigger={isOpen}
                    as="p"
                    className="m-0"
                    spanClassName="text-[#171717]/70 group-data-[theme=dark]/modal:text-[#a3a3a3] text-[0.85rem] leading-[1.6]"
                  />
                </div>
              </div>

              <div className="mt-auto pt-10">
                <div className="w-full h-[1px] bg-gray-200 group-data-[theme=dark]/modal:bg-white/10 mb-6"></div>
                <h3 className="font-['Familjen_Grotesk',sans-serif] text-[1.1rem] text-[#171717] group-data-[theme=dark]/modal:text-white mb-2">
                  Get in Touch
                </h3>
                <a 
                  href="mailto:adarshpathade79@gmail.com" 
                  className="inline-block text-[#171717] hover:text-black group-data-[theme=dark]/modal:text-white group-data-[theme=dark]/modal:hover:text-[#ccc] transition-colors text-[0.85rem]"
                >
                  adarshpathade79@gmail.com
                </a>

                {/* Close Cross Button centered at the bottom (Mobile Only) */}
                <div className="w-full mt-14 sm:mt-16 flex items-center justify-center lg:hidden">
                  <button
                    type="button"
                    onClick={onClose}
                    className="group/close relative flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 group-data-[theme=dark]/modal:border-white/15 hover:border-black group-data-[theme=dark]/modal:hover:border-white/40 bg-transparent hover:bg-gray-100 group-data-[theme=dark]/modal:hover:bg-white/10 text-gray-400 group-data-[theme=dark]/modal:text-[#888888] hover:text-[#171717] group-data-[theme=dark]/modal:hover:text-white transition-all duration-200 focus:outline-none cursor-pointer"
                    aria-label="Close modal"
                    onMouseEnter={() => chimeSynth.playWoodTap(0.2)}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="transition-transform duration-300 ease-out group-hover/close:rotate-90"
                    >
                      <path
                        d="M1.5 1.5L10.5 10.5M1.5 10.5L10.5 1.5"
                        stroke="currentColor"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default AboutModal;
