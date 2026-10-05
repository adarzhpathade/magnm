# Memory — MAGNM Creative Studio Landing Page

Last updated: 2026-10-05 14:42
Repository: `https://github.com/adarzhpathade/magnm.git`
Branch: `main`

---

## 1. Executive Summary & Project Mission

MAGNM is a motion-driven, ultra-minimalist, monochromatic digital creative studio landing page. It is engineered with high visual fidelity, seamless 3D WebGL scenes, fluid scroll-driven GSAP sequences, an interactive spatial soundscape, and comprehensive modern SEO/GEO architecture.

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
public/
├── llms.txt                              — Generative Engine Optimization (GEO) grounding text
├── magnm light.png                       — Metallic high-res logo emblem
├── Magnm Dark Logo.png                   — Dark metallic logo emblem
└── favicon.ico                           — Browser shortcut icon

src/
├── app/
│   ├── page.tsx                          — Entry point, renders <MainExperience />
│   ├── layout.tsx                        — Font optimization, Open Graph, Twitter cards & Schema.org JSON-LD
│   ├── robots.ts                         — Dynamic robots.txt generation with AI search crawler rules
│   ├── sitemap.ts                        — Dynamic XML sitemap generation (/sitemap.xml)
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
│   │   ├── flex-carousel.tsx             — React Bits WebGL (OGL) curved/flat multi-card showcase engine
│   │   ├── flex-carousel.css             — Split captions, animated counter digits & auto-scroll progress styling
│   │   ├── liquid-glass-carousel.tsx     — React forwardRef component wrapping earlier Three.js carousel engine
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
  - Dual bottom-left CTA buttons (`DISCUSS YOUR PROJECT` and `ABOUT US`), 3D wheel scaled to `54` on mobile and `90` on desktop.

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
  - In `Footer.tsx`, the 3D `XylophoneHelix` sits at `z-20` with responsive scale (210 on desktop, 165 on tablet, 130 on mobile), rightward tilt (`tilt: 42, sideTilt: -38`), rightward offset (`translate-x-8 sm:translate-x-12 md:translate-x-16 lg:translate-x-24`), and glockenspiel hover audio.
  - The expanding navbar MAGNM text (`z-50`) expands directly behind the rotating metallic bars of the helix (`z-55 / z-20`).
- **Dynamic Tagline & Actions**:
  - Headline slot in `Footer.tsx` reserves `minHeight: calc(clamp(4.25rem, 16vw, 15.5rem) * 0.8)` so the dynamic tagline (`LET'S CREATE. / EXPLORE. / BUILD. / SHIP.`) with optical blur transitions (`AnimatePresence`) sits cleanly below the massive MAGNM headline without overlapping.
  - Bottom row features `KineticShiftButton` (`DISCUSS YOUR PROJECT`) on the left, and a prominent, enlarged light metallic MAGNM logo (`/magnm light.png`, `h-16 sm:h-20 md:h-24 lg:h-28 xl:h-32`) on the right bottom corner. Both units reveal smoothly together via `.footer-action-btn` GSAP ScrollTrigger timeline.
- **Mobile Section 5 Parity**:
  - Controlled by dedicated `mobileFooterTl` ScrollTrigger (`trigger: footer, start: 'top 65%', end: 'top 10%', scrub: 0.3`).
  - Page 4 slides up (`y: -100%`), mobile logo fades with optical blur at `0.3`, and mobile footer text (`.footer-magnm-mobile`) blurs into view (`opacity: 0 -> 1, filter: blur(12px) -> blur(0px)`) behind the scaled mobile helix (`scale: 100`).
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
13. **Z-Index Layering for 3D Helix Over Expanding Text & Isolation from Projects Page**:
    - *Cause*: `#page-footer` was previously set to `z-55` to sit above `Navbar` (`z-50`). But because Page 4 (`#page-4`, Projects Showcase) is at `z-40`, setting `#page-footer` to `z-55` caused `#page-footer` (`55 > 40`) to render on top of the Projects page, showing the 3D Helix and "LET'S CREATE" text prematurely over the carousel.
    - *Fix*:
      1. Placed the Footer's `MAGNM` heading directly inside `Footer.tsx` (`.footer-magnm-heading`) at `z-10`.
      2. In `Footer.tsx`, `XylophoneHelix` sits at `z-20`, rendering directly **above** the `MAGNM` heading (`20 > 10`).
      3. Set `#page-footer` to `z-38` and `#page-footer-bg` to `z-36`, strictly **underneath** `#page-4` (`z-40`). Page 4 now completely covers the Footer until scroll progress `0.88`, ensuring zero bleed-through on the Projects page.
      4. In Hero, `heroContainerRef` sits at `z-10` while `wheelWrapperRef` sits at `z-20` (`20 > 10`), so the 3D Wheel renders directly **above** the Hero `MAGNM` text.
      5. `Navbar` (`z-50`) stays strictly on top of all stages without obstruction.
14. **Hero Page Button Clickability (Pointer-Events Stacking Isolation)**:
    - *Cause*: Section 3 (`#page-3`, Our Work) was styled as `lg:absolute lg:inset-0 z-35`, spanning the entire desktop viewport. In `use-desktop-timeline.ts`, it was initialized with `visibility: 'visible'` (even though `opacity: 0`), and inside `OurWork.tsx`, `<div ref={containerRef}>` had hardcoded `pointer-events-auto`. In CSS, descendant elements with `pointer-events: auto` override ancestor `pointer-events: none` as long as `visibility` is `visible`. Consequently, `OurWork` and `OptionWheel` at `z-35` intercepted all mouse clicks across the desktop viewport, completely blocking clicks to the Hero action buttons (`DISCUSS YOUR PROJECT` and `ABOUT US`) located at `z-10`.
    - *Fix*:
      1. In `MainExperience.tsx`, added `lg:invisible` to `#page-3` and `#page-4` so they remain strictly hidden on desktop during Hero view.
      2. In `OurWork.tsx`, removed hardcoded `pointer-events-auto` from the full-screen root container, allowing pointer-events to follow the wrapper lifecycle.
      3. In `use-desktop-timeline.ts`, initialized `refs.page3Wrapper.current` and `refs.page4Container.current` with `visibility: 'hidden'` and `pointerEvents: 'none'`. In `onUpdate`, dynamically set `visibility` and `pointerEvents` to `visible` / `auto` strictly when their respective section is active (`0.38 - 0.78` for Sec 3, `0.74 - 0.88` for Sec 4), and `hidden` / `none` when off-section or returning to Hero.
15. **True Scroll-Driven Footer Reveal with Partial Optical Blur**:
    - *Problem*: The Footer was revealing directly / popping in instantaneously instead of being smoothly revealed by scroll. This had two root causes:
      1. In `use-desktop-timeline.ts`, `isPage4Active` was set to `progress >= 0.74 && progress < 0.88`, which set `page4Container.style.visibility = 'hidden'` the instant `progress` reached `0.88`. Because Page 4 vanished in a single frame, its GSAP timeline tween (`y: '0%' -> '-100%'`) was animating a hidden element, causing the curtain to pop off and expose the footer directly without a smooth slide-up.
      2. In `Footer.tsx`, `BlurText` was driven by an autonomous timer triggered by state (`trigger={isRevealed}`) rather than being scrubbed with the user's scrollbar.
    - *Fix*:
      1. In `use-desktop-timeline.ts`, updated `isPage4Active` to `progress >= 0.72 && progress <= 1.0` so Page 4 remains visible throughout its entire slide-up off-screen animation (`0.88 -> 1.00`), creating a physical theatre curtain reveal of the stationary footer underneath. Page 4's `pointerEvents` are gated to `progress >= 0.74 && progress < 0.88`.
      2. In `use-desktop-timeline.ts`, set the Footer and `#page-footer-bg` to `visibility: 'visible'` at `0.84` (safely behind Page 4 which covers the screen at `z-40`), ensuring the footer is pre-rendered and ready when Page 4 starts lifting at `0.88`.
      3. In `Footer.tsx`, replaced `BlurText` with individual `.footer-magnm-char` character spans and structured `.footer-tagline-lets` / `.footer-tagline-word` spans.
