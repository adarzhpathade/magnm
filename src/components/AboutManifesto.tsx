'use client';

import React from 'react';
import ScrollReveal from './ScrollReveal';

export interface AboutManifestoProps {
  containerRef?: React.RefObject<HTMLDivElement | null>;
  skipInternalTrigger?: boolean;
}

export const AboutManifesto: React.FC<AboutManifestoProps> = ({
  containerRef,
  skipInternalTrigger = false,
}) => {
  return (
    <section
      id="about"
      ref={containerRef}
      className="relative z-20 w-full h-full min-h-screen px-4 sm:px-6 md:px-10 lg:px-12 flex items-center justify-center overflow-hidden bg-transparent select-none pointer-events-none"
    >
      {/* Center Manifesto Statement Container */}
      <div className="w-full max-w-5xl mx-auto py-4 sm:py-6 md:py-8 flex flex-col items-center justify-center">
        <ScrollReveal
          skipInternalTrigger={skipInternalTrigger}
          baseOpacity={0.14}
          baseRotation={0}
          enableBlur={true}
          blurStrength={8}
          containerClassName="w-full my-0 text-center"
          textClassName="font-['Familjen_Grotesk',sans-serif] font-normal text-[clamp(2.1rem,4.4vw,4.25rem)] leading-[1.02] tracking-[-0.03em] text-white"
        >
          MAGNM is an independent digital studio crafting meaningful brand experiences through strategy, design, and technology.
        </ScrollReveal>
      </div>
    </section>
  );
};

export default AboutManifesto;
