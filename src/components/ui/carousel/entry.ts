import { gsap } from "gsap";
import { ENTRY } from "./constants";
import type { CarouselState } from "./types";
import type { LayoutEngine } from "./layout";

export function createEntryController(
  state: CarouselState,
  entryOn: boolean,
  layoutEngine: LayoutEngine,
  updateCursor: () => void,
  onEntryDone: (done: boolean) => void
) {
  let hasPlayed = false;

  function playEntry(force = false) {
    if (!entryOn) {
      onEntryDone(true);
      return;
    }
    // Prevent interrupting an already-playing entrance animation mid-flight
    if (state.entryActive) return;
    // Prevent duplicate triggers if already played (eliminates jitter on entry)
    if (hasPlayed && !force) return;
    hasPlayed = true;

    if (state.entryAnim) {
      state.entryAnim.kill();
      state.entryAnim = null;
    }

    state.target = layoutEngine.centerForIndex(
      layoutEngine.nearestIndex(state.scroll)
    );
    state.scroll = state.target;
    state.velocity = 0;
    state.snapped = true;
    layoutEngine.layout();

    const visible: number[] = [];
    for (let k = 0; k < state.lastCenterX.length; k++) {
      if (state.lastCenterX[k] !== undefined) visible.push(k);
    }

    if (visible.length === 0) {
      // Fallback: If no cards are visible yet (e.g. layout pending or offscreen), ensure all are 1
      state.entryActive = false;
      state.entrySettled = false;
      for (let k = 0; k < state.pEntry.length; k++) state.pEntry[k] = 1;
      onEntryDone(true);
      return;
    }

    // Keep offscreen cards at 1, only zero out visible cards that will ripple in
    for (let k = 0; k < state.pEntry.length; k++) state.pEntry[k] = 1;
    visible.forEach((idx) => {
      state.pEntry[idx] = 0;
    });

    state.entryActive = true;
    state.entrySettled = false;
    onEntryDone(false);
    state.focusState.lensFx = 0;
    layoutEngine.layout();

    const tl = gsap.timeline({
      delay: ENTRY.delay,
      onComplete: () => {
        state.entryActive = false;
        state.entrySettled = false;
        for (let k = 0; k < state.pEntry.length; k++) state.pEntry[k] = 1;
        updateCursor();
        state.lastActivity = performance.now();
        onEntryDone(true);
      },
    });
    const half = state.W / 2;
    let maxRiseEnd = 0;
    const riseDuration = ENTRY.riseDuration;

    visible.forEach((idx) => {
      const cx = state.lastCenterX[idx] ?? 0;
      const distFromCenter = Math.abs(cx);
      const normDist = Math.min(1.2, distFromCenter / Math.max(1, half));
      const staggerDelay = normDist * 0.16; // elegant symmetrical center-outward ripple
      const totalTime = staggerDelay + riseDuration;
      if (totalTime > maxRiseEnd) maxRiseEnd = totalTime;

      tl.to(
        state.pEntry,
        {
          [idx]: 1,
          duration: riseDuration,
          ease: ENTRY.riseEase,
        },
        staggerDelay
      );
    });

    tl.to(
      state.focusState,
      { lensFx: 1, duration: ENTRY.lensBloom, ease: ENTRY.lensBloomEase },
      0.08
    );

    tl.call(
      () => {
        onEntryDone(true);
      },
      [],
      Math.min(0.40, maxRiseEnd * 0.48)
    );

    state.entryAnim = tl;
  }

  function resetEntry() {
    if (state.entryAnim) {
      state.entryAnim.kill();
      state.entryAnim = null;
    }
    state.entryActive = false;
    state.entrySettled = false;
    hasPlayed = false;
    for (let k = 0; k < state.pEntry.length; k++) state.pEntry[k] = 1;
    onEntryDone(true);
  }

  return { playEntry, resetEntry };
}
