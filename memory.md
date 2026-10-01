# Memory — MAGNM Creative Studio Landing Page

Last updated: 2026-10-01 23:25
Repository: `https://github.com/adarzhpathade/magnm.git`
Branch: `main`

---

## 1. Executive Summary & Project Mission

MAGNM is a motion-driven, ultra-minimalist, monochromatic digital creative studio landing page. It is engineered with high visual fidelity, seamless 3D WebGL scenes, fluid scroll-driven GSAP sequences, and an interactive spatial soundscape.

The codebase features a modular, single-responsibility architecture across `src/components/experience/` (timeline hooks, master timings, animation helpers) and `src/components/ui/carousel/` (Three.js WebGL carousel engine). All 5 core sections—including the Footer stage with 3D XylophoneHelix and reverse MAGNM font expansion—are fully implemented, responsive, and synchronized across both desktop and mobile viewports.

---

## 2. ⚠️ Core Developer Constraints & Workflow Rules

1. **Exact Design Reference Fidelity**:
   - The monochromatic visual identity is non-negotiable (`#000000`, `#171717`, `#4D4D4D`, `#cccccc`, `#DEDEDE`, `#ffffff`).
   - Do NOT introduce random accent colors (red, blue, green, gradients) unless explicitly shown in a reference.
   - Exact spacing, typography, letter-spacing, and layout take precedence over personal preferences.

2. **No Checks After Every Minor Edit**:
   - Do NOT run validation, terminal commands, or build/lint checks after every individual step.
   - Run checks only at major completion milestones (e.g., after an entire section is wired or at session end).

3. **No Unwanted Browser Subagent Launches**:
   - Do NOT launch browser subagents unless explicitly requested by the user.
   - Rely on direct code precision, verified component APIs, and compile-time verification (`npx tsc --noEmit`).

4. **Preserve Third-Party Imported Components**:
   - Do NOT touch or refactor anything in:
     - `src/components/originkit/` (`xylophone-helix.tsx`, `liquid-glass-carousel.tsx`, etc.)
     - `src/components/unlumen-ui/`
     - `src/components/effects/`
     - `src/components/fancy/`

---

## 3. Design System & Palette Tokens

| Token | Hex | Role | Usage |
|---|---|---|---|
| Background Dark | `#000000` | Main deep background | Viewport background, Hero stage, dark sections, Footer stage |
| Dark Surface / Primary Text | `#171717` | High-contrast text & cards | Primary typography on light surfaces, button fill |
| Medium Dark Accent | `#4D4D4D` | Subtle borders & muted text | Borders, secondary labels, disabled states |
| Light Surface Primary | `#cccccc` | Light surface for Sec 3 & 4 | Our Work background, Projects card backdrop |
| Light Background Surface | `#DEDEDE` | High-key surface tint | Secondary light highlights and overlays |
| Pure White Accent | `#ffffff` | Flash backdrop | Stage flash transitions (`#white-stage-backdrop`) |

**Typography**:
- Primary Display: Custom Sans (`font-sans`, uppercase, tight tracking `-0.04em` to `-0.05em`)
- Technical / Data: Martian Mono / Monospace (`tabular-nums`, tracking `0.14em`)
- Editorial / Body: Minimalist grotesque sans-serif with subtle letter spacing

---

## 4. Full Codebase Inventory & Modular Architecture

