'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { chimeSynth } from '@/lib/chime-synth';

export interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const [modalTheme, setModalTheme] = useState<'light' | 'dark'>('dark');

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
      
      // Determine theme based on the Navbar's logo opacity
      const navLogoDark = document.querySelector('.nav-logo-dark');
      if (navLogoDark) {
        const opacity = window.getComputedStyle(navLogoDark).opacity;
        setModalTheme(parseFloat(opacity) > 0.5 ? 'light' : 'dark');
      } else {
        setModalTheme('dark');
      }

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
          className="fixed inset-0 z-[100] flex items-center justify-center lg:justify-end p-4 sm:p-6 lg:p-8 select-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/60 pointer-events-auto cursor-pointer"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="group/modal relative w-full h-full max-w-[380px] lg:max-w-[340px] bg-white data-[theme=dark]:bg-[#0a0a0a] border border-gray-200 data-[theme=dark]:border-white/10 rounded-xl overflow-hidden pointer-events-auto flex flex-col"
            data-theme={modalTheme}
            onClick={(e) => e.stopPropagation()}
          >

            {/* Scrollable Content */}
            <div className="flex-1 flex flex-col overflow-y-auto px-6 sm:px-8 py-10 sm:py-12 hide-scrollbar">
              <h2 className="font-['Familjen_Grotesk',sans-serif] text-[1.75rem] sm:text-[2rem] leading-tight tracking-[-0.03em] text-[#171717] group-data-[theme=dark]/modal:text-white font-medium mb-4">
                MAGNM
              </h2>
              
              <div className="space-y-6 text-[#171717]/70 group-data-[theme=dark]/modal:text-[#a3a3a3] text-[0.85rem] leading-[1.6]">
                <p>
                  We are an independent digital studio crafting meaningful brand experiences through strategy, design, and technology.
                </p>
                <p>
                  Our work bridges the gap between aesthetic precision and robust engineering, creating digital flagships that feel both intuitive and impactful.
                </p>
                <p>
                  From brand identity systems to complex 3D interactive web experiences, we focus on producing work that moves the needle and leaves a lasting impression.
                </p>
              </div>

              <div className="mt-auto pt-10">
                <div className="w-full h-[1px] bg-gray-200 group-data-[theme=dark]/modal:bg-white/10 mb-6"></div>
                <h3 className="font-['Familjen_Grotesk',sans-serif] text-[1.1rem] text-[#171717] group-data-[theme=dark]/modal:text-white mb-2">
                  Get in Touch
                </h3>
                <a 
                  href="mailto:hello@magnm.com" 
                  className="inline-block text-[#171717] hover:text-black group-data-[theme=dark]/modal:text-white group-data-[theme=dark]/modal:hover:text-[#ccc] transition-colors text-[0.85rem]"
                >
                  hello@magnm.com
                </a>

                {/* Close Cross Button centered at the bottom */}
                <div className="w-full mt-14 sm:mt-16 flex items-center justify-center">
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
