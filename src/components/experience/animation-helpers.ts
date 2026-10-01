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

/**
 * Measure targets for footer MAGNM scaling up from navbar position
 */
export function getFooterMagnmNavTargets(
  footerEl: HTMLElement | null,
  navEl: HTMLElement | null
): { scale: number; x: number; y: number } {
  if (!footerEl || !navEl) return { scale: 0.16, x: 0, y: 0 };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
  const navTarget =
    (!isMobile ? navEl.querySelector('.nav-brand-text') : null) ||
    navEl.querySelector('.nav-logo-container') ||
    navEl;
  const navRect = navTarget.getBoundingClientRect();
  const footerRect = footerEl.getBoundingClientRect();

  const currentX = (gsap.getProperty(footerEl, 'x') as number) || 0;
  const currentY = (gsap.getProperty(footerEl, 'y') as number) || 0;
  const currentScale = (gsap.getProperty(footerEl, 'scale') as number) || 1;

  const untransformedFooterLeft = footerRect.left - currentX;
  const untransformedFooterTop = footerRect.top - currentY;
  const untransformedFooterHeight =
    currentScale > 0 ? footerRect.height / currentScale : footerRect.height;

  const width = window.innerWidth;
  let targetScale = 0.16;
  if (untransformedFooterHeight > 0 && navRect.height > 0) {
    targetScale = navRect.height / untransformedFooterHeight;
  } else {
    if (width < 640) {
      targetScale = 0.23;
    } else if (width < 1024) {
      targetScale = 0.19;
    } else {
      targetScale = 0.16;
    }
  }

  const deltaX = navRect.left - untransformedFooterLeft;
  const scaledHeight = untransformedFooterHeight * targetScale;
  const navCenterY = navRect.top + navRect.height / 2;
  const targetTop = navCenterY - scaledHeight / 2;
  const deltaY = targetTop - untransformedFooterTop;

  return { scale: targetScale, x: deltaX, y: deltaY };
}

/**
 * Compute the hero-matching fontSize (in px) from the same clamp expression:
 * clamp(4.25rem, 16vw, 15.5rem) — with 1rem = 16px
 */
export function getHeroFontSizePx(): number {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const minPx = 4.25 * 16;   // 68px
  const maxPx = 15.5 * 16;   // 248px
  const vwPx = width * 0.16; // 16vw
  return Math.max(minPx, Math.min(maxPx, vwPx));
}

/**
 * Compute the current nav brand-text fontSize in px
 */
export function getNavFontSizePx(navEl: HTMLElement | null): number {
  if (!navEl) return 26.4;
  const navTarget = navEl.querySelector('.nav-brand-text') as HTMLElement | null;
  if (!navTarget) return 26.4;
  return parseFloat(getComputedStyle(navTarget).fontSize) || 26.4;
}

/**
 * Measure targets for navbar MAGNM fontSize growth + position shift to footer.
 * Returns { fontSize (px), x, y } — NO scale transform, only real fontSize change.
 */
export function getNavToFooterFontTargets(
  navEl: HTMLElement | null,
  footerEl: HTMLElement | null
): { fontSize: number; x: number; y: number } {
  const targetFontSize = getHeroFontSizePx();

  if (!navEl) return { fontSize: targetFontSize, x: 0, y: 0 };

  const navTarget = navEl.querySelector('.nav-brand-text') as HTMLElement | null;
  if (!navTarget) return { fontSize: targetFontSize, x: 0, y: 0 };

  const navRect = navTarget.getBoundingClientRect();
  const currentX = (gsap.getProperty(navTarget, 'x') as number) || 0;
  const currentY = (gsap.getProperty(navTarget, 'y') as number) || 0;
  const untransformedNavLeft = navRect.left - currentX;
  const untransformedNavTop = navRect.top - currentY;

  // Footer slot position — the magnmRef div inside Footer
  if (footerEl) {
    const footerRect = footerEl.getBoundingClientRect();
    const footerFX = (gsap.getProperty(footerEl, 'x') as number) || 0;
    const footerFY = (gsap.getProperty(footerEl, 'y') as number) || 0;
    const untransformedFooterLeft = footerRect.left - footerFX;
    const untransformedFooterTop = footerRect.top - footerFY;

    return {
      fontSize: targetFontSize,
      x: untransformedFooterLeft - untransformedNavLeft,
      y: untransformedFooterTop - untransformedNavTop,
    };
  }

  // Fallback: position to left edge with standard padding
  const width = typeof window !== 'undefined' ? window.innerWidth : 1920;
  let padLeft = 40; // lg:px-10
  if (width < 640) padLeft = 16;
  else if (width < 768) padLeft = 24;
  else if (width < 1024) padLeft = 32;

  return {
    fontSize: targetFontSize,
    x: padLeft - untransformedNavLeft,
    // Move from navbar top (~48px) down to footer header area (viewport height - some offset)
    y: window.innerHeight * 0.08 - untransformedNavTop,
  };
}