```
src/
├── app/
│   ├── page.tsx                          — Entry point, renders <MainExperience />
│   ├── layout.tsx                        — Font optimization (Geist, Martian Mono), root HTML
│   └── globals.css                       — Base Tailwind, custom utilities, scrollbar hiding
├── components/
│   ├── MainExperience.tsx                — Orchestrator: refs, useGSAP lifecycle, JSX stage tree (Pages 1–5)
│   ├── Navbar.tsx                        — Fixed sticky navbar (z-50) with Brand dock target & action buttons
│   ├── Hero.tsx                          — Minimalist hero header, kinetic tagline, bottom-left CTA
│   ├── AboutManifesto.tsx                — Section 2 manifesto with progressive word illumination
│   ├── OurWork.tsx                       — Section 3: desktop OptionWheel wrapper + mobile tap-to-expand services
│   ├── Projects.tsx                      — Section 4: Projects title + LiquidGlassCarousel wrapper
│   ├── Footer.tsx                        — Section 5: monochromatic footer with 3D XylophoneHelix, kinetic tagline & CTA
│   ├── OptionWheel.tsx                   — Desktop interactive 3D circular service carousel
│   ├── ParallaxStripTransition.tsx       — 12-strip vertical wipe from Section 2 to Section 3
│   ├── SmoothScroll.tsx                  — Lenis smooth scrolling (desktop only; bypassed on mobile)
│   ├── Counter.tsx                       — Monospace odometer roll-up number counter
│   ├── BlurText.tsx                      — Text reveal with staggered character/word optical blur
│   ├── KineticShiftButton.tsx            — 3D letter-swap button with magnetic/spring hover
│   ├── FloatingRock.tsx                  — Decorative 3D asset with subtle inertia float
│   │
│   ├── experience/                       — 🎯 EXTRACTED FROM MAINEXPERIENCE MONOLITH
│   │   ├── timings.ts                    — Master TIMINGS config object for all 9 scroll phases
│   │   ├── animation-helpers.ts          — Sheet scale/slide tweens, getTransformTargets, getNavToFooterFontTargets
│   │   ├── use-responsive-wheel.ts       — Wheel scale state (54/70/90), resize listener, scrollRestoration
│   │   ├── use-desktop-timeline.ts       — Desktop pinned ScrollTrigger master timeline (min-width: 1024px)
│   │   └── use-mobile-timeline.ts        — Mobile sequential ScrollTrigger timelines (max-width: 1023px)
│   │
│   ├── ui/
│   │   ├── liquid-glass-carousel.tsx     — React forwardRef component wrapping the carousel engine
│   │   ├── letter-3d-swap.tsx            — Letter swap hover physics
│   │   ├── orbital-rings.tsx             — Decorative canvas/SVG orbital rings
│   │   ├── text-repel.tsx                — Interactive mouse-repelling text
│   │   ├── webgl-error-boundary.tsx      — Fallback container if WebGL context is lost or unsupported
│   │   │
│   │   └── carousel/                     — 🎯 EXTRACTED FROM CAROUSEL-ENGINE MONOLITH
│   │       ├── index.ts                  — Public barrel exports (createCarousel, types, defaultItems)
│   │       ├── types.ts                  — CarouselState, LiquidGlassCarouselHandle, PoolItem, Source, etc.
│   │       ├── constants.ts              — LENS, FOCUS, ENTRY, REPEATS, drag physics, hexToNumber
│   │       ├── default-items.ts          — Default project item showcase definitions
│   │       ├── shaders.ts                — Vertex & Fragment GLSL shaders (discLens, chromatic aberration)
│   │       ├── create-renderer.ts        — Three.js WebGLRenderer, scene, orthographic camera, quad mesh
│   │       ├── layout.ts                 — Slot math, wrap-around offsets, centerForIndex, mesh positioning
│   │       ├── input.ts                  — Wheel, drag, pointer capture, touch direction gating, custom cursor
│   │       ├── focus.ts                  — openFocus and closeFocus card-drop GSAP animations
│   │       ├── entry.ts                  — playEntry symmetrical center-outward ripple animation
│   │       ├── auto-scroll.ts            — Continuous progress bar calculation and idle auto-advance
│   │       └── create-carousel.ts        — Orchestrator connecting all modules inside RAF tick loop
│   │
│   ├── originkit/ui/                     — 3rd party UI (DO NOT MODIFY)
│   │   └── xylophone-helix.tsx           — 3D metal kinetic helix wheel
│   ├── unlumen-ui/                       — 3rd party UI (DO NOT MODIFY)
│   ├── effects/parallax-strip-slider/    — Parallax strip slice logic (DO NOT MODIFY)
│   └── fancy/physics/elastic-line.tsx    — Interactive SVG elastic line
│
├── hooks/
│   ├── use-dimensions.ts                 — Viewport bounding client rect tracker
│   ├── use-elastic-line-events.ts        — Mouse pointer physics for SVG elastic line
│   └── use-mouse-position.ts             — Normalized mouse coordinates hook
│
└── lib/
    ├── chime-synth.ts                    — Web Audio API glockenspiel synthesizer + scroll listener
    └── utils.ts                          — clsx / twMerge helper (`cn`)
```

