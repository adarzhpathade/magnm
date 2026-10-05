'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { chimeSynth } from '@/lib/chime-synth';
import LetterSwapPingPong from './ui/letter-swap-pingpong-anim';
import BlurText from './BlurText';

export interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  source?: 'navbar' | 'hero' | 'footer';
}

const SERVICES_OPTIONS = [
  { value: 'branding', label: 'Branding & Identity' },
  { value: 'web', label: 'Web Design & Development' },
  { value: 'app', label: 'App Development' },
  { value: '3d', label: '3D & Motion' },
  { value: 'other', label: 'Other' }
];

export const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, source = 'navbar' }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [modalTheme, setModalTheme] = useState<'light' | 'dark'>('dark');
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');
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
      // If triggered from footer or hero, modal card is always dark
      let isDark = source === 'footer' || source === 'hero';

      if (!isDark) {
        // Check if footer element is ACTUALLY visible and active in viewport
        const footerEl = document.getElementById('page-footer');
        if (footerEl) {
          const cs = window.getComputedStyle(footerEl);
          if (cs.visibility !== 'hidden' && parseFloat(cs.opacity || '1') > 0.3) {
            isDark = true;
          }
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
  }, [isOpen, onClose, source]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedService) {
      setSubmitError('Please select a service.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    // Add Web3Forms access key
    // You can get this key for free at https://web3forms.com/
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    
    if (!accessKey) {
      setSubmitError('Configuration error: Access key is missing.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          access_key: accessKey,
          ...data
        })
      });

      const result = await response.json();

      if (response.status === 200) {
        setSubmitSuccess(true);
        chimeSynth.playSuccessChime(); // Harmonic acoustic success resolution
        
        // Reset after 3 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
          onClose();
        }, 3000);
      } else {
        setSubmitError(result.message || 'Something went wrong. Please try again later.');
      }
    } catch (error) {
      setSubmitError('Failed to send inquiry. Please check your network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const [mounted, setMounted] = useState(false);
   
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="project-modal-backdrop-container"
          className="fixed inset-0 z-[100] flex items-center justify-center lg:justify-end p-4 sm:p-6 lg:p-8 lg:py-10 select-none overflow-hidden"
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
            <div className="flex-1 flex flex-col justify-center overflow-y-auto px-6 sm:px-8 py-6 sm:py-8 hide-scrollbar">
              <h2 className="font-['Familjen_Grotesk',sans-serif] text-[1.75rem] sm:text-[2rem] leading-tight tracking-[-0.03em] text-[#171717] group-data-[theme=dark]/modal:text-white font-medium mb-1.5 flex flex-wrap">
                {/* Mobile View: Crisp, instant, solid typography (zero blur filter GPU overhead) */}
                <span className="lg:hidden">Let&apos;s build something great.</span>
                {/* Desktop View: Split Blur reveal */}
                <span className="hidden lg:inline-flex">
                  <BlurText
                    text="Let's build something great."
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

              {/* Mobile Subtext: Crisp and instant */}
              <p className="lg:hidden text-gray-500 group-data-[theme=dark]/modal:text-[#a3a3a3] text-[0.8rem] leading-snug mb-8 max-w-[90%]">
                Tell us about your project, we usually reply within one business day.
              </p>
              {/* Desktop Subtext: Interactive Blur reveal */}
              <div className="hidden lg:block">
                <BlurText
                  text="Tell us about your project, we usually reply within one business day."
                  animateBy="words"
                  direction="none"
                  randomize={true}
                  delay={20}
                  startDelay={300}
                  stepDuration={0.25}
                  trigger={isOpen}
                  as="p"
                  className="text-gray-500 group-data-[theme=dark]/modal:text-[#a3a3a3] text-[0.8rem] leading-snug mb-8 max-w-[90%]"
                  spanClassName="text-gray-500 group-data-[theme=dark]/modal:text-[#a3a3a3] text-[0.8rem] leading-snug"
                />
              </div>

              {submitSuccess ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-50 group-data-[theme=dark]/modal:bg-green-950/30 text-green-600 group-data-[theme=dark]/modal:text-green-400 flex items-center justify-center mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h3 className="text-xl text-[#171717] group-data-[theme=dark]/modal:text-white font-medium mb-2">Inquiry Sent</h3>
                  <p className="text-gray-500 group-data-[theme=dark]/modal:text-[#a3a3a3] text-sm">We&apos;ve received your details and will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Full Name"
                    className="w-full px-0 py-3.5 rounded-none border-b border-gray-300 group-data-[theme=dark]/modal:border-white/20 bg-transparent text-[#171717] group-data-[theme=dark]/modal:text-white placeholder-gray-400 group-data-[theme=dark]/modal:placeholder-white/30 focus:outline-none focus:border-black group-data-[theme=dark]/modal:focus:border-white transition-colors text-[0.75rem]"
                  />
                  
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Email address"
                    className="w-full px-0 py-3.5 rounded-none border-b border-gray-300 group-data-[theme=dark]/modal:border-white/20 bg-transparent text-[#171717] group-data-[theme=dark]/modal:text-white placeholder-gray-400 group-data-[theme=dark]/modal:placeholder-white/30 focus:outline-none focus:border-black group-data-[theme=dark]/modal:focus:border-white transition-colors text-[0.75rem]"
                  />
                  
                  <input
                    type="text"
                    name="company"
                    placeholder="Company / Website name"
                    className="w-full px-0 py-3.5 rounded-none border-b border-gray-300 group-data-[theme=dark]/modal:border-white/20 bg-transparent text-[#171717] group-data-[theme=dark]/modal:text-white placeholder-gray-400 group-data-[theme=dark]/modal:placeholder-white/30 focus:outline-none focus:border-black group-data-[theme=dark]/modal:focus:border-white transition-colors text-[0.75rem]"
                  />
                  
                  <div className="relative">
                    <input type="hidden" name="service" value={selectedService} />
                    
                    <button
                      type="button"
                      onClick={() => setIsServiceOpen(!isServiceOpen)}
                      className={`w-full px-0 py-3.5 rounded-none border-b border-gray-300 group-data-[theme=dark]/modal:border-white/20 bg-transparent text-left focus:outline-none focus:border-black group-data-[theme=dark]/modal:focus:border-white transition-colors text-[0.75rem] flex items-center justify-between ${!selectedService ? 'text-gray-400 group-data-[theme=dark]/modal:text-white/30' : 'text-[#171717] group-data-[theme=dark]/modal:text-white'}`}
                    >
                      <span>{selectedService ? SERVICES_OPTIONS.find(s => s.value === selectedService)?.label : 'Select a service'}</span>
                      <div className={`transition-transform duration-200 text-gray-400 group-data-[theme=dark]/modal:text-[#a3a3a3] ${isServiceOpen ? 'rotate-180' : ''}`}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 1V9M5 9L1 5M5 9L9 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </button>

                    <AnimatePresence>
                      {isServiceOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setIsServiceOpen(false)} />
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 right-0 mt-1 z-50 bg-white group-data-[theme=dark]/modal:bg-[#111111] border border-gray-200 group-data-[theme=dark]/modal:border-white/10 rounded-xl overflow-hidden shadow-xl"
                          >
                            {SERVICES_OPTIONS.map((s) => (
                              <button
                                key={s.value}
                                type="button"
                                onClick={() => {
                                  setSelectedService(s.value);
                                  setIsServiceOpen(false);
                                  setSubmitError('');
                                }}
                                className="w-full px-4 py-2.5 text-left text-[0.75rem] text-[#171717] group-data-[theme=dark]/modal:text-white hover:bg-gray-100 group-data-[theme=dark]/modal:hover:bg-white/10 transition-colors"
                              >
                                {s.label}
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <textarea
                    name="details"
                    required
                    placeholder="Share a little about your goals, timeline, and requirements..."
                    rows={3}
                    className="w-full px-0 py-3.5 rounded-none border-b border-gray-300 group-data-[theme=dark]/modal:border-white/20 bg-transparent text-[#171717] group-data-[theme=dark]/modal:text-white placeholder-gray-400 group-data-[theme=dark]/modal:placeholder-white/30 focus:outline-none focus:border-black group-data-[theme=dark]/modal:focus:border-white transition-colors text-[0.75rem] resize-none"
                  />
                  


                  {submitError && (
                    <div className="text-red-500 text-sm mt-1">{submitError}</div>
                  )}

                  {/* Submit Button aligned with design */}
                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative w-full flex items-center justify-center py-2.5 bg-[#171717] text-white hover:bg-black group-data-[theme=dark]/modal:bg-white group-data-[theme=dark]/modal:text-[#171717] group-data-[theme=dark]/modal:hover:bg-gray-200 rounded-lg focus:outline-none disabled:opacity-50 transition-colors"
                      onMouseEnter={() => chimeSynth.playAcousticHover('vibraphone', 0.2, 4)}
                    >
                      {isSubmitting ? (
                        <span className="font-['Martian_Mono',monospace] text-[0.75rem] tracking-[0.05em] font-medium uppercase">SENDING...</span>
                      ) : (
                        <LetterSwapPingPong
                          label="SEND INQUIRY"
                          className="font-['Martian_Mono',monospace] text-[0.75rem] tracking-[0.05em] font-medium uppercase"
                        />
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Footer Section */}
              <div className="mt-3 lg:mt-8 flex flex-col items-center w-full">
                {/* Close Button (Mobile Only) */}
                <div className="w-full flex items-center justify-center lg:hidden mb-5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="group relative w-full flex items-center justify-center py-2.5 border border-gray-300 group-data-[theme=dark]/modal:border-white/20 text-[#171717] group-data-[theme=dark]/modal:text-white hover:bg-gray-100 group-data-[theme=dark]/modal:hover:bg-white/10 rounded-lg focus:outline-none transition-colors cursor-pointer"
                    aria-label="Close form"
                    onMouseEnter={() => chimeSynth.playWoodTap(0.2)}
                  >
                    <LetterSwapPingPong
                      label="CLOSE"
                      className="font-['Martian_Mono',monospace] text-[0.75rem] tracking-[0.05em] font-medium uppercase"
                    />
                  </button>
                </div>

                <div className="text-center text-[0.85rem] text-gray-500 group-data-[theme=dark]/modal:text-[#a3a3a3] flex flex-col items-center gap-0.5">
                  <span>Prefer email?</span>
                  <a
                    href="mailto:adarshpathade79@gmail.com"
                    className="text-[#171717] hover:text-black group-data-[theme=dark]/modal:text-white hover:underline group-data-[theme=dark]/modal:hover:text-[#ccc] transition-colors"
                  >
                    adarshpathade79@gmail.com
                  </a>
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

export default ProjectModal;
