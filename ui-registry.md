# UI Registry — MAGNM Landing Page

This registry records visual patterns, components, tokens, and consistency rules across the MAGNM project.

---

### Hero

File: `src/components/Hero.tsx`  
Last updated: 2026-09-21  

| Property         | Class / Value                                |
| ---------------- | -------------------------------------------- |
| Background       | `bg-[#000000]` (Pure black)                  |
| Border           | None                                         |
| Border radius    | None                                         |
| Text — primary   | `text-[#cccccc]` (Primary foreground)        |
| Text — secondary | `text-[#4d4d4d]` (Subtle secondary)          |
| Spacing          | `px-3 sm:px-5 md:px-7 lg:px-8 py-3 sm:py-4 md:py-5 lg:py-6` (Symmetrical top & bottom margin framing) |
| Hover state      | 3D canvas interactive cursor wake & metallic strikes |
| Shadow           | Handled internally via WebGL2 shaders        |
| Accent usage     | `#D8782B` (3D kinetic hover/reflection wake) |

**Pattern notes:**
- Full viewport height (`h-screen min-h-[500px] flex flex-col justify-between`).
- Typography strictly powered by `Familjen Grotesk` (`FamiljenGroteskVariable_Regular-s.p.04jxz-d23sc_e.woff2`).
- Brand display wordmark: `"MAGNM"` sized to `clamp(4.25rem, 16vw, 15.5rem)` with ultra-compact `leading-[0.8]`, negative tracking (`tracking-[-0.04em]`), and optical negative left margin (`-ml-[0.08em]`) compensating for uppercase glyph side-bearings to ensure its left vertical stem sits flush on the exact same vertical axis as the tagline below it.
- Tagline: Permanent anchor phrase (`"Translating bold vision"` / `"into lasting"`) with only the final word rotating dynamically (`"impact."`, `"clarity."`, `"motion."`, `"scale."`, `"reality."`, `"form."`) every 3.2s via `<AnimatePresence mode="wait">` with blur and subtle vertical drift (`y: 6 -> 0 -> -6`). Placed directly under the `"MAGNM"` wordmark with calibrated breathing room (`mt-3.5 sm:mt-4 md:mt-5`), left-aligned (`items-start text-left justify-start`), sized to `clamp(1.15rem, 2.4vw, 2.25rem)` with tight grotesque leading (`leading-[1.05]`, `tracking-[-0.035em]`).
- Integrated with `<BlurText />` motion component for atmospheric entrance animations.
- 3D layer: Integrated `<XylophoneHelix />` with alpha transparency layered ABOVE typography (`z-10`). Responsively scaled (`scale={48}` on mobile <640px, `70` on tablet, `90` on desktop) and centered without vertical offset on mobile (`translate-y-0 md:translate-y-7 lg:translate-y-9`) to ensure it is centered on the mobile screen without obstructing actions or taglines.


---

### BlurText

File: `src/components/BlurText.tsx`  
Last updated: 2026-09-21  

| Property         | Class / Value                                |
| ---------------- | -------------------------------------------- |
| Background       | Transparent / parent inherited               |
| Border           | None                                         |
| Border radius    | None                                         |
| Text — primary   | Inherits container text styling              |
| Text — secondary | N/A                                          |
| Spacing          | Inherits container spacing; `flex flex-wrap` |
| Hover state      | None                                         |
| Shadow           | None                                         |
| Accent usage     | None (monochromatic default)                 |

**Pattern notes:**
- Imported from React Bits, driven by `motion/react`.
- Client component (`'use client'`) utilizing `IntersectionObserver` for viewport-triggered blur-in text transitions.
- Supports both word-level and letter-level animations (`animateBy`).
- Configured with `direction="none"` (no vertical/horizontal translation) and `randomize={true}` for organic in-place random word blur materialization.
- Custom color and typography classes can be passed through `className` according to the MAGNM design system.

---

### XylophoneHelix

