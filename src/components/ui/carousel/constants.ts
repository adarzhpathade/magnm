export const HORIZONTAL_ASPECT = 16 / 9;

export const LENS = {
  sizeX: 0.565,
  sizeY: 1,
  posX: 0.5,
  posY: 0.5,
  rotation: 65,
  spin: 0,
  zoom: 0,
  dispersion: 11,
  blur: 0,
  glow: 4.2,
  whiteGlow: 0.24,
  novaSize: 12,
  blueRing: 6,
  ringRadius: 0.49,
  ringWidth: 0.014,
  shimmer: true,
  shimmerFreq: 12,
  shimmerSpeed: 3.5,
  shimmerDepth: 0.12,
  rimStart: 0.578,
  rimTangential: 0.6,
  rimInward: 0,
  rimFreq1: 2,
  rimFreq2: 1,
  blueColor: "#ffffff",
  rimLine: 1.4,
  rimLinePos: 0.488,
  rimLineWidth: 0.003,
  vignette: 0,
  vignetteSize: 0.3,
  samples: 16,
};

export const FOCUS = {
  cardDuration: 0.7,
  focusDuration: 0.9,
  cardEase: "power4.out",
  focusEase: "power3.out",
  stagger: 0.06,
  dropDist: 1.4,
  centerScale: 1.18,
  lensFade: 0.85,
};

export const ENTRY = {
  delay: 0.04,
  riseDuration: 0.85,
  riseEase: "power3.out",
  lensBloom: 0.6,
  lensBloomEase: "power2.inOut",
};

export const LENS_FX_KEYS = [
  "uDispersion",
  "uBlueRing",
  "uRimLine",
  "uVignette",
  "uZoom",
  "uRimTangential",
  "uRimInward",
] as const;

export const REPEATS = 4;
export const CLICK_SLOP = 6;
export const TOUCH_CLICK_SLOP = 12;
export const FLICK_IDLE_MS = 90;

export function at<T>(list: readonly T[], index: number): T {
  const item = list[index];
  if (item === undefined) {
    throw new Error("Index out of range.");
  }
  return item;
}

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function hexToNumber(background: string) {
  const value = background.trim();
  if (value.startsWith("#") && (value.length === 7 || value.length === 4)) {
    const hex =
      value.length === 4
        ? `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`
        : value;
    const parsed = Number.parseInt(hex.slice(1), 16);
    return Number.isFinite(parsed) ? parsed : 0xcccccc;
  }
  return 0xcccccc;
}
