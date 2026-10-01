"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import "./text-stream.css";

export interface TextStreamProps {
  items?: string[];
  prefix?: string;
  fontSize?: string;
  fontWeight?: number;
  height?: string | number;
  paused?: boolean;
  className?: string;
  style?: React.CSSProperties;
  scroller?: HTMLElement | Window | React.RefObject<HTMLElement | null>;
}

export function TextStream({
  items = [],
  prefix = "ObsidianUI",
  fontSize = "clamp(2rem, 6vw, 4rem)",
  fontWeight = 700,
  height = "100vh",
  scroller,
  paused = false,
  className,
  style,
}: TextStreamProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [copyCount, setCopyCount] = useState(2);
  const metricsRef = useRef({
    currentY: 0,
    distance: 0,
    currentVelocity: 0.6,
    targetVelocity: 0.6,
    lastScrollDirection: 1,
  });
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    const content = contentRef.current;
    const container = containerRef.current;
    if (!track || !content || !container || paused || !items.length) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const baseSpeed = 0.6;
      const maxBoost = 12;
      const scrollTarget =
        (scroller && typeof scroller === "object" && "current" in scroller
          ? scroller.current
          : scroller) ?? (typeof window !== "undefined" ? window : null);
      if (!scrollTarget) return;

      const readScroll = () =>
        scrollTarget === window
          ? window.scrollY
          : (scrollTarget as HTMLElement).scrollTop;
      let lastScrollY = readScroll();

      const startAnimation = () => {
        const distance = content.offsetHeight;
        const containerHeight = container.offsetHeight;
        if (!distance || !containerHeight) return;

        const nextCopyCount = Math.max(
          2,
          Math.ceil(containerHeight / distance) + 2,
        );
        setCopyCount((c) => (c === nextCopyCount ? c : nextCopyCount));
        metricsRef.current.distance = distance;

        metricsRef.current.currentY = gsap.utils.wrap(
          -distance,
          0,
          metricsRef.current.currentY,
        );

        gsap.set(track, { y: metricsRef.current.currentY });
      };

      const tick = (_: number, deltaTime: number) => {
        const { distance } = metricsRef.current;
        if (!distance) return;

        const frameFactor = deltaTime / (1000 / 60);
        metricsRef.current.currentVelocity = gsap.utils.interpolate(
          metricsRef.current.currentVelocity,
          metricsRef.current.targetVelocity,
          0.14,
        );
        metricsRef.current.currentY +=
          metricsRef.current.currentVelocity * frameFactor;

        metricsRef.current.currentY = gsap.utils.wrap(
          -distance,
          0,
          metricsRef.current.currentY,
        );

        gsap.set(track, { y: metricsRef.current.currentY });
      };

      const applyScrollMotion = (delta: number) => {
        if (!delta) return;
        const direction = delta > 0 ? -1 : 1;
        const boost = Math.min(
          maxBoost,
          baseSpeed + Math.pow(Math.abs(delta), 1.2) * 0.08,
        );
        metricsRef.current.lastScrollDirection = direction;
        metricsRef.current.targetVelocity = direction * boost;
        if (scrollTimeoutRef.current !== null) {
          window.clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
          metricsRef.current.targetVelocity =
            metricsRef.current.lastScrollDirection * baseSpeed;
        }, 120);
      };

      const handleWheel = (e: Event) => {
        const we = e as WheelEvent;
        applyScrollMotion(we.deltaY);
      };
      const handleScroll = () => {
        const next = readScroll();
        applyScrollMotion(next - lastScrollY);
        lastScrollY = next;
      };

      startAnimation();
      gsap.ticker.add(tick);

      const ro = new ResizeObserver(startAnimation);
      ro.observe(content);
      ro.observe(container);
      window.addEventListener("resize", startAnimation);
      scrollTarget.addEventListener("wheel", handleWheel, { passive: true });
      scrollTarget.addEventListener("scroll", handleScroll, { passive: true });

      return () => {
        ro.disconnect();
        window.removeEventListener("resize", startAnimation);
        scrollTarget.removeEventListener("wheel", handleWheel);
        scrollTarget.removeEventListener("scroll", handleScroll);
        if (scrollTimeoutRef.current !== null) {
          clearTimeout(scrollTimeoutRef.current);
        }
        gsap.ticker.remove(tick);
      };
    }, containerRef);

    return () => media.revert();
  }, [items, paused, scroller]);

  if (!items.length) return null;

  return (
    <div
      className={cn("obsidian-text-stream font-heading text-foreground", className)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height,
        gap: "0.5rem",
        ...style,
      }}
    >
      <p
        style={{
          fontSize: "clamp(0.65rem, 1.5vw, 0.85rem)",
          fontWeight: 400,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          opacity: 0.4,
          margin: 0,
        }}
      >
        {prefix}
      </p>

      <div
        ref={containerRef}
        className="obsidian-text-stream__viewport"
        style={{
          position: "relative",
          width: "100%",
          flexShrink: 0,
          height: `calc(${typeof fontSize === "string" ? fontSize : fontSize + "px"} * 2.2)`,
          overflow: "hidden",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
          textAlign: "center",
        }}
      >
        <div
          ref={trackRef}
          className="obsidian-text-stream__track"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            display: "flex",
            flexDirection: "column",
            fontSize,
            fontWeight,
            lineHeight: 1.1,
          }}
        >
          {Array.from({ length: copyCount }, (_, copyIndex) => (
            <div
              key={copyIndex}
              ref={copyIndex === 0 ? contentRef : null}
              className="obsidian-text-stream__copy"
              style={{ display: "flex", flexDirection: "column" }}
              aria-hidden={copyIndex > 0}
            >
              {items.map((text, i) => (
                <div
                  key={`${copyIndex}-${i}`}
                  style={{ padding: "6px 0", whiteSpace: "nowrap" }}
                >
                  {text}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TextStream;