---

## 5. Detailed Breakdown of Sections & Motion Pipeline

### Section 1: Hero & Navbar Docking
- **Navbar ([Navbar.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/Navbar.tsx))**:
  - Sticky fixed header (`z-50`) across the entire page.
  - Left brand target (`.nav-logo-light`, `.nav-logo-dark` + `.nav-brand-divider` + `.nav-brand-text`): dual origami metallic logo emblems (light on dark surfaces, dark on light surfaces; sized `h-[34px] sm:h-[35px] md:h-[36px] aspect-[1.5/1]`).
  - **Mobile vs Desktop Distinction**:
    - **Desktop (`>= 1024px`)**: Dual logo container (`md:h-[36px]`) separated by a refined thin vertical divider line (`.nav-brand-divider w-[1px] h-[20px] bg-white/20`) and paired with refined `MAGNM` wordmark (`.nav-brand-text font-['Familjen_Grotesk'] text-[1.65rem] uppercase origin-top-left will-change-[transform,font-size]`). Unified scale-down: `heroMagnmRef` in `Hero.tsx` scales down smoothly and docks beside `.nav-logo-container` and `.nav-brand-divider` (`0.04 -> 0.14`), locking together as ONE cohesive unit. In Section 3, `.nav-brand-divider` dynamically inverts to `rgba(23, 23, 23, 0.22)` on the light background at scroll `0.38`.
    - **Mobile (`< 1024px`)**: In mobile view, the navbar strictly displays **only the logo** — `.nav-brand-divider`, `.nav-brand-text`, and nav actions are hidden (`hidden lg:block` / `hidden lg:inline-block` / `hidden lg:flex`). The logo size is increased specifically on mobile (`h-[34px]` vs previously `28px`). On scroll (`0.0 -> 0.22`), the hero monolithic `MAGNM` title softly blurs and fades out (`opacity: 0, filter: 'blur(12px)', y: -14`), leaving only the enlarged logo cleanly illuminated in the navbar throughout Sections 2, 3, and 4.
  - Right action buttons (`ABOUT US` & `START A PROJECT`): strictly **not visible on the Hero section** (`opacity: 0, pointer-events: none`). Paired flat and minimal design with zero depth or shadow (`boxShadow: none`), matching compact proportions (`h-[27px] sm:h-[28px] md:h-[29px]`, padding `px-3 md:px-4`, font `text-[9.5px] md:text-[10.5px] tracking-[0.05em]`).
    - `ABOUT US`: Outline / without fill (`border border-white/20 bg-transparent text-[#cccccc] hover:border-white/50 hover:text-white`), smoothly scrolling to the About Manifesto section (Section 2). In Section 3 & 4 on the light background, dynamically inverts to `border-[#171717]/25 text-[#171717]`.
    - `START A PROJECT`: Filled pill button (`bg-white text-[#171717]`), dynamically inverting to dark (`bg-[#171717] text-white`) on light backgrounds. Smoothly opens the project intake modal.
    - Both reveal together when scrolling past the Hero section (from scroll `0.12` on desktop and `0.25` on mobile) and automatically fade back to `opacity: 0` when scrolling back up to Hero.
- **Hero ([Hero.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/Hero.tsx))**:
  - Monolithic `MAGNM` typography scaled across the full width, styled in `Familjen Grotesk` with `tracking-[-0.035em]` to match the navbar wordmark.
  - On desktop scroll (`0.0 -> 0.16`), `heroMagnmRef` scales down and translates directly into the top-left Navbar position via `getTransformTargets()`, settling smoothly beside the newly revealed logo.
  - Secondary elements (`heroTaglineRef`, `heroEmblemRef`, `heroBottomRef`) lift `-14px` and blur out with randomized optical blur.
  - On mobile, `Hero` follows Minimalist Direction: no paragraph clutter, emblem hidden, single bottom-left CTA button, 3D wheel scaled to `54`.

