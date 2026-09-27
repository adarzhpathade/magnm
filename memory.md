# Memory — MAGNM Landing Page: Full Architecture, Mobile Page Transition Parity & Minimalist Refinement

Last updated: 2026-09-27 18:55

---

## ⚠️ Core Workflow Rules & Developer Constraints

1. **DO NOT RUN CHECKS AFTER EVERY STEP**:
   - There is NO need to run validation, terminal commands, or build/lint checks after every individual step or small code edit.
   - Run checks only at major completion milestones or when explicitly requested by the developer.

2. **NO NEED TO CHECK IN BROWSER AFTER EVERY STEP**:
   - Do NOT launch browser subagents, browser sessions, or browser verification steps after every individual change.
   - Rely on direct code precision, verified design references, and deliberate developer handoffs. Test in browser only when explicitly asked.

---

## What was built

### 1. Unified Mobile Page Transition System (Exact Parity: Page 2 &rarr; 3 &rarr; 4)
- **Problem Solved**:
  - Previously, Section 3 sliding onto Section 2 felt smooth, but Section 4 sliding onto Section 3 felt disjointed due to mismatched sizing (`min-h-[100svh]` vs `h-[100svh]`), lack of sticky docking (`relative` vs `sticky top-0`), missing overflow clipping (`overflow-visible`), an excessively large dead spacer (`h-[100svh]`), and no scroll cushion after Section 4 causing mobile address bars to cut off the final scroll progress.
- **Unified Architecture Implementation ([src/components/MainExperience.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/MainExperience.tsx))**:
  - **Identical Structural Containment**:
    - `heroAboutStageRef` (Page 1 & 2): `sticky top-0 z-20 w-full h-[100svh] lg:h-full lg:absolute lg:inset-0 overflow-hidden bg-[#000000] will-change-transform`.
    - `page3WrapperRef` (Page 3 - Our Work): `sticky top-0 lg:absolute lg:inset-0 z-35 w-full h-[100svh] lg:h-full lg:min-h-0 pointer-events-auto lg:pointer-events-none overflow-hidden bg-[#cccccc] text-[#171717] opacity-100 lg:opacity-0 will-change-transform flex items-center justify-center rounded-none shadow-[0_-25px_60px_rgba(0,0,0,0.35)] lg:shadow-none`.
    - `page4ContainerRef` (Page 4 - Projects): `sticky top-0 lg:absolute lg:inset-0 z-40 w-full h-[100svh] lg:h-full lg:min-h-0 pointer-events-auto lg:pointer-events-none opacity-100 lg:opacity-0 bg-[#cccccc] text-[#171717] overflow-hidden shadow-[0_-25px_60px_rgba(0,0,0,0.35)] lg:shadow-[0_-25px_80px_rgba(0,0,0,0.22)] rounded-none flex items-center justify-center will-change-transform`.
  - **Identical Motion Timelines & Easing Curves**:
    - **Page 2 &rarr; Page 3 (`slideOnTl`)**:
      - Trigger: `page3WrapperRef.current` (`start: 'top bottom'`, `end: 'top top'`, `scrub: true`).
      - Target: `heroAboutStageRef.current` &rarr; `scale: 0.94`, `opacity: 0.35`, `ease: 'none'`.
      - On Update: `heroAboutStageRef.current.style.visibility = self.progress >= 0.99 ? 'hidden' : 'visible'`.
    - **Page 3 &rarr; Page 4 (`slideOnP4Tl`)**:
      - Trigger: `page4ContainerRef.current` (`start: 'top bottom'`, `end: 'top top'`, `scrub: true`).
      - Target: `page3WrapperRef.current` &rarr; `scale: 0.94`, `opacity: 0.35`, `ease: 'none'`.
      - On Update: `page3WrapperRef.current.style.visibility = self.progress >= 0.99 ? 'hidden' : 'visible'`.
      - Trigger carousel entry when starting entrance: `if (self.progress > 0.05) projectsHandleRef.current?.playEntry()`.
  - **Optimized Cadence & Docking Cushions**:
    - `mobileHeroSpacerRef`: `h-[110svh]` — scrubs Hero fadeout, 3D wheel upright rotation, navbar brand docking, and manifesto progressive word illumination.
    - `mobilePage3SpacerRef`: Tightened from `h-[100svh]` to `h-[25svh]` — allows comfortable reading of Section 3 before a single natural thumb flick starts Section 4 sliding up.
    - `mobilePage4SpacerRef`: Added `h-[25svh]` scroll cushion after Section 4 — guarantees Section 4 reaches `progress = 1.0` and docks firmly at `top: 0` without prematurely hitting browser bottom bounds or address bar bounce.
  - **Full Reversibility**:
    - Scrolling backwards cleanly unhides previous sections, restoring `opacity: 1` and `scale: 1` dynamically.
  - **Desktop Zero-Impact Guarantee**:
    - All mobile classes use `lg:` overrides (`lg:absolute`, `lg:inset-0`, `lg:h-full`, `lg:overflow-hidden`); desktop pinned timeline inside `mm.add('(min-width: 1024px)')` remains 100% untouched.

