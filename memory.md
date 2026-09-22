# Memory — MAGNM Landing Page Architecture & Typographic Refinements

Last updated: 2026-09-22 20:50

## What was built

### 1. Hero Section Typographic & Alignment Refinements ([src/components/Hero.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/Hero.tsx))
- **Dynamic Single-Word Switching Tagline**:
  - Anchored permanent phrase structure:
    - Line 1: `"Translating bold vision"` (permanent static statement rendered with `<BlurText />` on mount).
    - Line 2: `"into lasting "` (permanent static prefix) + dynamically rotating last word (`"impact."`, `"clarity."`, `"motion."`, `"scale."`, `"reality."`, `"form."`).
  - Word Switch Physics & Motion:
    - Driven by `<AnimatePresence mode="wait">` cycling every 3.2s.
    - Explicit multi-step CSS filter keyframes for visible optical lens blur:
      - Enter state: `filter: ['blur(16px)', 'blur(7px)', 'blur(0px)']`, `opacity: [0, 0.6, 1]`, `y: [8, 2, 0]`.
      - Exit state: `filter: ['blur(0px)', 'blur(7px)', 'blur(16px)']`, `opacity: [1, 0.4, 0]`, `y: [0, -2, -8]`.
      - Easing: `[0.22, 1, 0.36, 1]`, `duration: 0.48s`, `times: [0, 0.45, 1]`.
    - Integrated inline `style={{ willChange: 'transform, filter, opacity' }}` to ensure GPU layer promotion across Chromium, WebKit, and Gecko.
    - Attached punctuation (`.`) directly to each word token, eliminating horizontal punctuation jitter when cycling words of varying character lengths.
- **Top Row Brand Wordmark & Emblem Vertical Centering**:
  - Structured `<header>` with a dedicated flex top row: `<div className="w-full flex justify-between items-center">`.
  - Left child: `"MAGNM"` display wordmark.
  - Right child: Metallic emblem mark (`/magnm light.png`), 1px divider (`w-[1px] h-8 sm:h-9 md:h-10 bg-white/20`), and 3-line studio narrative statement (`Websites, AI products, brands, and systems built for clarity, scale and impact.`).
  - Vertically locks the brand emblem unit to the exact horizontal centerline of the `"MAGNM"` display wordmark regardless of dynamic font clamp scaling or screen width.
  - Decoupled the tagline sub-unit into a clean block below the top row with calibrated vertical spacing (`mt-3.5 sm:mt-4 md:mt-5`).
- **Optical Negative Left Kerning for "MAGNM"**:
  - Applied `-ml-[0.08em]` to the `"MAGNM"` display wordmark.
  - Compensates for the built-in uppercase glyph side-bearing of the capital `"M"` in `Familjen Grotesk` (~20px at display scale `clamp(4.25rem, 16vw, 15.5rem)`).
  - Shifts the wordmark's left vertical ink stem flush left onto the exact same vertical axis as `"Translating bold vision"` and `"into lasting [word]"`.

### 2. Standby Motion & Interaction Components (Ready for Subsequent Sections)
- **`<ScrollReveal />` ([src/components/ScrollReveal.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/ScrollReveal.tsx))**:
  - Imported from React Bits.
  - Word-level scroll scrubbing with combined opacity, blur (`enableBlur`, `blurStrength`), and container rotation (`baseRotation` scrubbed to 0).
  - Scoped via `gsap.context()` for leak-free unmounting and clean React 19 / Next.js App Router lifecycle integration.
- **`<ElasticLine />` & Physics Hooks ([src/components/fancy/physics/elastic-line.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/fancy/physics/elastic-line.tsx))**:
  - Imported from Fancy Components.
  - Interactive SVG quadratic curve (`Q` control point calculation with requestAnimationFrame loop).
  - Spring-loaded cursor grab and release mechanics (`stiffness: 300`, `damping: 5`).
  - Supporting hooks created in `src/hooks/`:
    - [src/hooks/use-mouse-position.ts](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/hooks/use-mouse-position.ts): Tracks relative mouse and touch coordinates.
    - [src/hooks/use-dimensions.ts](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/hooks/use-dimensions.ts): Dynamically computes container bounding box dimensions on resize.
    - [src/hooks/use-elastic-line-events.ts](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/hooks/use-elastic-line-events.ts): Evaluates cursor distance thresholds and calculates bezier control points.

