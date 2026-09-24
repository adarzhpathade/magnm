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
        if (page3ContainerRef.current) {
          gsap.set(page3ContainerRef.current, { opacity: 0, filter: 'blur(16px)', y: 0 });
        }


        // 3. ScrollTrigger timeline for Hero -> Section 2 -> Parallax Strips -> Page 3 transition
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
            end: '+=520%',
            pin: true,
            scrub: 0.15,
            snap: {
              snapTo: (progress: number) => {
                // Only snap when in the services scroll range (Phase 6: 0.44 → 0.98)
                const sStart = 0.44;
                const sEnd = 0.98;
                if (progress >= sStart - 0.02) {
                  const step = (sEnd - sStart) / 5; // 6 services, 5 gaps
                  const nearestIdx = Math.round((progress - sStart) / step);
                  const clamped = Math.max(0, Math.min(5, nearestIdx));
                  return sStart + clamped * step;
                }
                // Before services zone — don't snap, let it flow freely
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
                if (progress > 0.12 && progress < 0.35) {
                  heroContainerRef.current.style.pointerEvents = 'none';
                  aboutContainerRef.current.style.pointerEvents = 'auto';
                } else if (progress <= 0.12) {
                  heroContainerRef.current.style.pointerEvents = 'auto';
                  aboutContainerRef.current.style.pointerEvents = 'none';
                } else {
                  heroContainerRef.current.style.pointerEvents = 'none';
                  aboutContainerRef.current.style.pointerEvents = 'none';
                }
              }
              if (stripTransitionContainerRef.current) {
                stripTransitionContainerRef.current.style.pointerEvents =
                  progress > 0.42 ? 'auto' : 'none';
              }
              if (page3ContainerRef.current) {
                page3ContainerRef.current.style.pointerEvents =
                  progress > 0.38 ? 'auto' : 'none';
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

          const heroText = heroEl.querySelector('p') || heroEl;
          const heroRect = heroText.getBoundingClientRect();
          const navRect = navEl.getBoundingClientRect();

          // Get current transform on hero to calculate untransformed initial box
          const currentX = (gsap.getProperty(heroEl, 'x') as number) || 0;
          const currentY = (gsap.getProperty(heroEl, 'y') as number) || 0;
          const currentScale = (gsap.getProperty(heroEl, 'scale') as number) || 1;

          const untransformedHeroLeft = heroRect.left - currentX;
          const untransformedHeroTop = heroRect.top - currentY;
          const untransformedHeroHeight = currentScale > 0 ? heroRect.height / currentScale : heroRect.height;

          // Prominent studio wordmark scale (NOT tiny)
          const width = window.innerWidth;
          let targetScale = 0.22;
          if (width < 640) {
            targetScale = 0.32; // Mobile: ~28px
          } else if (width < 1024) {
            targetScale = 0.26; // Tablet: ~32px
          } else {
            targetScale = 0.22; // Desktop: ~36px
          }

          // Exact X alignment with left edge of navbar slot
          const deltaX = navRect.left - untransformedHeroLeft;

          // Exact Y alignment: centered inside the 44px navbar row with generous ceiling clearance
          const scaledHeight = untransformedHeroHeight * targetScale;
          const navCenterY = navRect.top + (navRect.height / 2);
          const targetTop = navCenterY - (scaledHeight / 2);
          const deltaY = targetTop - untransformedHeroTop;

          return { scale: targetScale, x: deltaX, y: deltaY };
        };

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
        const leaveItems = heroSectionRef.current?.querySelectorAll('.leave-blur-item');
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
        }

        // Phase 6: Pinned Services Scroll (0.44 -> 0.98)
        // User scrolls through each and every service sequentially while section remains pinned!
        const servicesScrollObj = { index: 0 };
        scrollTl.to(
          servicesScrollObj,
          {
            index: 5,
            ease: 'none',
            duration: 0.54,
            onUpdate: () => {
              ourWorkHandleRef.current?.setPositionDirect(servicesScrollObj.index);
            },
          },
          0.44
        );
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
      <div ref={mainContainerRef} className="relative w-full min-h-screen bg-[#000000] text-[#cccccc] overflow-x-hidden">
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

        {/* Master Pinned Stage for Hero and Section 2 Transition */}
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
            className="absolute inset-0 z-20 pointer-events-auto flex items-center justify-center will-change-transform"
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

          {/* Section 2: Centered About Manifesto (Reveals simultaneously with Navbar) */}
          <div
            ref={aboutContainerRef}
            className="absolute inset-0 z-25 w-full h-full pointer-events-none opacity-0 will-change-transform"
          >
            <AboutManifesto skipInternalTrigger={true} />
          </div>

          {/* Section 3 Wipe: Parallax Strip Slider Transition into Page 3 */}
          <ParallaxStripTransition
            stripCount={12}
            stripsRef={stripsRef}
            zoomsRef={zoomsRef}
            containerRef={stripTransitionContainerRef}
            bgColor="#cccccc"
          />

          {/* Section 3 (Page 3): Our Work */}
          <div
            id="page-3"
            className="absolute inset-0 z-35 w-full h-full pointer-events-auto overflow-hidden"
          >
            <OurWork ref={ourWorkHandleRef} containerRef={page3ContainerRef} />
          </div>
        </div>
      </div>
    </SmoothScroll>
  );
}