---

### 2. Mobile Hero Pure Minimalist Layout (Direction 1)
- **Problem Solved**:
  - Mobile hero previously suffered from visual competition: stacked narrative paragraph, floating `[M]` emblem conflicting with the main wordmark, and stacked mismatched buttons at the bottom.
- **Refinement Implementation ([src/components/Hero.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/Hero.tsx))**:
  - **Stripped Redundant Narrative**: Removed the 3-line studio paragraph on mobile so the header area breathes with only the iconic `MAGNM` typography and kinetic tagline.
  - **Removed Floating Emblem**: Stripped the redundant floating `[M]` emblem from mobile bottom; emblem remains exclusively on desktop (`hidden md:flex`).
  - **Single Focused CTA Button**: Mobile features a single grounded button (`DISCUSS YOUR PROJECT +`) anchored at the **bottom-left** with generous thumb-reach spacing. The secondary button (`SEE WORK ↓`) is hidden on mobile (`hidden md:block`).
  - **Scaled 3D Helix Wheel**: Scaled mobile wheel up from `48` to `54` in both [Hero.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/Hero.tsx) and [MainExperience.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/MainExperience.tsx), giving the 3D metal wheel commanding centered presence.
  - **Desktop 100% Preserved**: Top-right narrative + emblem block and bottom dual buttons preserved intact on desktop.

---

### 3. Mobile Section 3 (Our Work) Layout & Editorial Typography
- **Refinement Implementation ([src/components/OurWork.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/OurWork.tsx))**:
  - **Container Parity**: Changed `min-h-screen` to `lg:min-h-screen` on the root container so on mobile it is strictly `h-full`, perfectly contained inside `page3WrapperRef`'s `100svh`.
  - **Editorial Padding & Clearance**: Updated mobile container to `pt-20 sm:pt-24 pb-8 sm:pb-12 px-2`, ensuring complete clearance below the fixed navbar and zero bottom clipping across all mobile viewports.
  - **Left-Aligned Header & Description**: Kept "We provide" heading and descriptive statement cleanly left-aligned with editorial spacing (`mt-5 sm:mt-6`, `mb-12 sm:mb-14`).
  - **Spacious Services Rows**: Scaled rows to `py-5 sm:py-5.5` with monospace numbering `01`–`04` and fluid tap-to-expand `<BlurText>` animation with smooth `layout="position"` motion.

---

### 4. Mobile Section 4 (Projects Showcase) Container Sizing
- **Refinement Implementation ([src/components/Projects.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/Projects.tsx))**:
  - Changed `min-h-screen` to `lg:min-h-screen` on the section container, ensuring it resolves to `h-full` within the `100svh` sticky card sheet on mobile.
  - [LiquidGlassCarousel](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/ui/liquid-glass-carousel.tsx) scales cleanly within the centered viewport card with horizontal swipe interaction.

---

### 5. Native Momentum Touch Scrolling on Mobile
- **Implementation ([src/components/SmoothScroll.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/SmoothScroll.tsx))**:
  - Lenis smooth wheel scrolling is strictly active on desktop (`window.innerWidth >= 1024`).
  - On mobile (`< 1024px`), Lenis is completely bypassed, returning native `children` for raw 120Hz momentum touch scrolling.
  - Root container utilizes `overflow-x-clip lg:overflow-x-hidden`, allowing CSS `position: sticky` to function without viewport truncation.

