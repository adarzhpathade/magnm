'use client';

import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { chimeSynth } from '@/lib/chime-synth';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const SmoothScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    let updateTicker: ((time: number) => void) | null = null;
    let cleanupNative: (() => void) | null = null;

    const setupScroll = () => {
      const isDesktop = window.innerWidth >= 1024;

      // Clean up any existing instances
      if (updateTicker) {
        gsap.ticker.remove(updateTicker);
        updateTicker = null;
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      if (cleanupNative) {
        cleanupNative();
        cleanupNative = null;
      }

      if (isDesktop) {
        // Desktop: Lenis smooth wheel scrolling synchronized with GSAP ticker
        const lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          wheelMultiplier: 1.0,
          syncTouch: false,
          touchMultiplier: 1.0,
        });

        lenisRef.current = lenis;

        lenis.on('scroll', () => {
          ScrollTrigger.update();
          chimeSynth.notifyScroll();
        });

        updateTicker = (time: number) => {
          lenis.raf(time * 1000);
        };

        gsap.ticker.add(updateTicker);
        gsap.ticker.lagSmoothing(0);
      } else {
        // Mobile / Phones: Pure native momentum touch scrolling
        const onNativeScroll = () => {
          ScrollTrigger.update();
          chimeSynth.notifyScroll();
        };

        window.addEventListener('scroll', onNativeScroll, { passive: true });
        cleanupNative = () => {
          window.removeEventListener('scroll', onNativeScroll);
        };
      }
    };

    setupScroll();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setupScroll();
        ScrollTrigger.refresh();
      }, 150);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
      if (cleanupNative) cleanupNative();
      if (updateTicker) gsap.ticker.remove(updateTicker);
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;

