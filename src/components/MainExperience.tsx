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
import ProjectShowcase, { type ProjectShowcaseHandle } from './ProjectShowcase';

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
  const ourWorkHandleRef = useRef<OurWorkHandle | null>(null);

  // Section 4 (Page 4) Refs
  const page4ContainerRef = useRef<HTMLDivElement>(null);
  const projectShowcaseHandleRef = useRef<ProjectShowcaseHandle | null>(null);

  // Persistent 3D Wheel refs and controllers
  const wheelWrapperRef = useRef<HTMLDivElement>(null);
  const cameraControllerRef = useRef<{ tilt: number; sideTilt: number; scale?: number }>({
    tilt: 36,
    sideTilt: -35,
    scale: 90,
  });

  const [wheelScale, setWheelScale] = useState(90);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    // Reset scroll to top on mount
    window.scrollTo(0, 0);

    const updateWheelScale = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setWheelScale(48);
      } else if (width < 1024) {
        setWheelScale(70);
      } else {
        setWheelScale(90);
      }
    };
    updateWheelScale();
    window.addEventListener('resize', updateWheelScale);
    return () => window.removeEventListener('resize', updateWheelScale);
  }, []);

  useGSAP(
    () => {
      if (!pinnedStageRef.current || !heroContainerRef.current) return;

      const mm = gsap.matchMedia();
      const setupExperience = (baseScale: number, initialYOffset: number) => {
        // 1. Initial State Setup:
        // 3D Wheel starts directly at hero scale and position
        if (cameraControllerRef.current) {
          cameraControllerRef.current.tilt = 36;
          cameraControllerRef.current.sideTilt = -35;
          cameraControllerRef.current.scale = baseScale;
        }

        if (wheelWrapperRef.current) {
          wheelWrapperRef.current.style.opacity = '1';
          wheelWrapperRef.current.style.transform = `translateY(${initialYOffset}px)`;
        }

        // About hidden at start (reveals on scroll)
        if (aboutContainerRef.current) {
          aboutContainerRef.current.style.opacity = '0';
          aboutContainerRef.current.style.transform = 'translateY(0px)';
          aboutContainerRef.current.style.pointerEvents = 'none';
        }

        // Navbar hidden at start (reveals on scroll)
        if (navBrandRef.current) {
          navBrandRef.current.style.opacity = '0';
          navBrandRef.current.style.transform = 'translateY(0px)';
        }
        if (navActionsRef.current) {
          navActionsRef.current.style.opacity = '0';
          navActionsRef.current.style.transform = 'translateY(-14px)';
        }

        // Section 3 Parallax strips initial state (hidden / clipped out horizontally)
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
        if (page3ContainerRef.current) {
          gsap.set(page3ContainerRef.current, { opacity: 0, filter: 'blur(16px)', y: 0 });
        }
        if (page4ContainerRef.current) {
          gsap.set(page4ContainerRef.current, { y: '100%' });
        }

        // 3. ScrollTrigger timeline for Hero -> Section 2 -> Section 3 transition
        const cameraObj = {
          tilt: 36,
          sideTilt: -35,
          scale: baseScale,
          opacity: 1,
          y: initialYOffset,
        };

        const TOTAL_DUR = 0.77;
        const S_START = 0.28 / TOTAL_DUR; // Services range start
        const S_END = 0.58 / TOTAL_DUR;   // Services range end

        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: pinnedStageRef.current,
            start: 'top top',
            end: '+=650%',
            pin: true,
            scrub: 0.15,
            snap: {
              snapTo: (progress: number) => {
                // Only snap when in the services scroll range
                if (progress >= S_START - 0.015 && progress <= S_END + 0.015) {
                  const step = (S_END - S_START) / 5; // 6 services, 5 gaps
                  const nearestIdx = Math.round((progress - S_START) / step);
                  const clamped = Math.max(0, Math.min(5, nearestIdx));
                  return S_START + clamped * step;
                }
                // Before or after services zone — don't snap, let it flow freely
                return progress;
              },
              duration: 0.35,
              delay: 0.08,
              ease: 'power2.inOut',
            },
            anticipatePin: 1,
            onUpdate: (self) => {
              const progress = self.progress;
              if (heroContainerRef.current && aboutContainerRef.current) {
                if (progress > 0.08 / TOTAL_DUR && progress < 0.22 / TOTAL_DUR) {
                  heroContainerRef.current.style.pointerEvents = 'none';
                  aboutContainerRef.current.style.pointerEvents = 'auto';
                } else if (progress <= 0.08 / TOTAL_DUR) {
                  heroContainerRef.current.style.pointerEvents = 'auto';
                  aboutContainerRef.current.style.pointerEvents = 'none';
                } else {
                  heroContainerRef.current.style.pointerEvents = 'none';
                  aboutContainerRef.current.style.pointerEvents = 'none';
                }
              }
              if (stripTransitionContainerRef.current) {
                stripTransitionContainerRef.current.style.pointerEvents =
                  progress > 0.24 / TOTAL_DUR ? 'auto' : 'none';
              }
              if (page3ContainerRef.current) {
                page3ContainerRef.current.style.pointerEvents =
                  progress > 0.25 / TOTAL_DUR ? 'auto' : 'none';
              }
              if (page4ContainerRef.current) {
                page4ContainerRef.current.style.pointerEvents =
                  progress > 0.62 / TOTAL_DUR ? 'auto' : 'none';
              }
            },
          },
        });

        // Initial transform origin for pixel-perfect top-left scaling
        if (heroMagnmRef.current) {
          gsap.set(heroMagnmRef.current, { transformOrigin: '0 0' });
        }

        // Measure targets with pure geometry (unaffected by active transforms)
        const getTransformTargets = () => {
          const heroEl = heroMagnmRef.current;
          const navEl = navBrandRef.current;
          if (!heroEl || !navEl) return { scale: 0.22, x: 0, y: 0 };

          const heroText = (heroEl.querySelector('.blur-text') || heroEl.querySelector('p') || heroEl) as HTMLElement;
          const navText = (navEl.querySelector('.nav-brand-text') || navEl) as HTMLElement;
          const heroRect = heroText.getBoundingClientRect();
          const navRect = navText.getBoundingClientRect();

          // Get current transform on hero to calculate untransformed initial box
          const currentX = (gsap.getProperty(heroEl, 'x') as number) || 0;
          const currentY = (gsap.getProperty(heroEl, 'y') as number) || 0;
          const currentScale = (gsap.getProperty(heroEl, 'scale') as number) || 1;

          const untransformedHeroLeft = heroRect.left - currentX;
          const untransformedHeroTop = heroRect.top - currentY;
          const untransformedHeroHeight = currentScale > 0 ? heroRect.height / currentScale : heroRect.height;

          // Target scale matching rendered height of universal navBrandText
          const targetScale = navRect.height > 0 && untransformedHeroHeight > 0
            ? navRect.height / untransformedHeroHeight
            : (window.innerWidth < 640 ? 0.32 : window.innerWidth < 1024 ? 0.26 : 0.22);

          // Exact coordinates landing directly onto navRect
          const deltaX = navRect.left - untransformedHeroLeft;
          const deltaY = navRect.top - untransformedHeroTop;

          return { scale: targetScale, x: deltaX, y: deltaY };
        };

        // Phase 1: Huge "MAGNM" scales down and docks seamlessly into the fixed Navbar (0.0 -> 0.11)
        if (heroMagnmRef.current) {
          scrollTl.to(
            heroMagnmRef.current,
            {
              scale: () => getTransformTargets().scale,
              x: () => getTransformTargets().x,
              y: () => getTransformTargets().y,
              transformOrigin: '0 0',
              ease: 'power2.inOut',
              duration: 0.11,
            },
            0
          );
        }

        // Secondary Hero elements individual words/items wipe out with randomized optical blur
        const leaveItems = heroSectionRef.current?.querySelectorAll('.leave-blur-item');
        if (leaveItems && leaveItems.length > 0) {
          scrollTl.to(
            leaveItems,
            {
              filter: 'blur(20px)',
              opacity: 0,
              stagger: {
                amount: 0.05,
                from: 'random',
              },
              duration: 0.06,
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
              duration: 0.07,
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
            0.07
          );
        }

        // Phase 2: As "MAGNM" finishes docking, Navbar right-side actions & Section 2 appear (0.08 -> 0.15)
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
              duration: 0.07,
              immediateRender: false,
            },
            0.08
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
              duration: 0.07,
              immediateRender: false,
            },
            0.08
          );
        }

        // Phase 3: 3D Wheel smooth rotation into vertical circle in the center (0.0 -> 0.18)
        scrollTl.to(
          cameraObj,
          {
            tilt: 90,
            sideTilt: 0,
            scale: baseScale * 0.74,
            opacity: 0.42,
            y: 0,
            ease: 'power2.inOut',
            duration: 0.18,
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

        // Phase 4: Section 2 Manifesto words progressive illumination (0.10 -> 0.20)
        const words = aboutContainerRef.current?.querySelectorAll('.word');
        if (words && words.length > 0) {
          scrollTl.to(
            words,
            {
              opacity: 1,
              filter: 'blur(0px)',
              stagger: 0.006,
              duration: 0.10,
              ease: 'power1.out',
            },
            0.10
          );
        }

        // Phase 5: Transition from Section 2 to Section 3 with Parallax Strip Slider effect (0.22 -> 0.28)
        // 5a. Outgoing Section 2 wipes out with blur and lifts smoothly
        if (aboutContainerRef.current) {
          scrollTl.to(
            aboutContainerRef.current,
            {
              opacity: 0,
              filter: 'blur(20px)',
              y: -24,
              duration: 0.05,
              ease: 'power2.in',
            },
            0.22
          );
        }

        // 5b. Outgoing 3D wheel fades out cleanly
        scrollTl.to(
          cameraObj,
          {
            opacity: 0,
            duration: 0.05,
            ease: 'power2.in',
            onUpdate: () => {
              if (wheelWrapperRef.current) {
                wheelWrapperRef.current.style.opacity = `${cameraObj.opacity}`;
              }
            },
          },
          0.22
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
              duration: 0.06,
              ease: 'power2.out',
              stagger: 0.004,
            },
            0.23
          );
        }

        if (activeZooms.length > 0) {
          scrollTl.fromTo(
            activeZooms,
            { scale: 1.15 },
            {
              scale: 1.0,
              duration: 0.07,
              ease: 'power2.out',
            },
            0.23
          );
        }

        // 5d. Navbar transitions to high-contrast dark text/borders for the light #cccccc surface
        const heroMagnmSpans = heroMagnmRef.current?.querySelectorAll('p, span');
        if (heroMagnmSpans && heroMagnmSpans.length > 0) {
          scrollTl.to(
            heroMagnmSpans,
            {
              color: '#171717',
              duration: 0.05,
              ease: 'power1.out',
            },
            0.25
          );
        }

        scrollTl.to(
          '.nav-brand-text',
          {
            color: '#171717',
            duration: 0.05,
            ease: 'power1.out',
          },
          0.25
        );

        if (document.querySelector('.nav-action-btn')) {
          scrollTl.to(
            '.nav-action-btn',
            {
              backgroundColor: 'rgba(23, 23, 23, 0.06)',
              borderColor: 'rgba(23, 23, 23, 0.18)',
              boxShadow: '0 4px 18px rgba(0,0,0,0.06)',
              duration: 0.05,
              ease: 'power1.out',
            },
            0.25
          );

          scrollTl.to(
            '.nav-action-btn span, .nav-action-btn .letter-swap-face',
            {
              color: '#171717',
              duration: 0.05,
              ease: 'power1.out',
            },
            0.25
          );
        }

        // 5e. Behind the wipe at 0.27, instant handoff from docked heroMagnm to universal fixed Navbar Brand
        if (heroMagnmRef.current) {
          scrollTl.set(heroMagnmRef.current, { opacity: 0 }, 0.27);
        }
        if (navBrandRef.current) {
          scrollTl.set(navBrandRef.current, { opacity: 1 }, 0.27);
        }

        // 5f. Page 3 (Our Work) reveals smoothly via signature optical blur as the parallax wipe completes
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
              duration: 0.06,
              ease: 'power2.out',
              immediateRender: false,
            },
            0.24
          );
        }

        // Phase 6: Pinned Services Scroll (0.28 -> 0.58)
        // User scrolls through each and every service sequentially while section remains pinned!
        const servicesScrollObj = { index: 0 };
        scrollTl.to(
          servicesScrollObj,
          {
            index: 5,
            ease: 'none',
            duration: 0.30,
            onUpdate: () => {
              ourWorkHandleRef.current?.setPositionDirect(servicesScrollObj.index);
            },
          },
          0.28
        );

        // Resting hold buffer at the end of services before unpinning (0.58 -> 0.62)
        scrollTl.to({}, { duration: 0.04 }, 0.58);

        // Phase 7: Page 4 (Selected Work) slides up smoothly over Page 3 (0.62 -> 0.77)
        if (page4ContainerRef.current) {
          scrollTl.to(
            page4ContainerRef.current,
            {
              y: '0%',
              ease: 'power2.inOut',
              duration: 0.15,
            },
            0.62
          );

          // Invert navbar colors back to light for the dark Page 4 background
          scrollTl.to(
            '.nav-brand-text',
            {
              color: '#cccccc',
              duration: 0.10,
              ease: 'power2.inOut',
            },
            0.65
          );

          if (document.querySelector('.nav-action-btn')) {
            scrollTl.to(
              '.nav-action-btn',
              {
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderColor: 'rgba(255, 255, 255, 0.08)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
                duration: 0.10,
                ease: 'power2.inOut',
              },
              0.65
            );

            scrollTl.to(
              '.nav-action-btn span, .nav-action-btn .letter-swap-face',
              {
                color: '#cccccc',
                duration: 0.10,
                ease: 'power2.inOut',
              },
              0.65
            );
          }
        }
      };

      // Desktop: >= 1024px
      mm.add('(min-width: 1024px)', () => {
        setupExperience(90, 36);
      });

      // Tablet: 640px - 1023px
      mm.add('(min-width: 640px) and (max-width: 1023px)', () => {
        setupExperience(70, 28);
      });

      // Mobile: < 640px
      mm.add('(max-width: 639px)', () => {
        setupExperience(48, 0);
      });

      return () => mm.revert();
    },
    { scope: mainContainerRef }
  );

  return (
    <SmoothScroll>
      <div ref={mainContainerRef} className="relative w-full min-h-screen bg-[#171717] text-[#cccccc] overflow-x-hidden">
        {/* Sticky Fixed Navbar (z-100) */}
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
            <div className="translate-y-[76px] sm:translate-y-[84px] font-mono text-xs sm:text-sm tracking-[0.14em] text-[#cccccc] font-light tabular-nums flex items-baseline justify-center">
              <Counter
                value={loadProgress}
                places={[100, 10, 1]}
                fontSize={13}
                padding={5}
                gap={1}
                textColor="#cccccc"
                fontWeight={300}
                gradientHeight={3}
                gradientFrom="#171717"
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

        {/* Master Pinned Stage for Hero -> Section 2 -> Section 3 -> Section 4 */}
        <div ref={pinnedStageRef} className="relative z-20 w-full h-screen overflow-hidden">
          {/* Section 1: Hero (Reveals as preloader finishes, active at top) */}
          <div
            ref={heroContainerRef}
            className="absolute inset-0 w-full h-full pointer-events-none opacity-100"
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

          {/* Persistent 3D Wheel (Layered in FRONT of MAGNM Wordmark & Tagline Text) */}
          <div
            ref={wheelWrapperRef}
            className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center will-change-transform"
          >
            <div className="w-full h-full flex items-center justify-center">
              <XylophoneHelix
                soundMode="glockenspiel"
                background="transparent"
                baseColor="#171717"
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

          {/* Section 2: Centered About Manifesto (Reveals simultaneously with Navbar) */}
          <div
            ref={aboutContainerRef}
            className="absolute inset-0 z-25 w-full h-full pointer-events-none opacity-0 will-change-transform"
          >
            <AboutManifesto skipInternalTrigger={true} />
          </div>

          {/* Section 3 Wipe: Parallax Strip Slider Transition into Page 3 (Horizontal) */}
          <ParallaxStripTransition
            stripCount={12}
            stripsRef={stripsRef}
            zoomsRef={zoomsRef}
            containerRef={stripTransitionContainerRef}
            bgColor="#cccccc"
            zIndex={30}
          />

          {/* Section 3 (Page 3): Our Work (OptionWheel Services) */}
          <div
            id="page-3"
            className="absolute inset-0 z-35 w-full h-full pointer-events-none overflow-hidden"
          >
            <OurWork ref={ourWorkHandleRef} containerRef={page3ContainerRef} />
          </div>

          {/* Section 4 (Page 4): Selected Work — Typographic Hero */}
          <div
            ref={page4ContainerRef}
            id="page-4"
            className="absolute inset-0 z-40 w-full h-full bg-[#171717] text-[#DEDEDE] overflow-hidden pointer-events-none"
          >
            <ProjectShowcase
              ref={projectShowcaseHandleRef}
            />
          </div>
        </div>

      </div>
    </SmoothScroll>
  );
}
