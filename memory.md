# Memory — MAGNM Landing Page Architecture, Motion System & Preloader

Last updated: 2026-09-22 21:28

## What was built

### 1. Main Experience Orchestrator ([src/components/MainExperience.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/MainExperience.tsx))
- **Unified Master Orchestration Component**:
  - Houses the persistent 3D wheel, preloader sequence, pinned hero-to-navbar scroll transition, and Section 2 layout.
  - Manages global preloader state (`isLoaded`, `loadProgress` 0–100).
  - Drives GSAP timelines via `useGSAP` with responsive breakpoints using `gsap.matchMedia()`:
    - Desktop (`>= 1024px`)
    - Tablet (`640px` - `1023px`)
    - Mobile (`< 640px`)

### 2. 20% Wheel Preloader & Clean Numeric Counter ([src/components/MainExperience.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/MainExperience.tsx))
- **Compact Preloader Wheel**:
  - Initial wheel scale set to `20` (maps directly to WebGL `scaleFactor = 0.20`, occupying precisely ~20% of screen fit).
  - Wheel spins continuously in the dead center of the screen (`y: 0`).
  - Page scroll is locked on mount (`document.body.style.overflow = 'hidden'`); Hero elements are hidden (`opacity: 0`).
- **React Bits Spring Rolling Counter**:
  - Integrated `<Counter />` from React Bits ([src/components/Counter.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/Counter.tsx)) with smooth spring-physics rolling digits (`useSpring`, `useTransform`).
  - Configured with `places={[100, 10, 1]}` for rock-solid zero-jitter alignment in `font-['Martian_Mono',monospace]` font-light.
  - Features top/bottom gradient overlays (`#000000` to `transparent`) creating a mechanical cylindrical rolling odometer effect.
  - Anchored directly below the compact 20% wheel (`translate-y-[76px] sm:translate-y-[84px]`).
- **Scale-Up Transition into Hero**:
  - Counter fades and glides down (`opacity: 0, y: 18, duration: 0.38s`).
  - 3D wheel smoothly expands by ~4.5x from `scale: 20` to `scale: 90` (desktop) while translating to hero position (`y: 36px`) over 1.25s via `power3.out`.
  - Hero UI fades into view (`opacity: 1`), scroll unlocks, and `ScrollTrigger.refresh()` initializes.

### 3. Dynamic "MAGNM" Wordmark Scale-Down & Synchronized Navbar Handover ([src/components/MainExperience.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/MainExperience.tsx), [src/components/Navbar.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/Navbar.tsx), [src/components/Hero.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/Hero.tsx))
- **Dynamic Scale & Docking into Fixed Navbar**:
  - The huge Hero display wordmark (`clamp(4.25rem, 16vw, 15.5rem)`) physically scales down and translates directly to the Navbar's top-left logo slot on scroll (`0.0 -> 0.36`).
  - **Prominent Wordmark Sizing**: Tuned target scale to `0.22` (desktop, ~36px font size / ~160px width), `0.26` (tablet, ~32px), and `0.32` (mobile, ~28px), ensuring it does not shrink into a tiny caption and maintains bold editorial presence.
  - **Generous Ceiling Clearance & Vertical Centering**:
    - Adjusted Navbar and Hero header padding to `pt-8 sm:pt-10 md:pt-12 pb-5 sm:pb-6 md:pb-7 px-4 sm:px-6 md:px-8 lg:px-10` with a unified `44px` row height.
    - Moves the navbar down by an additional ~20px on desktop (48px top clearance) and ~16px on tablet/mobile, giving an airy, relaxed editorial spacing.
    - Transform calculations automatically vertically center the scaled wordmark inside the `44px` navbar row (`navCenterY - scaledHeight / 2`), ensuring perfect alignment on the horizontal axis with the right-side buttons.
    - Subtracted existing transform offsets from `getBoundingClientRect()` to ensure geometry calculations remain 100% pure and invariant regardless of active scroll progress.
  - Secondary Hero elements (Tagline, Emblem narrative, and bottom CTAs) smoothly dissolve out over `0.0 -> 0.26`.
- **Seamless Unified Navigation Handover**:
  - The scaled-down `"MAGNM"` docks directly into the navbar and becomes the interactive fixed navigation logo (clickable to scroll back to top, with hover transition).
  - As `"MAGNM"` finishes docking, the right-side navbar action buttons (`DISCUSS YOUR PROJECT` and `MENU =`) drop down into the navbar (`0.24 -> 0.46`).
  - Section 2 centered manifesto text reveals simultaneously (`0.24 -> 0.48`), creating a unified, seamless handover with zero duplicate text or ghosting.

