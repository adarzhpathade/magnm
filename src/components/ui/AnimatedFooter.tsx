"use client";

import * as React from "react";
import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/utils/cn";

export interface AnimatedFooterProps {
  leftImage?: string;
  rightImage?: string;
  background?: string;
  charColor?: string;
  hoverColor?: string;
  hoverCharColor?: string;
  asciiChars?: string;
  columns?: number;
  cellSize?: number;
  fontSize?: number;
  parallaxStrength?: number;
  hoverRadius?: number;
  revealOnScroll?: boolean;
  revealed?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const DEFAULT_ASCII_CHARS = "........:::=+xX#0369";
const HIGHLIGHT_LIFETIME = 300;
const CLUSTER_SIZE = 10;
const PARALLAX_EASE = 0.05;

interface Cell {
  col: number;
  row: number;
  char: string;
  highlightEndTime: number;
}

interface Hand {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  cells: Map<string, Cell>;
  cellList: Cell[];
  rows: number;
  columns: number;
  cellSize: number;
  baselineOffset: number;
  direction: 1 | -1;
}

function buildHandCells(
  image: HTMLImageElement,
  columns: number,
  asciiChars: string,
): { rows: number; cells: Map<string, Cell> } {
  const rows = Math.max(
    1,
    Math.round(columns / (image.naturalWidth / image.naturalHeight || 1)),
  );
  const sampler = document.createElement("canvas");
  sampler.width = columns;
  sampler.height = rows;
  const sampleCtx = sampler.getContext("2d");
  const cells = new Map<string, Cell>();
  if (!sampleCtx) return { rows, cells };

  sampleCtx.drawImage(image, 0, 0, columns, rows);
  const pixels = sampleCtx.getImageData(0, 0, columns, rows).data;
  const backgroundCharIndex = asciiChars.lastIndexOf(".");

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const offset = (row * columns + col) * 4;
      const brightness =
        (pixels[offset] * 0.299 +
          pixels[offset + 1] * 0.587 +
          pixels[offset + 2] * 0.114) /
        255;
      const charIndex = Math.min(
        asciiChars.length - 1,
        Math.floor((1 - brightness) * asciiChars.length),
      );
      if (charIndex <= backgroundCharIndex) continue;
      cells.set(`${col},${row}`, {
        col,
        row,
        char: asciiChars[charIndex],
        highlightEndTime: 0,
      });
    }
  }
  return { rows, cells };
}

function highlightCluster(cells: Map<string, Cell>, startCell: Cell) {
  const now = Date.now();
  startCell.highlightEndTime = now + HIGHLIGHT_LIFETIME;
  const steps = Math.floor(Math.random() * CLUSTER_SIZE) + 1;
  const litCells = [startCell];
  let current = startCell;

  for (let step = 0; step < steps; step++) {
    const neighbours: Cell[] = [];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const neighbour = cells.get(`${current.col + dx},${current.row + dy}`);
        if (neighbour && !litCells.includes(neighbour)) neighbours.push(neighbour);
      }
    }
    if (neighbours.length === 0) break;
    const next = neighbours[Math.floor(Math.random() * neighbours.length)];
    next.highlightEndTime = now + HIGHLIGHT_LIFETIME + step * 10;
    litCells.push(next);
    current = next;
  }
}

