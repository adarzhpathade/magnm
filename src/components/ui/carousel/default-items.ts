import { HORIZONTAL_ASPECT } from "./constants";
import type { LiquidGlassCarouselItem } from "./types";

const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1920&h=1080&q=85&auto=format&fit=crop`;

export const liquidGlassCarouselDefaultItems: LiquidGlassCarouselItem[] = [
  { title: "Sentinel Terminal", src: "/sentinel-terminal.webp", aspect: HORIZONTAL_ASPECT },
  { title: "Adarsh 26", src: "/adarsh-26.webp", aspect: HORIZONTAL_ASPECT },
  { title: "Chrono Axis", src: photo("1600585154340-be6161a56a0c"), aspect: HORIZONTAL_ASPECT },
  { title: "Obsidian Core", src: photo("1514906689926-25ba6dcb584b"), aspect: HORIZONTAL_ASPECT },
  { title: "Aetheria Spatial", src: photo("1568557412756-7d219873dd11"), aspect: HORIZONTAL_ASPECT },
  { title: "Neo Protocol", src: photo("1581892805885-73bdd91beff0"), aspect: HORIZONTAL_ASPECT },
  { title: "Vectrum Audio", src: photo("1610846202780-b4d9837371ea"), aspect: HORIZONTAL_ASPECT },
  { title: "Terraform Studio", src: photo("1603786420263-ad59136a7409"), aspect: HORIZONTAL_ASPECT },
];
