# Memory — MAGNM Landing Page

Last updated: 2026-09-25 07:46

## What was built

### 1. Master Experience & Timeline Phasing ([src/components/MainExperience.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/MainExperience.tsx))
- **Unified Pinned Stage (`h-screen overflow-hidden`)**:
  - Pinned by GSAP `ScrollTrigger` with `pin: true`, `scrub: 0.15`, `anticipatePin: 1`, and extended total scroll height of `+=860%`.
  - Coordinates all 4 sequential sections (Hero, About Manifesto, Our Work / Services Wheel, and Project Showcase Orbit Ring) and 2 parallax strip transitions into a cohesive, uninterrupted motion journey.
- **Precision Phasing & Math**:
  - `0.00 → 0.11` (Phase 1): Huge "MAGNM" display wordmark scales and docks seamlessly into Navbar; secondary elements wipe out with randomized optical blur (`filter: blur(20px)`, `opacity: 0`).
  - `0.08 → 0.15` (Phase 2): Navbar actions and Section 2 Manifesto container smoothly emerge (`opacity: 0 → 1`, `y: 16 → 0`).
  - `0.00 → 0.18` (Phase 3): 3D Wheel rotates from hero orientation (tilt 36°, sideTilt -35°) into an upright kinetic circular ring in the viewport center (tilt 90°, sideTilt 0°, scale * 0.74, opacity 0.42).
  - `0.10 → 0.20` (Phase 4): Section 2 Manifesto words illuminate progressively (`filter: blur(0px)`, `opacity: 1`, stagger `0.006`).
  - `0.22 → 0.28` (Phase 5): Section 2 to Section 3 transition via 12-strip horizontal parallax wipe (left-to-right) into light `#cccccc` canvas; 3D wheel fades cleanly; single-element brand handoff at progress `0.27`; Navbar inverts to dark `#171717`.
  - `0.28 → 0.58` (Phase 6): Pinned Services Wheel (`servicesScrollObj.index: 0 → 5`) with 6 discrete snap points, mechanical audio tick, and 2-line optical blur descriptions.
  - `0.58 → 0.68` (Phase 7): Section 3 to Section 4 transition via 12-strip horizontal parallax wipe (right-to-left) into dark `#000000` canvas; Section 3 blurs and lifts out; Navbar re-inverts to light `#cccccc`.
  - `0.68 → 0.98` (Phase 8): Pinned Project Showcase 3D Ring Orbit progression (`showcaseScrollObj.progress: 0 → 1`) driving ring rotation offset across 14 curated studio projects.
- **Dynamic Pointer Events Delegation**:
  - Strict progress boundaries ensure non-active sections cannot intercept hover, click, or drag events:
    - `progress <= 0.08`: Hero active (`pointerEvents = 'auto'`).
    - `0.08 < progress < 0.22`: About Manifesto active.
    - `0.25 < progress < 0.60`: Our Work active.
    - `progress > 0.60`: Project Showcase active.

---

### 2. Universal Navbar & Brand Docking Architecture ([src/components/Navbar.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/Navbar.tsx))
- **Universal Stacking (`z-[100]`)**:
  - Fixed Navbar permanently floats above all pinned layers, 3D canvases, and transition slats.
- **Zero-Ghosting Brand Docking**:
  - `heroMagnmRef` acts as the single physical wordmark animating from hero scale down to exact pixel coordinates of `navBrandRef`.
  - At scroll progress `0.27` (hidden behind the slat wipe), executes an instantaneous handoff (`scrollTl.set(heroMagnmRef, { opacity: 0 })` and `scrollTl.set(navBrandRef, { opacity: 1 })`).
- **Bidirectional Contrast Inversion**:
  - Dark surfaces (Hero, About Manifesto, Project Showcase): text `#cccccc`, buttons `rgba(255, 255, 255, 0.08)` with border `rgba(255, 255, 255, 0.18)`.
  - Light surface (Our Work): text `#171717`, buttons `rgba(23, 23, 23, 0.06)` with border `rgba(23, 23, 23, 0.18)`.
  - Transitions are 100% reversible when scrolling backward.

---

### 3. Parallax Strip Transitions ([src/components/ParallaxStripTransition.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/ParallaxStripTransition.tsx))
- **Directional Support**:
  - `direction="horizontal"`: Left-to-right wipe (`clipPath: inset(0 100% 0 0) → inset(0 0% 0 0)`), stagger from `0`. Used for Section 2 → Section 3 into light `#cccccc` canvas (`zIndex: 30`).
  - `direction="horizontal-reverse"`: Right-to-left wipe (`clipPath: inset(0 0 0 100%) → inset(0 0 0 0%)`), stagger from `'end'`. Used for Section 3 → Section 4 into dark `#000000` canvas (`zIndex: 40`).
- **Parallax Slat Zooming**:
  - Internal surfaces scale from `1.15` down to `1.0` during the wipe, creating physical depth and tactile motion.

---

