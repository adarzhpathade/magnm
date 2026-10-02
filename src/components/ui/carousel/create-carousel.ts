import { gsap } from "gsap";
import { prefersReducedMotion, REPEATS, HORIZONTAL_ASPECT } from "./constants";
import type {
  CarouselState,
  CreateCarouselOptions,
  LiquidGlassCarouselHandle,
} from "./types";
import { createRendererAndScene } from "./create-renderer";
import { createLayoutEngine } from "./layout";
import { createFocusController } from "./focus";
import { setupInput } from "./input";
import { createEntryController } from "./entry";
import { createAutoScrollController } from "./auto-scroll";

export function createCarousel(
  mount: HTMLElement,
  cursorElement: HTMLElement | null,
  options: CreateCarouselOptions
): LiquidGlassCarouselHandle | null {
  const reduced = prefersReducedMotion();
  const entryOn = options.entry && !reduced;
  const items = options.items;
  if (items.length === 0) return null;

  const W = Math.max(1, mount.clientWidth);
  const H = Math.max(1, mount.clientHeight);
  const panelHFor = (w = W, h = H) => {
    // Keep a clean margin on left and right on mobile/tablet viewports so cards are never edge-to-edge
    const maxCardW = Math.min(options.panelHeight * HORIZONTAL_ASPECT, w * 0.80);
    const hFromW = Math.round(maxCardW / HORIZONTAL_ASPECT);
    const hFromH = Math.round(h * 0.28);
    return Math.max(100, Math.min(options.panelHeight, hFromW, hFromH));
  };
  const PANEL_H = panelHFor(W, H);
  options.onPanelHChange?.(PANEL_H);
  const GAP = options.gap;
  const EASE = reduced ? 0.28 : 0.09;
  const SNAP_EASE = reduced ? 0.22 : 0.05;
  const TOUCH_EASE = 0.22;
  const FRICTION = 0.865;
  const SNAP_IDLE_MS = 120;
  const SHRINK_MAX = 60;
  const SHRINK_ATTACK = 0.25;
  const SHRINK_DECAY = 0.06;

  const autoScrollOption = options.autoScroll ?? true;
  const autoScrollConfig = {
    enabled:
      !reduced &&
      (typeof autoScrollOption === "boolean"
        ? autoScrollOption
        : (autoScrollOption?.delay ?? 0) >= 0),
    interval:
      typeof autoScrollOption === "object" && autoScrollOption.interval
        ? autoScrollOption.interval
        : typeof autoScrollOption === "object" && autoScrollOption.delay
        ? autoScrollOption.delay
        : 3500,
  };

  const totalPoolSize = REPEATS * items.length;

  const state: CarouselState = {
    W,
    H,
    PANEL_H,
    GAP,
    scroll: 0,
    target: 0,
    velocity: 0,
    prevScroll: 0,
    scrollEnergy: 0,
    userInteracted: false,
    lastInput: performance.now(),
    lastActivity: performance.now(),
    snapped: false,
    pendingFocus: null,
    lastCenter: -1,
    dragging: false,
    dragPointerId: null,
    dragPointerType: "mouse",
    dragLastX: 0,
    dragStartX: 0,
    dragStartY: 0,
    touchDirectionDetermined: false,
    isVerticalScroll: false,
    dragDist: 0,
    dragVel: 0,
    dragMoveT: 0,
    suppressClick: false,
    lastPointerX: Number.NaN,
    lastPointerY: Number.NaN,
    lastPointerType: "mouse",
    pointerInside: false,
    overPanel: false,
    hoverPanel: false,
    cursorNow: "",
    focusState: {
      active: false,
      closing: false,
      srcIndex: -1,
      poolIdx: -1,
      lensFx: entryOn ? 0 : 1,
      anim: null,
    },
    drop: new Array(totalPoolSize).fill(0),
    focusScale: 1,
    lastCenterX: new Array(totalPoolSize),
    pEntry: new Array(totalPoolSize).fill(entryOn ? 0 : 1),
    entryActive: false,
    entrySettled: false,
    entryCompleted: !entryOn,
    entryAnim: null,
    lensFxFull: {},
    panelRects: [],
    centeredPanel: null,
    running: true,
    visible: true,
    raf: 0,
  };

  const onTextureLoaded = () => {
    layoutEngine.recomputeTotal();
    if (!state.userInteracted) {
      state.scroll = layoutEngine.centerForIndex(0);
      state.target = state.scroll;
    }
  };

  const threeCtx = createRendererAndScene(
    mount,
    W,
    H,
    options.background,
    reduced,
    items,
    onTextureLoaded
  );

  if (!threeCtx) return null;
  const ctx = threeCtx;

  const layoutEngine = createLayoutEngine(ctx.sources, ctx.pool, state);

  // Initialize scroll to first item
  state.scroll = layoutEngine.centerForIndex(0);
  state.target = state.scroll;

  // eslint-disable-next-line prefer-const
  let focusController: ReturnType<typeof createFocusController>;
  // eslint-disable-next-line prefer-const
  let inputController: ReturnType<typeof setupInput>;
  // eslint-disable-next-line prefer-const
  let entryController: ReturnType<typeof createEntryController>;
  // eslint-disable-next-line prefer-const
  let autoScrollController: ReturnType<typeof createAutoScrollController>;

  focusController = createFocusController(
    state,
    ctx.sources,
    ctx.pool,
    ctx.lensUniforms,
    layoutEngine,
    (on) => inputController.setView(on),
    () => inputController.updateCursor(),
    options.onFocusChange,
    options.onCardsDropped,
    options.onFocusScale
  );

  inputController = setupInput(
    ctx.renderer.domElement,
    cursorElement,
    state,
    layoutEngine,
    () => focusController.openFocus(),
    () => focusController.closeFocus(),
    options.onEntryDone
  );

  entryController = createEntryController(
    state,
    entryOn,
    layoutEngine,
    () => inputController.updateCursor(),
    options.onEntryDone
  );

  autoScrollController = createAutoScrollController(
    state,
    autoScrollConfig,
    layoutEngine,
    () => inputController.inputLocked(),
    options.onAutoScrollProgress
  );

  function tick() {
    if (!state.running) return;
    if (!state.visible || (typeof document !== "undefined" && document.hidden)) {
      state.raf = 0;
      return;
    }

    const now = performance.now();
    autoScrollController.tickAutoScroll(now);

    if (!state.dragging) {
      state.target += state.velocity;
      state.velocity *= FRICTION;
      if (Math.abs(state.velocity) < 0.05) state.velocity = 0;
      if (
        !state.snapped &&
        !state.focusState.active &&
        performance.now() - state.lastInput > SNAP_IDLE_MS
      ) {
        state.target = layoutEngine.centerForIndex(
          layoutEngine.nearestIndex(state.scroll)
        );
        state.snapped = true;
      }
    }

    const follow =
      state.dragging && state.dragPointerType !== "mouse"
        ? TOUCH_EASE
        : state.snapped && !state.pendingFocus
        ? SNAP_EASE
        : EASE;
    state.scroll += (state.target - state.scroll) * follow;
    if (Math.abs(state.target - state.scroll) < 0.05 && state.velocity === 0) {
      state.scroll = state.target;
    }

    const ci = layoutEngine.centerIndex(state.scroll);
    if (ci !== state.lastCenter) {
      state.lastCenter = ci;
      options.onActiveChange(ci);
    }

    const rawSpeed = state.scroll - state.prevScroll;
    state.prevScroll = state.scroll;
    const norm = Math.min(1, Math.abs(rawSpeed) / Math.max(1, SHRINK_MAX));
    const k = norm > state.scrollEnergy ? SHRINK_ATTACK : SHRINK_DECAY;
    state.scrollEnergy += (norm - state.scrollEnergy) * k;

    layoutEngine.layout();
    inputController.refreshHover();

    if (state.pendingFocus && !state.focusState.active) {
      if (Math.abs(state.target - state.scroll) < 0.5) {
        const pf = state.pendingFocus;
        state.pendingFocus = null;
        if (state.centeredPanel && state.centeredPanel.srcIndex === pf.srcIndex) {
          focusController.openFocus();
        }
      }
    }

    ctx.renderer.setRenderTarget(null);
    ctx.renderer.render(ctx.scene, ctx.camera);
    state.raf = requestAnimationFrame(tick);
  }

  function startLoop() {
    if (!state.running || state.raf) return;
    state.raf = requestAnimationFrame(tick);
  }

  startLoop();
  if (!entryOn) {
    options.onEntryDone(true);
  }

  function onResize() {
    state.W = Math.max(1, mount.clientWidth);
    state.H = Math.max(1, mount.clientHeight);
    state.PANEL_H = panelHFor(state.W, state.H);
    options.onPanelHChange?.(state.PANEL_H);
    layoutEngine.recomputeTotal();
    ctx.renderer.setSize(state.W, state.H);
    ctx.camera.left = -state.W / 2;
    ctx.camera.right = state.W / 2;
    ctx.camera.top = state.H / 2;
    ctx.camera.bottom = -state.H / 2;
    ctx.camera.updateProjectionMatrix();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    ctx.renderer.setPixelRatio(ratio);
    ctx.rt.setSize(state.W * ratio, state.H * ratio);
    ctx.lensUniforms.uRes.value.set(state.W * ratio, state.H * ratio);
    if (!state.userInteracted) {
      state.scroll = layoutEngine.centerForIndex(0);
      state.target = state.scroll;
    }
  }

  const resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(mount);

  const intersection = new IntersectionObserver(([entry]) => {
    const box = entry?.boundingClientRect;
    if (!box || (box.width === 0 && box.height === 0)) return;
    state.visible = entry?.isIntersecting ?? true;
    if (state.visible) {
      state.lastActivity = performance.now();
      startLoop();
    }
  }, { threshold: [0, 0.15, 0.5] });
  intersection.observe(mount);

  const onVisibility = () => {
    if (typeof document !== "undefined" && !document.hidden) {
      state.lastActivity = performance.now();
      startLoop();
    }
  };
  if (typeof document !== "undefined") {
    document.addEventListener("visibilitychange", onVisibility);
  }

  function destroy() {
    state.running = false;
    cancelAnimationFrame(state.raf);
    resizeObserver.disconnect();
    intersection.disconnect();
    if (typeof document !== "undefined") {
      document.removeEventListener("visibilitychange", onVisibility);
    }
    inputController.destroy();
    if (state.focusState.anim) state.focusState.anim.kill();
    if (state.entryAnim) state.entryAnim.kill();
    if (cursorElement) gsap.killTweensOf(cursorElement);
    ctx.renderer.dispose();
    ctx.rt.dispose();
    ctx.lensQuad.geometry.dispose();
    ctx.lensMat.dispose();
    ctx.pool.forEach((p) => {
      p.mesh.geometry.dispose();
      p.mat.dispose();
    });
    ctx.sources.forEach((s) => {
      s.tex?.dispose();
    });
    if (ctx.renderer.domElement.parentNode) {
      ctx.renderer.domElement.parentNode.removeChild(
        ctx.renderer.domElement
      );
    }
  }

  return {
    closeFocus: () => focusController.closeFocus(),
    next: () => inputController.step(1),
    previous: () => inputController.step(-1),
    playEntry: (force?: boolean) => {
      entryController.playEntry(force);
    },
    resetEntry: () => {
      entryController.resetEntry();
    },
    destroy,
  };
}
