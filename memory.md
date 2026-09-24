# Memory — MAGNM Landing Page: Section 3 Rebuild & Scroll-Driven Services Wheel

Last updated: 2026-09-24 17:02

## What was built

### 1. Section 3 "We provide" Sentence & OptionWheel Showcase ([src/components/OurWork.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/OurWork.tsx))
- **Sentence Architecture**:
  - Replaced former list and hover-image-reveal with a unified editorial sentence composition: **"We provide"** (left display text in `Familjen Grotesk`, display scale `text-3xl sm:text-4xl md:text-5xl lg:text-[3.75rem] xl:text-[4.15rem]`) paired with a dynamic 3D cylindrical **OptionWheel** (right).
  - Centered horizontally and vertically in the pinned viewport (`max-w-6xl mx-auto`).
- **Dynamic 2-Line Paragraph with Signature Optical Blur Reveal**:
  - Positioned directly underneath "We provide" (`md:absolute md:top-full md:left-0`).
  - Utilizes `<BlurText>` with `randomize={true}`, `animateBy="words"`, `direction="none"`, `delay={24}`, and `stepDuration={0.2}` for MAGNM's signature randomized optical blur reveal (`blur(18px) -> blur(8px) -> blur(0px)` without any jarring vertical y-translation).
  - Shortened all 6 service descriptions to punchy, 2-line statements:
    1. **Strategy & Direction**: *Defining creative trajectories to transform vision into actionable roadmaps.*
    2. **Digital Products & Websites**: *Engineering bespoke flagships built for fluid interaction and performance.*
    3. **3D & Motion Design**: *Crafting kinetic identities and spatial 3D experiences with depth.*
    4. **AI Systems & Interfaces**: *Architecting generative interfaces that turn intelligent logic into intuitive tools.*
    5. **Brand Identity & Systems**: *Formulating typographic systems and design tokens built to scale.*
    6. **Creative Engineering**: *Bridging avant-garde aesthetics with robust architecture and custom shaders.*
  - Wrapped in Framer Motion `<AnimatePresence mode="wait">` with blur exit for seamless service transitions.
- **OptionWheel Integration ([src/components/OptionWheel.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/OptionWheel.tsx))**:
  - Adapted React Bits cylindrical wheel for MAGNM's monochromatic design system (`#171717` active, `rgba(23, 23, 23, 0.28)` inactive, `#cccccc` background).
  - Configured with Title Case items, responsive font sizing (`1.85rem` to `3.75rem`), perspective curve (`0.82`), and tilt (`5deg`).
  - Zero-latency mechanical audio tick via Web Audio API (`AudioContext`, decoded `AudioBuffer` from `/audio/hover-sound.mp3`, with tactile oscillator fallback).
  - Exposes imperative methods via `forwardRef<OptionWheelHandle>`: `setTarget` and `setPositionDirect`.

### 2. Scroll Orchestration & Synchronization ([src/components/MainExperience.tsx](file:///e:/Projects/Landing%20Pages/magnm%20-%20creative%20studio/src/components/MainExperience.tsx))
- **Extended Pinned Timeline**:
  - Pinned stage scroll length extended to `+=520%` to give the user ample scroll distance to experience all 6 services.
- **Signature Optical Blur Section Entrance**:
  - Section 3 reveals smoothly via pure optical blur (`filter: blur(16px) -> blur(0px)`, `opacity: 0 -> 1`, `y: 0`, duration 0.08, `ease: 'power2.out'`) as the 12-strip vertical parallax transition finishes.
- **Scroll-Driven Services Sequence (Phase 6: 0.44 -> 0.98)**:
  - GSAP timeline tween interpolates `servicesScrollObj.index` from 0 to 5 across scroll progress 0.44 -> 0.98.
  - On update, calls `ourWorkHandleRef.current?.setPositionDirect(servicesScrollObj.index)`.
- **Discrete Service Scroll Snapping**:
  - Implemented custom `snap.snapTo` in ScrollTrigger strictly scoped to the services range (`progress >= 0.42`).
  - Calculates 5 equal increments between `0.44` and `0.98` (`0.108` per service), smoothly locking the scroll (`ease: 'power2.inOut'`, `duration: 0.35s`, `delay: 0.08s`) onto the exact integer option so the wheel never rests midway between services.
  - Leaves earlier phases (0.0 -> 0.42) completely unaffected with freeform continuous scroll.

### 3. Elimination of Scroll Desync & Double Smoothing
- Standard OptionWheel applies an internal `requestAnimationFrame` exponential smoothing loop (`tau = smoothing / 1000`).
- Because GSAP ScrollTrigger already applies scrub easing (`scrub: 0.15`), combining both caused significant input lag and desynchronization.
- Solved by implementing `setPositionDirect()` which bypasses the rAF easing loop during scroll-driven playback, updating DOM transforms and firing selection change triggers synchronously with the GSAP scrub position.

---

## Decisions made

1. **Sentence Composition ("We provide" + Wheel)**:
   - Formatted the section as a grammatical statement rather than a disconnected header and list.
   - Text rendered in Title Case rather than all-caps for modern editorial elegance.
2. **Signature Optical Blur without Y-Translation**:
   - Adhered strictly to the user guideline: no vertical sliding/displacement for text or section reveals. All reveals use the studio's signature optical blur (`blur(18px) -> blur(0px)`).
3. **Direct Positioning for Scroll Sync**:
   - Single source of truth for motion smoothing: GSAP controls the scrub physics while OptionWheel renders synchronously.
4. **Scoped Snapping**:
   - Snapping only activates within the services scroll phase (`0.44 -> 0.98`) to avoid hijacking free scroll during Hero and About manifesto transitions.

---

## Problems solved

1. **Scroll-Wheel Desync**:
   - Fixed lag where wheel movement trailed user scroll. Eliminated internal rAF exponential decay during scroll updates via `setPositionDirect`.
2. **Fractional Service Stopping**:
   - Fixed wheel resting between two service titles when the user released the scrollbar. Added dynamic `snapTo` calculation snapping to the nearest whole service index.
3. **Paragraph Length & Layout Fitting**:
   - Descriptions originally ran into 3-4 wrapped lines, looking crowded. Shortened to 8-10 words each so they consistently occupy 2 lines with balanced whitespace.

---

## Current state

- **Section 1 (Hero)**: Complete with 3D wheel, dynamic tagline, and wordmark docking.
- **Section 2 (About Manifesto)**: Complete with centered typography over the upright kinetic wheel backdrop.
- **Transition**: 12-strip vertical wipe smoothly transitions into the light `#cccccc` canvas.
- **Section 3 (Our Work / Services)**: **Complete & Polished**. "We provide" + OptionWheel sentence, zero-latency mechanical audio tick, 2-line randomized blur reveal descriptions, direct scroll-sync, and discrete snapping.
- **Dev Server**: Running on `http://localhost:3000`.

---

## Next session starts with

- Section 4 development: Next section after the pinned services experience (e.g., Selected Works / Case Studies / Project Grid).
- Finalize top-right Navbar actions/menu triggers if needed.

---

## Open questions

- What should be the transition or layout for Section 4 following the pinned services?