16. **Optical Left-Alignment Between Display MAGNM Heading and Tagline**:
    - *Problem*: In both the Footer and Hero, the massive display heading `MAGNM` (`text-[clamp(4.25rem,16vw,15.5rem)]`) appeared indented to the right relative to the tagline (`LET'S CREATE.` / `WE MAKE COOL SHIT FOR...`). Because large-scale font glyphs carry built-in font side-bearings (left glyph margins of ~14px at 248px font size), the visible vertical stem of `M` did not align flush with the vertical line of `L` in `LET'S`.
    - *Fix*:
      1. Added `-ml-[0.055em]` to `.footer-magnm-heading` in `Footer.tsx` and `heroMagnmRef` in `Hero.tsx`. This optically offsets the font's internal side-bearing in direct proportion to the font-size (~13.6px on desktop), bringing the visible outer stem of `M` flush with the left alignment axis of the tagline.
      2. Enforced consistent `font-['Familjen_Grotesk',sans-serif]` across both the headline and tagline elements for unified character geometries.

17. **Restoration of Nav Brand Wordmark to Footer Font Expansion & Exact Left Optical Alignment**:
    - *Problem*: In an earlier attempt to add a blur effect to footer text, `.nav-brand-text` was placed inside `navLeaveElements` to fade out at `0.96`, and its `fontSize` expansion tween was replaced with an in-situ duplicated text block (`.footer-magnm-char`). This broke the seamless visual continuity from commit `13bca99`. Furthermore, due to a hardcoded `x: -85` in the expansion tween and font glyph internal margins (`Familjen Grotesk` carries ~0.055em left side bearing on capital `M`), the outer stem of `M` was indented by 19px to the right relative to `LET'S BUILD.` and `DISCUSS YOUR PROJECT`.
    - *Fix*:
      1. In `use-desktop-timeline.ts`, removed `.nav-brand-text` from `navLeaveElements` so only `.nav-logo-container` and `.nav-brand-divider` fade out with optical blur at `0.96`.
      2. In `animation-helpers.ts`, updated `getNavToFooterFontTargets` to compute dynamic optical compensation `opticalCompensation = targetFontSize * 0.055`, producing `x = (untransformedFooterLeft - untransformedNavLeft) - opticalCompensation`. This aligns the visible outer ink of `M` flush with the left padding axis across any desktop resolution.
      3. In `use-desktop-timeline.ts`, wired `x` and `y` to use dynamic functions `x: () => getNavToFooterFontTargets(...).x` and `y: () => getNavToFooterFontTargets(...).y`.
      4. In `Footer.tsx` and `Hero.tsx`, added `-ml-[0.055em]` to the tagline and mobile heading containers, pulling `LET'S` and `MAGNM` into exact flush vertical alignment with `DISCUSS YOUR PROJECT`.
      5. **Zero-Contamination Layering for 3D Helix & Page 4**: Fixed the premature appearance of the 3D helix on Page 4. Previously, `#page-footer` was set to `visibility: visible` at `0.84` (before Page 4 lifted at `0.88`), and lifted to `zIndex: 55` at `0.96` (while Page 4 was still ~25% on screen). Now:
         - `#page-footer` is strictly gated to `progress >= 0.88` (so it remains `visibility: hidden` throughout Page 4).
         - `#page-footer` permanently stays at `z-38` strictly underneath Page 4 (`z-40`). As Page 4 lifts like a physical curtain from `0.88 -> 1.00`, it covers `#page-footer` completely. The helix can NEVER render on top of Page 4.
         - At `0.96` (when navbar items blur out), `refs.navbarHeader.current` drops its z-index from `50` to `37` (underneath `#page-footer` at `z-38`, but above `#page-footer-bg` at `z-36`). This places the 3D helix in front of the expanding `MAGNM` text without ever jumping above Page 4.
      6. Preserved all user-approved footer refinements: tuned 3D helix scale (210) & rotation (`tilt: 42, sideTilt: -38`, `translate-x-24`), and the big light MAGNM logo in the bottom right corner.

18. **Footer Action Button Interactivity & Stacking Context Fix**:
    - *Problem*: The "DISCUSS YOUR PROJECT" button in the footer was not responding to mouse clicks or hovers. This was caused by two compounding issues:
      1. In `Footer.tsx`, the outer foreground wrapper had `relative z-10 w-full h-full pointer-events-none`. Because this container created a stacking context at `z-10`, all of its children (including the button with `relative z-30 pointer-events-auto`) were capped at stacking level 10 relative to siblings. The sibling 3D XylophoneHelix WebGL canvas container (`absolute inset-0 z-20 w-full h-full pointer-events-auto`) covered the entire screen at level 20, intercepting all clicks and pointer events across the viewport.
      2. In `use-desktop-timeline.ts`, `isFooterInteractive` was previously gated strictly to `progress >= 0.95`. If the user scrolled to 0.88 - 0.94, `refs.footerWrapper.current.style.pointerEvents` was set to `'none'`.
    - *Fix*:
      1. In `Footer.tsx`, removed `z-10` from the outer foreground wrapper so it does not establish an isolated stacking context. Set `<header className="relative z-10 ...">` at `z-10` so text remains behind the 3D helix canvas (`z-20`). Set the bottom button row to `pointer-events-none relative z-30` (above the `z-20` helix canvas) with `pointer-events-auto` on the button container.
      2. This ensures that:
         - The "DISCUSS YOUR PROJECT" button sits at `z-30` above the WebGL canvas and is immediately responsive to hover and click events.
         - Any click in empty spaces passes through transparently to the 3D XylophoneHelix at `z-20`.
         - The 3D helix continues to render in front of the header text and the expanded `.nav-brand-text`.
      3. In `use-desktop-timeline.ts`, aligned `isFooterInteractive` with `progress >= 0.88`, ensuring the footer is interactive as soon as Page 4 begins lifting. Also added `pointerEvents: 'none'` to Page 4 and hidden visibility when Page 4 has lifted fully off screen.

19. **Footer Bottom Right: Developer Credits & Studio Info with Nav Button Hover Effect**:
    - *Design*: Replaced the bottom right MAGNM logo image with a structured typographic editorial block:
      1. **Studio Section**:
         - Header: `STUDIO` (`Martian Mono` uppercase tracking).
         - `Based in Indore`: With interactive `LetterSwapPingPong` and hover sound.
         - `hello@magnm.com`: Mailto link with `LetterSwapPingPong`, baseline underline (`border-b border-[#cccccc]/25 group-hover:border-white`), and hover sound.
      2. **Developer Credits Section** (Exact Match to User Reference Image):
         - Header: `DEVELOPED BY` (`Martian Mono` uppercase tracking).
         - `Pranav Dubey`: Link with `LetterSwapPingPong`, baseline underline (`border-b border-[#cccccc]/25 group-hover:border-white`), and hover sound.
         - `Adarsh Pathade`: Link with `LetterSwapPingPong`, baseline underline (`border-b border-[#cccccc]/25 group-hover:border-white`), and hover sound.
      3. Supported `<a>` and `<button>` tags within `letter-swap-pingpong-anim.tsx` via `scope.current?.closest('button') || scope.current?.closest('a') || scope.current?.parentElement`.

