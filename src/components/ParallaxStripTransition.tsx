'use client';

import React from 'react';

export interface ParallaxStripTransitionProps {
  stripCount?: number;
  stripsRef: React.RefObject<(HTMLDivElement | null)[]>;
  zoomsRef: React.RefObject<(HTMLDivElement | null)[]>;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  bgColor?: string;
  className?: string;
}

export const ParallaxStripTransition: React.FC<ParallaxStripTransitionProps> = ({
  stripCount = 12,
  stripsRef,
  zoomsRef,
  containerRef,
  bgColor = '#cccccc',
  className = '',
}) => {
  const width = 100 / stripCount;

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 z-30 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: stripCount }, (_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (stripsRef.current) {
              stripsRef.current[i] = el;
            }
          }}
          className="absolute inset-y-0 overflow-hidden will-change-[clip-path]"
          style={{
            left: `${i * width}%`,
            width: `${width}%`,
            clipPath: 'inset(0 100% 0 0)',
            marginLeft: i === 0 ? 0 : '-0.5px',
            paddingLeft: i === 0 ? 0 : '0.5px',
          }}
        >
          {/* Full-width surface shifted to align across strips */}
          <div
            ref={(el) => {
              if (zoomsRef.current) {
                zoomsRef.current[i] = el;
              }
            }}
            className="absolute inset-y-0 will-change-transform"
            style={{
              left: `-${i * 100}%`,
              width: `${stripCount * 100}%`,
              backgroundColor: bgColor,
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default ParallaxStripTransition;