function getScrollParent(node: HTMLElement | null): HTMLElement | null {
  let el = node?.parentElement ?? null;
  while (el) {
    const overflowY = getComputedStyle(el).overflowY;
    if (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") return el;
    el = el.parentElement;
  }
  return null;
}

export function AnimatedFooter({
  leftImage = "/animated-footer/hand-left.jpg",
  rightImage = "/animated-footer/hand-right.jpg",
  background = "#000000",
  charColor = "#555555",
  hoverColor = "#ffffff",
  hoverCharColor = "#171717",
  asciiChars = DEFAULT_ASCII_CHARS,
  columns = 80,
  cellSize = 20,
  fontSize = 18,
  parallaxStrength = 20,
  hoverRadius = 8,
  revealOnScroll = true,
  revealed,
  className,
  children,
}: AnimatedFooterProps) {
  const rootRef = useRef<HTMLElement>(null);
  const leftWrapRef = useRef<HTMLDivElement>(null);
  const rightWrapRef = useRef<HTMLDivElement>(null);
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);

  const cc = charColor;
  const hc = hoverColor;
  const hcc = hoverCharColor;
  const liveRef = useRef({ charColor: cc, hoverColor: hc, hoverCharColor: hcc, parallaxStrength, hoverRadius });

  useEffect(() => {
    liveRef.current = { charColor: cc, hoverColor: hc, hoverCharColor: hcc, parallaxStrength, hoverRadius };
  }, [cc, hc, hcc, parallaxStrength, hoverRadius]);

  const sig = useMemo(
    () =>
      JSON.stringify({
        leftImage,
        rightImage,
        columns,
        cellSize,
        fontSize,
        asciiChars,
        revealOnScroll,
      }),
    [leftImage, rightImage, columns, cellSize, fontSize, asciiChars, revealOnScroll],
  );

  useEffect(() => {
    const root = rootRef.current;
    const leftWrap = leftWrapRef.current;
    const rightWrap = rightWrapRef.current;
    if (!root || !leftWrap || !rightWrap) return;

    const hands: Hand[] = [];
    const wrappers = [leftWrap, rightWrap];

    const setupHand = (
      image: HTMLImageElement,
      canvas: HTMLCanvasElement,
      direction: 1 | -1,
    ) => {
      const { rows, cells } = buildHandCells(image, columns, asciiChars);
      if (cells.size === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = columns * cellSize * dpr;
      canvas.height = rows * cellSize * dpr;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${fontSize}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      const metrics = ctx.measureText("X");
      const glyphHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      const baselineOffset = cellSize / 2 + glyphHeight / 2 - metrics.actualBoundingBoxDescent;
      hands.push({
        canvas,
        ctx,
        cells,
        cellList: [...cells.values()],
        rows,
        columns,
        cellSize,
        baselineOffset,
        direction,
      });

      if (typeof window !== "undefined") {
        ScrollTrigger.refresh();
      }
    };

    const loadHand = (src: string, canvas: HTMLCanvasElement, direction: 1 | -1) => {
      if (!src) return;
      const image = new Image();
      image.crossOrigin = "anonymous";
      let initialized = false;
      const init = () => {
        if (initialized) return;
        initialized = true;
        setupHand(image, canvas, direction);
      };
      image.onload = init;
      image.src = src;
      if (image.complete && image.naturalWidth) init();
    };

    loadHand(leftImage, leftCanvasRef.current!, 1);
    loadHand(rightImage, rightCanvasRef.current!, -1);

    const renderHand = (hand: Hand, now: number) => {
      const { ctx, cellList, cellSize: cs, baselineOffset, columns: cols, rows } = hand;
      const { charColor: liveCc, hoverColor: liveHc, hoverCharColor: liveHcc } = liveRef.current;
      ctx.clearRect(0, 0, cols * cs, rows * cs);
      for (const cell of cellList) {
        const x = cell.col * cs;
        const y = cell.row * cs;
        const isHighlighted = cell.highlightEndTime > now;
        if (isHighlighted) {
          ctx.fillStyle = liveHc;
          ctx.fillRect(x, y, cs, cs);
        }
        ctx.fillStyle = isHighlighted ? liveHcc : liveCc;
        ctx.fillText(cell.char, x + cs / 2, y + baselineOffset);
      }
    };

    const pointer = { x: 0, y: 0 };
    const drift = { x: 0, y: 0 };
    const curtain = { offset: revealOnScroll ? 125 : 0 };

    const hoverHand = (hand: Hand, clientX: number, clientY: number) => {
      const rect = hand.canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const mouseCol = ((clientX - rect.left) / rect.width) * hand.columns;
      const mouseRow = ((clientY - rect.top) / rect.height) * hand.rows;
      let closest: Cell | null = null;
      let closestDist = Infinity;
      for (const cell of hand.cellList) {
        const dx = mouseCol - cell.col;
        const dy = mouseRow - cell.row;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < closestDist) {
          closestDist = dist;
          closest = cell;
        }
      }
      if (closest && closestDist <= liveRef.current.hoverRadius) {
        highlightCluster(hand.cells, closest);
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      const strength = liveRef.current.parallaxStrength;
      const rect = root.getBoundingClientRect();
      const w = rect.width || 1;
      const h = rect.height || 1;
      pointer.x = ((event.clientX - rect.left) / w - 0.5) * strength * 2;
      pointer.y = ((event.clientY - rect.top) / h - 0.5) * strength * 2;
      for (const hand of hands) hoverHand(hand, event.clientX, event.clientY);
    };

    window.addEventListener("mousemove", onMouseMove);

    let rafId = 0;
    const frame = () => {
      const now = Date.now();
      for (const hand of hands) renderHand(hand, now);

      let targetX = pointer.x;
      let targetY = pointer.y;

      if (window.innerWidth < 768) {
        const time = now * 0.001;
        targetX += Math.sin(time * 0.8) * 12;
        targetY += Math.cos(time * 0.6) * 8;
      }

      drift.x += (targetX - drift.x) * PARALLAX_EASE;
      drift.y += (targetY - drift.y) * PARALLAX_EASE;

      const strength = liveRef.current.parallaxStrength;
      const scale = 1 + (strength * 2) / 200;

      wrappers.forEach((wrapper, i) => {
        const dir = i === 0 ? 1 : -1;
        const revealX = i === 0 ? -curtain.offset : curtain.offset;
        const x = drift.x * dir || 0;
        const y = -drift.y || 0;
        wrapper.style.transform = `translateX(${revealX}%) translate(${x}px, ${y}px) scale(${scale})`;
      });

      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);

    const animateIn = () => {
      gsap.to(curtain, { offset: 0, duration: 1.1, ease: "power3.out", overwrite: true });
    };

    const animateOut = () => {
      gsap.to(curtain, { offset: 125, duration: 0.5, ease: "power2.in", overwrite: true });
    };

    let observer: IntersectionObserver | null = null;
    if (revealed !== undefined) {
      curtain.offset = revealed ? 0 : 125;
    } else if (revealOnScroll) {
      let isRevealed = false;
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && !isRevealed) {
              isRevealed = true;
              animateIn();
            } else if (!entry.isIntersecting && isRevealed) {
              isRevealed = false;
              animateOut();
            }
          }
        },
        { root: getScrollParent(root), threshold: 0.15 },
      );
      observer.observe(root);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      observer?.disconnect();
      gsap.killTweensOf([curtain]);
    };
  }, [sig]);

  const startsHidden = revealed !== undefined ? !revealed : revealOnScroll;
  const offEdge = startsHidden ? 125 : 0;

  return (
    <footer
      ref={rootRef}
      className={cn(
        "relative w-full h-[60vh] min-h-[60vh] overflow-hidden bg-[#000000] flex items-center justify-between",
        className
      )}
      style={{ height: "60vh", backgroundColor: background, containerType: "inline-size" }}
    >
      {/* Animated ASCII Hands Element (Monochromatic theme) */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-between opacity-85 overflow-hidden">
        <div
          ref={leftWrapRef}
          className="relative w-[46%] sm:w-[38%] md:w-[32%] lg:w-[28%] max-w-[420px] will-change-transform select-none"
          style={{ transform: `translateX(-${offEdge}%)` }}
        >
          <canvas ref={leftCanvasRef} className="block h-auto w-full pointer-events-none" />
        </div>
        <div
          ref={rightWrapRef}
          className="relative w-[46%] sm:w-[38%] md:w-[32%] lg:w-[28%] max-w-[420px] will-change-transform select-none"
          style={{ transform: `translateX(${offEdge}%)` }}
        >
          <canvas ref={rightCanvasRef} className="block h-auto w-full pointer-events-none" />
        </div>
      </div>

      {children && (
        <div className="relative z-10 w-full h-full flex flex-col justify-between">
          {children}
        </div>
      )}
    </footer>
  );
}

export default AnimatedFooter;
