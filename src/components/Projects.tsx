'use client';

import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { gsap } from 'gsap';
import BlurText from './BlurText';
import LetterSwapPingPong from './ui/letter-swap-pingpong-anim';

export interface ProjectItem {
  id: string;
  title: string;
  src: string;
  liveUrl: string;
  alt: string;
}

export const PROJECTS: ProjectItem[] = [
  {
    id: 'adarsh-26',
    title: "Adarsh'26",
    src: '/adarsh-26.webp',
    liveUrl: 'https://adrz-26.vercel.app',
    alt: "Adarsh'26 Portfolio Showcase",
  },
  {
    id: 'sentinel',
    title: 'Sentinel',
    src: "/mockup/Adarsh'26 Mockup.webp",
    liveUrl: 'https://github.com/adarzhpathade/sentinal-landing-page',
    alt: 'Sentinel Digital Experience',
  },
  {
    id: 'mirach-aerospace',
    title: 'Mirach Aerospace',
    src: '/mockup/mirach-cover.webp',
    liveUrl: 'https://www.mirachaerospace.com',
    alt: 'Mirach Aerospace Defence Deep-Tech',
  },
  {
    id: 'sentinel-terminal',
    title: 'Sentinel Terminal',
    src: '/mockup/sentinel-mockup (1).webp',
    liveUrl: 'https://github.com/adarzhpathade/sentinal-landing-page',
    alt: 'Sentinel Terminal Command System',
  },
];

export interface ProjectsHandle {
  playEntry: (force?: boolean) => void;
  resetEntry: () => void;
  setScrollProgress: (progress: number) => void;
}

export interface ProjectsProps {
  containerRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
  triggerReveal?: boolean;
}

