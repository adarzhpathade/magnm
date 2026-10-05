import type { RefObject, MutableRefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TIMINGS } from './timings';
import { animateSheetScaleDown, animateSheetSlideUp, getTransformTargets, getNavToFooterFontTargets } from './animation-helpers';
import { chimeSynth } from '@/lib/chime-synth';
import type { OurWorkHandle } from '../OurWork';
import type { ProjectsHandle } from '../Projects';

export interface CameraController {
  tilt: number;
  sideTilt: number;
  scale?: number;
  interactive?: boolean;
}

export interface DesktopTimelineRefs {
  pinnedStage: RefObject<HTMLDivElement | null>;
  heroAboutStage: RefObject<HTMLDivElement | null>;
  heroContainer: RefObject<HTMLDivElement | null>;
  aboutContainer: RefObject<HTMLDivElement | null>;
  heroSection: RefObject<HTMLDivElement | null>;
  heroMagnm: RefObject<HTMLDivElement | null>;
  heroTagline: RefObject<HTMLDivElement | null>;
  heroEmblem: RefObject<HTMLDivElement | null>;
  heroBottom: RefObject<HTMLDivElement | null>;
  navBrand: RefObject<HTMLDivElement | null>;
  navActions: RefObject<HTMLDivElement | null>;
  strips: MutableRefObject<(HTMLDivElement | null)[]>;
  zooms: MutableRefObject<(HTMLDivElement | null)[]>;
  stripTransitionContainer: RefObject<HTMLDivElement | null>;
  page3Container: RefObject<HTMLDivElement | null>;
  page3Wrapper: RefObject<HTMLDivElement | null>;
  whiteBackdrop: RefObject<HTMLDivElement | null>;
  page4Container: RefObject<HTMLDivElement | null>;
  wheelWrapper: RefObject<HTMLDivElement | null>;
  cameraController: MutableRefObject<CameraController>;
  ourWorkHandle: MutableRefObject<OurWorkHandle | null>;
  projectsHandle: MutableRefObject<ProjectsHandle | null>;
  footer?: RefObject<HTMLDivElement | null>;
  footerWrapper?: RefObject<HTMLDivElement | null>;
  footerMagnm?: RefObject<HTMLSpanElement | null>;
  navbarHeader?: RefObject<HTMLElement | null>;
  onFooterRevealChange?: (revealed: boolean) => void;
  onProjectsRevealChange?: (revealed: boolean) => void;
  skipInitialCamera?: boolean;
}

