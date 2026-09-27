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
  function playEntry() {
    if (!entryOn) {
      onEntryDone(true);
      return;
    }
    if (state.entryAnim) state.entryAnim.kill();
    for (let k = 0; k < state.pEntry.length; k++) state.pEntry[k] = 0;
    state.entryActive = true;
    state.entrySettled = false;
    onEntryDone(false);
    state.focusState.lensFx = 0;
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

    const tl = gsap.timeline({ delay: ENTRY.delay });
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

    tl.call(
      () => {
        state.entryActive = false;
        state.entrySettled = false;
        for (let k = 0; k < state.pEntry.length; k++) state.pEntry[k] = 1;
        updateCursor();
        state.lastActivity = performance.now();
      },
      [],
      maxRiseEnd
    );

    state.entryAnim = tl;
  }

  return { playEntry };
}
