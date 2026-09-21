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
- Bottom-right tagline: Dynamic rotating starting line (`"Translating bold vision"`, `"Choreographing pure motion"`, `"Sculpting digital form"`, `"Engineering aesthetics"`) cycling every 3.8s using random in-place blur reveal, resolving into a static permanent anchor line: `"into lasting impact."`. Tight grotesque leading (`leading-[1.02]`, `tracking-[-0.035em]`).
- Integrated with `<BlurText />` motion component for atmospheric entrance animations.
- 3D layer: Integrated `<XylophoneHelix />` with alpha transparency centered in viewport and layered ABOVE the typography (`z-10` canvas over `z-0` text), allowing the 3D bars to physically cross over the text while maintaining full user drag and inertia interaction.

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

### Letter3DSwap / Bottom-Left Hero Options

File: `src/components/ui/letter-3d-swap.tsx`, `src/components/Hero.tsx`  
Last updated: 2026-09-21  

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
- Rotating geometric `+` provides a crisp architectural touch without visual clutter.
