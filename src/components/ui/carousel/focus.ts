import { gsap } from "gsap";
import { FOCUS, LENS_FX_KEYS } from "./constants";
import type { CarouselState, PoolItem, Source } from "./types";
import type { LayoutEngine } from "./layout";

export interface FocusController {
  openFocus: () => void;
  closeFocus: () => void;
}

export function createFocusController(
  state: CarouselState,
  sources: Source[],
  pool: PoolItem[],
  lensUniforms: Record<string, { value: any }>,
  layoutEngine: LayoutEngine,
  setView: (on: boolean) => void,
  updateCursor: () => void,
  onFocusChange: (open: boolean) => void,
  onCardsDropped?: (dropped: boolean) => void,
  onFocusScale?: (scale: number) => void
): FocusController {
  function openFocus() {
    if (state.focusState.active || !state.centeredPanel) return;
    state.focusState.closing = false;
    state.lastActivity = performance.now();
    const src = sources[state.centeredPanel.srcIndex];
    if (!src?.tex) return;

    state.focusState.active = true;
    state.focusState.srcIndex = state.centeredPanel.srcIndex;
    const focusPoolIdx = state.centeredPanel.poolIdx;
    state.focusState.poolIdx = focusPoolIdx;
    state.target = layoutEngine.centerForIndex(
      layoutEngine.nearestIndex(state.scroll)
    );

    const focusX = state.lastCenterX[focusPoolIdx] || 0;
    const others = pool
      .map((_, idx) => ({ idx, x: state.lastCenterX[idx] }))
      .filter((o) => o.idx !== focusPoolIdx && o.x !== undefined)
      .map((o) => ({ idx: o.idx, dist: Math.abs((o.x ?? 0) - focusX) }))
      .sort((a, b) => a.dist - b.dist);

    let rank = 0;
    let prevDist = -1;
    const ranked = others.map((o) => {
      if (prevDist >= 0 && o.dist - prevDist > 1) rank += 1;
      prevDist = o.dist;
      return { idx: o.idx, rank };
    });

    for (const key of LENS_FX_KEYS) {
      if (lensUniforms[key]) {
        state.lensFxFull[key] = lensUniforms[key].value;
      }
    }

    if (state.focusState.anim) state.focusState.anim.kill();
    const scaleProxy = { v: state.focusScale };
    const tl = gsap.timeline();
    tl.to(
      state.focusState,
      { lensFx: 0, duration: FOCUS.lensFade, ease: "power3.out" },
      0
    );
    tl.to(
      scaleProxy,
      {
        v: FOCUS.centerScale,
        duration: FOCUS.focusDuration,
        ease: FOCUS.focusEase,
        onUpdate() {
          state.focusScale = scaleProxy.v;
          onFocusScale?.(scaleProxy.v);
        },
      },
      0
    );
    let maxCardDropTime = 0;
    ranked.forEach((o) => {
      const dropStart = o.rank * FOCUS.stagger;
      const dropEnd = dropStart + FOCUS.cardDuration;
      if (dropEnd > maxCardDropTime) maxCardDropTime = dropEnd;
      tl.to(
        state.drop,
        { [o.idx]: 1, duration: FOCUS.cardDuration, ease: FOCUS.cardEase },
        dropStart
      );
    });
    // As soon as the other cards leave the screen, notify caller to transform typography
    tl.call(
      () => {
        onCardsDropped?.(true);
      },
      [],
      Math.max(0.42, maxCardDropTime * 0.68)
    );
    state.focusState.anim = tl;
    setView(false);
    onFocusChange(true);
  }

  function closeFocus() {
    if (!state.focusState.active || state.focusState.closing) return;
    state.focusState.closing = true;
    state.lastActivity = performance.now();
    if (state.focusState.anim) state.focusState.anim.kill();

    const focusX = state.lastCenterX[state.focusState.poolIdx] || 0;
    const others = pool
      .map((_, idx) => ({ idx, x: state.lastCenterX[idx] }))
      .filter((o) => o.x !== undefined && (state.drop[o.idx] || 0) > 0)
      .map((o) => ({ idx: o.idx, dist: Math.abs((o.x ?? 0) - focusX) }))
      .sort((a, b) => b.dist - a.dist);

    let rank = 0;
    let prevDist = -1;
    const ranked = others.map((o) => {
      if (prevDist >= 0 && prevDist - o.dist > 1) rank += 1;
      prevDist = o.dist;
      return { idx: o.idx, rank };
    });

    onFocusChange(false);
    onCardsDropped?.(false);
    const scaleProxy = { v: state.focusScale };
    const tl = gsap.timeline({
      onComplete: () => {
        state.focusState.active = false;
        state.focusState.closing = false;
        state.focusState.srcIndex = -1;
        state.lastActivity = performance.now();
        updateCursor();
      },
    });
    tl.to(
      state.focusState,
      { lensFx: 1, duration: FOCUS.lensFade * 0.8, ease: "power3.inOut" },
      0
    );
    tl.to(
      scaleProxy,
      {
        v: 1,
        duration: FOCUS.focusDuration * 0.85,
        ease: FOCUS.focusEase,
        onUpdate() {
          state.focusScale = scaleProxy.v;
          onFocusScale?.(scaleProxy.v);
        },
      },
      0
    );
    ranked.forEach((o) => {
      tl.to(
        state.drop,
        {
          [o.idx]: 0,
          duration: FOCUS.cardDuration * 0.85,
          ease: FOCUS.cardEase,
        },
        o.rank * FOCUS.stagger * 0.7
      );
    });
    state.focusState.anim = tl;
  }

  return {
    openFocus,
    closeFocus,
  };
}
