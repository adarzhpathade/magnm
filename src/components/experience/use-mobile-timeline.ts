import type { RefObject, MutableRefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
  mobilePage4Spacer?: RefObject<HTMLDivElement | null>;
  footer?: RefObject<HTMLDivElement | null>;
  footerWrapper?: RefObject<HTMLDivElement | null>;
  footerMagnm?: RefObject<HTMLSpanElement | null>;
  navbarHeader?: RefObject<HTMLElement | null>;
  onFooterRevealChange?: (revealed: boolean) => void;
  onProjectsRevealChange?: (revealed: boolean) => void;
  skipInitialCamera?: boolean;
}

export function useMobileTimeline(
  refs: MobileTimelineRefs,
  mm: gsap.MatchMedia
): void {
  // Mobile & Tablet: < 1024px (Wheel transition between Hero and About + natural vertical flow for Pages 3 & 4)
  mm.add('(max-width: 1023px)', () => {
    const baseMobileScale = 54;
    if (!refs.skipInitialCamera && refs.cameraController.current) {
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
      gsap.set(refs.navBrand.current, { clearProps: 'all', opacity: 1 });
    }
    gsap.set('.nav-logo-container', { opacity: 0 });
    gsap.set('.nav-brand-divider', { opacity: 0 });
    gsap.set('.nav-brand-text', { opacity: 0 });
    if (refs.navActions.current) {
      gsap.set(refs.navActions.current, { clearProps: 'all' });
      refs.navActions.current.style.opacity = '0';
      refs.navActions.current.style.pointerEvents = 'none';
      refs.navActions.current.style.transform = 'none';
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
    gsap.set('.page4-heading-block', { opacity: 1, filter: 'none', y: 0 });
    if (refs.projectsHandle.current) {
      refs.projectsHandle.current.setScrollProgress(0);
    }
    if (refs.footerWrapper?.current) {
      gsap.set(refs.footerWrapper.current, { clearProps: 'all' });
      // Keep footer hidden initially on mobile so the 3D Helix WebGL scene does not run in background during Sections 1-4
      refs.footerWrapper.current.style.visibility = 'hidden';
      refs.footerWrapper.current.style.pointerEvents = 'none';
    }
    gsap.set('#page-footer-bg', { visibility: 'hidden' });
    if (refs.footerMagnm?.current) {
      gsap.set(refs.footerMagnm.current, { clearProps: 'all' });
      refs.footerMagnm.current.style.opacity = '1';
    }
    gsap.set('.footer-magnm-mobile', { clearProps: 'all' });

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
          if (refs.navActions.current) {
            refs.navActions.current.style.pointerEvents = p >= 0.25 ? 'auto' : 'none';
          }
          if (p >= 0.20) {
            if (refs.heroBottom.current) {
              refs.heroBottom.current.style.visibility = 'hidden';
              refs.heroBottom.current.style.pointerEvents = 'none';
            }
          } else if (p > 0.01) {
            if (refs.heroBottom.current) {
              refs.heroBottom.current.style.visibility = 'visible';
              refs.heroBottom.current.style.pointerEvents = 'auto';
            }
          }
          if (refs.heroContainer.current && refs.aboutContainer.current) {
            refs.heroContainer.current.style.pointerEvents = p < 0.4 ? 'auto' : 'none';
            refs.aboutContainer.current.style.pointerEvents = p >= 0.4 ? 'auto' : 'none';
          }
        },
      },
    });

    // 1. On mobile: Huge "MAGNM" blurs and fades out (0.0 -> 0.22)
    // leaving ONLY the enlarged logo in the navbar on mobile
    if (refs.heroMagnm.current) {
      mobileTl.to(
        refs.heroMagnm.current,
        {
          opacity: 0,
          filter: 'blur(12px)',
          y: -14,
          duration: 0.22,
          ease: 'power1.out',
        },
        0
      );
    }

    // Logo fades in cleanly into the navbar (0.06 -> 0.20)
    mobileTl.fromTo(
      '.nav-logo-container',
      { opacity: 0 },
      { opacity: 1, duration: 0.16, ease: 'power1.out' },
      0.06
    );

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
      mobileTl.fromTo(
        secondaryElements,
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
        },
        {
          y: -14,
          opacity: 0,
          filter: 'blur(10px)',
          duration: 0.18,
          ease: 'power2.in',
          immediateRender: false,
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

    // Navbar action button fades in as Hero section exits into Section 2 (0.25 -> 0.45)
    if (refs.navActions.current) {
      mobileTl.fromTo(
        refs.navActions.current,
        { opacity: 0 },
        { opacity: 1, ease: 'power2.out', duration: 0.20 },
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

    // Section 4 slides ON TO Page 3:
    // Page 3 stays completely solid, static, and crisp while Section 4 smoothly slides over it
    const slideOnP4Tl = gsap.timeline({
      scrollTrigger: {
        trigger: refs.page4Container.current,
        start: 'top bottom',
        end: 'top top',
        scrub: 0.35,
        onUpdate: (self) => {
          if (refs.page3Wrapper.current) {
            // When Section 4 has fully covered Page 3, hide page3Wrapper to free GPU
            refs.page3Wrapper.current.style.visibility =
              self.progress >= 0.99 ? 'hidden' : 'visible';
          }
          if (refs.onProjectsRevealChange) {
            const shouldReveal =
              self.direction === -1
                ? self.progress >= 0.72
                : self.progress >= 0.65;
            refs.onProjectsRevealChange(shouldReveal);
          }
        },
      },
    });

    // Navbar dynamic color updater when scrolling through Section 3 & 4 (RAF-batched to avoid layout thrashing)
    let navRafId: number | null = null;
    const updateMobileNav = () => {
      const p3El = refs.page3Wrapper.current;
      const p4El = refs.page4Container.current;
      
      if (p3El && refs.navBrand.current) {
        const p3Top = p3El.getBoundingClientRect().top;
        const p4Top = p4El ? p4El.getBoundingClientRect().top : Infinity;
        const p4Bottom = p4El ? p4El.getBoundingClientRect().bottom : -Infinity;
        
        // We are on a light background if EITHER Page 3 OR Page 4 is in the upper half of the viewport
        const isLightBg = (p3Top <= 100 || p4Top <= 100) && p4Bottom > window.innerHeight * 0.4;
        
        const brandText = refs.navBrand.current.querySelector('.nav-brand-text') as HTMLElement | null;
        const logoLight = refs.navBrand.current.querySelector('.nav-logo-light') as HTMLElement | null;
        const logoDark = refs.navBrand.current.querySelector('.nav-logo-dark') as HTMLElement | null;
        if (brandText) {
          brandText.style.color = isLightBg ? '#171717' : '#cccccc';
        }
        if (logoLight) {
          logoLight.style.opacity = isLightBg ? '0' : '1';
        }
        if (logoDark) {
          logoDark.style.opacity = isLightBg ? '1' : '0';
        }
        if (refs.navActions.current) {
          const actionBtn = refs.navActions.current.querySelector('.nav-action-btn') as HTMLElement | null;
          if (actionBtn) {
            actionBtn.style.backgroundColor = isLightBg ? '#171717' : '#ffffff';
            actionBtn.style.color = isLightBg ? '#ffffff' : '#171717';
          }
          const secondaryBtn = refs.navActions.current.querySelector('.nav-secondary-btn') as HTMLElement | null;
          if (secondaryBtn) {
            secondaryBtn.style.borderColor = isLightBg ? 'rgba(23, 23, 23, 0.25)' : 'rgba(255, 255, 255, 0.2)';
            secondaryBtn.style.color = isLightBg ? '#171717' : '#cccccc';
          }
        }
      }
    };

    const onScroll = () => {
      if (navRafId !== null) return;
      navRafId = requestAnimationFrame(() => {
        navRafId = null;
        updateMobileNav();
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateMobileNav();

    // The footer now physically sits behind page 4 (parallax CSS reveal).
    // The reveal begins when the bottom of page-4 enters the viewport.
    const footerTriggerTarget = refs.page4Container?.current;
    if (footerTriggerTarget) {
      const mobileFooterTl = gsap.timeline({
        scrollTrigger: {
          trigger: footerTriggerTarget,
          start: 'bottom 85%',
          end: 'bottom 20%',
          scrub: 0.3,
          onUpdate: (self) => {
            const isRevealed = self.progress >= 0.02;
            if (refs.footerWrapper?.current) {
              refs.footerWrapper.current.style.visibility = isRevealed ? 'visible' : 'hidden';
              refs.footerWrapper.current.style.pointerEvents = isRevealed ? 'auto' : 'none';
            }
            const footerBg = document.getElementById('page-footer-bg');
            if (footerBg) {
              footerBg.style.visibility = isRevealed ? 'visible' : 'hidden';
            }
            if (refs.onFooterRevealChange) {
              refs.onFooterRevealChange(self.progress >= 0.05);
            }
            if (refs.navActions?.current) {
              refs.navActions.current.style.pointerEvents = self.progress >= 0.15 ? 'none' : 'auto';
            }
          },
        },
      });

      // Mobile navbar logo AND action buttons ("START A PROJECT") leave with optical blur
      const mobileNavLeave: (string | HTMLElement)[] = ['.nav-logo-container'];
      if (refs.navActions?.current) {
        mobileNavLeave.push(refs.navActions.current);
      } else {
        mobileNavLeave.push('.nav-action-btn', '.nav-secondary-btn');
      }
      mobileFooterTl.fromTo(
        mobileNavLeave,
        {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
        },
        {
          opacity: 0,
          filter: 'blur(16px)',
          y: -14,
          duration: 0.4,
          ease: 'power1.out',
          immediateRender: false,
        },
        0.1
      );
    }

    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (navRafId !== null) {
        cancelAnimationFrame(navRafId);
      }
    };
  });
}