20. **Application of Page 3's Text Blur Reveal Effect to Footer Text**:
    - *Analysis of Page 3*:
      1. Component-level text blur: In `OurWork.tsx` line 161, dynamic description text uses `<BlurText animateBy="words" direction="none" randomize={true} delay={24} stepDuration={0.2} trigger={true} />` with `exit={{ filter: 'blur(12px)', opacity: 0 }}`. It animates keyframes from `blur(18px), opacity: 0` -> `blur(8px), opacity: 0.55` -> `blur(0px), opacity: 1` with a randomized shuffled stagger.
      2. Scroll-driven timeline text blur: In `use-desktop-timeline.ts` line 679, `scrollTl.fromTo(refs.page3Container.current, { opacity: 0, filter: 'blur(16px)', y: 0 }, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.08, ease: 'power2.out' }, 0.36)`.

21. **Footer Refinements: Underline Removal, Elimination of Position-Up Reveal, and True Partial Blur Restoration**:
    - *Underline Removal*: Stripped all baseline borders (`border-b border-[#cccccc]/25 group-hover:border-white`) from `Based in Indore`, `hello@magnm.com`, `Pranav Dubey`, and `Adarsh Pathade`, replacing with clean `py-0.5` padding.
    - *Elimination of Vertical Position-Up Shift*:
      1. Removed all `y: 8 -> 0` and `y: [8, 2, 0]` translation arrays from the cycling words in `Footer.tsx`.
      2. Removed the `.footer-reveal-text` GSAP tween in `use-desktop-timeline.ts` (which had applied `y: 8 -> 0`), keeping all footer typography 100% stationary.
      3. Removed `y: 10 -> 0` from `.footer-magnm-mobile` in `use-mobile-timeline.ts`.
    - *Genuine Partial Blur Text Effect Restoration*:
      1. Diagnosed why the partial blur effect was previously obscured: (a) a blanket container-level GSAP tween (`filter: blur(16px)`) was smothering the granular letter-by-letter blur; (b) an autonomous timer in `Footer.tsx` was running immediately on mount before the user scrolled to Section 5; and (c) a custom whole-word `<motion.span>` had temporarily replaced `<BlurText>`.
      2. Restored Page 3's genuine `<BlurText>` on both `LET'S` and `DYNAMIC_WORDS[wordIndex]` with `animateBy="letters"`, `direction="none"` (`y: 0`), `randomize={true}`, `delay={24}`, and `stepDuration={0.2}`.
      3. Gated the entrance with `triggerProp` (`hasRevealed`) at `progress >= 0.88`, ensuring characters transition individually through `{ filter: 'blur(18px)', opacity: 0 }` &rarr; `{ filter: 'blur(8px)', opacity: 0.55 }` (the signature partial blur) &rarr; `{ filter: 'blur(0px)', opacity: 1 }` in randomized order right as the footer is revealed.

22. **Mobile Nav Cleanup, Contact Button Repositioning & Bottom-Right Credits Alignment**:
    - *Mobile Navbar Action Removal*: In `use-mobile-timeline.ts`, added `refs.navActions.current` to `mobileFooterTl` (scrubbing out `opacity: 0, filter: blur(16px), y: -14` starting at progress 0.1) and `updateMobileNav` (`footerTop <= window.innerHeight * 0.75`), removing the floating "START A PROJECT" button in mobile view so it no longer overlaps the footer MAGNM heading.
    - *Button Repositioning & Renaming*: Moved `KineticShiftButton` directly under `LET'S CREATE.` in the header with `text="CONTACT"` (`z-30 pointer-events-auto`), retaining full kinetic wave hover, chime sound, and instant modal trigger.
    - *Bottom-Right Alignment*: Converted the footer bottom row to `flex justify-end items-end` with `items-end text-right`, placing `STUDIO` and `DEVELOPED BY` cleanly on the bottom-right corner across both mobile and desktop viewports.

23. **Mobile View 3D Helix Adjustment**:
    - *Vertical Shift*: Lifted the WebGL canvas container by `-translate-y-12 sm:-translate-y-8 md:translate-y-0`, moving the helix upward on mobile screens so its lower tip no longer crowds the bottom area.
    - *Camera Tilt*: In `Footer.tsx`, dynamically set `cameraSettings` to `{ tilt: 44, sideTilt: -24 }` on mobile (< 640px) vs `{ tilt: 42, sideTilt: -38 }` on desktop, tilting the helix ~14° more to the right and centering its diagonal flow in the mobile viewport.

24. **Mobile Hero Layout: Action Buttons Removal & Bottom-Right Metallic Logo Emblem**:
    - *Action Buttons*: Hidden on mobile viewports (`hidden md:flex`) so they no longer crowd the lower mobile screen.
    - *Light Logo Emblem*: Placed `/magnm light.png` on the bottom-right corner in mobile view (`flex md:hidden ml-auto`), scaled cleanly to `h-9 sm:h-10` (~36-40px height) with a smooth entrance blur reveal (`motion.div`) and automatic participation in `secondaryElements` scroll exit into Section 2.

25. **Mobile-Only 3D Helix Scale-Up & Refined Positioning**:
    - *Scale-Up*: Increased mobile helix scale from `130` to `185` (a ~42% boost) in `Footer.tsx`, giving each metallic bar greater visual weight, clarity, and bold presence on mobile screens without affecting desktop (`210`).
    - *Natural Framing & Placement*: Adjusted the mobile container translation to `-translate-y-2 translate-x-2` with `cameraSettings` at `{ tilt: 42, sideTilt: -30 }`. This eliminates top clipping, centers the helix vertically in the mobile viewport, and flows diagonally between the top-left header (`MAGNM`, `LET'S CREATE.`, `CONTACT`) and the bottom-right credits.

26. **Mobile Hero Bottom Row: Contact Action & Scaled-Up Metallic Emblem**:
    - *Contact Button (Bottom-Left)*: Added a mobile-only `KineticShiftButton` with `text="CONTACT"` on the bottom-left (`flex md:hidden`), providing a single focused CTA matching the footer contact interaction with Web Audio hover feedback and modal opening.
    - *Scaled-Up Metallic Emblem (Bottom-Right)*: Increased the mobile light MAGNM emblem size to `h-[52px] sm:h-[58px]` with `leave-blur-item` for smooth optical blur fade-out on scroll into Section 2, establishing a balanced baseline across the bottom of the mobile Hero stage.

27. **Modal Cross Close Button Vertical Centering**:
    - In both [ProjectModal.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/ProjectModal.tsx) and [AboutModal.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/AboutModal.tsx), increased the top spacing of the circular cross close button container from `mt-8 sm:mt-10` / `mt-10` to `mt-14 sm:mt-16`.
    - This shifts the cross button downward so it sits directly in the vertical center of the blank area between the email footer text (`Prefer email? hello@magnm.com`) and the modal card's bottom border.

