# MAGNM — Creative Studio Landing Page

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Site-magnm--org.vercel.app-black?style=for-the-badge&logo=vercel)](https://magnm-org.vercel.app/)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![GSAP](https://img.shields.io/badge/GSAP-ScrollTrigger-green?style=for-the-badge&logo=greensock)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Vanilla-38B2AC?style=for-the-badge&logo=tailwind-css)
![SEO](https://img.shields.io/badge/SEO-Schema.org%20Graph-orange?style=for-the-badge&logo=google)

A motion-driven, ultra-minimalist, monochromatic digital creative studio landing page engineered with high visual fidelity, 3D WebGL scenes, fluid scroll-driven GSAP timelines, spatial soundscapes, and comprehensive search optimization.

**[🌐 View Live Experience](https://magnm-org.vercel.app/)**

</div>

---

## ✨ Key Features & Experience Design

- **Asset-Aware Preloader Orchestrator**: Replaces arbitrary timers with real-time multi-resource tracking (`document.fonts.ready`, critical WebP mockup decoding, DOM load states) and a smooth odometer counter before unlocking the viewport.
- **Monochromatic Visual Identity**: Carefully calibrated grayscale palette (`#000000`, `#171717`, `#4D4D4D`, `#cccccc`, `#DEDEDE`, `#ffffff`) engineered for maximum typographic contrast and high-end minimalism without arbitrary accent colors.
- **Dynamic Docking Wordmark**: Monolithic `MAGNM` display wordmark seamlessly interpolates, scales down, and docks into the sticky fixed navbar as the user enters the experience.
- **Progressive Typography Illumination**: About Manifesto statement illuminates word-by-word with staggered optical blur revealing the studio's philosophy.
- **12-Strip Parallax Transition**: Seamless horizontal wipe slicing the viewport across 12 vertical strips transitioning the stage from dark to light surfaces.
- **Interactive 3D Services Wheel**: Desktop pinned `OptionWheel` with 3D rotation, discrete snapping, and tick audio; accompanied by responsive mobile card drawers with tap-to-expand details.
- **Stepped Vertical Card Stack**: Section 4 showcase features a physical, perfectly aligned vertical stepped stack with zero tilt, flush horizontal edges, and uniform upward offsets (`yPercent: -6%, -12%, -18%`) with zero artificial drop-shadows or 3D distortion.
- **3D XylophoneHelix & Reverse Wordmark Expansion**: Section 5 Footer with real-time 3D metallic helix wheel and the live navbar wordmark reversing back up into the hero-scale typography.
- **Spatial Sound Synthesizer**: Custom Web Audio API synthesizer generating real-time glockenspiel chimes on scroll events, 3D wheel rotations, and button interactions.
- **Universal Project & About Modals**: Dynamic backdrop contrast detection automatically adapting modal styles (light/dark mode) relative to the active scroll section.
- **Enterprise SEO & Generative Engine Optimization (GEO)**:
  - Multi-entity Schema.org JSON-LD Knowledge Graph (`Organization`, `ProfessionalService`, `OfferCatalog`, `BreadcrumbList`, `WebPage`, `workExample`).
  - Google Image XML Sitemap (`/sitemap.xml`) & Search bot crawler policies (`/robots.txt`).
  - Generative Engine Optimization (`/llms.txt`) formatted for LLM citation systems (ChatGPT Search, Perplexity, Gemini, Claude).
  - Google Search Console verified ownership and priority crawl submission.

---

## 🏗️ Clean Modular Architecture

The codebase has been refactored into a decoupled, single-responsibility structure with all legacy and unused components safely archived:

```
src/
├── app/                                  # Next.js App Router root
│   ├── page.tsx                          # Single page entry point (<MainExperience />)
│   ├── layout.tsx                        # Metadata, fonts, Open Graph & Schema.org JSON-LD
│   ├── globals.css                       # Base stylesheet, typography & scrollbar hiding
│   ├── robots.ts                         # Dynamic search engine & AI bot crawler rules
│   ├── sitemap.ts                        # Dynamic XML sitemap with Google Image metadata
│   ├── icon.png                          # High-res 512x512 app icon
│   ├── apple-icon.png                    # Apple touch icon (180x180)
│   └── favicon.ico                       # Multi-resolution browser favicon
│
├── components/
│   ├── MainExperience.tsx                # Master orchestrator, asset preloader & stage tree
│   ├── Navbar.tsx                        # Sticky fixed navigation & brand dock target
│   ├── Hero.tsx                          # Minimalist hero header & bottom-left CTA
│   ├── AboutManifesto.tsx                # Section 2 statement with word illumination
│   ├── OurWork.tsx                       # Section 3: Desktop wheel & mobile service list
│   ├── Projects.tsx                      # Section 4: Stepped vertical card stack showcase
│   ├── Footer.tsx                        # Section 5: Footer with 3D helix & credits
│   ├── OptionWheel.tsx                   # Interactive circular 3D service carousel
│   ├── ParallaxStripTransition.tsx       # 12-strip vertical wipe transition
│   ├── ProjectModal.tsx                  # Interactive project case study modal
│   ├── AboutModal.tsx                    # Studio manifesto & team modal
│   ├── SmoothScroll.tsx                  # Lenis smooth scroll provider
│   ├── Counter.tsx                       # Monospace odometer roll-up number counter
│   ├── BlurText.tsx                      # Optical blur text reveal utility
│   ├── KineticShiftButton.tsx            # 3D letter-swap button with magnetic hover
│   ├── ScrollReveal.tsx                  # Scroll-triggered entrance helper
│   │
│   ├── experience/                       # 🎬 GSAP Scroll Experience Modules
│   │   ├── timings.ts                    # Master TIMINGS constants for all 9 scroll phases
│   │   ├── animation-helpers.ts          # Reusable sheet animations & transform target math
│   │   ├── use-responsive-wheel.ts       # Wheel scale states & resize listeners
│   │   ├── use-desktop-timeline.ts       # Desktop pinned ScrollTrigger master sequence
│   │   └── use-mobile-timeline.ts        # Mobile sequential ScrollTrigger timelines
│   │
│   ├── originkit/ui/
│   │   └── xylophone-helix.tsx           # 3D metal kinetic helix wheel WebGL canvas
│   │
│   └── ui/
│       └── letter-swap-pingpong-anim.tsx # Interactive letter swap physics
│
├── fonts/                                # Self-hosted optimized studio webfonts
└── lib/
    ├── chime-synth.ts                    # Web Audio API glockenspiel synthesizer
    └── utils.ts                          # Class merge utility (cn)
```

---

## 🎨 Design System & Color Tokens

| Token | Hex | Role | Usage |
|---|---|---|---|
| **Background Dark** | `#000000` | Deepest viewport tone | Viewport background, Hero stage, dark sections, Footer |
| **Dark Surface / Text** | `#171717` | High-contrast text & cards | Primary typography on light surfaces, button fill |
| **Mid Border Accent** | `#4D4D4D` | Subtle dividers & borders | Borders, secondary labels, disabled states |
| **Light Surface** | `#cccccc` | Section 3 & 4 light card surfaces | Our Work background, Projects card backdrop |
| **Surface Light Tint** | `#DEDEDE` | High-key surface tint | Secondary light highlights and overlays |
| **Pure White** | `#ffffff` | High-key flash & text | Flash backdrop transitions, high-contrast text |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.17+ or v20+)
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

3. Start the local development server:
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

## 👥 Credits

- **Designed by**: [Adarsh Pathade](https://adrz-26.vercel.app/)
- **Developed by**: [Pranav Dubey](https://github.com/prvdubey) & [Adarsh Pathade](https://github.com/adarzhpathade)

---

## 📄 License

Private repository — All rights reserved © [MAGNM](https://magnm-org.vercel.app/).
