# AGENTS.md — MAGNM Landing Page

## 1. Project Overview

MAGNM is a highly visual, motion-driven landing page focused on precise design reproduction, smooth interactions, imported UI components, and 3D elements.

The implementation should prioritize:

- Exact visual fidelity to the supplied design references.
- Smooth, intentional motion throughout the experience.
- Strong use of modern motion libraries.
- 3D elements where specified.
- Responsive behavior without compromising the visual language.
- Clean, maintainable component architecture.

The supplied design images are the source of truth for the visual implementation.

---

## 2. Core Design Rule — Exact Reference Implementation

When a design picture/reference is provided:

> **IMPLEMENT THE DESIGN EXACTLY THE SAME AS THE PROVIDED REFERENCE.**

Do not redesign, reinterpret, simplify, or replace visual decisions without explicit instruction.

Match as closely as possible:

- Layout
- Spacing
- Dimensions
- Alignment
- Typography
- Font sizing
- Font weight
- Colors
- Borders
- Radius
- Shadows
- Backgrounds
- Image placement
- 3D element placement
- Component proportions
- Animation direction
- Animation timing
- Visual hierarchy
- Section transitions

If a visual detail is visible in the reference, treat it as intentional.

Do not add unnecessary UI elements or decorative elements simply because they look good.

If something cannot be determined from the reference, use the surrounding design system and existing implementation context rather than inventing a new visual direction.

---

## 3. Color System

The primary MAGNM palette is intentionally monochromatic.

### Light Background

```text
#DEDEDE
```

Use for light background surfaces and sections where specified by the design.

### Dark Background

```text
#4D4D4D
```

Use for darker background sections, surfaces, and visual transitions where specified.

### Primary Text / Dark Surface

```text
#171717
```

Use for primary text, dark surfaces, and high-contrast elements where specified.

### Color Rules

- Do not introduce random accent colors.
- Preserve the grayscale visual identity.
- Use only the provided colors unless a design reference explicitly introduces another color.
- Maintain sufficient contrast between text and its background.
- Do not replace the palette with gradients unless the supplied design specifically contains them.

---

## 4. Visual Direction

The landing page should feel:

- Modern
- Premium
- Minimal
- Experimental
- Motion-driven
- Technically sophisticated
- Visually precise

The design should rely on composition, typography, motion, depth, 3D elements, and transitions rather than unnecessary decoration.

---

## 5. Component Architecture

The website will use imported/reusable components.

Components may originate from **different sides of the page/layout** and should be composed into the final experience rather than forcing everything into one monolithic component.

Build reusable components for:

- Navigation
- Hero
- Content sections
- Cards
- Interactive elements
- 3D elements
- Motion sections
- Footer
- Repeated UI patterns

Keep components modular and easy to modify.

Do not duplicate large blocks of JSX unnecessarily.

If an imported component already provides the required behavior or visual structure, adapt it carefully instead of rebuilding it from scratch without a reason.

---

## 6. Imported Components From Different Sides

The landing page will use components imported from different sources/locations.

When integrating an imported component:

1. Preserve its intended behavior where possible.
2. Adapt its styling to the MAGNM design system.
3. Ensure typography and colors match the reference.
4. Ensure it does not introduce conflicting global styles.
5. Ensure it works correctly with the existing animation system.
6. Keep the final implementation visually consistent.

Imported components should feel like one unified MAGNM experience, not disconnected third-party blocks.

---

## 7. 3D Elements

The landing page will contain **3D elements**.

3D elements should be treated as important visual components rather than optional decoration.

Requirements:

- Integrate 3D elements into the layout according to the supplied design.
- Match their position, scale, perspective, lighting, and visual weight as closely as possible to the reference.
- Ensure 3D elements participate naturally in the page's motion system.
- Avoid unnecessary 3D complexity that harms performance.
- Keep 3D rendering responsive.
- Ensure 3D elements do not break surrounding layout or interaction.
- Consider lazy loading or deferred initialization for expensive 3D assets when appropriate.

The 3D experience should remain smooth on both desktop and mobile where feasible.

---

## 8. Motion-Driven Website

MAGNM is a **motion-driven website**.

Motion is a core part of the experience and should not be treated as an afterthought.

Install and use the appropriate modern motion/animation libraries required for the implementation.

Potentially relevant libraries include:

- GSAP
- Framer Motion / Motion
- Lenis
- Three.js
- React Three Fiber
- Drei
- Other appropriate motion/3D utilities when required by the design

Do not install libraries blindly if they are not needed, but the project should have the necessary motion ecosystem available for implementing the supplied designs.

---

## 9. Motion Principles

### Every Motion Should Be Smooth

All animations and transitions should feel:

- Fluid
- Controlled
- Intentional
- Natural
- Premium

Avoid:

- Abrupt transitions
- Mechanical movement
- Excessive bouncing
- Unnecessary animation
- Janky scroll effects
- Sudden layout shifts
- Poorly synchronized animations

Motion should have appropriate:

- Duration
- Easing
- Delay
- Stagger
- Acceleration/deceleration
- Scroll synchronization

Prefer transforms and opacity for performant animations where possible.

---

## 10. GSAP / Scroll Motion

For complex timeline-based animations, use GSAP where appropriate.

Use:

- Timelines for coordinated sequences.
- ScrollTrigger for scroll-driven sequences.
- Staggers for groups of elements.
- Transform-based animation for performance.
- Proper cleanup for React lifecycle integration.