### Section 2: Centered About Manifesto
- **Manifesto ([AboutManifesto.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/AboutManifesto.tsx))**:
  - Pinned stage: statement appears at scroll `0.12` and remains centered.
  - Individual `.word` spans start blurred and dimmed (`opacity: 0.14, filter: blur(8px)`).
  - Progressive illumination scrubs across scroll `0.14 -> 0.30` (stagger `0.008s`), lighting words as the user scrolls.
- **3D Kinetic Helix Wheel ([xylophone-helix.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/originkit/ui/xylophone-helix.tsx))**:
  - Starts tilted (`tilt: 36, sideTilt: -35`) at `initialYOffset = 36px`.
  - During scroll `0.0 -> 0.26`, smoothly rotates upright (`tilt: 90, sideTilt: 0`) and centers directly behind the manifesto statement.
  - Interactive hover audio physics enabled only when `progress <= 0.30`. At scroll `0.34`, fades out cleanly.

### Section 2 &rarr; Section 3 Transition: Parallax Strip Slider
- **12 Vertical Strips ([ParallaxStripTransition.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/ParallaxStripTransition.tsx))**:
  - At scroll `0.34 -> 0.44`, Section 2 blurs out and lifts `-24px`.
  - 12 vertical strips wipe across the screen from left to right (`clipPath: 'inset(0 100% 0 0)'` &rarr; `'inset(0 0% 0 0)'`, stagger `0.006s`).
  - Underlying background slices scale down from `1.15` to `1.0`, creating high-end optical depth revealing the light `#cccccc` surface.
  - Navbar styles invert dynamically to dark text (`#171717`) and translucent dark button borders.

### Section 3: Our Work (Services)
- **Desktop (OptionWheel)**:
  - Active during scroll `0.44 -> 0.68`.
  - Pinned timeline scrubs a virtual index (`0 -> 5`), invoking `ourWorkHandleRef.current.setPositionDirect(index)`.
  - ScrollTrigger has discrete snap points (`snapTo`) for each service index with `0.35s` easing and `chimeSynth` tick audio.
- **Mobile (Card Sheet Slide-On)**:
  - Section 3 is a sticky card sheet (`sticky top-0 h-[100svh] bg-[#cccccc] text-[#171717] shadow-[0_-25px_60px_rgba(0,0,0,0.35)]`).
  - As user scrolls through `mobileHeroSpacerRef` (`110svh`), Section 3 slides UP on top of Section 2.
  - Section 2 underneath stays locked at `top: 0`, scales to `0.94`, and dims to `0.35`.
  - Features an editorial left-aligned header, monospace numbers `01`–`04`, and tap-to-expand service drawers with `<BlurText>`.

### Section 4: Projects Showcase (Liquid Glass Carousel)
- **Desktop**:
  - At scroll `0.68 -> 0.78`, Section 3 scales down to `0.8` (`animateSheetScaleDown`), revealing the white backdrop flash (`whiteBackdropRef`).
  - Section 4 (`page4ContainerRef`) slides up from bottom (`100% -> 0%`, `animateSheetSlideUp`).
  - At `progress >= 0.76`, triggers `projectsHandleRef.current.playEntry()` for the carousel intro sequence.
- **Mobile**:
  - Slides onto Section 3 with the exact same motion language: Section 3 stays locked, scales to `0.94`, dims to `0.35`, and Section 4 locks at `top: 0`.
  - Supported by `mobilePage3SpacerRef` (`25svh`) and `mobilePage4SpacerRef` (`25svh`) docking cushions.
- **WebGL Carousel Engine Features**:
  - **Heading & Copy**: Responsive display heading (`text-[28px] sm:text-[34px] md:text-5xl lg:text-[4.2rem] xl:text-[4.8rem]` in Familjen Grotesk, bold and prominent on 1 line across mobile devices) and editorial description (*"A curated archive of selected spatial systems, tactile digital interfaces, and interactive brand experiences engineered with precision."*, `text-[13px] sm:text-[14px] md:text-[15px]` with `max-w-[340px]`, docked 36px below the card to eliminate empty space).
  - **Symmetrical Card Ripple Entry**: Uniform card heights (`PANEL_H = 230px`), Card 0 mathematically centered (`x = 0`), symmetrical center-outward ripple (`staggerDelay = normDist * 0.16`).
  - **Auto-Advance Progress Line**: Hairline indicator: refined `h-[1px]` stroke with compact `max-w-[76px]` on mobile, `max-w-[110px]` on tablet, and `max-w-[280px]` on desktop. Fills 0% to 100% over 3.5s interval without resetting on hover or micro-moves.
  - **Interactions**: Drag/swipe with velocity physics, touch direction disambiguation (vertical scroll passes through to page; horizontal swipes control carousel), click-to-focus modal with card-drop animation, background click to dismiss.

