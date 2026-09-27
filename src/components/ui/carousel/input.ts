import { gsap } from "gsap";
import { CLICK_SLOP, TOUCH_CLICK_SLOP, FLICK_IDLE_MS } from "./constants";
import type { CarouselState } from "./types";
import type { LayoutEngine } from "./layout";

export interface InputController {
  setView: (on: boolean) => void;
  updateCursor: () => void;
  refreshHover: () => void;
  step: (direction: number) => void;
  inputLocked: () => boolean;
  destroy: () => void;
}

export function setupInput(
  el: HTMLElement,
  cursorElement: HTMLElement | null,
  state: CarouselState,
  layoutEngine: LayoutEngine,
  openFocus: () => void,
  closeFocus: () => void
): InputController {
  const WHEEL = 1.4;
  const DRAG = 1.6;
  const TOUCH_DRAG = 1;

  function panelAtPointer(px: number, py: number) {
    for (const r of state.panelRects) {
      if (px >= r.left && px <= r.right && py >= r.top && py <= r.bottom) {
        return r;
      }
    }
    return null;
  }

  function localPoint(e: { clientX: number; clientY: number }) {
    const rect = el.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  if (cursorElement) {
    gsap.set(cursorElement, {
      xPercent: 20,
      yPercent: 30,
      scale: 0,
      autoAlpha: 0,
    });
  }
  const moveX = cursorElement
    ? gsap.quickTo(cursorElement, "x", { duration: 0.5, ease: "power3.out" })
    : null;
  const moveY = cursorElement
    ? gsap.quickTo(cursorElement, "y", { duration: 0.5, ease: "power3.out" })
    : null;

  function setCursor(v: string) {
    if (v === state.cursorNow) return;
    state.cursorNow = v;
    el.style.cursor = v;
  }

  function updateCursor() {
    if (state.focusState.active || state.entryActive || state.entrySettled) {
      return setCursor("");
    }
    if (state.dragging) return setCursor("grabbing");
    if (!state.hoverPanel) return setCursor("");
    return setCursor("grab");
  }

  function setHover(on: boolean) {
    state.hoverPanel = on;
    setView(on);
  }

  function refreshHover() {
    if (!state.pointerInside || state.lastPointerType !== "mouse") return;
    if (!Number.isFinite(state.lastPointerX)) return;
    if (state.focusState.active) {
      setHover(false);
      return;
    }
    setHover(panelAtPointer(state.lastPointerX, state.lastPointerY) !== null);
  }

  function setView(on: boolean) {
    if (state.entryActive || state.entrySettled) on = false;
    if (state.dragging) on = false;
    if (on === state.overPanel) {
      updateCursor();
      return;
    }
    state.overPanel = on;
    updateCursor();
    if (!cursorElement) return;
    gsap.killTweensOf(cursorElement, "scale,autoAlpha,opacity,visibility");
    gsap.to(cursorElement, {
      scale: on ? 1 : 0,
      autoAlpha: on ? 1 : 0,
      duration: on ? 0.35 : 0.25,
      ease: on ? "power3.out" : "power3.in",
    });
  }

  function inputLocked() {
    return state.focusState.active || state.entryActive || state.entrySettled;
  }

  function onWheel(e: WheelEvent) {
    if (inputLocked()) return;
    const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey;
    if (isHorizontal) {
      e.preventDefault();
      state.userInteracted = true;
      state.pendingFocus = null;
      state.target += (e.shiftKey ? e.deltaY : e.deltaX) * WHEEL;
      state.lastInput = performance.now();
      state.lastActivity = performance.now();
      state.snapped = false;
    }
  }

  function onPointerDown(e: PointerEvent) {
    state.suppressClick = false;
    state.lastActivity = performance.now();
    if (state.focusState.active) return;
    if (inputLocked()) return;
    if (state.dragging) return;
    if (e.button !== 0 && e.pointerType === "mouse") return;
    state.dragging = true;
    state.dragPointerId = e.pointerId;
    state.dragPointerType = e.pointerType || "mouse";
    state.touchDirectionDetermined = false;
    state.isVerticalScroll = false;

    // Capture immediately for mouse. Defer for touch so vertical scrolling is not blocked.
    if (state.dragPointerType === "mouse") {
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* capture is best-effort */
      }
    }

    const p = localPoint(e);
    state.dragStartX = p.x;
    state.dragStartY = p.y;
    state.dragLastX = p.x;
    state.lastPointerX = p.x;
    state.lastPointerY = p.y;
    state.dragDist = 0;
    state.dragVel = 0;
    state.dragMoveT = performance.now();
    setView(false);
    state.velocity = 0;
    state.pendingFocus = null;
    state.userInteracted = true;
    state.snapped = false;
    state.lastInput = state.dragMoveT;
  }

  function onPointerMove(e: PointerEvent) {
    const p = localPoint(e);
    const moveDist = Number.isFinite(state.lastPointerX)
      ? Math.hypot(p.x - state.lastPointerX, p.y - state.lastPointerY)
      : 0;
    if (moveDist > 2) {
      state.lastActivity = performance.now();
    }
    if (state.dragging && e.pointerId === state.dragPointerId) {
      // For touch, distinguish horizontal swipe vs vertical scroll
      if (state.dragPointerType === "touch" && !state.touchDirectionDetermined) {
        const totalDx = Math.abs(p.x - state.dragStartX);
        const totalDy = Math.abs(p.y - state.dragStartY);
        if (totalDx > 6 || totalDy > 6) {
          state.touchDirectionDetermined = true;
          if (totalDy > totalDx) {
            // Vertical page scroll detected — release drag and let browser scroll naturally
            state.isVerticalScroll = true;
            state.dragging = false;
            state.dragPointerId = null;
            return;
          } else {
            // Horizontal swipe detected — capture pointer for carousel motion
            try {
              el.setPointerCapture(e.pointerId);
            } catch {
              /* capture is best-effort */
            }
          }
        } else {
          state.lastPointerX = p.x;
          state.lastPointerY = p.y;
          return;
        }
      }

      if (state.isVerticalScroll) return;

      const sens = state.dragPointerType === "mouse" ? DRAG : TOUCH_DRAG;
      const dx = p.x - state.dragLastX;
      state.dragLastX = p.x;
      state.dragDist += Math.abs(dx);
      state.target -= dx * sens;
      state.dragVel = state.dragVel * 0.6 + -dx * sens * 0.4;
      state.dragMoveT = performance.now();
      state.lastInput = state.dragMoveT;
      state.snapped = false;
    }
    state.lastPointerX = p.x;
    state.lastPointerY = p.y;
    state.lastPointerType = e.pointerType || "mouse";
    state.pointerInside = true;
    if (e.pointerType !== "mouse") return;
    if (moveX) moveX(p.x);
    if (moveY) moveY(p.y);
    if (state.focusState.active) {
      setHover(false);
      return;
    }
    setHover(panelAtPointer(p.x, p.y) !== null);
  }

  function onPointerUp(e?: PointerEvent) {
    state.lastActivity = performance.now();
    if (!state.dragging) return;
    if (e && state.dragPointerId !== null && e.pointerId !== state.dragPointerId) {
      return;
    }
    state.dragging = false;
    if (state.dragPointerId !== null) {
      try {
        el.releasePointerCapture(state.dragPointerId);
      } catch {
        /* already released */
      }
      state.dragPointerId = null;
    }
    state.velocity =
      performance.now() - state.dragMoveT > FLICK_IDLE_MS ? 0 : state.dragVel;
    state.dragVel = 0;
    state.lastInput = performance.now();
    state.snapped = false;
    state.suppressClick =
      state.dragDist >
      (state.dragPointerType === "mouse" ? CLICK_SLOP : TOUCH_CLICK_SLOP);
    if (state.dragPointerType === "mouse") {
      setHover(panelAtPointer(state.lastPointerX, state.lastPointerY) !== null);
    } else {
      updateCursor();
    }
  }

  function onEnter(e: PointerEvent) {
    state.pointerInside = true;
    state.lastPointerType = e.pointerType || "mouse";
  }

  function onLeave() {
    state.pointerInside = false;
    setHover(false);
  }

  function onClick(e: MouseEvent) {
    state.lastActivity = performance.now();
    if (state.suppressClick) {
      state.suppressClick = false;
      return;
    }
    if (state.focusState.active) {
      const p = localPoint(e);
      const hit = panelAtPointer(p.x, p.y);
      if (!hit || hit.poolIdx !== state.focusState.poolIdx) {
        closeFocus();
      }
      return;
    }
    if (inputLocked()) return;
    const p = localPoint(e);
    const hit = panelAtPointer(p.x, p.y);
    if (!hit) return;
    if (state.centeredPanel && hit.poolIdx === state.centeredPanel.poolIdx) {
      state.pendingFocus = null;
      openFocus();
      return;
    }
    state.userInteracted = true;
    state.velocity = 0;
    state.target = layoutEngine.centerForIndex(
      layoutEngine.nearestIndex(state.scroll + hit.centerX)
    );
    state.snapped = true;
    state.pendingFocus = { srcIndex: hit.srcIndex };
    setView(false);
  }

  function step(direction: number) {
    if (inputLocked()) return;
    state.userInteracted = true;
    state.velocity = 0;
    state.pendingFocus = null;
    state.target = layoutEngine.centerForIndex(
      layoutEngine.nearestIndex(state.scroll) + direction
    );
    state.snapped = true;
    state.lastInput = performance.now();
    state.lastActivity = performance.now();
  }

  el.addEventListener("wheel", onWheel, { passive: false });
  el.addEventListener("pointerdown", onPointerDown);
  el.addEventListener("pointermove", onPointerMove);
  el.addEventListener("pointerup", onPointerUp);
  el.addEventListener("pointercancel", onPointerUp);
  el.addEventListener("pointerenter", onEnter);
  el.addEventListener("pointerleave", onLeave);
  el.addEventListener("click", onClick);

  function destroy() {
    el.removeEventListener("wheel", onWheel);
    el.removeEventListener("pointerdown", onPointerDown);
    el.removeEventListener("pointermove", onPointerMove);
    el.removeEventListener("pointerup", onPointerUp);
    el.removeEventListener("pointercancel", onPointerUp);
    el.removeEventListener("pointerenter", onEnter);
    el.removeEventListener("pointerleave", onLeave);
    el.removeEventListener("click", onClick);
  }

  return {
    setView,
    updateCursor,
    refreshHover,
    step,
    inputLocked,
    destroy,
  };
}
