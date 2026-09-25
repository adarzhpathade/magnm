'use client';

import React, { useState } from 'react';

export interface HeroContactButtonProps {
  text: string;
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
  theme?: 'dark' | 'light';
}

export const HeroContactButton: React.FC<HeroContactButtonProps> = ({
  text,
  onClick,
  ariaLabel,
  className = '',
  theme = 'dark',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const words = text.split(' ');

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      aria-label={ariaLabel || text}
      className={`group relative cursor-pointer flex flex-col items-start pt-1.5 pb-1 focus:outline-none focus-visible:ring-1 ${
        theme === 'light' ? 'focus-visible:ring-black/40' : 'focus-visible:ring-white/40'
      } text-left select-none pointer-events-auto ${className}`}
    >
      {/* Top Row: Left Plus (on hover), Words, Right Plus (at rest) */}
      <div className="relative flex items-center">
        {/* Left Plus: Slides in & rotates on hover */}
        <span
          className={`font-['Martian_Mono',monospace] text-[0.72rem] select-none absolute left-0 top-1/2 inline-block pointer-events-none ${
            theme === 'light' ? 'text-[#171717]' : 'text-white'
          }`}
          style={{
            transform: isHovered
              ? 'translateY(-50%) translateX(0px) rotate(90deg)'
              : 'translateY(-50%) translateX(-10px) rotate(0deg)',
            opacity: isHovered ? 1 : 0,
            transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease',
          }}
          aria-hidden="true"
        >
          +
        </span>

        {/* Text Words: Shift to the right word-by-word on hover */}
        <span
          className="inline-flex items-center gap-1.5 font-['Martian_Mono',monospace] font-light text-[clamp(0.68rem,0.85vw,0.82rem)] tracking-[0.06em] select-none"
          style={{
            color: theme === 'light'
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
                transform: isHovered ? 'translateX(20px)' : 'translateX(0px)',
                transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
                transitionDelay: isHovered
                  ? `${index * 40}ms`
                  : `${(words.length - 1 - index) * 25}ms`,
              }}
            >
              {word}
            </span>
          ))}
        </span>

        {/* Right Plus: Visible at rest, slides out & fades on hover */}
        <span
          className="leave-blur-item font-['Martian_Mono',monospace] text-[0.72rem] select-none relative ml-3 inline-block will-change-[transform,filter,opacity]"
          style={{
            color: theme === 'light'
              ? (isHovered ? '#000000' : '#666666')
              : (isHovered ? '#ffffff' : '#666666'),
            transform: isHovered
              ? 'translateX(10px) rotate(90deg)'
              : 'translateX(0px) rotate(0deg)',
            opacity: isHovered ? 0 : 1,
            transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease, color 0.3s ease',
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
          backgroundColor: theme === 'light'
            ? (isHovered ? 'rgba(23, 23, 23, 0.4)' : 'rgba(23, 23, 23, 0.18)')
            : (isHovered ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.2)'),
          transition: 'background-color 0.3s ease',
        }}
      >
        {/* Active line sweep: draws from left-to-right on hover, exits to right on unhover */}
        <div
          className={`absolute inset-0 ${
            theme === 'light'
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

export default HeroContactButton;