### 3. Core Architecture Previously Established
- **3D Kinetic Centerpiece ([src/components/originkit/ui/xylophone-helix.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/originkit/ui/xylophone-helix.tsx))**:
  - 44-bar metallic WebGL2 kinetic wheel, monochromatic chrome/metal, responsive scale hook (`48` mobile, `70` tablet, `90` desktop), alpha blending over background typography.
- **Audio Synthesizer ([src/lib/chime-synth.ts](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/lib/chime-synth.ts))**:
  - Physical modeling glockenspiel acoustic synthesis with Euler-Bernoulli beam harmonics tuned to D-major pentatonic scale.
- **Bottom Navigation & CTAs**:
  - Martian Mono Light options (`"DISCUSS YOUR PROJECT"`, `"BOOK A 30-MINUTE CALL"`) with `Letter3DSwap` character flip physics and rotating geometric `+` indicators.

---

## Decisions made

1. **Tagline Rotation Pattern**:
   - The sentence prefix (`"Translating bold vision into lasting "`) is permanent and grounded, preventing layout shifts or visual fatigue.
   - Only the terminal keyword rotates dynamically, preserving brand coherence and editorial focus.
2. **Multi-Step Filter Keyframes for Blur Transitions**:
   - Framer Motion / Motion does not interpolate two-value CSS `filter` strings reliably. Explicit keyframe arrays (`['blur(16px)', 'blur(7px)', 'blur(0px)']`) with `times` are mandatory to guarantee browser hardware-accelerated blur animations.
3. **Display Wordmark Optical Flush Alignment**:
   - Because geometric grotesque fonts allocate internal whitespace (left side-bearings) to uppercase letters like `"M"`, giant display text requires proportional negative left margin (`-ml-[0.08em]`) to align flush with body/tagline copy.
4. **Header Two-Tier Flex Architecture**:
   - Dedicated top row (`justify-between items-center`) ensures the right-hand emblem statement is vertically centered with `"MAGNM"` without being dragged down by the multi-line tagline.
5. **Standby Component Policy**:
   - `<ScrollReveal />` and `<ElasticLine />` are compiled, type-checked, and registered in `ui-registry.md`, but not rendered in `page.tsx` until explicit user instruction/designs are provided.

---

## Problems solved

1. **Missing Blur Effect in Tagline Switch**:
   - *Problem*: Motion was dropping the CSS `filter` property during `AnimatePresence` state changes when defined as single-step strings (`blur(8px)` -> `blur(0px)`), causing the word to fade and move without any visible blur.
   - *Solution*: Converted both `animate` and `exit` states to explicit 3-step keyframe arrays with `will-change` inline styles and boosted blur to `16px`.
2. **Emblem Unit Misalignment**:
   - *Problem*: Emblem unit sat aligned to the top edge of the header rather than centering with the `"MAGNM"` wordmark.
   - *Solution*: Placed `"MAGNM"` and the emblem unit in an `items-center` flex container, decoupling the tagline beneath it.
3. **"MAGNM" Visual Left Gap / Inset**:
   - *Problem*: Capital `"M"` in `"MAGNM"` was indented ~20px to the right of `"Translating bold vision"` due to glyph side-bearings.
   - *Solution*: Added `-ml-[0.08em]` to `"MAGNM"`, pulling the ink stem flush into vertical alignment with the tagline.

---

## Current state

- **Build / Type Verification**: `npx tsc --noEmit` passes with 0 errors.
- **Git Branch**: `main` is clean, tracked, and all commits are formatted.
- **Dev Server**: Active and running on `http://localhost:3000`.
- **Active Page**: [src/app/page.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/app/page.tsx) cleanly renders `<Hero />`.
- **UI Registry**: Fully up to date in [ui-registry.md](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/ui-registry.md).

---

## Next session starts with

1. **Section 2 Integration**:
   - Awaiting user design references or requirements for Section 2 (e.g. Selected Works grid, Studio Manifesto using `<ScrollReveal />`, interactive section divider using `<ElasticLine />`, or Capabilities index).
   - Linking Section 1 (Hero) into Section 2 via Lenis smooth scrolling and GSAP ScrollTrigger timeline pins.

---

## Open questions

- Awaiting user design references and layout requirements for Section 2.
