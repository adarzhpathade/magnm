'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(SplitText);
}

const SCROLL_PER_PX = 1.0;
const LERP_FACTOR = 0.08;

const DRAG_LERP_FACTOR = 0.22;
const MOMENTUM_FRICTION = 0.92;
const MIN_MOMENTUM = 0.1;
const MOBILE_BREAKPOINT = 640;
const TABLET_BREAKPOINT = 1025;
const SLIDER_BOTTOM_OFFSET = 36;

const REDUCED_MOTION_LERP_FACTOR = 1;
const REDUCED_MOTION_FADE_DURATION = 0.18;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;

const lerp = (a: number, b: number, n: number): number => a + (b - a) * n;

export interface ZoomSliderItem {
  number: string;
  src: string;
  title: string;
  desc: string;
  category?: string;
  year?: string;
}

export interface ZoomSliderHandle {
  setScrollProgress: (progress: number) => void;
  setTargetOffset: (offset: number) => void;
  getActiveIndex: () => number;
}

export interface ZoomSliderCompProps {
  sliderData?: ZoomSliderItem[];
  title?: string;
  subheading?: string;
  scaleOnHover?: boolean;
  textOnHover?: boolean;
  size?: number;
  easeScrollPercentage?: number;
  enableWindowWheel?: boolean;
  onActiveIndexChange?: (index: number) => void;
}

