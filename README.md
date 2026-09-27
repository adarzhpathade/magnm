# MAGNM — Creative Studio Landing Page

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![GSAP](https://img.shields.io/badge/GSAP-ScrollTrigger-green?style=for-the-badge&logo=greensock)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Vanilla-38B2AC?style=for-the-badge&logo=tailwind-css)

A motion-driven, ultra-minimalist, monochromatic digital creative studio landing page featuring real-time 3D WebGL scenes, fluid scroll-driven GSAP timelines, custom GLSL shader distortion, and an interactive spatial soundscape.

</div>

---

## ✨ Features

- **Monochromatic Visual Identity**: Carefully calibrated grayscale palette (`#000000`, `#171717`, `#4D4D4D`, `#cccccc`, `#DEDEDE`, `#ffffff`) engineered for maximum contrast and high-end minimalism.
- **Docking Wordmark Animation**: Monolithic `MAGNM` hero wordmark scales down dynamically and docks into the sticky fixed navbar as the user scrolls.
- **Progressive Typography Illumination**: About Manifesto statement illuminates word-by-word with staggered optical blur revealing the narrative.
- **Interactive 3D Kinetic Helix Wheel**: Three.js WebGL metal wheel rotates upright behind the manifesto and reacts to cursor physics and spatial audio.
- **12-Strip Parallax Transition**: Seamless horizontal wipe slicing the viewport across 12 vertical strips transitioning the stage from dark to light surfaces.
- **Interactive Services Carousel**: Pinned desktop `OptionWheel` with mouse scrubbing and discrete snap points; responsive mobile card drawers with tap-to-expand animation.
- **Liquid-Glass WebGL Projects Carousel**: Custom GLSL fragment shader simulating real-time glass refraction, chromatic dispersion, center-outward ripple entrance, and an idle auto-scroll progress indicator.
- **Mobile Card-Sheet Transition Parity**: Uniform elevated card-sheet slide-on transitions across mobile viewports with native momentum touch scrolling.
- **Spatial Sound Synthesizer**: Custom Web Audio API synthesizer generating real-time glockenspiel chimes on scroll events and component interactions.

---

## 🏗️ Architecture & Modular Structure

The codebase is built on a clean, decoupled modular architecture. All animation logic, timeline configurations, and WebGL engine components are isolated into dedicated single-responsibility files:

```
src/
├── app/                                  # Next.js App Router root
│   ├── page.tsx                          # Single page entry point
│   ├── layout.tsx                        # Global fonts & HTML shell
│   └── globals.css                       # Base stylesheet
│
├── components/
│   ├── MainExperience.tsx                # Master orchestrator & stage hierarchy (~260 lines)
│   ├── Navbar.tsx                        # Sticky fixed navigation & brand dock target
│   ├── Hero.tsx                          # Minimalist hero header & bottom-left CTA
│   ├── AboutManifesto.tsx                # Section 2 statement with word illumination
│   ├── OurWork.tsx                       # Section 3: Desktop wheel & mobile service list
│   ├── Projects.tsx                      # Section 4: Projects carousel wrapper
│   ├── OptionWheel.tsx                   # Interactive circular 3D service carousel
│   ├── ParallaxStripTransition.tsx       # 12-strip vertical wipe transition
│   ├── SmoothScroll.tsx                  # Lenis smooth scroll provider (desktop only)
│   ├── Counter.tsx                       # Monospace odometer roll-up number counter
│   ├── BlurText.tsx                      # Optical blur text reveal utility
│   ├── KineticShiftButton.tsx            # 3D letter-swap button with magnetic hover
│   │
│   ├── experience/                       # 🎬 GSAP Scroll Experience Modules
│   │   ├── timings.ts                    # Master TIMINGS constants for all 8 scroll phases
│   │   ├── animation-helpers.ts          # Reusable sheet animations & transform target math
│   │   ├── use-responsive-wheel.ts       # Wheel scale states & resize listeners
│   │   ├── use-desktop-timeline.ts       # Desktop pinned ScrollTrigger master sequence
│   │   └── use-mobile-timeline.ts        # Mobile sequential ScrollTrigger timelines
│   │
│   ├── ui/
│   │   ├── liquid-glass-carousel.tsx     # React forwardRef component for Projects
│   │   ├── letter-3d-swap.tsx            # 3D letter swap physics
│   │   ├── webgl-error-boundary.tsx      # WebGL fallback wrapper
│   │   │
│   │   └── carousel/                     # 🔮 WebGL Liquid Glass Carousel Engine
│   │       ├── index.ts                  # Barrel exports
│   │       ├── types.ts                  # Shared state & option interfaces
│   │       ├── constants.ts              # Shader, lens, and physics constants
│   │       ├── default-items.ts          # Showcase project definitions
│   │       ├── shaders.ts                # GLSL vertex & fragment shaders
│   │       ├── create-renderer.ts        # Three.js WebGLRenderer & mesh pool setup
│   │       ├── layout.ts                 # Slot math, wrap-around offsets, & mesh positioning
│   │       ├── input.ts                  # Wheel, drag, pointer capture, & custom cursor
│   │       ├── focus.ts                  # Card-drop focus & unfocus animations
│   │       ├── entry.ts                  # Symmetrical center-outward ripple entrance
│   │       ├── auto-scroll.ts            # Auto-advance & progress bar computation
│   │       └── create-carousel.ts        # Master RAF render loop orchestrator
│   │
│   └── originkit/ui/                     # 3D metal kinetic helix wheel component
│
├── hooks/                                # Custom React hooks (dimensions, mouse)
└── lib/
    ├── chime-synth.ts                    # Web Audio API glockenspiel synthesizer
    └── utils.ts                          # Class merge utility (cn)
```

---

## 🎨 Color System

| Token | Hex | Role |
|---|---|---|
| Background Dark | `#000000` | Viewport background & Hero stage |
| Dark Surface / Text | `#171717` | High-contrast typography & primary surfaces |
| Mid Border Accent | `#4D4D4D` | Subtle dividers & borders |
| Light Surface | `#cccccc` | Section 3 & 4 light card surfaces |
| Surface Light Tint | `#DEDEDE` | High-key surface tint |
| Pure White | `#ffffff` | Flash transitions & high-key accents |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17+ or Node.js 20+
- npm, pnpm, or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/adarzhpathade/magnm.git
   cd magnm
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Verification & Build

To verify TypeScript types across all modular files:
```bash
npx tsc --noEmit
```

To create an optimized production bundle:
```bash
npm run build
```

---

## 📄 License

Private repository — All rights reserved © MAGNM Studio.
