'use client';

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  LiquidGlassCarousel,
  type LiquidGlassCarouselHandle,
} from '@/components/ui/liquid-glass-carousel';

export interface ProjectsHandle {
  playEntry: () => void;
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
        playEntry: () => carouselRef.current?.playEntry(),
      }),
      [],
    );

    return (
      <section
        ref={containerRef}
        id="page-4-content"
        aria-label="Projects Section"
        className={`relative w-full h-full min-h-screen bg-[#cccccc] overflow-hidden select-none ${className}`}
      >
        <LiquidGlassCarousel
          ref={carouselRef}
          heading="Our Projects"
          description="Selected spatial systems, digital interfaces & interactive works."
          panelHeight={230}
          background="#cccccc"
          entry={true}
        />
      </section>
    );
  },
);

export default Projects;