30. **React Bits FlexCarousel Integration & Layout Tuning (Section 4)**:
    - *Engine Integration*: Integrated the high-performance WebGL (OGL) `FlexCarousel` component into [Projects.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/Projects.tsx) and [flex-carousel.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/ui/flex-carousel.tsx).
    - *Flat Strip & Dimension Scaling*: Replaced spherical/cylindrical lens distortion with a clean horizontal strip by setting `bend={0}`, `dispersion={0}`, and `squeeze={0.15}`. Scaled `cardHeight` down to `0.28` (a ~20% reduction) to create generous vertical breathing room for typography and captions.
    - *Asset Updates*: Replaced Sentinel mockup image with updated high-resolution asset `public/mockup/sentinel-mockup (1).webp` in [default-items.ts](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/ui/carousel/default-items.ts).
    - *Swipe Physics*: Softened spring stiffness down to `25` in the frame physics loop for tranquil, silky-smooth auto-advances and manual drags.

31. **Projects Split Caption Architecture & Auto-Scroll Progress Indicator**:
    - *Top Caption*: Project title + monospace rolling counter (`01 / 07`) anchored above the cards (`bottom: calc(50% + half + 24px)`), always visible and continuously updating during swipes.
    - *Bottom Caption (Click-to-Reveal)*: 3-line project description (`max-width: 300px`, `line-height: 1.5`, `opacity: 0.65`) placed below cards (`top: calc(50% + half + 24px)`), revealed with smooth optical blur (`filter: blur(10px) -> blur(0px)`) and height transition only when clicking a card.
    - *Progress Indicator*: Added a clean auto-advance progress track (`.flex-carousel__progress`) anchored directly below the cards, driven by CSS variables in sync with carousel autoplay interval.
    - *Audio Tuning*: Preserved tactile click audio on cards while eliminating redundant hover chime loops.

32. **Elimination of Artificial Incoming Animation & Root-Cause Fix for the Unnatural Blink on Scroll**:
    - *No Artificial Incoming Animation*: Completely removed artificial card entrance sequences (`intro="none"`, removed `entry={true}` prop, removed delayed `gsap.fromTo` on `headingRef`, and removed `invisible` class from heading). The carousel cards, progress bar, title, and description now sit statically on the page sheet without artificial delays or triggers.
    - *Root Cause of the Unnatural Blink*: In [use-desktop-timeline.ts](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/experience/use-desktop-timeline.ts), `scrollTl.set(refs.page4Container.current, { visibility: 'visible' }, 0.80)` was placed at `0.80`, while `TIMINGS.page4SlideUp.start` was `0.70`. Because GSAP enforced `visibility: 'hidden'` prior to `0.80`, `#page-4` completed its entire slide-up (`y: 100% -> 0%`) invisibly, and then abruptly popped into visibility at `0.80` in a single jarring frame ("blink").
    - *The Fix*:
      1. In [use-desktop-timeline.ts](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/experience/use-desktop-timeline.ts), set `#page-4` visibility to `'visible'` right at `TIMINGS.page4SlideUp.start` (`0.70`).
      2. Initialized `page4Container` with `opacity: 1` and `boxShadow: '0 -25px 80px rgba(0, 0, 0, 0.22)'`.
      3. Added `immediateRender: false` to `animateSheetSlideUp` in [animation-helpers.ts](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/experience/animation-helpers.ts) to prevent premature evaluation.
      4. Removed `p4EntryTriggered` logic from both desktop and mobile timeline loops.
    - *Result*: As the user scrolls past Section 3, Section 4 (with all cards and headings already seated) smoothly and physically slides up from the bottom of the viewport directly locked to the scroll wheel. When reversing, it slides smoothly down and exits below the viewport.

33. **Page 3 to Page 4 Transition Synchronization, Scale-Down Depth & Optical Blur Gating**:
    - *The Issue*:
      1. Premature Heading Visibility: Page 4's heading and description were visible on top of Page 3 during the transition.
      2. Early Page 3 Disappearance: Page 3 was abruptly vanishing from the background during the scale-down transition, leaving an empty white background behind the partially slid-up Page 4 (as observed in user screenshots at progress ~0.78).
    - *Root Causes*:
      1. Timeline Timing Collision: `TIMINGS.servicesScroll` had a hardcoded duration of `0.26` (running `0.44 -> 0.70`), while `page3ScaleDown` began at `0.66` (through `0.74`), and `page4SlideUp.start` was prematurely set to `0.70`. `onUpdate` activated `refs.page4Container` visibility at `progress >= 0.70` while Page 3's final service was still in view.
      2. Early Visibility Cutoff on Page 3: In [use-desktop-timeline.ts](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/experience/use-desktop-timeline.ts), `const isPage3Active = progress > 0.38 && progress < 0.76` cut off Page 3's visibility at `0.76`. Because Page 4 only finishes its slide-up at `0.84`, Page 4 was only 20% slid up when Page 3 vanished, leaving a jarring empty white backdrop behind it.
      3. GSAP `immediateRender: false` Reversion Trap: In `animateSheetSlideUp` ([animation-helpers.ts](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/experience/animation-helpers.ts)), `immediateRender: false` caused GSAP on reverse scrubs and pre-tween states to revert `y` to `0%` rather than holding `100%`, causing Page 4 to float at `top: 0` directly over Page 3.
      4. Ungated Static Heading: The HTML heading block in `Projects.tsx` had no optical blur or opacity gating, making it instantly visible whenever the container was visible.
      5. Mobile Spacer Deficiency: `mobilePage3SpacerRef` was only `25svh`, causing Section 4 to begin overlapping Section 3 too early on mobile.
    - *The Solution*:
      1. Recalibrated `TIMINGS`: `servicesScroll` strictly finishes at `0.66` (`duration: 0.22`), `page3ScaleDown` runs `0.66 -> 0.74`, and `page4SlideUp` begins strictly at `0.74` (`duration: 0.10`, completing at `0.84`).
      2. Separated Visibility from Interactivity:
         - `isPage3Visible = progress > 0.38 && progress < 0.85`: Page 3 remains pushed back at `scale: 0.8` in the background layer (`z-35`) behind Page 4 (`z-40`) throughout Page 4's entire slide-up (`0.74 -> 0.84`), only hiding once Page 4 fully docks at `0.85`.
         - `isPage3Interactive = progress > 0.38 && progress < 0.66`: During scale-down and slide-up (`progress >= 0.66`), `pointerEvents` becomes `'none'` so scrolling does not trigger background hover audio or clicks.
         - Reverse Scrubbing: Scrolling backwards immediately restores Page 3's visibility so as Page 4 slides down, Page 3 is sitting scaled down in the background.
      3. Time-0 Timeline Locks: Added explicit `scrollTl.set` at time `0` locking `page4Container` to `{ y: '100%', visibility: 'hidden' }` and `.page4-heading-block` to `{ opacity: 0, filter: 'blur(12px)', y: 16 }`.
      4. Removed `immediateRender: false` from `animateSheetSlideUp` in `animation-helpers.ts`.
      5. Optical Blur Crystallization: Page 4's heading block un-blurs smoothly from `0.78` to `0.84` as the card docks, and fades/blurs out cleanly at `0.90` when Page 4 lifts into the Footer.
      6. CSS Safety Net: Added `lg:translate-y-full` to `#page-4` in `MainExperience.tsx` and expanded `mobilePage3SpacerRef` to `75svh`.
      7. Mobile Parity: Integrated `.page4-heading-block` blur reveals into `slideOnP4Tl` and `mobileFooterTl` in `use-mobile-timeline.ts`.

