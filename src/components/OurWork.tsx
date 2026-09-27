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
  const [mobileExpanded, setMobileExpanded] = useState<number | null>(0);
  const wheelRef = useRef<OptionWheelHandle | null>(null);

  const toggleMobileExpand = (index: number) => {
    setMobileExpanded((prev) => (prev === index ? null : index));
    try {
      const audio = new Audio('/audio/hover-sound.mp3');
      audio.volume = 0.35;
      audio.play().catch(() => {});
    } catch {
      /* Audio play is best-effort */
    }
  };

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
      className={`relative z-35 w-full h-full lg:min-h-screen flex items-center justify-center select-none pointer-events-auto px-5 sm:px-10 md:px-14 lg:px-16 py-8 sm:py-12 ${className}`}
    >
      {/* ===================== DESKTOP EXPERIENCE (OptionWheel) ===================== */}
      <div className="hidden md:flex w-full max-w-6xl mx-auto flex-row items-center justify-center gap-8 lg:gap-10">
        {/* Left Side: "We provide" + Description underneath */}
        <div className="shrink-0 relative flex flex-col items-start justify-center text-left">
          <h2
            style={{ fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif' }}
            className="font-normal text-3xl sm:text-4xl md:text-5xl lg:text-[3.75rem] xl:text-[4.15rem] tracking-[-0.035em] leading-none text-[#171717] select-none whitespace-nowrap"
          >
            We provide
          </h2>

          {/* Dynamic 2-line paragraph with signature randomized partial blur reveal */}
          <div className="md:absolute md:top-full md:left-0 mt-5 lg:mt-6 w-full max-w-[340px] lg:max-w-[380px] min-h-[3rem]">
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

        {/* Right Side: Scaled-up OptionWheel */}
        <div className="flex-1 w-full min-w-0 max-w-2xl h-[540px] md:h-[620px] lg:h-[700px] flex items-center justify-start relative">
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

      {/* ===================== MOBILE EXPERIENCE (Tap-to-Expand List with Scaled Editorial Typography) ===================== */}
      <div className="flex md:hidden flex-col w-full max-w-md mx-auto pt-20 sm:pt-24 pb-8 sm:pb-12">
        {/* Header Block - Left Aligned */}
        <div className="mb-12 sm:mb-14 text-left flex flex-col items-start">
          <h2
            style={{ fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif' }}
            className="font-normal text-[2.75rem] sm:text-5xl md:text-6xl tracking-[-0.04em] leading-[1.0] text-[#171717] select-none text-left"
          >
            We provide
          </h2>
          <p className="mt-5 sm:mt-6 font-['Familjen_Grotesk',sans-serif] text-[0.92rem] sm:text-base text-[#171717]/65 leading-relaxed max-w-xs sm:max-w-sm text-left">
            Defining creative trajectories to transform vision into actionable roadmaps.
          </p>
        </div>

        {/* Staggered Partial Blur Reveal List (Borderless with Editorial Spacing) */}
        <div className="flex flex-col w-full">
          {SERVICES_DATA.map((service, index) => {
            const isExpanded = mobileExpanded === index;
            return (
              <motion.div
                layout="position"
                key={service.title}
                initial={{ filter: 'blur(16px)', opacity: 0, y: 14 }}
                whileInView={{
                  filter: ['blur(16px)', 'blur(5px)', 'blur(0px)'],
                  opacity: [0, 0.65, 1],
                  y: [14, -2, 0],
                }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                  layout: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
                }}
                className="will-change-[filter,opacity,transform]"
              >
                <button
                  type="button"
                  onClick={() => toggleMobileExpand(index)}
                  className="w-full py-5 sm:py-5.5 flex items-center justify-between text-left group cursor-pointer focus:outline-none transition-colors"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-baseline gap-3.5 min-w-0 pr-3">
                    <span className="font-['Martian_Mono',monospace] text-xs sm:text-[13px] text-[#171717]/40 font-light tabular-nums shrink-0 select-none">
                      0{index + 1}
                    </span>
                    <span
                      style={{ fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif' }}
                      className={`text-[1.28rem] sm:text-[1.48rem] tracking-[-0.03em] leading-[1.15] transition-colors duration-200 truncate ${
                        isExpanded ? 'text-[#171717] font-medium' : 'text-[#171717]/80 font-normal group-hover:text-[#171717]'
                      }`}
                    >
                      {service.title}
                    </span>
                  </div>

                  {/* Minimal indicator icon */}
                  <div className="w-6 h-6 flex items-center justify-center shrink-0 text-[#171717]/40 group-hover:text-[#171717] transition-colors">
                    <motion.span
                      animate={{ rotate: isExpanded ? 45 : 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="text-lg leading-none select-none font-light"
                    >
                      +
                    </motion.span>
                  </div>
                </button>

                {/* Tap-to-expand details with partial blur reveal and smooth layout push */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 8, filter: 'blur(12px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -4, filter: 'blur(8px)' }}
                        transition={{ duration: 0.38, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
                        className="pb-4 pl-8 sm:pl-9 pr-3 pt-1 will-change-[filter,opacity,transform]"
                      >
                        <BlurText
                          key={`blur-desc-${service.title}-${isExpanded}`}
                          text={service.description}
                          animateBy="words"
                          direction="none"
                          randomize={true}
                          delay={22}
                          startDelay={30}
                          stepDuration={0.22}
                          trigger={true}
                          className="font-['Familjen_Grotesk',sans-serif] text-sm sm:text-base text-[#171717]/75 leading-relaxed font-normal"
                        />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default OurWork;