export const ZoomSliderComp = forwardRef<ZoomSliderHandle, ZoomSliderCompProps>(
  (
    {
      sliderData = DEFAULT_SLIDER_DATA,
      title,
      subheading,
      scaleOnHover = true,
      textOnHover = true,
      size = 1,
      easeScrollPercentage = 100,
      enableWindowWheel = false,
      onActiveIndexChange,
    },
    ref
  ) => {
    const images = sliderData;

    const containerRef = useRef<HTMLDivElement | null>(null);
    const stripRef = useRef<HTMLDivElement | null>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const imageWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
    const textRefs = useRef<(HTMLDivElement | null)[]>([]);

    const [viewportWidth, setViewportWidth] = useState(1440);
    const [viewportHeight, setViewportHeight] = useState(900);
    const [reduceMotion, setReduceMotion] = useState(false);

    const isMobile = viewportWidth < MOBILE_BREAKPOINT;
    const isTablet =
      viewportWidth >= MOBILE_BREAKPOINT && viewportWidth < TABLET_BREAKPOINT;

    const resolvedSize = Math.max(0.5, Number(size) || 1);
    const resolvedEaseScrollPercentage = Math.max(
      20,
      Number(easeScrollPercentage) || 100
    );
    const cardWidthMin = (isMobile ? 75 : 190) * resolvedSize;
    const cardWidthMax = (isMobile ? 260 : isTablet ? 500 : 680) * resolvedSize;
    const cardHeightMax = isMobile
      ? Math.round(viewportHeight * 0.52 * resolvedSize)
      : Math.round(viewportHeight * 0.70 * resolvedSize);
    const cardHeightMin = (isMobile ? 80 : 50) * resolvedSize;
    const cardStep = cardWidthMax;

    const stateRef = useRef({
      current: 0,
      target: 0,
      raf: null as number | null,
      isDragging: false,
      lastX: 0,
      lastY: 0,
      velocity: 0,
    });
    const [activeIndex, setActiveIndex] = useState(0);
    const announcedIndexRef = useRef(0);

    useImperativeHandle(ref, () => ({
      setScrollProgress: (progress: number) => {
        const totalDistance = Math.max(0, (images.length - 1) * cardStep);
        stateRef.current.target = progress * totalDistance;
      },
      setTargetOffset: (offset: number) => {
        stateRef.current.target = offset;
      },
      getActiveIndex: () => announcedIndexRef.current,
    }));

    useEffect(() => {
      const onResize = () => {
        setViewportWidth(window.innerWidth);
        setViewportHeight(window.innerHeight);
      };

      onResize();
      window.addEventListener('resize', onResize);

      return () => window.removeEventListener('resize', onResize);
    }, []);

    useEffect(() => {
      const mediaQuery = window.matchMedia?.(
        '(prefers-reduced-motion: reduce)'
      );

      const syncReducedMotion = (
        event: MediaQueryList | MediaQueryListEvent
      ) => {
        setReduceMotion(
          'matches' in event ? event.matches : prefersReducedMotion()
        );
      };

      if (!mediaQuery) return;

      syncReducedMotion(mediaQuery);
      mediaQuery.addEventListener('change', syncReducedMotion);
      return () => mediaQuery.removeEventListener('change', syncReducedMotion);
    }, []);

    const positionCards = useCallback(
      (offset: number) => {
        if (!stripRef.current) return;

        const cards = Array.from(stripRef.current.children) as HTMLElement[];
        const count = images.length;

        if (!count) return;

        const loopWidth = count * cardStep;
        const viewportWidthValue = window.innerWidth;
        const viewportHeightValue = window.innerHeight;
        const bottom = viewportHeightValue - SLIDER_BOTTOM_OFFSET;
        const easingDistance =
          2 * viewportWidthValue * (resolvedEaseScrollPercentage / 100);

        const mapVtoX = (value: number) => {
          if (value <= 0) return 0;
          if (value >= easingDistance) return value - easingDistance / 2;
          return (value * value) / (2 * easingDistance);
        };

        const normalizedOffset =
          ((offset % loopWidth) + loopWidth) % loopWidth;
        const startIndex = Math.floor(normalizedOffset / cardStep);
        const fractionalOffset = (normalizedOffset % cardStep) / cardStep;

        for (let index = 0; index < count; index += 1) {
          const cardIndex = (startIndex + index) % count;
          const visualOffset = (index - fractionalOffset) * cardStep;
          const currentX = mapVtoX(visualOffset);
          const nextX = mapVtoX(visualOffset + cardStep);
          const visualWidth = nextX - currentX;
          const scale = visualWidth / cardWidthMax;
          const cardHeight =
            cardHeightMin + scale * (cardHeightMax - cardHeightMin);
          const y = bottom - cardHeight;

          if (!cards[cardIndex]) continue;

          cards[cardIndex].style.transform = `translate(${currentX}px, ${y}px)`;

          const imageWrap = imageWrapRefs.current[cardIndex];

          if (!imageWrap) continue;

          imageWrap.style.width = `${visualWidth}px`;
          imageWrap.style.height = `${cardHeight}px`;
        }
      },
      [
        cardHeightMax,
        cardHeightMin,
        cardStep,
        cardWidthMax,
        images.length,
        resolvedEaseScrollPercentage,
      ]
    );

    useEffect(() => {
      if (!images.length) return;

      const state = stateRef.current;
      const loopWidth = images.length * cardStep;

      const tick = () => {
        if (
          !reduceMotion &&
          !state.isDragging &&
          Math.abs(state.velocity) > MIN_MOMENTUM
        ) {
          state.target += state.velocity;
          state.velocity *= MOMENTUM_FRICTION;
        } else if (!state.isDragging) {
          state.velocity = 0;
        }

        const lerpFactor = reduceMotion
          ? REDUCED_MOTION_LERP_FACTOR
          : state.isDragging
            ? DRAG_LERP_FACTOR
            : LERP_FACTOR;
        state.current = lerp(state.current, state.target, lerpFactor);

        if (Math.abs(state.current - state.target) < 0.01) {
          const shift = Math.round(state.current / loopWidth) * loopWidth;
          state.current -= shift;
          state.target -= shift;
        }

        positionCards(state.current);

        if (images.length) {
          const normalizedOffset =
            ((state.current % loopWidth) + loopWidth) % loopWidth;
          const nextIndex =
            Math.floor(normalizedOffset / cardStep) % images.length;

          if (nextIndex !== announcedIndexRef.current) {
            announcedIndexRef.current = nextIndex;
            setActiveIndex(nextIndex);
            onActiveIndexChange?.(nextIndex);
          }
        }

        state.raf = requestAnimationFrame(tick);
      };

      const onWheel = (event: WheelEvent) => {
        state.target -= event.deltaY * SCROLL_PER_PX;
      };

      const beginDrag = (clientX: number, clientY: number) => {
        state.isDragging = true;
        state.lastX = clientX;
        state.lastY = clientY;
        state.velocity = 0;
      };

      const moveDrag = (
        clientX: number,
        clientY: number,
        direction: number = 1
      ) => {
        if (!state.isDragging) return;

        const deltaX = clientX - state.lastX;
        const deltaY = clientY - state.lastY;
        const rawDelta =
          Math.abs(deltaX) >= Math.abs(deltaY) ? -deltaX : -deltaY;
        const delta = rawDelta * direction;

        state.target += delta;
        state.velocity = lerp(state.velocity, delta, 0.5);
        state.lastX = clientX;
        state.lastY = clientY;
      };

      const endDrag = () => {
        state.isDragging = false;
      };

      const onMouseDown = (event: MouseEvent) => {
        beginDrag(event.clientX, event.clientY);
      };

      const onMouseMove = (event: MouseEvent) => {
        if (!state.isDragging) return;
        moveDrag(event.clientX, event.clientY);
      };

      const onMouseUp = () => {
        if (state.isDragging) endDrag();
      };

      const onTouchStart = (event: TouchEvent) => {
        if (event.touches.length > 0) {
          beginDrag(event.touches[0].clientX, event.touches[0].clientY);
        }
      };

      const onTouchMove = (event: TouchEvent) => {
        if (!state.isDragging) return;
        if (event.touches.length > 0) {
          moveDrag(event.touches[0].clientX, event.touches[0].clientY, -1);
        }
      };

      const onTouchEnd = () => {
        if (state.isDragging) endDrag();
      };

      const containerEl = containerRef.current;

      if (enableWindowWheel) {
        window.addEventListener('wheel', onWheel, { passive: true });
      }

      if (containerEl) {
        containerEl.addEventListener('mousedown', onMouseDown);
        containerEl.addEventListener('touchstart', onTouchStart, {
          passive: true,
        });
      }

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove, { passive: true });
      window.addEventListener('touchend', onTouchEnd);
      window.addEventListener('touchcancel', onTouchEnd);

      state.raf = requestAnimationFrame(tick);

      return () => {
        cancelAnimationFrame(state.raf as number);
        if (enableWindowWheel) {
          window.removeEventListener('wheel', onWheel);
        }
        if (containerEl) {
          containerEl.removeEventListener('mousedown', onMouseDown);
          containerEl.removeEventListener('touchstart', onTouchStart);
        }
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
        window.removeEventListener('touchcancel', onTouchEnd);
      };
    }, [
      cardStep,
      enableWindowWheel,
      images,
      onActiveIndexChange,
      positionCards,
      reduceMotion,
    ]);

    useEffect(() => {
      if (!images.length) return;

      const cleanups: (() => void)[] = [];

      cardRefs.current.forEach((card, index) => {
        const textElement = textRefs.current[index];
        const imageWrap = imageWrapRefs.current[index];

        if (!card || !textElement || !imageWrap) return;

        const numberElement = textElement.querySelector('[data-number]');
        const titleElement = textElement.querySelector('[data-title]');
        const descElement = textElement.querySelector('[data-desc]');

        if (!numberElement || !titleElement || !descElement) return;

        const split = SplitText.create(
          [numberElement, titleElement, descElement],
          {
            type: 'lines',
            mask: 'lines',
          }
        );

        gsap.set(split.lines, { yPercent: 100 });
        gsap.set(textElement, { autoAlpha: 0 });

        const imageElement = imageWrap.querySelector('img');

        if (imageElement) {
          gsap.set(imageElement, { opacity: 1 });
        }

        const onEnter = () => {
          if (textOnHover) {
            if (reduceMotion) {
              gsap.killTweensOf([textElement, split.lines]);
              gsap.set(split.lines, { yPercent: 0 });
              gsap.to(textElement, {
                autoAlpha: 1,
                duration: REDUCED_MOTION_FADE_DURATION,
                ease: 'power2.out',
              });
            } else {
              gsap
                .timeline()
                .set(textElement, { autoAlpha: 1 })
                .to(split.lines, {
                  yPercent: 0,
                  duration: 0.5,
                  stagger: 0.04,
                  ease: 'power3.out',
                });
            }
          }

          if (!imageElement || !scaleOnHover || reduceMotion) return;

          gsap.to(imageElement, {
            scale: 1.05,
            duration: 0.6,
            ease: 'power2.out',
          });
        };

        const onLeave = () => {
          if (textOnHover) {
            if (reduceMotion) {
              gsap.killTweensOf([textElement, split.lines]);
              gsap.to(textElement, {
                autoAlpha: 0,
                duration: REDUCED_MOTION_FADE_DURATION,
                ease: 'power2.out',
                onComplete: () => gsap.set(split.lines, { yPercent: 100 }),
              });
            } else {
              gsap.to(split.lines, {
                yPercent: 100,
                duration: 0.25,
                stagger: 0.02,
                ease: 'power2.in',
                onComplete: () => gsap.set(textElement, { autoAlpha: 0 }),
              });
            }
          } else {
            gsap.killTweensOf([textElement, split.lines]);
            gsap.set(textElement, { autoAlpha: 0 });
            gsap.set(split.lines, { yPercent: 100 });
          }

          if (!imageElement || !scaleOnHover) return;

          gsap.to(imageElement, {
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
          });
        };

        imageWrap.addEventListener('mouseenter', onEnter);
        imageWrap.addEventListener('mouseleave', onLeave);

        cleanups.push(() => {
          imageWrap.removeEventListener('mouseenter', onEnter);
          imageWrap.removeEventListener('mouseleave', onLeave);
          split.revert();
        });
      });

      return () => cleanups.forEach((cleanup) => cleanup());
    }, [images, reduceMotion, scaleOnHover, textOnHover]);

    const activeItem = images[activeIndex];
    const slideAnnouncement = images.length
      ? activeItem?.title
        ? `${activeItem.title}, slide ${activeIndex + 1} of ${images.length}`
        : `Slide ${activeIndex + 1} of ${images.length}`
      : '';

    return (
      <div
        ref={containerRef}
        className="relative w-screen overflow-hidden bg-transparent cursor-grab active:cursor-grabbing"
        style={{ height: '100svh', touchAction: 'none' }}
      >
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {slideAnnouncement}
        </div>
        {title ? (
          <div className="pointer-events-none absolute left-1/2 top-24 z-20 -translate-x-1/2 px-4 text-center">
            <h2 className="text-4xl text-white uppercase tracking-tight max-md:text-2xl font-extrabold">
              {title}
            </h2>
            {subheading ? (
              <p className="mt-3 text-sm tracking-[0.14em] text-white/60 uppercase font-mono max-md:text-xs">
                {subheading}
              </p>
            ) : null}
          </div>
        ) : null}

        <div ref={stripRef} className="absolute inset-0">
          {images.map((item, index) => (
            <div
              key={index}
              ref={(element) => {
                cardRefs.current[index] = element;
              }}
              className="absolute left-0 top-0"
              style={{ willChange: 'transform' }}
            >
              {/* Text Hover Panel */}
              <div
                ref={(element) => {
                  textRefs.current[index] = element;
                }}
                className="absolute z-10 flex w-full flex-col gap-1.5"
                style={{
                  bottom: 'calc(100% + 14px)',
                  left: 0,
                  padding: '0 0 4px',
                  visibility: 'hidden',
                }}
              >
                <div className="flex items-center justify-between">
                  <p
                    data-number
                    className="overflow-hidden select-none font-mono text-[10px] font-bold uppercase leading-none tracking-[0.2em] text-[#cccccc]/70"
                  >
                    [{item.number}]
                  </p>
                  {item.category ? (
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#999999]/60">
                      {item.category}
                    </span>
                  ) : null}
                </div>

                <p
                  data-title
                  className="overflow-hidden select-none text-[15px] sm:text-[17px] font-extrabold uppercase leading-[1.1] tracking-[0.06em] text-white"
                >
                  {item.title}
                </p>

                <p
                  data-desc
                  className="overflow-hidden text-[11px] sm:text-[12px] select-none font-normal leading-normal tracking-[0.02em] text-[#cccccc]/70 max-w-sm"
                >
                  {item.desc}
                </p>
              </div>

              {/* Image Wrap */}
              <div
                ref={(element) => {
                  imageWrapRefs.current[index] = element;
                }}
                className="relative overflow-hidden border border-white/10 bg-[#111111]"
                style={{
                  width: cardWidthMin,
                  height: cardHeightMax,
                  willChange: 'width, height',
                }}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  draggable={false}
                  className="pointer-events-none absolute inset-0 select-none object-cover opacity-0 w-full h-full"
                  style={{
                    transform: 'none',
                    objectPosition: 'center bottom',
                    transition: 'none',
                    willChange: 'auto',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

ZoomSliderComp.displayName = 'ZoomSliderComp';

export default ZoomSliderComp;

export const DEFAULT_SLIDER_DATA: ZoomSliderItem[] = [
  {
    number: '01',
    src: 'https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-09.jpg',
    title: 'AURA MONOLITH',
    desc: 'Spatial computing & ambient display interface',
    category: 'Spatial UI / WebGL',
    year: '2026',
  },
  {
    number: '02',
    src: 'https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-07.jpg',
    title: 'DRIFT KINETICS',
    desc: 'Dynamic physical-digital motion identity',
    category: 'Brand Architecture',
    year: '2026',
  },
  {
    number: '03',
    src: 'https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-03.jpg',
    title: 'FORM & VOID',
    desc: 'Generative architectural installations',
    category: 'Generative Design',
    year: '2025',
  },
  {
    number: '04',
    src: 'https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-08.jpg',
    title: 'FLOW SYSTEM',
    desc: 'Adaptive procedural typography engine',
    category: 'Interactive Type',
    year: '2025',
  },
  {
    number: '05',
    src: 'https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-05.jpg',
    title: 'DEPTH SPECTRUM',
    desc: 'Volumetric lighting & spatial rendering',
    category: '3D Direction',
    year: '2025',
  },
  {
    number: '06',
    src: 'https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-06.jpg',
    title: 'KINETIC SCULPT',
    desc: 'High-precision robotic fabrication study',
    category: 'Industrial Motion',
    year: '2025',
  },
  {
    number: '07',
    src: 'https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-02.jpg',
    title: 'CHRONO GLITCH',
    desc: 'Deconstructed temporal visual language',
    category: 'Creative Engineering',
    year: '2024',
  },
  {
    number: '08',
    src: 'https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-08.jpg',
    title: 'FRAME MATRIX',
    desc: 'Cinematic direction for luxury automotive',
    category: 'Film & 3D',
    year: '2024',
  },
  {
    number: '09',
    src: 'https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-01.jpg',
    title: 'LUMEN FIELD',
    desc: 'High-contrast optical exhibition design',
    category: 'Spatial Design',
    year: '2024',
  },
  {
    number: '10',
    src: 'https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-05.jpg',
    title: 'SYNTHETIC HORIZON',
    desc: 'Experimental interactive sound & vision',
    category: 'Audiovisual Lab',
    year: '2024',
  },
];
