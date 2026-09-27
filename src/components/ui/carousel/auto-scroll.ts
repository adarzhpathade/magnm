import type { CarouselState } from "./types";
import type { LayoutEngine } from "./layout";

export interface AutoScrollConfig {
  enabled: boolean;
  interval: number;
}

export function createAutoScrollController(
  state: CarouselState,
  config: AutoScrollConfig,
  layoutEngine: LayoutEngine,
  inputLocked: () => boolean,
  onAutoScrollProgress?: (progress: number) => void
) {
  function autoAdvance() {
    if (inputLocked() || state.dragging) return;
    state.velocity = 0;
    state.pendingFocus = null;
    state.target = layoutEngine.centerForIndex(
      layoutEngine.nearestIndex(state.scroll) + 1
    );
    state.snapped = true;
  }

  function tickAutoScroll(now: number) {
    const isSettledAtTarget = Math.abs(state.target - state.scroll) < 1.0;
    const canAutoAdvance =
      config.enabled &&
      !state.focusState.active &&
      !state.focusState.closing &&
      !state.dragging &&
      !state.entryActive &&
      !state.entrySettled;

    if (!canAutoAdvance || !isSettledAtTarget) {
      state.lastActivity = now;
    }

    const elapsed = Math.max(0, now - state.lastActivity);
    const progress =
      canAutoAdvance && isSettledAtTarget
        ? Math.min(1, elapsed / config.interval)
        : 0;

    onAutoScrollProgress?.(progress);

    if (canAutoAdvance && isSettledAtTarget && elapsed >= config.interval) {
      state.lastActivity = now;
      autoAdvance();
    }
  }

  return {
    autoAdvance,
    tickAutoScroll,
  };
}
