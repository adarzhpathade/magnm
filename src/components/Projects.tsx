'use client';

import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import FlexCarousel from '@/components/ui/flex-carousel';
import { liquidGlassCarouselDefaultItems } from '@/components/ui/carousel/default-items';

export interface ProjectsHandle {
  playEntry: (force?: boolean) => void;
  resetEntry: () => void;
}

export interface ProjectsProps {
  containerRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

export const Projects = forwardRef<ProjectsHandle, ProjectsProps>(
  function Projects({ containerRef, className = '' }, ref) {
    const carouselRef = useRef<any>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const [isFocusOpen, setIsFocusOpen] = useState(false);

    const mappedItems = liquidGlassCarouselDefaultItems.map(item => ({
      ...item,
      subtitle: item.desc,
      alt: item.title,
    }));

    useImperativeHandle(
      ref,
      () => ({
        playEntry: () => {},
        resetEntry: () => {
          setIsFocusOpen(false);
        },
      }),
      [],
    );

    return (
      <section
        ref={containerRef}
        id="page-4-content"
        aria-label="Projects Section"
        className={`relative w-full h-full lg:min-h-screen bg-[#cccccc] overflow-hidden select-none flex flex-col items-center justify-center ${className}`}
      >
        <div className="absolute inset-0 w-full h-full pt-16 lg:pt-0">
          <FlexCarousel
            ref={carouselRef}
            items={mappedItems}
            preset="liquid"
            intro="none"
            cardHeight={0.28}
            gap={12}
            bend={0}
            dispersion={0}
            squeeze={0.15}
            focusOnClick
            captions={true}
            fit="natural"
            autoplay={true}
            interval={4}
            onFocusChange={setIsFocusOpen}
          />
        </div>

        <div className={`pointer-events-none absolute inset-0 transition-all duration-500 ease-in-out ${isFocusOpen ? 'opacity-0 blur-md translate-y-4' : 'opacity-100 blur-none translate-y-0'}`}>
          <div
            ref={headingRef}
            className="pointer-events-none absolute bottom-[6.5%] sm:bottom-[8%] md:bottom-[9%] left-1/2 -translate-x-1/2 z-10 m-0 text-center flex flex-col items-center gap-1.5 sm:gap-2.5 select-none px-4 max-w-[90vw]"
          >
            <h2
              style={{ fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif' }}
              className="font-normal text-3xl sm:text-4xl md:text-5xl lg:text-[3.6rem] xl:text-[4.2rem] tracking-[-0.04em] leading-none text-[#171717]"
            >
              Our Projects
            </h2>
            <p className="font-sans text-[13px] sm:text-[14px] md:text-[15px] font-normal tracking-[-0.015em] text-[#171717]/65 max-w-[460px] text-center leading-relaxed select-none">
              A curated archive of selected spatial systems, tactile digital interfaces, and interactive brand experiences engineered with precision.
            </p>
          </div>
        </div>
      </section>
    );
  },
);

export default Projects;