export function useDesktopTimeline(
  refs: DesktopTimelineRefs,
  mm: gsap.MatchMedia
): void {
  mm.add('(min-width: 1024px)', () => {
    const baseScale = 90;
    const initialYOffset = 36;

    // 1. Initial State Setup:
    // Skip camera init if the loader is managing it
    if (!refs.skipInitialCamera && refs.cameraController.current) {
      refs.cameraController.current.tilt = 36;
      refs.cameraController.current.sideTilt = -35;
      refs.cameraController.current.scale = baseScale;
      refs.cameraController.current.interactive = true;
    }

    if (refs.wheelWrapper.current) {
      refs.wheelWrapper.current.style.opacity = '1';
      if (!refs.skipInitialCamera) {
        refs.wheelWrapper.current.style.transform = `translateY(${initialYOffset}px)`;
      }
    }

    if (refs.heroContainer.current) {
      refs.heroContainer.current.style.pointerEvents = 'auto';
    }
    chimeSynth.suppressHover(1200);

    // About hidden at start (reveals on scroll)
    if (refs.aboutContainer.current) {
      refs.aboutContainer.current.style.opacity = '0';
      refs.aboutContainer.current.style.visibility = 'hidden';
      refs.aboutContainer.current.style.transform = 'translateY(0px)';
      refs.aboutContainer.current.style.pointerEvents = 'none';
    }

    // Navbar brand initial state: container visible, logo and text hidden
    if (refs.navBrand.current) {
      refs.navBrand.current.style.opacity = '1';
      refs.navBrand.current.style.transform = 'none';
    }
    gsap.set('.nav-logo-container', { opacity: 0, filter: 'none', y: 0 });
    gsap.set('.nav-brand-divider', { opacity: 0, filter: 'none', y: 0, backgroundColor: 'rgba(255, 255, 255, 0.22)' });
    gsap.set('.nav-brand-text', { opacity: 0, filter: 'none', y: 0, x: 0, scale: 1, color: '#171717', transformOrigin: '0 0', clearProps: 'fontSize,lineHeight,letterSpacing' });
    if (refs.navbarHeader?.current) {
      refs.navbarHeader.current.style.zIndex = '50';
    }
    if (refs.navActions.current) {
      refs.navActions.current.style.opacity = '0';
      refs.navActions.current.style.transform = 'none';
      refs.navActions.current.style.filter = 'none';
      refs.navActions.current.style.pointerEvents = 'none';
    }

    // Parallax strips initial state (hidden / clipped out)
    if (refs.strips.current) {
      refs.strips.current.forEach((el) => {
        if (el) gsap.set(el, { clipPath: 'inset(0 100% 0 0)' });
      });
    }
    if (refs.zooms.current) {
      refs.zooms.current.forEach((el) => {
        if (el) gsap.set(el, { scale: 1.15 });
      });
    }
    if (refs.heroAboutStage.current) {
      gsap.set(refs.heroAboutStage.current, { clearProps: 'all' });
      refs.heroAboutStage.current.style.visibility = 'visible';
    }
    if (refs.heroContainer.current) {
      refs.heroContainer.current.style.pointerEvents = 'auto';
      refs.heroContainer.current.style.opacity = '1';
    }
    if (refs.heroMagnm.current) {
      gsap.set(refs.heroMagnm.current, {
        clearProps: 'transform',
        transformOrigin: '0 0',
        scale: 1,
        x: 0,
        y: 0,
        opacity: 1,
      });
    }
    if (refs.whiteBackdrop.current) {
      gsap.set(refs.whiteBackdrop.current, { opacity: 0 });
    }
    if (refs.page3Wrapper.current) {
      gsap.set(refs.page3Wrapper.current, {
        clearProps: 'all',
        opacity: 0,
        scale: 1,
        boxShadow: 'none',
        transformOrigin: 'center center',
        pointerEvents: 'none',
        visibility: 'hidden',
      });
      refs.page3Wrapper.current.style.visibility = 'hidden';
    }
    if (refs.page3Container.current) {
      gsap.set(refs.page3Container.current, { opacity: 0, filter: 'blur(16px)', y: 0 });
    }
    if (refs.page4Container.current) {
      gsap.set(refs.page4Container.current, {
        clearProps: 'all',
        y: '100%',
        opacity: 1,
        scale: 1,
        boxShadow: '0 -25px 80px rgba(0, 0, 0, 0.22)',
        transformOrigin: 'center center',
        pointerEvents: 'none',
        visibility: 'hidden',
      });
      refs.page4Container.current.style.visibility = 'hidden';
      refs.page4Container.current.style.opacity = '1';
    }
    gsap.set('.page4-heading-block', {
      opacity: 1,
      filter: 'none',
      y: 0,
    });

    // Footer initial state: strictly hidden so it NEVER covers Hero on load
    if (refs.footerWrapper?.current) {
      gsap.set(refs.footerWrapper.current, {
        visibility: 'hidden',
        display: 'none',
        pointerEvents: 'none',
      });
      refs.footerWrapper.current.style.zIndex = '38';
    }
    gsap.set('#page-footer-bg', { visibility: 'hidden', display: 'none', zIndex: 36 });

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
        trigger: refs.pinnedStage.current,
        start: 'top top',
        end: '+=1000%',
        pin: true,
        scrub: 0.3,
        snap: {
          snapTo: (progress: number) => {
            // Snap points for the 6 services in Phase 6
            const sStart = TIMINGS.servicesScroll.start;
            const sEnd = TIMINGS.servicesScroll.end;
            if (progress >= sStart - 0.02 && progress <= sEnd + 0.02) {
              const step = (sEnd - sStart) / 5; // 6 services, 5 gaps
              const nearestIdx = Math.round((progress - sStart) / step);
              const clamped = Math.max(0, Math.min(5, nearestIdx));
              return sStart + clamped * step;
            }
            // Snap points for the 3 project cards in Phase 8b
            const pStart = TIMINGS.projectsScroll.start;
            const pEnd = TIMINGS.projectsScroll.end;
            if (progress >= pStart - 0.015 && progress <= pEnd + 0.015) {
              const step = (pEnd - pStart) / 2; // 3 cards, 2 intervals
              const nearestCard = Math.round((progress - pStart) / step);
              const clampedCard = Math.max(0, Math.min(2, nearestCard));
              return pStart + clampedCard * step;
            }
            // Snap to Footer
            if (progress >= 0.96) {
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
          if (refs.navActions.current) {
            refs.navActions.current.style.pointerEvents = progress > 0.16 ? 'auto' : 'none';
          }

          // Smoothly lock out Hero secondary elements (buttons, tagline, emblem) after full blur fade-out
          if (progress > 0.09) {
            if (refs.heroBottom.current) {
              refs.heroBottom.current.style.visibility = 'hidden';
              refs.heroBottom.current.style.pointerEvents = 'none';
            }
            if (refs.heroTagline.current) {
              refs.heroTagline.current.style.visibility = 'hidden';
              refs.heroTagline.current.style.pointerEvents = 'none';
            }
            if (refs.heroEmblem.current) {
              refs.heroEmblem.current.style.visibility = 'hidden';
              refs.heroEmblem.current.style.pointerEvents = 'none';
            }
          } else if (progress > 0.001) {
            if (refs.heroBottom.current) {
              refs.heroBottom.current.style.visibility = 'visible';
              refs.heroBottom.current.style.pointerEvents = 'auto';
            }
            if (refs.heroTagline.current) {
              refs.heroTagline.current.style.visibility = 'visible';
              refs.heroTagline.current.style.pointerEvents = 'auto';
            }
            if (refs.heroEmblem.current) {
              refs.heroEmblem.current.style.visibility = 'visible';
              refs.heroEmblem.current.style.pointerEvents = 'auto';
            }
          }

          if (refs.heroContainer.current && refs.aboutContainer.current) {
            if (progress > 0.12 && progress < 0.35) {
              if (refs.aboutContainer.current.style.pointerEvents !== 'auto') {
                chimeSynth.suppressHover(500);
              }
              refs.heroContainer.current.style.pointerEvents = 'none';
              refs.aboutContainer.current.style.pointerEvents = 'auto';
            } else if (progress <= 0.08) {
              if (refs.heroContainer.current.style.pointerEvents !== 'auto') {
                chimeSynth.suppressHover(600);
              }
              refs.heroContainer.current.style.pointerEvents = 'auto';
              refs.aboutContainer.current.style.pointerEvents = 'none';
            } else {
              refs.heroContainer.current.style.pointerEvents = 'none';
              refs.aboutContainer.current.style.pointerEvents = 'none';
            }
          }

          // Disable 3D wheel hover interaction after the about section
          if (refs.cameraController.current) {
            refs.cameraController.current.interactive = progress <= 0.30;
          }

          // Parallax strip transition container
          if (refs.stripTransitionContainer.current) {
            refs.stripTransitionContainer.current.style.pointerEvents =
              progress > 0.42 && progress < 0.70 ? 'auto' : 'none';
          }

          // Section 3 (Our Work)
          if (refs.page3Wrapper.current) {
            // Keep Page 3 visible throughout its display, scale-down (0.66-0.74),
            // and while Page 4 is sliding up in front of it (0.74-0.84), hiding only once Page 4 fully docks at 0.85
            const isPage3Visible = progress > 0.38 && progress < 0.85;
            const isPage3Interactive = progress > 0.38 && progress < 0.66;
            if (isPage3Interactive && refs.page3Wrapper.current.style.pointerEvents !== 'auto') {
              chimeSynth.suppressHover(600);
            }
            refs.page3Wrapper.current.style.pointerEvents =
              isPage3Interactive ? 'auto' : 'none';
            refs.page3Wrapper.current.style.visibility =
              isPage3Visible ? 'visible' : 'hidden';
          }

          // Section 4 (Page 4 Projects Card)
          if (refs.page4Container.current) {
            const isPage4Active = progress >= TIMINGS.page4SlideUp.start && progress < 0.995;
            const isPage4Interactive =
              progress >= TIMINGS.page4SlideUp.start + TIMINGS.page4SlideUp.duration &&
              progress < TIMINGS.footerReveal.start;
            if (isPage4Interactive && refs.page4Container.current.style.pointerEvents !== 'auto') {
              chimeSynth.suppressHover(600);
            }
            refs.page4Container.current.style.pointerEvents =
              isPage4Interactive ? 'auto' : 'none';
            refs.page4Container.current.style.visibility =
              isPage4Active ? 'visible' : 'hidden';

            if (refs.onProjectsRevealChange) {
              const shouldReveal =
                self.direction === -1
                  ? progress >= TIMINGS.page4SlideUp.start + 0.02 && progress < TIMINGS.footerReveal.start
                  : progress >= TIMINGS.page4SlideUp.start && progress < TIMINGS.footerReveal.start;
              refs.onProjectsRevealChange(shouldReveal);
            }
          }

          // Section 5 (Footer)
          if (refs.footerWrapper?.current) {
            const isFooterVisible = progress >= TIMINGS.footerReveal.start;
            const isFooterInteractive = progress >= TIMINGS.footerReveal.start;
            refs.footerWrapper.current.style.pointerEvents =
              isFooterInteractive ? 'auto' : 'none';
            if (isFooterVisible) {
              refs.footerWrapper.current.style.visibility = 'visible';
              refs.footerWrapper.current.style.display = 'flex';
              gsap.set('#page-footer-bg', { visibility: 'visible', display: 'block' });
            } else {
              refs.footerWrapper.current.style.visibility = 'hidden';
              refs.footerWrapper.current.style.display = 'none';
              gsap.set('#page-footer-bg', { visibility: 'hidden', display: 'none' });
            }

            if (refs.navbarHeader?.current) {
              if (progress >= 0.96) {
                refs.navbarHeader.current.style.zIndex = '37';
              } else {
                refs.navbarHeader.current.style.zIndex = '50';
              }
            }

            if (refs.onFooterRevealChange) {
              refs.onFooterRevealChange(progress >= TIMINGS.footerReveal.start - 0.02);
            }
          }
        },
      },
    });

    // Initial transform origin for pixel-perfect top-left scaling
    if (refs.heroMagnm.current) {
      gsap.set(refs.heroMagnm.current, { transformOrigin: '0 0' });
    }

    // Timeline locks at time 0 to enforce initial offscreen pose across scrubbing
    if (refs.page4Container.current) {
      scrollTl.set(
        refs.page4Container.current,
        {
          y: '100%',
          opacity: 1,
          scale: 1,
          boxShadow: '0 -25px 80px rgba(0, 0, 0, 0.22)',
          visibility: 'hidden',
          pointerEvents: 'none',
        },
        0
      );
    }
    scrollTl.set(
      '.page4-heading-block',
      {
        opacity: 1,
        filter: 'none',
        y: 0,
      },
      0
    );

    if (refs.projectsHandle.current) {
      refs.projectsHandle.current.setScrollProgress(0);
    }

    // Phase 1: Huge "MAGNM" scales down and docks prominently into the fixed Navbar (0.0 -> 0.16)
    if (refs.heroMagnm.current) {
      scrollTl.to(
        refs.heroMagnm.current,
        {
          scale: () => getTransformTargets(refs.heroMagnm.current, refs.navBrand.current).scale,
          x: () => getTransformTargets(refs.heroMagnm.current, refs.navBrand.current).x,
          y: () => getTransformTargets(refs.heroMagnm.current, refs.navBrand.current).y,
          transformOrigin: '0 0',
          ease: 'power2.inOut',
          duration: 0.16,
        },
        0
      );
    }

    // As Hero MAGNM glides into place, the Navbar logo and divider fade in smoothly right beside its docking position (0.04 -> 0.14)
    scrollTl.fromTo(
      ['.nav-logo-container', '.nav-brand-divider'],
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.10,
        ease: 'power1.out',
      },
      0.04
    );

    // Secondary Hero elements individual words/items wipe out with randomized optical blur
    // Exclude elements inside buttons so GSAP doesn't override their hover-driven styles
    const allLeaveItems = refs.heroSection.current?.querySelectorAll('.leave-blur-item');
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
      refs.heroTagline.current,
      refs.heroEmblem.current,
      refs.heroBottom.current,
    ].filter(Boolean);

    if (secondaryHeroElements.length > 0) {
      scrollTl.fromTo(
        secondaryHeroElements,
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
        },
        {
          y: -14,
          opacity: 0,
          filter: 'blur(10px)',
          duration: 0.08,
          ease: 'power1.out',
          immediateRender: false,
        },
        0
      );
    }

    // Phase 2: Once Hero section has completely exited and About Manifesto appears, Navbar action button reveals (0.16 -> 0.24)
    if (refs.navActions.current) {
      scrollTl.fromTo(
        refs.navActions.current,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          ease: 'power2.out',
          duration: 0.08,
        },
        0.16
      );
    }

    if (refs.aboutContainer.current) {
      scrollTl.fromTo(
        refs.aboutContainer.current,
        {
          opacity: 0,
          visibility: 'hidden',
          y: 16,
        },
        {
          opacity: 1,
          visibility: 'visible',
          y: 0,
          ease: 'power2.out',
          duration: 0.11,
          immediateRender: false,
        },
        0.11
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
          if (refs.cameraController.current) {
            refs.cameraController.current.tilt = cameraObj.tilt;
            refs.cameraController.current.sideTilt = cameraObj.sideTilt;
            refs.cameraController.current.scale = cameraObj.scale;
          }
          if (refs.wheelWrapper.current) {
            refs.wheelWrapper.current.style.opacity = `${cameraObj.opacity}`;
            refs.wheelWrapper.current.style.transform = `translateY(${cameraObj.y}px)`;
          }
        },
      },
      0
    );

    // Phase 4: Section 2 Manifesto words progressive illumination (0.14 -> 0.30)
    const words = refs.aboutContainer.current?.querySelectorAll('.word');
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
    if (refs.aboutContainer.current) {
      scrollTl.to(
        refs.aboutContainer.current,
        {
          opacity: 0,
          visibility: 'hidden',
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
          if (refs.wheelWrapper.current) {
            refs.wheelWrapper.current.style.opacity = `${cameraObj.opacity}`;
          }
        },
      },
      0.34
    );

    // 5c. Incoming Parallax Strip wipe reveals light color #cccccc across 12 vertical strips
    const activeStrips = refs.strips.current.slice(0, 12).filter(Boolean);
    const activeZooms = refs.zooms.current.slice(0, 12).filter(Boolean);

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
    const heroMagnmSpans = refs.heroMagnm.current?.querySelectorAll('p, span');
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

    // Hand off from docked heroMagnm to fixed nav-brand-text behind the 12 parallax strips
    if (refs.heroMagnm.current) {
      scrollTl.to(
        refs.heroMagnm.current,
        {
          opacity: 0,
          duration: 0.03,
          ease: 'none',
        },
        0.38
      );
    }

    scrollTl.fromTo(
      '.nav-brand-text',
      { opacity: 0 },
      {
        opacity: 1,
        color: '#171717',
        duration: 0.03,
        ease: 'none',
      },
      0.38
    );

    scrollTl.to(
      '.nav-brand-divider',
      {
        backgroundColor: 'rgba(23, 23, 23, 0.22)',
        duration: 0.03,
        ease: 'none',
      },
      0.38
    );

    scrollTl.to(
      '.nav-logo-light',
      {
        opacity: 0,
        duration: 0.06,
        ease: 'power1.out',
      },
      0.38
    );

    scrollTl.to(
      '.nav-logo-dark',
      {
        opacity: 1,
        duration: 0.06,
        ease: 'power1.out',
      },
      0.38
    );

    if (typeof document !== 'undefined' && document.querySelector('.nav-action-btn')) {
      scrollTl.to(
        '.nav-action-btn',
        {
          backgroundColor: '#171717',
          color: '#ffffff',
          boxShadow: 'none',
          duration: 0.06,
          ease: 'power1.out',
        },
        0.38
      );

      scrollTl.to(
        '.nav-action-btn span',
        {
          color: '#ffffff',
          duration: 0.06,
          ease: 'power1.out',
        },
        0.38
      );
    }

    if (typeof document !== 'undefined' && document.querySelector('.nav-secondary-btn')) {
      scrollTl.to(
        '.nav-secondary-btn',
        {
          borderColor: 'rgba(23, 23, 23, 0.25)',
          color: '#171717',
          duration: 0.06,
          ease: 'power1.out',
        },
        0.38
      );

      scrollTl.to(
        '.nav-secondary-btn span',
        {
          color: '#171717',
          duration: 0.06,
          ease: 'power1.out',
        },
        0.38
      );
    }



    // 5f. Page 3 (Our Work) reveals smoothly via signature optical blur as the parallax wipe completes
    if (refs.page3Wrapper.current) {
      scrollTl.fromTo(
        refs.page3Wrapper.current,
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

    if (refs.page3Container.current) {
      scrollTl.fromTo(
        refs.page3Container.current,
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

      scrollTl.set('#page-3', { visibility: 'visible', pointerEvents: 'auto' }, 0.36);
    }

    // Phase 6: Pinned Services Scroll (0.44 -> 0.66)
    // User scrolls through each and every service sequentially while section remains pinned!
    const servicesScrollObj = { index: 0 };
    scrollTl.to(
      servicesScrollObj,
      {
        index: 5,
        ease: 'none',
        duration: TIMINGS.servicesScroll.duration,
        onUpdate: () => {
          refs.ourWorkHandle.current?.setPositionDirect(servicesScrollObj.index);
        },
      },
      TIMINGS.servicesScroll.start
    );

    // Phase 7: Page 3 Zoom-out / Scale-down to 80% & Pure White Backdrop Reveal
    if (refs.whiteBackdrop.current) {
      scrollTl.fromTo(
        refs.whiteBackdrop.current,
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
      refs.page3Wrapper.current,
      TIMINGS.page3ScaleDown.start,
      TIMINGS.page3ScaleDown.duration
    );

    // Phase 8: Page 4 (Projects Card) slides up from bottom (0.74 -> 0.84)
    if (refs.page4Container.current) {
      scrollTl.set(
        refs.page4Container.current,
        { visibility: 'visible' },
        TIMINGS.page4SlideUp.start
      );

      animateSheetSlideUp(
        scrollTl,
        refs.page4Container.current,
        TIMINGS.page4SlideUp.start,
        TIMINGS.page4SlideUp.duration
      );

      // Section 4 card settled and interactive
      scrollTl.set(
        refs.page4Container.current,
        { pointerEvents: 'auto' },
        TIMINGS.page4SlideUp.start + TIMINGS.page4SlideUp.duration
      );
    }

    // Phase 8b: Projects Showcase — 3 Stacked Covers peel downwards with scroll (0.80 -> 0.93)
    const projectsScrollObj = { progress: 0 };
    scrollTl.to(
      projectsScrollObj,
      {
        progress: 2,
        ease: 'none',
        duration: TIMINGS.projectsScroll.duration,
        onUpdate: () => {
          refs.projectsHandle.current?.setScrollProgress(projectsScrollObj.progress);
        },
      },
      TIMINGS.projectsScroll.start
    );

    // Phase 9: Page 4 slides UP & OFF to reveal Footer underneath (0.94 -> 1.00)
    // 0. Ensure Footer background and helix are visible right as Page 4 lifts, and interactive
    if (refs.footerWrapper?.current) {
      scrollTl.set(
        [refs.footerWrapper.current, '#page-footer-bg'],
        { visibility: 'visible', pointerEvents: 'auto' },
        TIMINGS.footerReveal.start
      );
    }
    if (refs.page4Container?.current) {
      scrollTl.set(refs.page4Container.current, { pointerEvents: 'none' }, TIMINGS.footerReveal.start);
    }

    // Fade and blur out Page 4 heading block right as Page 4 starts lifting off into the footer
    scrollTl.to(
      '.page4-heading-block',
      {
        opacity: 0,
        filter: 'blur(12px)',
        y: -16,
        duration: 0.04,
        ease: 'power1.out',
      },
      TIMINGS.footerReveal.start
    );

    // 1. Page 4 slides up and off the top of the viewport like a physical curtain
    scrollTl.to(
      refs.page4Container.current,
      {
        y: '-100%',
        boxShadow: '0 30px 90px rgba(0, 0, 0, 0.5)',
        duration: TIMINGS.footerReveal.duration,
        ease: 'power2.inOut',
      },
      TIMINGS.footerReveal.start
    );

    // 2. Navbar items stay visible while Page 4 lifts, then leave with optical blur when Page 4 is ~80% gone
    const navLeaveElements: (string | HTMLElement)[] = [
      '.nav-logo-container',
      '.nav-brand-divider',
    ];
    if (refs.navActions.current) {
      navLeaveElements.push(refs.navActions.current);
    }
    scrollTl.to(
      navLeaveElements,
      {
        opacity: 0,
        filter: 'blur(16px)',
        y: -14,
        duration: 0.04,
        ease: 'power1.out',
      },
      0.96
    );

    // 3. The SAME Navbar MAGNM text grows its real fontSize from nav size to hero size (reverse of hero→nav)
    //    Starts at 0.95 (Page 4 ~60% gone) and completes by 1.0 (Page 4 fully gone, footer fully revealed)
    //    x: shifts left to align with page padding (compensating for logo+divider offset ~60px)
    //    y: shifts down to compensate for items-center overflow when font grows
    //       (at 248px font × 0.8 lineHeight = 198px tall, centered in 44px container → overflows 77px upward)
    scrollTl.to(
      '.nav-brand-text',
      {
        fontSize: () =>
          getNavToFooterFontTargets(
            refs.navBrand?.current ?? null,
            refs.footerMagnm?.current ?? null
          ).fontSize,
        x: () =>
          getNavToFooterFontTargets(
            refs.navBrand?.current ?? null,
            refs.footerMagnm?.current ?? null
          ).x,
        y: () =>
          getNavToFooterFontTargets(
            refs.navBrand?.current ?? null,
            refs.footerMagnm?.current ?? null
          ).y,
        lineHeight: 0.8,
        letterSpacing: '-0.035em',
        color: '#cccccc',
        duration: 0.05,
        ease: 'power2.inOut',
      },
      0.95
    );

    if (refs.navbarHeader?.current) {
      scrollTl.set(refs.navbarHeader.current, { zIndex: 37 }, 0.96);
    }
  });
}
