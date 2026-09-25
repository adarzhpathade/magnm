'use client';

import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useRef,
} from 'react';
import { motion } from 'motion/react';
import BlurText from './BlurText';
import HeroContactButton from './HeroContactButton';
import GradualBlur from './GradualBlur';

export interface ProjectShowcaseHandle {
  setScrollProgress: (progress: number) => void;
  setRotationOffset?: (deg: number) => void;
  triggerReveal?: () => void;
  resetReveal?: () => void;
  setInView?: (inView: boolean) => void;
}

export interface ProjectShowcaseProps {
  containerRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
  isRevealed?: boolean;
}

const PROJECT_THUMBNAILS = [
  {
    id: '01',
    title: 'NEURA LABS',
    category: 'AI PLATFORM & 3D WEB',
    year: '2026',
    src: '/thumbnails/01.jpg',
  },
  {
    id: '02',
    title: 'KINETIX STUDIO',
    category: 'BRAND IDENTITY & MOTION',
    year: '2025',
    src: '/thumbnails/02.jpg',
  },
  {
    id: '03',
    title: 'AURA SPATIAL',
    category: 'SPATIAL AUDIO & HARDWARE',
    year: '2026',
    src: '/thumbnails/03.jpg',
  },
  {
    id: '04',
    title: 'SYNAPSE CO.',
    category: 'FINTECH DESIGN SYSTEM',
    year: '2025',
    src: '/thumbnails/04.jpg',
  },
  {
    id: '05',
    title: 'HYPERFRAME',
    category: 'EXPERIMENTAL 3D ENGINE',
    year: '2026',
    src: '/thumbnails/05.jpg',
  },
  {
    id: '06',
    title: 'ORBIT DYNAMICS',
    category: 'AEROSPACE DIGITAL TWIN',
    year: '2026',
    src: '/thumbnails/06.jpg',
  },
  {
    id: '07',
    title: 'CHRONO MATRIX',
    category: 'KINETIC IDENTITY',
    year: '2025',
    src: '/thumbnails/07.jpg',
  },
  {
    id: '08',
    title: 'VORTEX SPATIAL',
    category: 'SPATIAL COMPUTING',
    year: '2026',
    src: '/thumbnails/08.jpg',
  },
];