### Section 5: Footer & Reverse MAGNM Expansion Behind 3D Helix
- **Layering & Z-Index Architecture**:
  - `#page-footer-bg` (`z-38`): Dedicated dark stage backdrop (`#000000`) sitting underneath Page 4 (`z-40`), revealed as Page 4 lifts.
  - `#page-4` (`z-40`): Pinned Section 4 container covering the footer completely until scroll `0.88`.
  - `.nav-brand-text` (`z-50`): The live navbar brand text element, styled in `Familjen Grotesk`, set to `will-change-[transform,font-size]` with `origin-top-left`.
  - `#page-footer` (`z-55`): Houses `Footer.tsx`. Contains the centered 3D `XylophoneHelix` at `z-20` (in FRONT of the navbar MAGNM text) and layout anchors at `z-10`.
- **Card Slide-Up Reveal (Scroll 0.88 &rarr; 1.00)**:
  - Page 4 container slides up and offscreen (`y: '0%'` &rarr; `'-100%'`, `ease: 'power2.inOut'`, duration `0.12`).
  - Dark shadow (`boxShadow: '0 30px 90px rgba(0, 0, 0, 0.5)'`) adds optical depth as Page 4 unmasks the stationary footer.
- **Navbar Partial Blur Departure**:
  - The non-text navbar items (`.nav-logo-container`, `.nav-brand-divider`, and action buttons) remain fully visible while Page 4 lifts, and only leave with optical blur (`filter: blur(16px)`, `opacity: 0`, `y: -14`) when Page 4 has lifted ~80% (progress `0.96`, duration `0.04`).
- **Reverse MAGNM Expansion (Pure Font-Size Interpolation)**:
  - Instead of CSS `scale` or a duplicate component, the live `.nav-brand-text` inside the fixed Navbar expands its actual `fontSize` from navbar size (`~26.4px`) up to the hero size (`clamp(4.25rem, 16vw, 15.5rem)`, computed dynamically via `getHeroFontSizePx()` at runtime).
  - Starts at progress `0.95` and settles at `1.00` (`duration: 0.05`, `ease: 'power2.inOut'`).
  - Spatial Offsets:
    - `x: -85`: shifts left to compensate for the brand logo + divider offset (~80px) and align with page horizontal padding and the tagline below.
    - `y: 75`: shifts down to compensate for vertical baseline drift when font size expands from ~26px to ~248px inside the flex row container.
    - Color shifts smoothly from nav tone (`#cccccc`) to hero display tone.
- **Behind the 3D Helix**:
  - In `Footer.tsx`, the 3D `XylophoneHelix` sits at `z-20` with responsive scale (140 on desktop, 115 on tablet, 88 on mobile) and glockenspiel hover audio.
  - The expanding navbar MAGNM text (`z-50`) expands directly behind the rotating metallic bars of the helix (`z-55 / z-20`).
- **Dynamic Tagline & Actions**:
  - Headline slot in `Footer.tsx` reserves `minHeight: calc(clamp(4.25rem, 16vw, 15.5rem) * 0.8)` so the dynamic tagline (`LET'S CREATE. / EXPLORE. / BUILD. / SHIP.`) with optical blur transitions (`AnimatePresence`) sits cleanly below the massive MAGNM headline without overlapping.
  - Bottom row features `KineticShiftButton` (`DISCUSS YOUR PROJECT`) linked to the project intake modal and monospace copyright timestamp.
- **Mobile Section 5 Parity**:
  - Controlled by dedicated `mobileFooterTl` ScrollTrigger (`trigger: footer, start: 'top 65%', end: 'top 10%', scrub: 0.3`).
  - Page 4 slides up (`y: -100%`), mobile logo fades with optical blur at `0.3`, and mobile footer text (`.footer-magnm-mobile`) blurs into view (`opacity: 0 -> 1, filter: blur(12px) -> blur(0px)`) behind the scaled mobile helix (`scale: 88`).
  - Dynamic navbar color listener updates contrast depending on whether viewport is over light Sections 3 & 4 or dark Footer.