File: `src/components/originkit/ui/xylophone-helix.tsx`  
Last updated: 2026-09-21  

| Property         | Class / Value                                |
| ---------------- | -------------------------------------------- |
| Background       | `#000000`                                    |
| Base Color       | `#0E0E1A`                                    |
| Bars             | `44`                                         |
| Shape            | `wheel`                                      |
| Speed / Drag     | Speed `59`, Drag `100`                       |
| Scale            | `90%` (Refined proportional balance)       |
| Position         | Shifted slightly down (`translate-y-5 sm:translate-y-7 md:translate-y-9`) for balanced vertical spacing |
| Metal            | Reflect `100`, Polish `100`                  |
| Hover Wake       | Color Flood Removed (`strength: 0`, `tint: 0`, `glow: 0`) — wheel remains pure dark metallic `#0E0E1A` with physical inertia and strikes |
| Camera           | Tilt `36`, Side Tilt `-35`                   |

**Pattern notes:**
- Imported 3D interactive component from Originkit.
- Pure WebGL2 execution with instanced rendering, dual-target fluid dynamics, and simulated metal reflections.
### ParticleSaturn

File: `src/components/originkit/ui/particle-saturn.tsx`  
Last updated: 2026-09-21  

| Property         | Class / Value                                |
| ---------------- | -------------------------------------------- |
| Background       | Transparent (Three.js WebGLRenderer `alpha: true`) |
| Core Color       | `#CCCCCC` (Primary MAGNM foreground monochrome) |
| Ring Color       | `#CCCCCC` (Primary MAGNM foreground monochrome) |
| Density          | `7`                                          |
| Particle Size    | `14`                                         |
| Glow             | `20`                                         |
| Tilt / Roll      | Tilt `29°`, Roll `-34°`                      |
| Spin Speed       | `7`                                          |
| Ring Options     | Inner `117`, Outer `262`, Gaps `1`, Orbit `9`|
| Drag Sensitivity | `2`                                          |
| Size Percent     | `129%`                                       |

**Pattern notes:**
- Imported 3D particle globe component from Originkit.
- Three.js WebGL particle field rendering of planet sphere core and concentric particle rings.
- Supports interactive mouse drag rotation with momentum.
- Aligned to MAGNM monochromatic palette (`#CCCCCC` particles over `#000000` dark background).

---

### Letter3DSwap / Navigation & Interactive Options

File: `src/components/ui/letter-3d-swap.tsx`, `src/components/Hero.tsx`  
Last updated: 2026-09-22  

| Property         | Class / Value                                |
| ---------------- | -------------------------------------------- |
| Background       | Transparent                                  |
| Border           | None (No pill frames, no underlines)         |
| Text — front face | `text-[#cccccc]` (Consistent primary foreground) |
| Text — second face | `text-[#cccccc]` (No color highlight on hover) |
| Micro-interaction | Subtle geometric `+` in `#666666` rotating 90° on hover |
| Typography       | `Martian Mono` (`MartianMono_Light-s.p.0htes.s6weu9-.woff2`), Light 300-400 |
| Case & Tracking  | Uppercase, `tracking-[0.06em]`               |
| Font Size        | `text-[clamp(0.68rem,0.85vw,0.82rem)]`       |
| Hover Motion     | 3D box letter flip (`rotateDirection: "top"`, `staggerDuration: 0.018s`, `staggerFrom: "first"`, `damping: 25`, `stiffness: 300`) |
| Audio Feedback   | None (Sound is strictly reserved for the 3D wheel) |
| 3D Perspective   | `[perspective:800px]`, `transform-style: preserve-3d`, `backface-visibility: hidden` |
| Interactive Mode | `z-20 pointer-events-auto` layered above canvas |