34. **Projects Showcase Monochromatic Black & White WebGL Shader Filter**:
    - *The Requirement*: Apply a black and white filter to project covers matching MAGNM's monochromatic aesthetic (`#000000`, `#171717`, `#4D4D4D`, `#cccccc`, `#ffffff`).
    - *Implementation*:
      1. Updated the WebGL fragment shader (`cardFragment`) in [flex-carousel.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/ui/flex-carousel.tsx) with a hardware-accelerated luminance and contrast curve:
         - Perceived luminance via Rec. 709 (`dot(image, vec3(0.2126, 0.7152, 0.0722))`).
         - High-contrast editorial tone curve (`clamp((lum - 0.5) * 1.14 + 0.5, 0.0, 1.0)`) preserving deep `#171717` blacks, crisp whites, and architectural midtones.
      2. Added `uMonochrome` uniform wired directly to the `monochrome` prop in `FlexCarousel`.
      3. Enabled `monochrome={true}` in [Projects.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/Projects.tsx), ensuring all project covers conform to the brand's grayscale visual identity with zero CPU/compositing overhead.

35. **Page 4 Redesign Initiation & Blank Canvas Reset**:
    - *User Direction*: "blank the projects page we will redesign it".
    - *Action Taken*: Cleared the previous FlexCarousel implementation and placeholder contents from [Projects.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/Projects.tsx).
    - *Contract Preservation*: Preserved the container interface contracts (`ProjectsHandle`, `ProjectsProps`, `containerRef`, `className`, and `#page-4-content` on `#cccccc` background) to maintain 100% type safety and master timeline integration while preparing a clean surface for redesign.

36. **Page 4 Redesign: Extrafarant-Inspired Header in Pure Familjen Grotesk**:
    - *Design Reference Analysis*: User provided a reference image from creative studio Extrafarant featuring:
      1. A 2-line editorial description centered above the headline.
      2. A monumental "RECENT WERK" headline below it.
    - *Typography Iterations & User Refinements*:
      1. *Iteration 1 (Dual-Typeface)*: Tested Familjen Grotesk for "RECENT" and PP Editorial New Ultralight for "WORK" and description. User reviewed the screenshot and requested: *"what fonts u have used, use Frajimin Grotesk font"*.
      2. *Iteration 2 (Familjen Grotesk Shift)*: Transitioned description and headline to Familjen Grotesk (`var(--font-familjen)`). Styled "RECENT" as `font-extrabold` and "WORK" as `font-light`.
      3. *Iteration 3 (Unified Weight)*: User instructed: *"change the weight of the recesnt word eaxact same as the work word"*.
    - *Final Implemented Header Specs in [Projects.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/Projects.tsx)*:
      1. **Description**:
         - Typeface: `var(--font-familjen), "Familjen Grotesk", sans-serif`.
         - Typography: `font-normal text-[0.95rem] sm:text-base md:text-lg lg:text-[1.18rem] leading-relaxed text-[#171717]/65 text-center max-w-[580px] mb-3 sm:mb-4 lg:mb-5 tracking-[-0.015em]`.
         - Copy: *"A curated archive of selected spatial systems, tactile digital interfaces, and brand experiences."*
      2. **Headline (`RECENT WORK`)**:
         - Typeface: `var(--font-familjen), "Familjen Grotesk", sans-serif`.
         - Sizing: `text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.8rem] leading-[0.92] tracking-[-0.03em] text-[#171717] m-0`.
         - Unified Weight: Both `RECENT` and `WORK` styled with **Familjen Grotesk Light** (`font-light uppercase tracking-[-0.02em] text-[#171717]`), creating a clean, modern, architectural grotesque headline.
      3. **Timeline Sync**:
         - Enclosed in `.page4-heading-block` with `will-change-[filter,opacity,transform]`, participating in the master GSAP scroll timeline (optical blur docking at `0.78 -> 0.84`, exit at `0.90`).

37. **Page 4 Partial Blur Text Reveal & Symmetrical Reverse Exit (Matching Hero MAGNM Text)**:
    - *The Requirement*: Trigger the signature partial blur text reveal effect (identical to the Hero `MAGNM` display wordmark) when entering Page 4, AND ensure that when scrolling back up/out, the text leaves the screen with the exact same partial blur effect in reverse.
    - *Implementation*:
      1. **BlurText Enhancement**: Added `as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3'` and `style?: React.CSSProperties` to [BlurText.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/BlurText.tsx), enabling flexible semantic tag rendering without HTML validation issues.
      2. **Bidirectional Keyframes & Dissolve Cycle**:
         - *Entrance Keyframes*: `{ filter: 'blur(18px)', opacity: 0 }` &rarr; `{ filter: 'blur(8px)', opacity: 0.55 }` (signature partial blur) &rarr; `{ filter: 'blur(0px)', opacity: 1 }`.
         - *Exit Keyframes*: `{ filter: 'blur(0px)', opacity: 1 }` &rarr; `{ filter: 'blur(8px)', opacity: 0.55 }` (signature partial blur) &rarr; `{ filter: 'blur(18px)', opacity: 0 }`.
         - Managed via `hasEnteredRef` latch: stays stationary at `initial` before ever entering; transitions forward to `enterKeyframes` when triggered; and transitions in reverse to `exitKeyframes` when leaving/scrolling back.
      3. **DOM Persistence in Projects.tsx**:
         - Removed fluctuating `key={hasRevealed ? ...}` props from [Projects.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/Projects.tsx) so React keeps the same component and DOM node mounted, allowing Framer Motion to smoothly animate between enter and exit keyframes.
      4. **Direction-Aware Scroll Triggers**:
         - In [use-desktop-timeline.ts](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/experience/use-desktop-timeline.ts), added direction-aware hysteresis: scrolling down (`self.direction === 1`) triggers reveal at `progress >= 0.78`; scrolling back up (`self.direction === -1`) triggers reverse exit at `progress < 0.82`, ensuring characters dissolve in reverse while Section 4 is still fully in view and starting its downward slide.
         - In [use-mobile-timeline.ts](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/experience/use-mobile-timeline.ts), calibrated direction-aware threshold in `slideOnP4Tl` (`self.direction === -1 ? progress >= 0.45 : progress >= 0.35`).

38. **Mobile WebGL Occluded Canvas Gating & Performance Preservation**:
    - *Context*: On mobile devices, running multiple WebGL instances (Section 2 helix + Section 5 footer helix + Three.js project cards) can strain GPU memory and introduce frame pacing issues during fast touch gestures.
    - *Implementation*:
      - Integrated occlusion gating and viewport-aware animation loops.
      - When sections are outside the visible viewport (`boundingClientRect` / scroll position check), their render iterations idle or pause, guaranteeing that the active interactive section commands the entire 60fps frame budget.

39. **Page 4 Mobile Typography Alignment, Casing & Sizing Parity**:
    - *Context*: On mobile viewports, the Page 4 header copy, metadata labels ("PROJECT", "VIEW PROJECT"), and project titles required exact casing and typography matching the desktop design language, without line-wrapping issues or awkward vertical spacing on smaller screens.
    - *Implementation*:
      - Unified font tokens using Familjen Grotesk Light and Regular.
      - Sized mobile heading to prevent awkward line breaks (`text-3xl sm:text-4xl`).
      - Formatted metadata rows with clear uppercase tracking (`tracking-wider`, `text-[10px] sm:text-xs`) and clean horizontal justification between project title and live link.
      - Preserved high visual hierarchy without clutter.

