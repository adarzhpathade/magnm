# Memory — MAGNM Landing Page Architecture & Responsive Refinement

Last updated: 2026-09-22 09:05

## What was built

### 1. Hero Section Core Architecture ([src/components/Hero.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/Hero.tsx))
- **Viewport Container**:
  - Full-screen height (`h-screen min-h-[500px] flex flex-col justify-between select-none relative overflow-hidden bg-[#000000]`).
  - Symmetrical vertical and horizontal framing padding: `px-3 sm:px-5 md:px-7 lg:px-8 py-3 sm:py-4 md:py-5 lg:py-6`.
- **Top Brand Header & Navigation**:
  - Top header row: `<header className="w-full flex justify-between items-center z-20 pointer-events-none">`.
  - Brand wordmark top-left: `"MAGNM"` rendered in `Familjen Grotesk`, scaled to `text-[clamp(4.25rem,16vw,15.5rem)]` with ultra-tight grotesque leading (`leading-[0.8]`) and negative tracking (`tracking-[-0.04em]`).
  - Dynamic Tagline Sub-unit: Positioned directly beneath the `"MAGNM"` wordmark with calibrated spacing (`mt-3.5 sm:mt-4 md:mt-5`), left-aligned (`items-start text-left justify-start`), sized to `clamp(1.15rem, 2.4vw, 2.25rem)` with leading `leading-[1.05]` and tracking `tracking-[-0.035em]`.
    - Line 1: Cycles dynamic phrases every 3.8s (`"Translating bold vision"`, `"Choreographing pure motion"`, `"Sculpting digital form"`, `"Engineering aesthetics"`) via `<BlurText />` random in-place blur reveal (`direction="none"`, `randomize={true}`).
    - Line 2: Anchored static line (`"into lasting impact."`) set in `text-[#cccccc]`.
  - Desktop Navigation options top-right (`hidden md:flex items-center gap-8 md:gap-12 lg:gap-16 pointer-events-auto`):
    - Two interactive links: `"CONTACT"` and `"MENU"`, set in `Martian Mono Light` (`text-[10px] md:text-[11px] lg:text-[12px] uppercase tracking-[0.14em] text-[#cccccc]`).
    - Centered vertically on the exact centerline of the `"MAGNM"` wordmark.
    - Each option has a subtle geometric `+` in `#666666` that rotates 90° on hover (`group-hover:rotate-90 transition-transform duration-300`).
- **Brand Emblem & Narrative Unit**:
  - Composed of:
    - 44px metallic brand emblem mark ([public/magnm light.png](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/public/magnm%20light.png)).
    - 1px vertical divider line (`w-[1px] h-9 bg-white/20`).
    - 2-line studio narrative statement in `Familjen Grotesk` (`text-[11px] sm:text-xs text-white/60 tracking-tight leading-tight font-medium`):
      `"Websites, AI products, brands,"` / `"and high impact motion experiences"`.
  - **Desktop Placement** (`>=768px`): Rendered in the top-right quadrant (`hidden md:flex items-center gap-3.5 mr-4 lg:mr-8`), harmonizing with the `"CONTACT"` and `"MENU"` nav links.
  - **Mobile Placement** (`<768px`): Rendered in the bottom-right corner (`flex md:hidden self-end ml-auto items-center gap-3.5 z-20 pointer-events-auto`), anchoring the bottom corner without crowding the screen.
- **Bottom Section & Interactive Actions**:
  - Bottom bar container: `<div className="w-full flex justify-between items-end relative z-20">`.
  - Desktop Bottom-Left Options (`hidden md:flex flex-col gap-2 pointer-events-auto`):
    - `"DISCUSS YOUR PROJECT"` and `"BOOK A 30-MINUTE CALL"`.
    - Formatted in `Martian Mono Light` with `Letter3DSwap` character flip physics on hover (`damping: 25`, `stiffness: 300`) and the rotating geometric `+` indicator.
  - Mobile Bottom Adaptation: Desktop action buttons are set to `hidden md:flex` to eliminate clutter and provide negative space for the 3D wheel.

