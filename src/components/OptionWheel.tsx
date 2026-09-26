'use client';

import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
  type CSSProperties,
} from 'react';

type Side = 'left' | 'right';

export interface OptionWheelHandle {
  setTarget: (target: number) => void;
  /** Bypass internal easing — set position directly for scroll-driven mode */
  setPositionDirect: (value: number) => void;
  getTarget: () => number;
}

export interface OptionWheelProps {
  items?: string[];
  defaultSelected?: number;
  onChange?: (index: number, item: string) => void;
  textColor?: string;
  activeColor?: string;
  side?: Side;
  fontSize?: number;
  spacing?: number;
  curve?: number;
  tilt?: number;
  blur?: number;
  fade?: number;
  minOpacity?: number;
  smoothing?: number;
  inset?: number;
  loop?: boolean;
  draggable?: boolean;
  soundUrl?: string;
  soundVolume?: number;
  disableInternalWheel?: boolean;
  className?: string;
}

interface WheelConfig {
  count: number;
  items: string[];
  rowH: number;
  curve: number;
  tilt: number;
  blur: number;
  fade: number;
  minOpacity: number;
  side: Side;
  loop: boolean;
  smoothing: number;
  draggable: boolean;
  soundUrl: string;
  soundVolume: number;
  disableInternalWheel: boolean;
}

const DEFAULT_ITEMS = [
  'Strategy & Direction',
  'Digital Products & Websites',
  '3D & Motion Design',
  'AI Systems & Interfaces',
  'Brand Identity & Systems',
  'Creative Engineering',
];