40. **Page 3 to Page 4 Mobile Transition: Zero Push-Back, Unaltered Opacity & Scaled Down Covers**:
    - *Context*: Previously, when scrolling from Page 3 (Services / Accordion) into Page 4 (Projects) on mobile, Page 3 was undergoing a 3D perspective push-back / scale down (`scale: 0.88`, `opacity: 0.6`), causing jarring visual compounding. Additionally, the project cover images on mobile were too large, dominating the viewport.
    - *Implementation*:
      - Removed push-back scaling and opacity degradation on mobile view (`scale: 1`, `opacity: 1`), keeping Page 3 completely stationary and stable as Page 4 slides cleanly over it.
      - Scaled down the project cover card dimensions in mobile view to `h-[200px]`, `w-full max-w-[280px]` (from `max-w-[460px]`), ensuring the card deck fits elegantly within mobile viewport heights alongside the header and metadata.
      - Removed the partial blur text animation effect on mobile for Page 4 text, rendering solid, crisp typography directly to eliminate GPU shader latency and text reflow.

41. **Mobile Modal Incoming Animation: GPU Layer Promotion, True Offscreen Numeric Float & Elimination of Filter Thrashing**:
    - *Context*: When opening the Project Modal or About Modal on mobile devices, the drawer card was sliding in with a visible jitter/stutter instead of a buttery 60fps glide, even though the timing and speed (`duration: 0.7, ease: [0.16, 1, 0.3, 1]`) were desired.
    - *Root Cause Analysis*:
      1. The modal container was starting from `x: '100%'` with margins (`m-2` or `px-4`), which in CSS calc / percentage translation on mobile caused sub-pixel rounding jitter and slight visible overhang before entrance.
      2. Over 30-50 child character spans inside the modal were running CSS `filter: blur(...)` animations (`BlurText`) simultaneously during the slide transition. In WebKit/Blink on mobile, rasterizing CSS filters on multiple DOM nodes inside a translating container forces continuous GPU texture recreation on every frame.
      3. The modal card lacked explicit GPU compositing hints, causing composite paint operations on the main thread.
    - *Implementation*:
      1. **Strictly preserved animation curve and speed**: Maintained `duration: 0.7` and `ease: [0.16, 1, 0.3, 1]`.
      2. **True Offscreen Numeric Float**: Set initial mobile `x` to `isMobile ? window.innerWidth : '100%'`, ensuring the card starts completely offscreen without sub-pixel snapping.
      3. **GPU Layer Promotion**: Applied `willChange: 'transform, opacity'`, `transform: 'translateZ(0)'`, `backfaceVisibility: 'hidden'`, and `overflow-hidden` on the fixed modal backdrop and card wrapper, promoting the sliding panel to its own dedicated hardware composite layer.
      4. **Solid Text on Mobile**: Rendered crisp, solid typography on mobile view (`lg:hidden`), reserving the CPU/GPU-intensive `BlurText` SVG filter animations exclusively for desktop (`hidden lg:inline-block`). This completely eliminated texture re-rasterization and delivered instant, buttery 60fps glide.

42. **Footer Modal Dark Theme Enforcement & Desktop 3D Helix Stacking Hierarchy**:
    - *Context 1 (Modal Theme)*: The modal card when opened from the footer was defaulting to light mode or incorrect contrast.
    - *Context 2 (Desktop 3D Helix Layering)*: The 3D metallic Xylophone Helix in the footer was rendering behind the massive expanded "MAGNM" display text on desktop, whereas it was originally designed to render in front of the MAGNM text.
    - *Root Cause Diagnosis (Desktop Stacking Trap)*:
      - The Section 5 container wrapper in `MainExperience.tsx` had `lg:z-36`.
      - In CSS, any child inside a container with `z-index: 36` cannot escape that stacking context relative to siblings.
      - Meanwhile, `navbarHeader` (`.main-nav-header`) was given `zIndex: 37` at the footer stage in `use-desktop-timeline.ts` to display the expanded "MAGNM" wordmark.
      - Because `navbarHeader` had `z-37`, it sat in front of the entire Section 5 container (`z-36`).
      - Even though `#page-footer` had `z-38` inside Section 5, it was trapped inside the parent's `z-36`, forcing the 3D helix to render behind the navbar's MAGNM text.
    - *Architectural Resolution*:
      1. **Footer Modal Dark Mode**: In [ProjectModal.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/ProjectModal.tsx) and [AboutModal.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/AboutModal.tsx), enforced `dark` mode whenever `source === 'footer'`, when the footer is in viewport (`rect.top <= window.innerHeight * 0.7`), or when `source === 'hero'`.
      2. **Breaking the Stacking Context**: Changed the Section 5 wrapper in `MainExperience.tsx` from `fixed bottom-0 left-0 w-full h-[100svh] z-10 lg:absolute lg:inset-0 lg:z-36` to `fixed bottom-0 left-0 lg:static z-10 w-full h-[100svh] lg:h-auto`.
      3. **Desktop Stacking Order**:
         - Background underlay `#page-footer-bg`: `lg:z-36`.
         - Expanded MAGNM text (`navbarHeader`): `zIndex: 37`.
         - 3D Xylophone Helix Canvas & Footer content (`#page-footer`): `lg:z-38`.
         - Pinned Page 4 sliding covers overlay: `lg:z-40`.
         - Result: The 3D Helix now renders in front of the MAGNM wordmark on desktop.
      4. **Mobile Layout 100% Preserved**: On mobile (`<1024px`), the Section 5 wrapper retains its fixed bottom curtain reveal (`fixed bottom-0 left-0 z-10 w-full h-[100svh]`), ensuring mobile scroll behavior remained completely undisturbed.

43. **Contact Details & Developer Credits Updates**:
    - *Context*: User requested updating primary contact email to `adarshpathade79@gmail.com` and Pranav's developer GitHub profile link to `https://github.com/NetPranav`.
    - *Implementation*:
      - Updated email link and text in [Footer.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/Footer.tsx) (`mailto:adarshpathade79@gmail.com`).
      - Updated email link in [ProjectModal.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/ProjectModal.tsx) and [AboutModal.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/AboutModal.tsx).
      - Updated structured schema metadata and author details in [layout.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/app/layout.tsx).
      - Updated Pranav's GitHub link in [Footer.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/Footer.tsx) to `https://github.com/NetPranav`.

44. **Codebase Hygiene & Zero Compiler Regressions**:
    - Verified across all components: `npx tsc --noEmit` reports 0 errors.
    - Zero hydration mismatches, zero global CSS collisions, and clean separation between mobile and desktop rendering pipelines.

## 8. Current State & Completed Roadmap

### Phase A: Core Experience & Section Implementation (COMPLETED)
- [x] Section 1: Hero monolithic display heading & navbar docking transition.
- [x] Section 2: Pinned manifesto stage with progressive word illumination & centered 3D helix.
- [x] Section 2 &rarr; 3: Parallax 12-strip transition slice.
- [x] Section 3: Our Work desktop OptionWheel with chime synth audio & mobile accordion cards.
- [x] Section 4: Projects showcase with WebGL carousel and responsive metadata.
- [x] Section 5: Monochromatic Footer stage with Page 4 slide-up, reverse MAGNM font-size expansion behind 3D XylophoneHelix, kinetic tagline, and contact action.

### Phase B: Modal System & Intelligent Theme Detection (COMPLETED)
- [x] Built `ProjectModal.tsx` and `AboutModal.tsx` using `createPortal` to render above all 3D content.
- [x] Integrated intelligent theme detection: modals calculate the opacity of the `.nav-logo-dark` element to determine the current background context (light/dark) and switch their `data-theme` accordingly for maximum contrast.
- [x] Implemented custom `AnimatePresence` dropdowns to replace native HTML `<select>` elements, maintaining the premium monochromatic aesthetic across all devices.
- [x] Reused the `LetterSwapPingPong` component inside modal buttons for consistent kinetic hover effects.
- [x] Removed unhooked/redundant "BOOK A 30-MINUTE CALL" and Budget inputs to adhere to the extreme minimalism requested by the user.
- [x] Added circular cross close buttons centered in the bottom blank section with `Escape` keyboard dismissal and `rotate-90` hover animations.
- [x] Vertically centered the cross button within the bottom blank space with `mt-14 sm:mt-16`.