### 2. 3D Kinetic Centerpiece ([src/components/originkit/ui/xylophone-helix.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/originkit/ui/xylophone-helix.tsx))
- **WebGL2 Kinetic Wheel**:
  - 44-bar metallic wheel using instanced geometry and simulated metal reflections (`reflect: 100`, `polish: 100`).
  - Strict monochromatic configuration: Color flood removed (`strength: 0, tint: 0, glow: 0`) to preserve pure industrial chrome/dark-metal identity.
  - Interactive cursor wake physics and audio glissando triggers upon pointer velocity across the wheel bars.
- **Responsive Sizing & Layering**:
  - Scaled dynamically using a `useResponsiveScale` hook:
    - Mobile (`<640px`): `scale={48}`.
    - Tablet (`640px - 1024px`): `scale={70}`.
    - Desktop (`>=1024px`): `scale={90}`.
  - Vertical alignment: Centered without vertical offset on mobile (`translate-y-0`) and shifted slightly downward on desktop (`md:translate-y-7 lg:translate-y-9`) to preserve breathing space between the top wordmark and bottom actions.
  - Layering: Layered with alpha transparency (`z-10` canvas over `z-0` text) so the 3D wheel visually crosses in front of the background typography while allowing clicks to pass through to `z-20` interactive options (`pointer-events-none` on canvas container).

### 3. Audio Glockenspiel Synthesizer ([src/lib/chime-synth.ts](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/lib/chime-synth.ts))
- **Physical Modeling Engine**:
  - Built entirely using Web Audio API (`AudioContext`, `OscillatorNode`, `GainNode`, `DynamicsCompressorNode`).
  - Euler-Bernoulli inharmonic beam overtones: Generates authentic metallic percussion harmonics (fundamental, 2.756x mode 2, 5.404x mode 3).
  - Scaled across all 44 bars to a calibrated D-major pentatonic scale spanning D4 (293.66 Hz) through D7 (2349.32 Hz).
  - Master dynamics compressor prevents clipping, distortion, and ear fatigue during rapid drag glissandos.

### 4. Supporting Motion & UI Components
- [src/components/BlurText.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/BlurText.tsx): Directionless in-place random words/letters blur reveal (`direction="none"`, `randomize={true}`).
- [src/components/ui/letter-3d-swap.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/ui/letter-3d-swap.tsx): 3D character roll box with `Intl.Segmenter` grapheme cluster preservation, spring physics (`damping: 25`, `stiffness: 300`), and uniform `#cccccc` tone on front/back faces.
- [src/components/ui/text-repel.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/ui/text-repel.tsx): Framer Motion cursor repulsion component.
- [src/components/ui/orbital-rings.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/ui/orbital-rings.tsx): Interactive ambient gyroscope 3D ring system preserved for subsequent sections.
- [src/components/originkit/ui/particle-saturn.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/originkit/ui/particle-saturn.tsx): Secondary particle asset preserved in the codebase.

### 5. Layout & Application Cleanup ([src/app/page.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/app/page.tsx))
- Cleaned the main page to exclusively render `<Hero />`. Provisional second page sections were removed per user instruction until explicit design references are provided.

---

## Decisions made

1. **Tagline Hierarchy & Placement**:
   - Situated directly under the primary `"MAGNM"` wordmark rather than floating in the bottom-right corner.
   - Grounded the visual identity with a clear top-left reading sequence: `"MAGNM"` -> dynamic starting phrase -> anchored resolution `"into lasting impact."`.
2. **Mobile Composition Strategy**:
   - On screens `<768px`, the bottom action buttons (`"DISCUSS YOUR PROJECT"`, `"BOOK A 30-MINUTE CALL"`) are hidden (`hidden md:flex`).
   - The brand emblem and narrative statement are shifted to the bottom-right (`flex md:hidden self-end ml-auto`).
   - The 3D wheel is scaled down to `scale={48}` and vertically centered (`translate-y-0`), allowing the 3D kinetic experience to breathe without visual collisions.
