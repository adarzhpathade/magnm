# Memory — MAGNM Landing Page Hero & Motion Architecture

Last updated: 2026-09-21 23:18

## What was built

- **Hero Component** ([src/components/Hero.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/Hero.tsx)):
  - Full viewport hero (`h-screen min-h-[500px] flex flex-col justify-between select-none bg-[#000000]`).
  - Symmetrical vertical framing: `px-3 sm:px-5 md:px-7 lg:px-8 py-3 sm:py-4 md:py-5 lg:py-6`.
  - Brand wordmark: `"MAGNM"` top-left in `Familjen Grotesk` (`text-[clamp(3.5rem,14.5vw,13.5rem)] leading-[0.8] tracking-[-0.04em]`) with `pt-1 sm:pt-1.5 md:pt-2 lg:pt-2.5` to counterbalance tight cap-height.
  - Tagline bottom-right: Inverted dynamic/static hierarchy. Line 1 cycles dynamic phrases every 3.8s (`"Translating bold vision"`, `"Choreographing pure motion"`, `"Sculpting digital form"`, `"Engineering aesthetics"`) via random in-place blur reveal, resolving into a static, anchored Line 2 (`"into lasting impact."`).
  - Bottom-left options: `"DISCUSS YOUR PROJECT"` and `"BOOK A 30-MINUTE CALL"` set in `Martian Mono Light` (`fonts/MartianMono_Light-s.p.0htes.s6weu9-.woff2`).
  - Micro-interaction: Clean typographic layout without heavy pills or badges, featuring a subtle geometric `+` in `#666666` that rotates 90° on hover. Silent on hover (no audio).
  - 3D letter roll: Integrated `Letter3DSwap` component ([src/components/ui/letter-3d-swap.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/ui/letter-3d-swap.tsx)) with spring physics (`damping: 25`, `stiffness: 300`) and uniform `#cccccc` tone across front and back faces (no color flash).

- **3D Kinetic Centerpiece** ([src/components/originkit/ui/xylophone-helix.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/originkit/ui/xylophone-helix.tsx)):
  - 44-bar metallic wheel in WebGL2 with instanced geometry and simulated metal reflections (`reflect: 100`, `polish: 100`).
  - Centered and shifted slightly down (`translate-y-5 sm:translate-y-7 md:translate-y-9`) for balanced vertical spacing.
  - Alpha transparency enabled so the 3D wheel layers above typography (`z-10` canvas over `z-0` text).
  - Tuned physical modeling Glockenspiel / Chime synthesizer ([src/lib/chime-synth.ts](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/lib/chime-synth.ts)) using Web Audio API: Euler-Bernoulli inharmonic beam overtones (2.756x, 5.404x), calibrated D-major pentatonic scale (D4 to D7) mapped smoothly across all 44 bars, and master dynamics compression for distortion-free glissandos.
  - Secondary 3D asset `ParticleSaturn` ([src/components/originkit/ui/particle-saturn.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/originkit/ui/particle-saturn.tsx)) created and preserved in the repo for reference.

- **Motion Components & Typography**:
  - [src/components/BlurText.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/BlurText.tsx): Directionless in-place random words/letters blur reveal (`direction="none"`, `randomize={true}`).
  - [src/components/ui/letter-3d-swap.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/ui/letter-3d-swap.tsx): 3D character box swapping with `Intl.Segmenter` grapheme cluster splitting.
  - [src/components/ui/text-repel.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/ui/text-repel.tsx): Framer Motion cursor repulsion component.
  - [src/app/globals.css](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/app/globals.css): Defined `@font-face` for `Familjen Grotesk` and `Martian Mono`, custom utilities `.transform-3d`, `.backface-hidden`, `.inline-box`, and strict monochromatic palette tokens.
  - [next.config.ts](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/next.config.ts): Disabled `devIndicators` so the Next.js `N` button does not obstruct bottom-left UI.
  - [ui-registry.md](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/ui-registry.md): Visual design token and component pattern registry.

## Decisions made

1. **Strict Monochromatic Palette**: Restricted to pure black (`#000000`), off-white foreground (`#CCCCCC`), dark muted gray (`#4D4D4D`), and deep charcoal (`#171717`). Wheel color flood removed (`strength: 0, tint: 0, glow: 0`) to preserve dark metallic identity.
2. **Layering Architecture**:
   - `z-0`: Background typography ("MAGNM" and bottom-right tagline).
   - `z-10`: Interactive 3D WebGL2 canvas (crosses in front of typography).
   - `z-20 pointer-events-auto`: Bottom-left interactive options (ensures hover/click events are never intercepted by the full-screen canvas).
3. **Typography Division**:
   - `Familjen Grotesk`: Used for all editorial and display typography (wordmark, tagline).
   - `Martian Mono Light`: Dedicated strictly to technical metadata and interactive options.
4. **Option Restraint**:
   - No underlines or arrow glyphs (`→`).
   - No capsule pill borders, backgrounds, numbers, or ping dots (kept strictly minimal per user direction).
   - No hover text color shift (uniform `#cccccc` on both 3D swap faces).
   - Audio clicks removed from buttons; audio is strictly reserved for the 3D wheel.
5. **Tagline Dynamics**:
   - Starting line changes every 3.8s via in-place blur reveal.
   - Ending line (`"into lasting impact."`) is permanently anchored and never re-animates.

## Problems solved

1. **WebGL2 Alpha Blending Over Text**: `xylophone-helix.tsx` initially cleared the buffer with an opaque black color and lacked alpha on context creation. Fixed by initializing with `gl = canvas.getContext("webgl2", { alpha: true })`, setting `gl.clearColor(0, 0, 0, 0)`, and omitting full-screen opaque background quads.
2. **IntersectionObserver Unmount Crash**: Fixed a runtime `TypeError` in `BlurText.tsx` where unobserving `ref.current` on re-mount threw when unmounting by switching to `observer.unobserve(entry.target)`.
3. **CSS 3D Flattening**: Browsers flatten 3D child transforms unless `transform-style: preserve-3d` is explicitly declared. Added `.transform-3d` and `.backface-hidden` to `globals.css`.
4. **Tailwind v4 / shadcn Theme Overwrite**: Running `shadcn add` rewrote `:root` colors in `globals.css` to light-mode defaults (`oklch(1 0 0)`). Manually restored dark monochromatic variables (`--background: #000000`, `--foreground: #cccccc`).
5. **Next.js Dev Overlay Collision**: Fixed the Next.js `N` button overlapping bottom-left buttons by disabling `devIndicators` in `next.config.ts`.

## Current state

- **Build / Verification**: `npx tsc --noEmit` passes with 0 errors.
- **Dev Server**: Active and running on `http://localhost:3000`.
- **Hero Section**: 100% complete, visually aligned with design references and user requirements.

## Next session starts with

1. **Next Landing Page Sections**:
   - Implement the section immediately following the Hero (e.g. selected works/projects grid, studio manifesto, services, or client index).
   - Establish scroll transitions (Lenis smooth scroll / GSAP ScrollTrigger) linking the Hero out-scroll into the subsequent content.
2. **Review Design Assets**:
   - Align new sections to the design references provided by the user, adhering to the monochromatic palette and `ui-registry.md` tokens.

## Open questions

- None for the Hero. Ready to proceed with Section 2 / project portfolio once user provides direction or design references.