---

### 6. Prior System Polish & Foundational Fixes
- **3D Kinetic Helix Wheel Hover Scope Fix ([xylophone-helix.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/originkit/ui/xylophone-helix.tsx))**:
  - Gated hover reactions via `cameraControllerRef.current.interactive = progress <= 0.30`, keeping wheel physics active only in Hero and About sections.
- **Hero Button Kinetic Hover Fix ([MainExperience.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/MainExperience.tsx))**:
  - Excluded buttons from `.leave-blur-item` GSAP scrub animation to prevent overwrite of button CSS transforms and Framer Motion hover states.
- **Page 4 Carousel Enhancements ([liquid-glass-carousel.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/ui/liquid-glass-carousel.tsx), [carousel-engine.ts](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/ui/carousel-engine.ts))**:
  - 230px card height (`aspect-video`), responsive typography, empty space click-to-dismiss for focused projects, and idle auto-scroll (3.5s interval) with smart pause triggers.
- **Page 5 Orbit Stack Removal**:
  - Cleaned out Page 5 completely, making Page 4 the docked terminus of the page experience until the footer is built.

---

## Decisions made

1. **Card-Sheet Slide-On Pattern for All Mobile Page Transitions**:
   - Rather than standard vertical scrolling where elements simply leave the viewport, each major section (Section 3 and Section 4) slides UP directly ON TO the previous section as an elevated card sheet (`shadow-[0_-25px_60px_rgba(0,0,0,0.35)]`), while the section underneath stays locked at `top: 0`, scales down to `0.94`, and dims to `0.35` against the dark `#000000` backdrop.
2. **Strict 100svh Viewport Containment**:
   - Both `page3WrapperRef` and `page4ContainerRef` are enforced to `h-[100svh] overflow-hidden will-change-transform` on mobile. This ensures transforms scale precisely from the screen center without leaking or distorting.
3. **Dedicated Scroll Spacers for Natural Cadence**:
   - `mobileHeroSpacerRef` (`110svh`) provides the track for the 3D wheel rotation and word illumination.
   - `mobilePage3SpacerRef` (`25svh`) provides an intentional rest before Page 4 slides on.
   - `mobilePage4SpacerRef` (`25svh`) provides a docking cushion for Page 4.
4. **Desktop Preservation Priority**:
   - All mobile-specific CSS utilities are overridden with `lg:` classes, and JavaScript animations are segregated via `gsap.matchMedia()`.

---

## Current state

- **Section 1 (Hero)**:
  - Desktop: Kinetic 3D wheel audio, horizontal CTA buttons, top-right narrative & emblem.
  - Mobile: Minimalist Direction 1 — header breathes with MAGNM + kinetic tagline, single grounded bottom-left CTA, scaled wheel (`54`).
- **Section 2 (Manifesto)**:
  - 3D wheel rotates to upright vertical circle centered behind About Manifesto statement; progressive word illumination.
- **Section 3 (Our Work)**:
  - Desktop: Interactive OptionWheel with mouse drag and wheel scrubbing.
  - Mobile: Left-aligned editorial header, borderless tap-to-expand list (`01`–`04`) with partial optical blur reveal.
- **Section 4 (Projects)**:
  - Desktop & Mobile: Liquid glass WebGL carousel with project cards, auto-scroll, and click-to-focus modal.
- **Page Transitions (Mobile)**:
  - Page 2 &rarr; 3: Card sheet slides on top, Page 2 scales to 0.94 and dims to 0.35.
  - Page 3 &rarr; Page 4: Identical card sheet slide-on, Page 3 scales to 0.94 and dims to 0.35, Page 4 locks at `top: 0`.
- **Server**: Next.js running on `http://localhost:3000`. Clean TypeScript compilation (`0` errors).

---

## Next session starts with

- Design and build the Footer section following Page 4.
- Implement footer transitions and layout matching MAGNM monochromatic visual standards.
