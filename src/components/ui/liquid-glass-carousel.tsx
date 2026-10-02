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
import { motion, AnimatePresence } from "motion/react";
import BlurText from "@/components/BlurText";
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
import { chimeSynth } from "@/lib/chime-synth";

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
  const descRef = useRef<HTMLDivElement>(null);
  const revealPlayedRef = useRef(false);
  const [active, setActive] = useState(0);
  const [focused, setFocused] = useState(false);
  const [cardsDropped, setCardsDropped] = useState(false);
  const [entryDone, setEntryDone] = useState(() => !entry || prefersReducedMotion());
  const [failed, setFailed] = useState(false);
  const [panelH, setPanelH] = useState(panelHeight);
  const focusScaleRef = useRef(1);
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
        if (!open) setCardsDropped(false);
        onFocusChangeRef.current?.(open);
      },
      onCardsDropped: (dropped) => {
        setCardsDropped(dropped);
      },
      onEntryDone: setEntryDone,
      onPanelHChange: (h) => setPanelH(h),
      onAutoScrollProgress: (progress) => {
        progressValRef.current = progress;
        if (progressFillRef.current) {
          progressFillRef.current.style.transform = `scaleX(${progress})`;
        }
      },
      onFocusScale: (scale) => {
        focusScaleRef.current = scale;
        // Per-frame DOM update: position title above the scaled card
        const pH = panelHeight;
        const scaledHalf = (pH * scale) / 2;
        const baseHalf = pH / 2;
        const titleEl = titleRef.current;
        if (titleEl) {
          const extraLift = scaledHalf - baseHalf;
          titleEl.style.bottom = `calc(50% + ${baseHalf}px + 14px)`;
          titleEl.style.transform = `translateX(-50%) translateY(-${extraLift}px)`;
        }
        // Per-frame DOM update: position description below the scaled card
        const descEl = descRef.current;
        if (descEl) {
          descEl.style.top = `calc(50% + ${scaledHalf}px + 14px)`;
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
    if (title) {
      // Don't use gsap xPercent — inline transform handles centering via onFocusScale
      gsap.set(title, { clearProps: "transform" });
      title.style.transform = `translateX(-50%) translateY(0px)`;
    }
    if (counter) gsap.set(counter, { xPercent: -50 });

    if (!entryDone && entry && !reduced) {
      if (title) gsap.set(title, { autoAlpha: 0, filter: "blur(14px)" });
      if (counter) gsap.set(counter, { autoAlpha: 0, filter: "blur(14px)" });
      revealPlayedRef.current = false;
      return;
    }

    if (entryDone && !focused && !revealPlayedRef.current) {
      revealPlayedRef.current = true;
      if (title) {
        gsap.fromTo(
          title,
          { autoAlpha: 0, filter: "blur(12px)" },
          {
            autoAlpha: 1,
            filter: "blur(0px)",
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
        autoAlpha: 1,
        duration: reduced ? 0 : 0.35,
        ease: "power3.out",
      });
      // Reset transform when unfocusing (scale callback won't fire at scale=1)
      if (!focused) {
        title.style.transform = `translateX(-50%) translateY(0px)`;
      }
    }
    if (counter) {
      gsap.to(counter, {
        autoAlpha: focused ? 0 : 1,
        filter: focused ? "blur(10px)" : "blur(0px)",
        duration: reduced ? 0 : 0.35,
        ease: "power3.out",
      });
    }
  }, [focused, entryDone, entry, panelH]);

  const prevFocusedRef = useRef(focused);
  useEffect(() => {
    if (prevFocusedRef.current !== focused) {
      if (focused) {
        chimeSynth.playCardClick();
      }
      prevFocusedRef.current = focused;
    }
  }, [focused]);

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
      { filter: "blur(8px)", opacity: 0.3 },
      { filter: "blur(0px)", opacity: 1, duration: 0.3, ease: "power2.out" }
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

  const isDetail = focused && cardsDropped;

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
        if (
          (e.target as HTMLElement).closest("button") ||
          (e.target as HTMLElement).closest("a")
        )
          return;
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

      {/* Top Heading above card: retained as it is */}
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

      {/* Project Description docked directly on bottom of the focused card */}
      <AnimatePresence>
        {isDetail && (
          <motion.div
            ref={descRef}
            key={`detail-desc-${current?.title}`}
            initial={{ opacity: 0, filter: "blur(14px)", y: 6 }}
            animate={{
              opacity: 1,
              filter: "blur(0px)",
              y: 0,
              transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
            }}
            exit={{
              opacity: 0,
              filter: "blur(10px)",
              y: 6,
              transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
            }}
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 z-10 flex flex-col items-center select-none px-4 w-full max-w-[380px] sm:max-w-[480px] md:max-w-[560px] will-change-[filter,opacity,transform]"
            style={{
              top: `calc(50% + ${(panelH * focusScaleRef.current) / 2}px + 14px)`,
            }}
          >
            <BlurText
              key={`desc-${current?.title}`}
              text={current?.desc || ""}
              animateBy="words"
              direction="none"
              randomize={true}
              delay={16}
              startDelay={0}
              stepDuration={0.16}
              trigger={true}
              className="font-sans text-[13px] sm:text-[14px] md:text-[14.5px] font-normal tracking-[-0.015em] text-[#171717]/80 text-center leading-relaxed select-none justify-center"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Section Heading: "Our Projects" & overview description in unfocused mode */}
      <div
        ref={counterRef}
        className="pointer-events-none absolute bottom-[6.5%] sm:bottom-[8%] md:bottom-[9%] left-1/2 z-10 m-0 text-center flex flex-col items-center gap-1.5 sm:gap-2.5 select-none px-4 max-w-[90vw] will-change-[filter,opacity,transform]"
      >
        <h2
          style={{ fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif' }}
          className="font-normal text-3xl sm:text-4xl md:text-5xl lg:text-[3.6rem] xl:text-[4.2rem] tracking-[-0.04em] leading-none text-[#171717]"
        >
          {heading || "Our Projects"}
        </h2>
        <p className="font-sans text-[13px] sm:text-[14px] md:text-[15px] font-normal tracking-[-0.015em] text-[#171717]/65 max-w-[460px] text-center leading-relaxed select-none">
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