export const Projects = forwardRef<ProjectsHandle, ProjectsProps>(
  function Projects({ containerRef, className = '', triggerReveal: triggerProp }, ref) {
    const [hasRevealed, setHasRevealed] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const activeIndexRef = useRef(0);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
      if (triggerProp !== undefined) {
        setHasRevealed(triggerProp);
      }
    }, [triggerProp]);

    const setScrollProgress = useCallback((progress: number) => {
      const clamped = Math.max(0, Math.min(3, progress));

      // Calculate which card is active (0, 1, 2, or 3) with symmetric round threshold
      const targetIdx = Math.min(3, Math.max(0, Math.round(clamped)));
      if (targetIdx !== activeIndexRef.current) {
        activeIndexRef.current = targetIdx;
        setActiveIndex(targetIdx);
      }

      // Direct GPU transform on each card DOM element
      for (let i = 0; i < PROJECTS.length; i++) {
        const card = cardRefs.current[i];
        if (!card) continue;

        const cardProgress = clamped - i;

        if (cardProgress < 0) {
          // Card is underneath the active one, waiting its turn.
          // Scale down slightly and push up slightly to create a beautiful depth stacking feel.
          const scale = 1 - Math.abs(cardProgress) * 0.05;
          const yP = Math.abs(cardProgress) * -2; 
          gsap.set(card, {
            yPercent: yP,
            rotationZ: 0,
            scale: scale,
            opacity: 1,
            visibility: 'visible',
          });
        } else if (cardProgress < 1.35) {
          // Active card (0) or peeling off (> 0)
          // Use quadratic curve for falling speed so it accelerates elegantly downwards
          const fallEase = cardProgress * cardProgress; 
          const yP = fallEase * 350;
          
          gsap.set(card, {
            yPercent: yP,
            rotationZ: 0,
            scale: 1,
            opacity: 1 - Math.max(0, (cardProgress - 0.85) * 4), // Fade out softly near the bottom
            visibility: 'visible',
          });
        } else {
          // Fully departed off bottom
          gsap.set(card, {
            yPercent: 450,
            visibility: 'hidden',
          });
        }
      }
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        playEntry: () => setHasRevealed(true),
        resetEntry: () => {
          setHasRevealed(false);
          setScrollProgress(0);
        },
        setScrollProgress,
      }),
      [setScrollProgress],
    );

    const activeTrigger = triggerProp === undefined ? undefined : hasRevealed;
    const currentProject = PROJECTS[activeIndex] || PROJECTS[0];

    const handleProjectRedirect = (url: string) => {
      if (typeof window !== 'undefined') {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    };

    return (
      <section
        ref={containerRef}
        id="page-4-content"
        aria-label="Projects Section"
        className={`relative w-full h-auto lg:h-full lg:min-h-screen bg-[#cccccc] overflow-visible lg:overflow-hidden select-none flex flex-col items-center justify-center pt-8 sm:pt-12 pb-24 sm:pb-28 lg:py-24 px-5 sm:px-10 md:px-14 lg:px-8 ${className}`}
      >
        {/* ===================== RECENT WORK HEADING BLOCK ===================== */}
        <div className="page4-heading-block w-full max-w-md lg:max-w-5xl mx-auto flex flex-col items-start text-left lg:items-center lg:text-center pt-20 sm:pt-24 lg:pt-0 mb-8 sm:mb-10 lg:mb-0 gap-0 lg:gap-6 will-change-[filter,opacity,transform] shrink-0">
          {/* Mobile View: Crisp, instant, solid typography (NO partial blur incoming effect) */}
          <div className="flex lg:hidden flex-col items-start text-left w-full">
            <h2
              style={{ fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif' }}
              className="font-normal text-[2.75rem] sm:text-5xl md:text-6xl tracking-[-0.04em] leading-[1.0] text-[#171717] select-none text-left m-0"
            >
              Recent work
            </h2>
            <p
              style={{ fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif' }}
              className="mt-5 sm:mt-6 font-normal text-[0.92rem] sm:text-base leading-relaxed text-[#171717]/65 text-left max-w-xs sm:max-w-sm tracking-[-0.01em] m-0"
            >
              A curated archive of selected spatial systems, tactile digital interfaces, and brand experiences.
            </p>
          </div>

          {/* Desktop View: Monumental Headline in Familjen Grotesk with signature letter-by-letter blur reveal */}
          <div className="hidden lg:flex flex-col items-center text-center w-full gap-6">
            <h2
              style={{ fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif' }}
              className="flex flex-wrap items-baseline justify-center gap-x-4 lg:gap-x-5 text-[6rem] xl:text-[7.5rem] leading-[0.85] tracking-[-0.04em] text-[#171717] font-normal m-0 select-none text-center"
            >
              <BlurText
                text="Recent"
                animateBy="letters"
                direction="none"
                randomize={true}
                delay={50}
                startDelay={80}
                stepDuration={0.38}
                trigger={activeTrigger}
                as="span"
                className="!inline-flex tracking-[-0.04em] font-normal justify-center"
                spanClassName="font-normal tracking-[-0.04em] text-[#171717]"
              />
              <BlurText
                text="Work"
                animateBy="letters"
                direction="none"
                randomize={true}
                delay={50}
                startDelay={160}
                stepDuration={0.38}
                trigger={activeTrigger}
                as="span"
                className="!inline-flex tracking-[-0.04em] font-normal justify-center"
                spanClassName="font-normal tracking-[-0.04em] text-[#171717]"
              />
            </h2>

            {/* Desktop Description */}
            <BlurText
              text="A curated archive of selected spatial systems, tactile digital interfaces, and brand experiences."
              animateBy="words"
              direction="none"
              randomize={true}
              delay={28}
              stepDuration={0.3}
              trigger={activeTrigger}
              as="p"
              style={{ fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif' }}
              className="font-normal text-lg leading-relaxed text-[#171717]/65 text-center max-w-[480px] tracking-[-0.01em] justify-center m-0"
              spanClassName="font-normal text-lg leading-relaxed text-[#171717]/65 tracking-[-0.01em]"
            />
          </div>
        </div>

        {/* ===================== STACKED PROJECT COVERS SHOWCASE ===================== */}
        <div className="w-full max-w-[1240px] mx-auto flex flex-col items-center justify-center mt-2 sm:mt-4 lg:mt-16 px-0 sm:px-4 lg:px-8 relative">
          {/* Mobile Vertical List */}
          <div className="w-full flex lg:hidden flex-col divide-y divide-[#171717]/15 mt-4 relative">
            {PROJECTS.map((proj) => (
              <div key={`mob-list-${proj.id}`} className="w-full flex flex-col items-center py-8 sm:py-9 first:pt-0 last:pb-0">
                <div className="w-full max-w-[78vw] sm:max-w-[340px] flex items-center justify-center mb-3 px-1">
                  <div className="text-center min-h-[1.75rem] flex items-center cursor-default group">
                    <BlurText
                      text={proj.title}
                      as="h3"
                      animateBy="words"
                      delay={120}
                      direction="bottom"
                      style={{ fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif' }}
                      className="font-light text-[1.18rem] sm:text-[1.35rem] leading-none tracking-[-0.02em] text-[#171717] justify-center"
                    />
                  </div>
                </div>
                <div
                  className="w-full max-w-[78vw] sm:max-w-[340px] aspect-[1672/941] cursor-pointer rounded-none overflow-hidden shadow-none"
                  onClick={() => handleProjectRedirect(proj.liveUrl)}
                >
                  <img
                    src={proj.src}
                    alt={proj.alt}
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover filter grayscale-[35%] contrast-[1.03] transition-[filter] duration-500 hover:grayscale-0"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop 3-Column Showcase Container */}
          <div className="hidden lg:flex w-full items-center justify-between relative gap-6 lg:gap-8">
            {/* Left Column (Desktop): Project Name with letter swap hover */}
            <div className="hidden lg:flex w-[180px] xl:w-[220px] shrink-0 items-center justify-start text-left min-h-[4rem] group cursor-default">
              <LetterSwapPingPong
                key={`desk-title-${activeIndex}`}
                label={currentProject.title}
                className="font-['Familjen_Grotesk',sans-serif] font-light text-lg sm:text-xl lg:text-2xl leading-none tracking-[-0.02em] text-[#171717] select-none"
              />
            </div>

            {/* Center Column: Stacked Project Covers Deck (strictly rounded-none, zero borders) */}
            <div
              id="projects-card-deck"
              className="relative mx-auto w-full max-w-[85vw] sm:max-w-[360px] md:max-w-[400px] lg:max-w-[440px] xl:max-w-[470px] 2xl:max-w-[490px] aspect-[1672/941] overflow-visible"
            >
              {PROJECTS.map((proj, idx) => (
                <div
                  key={proj.id}
                  id={`project-card-${idx}`}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  onClick={() => {
                    if (idx === activeIndex) {
                      handleProjectRedirect(proj.liveUrl);
                    }
                  }}
                  style={{
                    zIndex: 40 - idx * 10,
                    willChange: 'transform, filter, opacity',
                  }}
                  className={`absolute inset-0 w-full h-full rounded-none border-none shadow-none overflow-hidden transition-[filter] duration-500 ${
                    idx === activeIndex
                      ? 'cursor-pointer pointer-events-auto'
                      : 'pointer-events-none'
                  }`}
                >
                  <img
                    src={proj.src}
                    alt={proj.alt}
                    draggable={false}
                    className="w-full h-full object-cover select-none pointer-events-none filter grayscale-[35%] contrast-[1.03] transition-[filter] duration-500 hover:grayscale-0 rounded-none border-none shadow-none"
                  />
                </div>
              ))}
            </div>

            {/* Right Column (Desktop): View Project Link with letter swap hover */}
            <div className="hidden lg:flex w-[180px] xl:w-[220px] shrink-0 items-center justify-end text-right min-h-[4rem]">
              <a
                id="projects-view-link"
                href={currentProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleProjectRedirect(currentProject.liveUrl);
                }}
                className="cursor-pointer group select-none no-underline block"
                aria-label={`View ${currentProject.title} project`}
              >
                <LetterSwapPingPong
                  key={`desk-view-${activeIndex}`}
                  label="View Project"
                  className="font-['Familjen_Grotesk',sans-serif] font-light text-lg sm:text-xl lg:text-2xl leading-none tracking-[-0.02em] text-[#171717] group-hover:opacity-60 transition-opacity"
                />
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  },
);

export default Projects;
