'use client';

import React, { useRef, useState } from 'react';
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

import { useResponsiveWheel } from './experience/use-responsive-wheel';
import { useDesktopTimeline } from './experience/use-desktop-timeline';
import { useMobileTimeline } from './experience/use-mobile-timeline';

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

  const { wheelScale } = useResponsiveWheel();

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
        },
        mm
      );

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
