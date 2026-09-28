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
}