**Pattern notes:**
- Minimal, clean typographic treatment without heavy capsule borders, numbers, or glowing dots.
- Monochromatic text remains uniformly `#cccccc` across both 3D flip faces.
- Rotating geometric `+` provides a crisp architectural touch without visual clutter on bottom actions (`DISCUSS YOUR PROJECT`, `BOOK A 30-MINUTE CALL`).
- Hidden on mobile view (`<768px`, `hidden md:flex`) to keep the mobile hero layout minimal, focused on the centered 3D kinetic centerpiece and bottom-right tagline.

### Top-Right Logo Emblem & Narrative Statement

File: `src/components/Hero.tsx`  
Last updated: 2026-09-22  

| Property         | Class / Value                                |
| ---------------- | -------------------------------------------- |
| Emblem Asset     | `/magnm light.png` (High-res metallic origami "M" emblem) |
| Emblem Sizing    | Mobile: `h-9 sm:h-10`. Desktop: `h-8 sm:h-9 md:h-10 w-auto object-contain` |
| Divider          | Mobile: `w-[1px] h-9 sm:h-10 bg-white/20`. Desktop: `w-[1px] h-8 sm:h-9 md:h-10 bg-white/20` |
| Typography       | `Familjen Grotesk`, `text-[0.75rem] - [0.86rem]` |
| Color            | `text-[#cccccc]`                             |
| Leading          | `leading-[1.25]`, `tracking-[-0.012em]`      |
| Copy             | `Websites, AI products, brands, and systems built for clarity, scale and impact.` |
| Layout           | Desktop: Top-right quadrant (`hidden md:flex`), centered vertically on the exact horizontal centerline of the `MAGNM` display wordmark (`items-center`). Mobile: Bottom-right quadrant (`flex md:hidden self-end ml-auto`) |

---

### ScrollReveal

File: `src/components/ScrollReveal.tsx`  
Last updated: 2026-09-22  

| Property         | Class / Value                                |
| ---------------- | -------------------------------------------- |
| Background       | Transparent / container inherited           |
| Border           | None                                         |
| Text — primary   | Inherits container or passed via `textClassName` |
| Motion Library   | GSAP + ScrollTrigger                         |
| Typography       | `clamp(1.6rem, 4vw, 3rem)`, `leading-[1.5]`  |
| Blur Support     | Configurable via `enableBlur` and `blurStrength` |
| Rotation Support | Starting container rotation via `baseRotation` (scrubbed to 0) |
| Scrub / Triggers | Scoped via `gsap.context()` for clean React 19 lifecycle management |

**Pattern notes:**
- Imported from React Bits.
- Word-level scroll scrubbing with combined opacity, blur, and subtle container rotation.
- Ready for integration in upcoming content/manifesto sections upon user instruction.

---

### ElasticLine

File: `src/components/fancy/physics/elastic-line.tsx`  
Hooks: `src/hooks/use-mouse-position.ts`, `src/hooks/use-dimensions.ts`, `src/hooks/use-elastic-line-events.ts`  
Last updated: 2026-09-22  

| Property         | Class / Value                                |
| ---------------- | -------------------------------------------- |
| Stroke           | Inherits `currentColor` (e.g. `text-white/20`, `text-[#4D4D4D]`, `text-[#CCCCCC]`) |
| Stroke width     | `strokeWidth={1}` (Default 1px hair line)    |
| Orientation      | Horizontal (`isVertical={false}`) or Vertical (`isVertical={true}`) |
| Motion Library   | `motion/react` (`useAnimationFrame`, `useMotionValue`, `animate`) |
| Interaction      | Spring-loaded cursor grab within `grabThreshold` and release physics |
| Spring Config    | `stiffness: 300`, `damping: 5` (Default)     |

**Pattern notes:**
- Imported from Fancy Components.
- Interactive SVG quadratic curve (`Q` control point calculation with requestAnimationFrame loop).
- Sized via parent container bounding dimensions (`useDimensions`).
- Supports both mouse and touch input.
---

### Counter (Preloader)

File: `src/components/Counter.tsx`  
Last updated: 2026-09-23  

