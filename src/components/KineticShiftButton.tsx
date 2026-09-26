'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { chimeSynth } from '@/lib/chime-synth';

export interface KineticShiftButtonProps {
  /** The button label text */
  text: string;
  /** Click event handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Accessibility label for screen readers */
  ariaLabel?: string;
  /** Additional CSS class names */
  className?: string;
  /** Color theme: 'dark' (default for dark backgrounds) or 'light' (for light canvases) */
  theme?: 'dark' | 'light';
  /** Extra space in pixels between the text and the right '+' at rest (default: 32) */
  gapPx?: number;
  /** Whether to play acoustic hover sound (default: true) */
  enableSound?: boolean;
  /** Volume level between 0 and 1 (default: 0.35) */
  soundVolume?: number;
}

/**
 * KineticShiftButton — Signature MAGNM Typographic Action Button
 *
 * Micro-interactions:
 * 1. At rest: Text on left, subtle geometric '+' on right, thin baseline underneath.
 * 2. On hover: Left '+' slides in and rotates 90deg, words travel in a synchronized
 *    staggered wave across the line to dock flush against the extreme right edge,
 *    right '+' rotates and dissolves, glowing white line sweeps across baseline,
 *    and an acoustic metallic micro-sound triggers with zero latency.
 */
export const KineticShiftButton: React.FC<KineticShiftButtonProps> = ({
  text,
  onClick,
  ariaLabel,
  className = '',
  theme = 'dark',
  gapPx = 32,
  enableSound = true,
  soundVolume = 0.35,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const words = text.split(' ');
  const isLight = theme === 'light';

  const rowRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLSpanElement>(null);
  const [shiftPx, setShiftPx] = useState(gapPx);
  const mountedAtRef = useRef(0);

  useEffect(() => {
    mountedAtRef.current = performance.now();
  }, []);

  // Preload sound on component mount for zero-latency instant response
  useEffect(() => {
    if (enableSound) {
      chimeSynth.preloadHoverSound();
    }
  }, [enableSound]);

  useEffect(() => {
    const calcShift = () => {
      if (rowRef.current && wordsRef.current) {
        const rowWidth = rowRef.current.offsetWidth;
        const wordsWidth = wordsRef.current.offsetWidth;
        // Shift distance aligns the right edge of words flush with the extreme right edge of the baseline
        const diff = Math.max(16, rowWidth - wordsWidth);
        setShiftPx(diff);
      }
    };
    calcShift();
    window.addEventListener('resize', calcShift);
    return () => window.removeEventListener('resize', calcShift);
  }, [text, gapPx]);

  const handleMouseEnter = useCallback(() => {
    const now = performance.now();
    // Guard against premature trigger on section entrance or initial page reveal
    if (now - mountedAtRef.current > 600 && enableSound) {
      chimeSynth.playButtonHover(soundVolume);
    }
    setIsHovered(true);
  }, [enableSound, soundVolume]);

  const handleMouseMove = useCallback(() => {
    // If entered during a suppression window but user is now actively moving cursor
    if (!isHovered) {
      const now = performance.now();
      if (now - mountedAtRef.current > 600 && enableSound) {
        chimeSynth.playButtonHover(soundVolume);
      }
      setIsHovered(true);
    }
  }, [isHovered, enableSound, soundVolume]);

  const handleFocus = useCallback(() => {
    // Keyboard focus handles accessibility focus outline only; never play hover sound on focus
    setIsHovered(true);
  }, []);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={handleFocus}
      onBlur={() => setIsHovered(false)}
      aria-label={ariaLabel || text}
      className={`group relative cursor-pointer flex flex-col items-start pt-1.5 pb-1 focus:outline-none focus-visible:ring-1 ${
        isLight ? 'focus-visible:ring-black/40' : 'focus-visible:ring-white/40'
      } text-left select-none pointer-events-auto ${className}`}
    >
      {/* Top Row: Left Plus (on hover), Words (shift to extreme right), Right Plus (at rest) */}
      <div
        ref={rowRef}
        className="relative flex items-center justify-between w-full"
      >
        {/* Left Plus: Slides in & rotates on hover at the extreme left */}
        <span
          className={`font-['Martian_Mono',monospace] text-[0.72rem] select-none absolute left-0 top-1/2 inline-block pointer-events-none ${
            isLight ? 'text-[#171717]' : 'text-white'
          }`}
          style={{
            transform: isHovered
              ? 'translateY(-50%) translateX(0px) rotate(90deg)'
              : 'translateY(-50%) translateX(-8px) rotate(0deg)',
            opacity: isHovered ? 1 : 0,
            transition: 'transform 0.38s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease',
          }}
          aria-hidden="true"
        >
          +
        </span>

        {/* Text Words: Shift to the extreme right of the line on hover */}
        <span
          ref={wordsRef}
          className="inline-flex items-center gap-1.5 font-['Martian_Mono',monospace] font-light text-[clamp(0.68rem,0.85vw,0.82rem)] tracking-[0.06em] select-none"
          style={{
            color: isLight
              ? (isHovered ? '#000000' : '#171717')
              : (isHovered ? '#ffffff' : '#cccccc'),
            transition: 'color 0.3s ease',
          }}
        >
          {words.map((word, index) => (
            <span
              key={index}
              className="leave-blur-item inline-block will-change-[transform,filter,opacity]"
              style={{
                transform: isHovered ? `translateX(${shiftPx}px)` : 'translateX(0px)',
                transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                transitionDelay: isHovered
                  ? `${index * 35}ms`
                  : `${(words.length - 1 - index) * 20}ms`,
              }}
            >
              {word}
            </span>
          ))}
        </span>

        {/* Right Plus: Visible at rest on the extreme right, slides out & fades on hover */}
        <span
          className="leave-blur-item font-['Martian_Mono',monospace] text-[0.72rem] select-none relative inline-block will-change-[transform,filter,opacity]"
          style={{
            marginLeft: `${gapPx}px`,
            color: isLight
              ? (isHovered ? '#000000' : '#666666')
              : (isHovered ? '#ffffff' : '#666666'),
            transform: isHovered
              ? 'translateX(10px) rotate(90deg)'
              : 'translateX(0px) rotate(0deg)',
            opacity: isHovered ? 0 : 1,
            transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s ease, color 0.3s ease',
          }}
          aria-hidden="true"
        >
          +
        </span>
      </div>

      {/* Underline spanning under both the text and the plus icon */}
      <div
        className="leave-blur-item relative w-full h-[1px] mt-2 overflow-hidden will-change-[filter,opacity]"
        style={{
          backgroundColor: isLight
            ? (isHovered ? 'rgba(23, 23, 23, 0.4)' : 'rgba(23, 23, 23, 0.18)')
            : (isHovered ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.2)'),
          transition: 'background-color 0.3s ease',
        }}
      >
        {/* Active line sweep: draws from left-to-right on hover, exits to right on unhover */}
        <div
          className={`absolute inset-0 ${
            isLight
              ? 'bg-[#171717] shadow-[0_0_6px_rgba(23,23,23,0.25)]'
              : 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]'
          }`}
          style={{
            transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: isHovered ? 'left' : 'right',
            transition: 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          aria-hidden="true"
        />
      </div>
    </button>
  );
};

export default KineticShiftButton;
