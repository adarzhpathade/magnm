'use client';

import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import Navbar from './Navbar';
import Hero from './Hero';
import AboutManifesto from './AboutManifesto';
import SmoothScroll from './SmoothScroll';
import XylophoneHelix from './originkit/ui/xylophone-helix';
import Counter from './Counter';
import ParallaxStripTransition from './ParallaxStripTransition';
import OurWork, { type OurWorkHandle } from './OurWork';
import Projects, { type ProjectsHandle } from './Projects';
import { chimeSynth } from '@/lib/chime-synth';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function MainExperience() {
  const mainContainerRef = useRef<HTMLDivElement>(null);

  // Preloader state (temporarily disabled)
  const [isLoaded, setIsLoaded] = useState(true);
  const [loadProgress, setLoadProgress] = useState(100);
  const [triggerHeroReveal, setTriggerHeroReveal] = useState(true);
  const counterWrapperRef = useRef<HTMLDivElement>(null);

  // Pinned Stage & Layer Refs
  const pinnedStageRef = useRef<HTMLDivElement>(null);
  const heroAboutStageRef = useRef<HTMLDivElement>(null);
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const aboutContainerRef = useRef<HTMLDivElement>(null);

  // Inner element refs for Hero
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const heroMagnmRef = useRef<HTMLDivElement>(null);
  const heroTaglineRef = useRef<HTMLDivElement>(null);
  const heroEmblemRef = useRef<HTMLDivElement>(null);
  const heroBottomRef = useRef<HTMLDivElement>(null);

  // Navbar targets
  const navbarHeaderRef = useRef<HTMLElement>(null);
  const navBrandRef = useRef<HTMLDivElement>(null);
  const navActionsRef = useRef<HTMLDivElement>(null);

  // Parallax Strip Transition & Page 3 Refs
  const stripsRef = useRef<(HTMLDivElement | null)[]>([]);
  const zoomsRef = useRef<(HTMLDivElement | null)[]>([]);
  const stripTransitionContainerRef = useRef<HTMLDivElement>(null);
  const page3ContainerRef = useRef<HTMLDivElement>(null);
  const page3WrapperRef = useRef<HTMLDivElement>(null);
  const whiteBackdropRef = useRef<HTMLDivElement>(null);
  const page4ContainerRef = useRef<HTMLDivElement>(null);
  const mobileHeroSpacerRef = useRef<HTMLDivElement>(null);
  const mobilePage3SpacerRef = useRef<HTMLDivElement>(null);
  const ourWorkHandleRef = useRef<OurWorkHandle | null>(null);
  const projectsHandleRef = useRef<ProjectsHandle | null>(null);

  // Persistent 3D Wheel refs and controllers
  const wheelWrapperRef = useRef<HTMLDivElement>(null);
  const cameraControllerRef = useRef<{ tilt: number; sideTilt: number; scale?: number; interactive?: boolean }>({
    tilt: 36,
    sideTilt: -35,
    scale: 90,
    interactive: true,
  });

  const [wheelScale, setWheelScale] = useState(90);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    // Reset scroll to top on mount
    window.scrollTo(0, 0);

    const updateDimensions = () => {
      const width = window.innerWidth;
      setIsDesktop(width >= 1024);
      if (width < 640) {
        setWheelScale(54);
      } else if (width < 1024) {
        setWheelScale(70);
      } else {
        setWheelScale(90);
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

const TIMINGS = {
  heroDock: { start: 0.0, duration: 0.16 },
  navbarActions: { start: 0.12, duration: 0.10 },
  aboutManifesto: { start: 0.14, duration: 0.16 },
  wheel3D: { start: 0.0, duration: 0.26 },
  stripWipe: { start: 0.34, duration: 0.10 },
  servicesScroll: { start: 0.44, end: 0.70, duration: 0.26 },
  page3ScaleDown: { start: 0.70, duration: 0.12 },
  page4SlideUp: { start: 0.74, duration: 0.18 },
};

function animateSheetScaleDown(
  tl: gsap.core.Timeline,
  el: HTMLElement | null,
  start: number,
  duration = 0.12
) {
  if (!el) return;
  tl.to(
    el,
    {
      scale: 0.8,
      boxShadow: '0 25px 70px -15px rgba(0, 0, 0, 0.16), 0 0 1px rgba(0, 0, 0, 0.1)',
      transformOrigin: 'center center',
      duration,
      ease: 'power2.inOut',
    },
    start
  );
}

function animateSheetSlideUp(
  tl: gsap.core.Timeline,
  el: HTMLElement | null,
  start: number,
  duration = 0.12,
  onEnter?: () => void
) {
  if (!el) return;
  tl.fromTo(
    el,
    {
      y: '100%',
      opacity: 1,
    },
    {
      y: '0%',
      opacity: 1,
      duration,
      ease: 'power2.out',
    },
    start
  );
  if (onEnter) {
    tl.call(onEnter, [], start);
  }
}

  useGSAP(
    () => {
      if (!pinnedStageRef.current || !heroContainerRef.current) return;

      const mm = gsap.matchMedia();

      // Measure targets with pure geometry (unaffected by active transforms)
      const getTransformTargets = () => {
        const heroEl = heroMagnmRef.current;
        const navEl = navBrandRef.current;
        if (!heroEl || !navEl) return { scale: 0.22, x: 0, y: 0 };

        const heroText = heroEl.querySelector('p') || heroEl;
        const heroRect = heroText.getBoundingClientRect();
        const navRect = navEl.getBoundingClientRect();

        const currentX = (gsap.getProperty(heroEl, 'x') as number) || 0;
        const currentY = (gsap.getProperty(heroEl, 'y') as number) || 0;
        const currentScale = (gsap.getProperty(heroEl, 'scale') as number) || 1;

        const untransformedHeroLeft = heroRect.left - currentX;
        const untransformedHeroTop = heroRect.top - currentY;
        const untransformedHeroHeight = currentScale > 0 ? heroRect.height / currentScale : heroRect.height;

        const width = window.innerWidth;
        let targetScale = 0.22;
        if (width < 640) {
          targetScale = 0.32; // Mobile: ~28px
        } else if (width < 1024) {
          targetScale = 0.26; // Tablet: ~32px
        } else {
          targetScale = 0.22; // Desktop: ~36px
        }

        const deltaX = navRect.left - untransformedHeroLeft;
        const scaledHeight = untransformedHeroHeight * targetScale;
        const navCenterY = navRect.top + (navRect.height / 2);
        const targetTop = navCenterY - (scaledHeight / 2);
        const deltaY = targetTop - untransformedHeroTop;

        return { scale: targetScale, x: deltaX, y: deltaY };
      };

      const setupExperience = (baseScale: number, initialYOffset: number) => {
        // 1. Initial State Setup:
        // 3D Wheel starts directly at hero scale and position
        if (cameraControllerRef.current) {
          cameraControllerRef.current.tilt = 36;
          cameraControllerRef.current.sideTilt = -35;
          cameraControllerRef.current.scale = baseScale;
          cameraControllerRef.current.interactive = true;
        }

        if (wheelWrapperRef.current) {
          wheelWrapperRef.current.style.opacity = '1';
          wheelWrapperRef.current.style.transform = `translateY(${initialYOffset}px)`;
        }

        if (heroContainerRef.current) {
          heroContainerRef.current.style.pointerEvents = 'auto';
        }
        chimeSynth.suppressHover(1200);

        // About hidden at start (reveals on scroll)
        if (aboutContainerRef.current) {
          aboutContainerRef.current.style.opacity = '0';
          aboutContainerRef.current.style.transform = 'translateY(0px)';
          aboutContainerRef.current.style.pointerEvents = 'none';
        }

        // Navbar hidden at start (reveals on scroll)
        if (navBrandRef.current) {
          navBrandRef.current.style.opacity = '0';
          navBrandRef.current.style.transform = 'translateY(-14px)';
        }
        if (navActionsRef.current) {
          navActionsRef.current.style.opacity = '0';
          navActionsRef.current.style.transform = 'translateY(-14px)';
        }

        // Parallax strips initial state (hidden / clipped out)
        if (stripsRef.current) {
          stripsRef.current.forEach((el) => {
            if (el) gsap.set(el, { clipPath: 'inset(0 100% 0 0)' });
          });
        }
        if (zoomsRef.current) {
          zoomsRef.current.forEach((el) => {
            if (el) gsap.set(el, { scale: 1.15 });
          });
        }
        if (heroAboutStageRef.current) {
          gsap.set(heroAboutStageRef.current, { clearProps: 'all' });
          heroAboutStageRef.current.style.visibility = 'visible';
        }
        if (whiteBackdropRef.current) {
          gsap.set(whiteBackdropRef.current, { opacity: 0 });
        }
        if (page3WrapperRef.current) {
          gsap.set(page3WrapperRef.current, {
            clearProps: 'all',
            opacity: 0,
            scale: 1,
            boxShadow: 'none',
            transformOrigin: 'center center',
            pointerEvents: 'none',
          });
          page3WrapperRef.current.style.visibility = 'visible';
        }
        if (page3ContainerRef.current) {
          gsap.set(page3ContainerRef.current, { opacity: 0, filter: 'blur(16px)', y: 0 });
        }
        if (page4ContainerRef.current) {
          gsap.set(page4ContainerRef.current, {
            clearProps: 'all',
            y: '100%',
            opacity: 0,
            scale: 1,
            boxShadow: 'none',
            transformOrigin: 'center center',
            pointerEvents: 'none',
          });
          page4ContainerRef.current.style.visibility = 'visible';
        }

        // 3. ScrollTrigger timeline for Hero -> Section 2 -> Parallax Strips -> Page 3 -> Page 4 transition
        const cameraObj = {
          tilt: 36,
          sideTilt: -35,
          scale: baseScale,
          opacity: 1,
          y: initialYOffset,
        };

        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: pinnedStageRef.current,
            start: 'top top',
            end: '+=780%',
            pin: true,
            scrub: 0.15,
            snap: {
              snapTo: (progress: number) => {
                // Snap points for the 6 services in Phase 6: 0.44 -> 0.70
                const sStart = 0.44;
                const sEnd = 0.70;
                if (progress >= sStart - 0.02 && progress <= sEnd + 0.02) {
                  const step = (sEnd - sStart) / 5; // 6 services, 5 gaps
                  const nearestIdx = Math.round((progress - sStart) / step);
                  const clamped = Math.max(0, Math.min(5, nearestIdx));
                  return sStart + clamped * step;
                }
                // Snap to fully docked Page 4
                if (progress >= 0.90) {
                  return 1.0;
                }
                // Before services zone or during card transition — let it flow freely
                return progress;
              },
              duration: 0.35,
              delay: 0.08,
              ease: 'power2.inOut',
            },
            anticipatePin: 1,
            onUpdate: (self) => {
              chimeSynth.notifyScroll();
              const progress = self.progress;

              // Section 1 (Hero) vs Section 2 (About)
              if (heroContainerRef.current && aboutContainerRef.current) {
                if (progress > 0.12 && progress < 0.35) {
                  if (aboutContainerRef.current.style.pointerEvents !== 'auto') {
                    chimeSynth.suppressHover(500);
                  }
                  heroContainerRef.current.style.pointerEvents = 'none';
                  aboutContainerRef.current.style.pointerEvents = 'auto';
                } else if (progress <= 0.12) {
                  if (heroContainerRef.current.style.pointerEvents !== 'auto') {
                    chimeSynth.suppressHover(600);
                  }
                  heroContainerRef.current.style.pointerEvents = 'auto';
                  aboutContainerRef.current.style.pointerEvents = 'none';
                } else {
                  heroContainerRef.current.style.pointerEvents = 'none';
                  aboutContainerRef.current.style.pointerEvents = 'none';
                }
              }

              // Disable 3D wheel hover interaction after the about section
              if (cameraControllerRef.current) {
                cameraControllerRef.current.interactive = progress <= 0.30;
              }

              // Parallax strip transition container
              if (stripTransitionContainerRef.current) {
                stripTransitionContainerRef.current.style.pointerEvents =
                  progress > 0.42 && progress < 0.70 ? 'auto' : 'none';
              }

              // Section 3 (Our Work)
              if (page3WrapperRef.current) {
                const isPage3Active = progress > 0.38 && progress < 0.78;
                if (isPage3Active && page3WrapperRef.current.style.pointerEvents !== 'auto') {
                  chimeSynth.suppressHover(600);
                }
                page3WrapperRef.current.style.pointerEvents =
                  isPage3Active ? 'auto' : 'none';
              }

              // Section 4 (Page 4 Projects Card)
              if (page4ContainerRef.current) {
                const isPage4Active = progress >= 0.78;
                if (isPage4Active && page4ContainerRef.current.style.pointerEvents !== 'auto') {
                  chimeSynth.suppressHover(600);
                }
                page4ContainerRef.current.style.pointerEvents =
                  isPage4Active ? 'auto' : 'none';
              }
            },
          },
        });

        // Initial transform origin for pixel-perfect top-left scaling
        if (heroMagnmRef.current) {
          gsap.set(heroMagnmRef.current, { transformOrigin: '0 0' });
        }

        // Phase 1: Huge "MAGNM" scales down and docks prominently into the fixed Navbar (0.0 -> 0.16)
        if (heroMagnmRef.current) {
          scrollTl.to(
            heroMagnmRef.current,
            {
              scale: () => getTransformTargets().scale,
              x: () => getTransformTargets().x,
              y: () => getTransformTargets().y,
              transformOrigin: '0 0',
              ease: 'power2.inOut',
              duration: 0.16,
            },
            0
          );
        }

        // Secondary Hero elements individual words/items wipe out with randomized optical blur
        // Exclude elements inside buttons so GSAP doesn't override their hover-driven styles
        const allLeaveItems = heroSectionRef.current?.querySelectorAll('.leave-blur-item');
        const leaveItems = allLeaveItems
          ? Array.from(allLeaveItems).filter((el) => !el.closest('button'))
          : [];
        if (leaveItems && leaveItems.length > 0) {
          scrollTl.to(
            leaveItems,
            {
              filter: 'blur(20px)',
              opacity: 0,
              stagger: {
                amount: 0.06,
                from: 'random',
              },
              duration: 0.08,
              ease: 'power1.out',
            },
            0
          );
        }

        // Secondary Hero elements parent containers subtle lift and cleanup
        const secondaryHeroElements = [
          heroTaglineRef.current,
          heroEmblemRef.current,
          heroBottomRef.current,
        ].filter(Boolean);

        if (secondaryHeroElements.length > 0) {
          scrollTl.to(
            secondaryHeroElements,
            {
              y: -14,
              ease: 'power2.in',
              duration: 0.10,
            },
            0
          );
          scrollTl.to(
            secondaryHeroElements,
            {
              opacity: 0,
              duration: 0.02,
              ease: 'none',
            },
            0.10
          );
        }

        // Phase 2: As "MAGNM" finishes docking, Navbar right-side actions & Section 2 appear (0.12 -> 0.22)
        if (navActionsRef.current) {
          scrollTl.fromTo(
            navActionsRef.current,
            {
              opacity: 0,
              y: -14,
            },
            {
              opacity: 1,
              y: 0,
              ease: 'power2.out',
              duration: 0.10,
              immediateRender: false,
            },
            0.12
          );
        }

        if (aboutContainerRef.current) {
          scrollTl.fromTo(
            aboutContainerRef.current,
            {
              opacity: 0,
              y: 16,
            },
            {
              opacity: 1,
              y: 0,
              ease: 'power2.out',
              duration: 0.10,
              immediateRender: false,
            },
            0.12
          );
        }

        // Phase 3: 3D Wheel smooth rotation into vertical circle in the center (0.0 -> 0.26)
        scrollTl.to(
          cameraObj,
          {
            tilt: 90,
            sideTilt: 0,
            scale: baseScale * 0.74,
            opacity: 0.42,
            y: 0,
            ease: 'power2.inOut',
            duration: 0.26,
            onUpdate: () => {
              if (cameraControllerRef.current) {
                cameraControllerRef.current.tilt = cameraObj.tilt;
                cameraControllerRef.current.sideTilt = cameraObj.sideTilt;
                cameraControllerRef.current.scale = cameraObj.scale;
              }
              if (wheelWrapperRef.current) {
                wheelWrapperRef.current.style.opacity = `${cameraObj.opacity}`;
                wheelWrapperRef.current.style.transform = `translateY(${cameraObj.y}px)`;
              }
            },
          },
          0
        );

        // Phase 4: Section 2 Manifesto words progressive illumination (0.14 -> 0.30)
        const words = aboutContainerRef.current?.querySelectorAll('.word');
        if (words && words.length > 0) {
          scrollTl.to(
            words,
            {
              opacity: 1,
              filter: 'blur(0px)',
              stagger: 0.008,
              duration: 0.16,
              ease: 'power1.out',
            },
            0.14
          );
        }

        // Phase 5: Transition from Section 2 to Section 3 with Parallax Strip Slider effect (0.34 -> 0.44)
        // 5a. Outgoing Section 2 wipes out with blur and lifts smoothly
        if (aboutContainerRef.current) {
          scrollTl.to(
            aboutContainerRef.current,
            {
              opacity: 0,
              filter: 'blur(20px)',
              y: -24,
              duration: 0.06,
              ease: 'power2.in',
            },
            0.34
          );
        }

        // 5b. Outgoing 3D wheel fades out cleanly
        scrollTl.to(
          cameraObj,
          {
            opacity: 0,
            duration: 0.06,
            ease: 'power2.in',
            onUpdate: () => {
              if (wheelWrapperRef.current) {
                wheelWrapperRef.current.style.opacity = `${cameraObj.opacity}`;
              }
            },
          },
          0.34
        );

        // 5c. Incoming Parallax Strip wipe reveals light color #cccccc across 12 vertical strips
        const activeStrips = stripsRef.current.slice(0, 12).filter(Boolean);
        const activeZooms = zoomsRef.current.slice(0, 12).filter(Boolean);

        if (activeStrips.length > 0) {
          scrollTl.fromTo(
            activeStrips,
            { clipPath: 'inset(0 100% 0 0)' },
            {
              clipPath: 'inset(0 0% 0 0)',
              duration: 0.08,
              ease: 'power2.out',
              stagger: 0.006,
            },
            0.35
          );
        }

        if (activeZooms.length > 0) {
          scrollTl.fromTo(
            activeZooms,
            { scale: 1.15 },
            {
              scale: 1.0,
              duration: 0.09,
              ease: 'power2.out',
            },
            0.35
          );
        }

        // 5d. Navbar transitions to high-contrast dark text/borders for the light #cccccc surface
        const heroMagnmSpans = heroMagnmRef.current?.querySelectorAll('p, span');
        if (heroMagnmSpans && heroMagnmSpans.length > 0) {
          scrollTl.to(
            heroMagnmSpans,
            {
              color: '#171717',
              duration: 0.06,
              ease: 'power1.out',
            },
            0.38
          );
        }

        scrollTl.to(
          '.nav-brand-text',
          {
            color: '#171717',
            duration: 0.06,
            ease: 'power1.out',
          },
          0.38
        );

        if (document.querySelector('.nav-action-btn')) {
          scrollTl.to(
            '.nav-action-btn',
            {
              backgroundColor: 'rgba(23, 23, 23, 0.06)',
              borderColor: 'rgba(23, 23, 23, 0.18)',
              boxShadow: '0 4px 18px rgba(0,0,0,0.06)',
              duration: 0.06,
              ease: 'power1.out',
            },
            0.38
          );

          scrollTl.to(
            '.nav-action-btn span, .nav-action-btn .letter-swap-face',
            {
              color: '#171717',
              duration: 0.06,
              ease: 'power1.out',
            },
            0.38
          );
        }

        // 5e. Crossfade docked Hero MAGNM to fixed Navbar Brand
        if (heroMagnmRef.current) {
          scrollTl.to(
            heroMagnmRef.current,
            {
              opacity: 0,
              duration: 0.03,
              ease: 'none',
            },
            0.41
          );
        }

        if (navBrandRef.current) {
          scrollTl.to(
            navBrandRef.current,
            {
              opacity: 1,
              duration: 0.03,
              ease: 'none',
            },
            0.41
          );
        }

        // 5f. Page 3 (Our Work) reveals smoothly via signature optical blur as the parallax wipe completes
        if (page3WrapperRef.current) {
          scrollTl.fromTo(
            page3WrapperRef.current,
            {
              opacity: 0,
            },
            {
              opacity: 1,
              duration: 0.08,
              ease: 'power2.out',
              immediateRender: false,
            },
            0.36
          );
        }

        if (page3ContainerRef.current) {
          scrollTl.fromTo(
            page3ContainerRef.current,
            {
              opacity: 0,
              filter: 'blur(16px)',
              y: 0,
            },
            {
              opacity: 1,
              filter: 'blur(0px)',
              y: 0,
              duration: 0.08,
              ease: 'power2.out',
              immediateRender: false,
            },
            0.36
          );

          scrollTl.set('#page-3', { pointerEvents: 'auto' }, 0.36);
        }

        // Phase 6: Pinned Services Scroll (0.44 -> 0.70)
        // User scrolls through each and every service sequentially while section remains pinned!
        const servicesScrollObj = { index: 0 };
        scrollTl.to(
          servicesScrollObj,
          {
            index: 5,
            ease: 'none',
            duration: 0.26,
            onUpdate: () => {
              ourWorkHandleRef.current?.setPositionDirect(servicesScrollObj.index);
            },
          },
          0.44
        );

        // Phase 7: Page 3 Zoom-out / Scale-down to 80% & Pure White Backdrop Reveal
        if (whiteBackdropRef.current) {
          scrollTl.fromTo(
            whiteBackdropRef.current,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.08,
              ease: 'power2.out',
            },
            TIMINGS.page3ScaleDown.start
          );
        }

        animateSheetScaleDown(
          scrollTl,
          page3WrapperRef.current,
          TIMINGS.page3ScaleDown.start,
          TIMINGS.page3ScaleDown.duration
        );

        // Phase 8: Page 4 (Projects Card) slides up from bottom
        animateSheetSlideUp(
          scrollTl,
          page4ContainerRef.current,
          TIMINGS.page4SlideUp.start,
          TIMINGS.page4SlideUp.duration,
          () => {
            projectsHandleRef.current?.playEntry();
          }
        );
        scrollTl.set(page4ContainerRef.current, { pointerEvents: 'auto' }, 0.82);
      };

      // Desktop: >= 1024px (Pinned ScrollTrigger Experience)
      mm.add('(min-width: 1024px)', () => {
        setupExperience(90, 36);
      });

      // Mobile & Tablet: < 1024px (Wheel transition between Hero and About + natural vertical flow for Pages 3 & 4)
      mm.add('(max-width: 1023px)', () => {
        const baseMobileScale = 54;
        if (cameraControllerRef.current) {
          cameraControllerRef.current.tilt = 36;
          cameraControllerRef.current.sideTilt = -35;
          cameraControllerRef.current.scale = baseMobileScale;
          cameraControllerRef.current.interactive = true;
        }

        if (wheelWrapperRef.current) {
          wheelWrapperRef.current.style.opacity = '1';
          wheelWrapperRef.current.style.transform = 'translateY(0px)';
        }

        if (heroAboutStageRef.current) {
          gsap.set(heroAboutStageRef.current, { clearProps: 'all' });
          heroAboutStageRef.current.style.visibility = 'visible';
        }

        if (heroContainerRef.current) {
          heroContainerRef.current.style.pointerEvents = 'auto';
          heroContainerRef.current.style.opacity = '1';
        }
        if (heroMagnmRef.current) {
          gsap.set(heroMagnmRef.current, { clearProps: 'all', transformOrigin: '0 0' });
        }
        const secondaryElements = [
          heroTaglineRef.current,
          heroEmblemRef.current,
          heroBottomRef.current,
        ].filter(Boolean);
        if (secondaryElements.length > 0) {
          gsap.set(secondaryElements, { clearProps: 'all' });
        }

        if (aboutContainerRef.current) {
          gsap.set(aboutContainerRef.current, { clearProps: 'all' });
          aboutContainerRef.current.style.opacity = '0';
          aboutContainerRef.current.style.pointerEvents = 'none';
        }

        const words = aboutContainerRef.current?.querySelectorAll('.word');
        if (words && words.length > 0) {
          gsap.set(words, { opacity: 0.14, filter: 'blur(8px)' });
        }

        if (navBrandRef.current) {
          gsap.set(navBrandRef.current, { clearProps: 'all' });
          navBrandRef.current.style.opacity = '0';
        }
        if (navActionsRef.current) {
          gsap.set(navActionsRef.current, { clearProps: 'all' });
          navActionsRef.current.style.opacity = '1';
        }

        // Section 3 & 4: natural document flow
        if (page3WrapperRef.current) {
          gsap.set(page3WrapperRef.current, { clearProps: 'all' });
          page3WrapperRef.current.style.opacity = '1';
          page3WrapperRef.current.style.visibility = 'visible';
          page3WrapperRef.current.style.pointerEvents = 'auto';
        }
        if (page3ContainerRef.current) {
          gsap.set(page3ContainerRef.current, { clearProps: 'all' });
          page3ContainerRef.current.style.opacity = '1';
          page3ContainerRef.current.style.filter = 'none';
        }
        if (page4ContainerRef.current) {
          gsap.set(page4ContainerRef.current, { clearProps: 'all' });
          page4ContainerRef.current.style.opacity = '1';
          page4ContainerRef.current.style.visibility = 'visible';
          page4ContainerRef.current.style.pointerEvents = 'auto';
        }

        // Dedicated Mobile ScrollTrigger timeline for Hero -> About Wheel Transition
        const mobileCameraObj = {
          tilt: 36,
          sideTilt: -35,
          scale: baseMobileScale,
          opacity: 1,
        };

        const mobileTl = gsap.timeline({
          scrollTrigger: {
            trigger: pinnedStageRef.current,
            start: 'top top',
            end: () => `+=${window.innerHeight * 1.1}px`,
            scrub: 0.35,
            onUpdate: (self) => {
              chimeSynth.notifyScroll();
              const p = self.progress;

              if (cameraControllerRef.current) {
                cameraControllerRef.current.interactive = p <= 0.2;
              }
              if (heroContainerRef.current && aboutContainerRef.current) {
                heroContainerRef.current.style.pointerEvents = p < 0.4 ? 'auto' : 'none';
                aboutContainerRef.current.style.pointerEvents = p >= 0.4 ? 'auto' : 'none';
              }
            },
          },
        });

        // 1. Huge "MAGNM" scales down and docks into navbar (0.0 -> 0.40)
        if (heroMagnmRef.current) {
          mobileTl.to(
            heroMagnmRef.current,
            {
              scale: () => getTransformTargets().scale,
              x: () => getTransformTargets().x,
              y: () => getTransformTargets().y,
              transformOrigin: '0 0',
              ease: 'power2.inOut',
              duration: 0.40,
            },
            0
          );
        }

        // 2. Hero secondary items wipe out with optical blur (0.0 -> 0.25)
        const allLeaveItems = heroSectionRef.current?.querySelectorAll('.leave-blur-item');
        const leaveItems = allLeaveItems
          ? Array.from(allLeaveItems).filter((el) => !el.closest('button'))
          : [];
        if (leaveItems.length > 0) {
          mobileTl.to(
            leaveItems,
            {
              filter: 'blur(16px)',
              opacity: 0,
              stagger: {
                amount: 0.08,
                from: 'random',
              },
              duration: 0.25,
              ease: 'power1.out',
            },
            0
          );
        }

        if (secondaryElements.length > 0) {
          mobileTl.to(
            secondaryElements,
            {
              y: -14,
              opacity: 0,
              duration: 0.25,
              ease: 'power2.in',
            },
            0
          );
        }

        // 3. 3D Wheel rotates from hero tilt into upright vertical circle in center (0.0 -> 0.55)
        mobileTl.to(
          mobileCameraObj,
          {
            tilt: 90,
            sideTilt: 0,
            scale: baseMobileScale * 0.74,
            opacity: 0.42,
            ease: 'power2.inOut',
            duration: 0.55,
            onUpdate: () => {
              if (cameraControllerRef.current) {
                cameraControllerRef.current.tilt = mobileCameraObj.tilt;
                cameraControllerRef.current.sideTilt = mobileCameraObj.sideTilt;
                cameraControllerRef.current.scale = mobileCameraObj.scale;
              }
              if (wheelWrapperRef.current) {
                wheelWrapperRef.current.style.opacity = `${mobileCameraObj.opacity}`;
              }
            },
          },
          0
        );

        // 4. Section 2 Manifesto fades in (0.25 -> 0.55)
        if (aboutContainerRef.current) {
          mobileTl.fromTo(
            aboutContainerRef.current,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, ease: 'power2.out', duration: 0.30 },
            0.25
          );
        }

        // 5. Manifesto words illuminate progressively across the 3D wheel (0.35 -> 0.85)
        if (words && words.length > 0) {
          mobileTl.to(
            words,
            {
              opacity: 1,
              filter: 'blur(0px)',
              stagger: 0.015,
              duration: 0.50,
              ease: 'power1.out',
            },
            0.35
          );
        }

        // 6. Crossfade docked Hero MAGNM to fixed Navbar Brand (0.50 -> 0.60)
        if (heroMagnmRef.current) {
          mobileTl.to(heroMagnmRef.current, { opacity: 0, duration: 0.10 }, 0.50);
        }
        if (navBrandRef.current) {
          mobileTl.to(navBrandRef.current, { opacity: 1, duration: 0.10 }, 0.50);
        }

        // Section 3 slides ON TO Page 2:
        // As Section 3's top moves from bottom of viewport to top of viewport,
        // Page 2 underneath subtly scales down and dims, while remaining held at top: 0
        const slideOnTl = gsap.timeline({
          scrollTrigger: {
            trigger: page3WrapperRef.current,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
            onUpdate: (self) => {
              if (heroAboutStageRef.current) {
                // When Section 3 has fully covered Page 2, hide heroAboutStage to free GPU
                heroAboutStageRef.current.style.visibility =
                  self.progress >= 0.99 ? 'hidden' : 'visible';
              }
            },
          },
        });

        if (heroAboutStageRef.current) {
          slideOnTl.to(
            heroAboutStageRef.current,
            {
              scale: 0.94,
              opacity: 0.35,
              ease: 'none',
            },
            0
          );
        }

        // Section 4 slides ON TO Page 3 in the exact same way:
        // As Section 4's top moves from bottom of viewport to top of viewport,
        // Page 3 underneath subtly scales down and dims, while remaining held at top: 0
        const slideOnP4Tl = gsap.timeline({
          scrollTrigger: {
            trigger: page4ContainerRef.current,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
            onUpdate: (self) => {
              if (page3WrapperRef.current) {
                // When Section 4 has fully covered Page 3, hide page3Wrapper to free GPU
                page3WrapperRef.current.style.visibility =
                  self.progress >= 0.99 ? 'hidden' : 'visible';
              }
              if (self.progress > 0.05) {
                projectsHandleRef.current?.playEntry();
              }
            },
          },
        });

        if (page3WrapperRef.current) {
          slideOnP4Tl.to(
            page3WrapperRef.current,
            {
              scale: 0.94,
              opacity: 0.35,
              ease: 'none',
            },
            0
          );
        }

        ScrollTrigger.refresh();

        // Navbar dynamic color updater when scrolling through Section 3 & 4
        const updateMobileNav = () => {
          const p3El = page3WrapperRef.current;
          if (p3El && navBrandRef.current) {
            const p3Top = p3El.getBoundingClientRect().top;
            const isLightBg = p3Top <= 60;
            const brandText = navBrandRef.current.querySelector('.nav-brand-text') as HTMLElement | null;
            if (brandText) {
              brandText.style.color = isLightBg ? '#171717' : '#cccccc';
            }
          }
        };

        window.addEventListener('scroll', updateMobileNav, { passive: true });
        updateMobileNav();

        return () => {
          window.removeEventListener('scroll', updateMobileNav);
        };
      });

      return () => mm.revert();
    },
    { scope: mainContainerRef }
  );

  return (
    <SmoothScroll>
      <div ref={mainContainerRef} className="relative w-full min-h-screen bg-[#000000] text-[#cccccc] overflow-x-clip lg:overflow-x-hidden">
        {/* Sticky Fixed Navbar (z-50) */}
        <Navbar
          headerRef={navbarHeaderRef}
          navBrandRef={navBrandRef}
          navActionsRef={navActionsRef}
        />

        {/* Preloader Number (Positioned directly below the 20% centered wheel) */}
        {!isLoaded && (
          <div
            ref={counterWrapperRef}
            className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none select-none transition-opacity duration-300"
          >
            <div className="translate-y-[76px] sm:translate-y-[84px] font-['Martian_Mono',monospace] text-xs sm:text-sm tracking-[0.14em] text-[#cccccc] font-light tabular-nums flex items-baseline justify-center">
              <Counter
                value={loadProgress}
                places={[100, 10, 1]}
                fontSize={13}
                padding={5}
                gap={1}
                textColor="#cccccc"
                fontWeight={300}
                gradientHeight={3}
                gradientFrom="#000000"
                gradientTo="transparent"
                horizontalPadding={0}
                containerStyle={{ display: 'inline-flex', alignItems: 'center' }}
              />
              <span className="text-[0.68rem] text-[#777777] font-light select-none ml-1">
                %
              </span>
            </div>
          </div>
        )}

        {/* Master Stage: Pinned on Desktop, Natural Vertical Flow on Mobile */}
        <div ref={pinnedStageRef} className="relative z-20 w-full lg:h-screen lg:overflow-hidden">
          {/* Hero & About Combined Stage (Sticky on Mobile so Section 3 slides directly on to it) */}
          <div
            ref={heroAboutStageRef}
            className="sticky top-0 z-20 w-full h-[100svh] lg:h-full lg:absolute lg:inset-0 overflow-hidden bg-[#000000] will-change-transform"
          >
            {/* Section 1: Hero */}
            <div
              ref={heroContainerRef}
              className="absolute inset-0 w-full h-full pointer-events-auto flex flex-col justify-between"
            >
              <Hero
                showWheel={false}
                triggerReveal={triggerHeroReveal}
                heroSectionRef={heroSectionRef}
                heroMagnmRef={heroMagnmRef}
                heroTaglineRef={heroTaglineRef}
                heroEmblemRef={heroEmblemRef}
                heroBottomRef={heroBottomRef}
              />
            </div>

            {/* Persistent 3D Wheel */}
            <div
              ref={wheelWrapperRef}
              className="absolute inset-0 w-full h-full z-20 pointer-events-none flex items-center justify-center will-change-transform"
            >
              <div className="w-full h-full flex items-center justify-center">
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
                  cameraControllerRef={cameraControllerRef}
                />
              </div>
            </div>

            {/* Section 2: Centered About Manifesto */}
            <div
              ref={aboutContainerRef}
              className="absolute inset-0 z-25 w-full h-full pointer-events-none opacity-0 bg-transparent text-[#cccccc] flex items-center justify-center will-change-transform"
            >
              <AboutManifesto skipInternalTrigger={true} />
            </div>
          </div>

          {/* Mobile Scroll Spacer: track for Hero -> About wheel transition and manifesto reveal */}
          <div
            ref={mobileHeroSpacerRef}
            className="relative w-full h-[110svh] lg:hidden pointer-events-none"
            aria-hidden="true"
          />

          {/* Section 3 Wipe: Parallax Strip Slider Transition (Desktop Only) */}
          <div className="hidden lg:block">
            <ParallaxStripTransition
              stripCount={12}
              stripsRef={stripsRef}
              zoomsRef={zoomsRef}
              containerRef={stripTransitionContainerRef}
              bgColor="#cccccc"
            />
          </div>

          {/* Pure White Backdrop (Desktop Only) */}
          <div
            id="white-stage-backdrop"
            ref={whiteBackdropRef}
            className="hidden lg:block absolute inset-0 z-32 w-full h-full bg-[#ffffff] pointer-events-none opacity-0 will-change-[opacity]"
          />

          {/* Section 3 (Page 3): Our Work — sticky on mobile so Section 4 slides directly on to it */}
          <div
            id="page-3"
            ref={page3WrapperRef}
            className="sticky top-0 lg:absolute lg:inset-0 z-35 w-full h-[100svh] lg:h-full lg:min-h-0 pointer-events-auto lg:pointer-events-none overflow-hidden bg-[#cccccc] text-[#171717] opacity-100 lg:opacity-0 will-change-transform flex items-center justify-center rounded-none shadow-[0_-25px_60px_rgba(0,0,0,0.35)] lg:shadow-none"
          >
            <OurWork ref={ourWorkHandleRef} containerRef={page3ContainerRef} />
          </div>

          {/* Mobile Scroll Spacer: track for Section 3 viewing before Section 4 slides on */}
          <div
            ref={mobilePage3SpacerRef}
            className="relative w-full h-[25svh] lg:hidden pointer-events-none"
            aria-hidden="true"
          />

          {/* Section 4 (Page 4): Projects Showcase — slides up on to Page 3 on mobile */}
          <div
            id="page-4"
            ref={page4ContainerRef}
            className="sticky top-0 lg:absolute lg:inset-0 z-40 w-full h-[100svh] lg:h-full lg:min-h-0 pointer-events-auto lg:pointer-events-none opacity-100 lg:opacity-0 bg-[#cccccc] text-[#171717] overflow-hidden shadow-[0_-25px_60px_rgba(0,0,0,0.35)] lg:shadow-[0_-25px_80px_rgba(0,0,0,0.22)] rounded-none flex items-center justify-center will-change-transform"
          >
            <Projects ref={projectsHandleRef} />
          </div>

          {/* Mobile Scroll Spacer: allows Section 4 to stay docked at top: 0 comfortably */}
          <div
            className="relative w-full h-[25svh] lg:hidden pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </div>
    </SmoothScroll>
  );
}