3. **Strict Monochromatic Palette**:
   - Restricted to pure black (`#000000`), off-white foreground (`#CCCCCC`), dark muted gray (`#4D4D4D`), deep charcoal (`#171717`), and white opacities (`white/60`, `white/20`).
   - Wheel color flood removed (`strength: 0, tint: 0, glow: 0`) to preserve industrial dark-metal aesthetic.
4. **Z-Index Layering Hierarchy**:
   - `z-0`: Background typography (`"MAGNM"` display wordmark and tagline).
   - `z-10 pointer-events-none`: Interactive 3D WebGL2 canvas (crosses in front of typography).
   - `z-20 pointer-events-auto`: Header nav, bottom actions, and emblem unit (ensures pointer events and clicks are never intercepted by the canvas).
5. **Typography System**:
   - `Familjen Grotesk`: Dedicated to editorial display typography (`"MAGNM"` wordmark, tagline phrases, and studio narrative statement).
   - `Martian Mono Light`: Dedicated strictly to metadata, navigation (`"CONTACT"`, `"MENU"`), and action buttons.
6. **Micro-Interaction Precision**:
   - Underlines, arrow glyphs (`→`), pills, badges, and background fills are omitted.
   - Hover interaction relies on clean geometric `+` rotation (`rotate-90`) and 3D letter roll physics.
   - Audio feedback is strictly isolated to the 3D wheel.

---

## Problems solved

1. **WebGL2 Alpha Blending Over Typography**:
   - `xylophone-helix.tsx` initially cleared the buffer with an opaque black color and lacked alpha on context creation.
   - Fixed by initializing with `gl = canvas.getContext("webgl2", { alpha: true })`, setting `gl.clearColor(0, 0, 0, 0)`, and removing full-screen opaque background quads.
2. **Mobile 3D Wheel Offset & Overcrowding**:
   - The 3D wheel previously felt off-center on mobile due to desktop vertical translation classes (`translate-y-7`).
   - Fixed by setting `translate-y-0` on mobile and introducing a responsive scale hook reducing radius to `48` on viewports `<640px`.
3. **IntersectionObserver Unmount Crash in `BlurText.tsx`**:
   - Fixed a runtime `TypeError` where unobserving `ref.current` on unmount threw by switching to `observer.unobserve(entry.target)`.
4. **CSS 3D Flattening**:
   - Browsers flatten 3D child transforms unless `transform-style: preserve-3d` is explicitly declared.
   - Added `.transform-3d` and `.backface-hidden` to [src/app/globals.css](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/app/globals.css).
5. **Tailwind v4 / shadcn Theme Overwrite**:
   - Restored dark monochromatic variables (`--background: #000000`, `--foreground: #cccccc`) after shadcn CLI rewrote `:root` to light-mode defaults.
6. **Next.js Dev Overlay Collision**:
   - Disabled `devIndicators` in [next.config.ts](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/next.config.ts) so the Next.js `N` button does not obstruct bottom UI elements.

---

## Current state

- **Build / Type Verification**: `npx tsc --noEmit` passes with 0 errors.
- **Git Branch**: `main` is synchronized with `origin/main`.
- **Latest Commit**: `148ffa3` (`feat: refine Hero typography, mobile responsive layout, and brand emblem unit`).
- **Working Tree**: Completely clean.
- **Dev Server**: Running on `http://localhost:3000`.
- **Hero Quality**: Production-ready, fully responsive across mobile, tablet, and ultra-wide displays.

---

## Next session starts with

1. **Subsequent Landing Page Sections (Section 2)**:
   - When the user provides design references or instructions for Section 2 (e.g., Selected Works/Projects Grid, Studio Manifesto, Capabilities/Services Index, or Client List):
     - Implement Section 2 adhering strictly to `ui-registry.md` tokens and `AGENTS.md` rules.
     - Configure scroll transitions (Lenis smooth scroll / GSAP ScrollTrigger) linking out of the Hero into Section 2.
2. **Re-integration of Orbital Rings**:
   - Consider integrating [src/components/ui/orbital-rings.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/ui/orbital-rings.tsx) as an ambient background element in upcoming content sections.

---

## Open questions

- Awaiting user design references and feature requirements for Section 2.