### Phase C: Mobile Responsive Architecture & Polish (COMPLETED)
- [x] Hero mobile layout: added dedicated bottom-left `CONTACT` button with kinetic wave hover and modal opening.
- [x] Hero mobile metallic emblem: scaled up `/magnm light.png` to `h-[52px] sm:h-[58px]` with `leave-blur-item` for optical blur scroll exit.
- [x] Navbar mobile behavior: hides brand divider, wordmark, and action buttons, leaving only the enlarged logo cleanly displayed throughout Sections 2–4.
- [x] Mobile navbar action cleanup: fades out floating "START A PROJECT" button upon reaching the footer to prevent overlapping MAGNM.
- [x] Footer mobile layout: repositioned `CONTACT` button under `LET'S CREATE.` and anchored studio/credits to the bottom right.
- [x] Footer 3D helix mobile tuning: scaled to `185` with camera `{ tilt: 42, sideTilt: -30 }` and `-translate-y-2 translate-x-2`.
- [x] Footer 3D helix mobile rotation: drastically reduced continuous rotation speed from `45` down to `4` (a ~91% decrease) so the helix retains its iconic diagonal composition.

### Phase D: Enterprise SEO, Schema & GEO Infrastructure (COMPLETED)
- [x] Installed complete Claude SEO skill suite (26 specialized skills in `.agents/skills/` and global environment).
- [x] Configured rich technical metadata in `layout.tsx`: title templates, 174-char description, keywords, authors, canonical URL, and `#0c0c0c` dark viewport tokens.
- [x] Open Graph & Twitter Cards: added `summary_large_image` cards, preview image (`/magnm light.png`), and social graph tags.
- [x] Schema.org JSON-LD: embedded connected `@graph` (`Organization`, `WebSite`, `WebPage`, `PostalAddress`, `Person`) in server-rendered SSR HTML.
- [x] XML Sitemap: implemented dynamic `src/app/sitemap.ts` (`/sitemap.xml`) with weekly change frequency and priority 1.0.
- [x] Robots Governance: implemented dynamic `src/app/robots.ts` (`/robots.txt`) authorizing AI search engines (`OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`) and restricting scraper bots.
- [x] Generative Engine Optimization: created standardized `public/llms.txt` for AI search grounding.
- [x] Image SEO: upgraded all brand logo and emblem `alt` attributes to descriptive, keyword-rich labels.

### Phase E: Projects WebGL Carousel Overhaul & Motion Refinements (COMPLETED)
- [x] Migrated Section 4 to React Bits `FlexCarousel` WebGL engine (OGL) with custom shaders.
- [x] Scaled `cardHeight` to `0.28`, removed lens curvature distortion (`bend=0`, `dispersion=0`, `squeeze=0.15`).
- [x] Structured split captions: persistent title + counter on top, click-to-reveal 3-line description with optical blur below cards.
- [x] Integrated auto-scroll progress track anchored 24px below the carousel cards.
- [x] Updated Sentinel cover asset to `sentinel-mockup (1).webp`.
- [x] Completely removed artificial incoming animations (`intro="none"`, no delayed `playEntry`, no 3-second blur delays).
- [x] Diagnosed and fixed the desktop scroll pop-in bug: `#page-4` visibility is enabled at `0.70` (the start of slide-up) with full opacity and shadow, delivering a natural, scroll-synchronized physical card slide.

### Phase F: Page 4 Stacked Project Covers Showcase (COMPLETED)
- [x] Reset Page 4 to clean canvas while preserving timeline and interface contracts.
- [x] Created Extrafarant-inspired header block with centered 2-line studio description.
- [x] Unified monumental "RECENT WORK" headline in pure Familjen Grotesk Light typography.
- [x] Engineered bidirectional partial blur reveal and reverse dissolve cycle on description and headline.
- [x] Registered signature partial blur text effect patterns, tokens, and code recipes in `ui-registry.md`.
- [x] Implemented 3-column desktop layout: Left project title, center stacked covers deck, right "View Project" link.
- [x] Card dimensions scaled down by 50% with strictly sharp corners (`rounded-none`, `border-none`) and flat 2D elevation (`shadow-none`, zero 3D hover scale): `max-w-[460px] lg:max-w-[500px] xl:max-w-[530px]` with `aspect-[1672/941]`.
- [x] Configured 4 project items:
  1. `Adarsh'26` (`/adarsh-26.webp`, `https://adrz-26.vercel.app`)
  2. `Sentinel` (`/mockup/Adarsh'26 Mockup.webp`, `https://github.com/adarzhpathade/sentinal-landing-page`)
  3. `Mirach Aerospace` (`/mockup/mirach-cover.webp`, `https://www.mirachaerospace.com`)
  4. `Sentinel Terminal` (`/mockup/sentinel-mockup (1).webp`, `https://github.com/adarzhpathade/sentinal-landing-page`)
- [x] Followed user constraint: NO top borders or browser frames on cards; pure images with light grayscale filter (`filter: grayscale(35%) contrast(1.03)`).
- [x] Implemented downward scroll peel animation: active card slides DOWN (`yPercent: 0 -> 118%`) and exits offscreen downwards, revealing the next card sitting directly beneath it.
- [x] Bound side metadata (left project name and right "View Project" link) to update with the signature partial blur effect on card transitions with synchronized midpoint index detection (`Math.round(clamped)`).
- [x] Clicking cards or "View Project" opens live URLs in a new tab.
- [x] Master timeline integration: budgeted `projectsScroll` in `TIMINGS` (0.80 -> 0.93), increased desktop scroll to `+=1000%`, and added snap points in `snapTo`.
- [x] Mobile responsiveness: clean meta row above card, dedicated scroll track with `mobilePage4SpacerRef` (180svh).

### Phase H: Mobile Footer Parallax Curtain Reveal (COMPLETED)
- [x] **Root Cause Diagnosis**:
  1. The footer wrapper was previously placed before Page 4 with `-mt-[100svh] mb-[100svh]`. Because Page 4 is ~2600px tall and the footer was placed at the top of Page 4, by the time the user scrolled past the 4 project cards to the laptop, the footer had scrolled 1850px off the top of the screen (`footer.top: -749px`), leaving a pure black empty void.
  2. The mobile footer MAGNM wordmark had been forced to `opacity: 0; filter: blur(12px)` in `use-mobile-timeline.ts` without an enter tween.
  3. `Footer.tsx` required `triggerProp` from desktop timelines to be true before activating the 3D Xylophone Helix and `BlurText` tagline.