export const ProjectShowcase = forwardRef<ProjectShowcaseHandle, ProjectShowcaseProps>(
  ({ containerRef, className = '', isRevealed: propIsRevealed }, ref) => {
    const [internalRevealed, setInternalRevealed] = useState(false);
    const [revealCount, setRevealCount] = useState(0);
    const [isMarqueeActive, setIsMarqueeActive] = useState(false);
    const [hasEntered, setHasEntered] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    
    const marqueeTimerRef = useRef<NodeJS.Timeout | null>(null);
    const localRef = useRef<HTMLDivElement>(null);

    const isRevealedRef = useRef(false);

    const isRevealed = propIsRevealed !== undefined ? propIsRevealed : internalRevealed;

    const triggerReveal = () => {
      if (isRevealedRef.current) return;
      isRevealedRef.current = true;

      setInternalRevealed(true);
      setRevealCount((prev) => prev + 1);
      setIsMarqueeActive(false);

      if (marqueeTimerRef.current) {
        clearTimeout(marqueeTimerRef.current);
      }
      // Slower, graceful card entrance for all 16 cards finishes across ~2.1s; start smooth scrolling at 2.3s
      marqueeTimerRef.current = setTimeout(() => {
        setIsMarqueeActive(true);
        setHasEntered(true);
      }, 2300);
    };

    const resetReveal = () => {
      if (!isRevealedRef.current) return;
      isRevealedRef.current = false;

      setInternalRevealed(false);
      setIsMarqueeActive(false);
      setHasEntered(false);
      setHoveredIndex(null);
      if (marqueeTimerRef.current) {
        clearTimeout(marqueeTimerRef.current);
      }
    };

    useImperativeHandle(
      ref,
      () => ({
        setScrollProgress: () => {},
        setRotationOffset: () => {},
        triggerReveal,
        resetReveal,
        setInView: (inView: boolean) => {
          if (inView) {
            triggerReveal();
          } else {
            resetReveal();
          }
        },
      }),
      []
    );

    // Synchronize refs
    const setContainerRefs = (node: HTMLDivElement | null) => {
      localRef.current = node;
      if (containerRef) {
        if (typeof containerRef === 'function') {
          (containerRef as unknown as (instance: HTMLDivElement | null) => void)(node);
        } else {
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      }
    };

    // Intersection & viewport check fallback
    useEffect(() => {
      const targetEl = (containerRef && containerRef.current) || localRef.current;
      if (!targetEl) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.18) {
            triggerReveal();
          } else if (!entry.isIntersecting && entry.boundingClientRect.top > 0) {
            resetReveal();
          }
        },
        { threshold: [0, 0.18, 0.4] }
      );

      observer.observe(targetEl);
      return () => {
        observer.disconnect();
        if (marqueeTimerRef.current) {
          clearTimeout(marqueeTimerRef.current);
        }
      };
    }, [containerRef]);

    return (
      <div
        ref={setContainerRefs}
        className={`relative w-full h-screen max-h-screen bg-[#171717] text-[#DEDEDE] select-none flex flex-col justify-between pt-[16vh] sm:pt-[17.5vh] md:pt-[19vh] pb-4 sm:pb-5 md:pb-6 overflow-hidden ${className}`}
      >
        {/* Main top content — aligned horizontally with Navbar */}
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 flex flex-col md:flex-row md:items-start justify-between gap-8 md:gap-12 lg:gap-16">
          {/* Left: Large Title — revealing with signature MAGNM partial optical blur effect */}
          <div className="shrink-0" role="heading" aria-level={2}>
            <div className="font-sans font-normal text-[12vw] sm:text-[10vw] md:text-[8.5vw] lg:text-[7.5vw] xl:text-[7vw] leading-[0.88] tracking-[-0.04em] text-[#DEDEDE]">
              <BlurText
                key={`title-selected-${revealCount}`}
                text="Selected"
                delay={35}
                startDelay={0}
                animateBy="letters"
                direction="none"
                randomize={false}
                stepDuration={0.38}
                trigger={isRevealed}
                animationFrom={{ filter: 'blur(16px)', opacity: 0, y: 0 }}
                animationTo={[
                  { filter: 'blur(7px)', opacity: 0.6, y: 0 },
                  { filter: 'blur(0px)', opacity: 1, y: 0 },
                ]}
                className="font-sans font-normal tracking-[-0.04em] leading-[0.88] text-[#DEDEDE] !flex-nowrap whitespace-nowrap"
              />
              <BlurText
                key={`title-work-${revealCount}`}
                text="Work"
                delay={40}
                startDelay={240}
                animateBy="letters"
                direction="none"
                randomize={false}
                stepDuration={0.38}
                trigger={isRevealed}
                animationFrom={{ filter: 'blur(16px)', opacity: 0, y: 0 }}
                animationTo={[
                  { filter: 'blur(7px)', opacity: 0.6, y: 0 },
                  { filter: 'blur(0px)', opacity: 1, y: 0 },
                ]}
                className="font-sans font-normal tracking-[-0.04em] leading-[0.88] text-[#DEDEDE] !flex-nowrap whitespace-nowrap"
              />
            </div>
          </div>

          {/* Right Column: Description paragraph + "SEE ALL PROJECTS" Button shifted towards the right side */}
          <div className="flex flex-col items-start md:ml-auto md:mr-[3vw] lg:mr-[6vw] xl:mr-[8vw] max-w-[440px] sm:max-w-[500px] md:max-w-[540px] lg:max-w-[580px] pt-1.5 sm:pt-2 md:pt-3 lg:pt-4">
            <BlurText
              key={`paragraph-${revealCount}`}
              text="A curated collection of creative projects blending visionary design, technology, and smooth motion systems into lasting, high-impact digital experiences."
              delay={22}
              startDelay={160}
              animateBy="words"
              direction="none"
              randomize={false}
              stepDuration={0.32}
              trigger={isRevealed}
              animationFrom={{ filter: 'blur(14px)', opacity: 0, y: 0 }}
              animationTo={[
                { filter: 'blur(6px)', opacity: 0.55, y: 0 },
                { filter: 'blur(0px)', opacity: 1, y: 0 },
              ]}
              className="font-sans font-normal text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] text-[#DEDEDE] leading-[1.4] tracking-[-0.015em]"
            />

            {/* Action button below paragraph matching hero section style */}
            <motion.div
              initial={{ opacity: 0, filter: 'blur(10px)', y: 8 }}
              animate={
                isRevealed
                  ? { opacity: 1, filter: 'blur(0px)', y: 0 }
                  : { opacity: 0, filter: 'blur(10px)', y: 8 }
              }
              transition={{ duration: 0.55, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 sm:mt-8 md:mt-9"
            >
              <HeroContactButton
                text="SEE ALL PROJECTS"
                ariaLabel="See all projects"
                theme="dark"
              />
            </motion.div>
          </div>
        </div>

        {/* Bottom Area: Kinetic Thumbnail Stream with alternating entrance from bottom then marquee scrolling */}
        <div className="w-full overflow-hidden relative group py-2">
          {/* Left Edge Gradual Blur Overlay from React Bits (Subtle & gentle) */}
          <GradualBlur
            target="parent"
            position="left"
            width="clamp(2.5rem, 5vw, 5rem)"
            strength={0.8}
            divCount={4}
            curve="bezier"
            exponential={false}
            opacity={0.8}
            zIndex={20}
          />

          {/* Right Edge Gradual Blur Overlay from React Bits (Subtle & gentle) */}
          <GradualBlur
            target="parent"
            position="right"
            width="clamp(2.5rem, 5vw, 5rem)"
            strength={0.8}
            divCount={4}
            curve="bezier"
            exponential={false}
            opacity={0.8}
            zIndex={20}
          />

          {/* The thumbnail cards track: stays stationary while cards alternate-rise from bottom, then starts scrolling */}
          <div
            className={`w-max ${
              isMarqueeActive ? 'animate-marquee-scroll' : ''
            } flex items-center gap-4 sm:gap-5 md:gap-6 py-2`}
          >
            {[...PROJECT_THUMBNAILS, ...PROJECT_THUMBNAILS].map((item, index) => {
              const isEven = index % 2 === 0;
              // Slower, graceful alternating entrance for ALL cards (0 to 15)
              // Even cards rise first from 180px; odd cards rise from deeper (260px) in interleaved slots
              const cardDelay = isEven
                ? 0.15 + (index / 2) * 0.10
                : 0.40 + ((index - 1) / 2) * 0.10;
              const startY = isEven ? 180 : 260;
              
              // Interactive hover states (only applied after entrance finishes)
              const isHovered = hoveredIndex === index;
              
              const xOffset = hasEntered 
                ? (hoveredIndex === null ? 0 : (index < hoveredIndex ? -32 : (isHovered ? 0 : 32))) 
                : 0;
              const currentScale = hasEntered && isHovered ? 1.15 : 1;

              return (
                <motion.div
                  key={`${item.id}-${index}-${revealCount}`}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  initial={{ opacity: 0, y: startY, filter: 'blur(12px)', scale: 1, x: 0 }}
                  animate={
                    isRevealed
                      ? { 
                          opacity: 1, 
                          y: 0, 
                          filter: 'blur(0px)',
                          scale: currentScale,
                          x: xOffset
                        }
                      : { opacity: 0, y: startY, filter: 'blur(12px)', scale: 1, x: 0 }
                  }
                  transition={
                    !hasEntered
                      ? { duration: 1.15, delay: cardDelay, ease: [0.16, 1, 0.3, 1] }
                      : { type: 'spring', stiffness: 350, damping: 28, mass: 0.8 }
                  }
                  className={`group/card relative shrink-0 w-[210px] sm:w-[250px] md:w-[290px] lg:w-[320px] h-[130px] sm:h-[150px] md:h-[170px] lg:h-[185px] rounded-[4px] overflow-hidden cursor-pointer bg-[#b8b8b8] shadow-sm will-change-transform ${isHovered ? 'z-10' : 'z-0'}`}
                >
                  {/* Pure Thumbnail Image with smooth hover scale */}
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-110"
                    loading="lazy"
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);

ProjectShowcase.displayName = 'ProjectShowcase';
export default ProjectShowcase;
