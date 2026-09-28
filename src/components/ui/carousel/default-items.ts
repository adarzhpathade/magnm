import { HORIZONTAL_ASPECT } from "./constants";
import type { LiquidGlassCarouselItem } from "./types";

const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1920&h=1080&q=85&auto=format&fit=crop`;

export const liquidGlassCarouselDefaultItems: LiquidGlassCarouselItem[] = [
  { title: "Adarsh'26", src: "/adarsh-26.webp", aspect: HORIZONTAL_ASPECT },
  { title: "Sentinel", src: "/sentinel-terminal.webp", aspect: HORIZONTAL_ASPECT },
  { title: "Adarsh'26", src: "/adarsh-26.webp", aspect: HORIZONTAL_ASPECT },
  { title: "Sentinel", src: "/sentinel-terminal.webp", aspect: HORIZONTAL_ASPECT },
  { title: "Adarsh'26", src: "/adarsh-26.webp", aspect: HORIZONTAL_ASPECT },
  { title: "Sentinel", src: "/sentinel-terminal.webp", aspect: HORIZONTAL_ASPECT },
];