---

## 6. Exact GSAP Desktop TIMINGS Config

```ts
export const TIMINGS = {
  heroDock:        { start: 0.00, duration: 0.16 }, // MAGNM docks to navbar
  navbarActions:   { start: 0.12, duration: 0.10 }, // Navbar actions fade in
  aboutManifesto:  { start: 0.14, duration: 0.16 }, // Words progressive illumination
  wheel3D:         { start: 0.00, duration: 0.26 }, // Wheel rotates upright
  stripWipe:       { start: 0.34, duration: 0.10 }, // Parallax 12-strip transition
  servicesScroll:  { start: 0.44, end: 0.68, duration: 0.24 }, // OptionWheel 6 services
  page3ScaleDown:  { start: 0.68, duration: 0.10 }, // Section 3 scales to 80%
  page4SlideUp:    { start: 0.72, duration: 0.14 }, // Section 4 slides up from bottom
  footerReveal:    { start: 0.88, duration: 0.12 }, // Section 5 Footer: Page 4 lifts & MAGNM scales up
};
```

---

## 7. Solved Issues & Historical Gotchas

1. **Card Asymmetry on Entrance**:
   - *Cause*: `rep !== midRep` pool culling and custom offset summation in earlier code caused uneven left/right distribution and an ugly left blank gap.
   - *Fix*: Maintained true infinite repeating loop coordinate math during entrance so cards tile symmetrically across both viewport edges.
2. **Hover Resetting Progress Line**:
   - *Cause*: `onPointerMove` had an active check `if (moveDist > 2) { state.lastActivity = performance.now(); }` which continuously updated `lastActivity` on every sub-pixel cursor movement over the canvas (near the progress line or on cards), resetting elapsed time to 0 and dropping the progress line back to 0%. In addition, `onPointerDown`, `onPointerUp`, and `onClick` were prematurely resetting `lastActivity` on empty clicks, and React re-renders were reconciling `transform: scaleX(0)` in JSX.
   - *Fix*: Completely removed `lastActivity` mutation from `onPointerMove`, `onPointerDown`, `onPointerUp`, and empty clicks in `input.ts`. Added `progressValRef` in `LiquidGlassCarousel` so React reconciles with the current progress rather than hardcoded 0. Added zero-drift `< 0.05` snap in `create-carousel.ts`. Now, hovering near the progress line or over cards allows the auto-advance line to fill smoothly without interruption or reset. Only genuine navigation actions (drags, horizontal wheel scrubs, side card clicks, arrow keys, and modal open/close) reset the timer.
3. **Mobile Sticky Stacking Loss**:
   - *Cause*: `overflow-hidden` on parent containers broke CSS `position: sticky`.
   - *Fix*: Used `overflow-x-clip lg:overflow-x-hidden` on the main container and dedicated SVH scroll spacers (`mobileHeroSpacerRef`, `mobilePage3SpacerRef`, `mobilePage4SpacerRef`, `mobilePageFooterSpacerRef`).
4. **Touch Event Blocking**:
   - *Cause*: WebGL canvas pointer capture swallowed vertical swipe gestures on mobile devices.
   - *Fix*: Implemented touch direction detection in `input.ts`. If `totalDy > totalDx`, pointer capture is immediately released so natural page scrolling occurs seamlessly.
5. **Scrollbar Removal**:
   - *Fix*: Added universal CSS rules in `src/app/globals.css` (`scrollbar-width: none !important; -ms-overflow-style: none !important; ::-webkit-scrollbar { display: none !important; }`) to remove visible scrollbars across all viewports and browsers while preserving Lenis smooth scrolling on desktop and native momentum scroll on mobile.
