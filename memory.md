# Memory — MAGNM Landing Page Hero & Responsive Refinement

Last updated: 2026-09-22 09:02

## What was built

- **Hero Component Refinement** ([src/components/Hero.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/Hero.tsx)):
  - Scaled-up `"MAGNM"` display wordmark (`clamp(4.25rem, 16vw, 15.5rem)`) with tight grotesque leading (`leading-[0.8]`, `tracking-[-0.04em]`).
  - Placed dynamic/static tagline directly underneath `"MAGNM"` wordmark with calibrated spacing (`mt-3.5 sm:mt-4 md:mt-5`).
  - Integrated brand metallic emblem ([public/magnm light.png](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/public/magnm%20light.png)), 1px vertical divider (`bg-white/20`), and studio narrative statement ("Websites, AI products, brands...").
  - Desktop layout (`>=768px`): Emblem unit in top-right quadrant aligned alongside navigation options. Bottom-left actions (`"DISCUSS YOUR PROJECT"`, `"BOOK A 30-MINUTE CALL"`) visible with geometric `+` hover micro-interactions and `Letter3DSwap`.
  - Mobile layout (`<768px`): Bottom-left actions hidden (`hidden md:flex`) to preserve negative space. Emblem unit positioned at bottom-right (`flex md:hidden self-end ml-auto`). 3D wheel centered and scaled down (`scale={48}`, `translate-y-0`) to balance composition without crowding.
- **Page Cleanup** ([src/app/page.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/app/page.tsx)):
  - Removed provisional second section per user request to keep the landing page focused solely on the polished Hero.
- **Asset Additions**:
  - [public/magnm light.png](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/public/magnm%20light.png): Transparent high-resolution metallic brand emblem.
  - [src/components/ui/orbital-rings.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/ui/orbital-rings.tsx): Interactive ambient gyroscope ring system preserved for future sections.
- **UI Registry Update** ([ui-registry.md](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/ui-registry.md)):
  - Documented updated dimensions, responsive breakpoints, typography hierarchies, and layout rules.

## Decisions made

1. **Tagline Hierarchy & Placement**: Placed directly under the primary `"MAGNM"` wordmark rather than floating in the bottom-right corner, grounding the visual identity and establishing a clear left-aligned reading sequence.
2. **Mobile Layout Prioritization**: On screens under 768px, bottom call-to-action buttons are hidden in favor of the studio statement and emblem in the bottom-right, allowing the 3D kinetic wheel to sit unobstructed in the center.
3. **Emblem Unit Presentation**: Composed of a 44px metallic logo mark, a delicate 1px line divider (`bg-white/20`), and 2-line studio capability statement set in `Familjen Grotesk` (`text-white/60`, leading-tight).
4. **Responsive 3D Sizing**: Dynamic hook in `Hero.tsx` calculates wheel scale across breakpoints (`48` on mobile <640px, `70` on tablet, `90` on desktop).

## Problems solved

1. **Mobile Centering & Visual Overcrowding**: The 3D wheel previously felt off-center on mobile due to desktop vertical translation classes (`translate-y-7`). Fixed by removing the translation on mobile (`translate-y-0`) and scaling the radius to `48`.
2. **Tagline Spacing Calibration**: Iteratively calibrated the top margin between the main wordmark and the tagline (`mt-3.5 sm:mt-4 md:mt-5`) to avoid overlap while maintaining tight visual tension.

## Current state

- **Build / Type Verification**: `npx tsc --noEmit` passes with 0 errors.
- **Dev Server**: Running on `http://localhost:3000`.
- **Git State**: Clean and ready for commit.

## Next session starts with

1. **Subsequent Sections Implementation**:
   - Implement Section 2 (projects/portfolio, studio manifesto, or capabilities index) when design references are provided.
   - Configure scroll transitions (Lenis smooth scroll / GSAP ScrollTrigger) linking out of the Hero into Section 2.

## Open questions

- Awaiting user design references and direction for subsequent landing page sections.
