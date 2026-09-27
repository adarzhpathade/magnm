import { at, FOCUS, REPEATS } from "./constants";
import type { CarouselState, PoolItem, Source } from "./types";

export interface LayoutEngine {
  slotWidth: (srcIndex: number) => number;
  recomputeTotal: () => void;
  centerForIndex: (idx: number) => number;
  nearestIndex: (value: number) => number;
  centerIndex: (value: number) => number;
  layout: () => void;
  getTotalWidth: () => number;
}

export function createLayoutEngine(
  sources: Source[],
  pool: PoolItem[],
  state: CarouselState
): LayoutEngine {
  let offsets: number[] = [];
  let totalWidth = 0;

  function slotWidth(srcIndex: number) {
    return at(sources, srcIndex).aspect * state.PANEL_H + state.GAP;
  }

  function recomputeTotal() {
    offsets = [];
    let acc = 0;
    for (let i = 0; i < sources.length; i++) {
      offsets.push(acc);
      acc += slotWidth(i);
    }
    totalWidth = acc;
  }

  function centerForIndex(idx: number) {
    const N = sources.length;
    const loop = Math.floor(idx / N);
    const s = ((idx % N) + N) % N;
    return at(offsets, s) + slotWidth(s) / 2 - state.GAP / 2 + loop * totalWidth;
  }

  function nearestIndex(value: number) {
    if (!totalWidth) return 0;
    const N = sources.length;
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < N; i++) {
      const center = at(offsets, i) + slotWidth(i) / 2 - state.GAP / 2;
      const k = Math.round((value - center) / totalWidth);
      const dist = Math.abs(center + k * totalWidth - value);
      if (dist < bestDist) {
        bestDist = dist;
        best = i + k * N;
      }
    }
    return best;
  }

  function centerIndex(value: number) {
    if (!totalWidth) return 0;
    let bestI = 0;
    let bestDist = Infinity;
    for (let i = 0; i < sources.length; i++) {
      const center = at(offsets, i) + slotWidth(i) / 2 - state.GAP / 2;
      const k = Math.round((value - center) / totalWidth);
      const dist = Math.abs(center + k * totalWidth - value);
      if (dist < bestDist) {
        bestDist = dist;
        bestI = i;
      }
    }
    return bestI;
  }

  function layout() {
    state.panelRects = [];
    state.centeredPanel = null;
    let centeredDist = Infinity;
    const half = state.W / 2;
    const buffer = state.PANEL_H;

    pool.forEach((p, poolIdx) => {
      const rep = Math.floor(poolIdx / sources.length);
      const i = p.srcIndex;
      const src = at(sources, i);
      const slotCenterInLoop = at(offsets, i) + slotWidth(i) / 2 - state.GAP / 2;
      let x = slotCenterInLoop - state.scroll;
      x = ((x % totalWidth) + totalWidth) % totalWidth;
      x += (rep - Math.floor(REPEATS / 2)) * totalWidth;
      if (x > half + totalWidth) x -= totalWidth * REPEATS;

      const centerX = x;
      if (centerX < -half - buffer || centerX > half + buffer) {
        p.mesh.visible = false;
        state.lastCenterX[poolIdx] = undefined;
        return;
      }
      state.lastCenterX[poolIdx] = centerX;

      const shrink = 1 - 0.25 * state.scrollEnergy;
      const h = state.PANEL_H * shrink;
      const wPx = src.aspect * state.PANEL_H * shrink;

      if (src.tex && !p.bound) {
        p.mat.map = src.tex;
        p.mat.color.set(0xffffff);
        p.mat.needsUpdate = true;
        p.bound = true;
      }

      let y = 0;
      const isFocused = state.focusState.active && state.focusState.poolIdx === poolIdx;
      const d = state.drop[poolIdx] || 0;
      let drawW = wPx;
      let drawH = h;
      if (isFocused) {
        drawW = wPx * state.focusScale;
        drawH = h * state.focusScale;
      } else if (d > 0) {
        y = -d * state.H * FOCUS.dropDist;
      }

      p.mesh.visible = true;
      const finalX = centerX;
      let finalY = y;
      const finalW = drawW;
      const finalH = drawH;

      if (state.entryActive || state.entrySettled) {
        const pe = state.pEntry[poolIdx] !== undefined ? state.pEntry[poolIdx] : 1;
        const riseDist = Math.min(state.H * 0.35, 140);
        finalY = y - (1 - pe) * riseDist;
        p.mat.opacity = Math.max(0, Math.min(1, pe));
      } else {
        p.mat.opacity = 1;
      }

      p.mesh.position.set(finalX, finalY, 0);
      p.mesh.scale.set(finalW, finalH, 1);

      const sx = centerX + state.W / 2;
      const sy = state.H / 2 - finalY;
      state.panelRects.push({
        left: sx - drawW / 2,
        right: sx + drawW / 2,
        top: sy - drawH / 2,
        bottom: sy + drawH / 2,
        poolIdx,
        srcIndex: i,
        centerX,
      });

      if (Math.abs(centerX) < centeredDist) {
        centeredDist = Math.abs(centerX);
        state.centeredPanel = { srcIndex: i, centerX, wPx, h, poolIdx };
      }
    });
  }

  // Initial computation
  recomputeTotal();

  return {
    slotWidth,
    recomputeTotal,
    centerForIndex,
    nearestIndex,
    centerIndex,
    layout,
    getTotalWidth: () => totalWidth,
  };
}