6. **Card Entrance Animation Triggering**:
   - *Cause*: On desktop, `animateSheetSlideUp` called `playEntry()` at `start` (0.74), when Section 4 was completely off-screen at `y: 100%`, finishing the 0.85s rise before the section even became visible. On mobile, `slideOnP4Tl` was spamming `playEntry()` continuously on every touch scroll tick after `0.05` progress, repeatedly killing the animation while off-screen. Furthermore, cards were initialized at `pEntry: 1` instead of starting hidden in their entrance pose.
   - *Fix*: In `animation-helpers.ts`, moved `onEnter` to `start + duration * 0.7` so cards animate right as Section 4 arrives in view. In `use-mobile-timeline.ts`, gated trigger with `p4EntryTriggered` flag at `self.progress >= 0.65`. In `entry.ts`, added `if (state.entryActive) return;` to prevent killing active runs. In `create-carousel.ts`, initialized `pEntry: fill(entryOn ? 0 : 1)` and added a threshold fallback in `IntersectionObserver` so entrance animation is 100% guaranteed to play.
7. **Projects Page Blank State Elimination**:
   - *Cause*: `entryDone` was initialized to `false` and hardcoded `opacity-0` was placed on `titleRef` and `counterRef` classNames, while `pEntry` in `entry.ts` zeroed out all cards (including offscreen ones) and would get permanently stuck if interrupted mid-flight or if premature `engine.playEntry()` was triggered on mount while Section 4 was offscreen.
   - *Fix*: Initialized `entryDone: true` and `pEntry: fill(1)` by default so content is immediately visible. Removed hardcoded `opacity-0` CSS classes from `titleRef` and `counterRef` (allowing GSAP `fromTo` to handle blur/fade gracefully without permanently blanking). In `entry.ts`, safeguarded `playEntry()` with `if (state.entryActive) return;`, kept offscreen cards at `1` so scrolling/dragging during entry never reveals invisible cards, and added an `onComplete` fallback to guarantee `state.entryActive = false` and `onEntryDone(true)`.
8. **Mobile Carousel Card Margin & Side Gaps**:
   - *Cause*: `panelHFor()` calculated card height strictly from `H * 0.28` (or `panelHeight = 230px`), making the card width `230 * 1.778 = 409px`. On phones (width 375–390px), this forced the card to be wider than the viewport, spanning edge-to-edge with 0 margin.
   - *Fix*: Updated `panelHFor(w, h)` in `create-carousel.ts` to clamp maximum card width to `Math.min(panelHeight * HORIZONTAL_ASPECT, w * 0.80)`. On a 390px viewport, card width is scaled to 312px, leaving a clean 39px margin on both sides with adjacent cards peeking in by 25px. The React UI (`titleRef`, `progressContainerRef`, `counterRef`) automatically docks at the updated height.
9. **Duplicate Entrance Animation & Reverse Scroll Jitter**:
   - *Cause*: Two separate, uncoordinated mechanisms were calling `playEntry()`: `IntersectionObserver` in `create-carousel.ts` fired at 15% visibility, and `tl.call()` embedded inside the scrubbed `animateSheetSlideUp` timeline fired at 70% progress. Because `tl.call` inside a scrubbed GSAP timeline executes both forward and reverse, scrolling backwards across the position re-executed `playEntry()` in reverse, causing cards to violently reset and jump.
   - *Fix*: Removed `tl.call` from `animateSheetSlideUp` and removed the animation trigger from `IntersectionObserver`. Centralized entrance triggering in `use-desktop-timeline.ts` and `use-mobile-timeline.ts` inside `onUpdate` with explicit `self.direction === 1` checks (`progress >= 0.82 && self.direction === 1 && !p4EntryTriggered`). Added `hasPlayed` state latch inside `entry.ts` and implemented `resetEntry()` that only resets when Section 4 is completely off-screen (`progress < 0.72`). In reverse scroll, no animation executes and cards stay settled.
10. **Nav MAGNM Text to Footer Scale-Up (Pure Font-Size Interpolation vs. Scale Transform)**:
    - *Cause*: Initial implementation tried using CSS `transform: scale()`, which caused blurry font edges at high scales and introduced layout clipping issues with the surrounding navbar elements. Furthermore, using a separate duplicated footer text broke visual continuity because the text in the navbar and footer did not feel like the exact same element.
    - *Fix*: Kept `.nav-brand-text` inside the fixed Navbar (`z-50`) and directly animated its `fontSize` via `getNavToFooterFontTargets()` to match `clamp(4.25rem, 16vw, 15.5rem)` in pixels, exactly reversing the hero-to-nav scaling. Added `will-change-[transform,font-size]` for silky smooth 60fps interpolation.