- [x] **Clean Architecture Resolution**:
  1. **DOM Order**: Section 4 (Page 4, `z-40`, `bg-[#cccccc]`) renders in natural flow, followed by a dedicated `100svh` scroll track (`mobilePageFooterSpacerRef`).
  2. **Fixed Behind Curtain**: Section 5 Footer wrapper is styled with `fixed bottom-0 left-0 w-full h-[100svh] z-10 lg:absolute lg:inset-0 lg:z-36`. On mobile, it sits firmly locked to the bottom of the viewport underneath Page 4. As the user reaches the end of Page 4 (the laptop) and scrolls into the `100svh` spacer, Page 4 smoothly slides up and off the screen, revealing the fully rendered footer behind it like a curtain lifting.
  3. **Full Content Availability**:
     - `.footer-magnm-mobile` has `clearProps: 'all'`, rendering at full opacity and sharpness.
     - `Footer.tsx` has `isMobile` check (`<1024px`), initializing `hasRevealed: true` and `isInteractive: true`. The 3D metallic Xylophone Helix renders immediately at `speed: 4`, the tagline "LET'S CREATE / EXPLORE / BUILD / SHIP" cycles with partial blur, the `CONTACT` button is active, and studio/developer credits are displayed.
  4. **Desktop Preservation**: Desktop retains `lg:absolute lg:inset-0 lg:z-36` with Phase 9 pinned GSAP timeline, completely intact.
- [x] Zero TypeScript errors and visual validation confirmed via browser subagents across mobile and desktop.

### Phase I: Mobile Polish, Transition Stability, Modal Optimization & Desktop 3D Helix Hierarchy (COMPLETED)
- [x] Disabled Section 3 (Services) push-back scaling (`scale: 1`, `opacity: 1`) on mobile view for rock-solid transition into Page 4.
- [x] Scaled down Page 4 project cover card dimensions on mobile (`h-[200px]`, `w-full max-w-[280px]`).
- [x] Removed partial blur text transitions on mobile Page 4 text, rendering solid typography to eliminate GPU texture re-rasterization.
- [x] Optimized mobile modal incoming card animation for buttery 60fps smoothness:
  - Preserved incoming speed and curve: `duration: 0.7, ease: [0.16, 1, 0.3, 1]`.
  - Added hardware compositing: `willChange: 'transform, opacity'`, `transform: 'translateZ(0)'`, `backfaceVisibility: 'hidden'`.
  - Resolved sub-pixel jitter with true offscreen numeric float: `isMobile ? window.innerWidth : '100%'`.
  - Bypassed multi-span `BlurText` SVG filters on mobile drawer content.
- [x] Enforced dark mode theme for Project and About modals when opened from the footer or while footer is visible.
- [x] Fixed desktop 3D Xylophone Helix layering:
  - Removed desktop stacking context trap on Section 5 wrapper (`lg:static`).
  - Coordinated z-index ladder: `#page-footer-bg` (`z-36`), `navbarHeader` MAGNM text (`z-37`), `#page-footer` 3D helix (`z-38`), `#page-4` (`z-40`).
  - 3D metallic helix now renders in front of the MAGNM display text on desktop.
  - Mobile fixed-bottom curtain reveal left 100% untouched.
- [x] Updated studio contact email to `adarshpathade79@gmail.com` across footer, modals, and JSON-LD schema.
- [x] Updated developer credits link to `https://github.com/NetPranav`.
- [x] Validated TypeScript compilation (`npx tsc --noEmit` -> 0 errors) and dev server stability.

### Phase J: Official MAGNM Favicons, Updated Mockups, Reordered Projects & Live URL Integration (COMPLETED)
- [x] **Official Favicon & App Icon Generation**:
  - Extracted and centered the official metallic folded "M" emblem from `public/magnm light.png` on a transparent square canvas with optimal margin padding.
  - Generated full multi-resolution icon suite:
    - `src/app/icon.png` & `public/icon.png` (512×512)
    - `src/app/apple-icon.png` & `public/apple-touch-icon.png` (180×180)
    - `public/favicon-32x32.png` & `public/favicon-16x16.png`
    - `src/app/favicon.ico` & `public/favicon.ico` (multi-resolution ICO with 48x48, 32x32, 16x16 mipmaps).
  - Updated `src/app/layout.tsx` metadata with complete `icons` configuration. Verified HTTP 200 responses across all icon endpoints.
- [x] **Project Mockup Pairings & Synchronization**:
  - Replaced outdated mockup files with official assets in `public/mockup/`:
    1. `CERO Cross-Platform Download Studio.webp` -> Paired with Cero Terminal
    2. `Adarsh'26 Mockup.webp` -> Paired with Adarsh'26
    3. `Mirach Drone Intelligence Studio Mockup.webp` -> Paired with Mirach Aerospace
- [x] **Project Order Update**:
  - Reordered `PROJECTS` in `src/components/Projects.tsx` and `src/components/ui/carousel/default-items.ts`:
    1. `cero-terminal` (Cero Terminal)
    2. `adarsh-26` (Adarsh'26)
    3. `mirach-aerospace` (Mirach Aerospace)
- [x] **Live Destination URLs Wired**:
  - Cero Terminal: `https://sentinal-ruby.vercel.app/`
  - Adarsh'26: `https://adrz-26.vercel.app/`
  - Mirach Aerospace: `https://mirach-aerospace.vercel.app/`
- [x] **Audio Autoplay & Interaction Architecture Documented**:
  - Clarified browser Web Audio autoplay policy requiring initial user gesture to resume `AudioContext`.
  - Explored options for drag / audio cues (hero bottom-right, floating glass pill, 3D wheel context hint).

### Phase K: Production & Layout Stability Fixes (COMPLETED)
- [x] **Footer Optical Typography Gap**:
  - Removed dynamic left margin (`-ml-[0.055em]`) applied to "LET'S CREATE." tagline in `Footer.tsx`. The font expansion from the Navbar to the Footer now respects the true CSS bounding box, correctly aligning the 'M' in MAGNM flush with the 'L' in LET'S CREATE.
- [x] **Mobile Scroll Instability (Address Bar Retraction)**:
  - Applied `ScrollTrigger.config({ ignoreMobileResize: true })` globally. 
  - Forced `h-[100svh]` rather than `100vh` across all full-screen layout wrappers to prevent jank when the mobile browser chrome collapses.
- [x] **Production Stack Initialization Bug (`Projects.tsx`)**:
  - Fixed an issue where cards in the "Recent Work" section appeared flat and unstacked on initial load in production because GSAP `onUpdate` doesn't fire until the timeline playhead actually moves. Forced `setScrollProgress(0)` instantly inside a React `useEffect` on mount.
- [x] **Next.js `<script>` Hydration Error**:
  - Fixed Next.js App Router error `"Encountered a script tag while rendering React component"` in `src/app/layout.tsx` by replacing the raw HTML `<script>` tag for scroll restoration with the official `next/script` `<Script strategy="beforeInteractive">` component.

### Phase L: Footer Credits Update (COMPLETED)
- [x] **Footer Credits Division**:
  - Properly separated Design and Development credits.
  - Added **"DESIGNED BY"** section with "Adarsh Pathade" pointing to `https://adrz-26.vercel.app/`.
  - Maintained **"DEVELOPED BY"** section with both Pranav Dubey and Adarsh Pathade pointing to their respective portfolios/githubs.
  - Removed the location ("Based in Indore") as requested.

## 10. Current State & Next Steps

**What Works**:
- Hero entrance and kinetic button interactions.
- Pinned section wipes (Desktop timeline perfectly scales Page 1 into Page 2, wipes 12 vertical slices to reveal Page 3, unpins to scroll through Option Wheel).
- The Option Wheel is fully interactive and syncs 3D rotation with DOM text updates.
- The Projects deck sequentially offsets its internal array of cards to simulate a physical stack, working seamlessly in both local and production.
- The Footer orchestrates the 3D XylophoneHelix layout and reverse kinetic letter spacing effect natively.

**Next Session Starts With**:
- Waiting for further visual design polish requests or QA validation from the user regarding the stack spacing and footer alignment. 
- No broken code or terminal errors exist. `npm run dev` and `npm run build` are 100% stable.