### 4. Section 4: Project Showcase — Orbit Flip Ring ([src/components/ProjectShowcase.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/ProjectShowcase.tsx), [src/components/effects/orbit-flip-slider/OrbitFlipSliderComp.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/effects/orbit-flip-slider/OrbitFlipSliderComp.tsx))
- **Installed Hyperiux Orbit Flip Slider**:
  - Added via `npx hyperiux add -y orbit-flip-slider`.
  - Locked permanently into the **"ring"** geometry preset (`ringRotateX: 31`, `ringRotateY: 56`, `ringRotateZ: -25`, `ringRadiusX: 1.5`, `ringRadiusY: 0.65`, `ringScale: 0.6`).
- **Minimalist Styling (No Pills & No Overlay Text)**:
  - Mode selector pills completely disabled (`showModeControls={false}`).
  - Project inspector / overlay text (`[01] AURA MONOLITH`) omitted per user instruction.
  - Subtle top badge: `[ 04 / SELECTED WORKS ]` in monospace.
- **Scroll-Driven Orbit & Ambient Lifecycle**:
  - Exposes `ProjectShowcaseHandle` (`setScrollProgress(progress)`).
  - Scrolling through Section 4 actively scrubs the ring's 3D rotation offset via master GSAP timeline.
  - Ambient rotation on `requestAnimationFrame` continues smoothly when resting and pauses on card hover.
  - Interactive 3D perspective flip on card hover (`perspective: 500px`, `rotateY: 160deg`, `y: -12px`).
- **14 Curated Studio Projects**:
  - High-resolution architectural and 3D imagery hosted on Cloudflare R2 vault storage.

---

### 5. Section 3: Our Work & Services Wheel ([src/components/OurWork.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/OurWork.tsx), [src/components/OptionWheel.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/OptionWheel.tsx))
- **Interactive 3D Services Wheel**:
  - Cylindrical 3D wheel rendering 6 studio disciplines in `OptionWheel`.
  - Driven directly by master timeline scroll via `setPositionDirect(index)`.
- **Zero-Latency Audio Tick**:
  - Synthesized mechanical impulse using Web Audio API (`AudioContext`).
  - Capped to prevent audio stutter during fast scrubs.
- **2-Line Optical Blur Reveals**:
  - Editorial description and service tags animate via `BlurText` with signature optical blur on each discrete transition.

---

### 6. Section 1 & 2: Hero & About Manifesto ([src/components/Hero.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/Hero.tsx), [src/components/AboutManifesto.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/AboutManifesto.tsx))
- **Persistent 3D Wheel (`XylophoneHelix`)**:
  - 44-bar metallic kinetic wheel with glockenspiel acoustic mode.
  - Dynamically resizes across viewports (scale: 90 desktop, 70 tablet, 48 mobile).
  - Rotates seamlessly from hero perspective into Section 2 center background.
  - Root div has `pointerEvents: "auto"` allowing interactive swing and sound trigger.
- **About Manifesto**:
  - Editorial statement: *"We architect digital flagships, kinetic identities, and generative software that transcend convention."*
  - Progressive illumination of individual words driven by scroll progress.

---

## Decisions made

1. **Ring Shape Mode Lock**:
   - Locked Orbit Flip Slider to `"ring"` mode with tilted perspective geometry for maximum depth.
2. **Minimalist Presentation**:
   - Stripped all pill buttons (`Flat`, `Tilt`, `Ring`, `Gallery`) and removed text overlays. Pure visual focus on the kinetic orbiting cards.
3. **Master Scroll-Driven Scrub**:
   - Master GSAP timeline advances the ring's orbit rotation during Phase 8 (`0.68 → 0.98`), blending physical scroll control with continuous ambient drift.
4. **Mirrored Transition Symmetry**:
   - Section 2 → Section 3: Left-to-right horizontal wipe into light surface.
   - Section 3 → Section 4: Right-to-left horizontal wipe into dark surface.

---

## Current state

- **Section 1 (Hero)**: Complete with 3D wheel, tagline, single-element wordmark docking, and interactive buttons.
- **Section 2 (About Manifesto)**: Complete with centered typography over upright kinetic wheel backdrop.
- **Section 2 → 3 Transition**: 12-strip horizontal parallax wipe (left-to-right) into light `#cccccc` canvas.
- **Section 3 (Our Work / Services Wheel)**: Complete & polished with 3D OptionWheel, mechanical audio tick, optical blur reveals, and 6 discrete snap points.
- **Section 3 → 4 Transition**: 12-strip horizontal parallax wipe (right-to-left) into dark `#000000` canvas.
- **Section 4 (Project Showcase)**: Complete with Hyperiux Orbit Flip Slider locked in ring formation, 14 curated project cards, perspective hover flip, scroll-sync, and clean minimal HUD.
- **Universal Navbar**: Elevated at `z-[100]` with automatic bidirectional contrast inversion.
- **Codebase Health**:
  - `npx tsc --noEmit` compiles cleanly with 0 errors.
  - Dev server running on `http://localhost:3000` (HTTP 200 OK).
