'use client';

import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import OptionWheel, { type OptionWheelHandle } from './OptionWheel';
import BlurText from './BlurText';

export interface OurWorkHandle {
  setTarget: (target: number) => void;
  /** Bypass internal easing — set position directly for scroll-driven mode */
  setPositionDirect: (value: number) => void;
}

export interface OurWorkProps {
  containerRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

interface ServiceDetail {
  title: string;
  category: string;
  description: string;
  tags: string[];
}

const SERVICES_DATA: ServiceDetail[] = [
  {
    title: 'Strategy & Direction',
    category: 'Strategic Vision',
    description:
      'Defining creative trajectories to transform vision into actionable roadmaps.',
    tags: ['Brand Strategy', 'Product Architecture', 'Creative Direction'],
  },
  {
    title: 'Digital Products & Websites',
    category: 'Digital Flagships',
    description:
      'Engineering bespoke flagships built for fluid interaction and performance.',
    tags: ['Web Platforms', 'Interactive Systems', 'UI/UX Design'],
  },
  {
    title: '3D & Motion Design',
    category: 'Kinetic Experiences',
    description:
      'Crafting kinetic identities and spatial 3D experiences with depth.',
    tags: ['WebGL / Three.js', 'Kinetic Systems', 'Spatial Interfaces'],
  },
  {
    title: 'AI Systems & Interfaces',
    category: 'Intelligent UX',
    description:
      'Architecting generative interfaces that turn intelligent logic into intuitive tools.',
    tags: ['Generative UI', 'Agentic Workflows', 'Interface Engineering'],
  },
  {
    title: 'Brand Identity & Systems',
    category: 'Visual Languages',
    description:
      'Formulating typographic systems and design tokens built to scale.',
    tags: ['Design Systems', 'Typography', 'Visual Identity'],
  },
  {
    title: 'Creative Engineering',
    category: 'Modern Craft',
    description:
      'Bridging avant-garde aesthetics with robust architecture and custom shaders.',
    tags: ['Custom Shaders', 'GSAP Orchestration', 'Full-Stack Performance'],
  },
];

const SERVICES_ITEMS = SERVICES_DATA.map((s) => s.title);

export const OurWork = forwardRef<OurWorkHandle, OurWorkProps>(function OurWork(
  { containerRef, className = '' },
  ref
) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const wheelRef = useRef<OptionWheelHandle | null>(null);

  const [wheelProps, setWheelProps] = useState({
    fontSize: 3.75,
    inset: 10,
  });

  useImperativeHandle(
    ref,
    () => ({
      setTarget: (target: number) => {
        wheelRef.current?.setTarget(target);
      },
      setPositionDirect: (value: number) => {
        wheelRef.current?.setPositionDirect(value);
      },
    }),
    []
  );

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setWheelProps({ fontSize: 1.85, inset: 6 });
      } else if (w < 1024) {
        setWheelProps({ fontSize: 2.75, inset: 8 });
      } else {
        setWheelProps({ fontSize: 3.75, inset: 10 });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeService = SERVICES_DATA[selectedIndex] || SERVICES_DATA[0];

  return (
    <div
      ref={containerRef}
      className={`relative z-35 w-full h-full min-h-screen flex items-center justify-center select-none pointer-events-auto px-6 sm:px-10 md:px-14 lg:px-16 py-12 ${className}`}
    >
      {/* Centered Sentence Composition: "We provide" + OptionWheel */}
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
        {/* Left Side of the Centered Sentence: "We provide" + Description underneath */}
        <div className="shrink-0 relative flex flex-col items-start justify-center text-left">
          <h2
            style={{ fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif' }}
            className="font-normal text-3xl sm:text-4xl md:text-5xl lg:text-[3.75rem] xl:text-[4.15rem] tracking-[-0.035em] leading-none text-[#171717] select-none whitespace-nowrap"
          >
            We provide
          </h2>

          {/* Dynamic 2-line paragraph with signature randomized partial blur reveal */}
          <div className="md:absolute md:top-full md:left-0 mt-3 sm:mt-4 md:mt-5 lg:mt-6 w-full max-w-xs sm:max-w-sm md:max-w-[340px] lg:max-w-[380px] min-h-[3rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedIndex}
                initial={{ opacity: 1 }}
                exit={{ filter: 'blur(12px)', opacity: 0 }}
                transition={{ duration: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="w-full will-change-[filter,opacity]"
              >
                <BlurText
                  key={selectedIndex}
                  text={activeService.description}
                  animateBy="words"
                  direction="none"
                  randomize={true}
                  delay={24}
                  startDelay={0}
                  stepDuration={0.2}
                  trigger={true}
                  className="font-['Familjen_Grotesk',sans-serif] text-xs sm:text-sm md:text-[0.95rem] lg:text-[1.05rem] leading-[1.4] text-[#333333] font-normal tracking-[-0.012em]"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side of the Centered Sentence: Scaled-up OptionWheel */}
        <div className="flex-1 w-full min-w-0 max-w-2xl h-[460px] sm:h-[540px] md:h-[620px] lg:h-[700px] flex items-center justify-start relative">
          <OptionWheel
            ref={wheelRef}
            items={SERVICES_ITEMS}
            defaultSelected={0}
            side="left"
            fontSize={wheelProps.fontSize}
            spacing={1.38}
            curve={0.82}
            tilt={5}
            blur={1.4}
            fade={0.28}
            minOpacity={0.06}
            smoothing={40}
            inset={wheelProps.inset}
            loop={false}
            draggable={true}
            disableInternalWheel={true}
            activeColor="#171717"
            textColor="rgba(23, 23, 23, 0.28)"
            soundUrl="/audio/hover-sound.mp3"
            soundVolume={0.5}
            onChange={(index) => setSelectedIndex(index)}
          />
        </div>
      </div>
    </div>
  );
});

export default OurWork;
