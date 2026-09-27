'use client';

import { useState, useEffect } from 'react';

export function useResponsiveWheel() {
  const [wheelScale, setWheelScale] = useState(90);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    // Reset scroll to top on mount
    window.scrollTo(0, 0);

    const updateDimensions = () => {
      const width = window.innerWidth;
      setIsDesktop(width >= 1024);
      if (width < 640) {
        setWheelScale(54);
      } else if (width < 1024) {
        setWheelScale(70);
      } else {
        setWheelScale(90);
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return { wheelScale, isDesktop };
}