### 4. 3D Wheel Transition into Vertical Circle Backdrop ([src/components/originkit/ui/xylophone-helix.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/originkit/ui/xylophone-helix.tsx))
- On scroll through Hero into Section 2, the 3D wheel rotates from Hero angle (`tilt: 36, sideTilt: -35`) into a vertical front-facing circle in the center (`tilt: 90, sideTilt: 0`).
- Translates from hero offset (`y: 36px`) back to center (`y: 0px`), dims from `opacity: 1` to `opacity: 0.42`, and scales to `baseScale * 0.74` as an ambient kinetic backdrop.
- Added `cameraControllerRef` prop support to `XylophoneHelix` (`React.RefObject<{ tilt: number; sideTilt: number; scale?: number } | null>`):
  - Directly syncs `tiltRad`, `rollRad`, and `scaleFactor` inside the native 60/120 FPS WebGL render loop without triggering React re-renders or recreating WebGL buffers.

### 5. Section 2: Centered About Manifesto ([src/components/AboutManifesto.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/AboutManifesto.tsx))
- Minimalist layout focused purely on the center manifesto statement and top fixed Navbar.
- Removed extraneous top corner labels (`• ABOUT`, `[ 01 / 04 ]`) and bottom elastic line.
- Ultra-tight display typography with `leading-[1.02]` in `Familjen Grotesk`.
- Built with `<ScrollReveal />` for word-level scroll scrub with blur effects.
- Applied `mix-blend-difference` on text with transparent backgrounds, allowing typography to dynamically invert and blend over the kinetic metallic 3D wheel rotating behind it.

### 6. Global Scrollbar Removal ([src/app/globals.css](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/app/globals.css))
- Globally stripped native browser scrollbars (`scrollbar-width: none; -ms-overflow-style: none; ::-webkit-scrollbar { display: none; }`) while preserving fluid scrolling via Lenis, wheel, trackpad, and touch.

---

## Decisions made

1. **Layering & Stacking Hierarchy**:
   - `Hero` text and background: `bg-transparent`.
   - `heroMagnmRef` & `heroTaglineRef`: `z-0` (behind wheel on hero).
   - `wheelWrapperRef` (3D Wheel): `z-10` (in front of hero wordmark, behind About manifesto text).
   - Hero CTAs, Emblem, and About Manifesto: `z-20` (in front of wheel, fully clickable).
   - Preloader counter: `z-30`.
   - Navbar: `z-50`.
2. **Wheel Tilt Angle Geometry**:
   - Built on X-Z plane:
     - `tilt = 0°`: edge-on horizontal disk.
     - `tilt = 36°, sideTilt = -35°`: dynamic isometric perspective for Hero.
     - `tilt = 90°, sideTilt = 0°`: upright vertical circular ring for About Manifesto.
3. **WebGL Direct Camera Controller vs React State**:
   - Animating Three.js/WebGL camera props via React state caused heavy re-renders and frame drops. Mutating a ref (`cameraControllerRef.current`) read by the WebGL render loop runs at native 120 FPS with zero React re-render overhead.
4. **Preloader Minimalist Purity**:
   - User strictly specified no decorative brackets (`[ ]`) or text labels (`STUDIO ARCHITECTURE`). Counter is pure numeric percentage `{loadProgress}%` positioned tightly below the 20% wheel.
5. **Proportional Screen Scaling**:
   - `loaderStartScale = 20` (desktop) maps to `scaleFactor = 0.20` (20% of viewport fit scale). Proportional scaling handles tablet (`15`) and mobile (`12`).

---

## Problems solved

1. **Wheel Disappearing Behind Hero Page**:
   - *Problem*: Hero had `bg-[#000000]` which occluded the persistent 3D wheel at `z-10`.
   - *Solution*: Changed Hero container to `bg-transparent` with `pointer-events-none` on background wrappers and `pointer-events-auto` on interactive elements.
2. **Wheel In Front of Hero Text**:
   - *Problem*: User requested the wheel in front of hero wordmark ("move it to front").
   - *Solution*: Placed 3D canvas at `z-10` and display text at `z-0`.
3. **Huge Gap in Section 2 Manifesto**:
   - *Problem*: Default line height in `ScrollReveal` created large gaps between lines.
   - *Solution*: Replaced fixed leading with `cn("leading-[1.02]", textClassName)` allowing tight editorial typography.
4. **Text Blending Over 3D Elements**:
   - *Problem*: Text was flat over the 3D wheel.
   - *Solution*: Added `mix-blend-difference` to Section 2 text container and removed opaque background fills so words dynamically blend over the chrome bars.
5. **Scrollbar Clutter**:
   - *Problem*: Native scrollbar disrupted minimalist aesthetic.
   - *Solution*: Globally stripped scrollbars in `globals.css` with cross-browser rules.