export const OptionWheel = forwardRef<OptionWheelHandle, OptionWheelProps>(
  function OptionWheel(
    {
      items = DEFAULT_ITEMS,
      defaultSelected = 0,
      onChange,
      textColor = 'rgba(23, 23, 23, 0.28)',
      activeColor = '#171717',
      side = 'left',
      fontSize = 2.85,
      spacing = 1.4,
      curve = 0.82,
      tilt = 5,
      blur = 1.4,
      fade = 0.28,
      minOpacity = 0.06,
      smoothing = 40,
      inset = 14,
      loop = false,
      draggable = true,
      soundUrl = '/audio/hover-sound.mp3',
      soundVolume = 0.5,
      disableInternalWheel = false,
      className = '',
    },
    ref
  ) {
    const rootRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const posRef = useRef(defaultSelected);
    const targetRef = useRef(defaultSelected);
    const rafRef = useRef<number | null>(null);
    const lastRef = useRef(0);
    const cfgRef = useRef<WheelConfig>({} as WheelConfig);
    const onChangeRef = useRef(onChange);
    const selectedRef = useRef(defaultSelected);
    const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const dragRef = useRef<{ y: number; start: number; id: number } | null>(null);
    const dragMovedRef = useRef(false);
    const lastTickRef = useRef(0);
    const [selectedIndex, setSelectedIndex] = useState(defaultSelected);
    const [isDragging, setIsDragging] = useState(false);
    const mountedAtRef = useRef<number>(0);

    useEffect(() => {
      mountedAtRef.current = performance.now();
    }, []);

    const remPx =
      typeof window !== 'undefined'
        ? parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
        : 16;

    onChangeRef.current = onChange;
    cfgRef.current = {
      count: items.length,
      items,
      rowH: Math.max(fontSize * spacing * remPx, 1),
      curve,
      tilt,
      blur,
      fade,
      minOpacity,
      side,
      loop,
      smoothing,
      draggable,
      soundUrl,
      soundVolume,
      disableInternalWheel,
    };

    // Single rAF loop that eases the wheel position toward its target
    const runFrame = useCallback((now: number) => {
      const dt = Math.min((now - lastRef.current) / 1000, 0.05);
      lastRef.current = now;
      const cfg = cfgRef.current;
      const tau = Math.max(cfg.smoothing, 1) / 1000;
      const k = 1 - Math.exp(-dt / tau);

      const target = targetRef.current;
      const cur = posRef.current;
      let next = cur + (target - cur) * k;
      const settled = Math.abs(target - next) < 0.001;
      if (settled) next = target;
      posRef.current = next;

      const els = itemRefs.current;
      const n = cfg.count;
      const mirror = cfg.side === 'right' ? -1 : 1;
      const tiltRad = (cfg.tilt * Math.PI) / 180;
      const R = tiltRad > 0.0005 ? cfg.rowH / tiltRad : 0;
      for (let i = 0; i < n; i++) {
        const el = els[i];
        if (!el) continue;
        let d = i - next;
        if (cfg.loop && n > 1) {
          d = ((d % n) + n) % n;
          if (d > n / 2) d -= n;
        }
        const dist = Math.abs(d);
        let x = 0;
        let y = d * cfg.rowH;
        let rot = 0;
        if (R > 0) {
          const ang = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, d * tiltRad));
          y = R * Math.sin(ang);
          x = -mirror * R * (1 - Math.cos(ang)) * cfg.curve;
          rot = (mirror * ang * 180) / Math.PI;
        }
        el.style.transform = `translate(${x.toFixed(2)}px, calc(${y.toFixed(2)}px - 50%)) rotate(${rot.toFixed(3)}deg)`;
        el.style.opacity = String(Math.max(cfg.minOpacity, 1 - dist * cfg.fade));
        el.style.filter = cfg.blur > 0 ? `blur(${(dist * cfg.blur).toFixed(2)}px)` : 'none';
        el.style.setProperty('--ow-p', Math.max(0, 1 - Math.min(dist, 1)).toFixed(4));
      }

      rafRef.current = settled ? null : requestAnimationFrame(runFrame);
    }, []);

    const startLoop = useCallback(() => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
      }
      lastRef.current = performance.now();
      rafRef.current = requestAnimationFrame(runFrame);
    }, [runFrame]);

    const audioCtxRef = useRef<AudioContext | null>(null);
    const audioBufferRef = useRef<AudioBuffer | null>(null);

    // Preload and decode audio with Web Audio API for zero latency
    useEffect(() => {
      if (typeof window === 'undefined') return;
      const url = soundUrl || '/audio/hover-sound.mp3';
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          if (!audioCtxRef.current) {
            audioCtxRef.current = new AudioCtx();
          }
          if (url) {
            fetch(url)
              .then((res) => (res.ok ? res.arrayBuffer() : null))
              .then((buf) =>
                buf && audioCtxRef.current ? audioCtxRef.current.decodeAudioData(buf) : null
              )
              .then((decoded) => {
                if (decoded) audioBufferRef.current = decoded;
              })
              .catch(() => {});
          }
        }
      } catch {
        // AudioContext unavailable
      }
    }, [soundUrl]);

    // Optional tick on selection change, throttled so fast scrolling can't spam
    const playTick = useCallback(() => {
      // Suppress tick sound during initial mount and section entrance grace window (first 800ms)
      if (performance.now() - mountedAtRef.current < 800) return;
      const { soundVolume } = cfgRef.current;
      const now = performance.now();
      if (now - lastTickRef.current < 45) return;
      lastTickRef.current = now;

      try {
        if (!audioCtxRef.current && typeof window !== 'undefined') {
          const AudioCtx =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          if (AudioCtx) audioCtxRef.current = new AudioCtx();
        }
        const ctx = audioCtxRef.current;
        if (ctx) {
          if (ctx.state === 'suspended') {
            ctx.resume();
          }

          if (audioBufferRef.current) {
            const source = ctx.createBufferSource();
            source.buffer = audioBufferRef.current;
            const gainNode = ctx.createGain();
            gainNode.gain.value = Math.min(Math.max(soundVolume ?? 0.5, 0), 1);
            source.connect(gainNode);
            gainNode.connect(ctx.destination);
            source.start(0);
            return;
          }

          // Tactile mechanical selector tick (synthesized) if buffer not yet loaded
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          const t = ctx.currentTime;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(650, t);
          osc.frequency.exponentialRampToValueAtTime(140, t + 0.022);
          gainNode.gain.setValueAtTime(Math.min(Math.max(soundVolume ?? 0.5, 0), 1) * 0.3, t);
          gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.022);
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.022);
          return;
        }
      } catch {
        // Fallback to standard HTMLAudioElement
        const url = cfgRef.current.soundUrl || '/audio/hover-sound.mp3';
        if (url) {
          try {
            const snd = new Audio(url);
            snd.volume = Math.min(Math.max(soundVolume, 0), 1);
            snd.play().catch(() => {});
          } catch {
            // ignore
          }
        }
      }
    }, []);

    const applyTarget = useCallback(
      (value: number, snap: boolean) => {
        const cfg = cfgRef.current;
        let v = value;
        if (!cfg.loop) v = Math.min(Math.max(v, 0), Math.max(cfg.count - 1, 0));
        if (snap) v = Math.round(v);
        targetRef.current = v;
        const idx = ((Math.round(v) % cfg.count) + cfg.count) % cfg.count;
        if (idx !== selectedRef.current) {
          selectedRef.current = idx;
          setSelectedIndex(idx);
          onChangeRef.current?.(idx, cfg.items[idx]);
          playTick();
        }
        startLoop();
      },
      [startLoop, playTick]
    );

    // Expose handle to parent so page scroll can drive target directly
    useImperativeHandle(
      ref,
      () => ({
        setTarget: (value: number) => {
          applyTarget(value, false);
        },
        /** Set position directly — no internal easing, renders items synchronously.
         *  Use this for scroll-driven mode where GSAP scrub already provides smoothing. */
        setPositionDirect: (value: number) => {
          const cfg = cfgRef.current;
          let v = value;
          if (!cfg.loop) v = Math.min(Math.max(v, 0), Math.max(cfg.count - 1, 0));
          targetRef.current = v;
          posRef.current = v;

          // Fire onChange if selection changed
          const idx = ((Math.round(v) % cfg.count) + cfg.count) % cfg.count;
          if (idx !== selectedRef.current) {
            selectedRef.current = idx;
            setSelectedIndex(idx);
            onChangeRef.current?.(idx, cfg.items[idx]);
            playTick();
          }

          // Render items synchronously — no rAF loop needed
          const els = itemRefs.current;
          const n = cfg.count;
          const mirror = cfg.side === 'right' ? -1 : 1;
          const tiltRad = (cfg.tilt * Math.PI) / 180;
          const R = tiltRad > 0.0005 ? cfg.rowH / tiltRad : 0;
          for (let i = 0; i < n; i++) {
            const el = els[i];
            if (!el) continue;
            let d = i - v;
            if (cfg.loop && n > 1) {
              d = ((d % n) + n) % n;
              if (d > n / 2) d -= n;
            }
            const dist = Math.abs(d);
            let x = 0;
            let y = d * cfg.rowH;
            let rot = 0;
            if (R > 0) {
              const ang = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, d * tiltRad));
              y = R * Math.sin(ang);
              x = -mirror * R * (1 - Math.cos(ang)) * cfg.curve;
              rot = (mirror * ang * 180) / Math.PI;
            }
            el.style.transform = `translate(${x.toFixed(2)}px, calc(${y.toFixed(2)}px - 50%)) rotate(${rot.toFixed(3)}deg)`;
            el.style.opacity = String(Math.max(cfg.minOpacity, 1 - dist * cfg.fade));
            el.style.filter = cfg.blur > 0 ? `blur(${(dist * cfg.blur).toFixed(2)}px)` : 'none';
            el.style.setProperty('--ow-p', Math.max(0, 1 - Math.min(dist, 1)).toFixed(4));
          }
        },
        getTarget: () => targetRef.current,
      }),
      [applyTarget, playTick]
    );

    // Wheel / touchpad scrolling (only attached if disableInternalWheel is false)
    useEffect(() => {
      if (disableInternalWheel) return;
      const el = rootRef.current;
      if (!el) return;
      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        const cfg = cfgRef.current;
        const delta = e.deltaMode === 1 ? e.deltaY * 24 : e.deltaY;
        const step = Math.max(-1, Math.min(1, delta / cfg.rowH));
        applyTarget(targetRef.current + step, false);
        if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
        wheelTimerRef.current = setTimeout(() => applyTarget(targetRef.current, true), 140);
      };
      el.addEventListener('wheel', onWheel, { passive: false });
      return () => {
        el.removeEventListener('wheel', onWheel);
        if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      };
    }, [applyTarget, disableInternalWheel]);

    const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
      if (!cfgRef.current.draggable) return;
      dragRef.current = { y: e.clientY, start: targetRef.current, id: e.pointerId };
      dragMovedRef.current = false;
      setIsDragging(true);
    }, []);

    const handlePointerMove = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current;
        if (!drag) return;
        const dy = e.clientY - drag.y;
        if (!dragMovedRef.current && Math.abs(dy) > 4) {
          dragMovedRef.current = true;
          rootRef.current?.setPointerCapture(drag.id);
        }
        if (dragMovedRef.current) applyTarget(drag.start - dy / cfgRef.current.rowH, false);
      },
      [applyTarget]
    );

    const handlePointerEnd = useCallback(() => {
      if (!dragRef.current) return;
      dragRef.current = null;
      setIsDragging(false);
      if (dragMovedRef.current) applyTarget(targetRef.current, true);
    }, [applyTarget]);

    const handleItemClick = useCallback(
      (index: number) => {
        if (dragMovedRef.current) return;
        const cfg = cfgRef.current;
        const cur = targetRef.current;
        let d = index - (((cur % cfg.count) + cfg.count) % cfg.count);
        if (cfg.loop && cfg.count > 1) {
          if (d > cfg.count / 2) d -= cfg.count;
          else if (d < -cfg.count / 2) d += cfg.count;
        }
        applyTarget(cur + d, true);
      },
      [applyTarget]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        let delta: number | null = null;
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') delta = -1;
        else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') delta = 1;
        if (delta == null) return;
        e.preventDefault();
        applyTarget(Math.round(targetRef.current) + delta, true);
      },
      [applyTarget]
    );

    useEffect(() => {
      applyTarget(targetRef.current, false);
    }, [items, fontSize, spacing, curve, tilt, blur, fade, minOpacity, side, loop, smoothing, applyTarget]);

    useEffect(
      () => () => {
        if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      },
      []
    );

    return (
      <div
        ref={rootRef}
        role="listbox"
        tabIndex={0}
        aria-label="Option wheel"
        className={`relative h-full w-full select-none overflow-hidden outline-none [touch-action:none] ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }${className ? ` ${className}` : ''}`}
        style={
          {
            '--ow-text-color': textColor,
            '--ow-active-color': activeColor,
            '--ow-font-size': `${fontSize}rem`,
            '--ow-inset': `${inset}px`,
          } as CSSProperties
        }
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onKeyDown={handleKeyDown}
      >
        {items.map((label, index) => (
          <div
            key={`${label}-${index}`}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            role="option"
            aria-selected={selectedIndex === index}
            className={`absolute top-1/2 cursor-pointer whitespace-nowrap leading-none will-change-[transform,opacity,filter] [font-size:var(--ow-font-size)] tracking-[-0.02em] ${
              side === 'right'
                ? 'right-[var(--ow-inset)] origin-right'
                : 'left-[var(--ow-inset)] origin-left'
            } ${selectedIndex === index ? 'font-normal' : 'font-light'}`}
            style={{
              fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif',
              color:
                'color-mix(in srgb, var(--ow-active-color) calc(var(--ow-p, 0) * 100%), var(--ow-text-color))',
            }}
            onClick={() => handleItemClick(index)}
          >
            {label}
          </div>
        ))}
      </div>
    );
  }
);

export default OptionWheel;