11. **Premature Navbar Departure & Timing Alignment**:
    - *Cause*: Navbar elements (`.nav-logo-container`, `.nav-brand-divider`, action buttons) were exiting at scroll progress `0.91`, vanishing while Page 4 was barely lifting, creating an awkward empty screen gap.
    - *Fix*: Delayed the navbar elements exit to `0.96` (when Page 4 is ~80% off-screen) with optical blur (`filter: blur(16px)`). Synchronized the MAGNM font-size expansion from `0.95` to `1.00`, so the text expands precisely as the footer content is uncovered.
12. **Horizontal and Vertical Drift of Expanded Nav Text**:
    - *Cause*: In the navbar, `.nav-brand-text` sits to the right of the brand logo and divider (~80px offset). Additionally, growing font-size from 26px to ~248px inside a vertical flex row (`items-center`) centered the glyphs, causing the top of the text to push upwards out of view, while overlapping the tagline below.
    - *Fix*: Applied `x: -85` in the GSAP tween to pull the text left to align with the standard page padding, and `y: 75` to counteract the upward flex expansion. In `Footer.tsx`, set `minHeight: calc(clamp(4.25rem, 16vw, 15.5rem) * 0.8)` on the headline slot container so the layout reserves the exact vertical height of the expanded headline, ensuring the dynamic `LET'S CREATE.` tagline stays cleanly positioned below it.
13. **Z-Index Layering for 3D Helix Over Expanding Text**:
    - *Cause*: If `Footer` was placed at `z-30`, the navbar MAGNM text (`z-50`) rendered on top of the 3D Xylophone Helix rather than behind it.
    - *Fix*: Split the footer structure in `MainExperience.tsx` into:
      - `#page-footer-bg` at `z-38` (behind Page 4 at `z-40`), providing the black stage.
      - `#page-footer` at `z-55` (in front of Navbar at `z-50`), with the 3D `XylophoneHelix` at `z-20` inside Footer, and the text layout anchor at `z-10`. This puts the expanding MAGNM text (`z-50`) visually behind the rotating metallic helix (`z-55 / z-20`) while sitting in front of the black background (`z-38`).

---

## 8. Current State & Completed Roadmap

### Phase A: Core Experience & Section Implementation (COMPLETED)
- [x] Section 1: Hero monolithic display heading & navbar docking transition.
- [x] Section 2: Pinned manifesto stage with progressive word illumination & centered 3D helix.
- [x] Section 2 &rarr; 3: Parallax 12-strip transition slice.
- [x] Section 3: Our Work desktop OptionWheel with chime synth audio & mobile accordion cards.
- [x] Section 4: Liquid Glass WebGL projects carousel with ripple entrance, continuous auto-advance, and card-drop focus modal.
- [x] Section 5: Monochromatic Footer stage with Page 4 slide-up, reverse MAGNM font-size expansion behind 3D XylophoneHelix, kinetic tagline, and contact action.

### Phase B: Modal System & Intelligent Theme Detection (COMPLETED)
- [x] Built `ProjectModal.tsx` and `AboutModal.tsx` using `createPortal` to render above all 3D content.
- [x] Integrated intelligent theme detection: modals calculate the opacity of the `.nav-logo-dark` element to determine the current background context (light/dark) and switch their `data-theme` accordingly for maximum contrast.
- [x] Implemented custom `AnimatePresence` dropdowns to replace native HTML `<select>` elements, maintaining the premium monochromatic aesthetic across all devices.
- [x] Reused the `LetterSwapPingPong` component inside modal buttons for consistent kinetic hover effects.
- [x] Removed unhooked/redundant "BOOK A 30-MINUTE CALL" and Budget inputs to adhere to the extreme minimalism requested by the user.

### Phase C: Final Performance & Visual Polish
1. Verify all breakpoints (mobile 375px/390px/430px, tablet 768px/1024px, desktop 1440px/1920px).
2. Ensure Three.js memory allocations and WebGL contexts remain clean and disposed on unmount.