6. **Hero BlurText Premature Trigger Behind Preloader**:
   - *Problem*: `BlurText` relied exclusively on `IntersectionObserver` on initial mount, triggering at t=0 while the preloader was running for 2 seconds. By the time the hero container faded in, the animation was already finished and text was static.
   - *Solution*: Added `trigger` prop to `BlurText`, wired `triggerReveal` in `Hero`, and fired `setTriggerHeroReveal(true)` right as the wheel expands from loader scale to hero scale, so `MAGNM`, the tagline, and the rotating word dynamically materialize with their organic blur effect right before the user's eyes.
7. **Hero Page Elements Disappearing (Only Wheel Visible)**:
   - *Problem*: `invalidateOnRefresh: true` on `scrollTl` caused GSAP to clear its recorded starting values when `ScrollTrigger.refresh()` was called upon preloader completion. Because `loaderTl` and `scrollTl` both targeted `heroContainerRef.current`'s `opacity`, GSAP captured `0` as the starting opacity, permanently locking `heroContainerRef` to `opacity: 0`. Additionally, `BlurText` had an invalid easing function `(t: number) => t` that failed Motion keyframe interpolation, and browser scroll restoration on refresh scrolled into Section 2 where Hero is dissolved.
   - *Solution*:
     - Decoupled preloader visibility from GSAP: managed initial hero fade-in cleanly with React state `triggerHeroReveal` and CSS `transition-opacity duration-700 ease-out` (switching to zero-lag immediate scrubbing once `isLoaded = true`).
     - Removed `invalidateOnRefresh: true` and added `immediateRender: false` on `scrollTl.fromTo(...)` so ScrollTrigger never corrupts starting opacity.
     - Changed `BlurText` default easing to cubic bezier `[0.22, 1, 0.36, 1]` so Framer Motion keyframe animations run with 100% reliability.
     - Added `history.scrollRestoration = 'manual'` and `lenis.scrollTo(0, { immediate: true })` on mount so page refreshes always start at scroll 0.

---

### 7. Parallax Strip Slider Transition into Page 3 ([src/components/effects/parallax-strip-slider/index.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/effects/parallax-strip-slider/index.tsx), [src/components/ParallaxStripTransition.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/ParallaxStripTransition.tsx), [src/components/MainExperience.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/MainExperience.tsx))
- **Hyperiux Integration**:
  - Initialized Hyperiux configuration and installed `parallax-strip-slider` into `src/components/effects/parallax-strip-slider/index.tsx`.
- **Dedicated Transition Engine**:
  - Implemented `<ParallaxStripTransition />` dividing the screen into 12 vertical strips (`width: 100 / 12 %`), each with `clipPath: inset(0 100% 0 0)` to `inset(0 0% 0 0)` and an offset full-width background container (`width: 1200%`, `left: -i * 100%`) creating a seamless Ken-Burns zoom (`scale: 1.15` down to `1.0`).
  - Seamlessly colored with light background `#cccccc`.
- **GSAP ScrollTrigger Choreography (0.64 -> 1.00)**:
  - As user scrolls past the illuminated Section 2 manifesto (`0.64 -> 0.78`), Section 2 text and the 3D wheel fade out cleanly.
  - The 12 vertical strips wipe across from left to right (`stagger: 0.015, duration: 0.22, ease: 'power2.out'`), cutting through the dark viewport into the solid light background `#cccccc`.
  - The Navbar automatically transitions colors for the light surface:
    - Docked MAGNM wordmark text transitions to `#171717`.
    - Action buttons (`.nav-action-btn`) transition to subtle translucent background (`rgba(23, 23, 23, 0.06)`), dark border (`rgba(23, 23, 23, 0.18)`), and dark text (`#171717`).
    - At `0.94`, the docked wordmark cleanly crossfades with the fixed `Navbar` brand slot so the navbar stays pinned at top when scrolling into Page 3.
- **Section 3 (Page 3)**:
  - Mounted `<section id="page-3" className="relative z-20 w-full min-h-screen bg-[#cccccc] text-[#171717]" />`.
  - Strictly empty with zero content, awaiting user instructions.

---

## Current state

- **Build / Type Verification**: `npx tsc --noEmit` passes with 0 errors.
- **Dev Server**: Running on `http://localhost:3000`.
- **Preloader**: Temporarily bypassed per user request (`isLoaded: true`, `triggerHeroReveal: true`); page loads directly into full Hero state with immediate wheel and text presence.
- **Section 1 (Hero)**: Display wordmark, dynamic tagline, emblem, CTAs, pinned scrub handover into Navbar.
- **Section 2 (About)**: Centered About Manifesto statement only with top fixed Navbar.
- **Section 3**: Clean canvas inside the light `#cccccc` surface, completely cleared and reserved for a ground-up redesign in the next session.
- **Page after Section 3**: Removed `<section id="page-3">` so the document flow ends cleanly.

---

## Next steps

- Next session: Redesign Section 3 from scratch with fresh creative direction.
