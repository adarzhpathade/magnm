'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
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
import dynamic from 'next/dynamic';

const ProjectModal = dynamic(() => import('./ProjectModal'), { ssr: false });
const AboutModal = dynamic(() => import('./AboutModal'), { ssr: false });
import Footer from './Footer';

import { useResponsiveWheel } from './experience/use-responsive-wheel';
import { useDesktopTimeline } from './experience/use-desktop-timeline';
import { useMobileTimeline } from './experience/use-mobile-timeline';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

// Loader camera settings
const LOADER_CAMERA = { tilt: 90, sideTilt: 0, scale: 28 };
const HERO_CAMERA = { tilt: 36, sideTilt: -35 };

export default function MainExperience() {
  const mainContainerRef = useRef<HTMLDivElement>(null);

  // Preloader state
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isCounterFaded, setIsCounterFaded] = useState(false);
  const [triggerHeroReveal, setTriggerHeroReveal] = useState(false);
  const [counterVisible, setCounterVisible] = useState(true);
  const [triggerFooterReveal, setTriggerFooterReveal] = useState(false);
  const footerRevealedRef = useRef(false);

  const handleFooterRevealChange = useCallback((revealed: boolean) => {
    if (footerRevealedRef.current !== revealed) {
      footerRevealedRef.current = revealed;
      setTriggerFooterReveal(revealed);
    }
  }, []);

  const [triggerProjectsReveal, setTriggerProjectsReveal] = useState(false);
  const projectsRevealedRef = useRef(false);

  const handleProjectsRevealChange = useCallback((revealed: boolean) => {
    if (projectsRevealedRef.current !== revealed) {
      projectsRevealedRef.current = revealed;
      setTriggerProjectsReveal(revealed);
    }
  }, []);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [modalSource, setModalSource] = useState<'navbar' | 'hero' | 'footer'>('navbar');
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
  const mobilePage4SpacerRef = useRef<HTMLDivElement>(null);
  const ourWorkHandleRef = useRef<OurWorkHandle | null>(null);
  const projectsHandleRef = useRef<ProjectsHandle | null>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const footerWrapperRef = useRef<HTMLDivElement>(null);
  const footerMagnmRef = useRef<HTMLSpanElement>(null);
  const mobilePageFooterSpacerRef = useRef<HTMLDivElement>(null);

  // Persistent 3D Wheel refs and controllers
  const wheelWrapperRef = useRef<HTMLDivElement>(null);
  const cameraControllerRef = useRef<{ tilt: number; sideTilt: number; scale?: number; interactive?: boolean }>({
    tilt: LOADER_CAMERA.tilt,
    sideTilt: LOADER_CAMERA.sideTilt,
    scale: LOADER_CAMERA.scale,
    interactive: false,
  });
  const loaderDoneRef = useRef(false);

  const { wheelScale, isDesktop } = useResponsiveWheel();

  // ── Loader Entrance Animation ──
  // The 3D wheel starts small with top-down camera (tilt:90, sideTilt:0, scale:28)
  // and smoothly transitions to the hero perspective (tilt:36, sideTilt:-35, scale:targetScale)
  // while the hero text reveals with the signature partial blur effect.
  useEffect(() => {
    if (loaderDoneRef.current) return;

    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);
    }

    // Lock scroll during loader
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    const targetScale = isDesktop ? 90 : (window.innerWidth < 640 ? 54 : 70);

    // Ensure camera controller starts at exact loader state
    if (cameraControllerRef.current) {
      cameraControllerRef.current.tilt = LOADER_CAMERA.tilt;
      cameraControllerRef.current.sideTilt = LOADER_CAMERA.sideTilt;
      cameraControllerRef.current.scale = LOADER_CAMERA.scale;
      cameraControllerRef.current.interactive = false;
    }

    const ctx = gsap.context(() => {
      // 1. Progress counter animation 0 → 100
      const progressObj = { value: 0 };
      gsap.to(progressObj, {
        value: 100,
        duration: 0.95,
        ease: 'power2.inOut',
        onUpdate: () => setLoadProgress(Math.round(progressObj.value)),
        onComplete: () => {
          // Immediately fade out the counter as soon as it reaches 100
          setIsCounterFaded(true);
          setTimeout(() => {
            setCounterVisible(false);
          }, 320);
        },
      });

      // 2. Camera proxy for smooth 3D transition from loader to hero perspective
      const initDelay = 0.35;
      const cameraProxy = {
        tilt: LOADER_CAMERA.tilt,
        sideTilt: LOADER_CAMERA.sideTilt,
        scale: LOADER_CAMERA.scale,
      };

      gsap.to(cameraProxy, {
        tilt: HERO_CAMERA.tilt,
        sideTilt: HERO_CAMERA.sideTilt,
        scale: targetScale,
        duration: 1.25,
        delay: initDelay,
        ease: 'power3.inOut',
        onUpdate: () => {
          if (cameraControllerRef.current) {
            cameraControllerRef.current.tilt = cameraProxy.tilt;
            cameraControllerRef.current.sideTilt = cameraProxy.sideTilt;
            cameraControllerRef.current.scale = cameraProxy.scale;
          }
        },
        onComplete: () => {
          if (cameraControllerRef.current) {
            cameraControllerRef.current.tilt = HERO_CAMERA.tilt;
            cameraControllerRef.current.sideTilt = HERO_CAMERA.sideTilt;
            cameraControllerRef.current.scale = targetScale;
            cameraControllerRef.current.interactive = true;
          }
        },
      });

      // 3. Desktop wheelWrapper Y translation transition (from 0 to 36px)
      if (isDesktop && wheelWrapperRef.current) {
        gsap.to(wheelWrapperRef.current, {
          y: 36,
          duration: 1.25,
          delay: initDelay,
          ease: 'power3.inOut',
        });
      }
    });

    // 4. Trigger hero text reveal smoothly as camera transitions (~700ms)
    const revealTimer = setTimeout(() => {
      setTriggerHeroReveal(true);
    }, 700);

    // 5. Mark loading complete, unlock scroll, and enable interactions (~1550ms)
    const completeTimer = setTimeout(() => {
      setIsLoaded(true);
      loaderDoneRef.current = true;
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      ScrollTrigger.refresh();
    }, 1550);

    return () => {
      if (!loaderDoneRef.current) {
        ctx.revert();
        clearTimeout(revealTimer);
        clearTimeout(completeTimer);
      }
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isDesktop]);

  useGSAP(
    () => {
      if (!pinnedStageRef.current || !heroContainerRef.current) return;

      const mm = gsap.matchMedia();

      useDesktopTimeline(
        {
          pinnedStage: pinnedStageRef,
          heroAboutStage: heroAboutStageRef,
          heroContainer: heroContainerRef,
          aboutContainer: aboutContainerRef,
          heroSection: heroSectionRef,
          heroMagnm: heroMagnmRef,
          heroTagline: heroTaglineRef,
          heroEmblem: heroEmblemRef,
          heroBottom: heroBottomRef,
          navBrand: navBrandRef,
          navActions: navActionsRef,
          strips: stripsRef,
          zooms: zoomsRef,
          stripTransitionContainer: stripTransitionContainerRef,
          page3Container: page3ContainerRef,
          page3Wrapper: page3WrapperRef,
          whiteBackdrop: whiteBackdropRef,
          page4Container: page4ContainerRef,
          wheelWrapper: wheelWrapperRef,
          cameraController: cameraControllerRef,
          ourWorkHandle: ourWorkHandleRef,
          projectsHandle: projectsHandleRef,
          footer: footerRef,
          footerWrapper: footerWrapperRef,
          footerMagnm: footerMagnmRef,
          navbarHeader: navbarHeaderRef,
          onFooterRevealChange: handleFooterRevealChange,
          onProjectsRevealChange: handleProjectsRevealChange,
          skipInitialCamera: true,
        },
        mm
      );

      useMobileTimeline(
        {
          pinnedStage: pinnedStageRef,
          heroAboutStage: heroAboutStageRef,
          heroContainer: heroContainerRef,
          aboutContainer: aboutContainerRef,
          heroSection: heroSectionRef,
          heroMagnm: heroMagnmRef,
          heroTagline: heroTaglineRef,
          heroEmblem: heroEmblemRef,
          heroBottom: heroBottomRef,
          navBrand: navBrandRef,
          navActions: navActionsRef,
          page3Container: page3ContainerRef,
          page3Wrapper: page3WrapperRef,
          page4Container: page4ContainerRef,
          wheelWrapper: wheelWrapperRef,
          cameraController: cameraControllerRef,
          projectsHandle: projectsHandleRef,
          mobilePage4Spacer: mobilePage4SpacerRef,
          footer: footerRef,
          footerWrapper: footerWrapperRef,
          footerMagnm: footerMagnmRef,
          navbarHeader: navbarHeaderRef,
          onFooterRevealChange: handleFooterRevealChange,
          onProjectsRevealChange: handleProjectsRevealChange,
          skipInitialCamera: true,
        },
        mm
      );

      return () => mm.revert();
    },
    { scope: mainContainerRef }
  );

  return (
    <SmoothScroll>
      <div ref={mainContainerRef} className="relative w-full min-h-[100svh] lg:min-h-screen bg-[#000000] text-[#cccccc] overflow-x-clip lg:overflow-x-clip">
        {/* Global Project Modal */}
        <ProjectModal isOpen={isProjectModalOpen} source={modalSource} onClose={() => setIsProjectModalOpen(false)} />

        {/* Preloader Counter (Positioned at the bottom center of the screen) */}
        {counterVisible && (
          <div
            ref={counterWrapperRef}
            className="fixed inset-x-0 bottom-8 sm:bottom-10 md:bottom-12 z-30 flex items-center justify-center pointer-events-none select-none transition-opacity duration-300 ease-out"
            style={{
              opacity: isCounterFaded ? 0 : 1,
            }}
          >
            <div className="flex items-center justify-center">
              <div className="font-['Martian_Mono',monospace] text-xs sm:text-sm tracking-[0.16em] text-[#cccccc] font-light tabular-nums flex items-baseline justify-center">
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
              </div>
            </div>
          </div>
        )}

        {/* Master Stage: Pinned on Desktop, Natural Vertical Flow on Mobile */}
        <div
          ref={pinnedStageRef}
          className="relative w-full lg:h-screen lg:overflow-hidden bg-[#000000] shadow-[0_25px_80px_rgba(0,0,0,0.6)]"
        >
          {/* Sticky Fixed Navbar (z-50) */}
          <Navbar
            headerRef={navbarHeaderRef}
            navBrandRef={navBrandRef}
            navActionsRef={navActionsRef}
            onStartProject={() => { setModalSource('navbar'); setIsProjectModalOpen(true); }}
            onAboutClick={() => setIsAboutModalOpen(true)}
          />

          {/* Hero & About Combined Stage (Sticky on Mobile so Section 3 slides directly on to it) */}
          <div
            ref={heroAboutStageRef}
            className="sticky top-0 z-20 w-full h-[100svh] lg:h-full lg:absolute lg:inset-0 overflow-hidden bg-[#000000] will-change-transform"
          >
            {/* Section 1: Hero */}
            <div
              ref={heroContainerRef}
              className="absolute inset-0 z-10 w-full h-full pointer-events-none flex flex-col justify-between"
            >
              <Hero
                showWheel={false}
                triggerReveal={triggerHeroReveal}
                heroSectionRef={heroSectionRef}
                heroMagnmRef={heroMagnmRef}
                heroTaglineRef={heroTaglineRef}
                heroEmblemRef={heroEmblemRef}
                heroBottomRef={heroBottomRef}
                onStartProject={() => { setModalSource('hero'); setIsProjectModalOpen(true); }}
                onAboutClick={() => setIsAboutModalOpen(true)}
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
                  scale={LOADER_CAMERA.scale}
                  metal={{ reflect: 100, polish: 100 }}
                  hover={{ colors: ['#D8782B'], strength: 0, tint: 0, glow: 0 }}
                  camera={{ tilt: LOADER_CAMERA.tilt, sideTilt: LOADER_CAMERA.sideTilt }}
                  cameraControllerRef={cameraControllerRef}
                />
              </div>
            </div>

            {/* Section 2: Centered About Manifesto */}
            <div
              ref={aboutContainerRef}
              className="absolute inset-0 z-25 w-full h-full pointer-events-none opacity-0 invisible bg-transparent text-[#cccccc] flex items-center justify-center will-change-transform"
            >
              <AboutManifesto skipInternalTrigger={true} />
            </div>
          </div>

          {/* Mobile Scroll Spacer: track for Hero -> About wheel transition and manifesto reveal */}
          <div
            ref={mobileHeroSpacerRef}
            className="relative w-full h-[150svh] lg:hidden pointer-events-none"
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

          {/* Section 3 (Page 3): Our Work — on mobile, flows continuously with Section 4 (Projects) */}
          <div
            id="page-3"
            ref={page3WrapperRef}
            className="relative lg:absolute lg:inset-0 z-35 w-full h-auto lg:h-full lg:min-h-0 pointer-events-auto lg:pointer-events-none overflow-visible lg:overflow-hidden bg-[#cccccc] text-[#171717] opacity-100 lg:opacity-0 will-change-transform flex flex-col lg:flex-row items-center justify-start lg:justify-center rounded-none shadow-[0_-25px_60px_rgba(0,0,0,0.35)] lg:shadow-none lg:invisible"
          >
            <OurWork ref={ourWorkHandleRef} containerRef={page3ContainerRef} />
          </div>

          {/* Section 4 (Page 4): Projects Showcase — continues seamlessly below Section 3 as one continuous light stage */}
          <div
            id="page-4"
            ref={page4ContainerRef}
            className="relative lg:absolute lg:inset-0 z-35 lg:z-40 w-full h-auto lg:h-full lg:min-h-0 pointer-events-auto lg:pointer-events-none opacity-100 lg:opacity-0 bg-[#cccccc] text-[#171717] overflow-visible lg:overflow-hidden rounded-none flex flex-col items-center justify-start lg:justify-center will-change-transform lg:invisible lg:translate-y-full lg:shadow-[0_-25px_80px_rgba(0,0,0,0.22)]"
          >
            <Projects ref={projectsHandleRef} triggerReveal={triggerProjectsReveal} />
          </div>

          {/* Mobile Footer Reveal Scroll Track */}
          <div
            ref={mobilePageFooterSpacerRef}
            className="relative w-full h-[100svh] lg:hidden pointer-events-none"
            aria-hidden="true"
          />

          {/* Section 5: Footer Wrapper (Fixed at bottom on mobile for parallax curtain reveal; absolute on desktop) */}
          <div className="fixed bottom-0 left-0 lg:static z-30 w-full h-[100svh] lg:h-auto pointer-events-none">
            {/* Section 5a: Footer Background */}
            <div
              id="page-footer-bg"
              className="absolute inset-0 z-0 lg:z-36 w-full h-full pointer-events-none bg-[#000000] invisible hidden"
              aria-hidden="true"
            />

            {/* Section 5b: Footer Interactive Helix & Content */}
            <div
              id="page-footer"
              ref={footerWrapperRef}
              className="absolute inset-0 z-10 lg:z-38 w-full h-full pointer-events-none overflow-hidden bg-transparent text-[#cccccc] flex items-center justify-center will-change-transform invisible hidden"
            >
              <Footer
                ref={footerRef}
                magnmRef={footerMagnmRef}
                triggerReveal={triggerFooterReveal}
                onStartProject={() => { setModalSource('footer'); setIsProjectModalOpen(true); }}
              />
            </div>
          </div>
        </div>
      </div>
      
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
    </SmoothScroll>
  );
}