| Property         | Class / Value                                |
| ---------------- | -------------------------------------------- |
| Background       | Transparent                                  |
| Motion Library   | `motion/react` (`useSpring`, `useTransform`) |
| Font Family      | Inherited (`Martian Mono`)                   |
| Font Size        | `13px`                                       |
| Font Weight      | `300` (Light)                                |
| Text Color       | `#CCCCCC`                                    |
| Places           | `[100, 10, 1]` (Fixed 3-place zero-jitter)   |
| Gap              | `1px`                                        |
| Padding          | `5px` vertical padding                       |
| Gradient Overlay | `3px` top & bottom fading to `#000000`       |
| Position         | `translate-y-[76px] sm:translate-y-[84px]`   |

**Pattern notes:**
- Imported from React Bits.
- Smooth cylindrical rolling digit transitions driven by physics springs (`useSpring`).
- Sits centered directly beneath the 20% scale 3D wheel during initial site load.
- Seamlessly fades and slides down upon reaching 100% before the Hero section unveils.

---

### LiquidGlassCarousel

File: `src/components/originkit/ui/liquid-glass-carousel.tsx`  
Last updated: 2026-09-23  

| Property         | Class / Value                                |
| ---------------- | -------------------------------------------- |
| Background       | Configurable (default `#000000`)             |
| Shaders          | WebGL custom lens with chromatic dispersion, glow, shimmer, rim wave |
| Motion Library   | Internal high-precision RAF physics & Three.js WebGL |
| Controls         | Drag, mouse wheel, click-to-focus            |
| Card Dimensions  | `cardWidth` (default `340px`), `cardHeight` (default `450px`), `gap` (default `12px`) |
| Sizing Modes     | `same`, `alternate`, `random`, `image`       |
| Monochromatic Fit| Adapts to dark/light surfaces with customizable ring, lens glow, and cards |

**Pattern notes:**
- Imported from Originkit for project showcase in Section 3.
- Features real-time fluid lens refraction, chromatic dispersion (RGB split), dynamic rim waves, and spring physics card glide.
- Kept unmounted until ready for Section 3 integration.

---

### OurWork / Services Showcase

File: `src/components/OurWork.tsx`, `src/components/originkit/ui/hover-image-reveal.tsx`  
Last updated: 2026-09-24  

| Property         | Class / Value                                |
| ---------------- | -------------------------------------------- |
| Background       | Transparent (revealed on `#cccccc` light surface via ParallaxStripTransition) |
| Position         | Center top, `pt-12 sm:pt-14 md:pt-16 lg:pt-20` below fixed Navbar |
| Section Heading  | `Familjen Grotesk`, `text-lg sm:text-xl md:text-2xl lg:text-3xl`, `tracking-[-0.025em]`, `#171717` |
| List Typography  | `Familjen Grotesk` (`--font-familjen`), `font-normal`, uppercase |
| List Font Size   | `clamp(1.65rem, 3.4vw, 3.25rem)`, `leading-[1.04em]`, `tracking-[-0.035em]` |
| Text Color       | `#171717` (Active/Normal), `rgba(23, 23, 23, 0.22)` (Dimmed on hover) |
| Floating Card    | Responsive `imageWidth` (220-320px), `imageHeight` (280-420px), `rounded: 14` |
| Motion Library   | Framer Motion (`useSpring`, `useMotionValue`), GSAP ScrollTrigger |

**Pattern notes:**
- Imported Originkit `HoverImageReveal` for interactive services presentation on the light `#cccccc` canvas.
- Features smooth cursor-following floating image cards with spring dynamics and vertical roll text animation on hover.
- Sized responsively across desktop, tablet, and mobile breakpoints.

---

### KineticShiftButton

File: `src/components/KineticShiftButton.tsx`  
Last updated: 2026-09-26  

