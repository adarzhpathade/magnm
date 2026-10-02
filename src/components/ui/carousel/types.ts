import type { CSSProperties } from "react";
import type * as THREE from "three";
import type { gsap } from "gsap";

export interface LiquidGlassCarouselItem {
  src: string;
  title: string;
  desc?: string;
  liveUrl?: string;
  /** Width / height. Measured from the image when omitted. */
  aspect?: number;
}

export interface LiquidGlassCarouselProps {
  items?: LiquidGlassCarouselItem[];
  /** Target panel height in CSS pixels. Scaled down when the container is shorter. */
  panelHeight?: number;
  gap?: number;
  background?: string;
  /** Play the rise-and-grow intro. Ignored when the user prefers reduced motion. */
  entry?: boolean;
  /** Automatically scroll through cards when idle. Default true (3.5s delay). */
  autoScroll?: boolean | { delay?: number; interval?: number };
  className?: string;
  style?: CSSProperties;
  heading?: string;
  description?: string;
  showTitle?: boolean;
  showCounter?: boolean;
  onActiveChange?: (index: number) => void;
  onFocusChange?: (focused: boolean) => void;
}

export type LiquidGlassCarouselHandle = {
  closeFocus: () => void;
  next: () => void;
  previous: () => void;
  playEntry: (force?: boolean) => void;
  resetEntry?: () => void;
  destroy: () => void;
};

export type PanelRect = {
  left: number;
  right: number;
  top: number;
  bottom: number;
  poolIdx: number;
  srcIndex: number;
  centerX: number;
};

export type PoolItem = {
  mesh: THREE.Mesh;
  mat: THREE.MeshBasicMaterial;
  srcIndex: number;
  bound: boolean;
};

export type Source = {
  tex: THREE.Texture | null;
  aspect: number;
  locked: boolean;
};

export interface CreateCarouselOptions {
  items: LiquidGlassCarouselItem[];
  panelHeight: number;
  gap: number;
  background: string;
  entry: boolean;
  autoScroll?: boolean | { delay?: number; interval?: number };
  onActiveChange: (index: number) => void;
  onFocusChange: (open: boolean) => void;
  onCardsDropped?: (dropped: boolean) => void;
  onEntryDone: (done: boolean) => void;
  onPanelHChange?: (panelH: number) => void;
  onAutoScrollProgress?: (progress: number) => void;
  onFocusScale?: (scale: number) => void;
}

export interface FocusState {
  active: boolean;
  closing: boolean;
  srcIndex: number;
  poolIdx: number;
  lensFx: number;
  anim: gsap.core.Timeline | null;
}

export interface CenteredPanel {
  srcIndex: number;
  centerX: number;
  wPx: number;
  h: number;
  poolIdx: number;
}

export interface CarouselState {
  W: number;
  H: number;
  PANEL_H: number;
  GAP: number;
  scroll: number;
  target: number;
  velocity: number;
  prevScroll: number;
  scrollEnergy: number;
  userInteracted: boolean;
  lastInput: number;
  lastActivity: number;
  snapped: boolean;
  pendingFocus: { srcIndex: number } | null;
  lastCenter: number;
  dragging: boolean;
  dragPointerId: number | null;
  dragPointerType: string;
  dragLastX: number;
  dragStartX: number;
  dragStartY: number;
  touchDirectionDetermined: boolean;
  isVerticalScroll: boolean;
  dragDist: number;
  dragVel: number;
  dragMoveT: number;
  suppressClick: boolean;
  lastPointerX: number;
  lastPointerY: number;
  lastPointerType: string;
  pointerInside: boolean;
  overPanel: boolean;
  hoverPanel: boolean;
  cursorNow: string;
  focusState: FocusState;
  drop: number[];
  focusScale: number;
  lastCenterX: Array<number | undefined>;
  pEntry: number[];
  entryActive: boolean;
  entrySettled: boolean;
  entryCompleted: boolean;
  entryAnim: gsap.core.Timeline | null;
  lensFxFull: Record<string, number>;
  panelRects: PanelRect[];
  centeredPanel: CenteredPanel | null;
  running: boolean;
  visible: boolean;
  raf: number;
}