Scroll-based motion should feel connected to the user's movement rather than simply triggering isolated animations.

---

## 11. Framer Motion / Motion

Use Framer Motion / Motion when component-level animation and interaction are more appropriate.

Good use cases include:

- Component entrance animations
- Hover interactions
- Layout transitions
- Micro-interactions
- State-based animation
- Shared element transitions

Do not use multiple animation systems for the same animation unnecessarily.

Choose the most appropriate tool for each motion requirement.

---

## 12. Smooth Scrolling

If smooth scrolling is required by the design, use an appropriate smooth-scroll solution such as Lenis.

Smooth scrolling must not conflict with:

- GSAP ScrollTrigger
- 3D rendering
- Native browser behavior
- Touch scrolling
- Mobile responsiveness

Scroll synchronization should be carefully implemented.

---

## 13. Performance

Because the website will contain heavy motion and 3D elements, performance is important.

Prioritize:

- GPU-friendly transforms
- Efficient animation loops
- Optimized 3D assets
- Proper asset loading
- Lazy loading where appropriate
- Avoiding unnecessary React re-renders
- Avoiding excessive DOM complexity
- Efficient event listeners
- Proper cleanup of animation instances

Do not sacrifice the visual fidelity of the reference unnecessarily, but avoid technically wasteful implementations.

---

## 14. Responsive Design

The supplied design is the visual source of truth.

The implementation should maintain the same visual hierarchy across:

- Desktop
- Tablet
- Mobile

Responsive behavior should adapt layout intelligently while preserving the intended design.

Do not simply shrink the desktop layout.

For 3D and motion-heavy elements, consider:

- Reduced complexity on smaller devices where necessary.
- Appropriate camera/viewport adjustments.
- Touch-friendly interactions.
- Reduced animation workload if required for performance.

Any mobile-specific design provided by the user must be followed exactly.

---

## 15. Typography

Typography must closely match the supplied design.

Pay attention to:

- Font family
- Font weight
- Font size
- Letter spacing
- Line height
- Text width
- Text alignment
- Text transformation

Do not substitute typography casually when a specific font is provided.

Typography is part of the visual design and should be treated with the same precision as layout.

---

## 16. Layout & Spacing

Use the design reference to determine:

- Section heights
- Container widths
- Grid structure
- Padding
- Margins
- Gaps
- Element positioning
- Alignment

Avoid arbitrary spacing values when the reference clearly indicates a specific relationship.

Maintain consistent spacing across reusable components.

---

## 17. Interaction Design

Interactions should support the visual experience.

Potential interactions may include:

- Hover animations
- Cursor interactions
- Scroll-based movement
- 3D reactions
- Magnetic interactions
- Image/video transitions
- Menu transitions
- Section reveals
- Text animations

Only implement interactions that fit the supplied design or are explicitly requested.

Do not add random effects simply to make the website appear more animated.

---

## 18. Code Quality

Keep the implementation:

- Modular
- Readable
- Maintainable
- Reusable
- Properly structured

Avoid:

- Giant components
- Repeated animation code
- Hardcoded values scattered throughout the project
- Unnecessary dependencies
- Global CSS conflicts
- Uncontrolled side effects

Animation logic should be organized so that it can be modified without breaking unrelated sections.

---

## 19. Development Workflow

The implementation will be developed progressively from the supplied design references.

Follow this workflow:

1. Understand the supplied reference.
2. Identify its sections and components.
3. Establish the design system.
4. Integrate required components.
5. Implement the static structure.
6. Add 3D elements.
7. Add motion and interactions.
8. Refine timing and transitions.
9. Refine responsive behavior.
10. Perform final visual refinement.

### Important

**There is NO need to run checks after every individual step.**

Do not waste development time repeatedly running validation/build/check commands after every small change.

Checks can be performed at appropriate milestones or after a meaningful group of changes.

---

## 20. Visual Fidelity Over Assumptions

When the implementation and the developer's assumptions conflict with the supplied design image:

**The supplied design image wins.**

Do not make independent design decisions that change the intended result.

If a design reference shows a specific:

- Position
- Size
- Animation
- Color
- Component
- Transition
- 3D object
- Spacing relationship

implement it accordingly.

---

## 21. Animation Quality Checklist

Before considering the landing page complete, ensure:

- [ ] All major motion feels smooth.
- [ ] No obvious animation jitter exists.
- [ ] Scroll animations are synchronized correctly.
- [ ] 3D elements render smoothly.
- [ ] Animations do not cause layout shifts.
- [ ] Hover states transition smoothly.
- [ ] Page transitions feel intentional.
- [ ] Mobile interactions remain usable.
- [ ] Animation timing matches the design reference.
- [ ] No unnecessary animation has been introduced.

---

## 22. Final Implementation Principle

MAGNM should feel like a **single, cohesive motion experience**.

The final result should not feel like a collection of unrelated animated components.

Every section, imported component, transition, and 3D element should contribute to one consistent visual system.

### Priority Order

When making implementation decisions, prioritize:

1. **Exact supplied design**
2. **Visual fidelity**
3. **Smooth motion**
4. **3D integration**
5. **Responsive behavior**
6. **Performance**
7. **Maintainable code**

The goal is not merely to build a functional landing page.

The goal is to reproduce the intended MAGNM experience with **high visual accuracy, fluid motion, and polished 3D interaction.**
