import { gsap } from 'gsap';

export function animateSheetScaleDown(
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

export function animateSheetSlideUp(
  tl: gsap.core.Timeline,
  el: HTMLElement | null,
  start: number,
  duration = 0.12
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
}

/**
 * Measure targets with pure geometry (unaffected by active transforms)
 */
export function getTransformTargets(
  heroEl: HTMLElement | null,
  navEl: HTMLElement | null
): { scale: number; x: number; y: number } {
  if (!heroEl || !navEl) return { scale: 0.22, x: 0, y: 0 };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
  const heroText = heroEl.querySelector('p') || heroEl;
  const heroRect = heroText.getBoundingClientRect();
  const navTarget = (!isMobile ? navEl.querySelector('.nav-brand-text') : null) || navEl.querySelector('.nav-logo-container') || navEl;
  const navRect = navTarget.getBoundingClientRect();

  const currentX = (gsap.getProperty(heroEl, 'x') as number) || 0;
  const currentY = (gsap.getProperty(heroEl, 'y') as number) || 0;
  const currentScale = (gsap.getProperty(heroEl, 'scale') as number) || 1;

  const untransformedHeroLeft = heroRect.left - currentX;
  const untransformedHeroTop = heroRect.top - currentY;
  const untransformedHeroHeight = currentScale > 0 ? heroRect.height / currentScale : heroRect.height;

  const width = window.innerWidth;
  let targetScale = 0.16;
  if (untransformedHeroHeight > 0 && navRect.height > 0) {
    targetScale = navRect.height / untransformedHeroHeight;
  } else {
    if (width < 640) {
      targetScale = 0.23; // Mobile: ~21.6px
    } else if (width < 1024) {
      targetScale = 0.19; // Tablet: ~24px
    } else {
      targetScale = 0.16; // Desktop: ~26.4px
    }
  }

  const deltaX = navRect.left - untransformedHeroLeft;
  const scaledHeight = untransformedHeroHeight * targetScale;
  const navCenterY = navRect.top + (navRect.height / 2);
  const targetTop = navCenterY - (scaledHeight / 2);
  const deltaY = targetTop - untransformedHeroTop;

  return { scale: targetScale, x: deltaX, y: deltaY };
}
