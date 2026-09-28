"use client";

import { gsap } from "gsap";
import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import {
  WebGLErrorBoundary,
  WebGLFallback,
} from "@/components/ui/webgl-error-boundary";
import {
  createCarousel,
  type LiquidGlassCarouselHandle,
  type LiquidGlassCarouselItem,
  liquidGlassCarouselDefaultItems,
} from "./carousel";

export type { LiquidGlassCarouselHandle, LiquidGlassCarouselItem };
export { liquidGlassCarouselDefaultItems };

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

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Infinite image row with a liquid-glass WebGL lens. Give the container an explicit height. */
export const LiquidGlassCarousel = forwardRef<
  LiquidGlassCarouselHandle,
  LiquidGlassCarouselProps
>(function LiquidGlassCarousel(
  {
    items = liquidGlassCarouselDefaultItems,
    panelHeight = 230,
    gap = 14,
    background = "#cccccc",
    entry = true,
    autoScroll = true,
    heading = "Our Projects",
    description = "A curated archive of selected spatial systems, tactile digital interfaces, and interactive brand experiences engineered with precision.",
    className,
    style,
    showTitle = true,
    showCounter = true,
    onActiveChange,
    onFocusChange,
  },
  ref,
) {
  const mountRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<LiquidGlassCarouselHandle | null>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const revealPlayedRef = useRef(false);
  const [active, setActive] = useState(0);
  const [focused, setFocused] = useState(false);
  const [entryDone, setEntryDone] = useState(true);
  const [failed, setFailed] = useState(false);
  const [panelH, setPanelH] = useState(panelHeight);
  const progressValRef = useRef(0);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const progressContainerRef = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const liveId = useId();
  const current = items[active] ?? items[0];
  const onActiveChangeRef = useRef(onActiveChange);
  const onFocusChangeRef = useRef(onFocusChange);
  onActiveChangeRef.current = onActiveChange;
  onFocusChangeRef.current = onFocusChange;

  useImperativeHandle(
    ref,
    () => ({
      closeFocus: () => engineRef.current?.closeFocus(),
      next: () => engineRef.current?.next(),
      previous: () => engineRef.current?.previous(),
      playEntry: (force?: boolean) => engineRef.current?.playEntry(force),
      resetEntry: () => engineRef.current?.resetEntry?.(),
      destroy: () => engineRef.current?.destroy(),
    }),
    [],
  );

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || items.length === 0) return;

    const engine = createCarousel(mount, cursorRef.current, {
      items,
      panelHeight,
      gap,
      background,
      entry,
      autoScroll,
      onActiveChange: (index) => {
        setActive(index);
        onActiveChangeRef.current?.(index);
      },
      onFocusChange: (open) => {
        setFocused(open);
        onFocusChangeRef.current?.(open);
      },
      onEntryDone: setEntryDone,
      onPanelHChange: (h) => setPanelH(h),
      onAutoScrollProgress: (progress) => {
        progressValRef.current = progress;
        if (progressFillRef.current) {
          progressFillRef.current.style.transform = `scaleX(${progress})`;
        }
      },
    });
    if (!engine) {
      setFailed(true);
      return;
    }
    engineRef.current = engine;

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [items, panelHeight, gap, background, entry, autoScroll]);

  useEffect(() => {
    const title = titleRef.current;
    const counter = counterRef.current;
    if (!title && !counter) return;
    const reduced = prefersReducedMotion();
    if (title) gsap.set(title, { xPercent: -50 });
    if (counter) gsap.set(counter, { xPercent: -50 });

    if (!entryDone && entry && !reduced) {
      if (title) gsap.set(title, { autoAlpha: 0, filter: "blur(14px)" });
      if (counter) gsap.set(counter, { autoAlpha: 0, filter: "blur(14px)" });
      revealPlayedRef.current = false;
      return;
    }

    const y = focused ? window.innerHeight * -0.05 : 0;
    if (entryDone && !focused && !revealPlayedRef.current) {
      revealPlayedRef.current = true;
      if (title) {
        gsap.fromTo(
          title,
          { autoAlpha: 0, filter: "blur(12px)", y: 8 },
          {
            autoAlpha: 1,
            filter: "blur(0px)",
            y: 0,
            duration: reduced ? 0 : 0.55,
            ease: "power2.out",
          },
        );
      }
      if (counter) {
        gsap.fromTo(
          counter,
          { autoAlpha: 0, filter: "blur(12px)", y: 10 },
          {
            autoAlpha: 1,
            filter: "blur(0px)",
            y: 0,
            duration: reduced ? 0 : 0.6,
            ease: "power2.out",
            delay: reduced ? 0 : 0.04,
          },
        );
      }
      return;
    }

    if (title) {
      gsap.to(title, {
        y,
        autoAlpha: 1,
        duration: reduced ? 0 : 0.35,
        ease: "power3.out",
      });
    }
    if (counter) {
      gsap.to(counter, {
        autoAlpha: focused ? 0 : 1,
        duration: reduced ? 0 : 0.35,
        ease: "power3.out",
      });
    }
  }, [focused, entryDone, entry]);

  const prevActiveRef = useRef(active);
  useEffect(() => {
    if (!revealPlayedRef.current) {
      prevActiveRef.current = active;
      return;
    }
    if (prevActiveRef.current === active) return;
    prevActiveRef.current = active;

    const title = titleRef.current;
    if (!title || prefersReducedMotion()) return;

    gsap.fromTo(
      title,
      { filter: "blur(8px)", opacity: 0.3, y: -3 },
      { filter: "blur(0px)", opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
    );
  }, [active]);

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      engineRef.current?.next();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      engineRef.current?.previous();
    } else if (event.key === "Escape") {
      event.preventDefault();
      engineRef.current?.closeFocus();
    }
  };

  return (
    <div
      className={cn(
        "relative h-full min-h-[420px] w-full overflow-hidden outline-none select-none",
        className,
      )}
      style={{ background, color: "#171717", ...style }}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-labelledby={labelId}
      onKeyDown={onKeyDown}
      onClick={(e) => {
        if (!focused) return;
        if ((e.target as HTMLElement).closest("button")) return;
        const canvas = mountRef.current?.querySelector("canvas");
        if (e.target !== canvas) {
          engineRef.current?.closeFocus();
        }
      }}
    >
      <p id={labelId} className="sr-only">
        Liquid glass project carousel
      </p>
      <p id={liveId} className="sr-only" aria-live="polite">
        {current?.title ?? ""}, {pad(active + 1)} of {pad(items.length)}
        {focused ? ", focused" : ""}
      </p>

      <WebGLErrorBoundary
        fallback={
          <WebGLFallback
            className="absolute inset-0"
            message="This carousel needs WebGL, which is unavailable in this browser."
          />
        }
      >
        {failed ? (
          <WebGLFallback
            className="absolute inset-0"
            message="This carousel needs WebGL, which is unavailable in this browser."
          />
        ) : (
          <div ref={mountRef} className="absolute inset-0" />
        )}
      </WebGLErrorBoundary>

      {showTitle && (
        <p
          ref={titleRef}
          className="pointer-events-none absolute left-1/2 z-10 m-0 text-center text-[14px] sm:text-[15px] md:text-[16px] font-normal tracking-[-0.01em] text-[#171717] whitespace-nowrap select-none will-change-[filter,opacity,transform] px-3 py-1"
          style={{
            bottom: `calc(50% + ${panelH / 2}px + 14px)`,
          }}
        >
          {current?.title}
        </p>
      )}

      {Boolean(autoScroll) && (
        <div
          ref={progressContainerRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 transition-opacity duration-300 select-none max-w-[76px] sm:max-w-[110px] lg:max-w-[280px]"
          style={{
            top: `calc(50% + ${panelH / 2}px + 12px)`,
            width: Math.round(panelH * (current?.aspect || 16 / 9)),
            opacity: focused ? 0 : 1,
          }}
        >
          <div className="relative h-[1px] w-full rounded-full bg-[#171717]/15 overflow-hidden">
            <div
              ref={progressFillRef}
              className="absolute inset-y-0 left-0 w-full bg-[#171717] origin-left will-change-transform"
              style={{ transform: `scaleX(${progressValRef.current})` }}
            />
          </div>
        </div>
      )}
      <div
        ref={counterRef}
        className="pointer-events-none absolute left-1/2 z-10 m-0 text-center flex flex-col items-center gap-2 sm:gap-2.5 select-none px-4 w-full max-w-[92vw] will-change-[filter,opacity,transform] lg:!top-auto lg:bottom-[7.5%]"
        style={{
          top: `calc(50% + ${panelH / 2}px + 36px)`,
        }}
      >
        <h2
          style={{ fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif' }}
          className="font-normal text-[28px] sm:text-[34px] md:text-5xl lg:text-[4.2rem] xl:text-[4.8rem] tracking-[-0.035em] sm:tracking-[-0.04em] leading-tight sm:leading-none text-[#171717] whitespace-nowrap"
        >
          {heading || "Our Projects"}
        </h2>
        <p className="font-sans text-[13px] sm:text-[14px] md:text-[15px] font-normal tracking-[-0.015em] text-[#171717]/70 max-w-[340px] sm:max-w-[480px] md:max-w-[620px] text-center leading-relaxed select-none">
          {description || "A curated archive of selected spatial systems, tactile digital interfaces, and interactive brand experiences engineered with precision."}
        </p>
      </div>

      <div
        ref={cursorRef}
        className="pointer-events-none absolute left-0 top-0 z-20 text-[13px] font-medium text-black mix-blend-exclusion"
      >
        View
      </div>

      <button
        type="button"
        onClick={() => engineRef.current?.closeFocus()}
        aria-label="Close focused project"
        className="absolute right-[4%] top-[4.5%] z-20 text-[13px] font-medium text-black mix-blend-exclusion transition-opacity duration-300 cursor-pointer"
        style={{
          opacity: focused ? 1 : 0,
          pointerEvents: focused ? "auto" : "none",
        }}
      >
        Close
      </button>
    </div>
  );
});
export default LiquidGlassCarousel;
