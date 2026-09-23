'use client';

import { motion, type Transition, type Easing } from 'motion/react';
import { useEffect, useRef, useState, useMemo } from 'react';

type BlurTextProps = {
  text?: string;
  delay?: number;
  startDelay?: number;
  className?: string;
  spanClassName?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom' | 'none';
  randomize?: boolean;
  threshold?: number;
  rootMargin?: string;
  animationFrom?: Record<string, string | number>;
  animationTo?: Array<Record<string, string | number>>;
  easing?: Easing | Easing[];
  onAnimationComplete?: () => void;
  stepDuration?: number;
  trigger?: boolean;
};

const buildKeyframes = (
  from: Record<string, string | number>,
  steps: Array<Record<string, string | number>>
): Record<string, Array<string | number>> => {
  const keys = new Set<string>([...Object.keys(from), ...steps.flatMap(s => Object.keys(s))]);

  const keyframes: Record<string, Array<string | number>> = {};
  keys.forEach(k => {
    keyframes[k] = [from[k], ...steps.map(s => s[k])];
  });
  return keyframes;
};

const BlurText: React.FC<BlurTextProps> = ({
  text = '',
  delay = 200,
  startDelay = 0,
  className = '',
  spanClassName = '',
  animateBy = 'words',
  direction = 'none',
  randomize = false,
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = [0.22, 1, 0.36, 1],
  onAnimationComplete,
  stepDuration = 0.35,
  trigger,
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (entry.target) {
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const defaultFrom = useMemo<Record<string, string | number>>(() => {
    if (direction === 'none') {
      return { filter: 'blur(18px)', opacity: 0, y: 0 };
    }
    return direction === 'top'
      ? { filter: 'blur(14px)', opacity: 0, y: -40 }
      : { filter: 'blur(14px)', opacity: 0, y: 40 };
  }, [direction]);

  const defaultTo = useMemo<Array<Record<string, string | number>>>(() => {
    if (direction === 'none') {
      return [
        { filter: 'blur(8px)', opacity: 0.55, y: 0 },
        { filter: 'blur(0px)', opacity: 1, y: 0 }
      ];
    }
    return [
      {
        filter: 'blur(6px)',
        opacity: 0.55,
        y: direction === 'top' ? 4 : -4
      },
      { filter: 'blur(0px)', opacity: 1, y: 0 }
    ];
  }, [direction]);

  const elementDelays = useMemo(() => {
    const count = elements.length;
    if (!randomize) {
      return Array.from({ length: count }, (_, i) => (startDelay + i * delay) / 1000);
    }
    // Generate a shuffled order for randomized reveal
    const order = Array.from({ length: count }, (_, i) => i);
    for (let i = count - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    const delays = new Array<number>(count);
    order.forEach((origIndex, step) => {
      delays[origIndex] = (startDelay + step * delay) / 1000;
    });
    return delays;
  }, [elements.length, delay, startDelay, randomize]);

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) => (stepCount === 1 ? 0 : i / (stepCount - 1)));

  const isTriggered = trigger !== undefined ? trigger : inView;

  return (
    <p ref={ref} className={`blur-text ${className} flex flex-wrap`}>
      {elements.map((segment, index) => {
        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);

        const spanTransition: Transition = {
          duration: totalDuration,
          times,
          delay: elementDelays[index] ?? (startDelay + index * delay) / 1000,
          ease: easing
        };

        return (
          <motion.span
            key={index}
            className="inline-block"
            initial={fromSnapshot}
            animate={isTriggered ? animateKeyframes : fromSnapshot}
            transition={spanTransition}
            onAnimationComplete={index === elements.length - 1 ? onAnimationComplete : undefined}
            style={{
              display: 'inline-block',
              willChange: 'transform, filter, opacity'
            }}
          >
            <span
              className={`inline-block ${spanClassName}`}
              style={{ willChange: 'filter, opacity' }}
            >
              {segment === ' ' ? '\u00A0' : segment}
              {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
            </span>
          </motion.span>
        );
      })}
    </p>
  );
};

export default BlurText;
