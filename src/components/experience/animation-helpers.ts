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
      boxShadow: '0 -25px 80px rgba(0, 0, 0, 0.22)',
    },
    {
      y: '0%',
      opacity: 1,
      boxShadow: '0 -25px 80px rgba(0, 0, 0, 0.22)',
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
 * Aligns the MAGNM heading cleanly with page layout padding (40px left, 48px top on desktop).
 */
export function getNavToFooterFontTargets(
  navEl: HTMLElement | null,
  footerEl: HTMLElement | null
): { fontSize: number; x: number; y: number } {
  const targetFontSize = getHeroFontSizePx();

  // The expanded font with lineHeight 0.8 inside flex items-center expands vertically.
  // navTarget is centered inside a container (~44px tall). As font grows to targetFontSize,
  // half of the excess height pushes upward. We shift downward by that excess to align the top edge.
  const expandedHeight = targetFontSize * 0.8;

  // Standard responsive layout padding (matches px-4 sm:px-6 md:px-8 lg:px-10 and pt-8 sm:pt-10 md:pt-12)
  const width = typeof window !== 'undefined' ? window.innerWidth : 1920;
  let padLeft = 40; // lg:px-10 (2.5rem = 40px)
  if (width < 640) padLeft = 16;
  else if (width < 768) padLeft = 24;
  else if (width < 1024) padLeft = 32;

  let padTop = 48; // lg:pt-12 (3rem = 48px)
  if (width < 640) padTop = 32;
  else if (width < 768) padTop = 40;

  // Measure browser-computed padding from live navbar header if available
  if (navEl && typeof window !== 'undefined') {
    const navHeader = navEl.closest('header');
    if (navHeader) {
      const computed = window.getComputedStyle(navHeader);
      const cPadLeft = parseFloat(computed.paddingLeft);
      const cPadTop = parseFloat(computed.paddingTop);
      if (cPadLeft > 0) padLeft = cPadLeft;
      if (cPadTop > 0) padTop = cPadTop;
    }
  }

  const navContainerHeight = 44;
  const flexCenterOffsetY = (expandedHeight - navContainerHeight) / 2;

  if (!navEl) {
    return { fontSize: targetFontSize, x: padLeft - 123, y: flexCenterOffsetY };
  }

  const navTarget = navEl.querySelector('.nav-brand-text') as HTMLElement | null;
  if (!navTarget) {
    return { fontSize: targetFontSize, x: padLeft - 123, y: flexCenterOffsetY };
  }

  const navRect = navTarget.getBoundingClientRect();
  const currentX = (gsap.getProperty(navTarget, 'x') as number) || 0;
  const currentY = (gsap.getProperty(navTarget, 'y') as number) || 0;
  const untransformedNavLeft = navRect.left - currentX;
  const untransformedNavTop = navRect.top - currentY;

  // Footer target coordinates: default to computed layout padding
  let targetLeft = padLeft;
  let targetTop = padTop;

  // If footerEl is available and actively laid out in the DOM, measure its live coordinates
  if (footerEl) {
    const footerRect = footerEl.getBoundingClientRect();
    const footerFX = (gsap.getProperty(footerEl, 'x') as number) || 0;
    const footerFY = (gsap.getProperty(footerEl, 'y') as number) || 0;
    const untransformedFooterLeft = footerRect.left - footerFX;
    const untransformedFooterTop = footerRect.top - footerFY;

    // Guard against unmeasured / display:none / zero-bounding-box states
    if (footerRect.width > 0 && untransformedFooterLeft > 0 && untransformedFooterTop > 0) {
      targetLeft = untransformedFooterLeft;
      targetTop = untransformedFooterTop;
    }
  }

  // Vertical alignment:
  // When font grows with lineHeight 0.8 inside items-center flex container (height 44px),
  // it expands upward by flexCenterOffsetY. To place the top edge at targetTop,
  // we compensate for this offset.
  const navContainerTop = untransformedNavTop - (navContainerHeight - (navRect.height > 0 ? navRect.height : 26.4)) / 2;
  const targetY = (targetTop - (navContainerTop > 0 ? navContainerTop : padTop)) + flexCenterOffsetY;

  return {
    fontSize: targetFontSize,
    x: targetLeft - untransformedNavLeft,
    y: targetY,
  };
}