| Property         | Class / Value                                |
| ---------------- | -------------------------------------------- |
| Background       | Transparent                                  |
| Border           | Baseline underline: `h-[1px]` (`rgba(255,255,255,0.2)` dark / `rgba(23,23,23,0.18)` light) |
| Border radius    | None                                         |
| Text — primary   | `#cccccc` (dark theme at rest) / `#171717` (light theme at rest) |
| Text — hover     | `#ffffff` (dark theme hovered) / `#000000` (light theme hovered) |
| Typography       | `Martian Mono` (`font-['Martian_Mono',monospace]`), light 300, `text-[clamp(0.68rem,0.85vw,0.82rem)]`, `tracking-[0.06em]` |
| Spacing          | `pt-1.5 pb-1` (button padding), default gap `32px` (`gapPx`) |
| Hover state      | Left `+` reveals & rotates 90°; words travel in staggered wave to dock flush against extreme right edge of baseline; right `+` rotates & fades out; glowing line sweeps across baseline from left to right |
| Shadow           | Underline active sweep glow: `shadow-[0_0_8px_rgba(255,255,255,0.6)]` (dark) / `shadow-[0_0_6px_rgba(23,23,23,0.25)]` (light) |
| Audio Feedback   | Zero-latency acoustic metallic hover sound via Web Audio API (`/audio/hover-sound.mp3` decoded buffer with synthesized micro-chime fallback). Configurable via `enableSound` and `soundVolume` |
| Accent usage     | Pure monochromatic (`#000000`, `#171717`, `#666666`, `#cccccc`, `#ffffff`) |

**Pattern notes:**
- Signature MAGNM typographic micro-action button with kinetic word travel and animated geometric `+` indicators.
- Words calculate layout bounds dynamically via `rowWidth - wordsWidth` so the final word aligns exactly flush with the right edge of the baseline line without text overflow.
- Reusable across both dark backgrounds (`theme="dark"`) and light canvases (`theme="light"`).
- Features integrated zero-latency acoustic audio feedback on hover and focus.
- Supports customizable `gapPx`, `enableSound`, `soundVolume`, custom `onClick` handler, and accessible `ariaLabel`.

---

### LiquidGlassCarousel & Projects Showcase (Page 4)

Files: `src/components/ui/liquid-glass-carousel.tsx`, `src/components/Projects.tsx`  
Last updated: 2026-09-26  

| Property         | Class / Value                                |
| Heading          | Top center: `Our Projects` in `Familjen Grotesk` (`text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem]`, `font-normal tracking-[-0.035em] text-[#171717]`) |
| Card Orientation | Horizontal (`aspect: 16 / 10`), landscape aspect ratio with 1600x1000 imagery |
| Background       | `#cccccc` (matching Page 3 light surface)    |
| Border radius    | Strictly none (`rounded-none`, sharp corners)|
| WebGL Rendering  | Direct crisp card rendering (lens removed — zero distortion/blur/chromatic aberrations) with inertial drag physics |
| Incoming Motion  | Triggered synchronously via GSAP ScrollTrigger at scroll `0.80` the moment Page 4 elevates: horizontal cards rise from below and expand outward |
| Interaction      | Mouse/touch inertial drag, click-to-focus expansion with drop-away physics, keyboard left/right arrow navigation, Escape to close |
| Scroll Behavior  | Non-blocking vertical wheel: page continues smooth scrolling into & out of Page 4; Shift+Wheel and trackpad horizontal gestures scroll the carousel |
| Stacking Context | `z-40`, slides up over scaled Page 3 (0.8 scale at `z-35`) with elevated drop shadow `shadow-[0_-25px_80px_rgba(0,0,0,0.22)]` |

**Pattern notes:**
- Top center heading **"Our Projects"** rendered in a little big size font matching the grotesque typography of Page 3.
- Imported `@componentry/liquid-glass-carousel` rendered raw on Page 4 with the lens shader removed.
- Cards are horizontal rectangles (`16 / 10` widescreen format).
- Sharp rectangular panels with zero rounded corners as mandated by design specifications.
- Incoming animation is triggered by `MainExperience.tsx` at scroll 0.80 so the cards rise and expand outward right as Page 4 comes into view.






