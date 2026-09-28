'use client';

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  LiquidGlassCarousel,
  type LiquidGlassCarouselHandle,
} from '@/components/ui/liquid-glass-carousel';

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
    const carouselRef = useRef<LiquidGlassCarouselHandle | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        playEntry: (force?: boolean) => carouselRef.current?.playEntry(force),
        resetEntry: () => carouselRef.current?.resetEntry?.(),
      }),
      [],
    );

    return (
      <section
        ref={containerRef}
        id="page-4-content"
        aria-label="Projects Section"
        className={`relative w-full h-full lg:min-h-screen bg-[#cccccc] overflow-hidden select-none ${className}`}
      >
        <LiquidGlassCarousel
          ref={carouselRef}
          heading="Our Projects"
          description="A curated archive of selected spatial systems, tactile digital interfaces, and interactive brand experiences engineered with precision."
          panelHeight={230}
          background="#cccccc"
          entry={true}
        />
      </section>
    );
  },
);

export default Projects;
