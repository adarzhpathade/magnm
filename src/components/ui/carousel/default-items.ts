import { HORIZONTAL_ASPECT } from "./constants";
import type { LiquidGlassCarouselItem } from "./types";

const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1920&h=1080&q=85&auto=format&fit=crop`;

export const liquidGlassCarouselDefaultItems: LiquidGlassCarouselItem[] = [
  {
    title: "Cero Terminal",
    desc: "We have created the official command interface and digital experience for Cero Terminal, showcasing high-density telemetry and open-source systems.",
    liveUrl: "https://cero-magnm.vercel.app/",
    src: "/mockup/CERO Cross-Platform Download Studio.webp",
    aspect: HORIZONTAL_ASPECT,
  },
  {
    title: "Adarsh'26",
    desc: "We have created a cinematic, scroll-driven digital portfolio blending Three.js WebGL scenes, master GSAP timelines, and tactile spring physics.",
    liveUrl: "https://adrz-26.vercel.app/",
    src: "/mockup/Adarsh'26 Mockup.webp",
    aspect: HORIZONTAL_ASPECT,
  },
  {
    title: "Mirach Aerospace",
    desc: "We have created a defence deep-tech aerospace platform engineered for tactical and logistical autonomous unmanned aerial systems featuring edge-computed AI.",
    liveUrl: "https://mirach-aerospace.vercel.app/",
    src: "/mockup/Mirach Drone Intelligence Studio Mockup.webp",
    aspect: HORIZONTAL_ASPECT,
  },
  {
    title: "Cero Terminal",
    desc: "We have created the official command interface and digital experience for Cero Terminal, showcasing high-density telemetry and open-source systems.",
    liveUrl: "https://cero-magnm.vercel.app/",
    src: "/mockup/CERO Cross-Platform Download Studio.webp",
    aspect: HORIZONTAL_ASPECT,
  },
  {
    title: "Adarsh'26",
    desc: "We have created a cinematic, scroll-driven digital portfolio blending Three.js WebGL scenes, master GSAP timelines, and tactile spring physics.",
    liveUrl: "https://adrz-26.vercel.app/",
    src: "/mockup/Adarsh'26 Mockup.webp",
    aspect: HORIZONTAL_ASPECT,
  },
  {
    title: "Mirach Aerospace",
    desc: "We have created a defence deep-tech aerospace platform engineered for tactical and logistical autonomous unmanned aerial systems featuring edge-computed AI.",
    liveUrl: "https://mirach-aerospace.vercel.app/",
    src: "/mockup/Mirach Drone Intelligence Studio Mockup.webp",
    aspect: HORIZONTAL_ASPECT,
  },
];
