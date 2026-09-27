import type { RefObject, MutableRefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getTransformTargets } from './animation-helpers';
import { chimeSynth } from '@/lib/chime-synth';
import type { CameraController } from './use-desktop-timeline';
import type { ProjectsHandle } from '../Projects';

export interface MobileTimelineRefs {
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
  page3Container: RefObject<HTMLDivElement | null>;
  page3Wrapper: RefObject<HTMLDivElement | null>;
  page4Container: RefObject<HTMLDivElement | null>;
  wheelWrapper: RefObject<HTMLDivElement | null>;
  cameraController: MutableRefObject<CameraController>;
  projectsHandle: MutableRefObject<ProjectsHandle | null>;
}

export function useMobileTimeline(
  refs: MobileTimelineRefs,
  mm: gsap.MatchMedia
): void {
  // Mobile & Tablet: < 1024px (Wheel transition between Hero and About + natural vertical flow for Pages 3 & 4)
  mm.add('(max-width: 1023px)', () => {
    const baseMobileScale = 54;
    if (refs.cameraController.current) {
      refs.cameraController.current.tilt = 36;
      refs.cameraController.current.sideTilt = -35;
      refs.cameraController.current.scale = baseMobileScale;
      refs.cameraController.current.interactive = true;
    }

    if (refs.wheelWrapper.current) {
      refs.wheelWrapper.current.style.opacity = '1';
      refs.wheelWrapper.current.style.transform = 'translateY(0px)';
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
      gsap.set(refs.heroMagnm.current, { clearProps: 'all', transformOrigin: '0 0' });
    }
    const secondaryElements = [
      refs.heroTagline.current,
      refs.heroEmblem.current,
      refs.heroBottom.current,
    ].filter(Boolean);
    if (secondaryElements.length > 0) {
      gsap.set(secondaryElements, { clearProps: 'all' });
    }

    if (refs.aboutContainer.current) {
      gsap.set(refs.aboutContainer.current, { clearProps: 'all' });
      refs.aboutContainer.current.style.opacity = '0';
      refs.aboutContainer.current.style.pointerEvents = 'none';
    }

    const words = refs.aboutContainer.current?.querySelectorAll('.word');
    if (words && words.length > 0) {
      gsap.set(words, { opacity: 0.14, filter: 'blur(8px)' });
    }

    if (refs.navBrand.current) {
      gsap.set(refs.navBrand.current, { clearProps: 'all' });
      refs.navBrand.current.style.opacity = '0';
    }
    if (refs.navActions.current) {
      gsap.set(refs.navActions.current, { clearProps: 'all' });
      refs.navActions.current.style.opacity = '1';
    }

    // Section 3 & 4: natural document flow
    if (refs.page3Wrapper.current) {
      gsap.set(refs.page3Wrapper.current, { clearProps: 'all' });
      refs.page3Wrapper.current.style.opacity = '1';
      refs.page3Wrapper.current.style.visibility = 'visible';
      refs.page3Wrapper.current.style.pointerEvents = 'auto';
    }
    if (refs.page3Container.current) {
      gsap.set(refs.page3Container.current, { clearProps: 'all' });
      refs.page3Container.current.style.opacity = '1';
      refs.page3Container.current.style.filter = 'none';
    }
    if (refs.page4Container.current) {
      gsap.set(refs.page4Container.current, { clearProps: 'all' });
      refs.page4Container.current.style.opacity = '1';
      refs.page4Container.current.style.visibility = 'visible';
      refs.page4Container.current.style.pointerEvents = 'auto';
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
        trigger: refs.pinnedStage.current,
        start: 'top top',
        end: () => `+=${window.innerHeight * 1.1}px`,
        scrub: 0.35,
        onUpdate: (self) => {
          chimeSynth.notifyScroll();
          const p = self.progress;

          if (refs.cameraController.current) {
            refs.cameraController.current.interactive = p <= 0.2;
          }
          if (refs.heroContainer.current && refs.aboutContainer.current) {
            refs.heroContainer.current.style.pointerEvents = p < 0.4 ? 'auto' : 'none';
            refs.aboutContainer.current.style.pointerEvents = p >= 0.4 ? 'auto' : 'none';
          }
        },
      },
    });

    // 1. Huge "MAGNM" scales down and docks into navbar (0.0 -> 0.40)
    if (refs.heroMagnm.current) {
      mobileTl.to(
        refs.heroMagnm.current,
        {
          scale: () => getTransformTargets(refs.heroMagnm.current, refs.navBrand.current).scale,
          x: () => getTransformTargets(refs.heroMagnm.current, refs.navBrand.current).x,
          y: () => getTransformTargets(refs.heroMagnm.current, refs.navBrand.current).y,
          transformOrigin: '0 0',
          ease: 'power2.inOut',
          duration: 0.40,
        },
        0
      );
    }

    // 2. Hero secondary items wipe out with optical blur (0.0 -> 0.25)
    const allLeaveItems = refs.heroSection.current?.querySelectorAll('.leave-blur-item');
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
          if (refs.cameraController.current) {
            refs.cameraController.current.tilt = mobileCameraObj.tilt;
            refs.cameraController.current.sideTilt = mobileCameraObj.sideTilt;
            refs.cameraController.current.scale = mobileCameraObj.scale;
          }
          if (refs.wheelWrapper.current) {
            refs.wheelWrapper.current.style.opacity = `${mobileCameraObj.opacity}`;
          }
        },
      },
      0
    );

    // 4. Section 2 Manifesto fades in (0.25 -> 0.55)
    if (refs.aboutContainer.current) {
      mobileTl.fromTo(
        refs.aboutContainer.current,
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
    if (refs.heroMagnm.current) {
      mobileTl.to(refs.heroMagnm.current, { opacity: 0, duration: 0.10 }, 0.50);
    }
    if (refs.navBrand.current) {
      mobileTl.to(refs.navBrand.current, { opacity: 1, duration: 0.10 }, 0.50);
    }

    // Section 3 slides ON TO Page 2:
    // As Section 3's top moves from bottom of viewport to top of viewport,
    // Page 2 underneath subtly scales down and dims, while remaining held at top: 0
    const slideOnTl = gsap.timeline({
      scrollTrigger: {
        trigger: refs.page3Wrapper.current,
        start: 'top bottom',
        end: 'top top',
        scrub: true,
        onUpdate: (self) => {
          if (refs.heroAboutStage.current) {
            // When Section 3 has fully covered Page 2, hide heroAboutStage to free GPU
            refs.heroAboutStage.current.style.visibility =
              self.progress >= 0.99 ? 'hidden' : 'visible';
          }
        },
      },
    });

    if (refs.heroAboutStage.current) {
      slideOnTl.to(
        refs.heroAboutStage.current,
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
        trigger: refs.page4Container.current,
        start: 'top bottom',
        end: 'top top',
        scrub: true,
        onUpdate: (self) => {
          if (refs.page3Wrapper.current) {
            // When Section 4 has fully covered Page 3, hide page3Wrapper to free GPU
            refs.page3Wrapper.current.style.visibility =
              self.progress >= 0.99 ? 'hidden' : 'visible';
          }
          if (self.progress > 0.05) {
            refs.projectsHandle.current?.playEntry();
          }
        },
      },
    });

    if (refs.page3Wrapper.current) {
      slideOnP4Tl.to(
        refs.page3Wrapper.current,
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
      const p3El = refs.page3Wrapper.current;
      if (p3El && refs.navBrand.current) {
        const p3Top = p3El.getBoundingClientRect().top;
        const isLightBg = p3Top <= 60;
        const brandText = refs.navBrand.current.querySelector('.nav-brand-text') as HTMLElement | null;
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
}
