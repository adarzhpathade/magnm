"use client"

import { useEffect, useRef, useMemo, useCallback } from "react"
import { debounce } from "lodash"
import { AnimationOptions, motion, stagger, useAnimate } from "motion/react"

interface TextProps {
  label: string
  reverse?: boolean
  transition?: AnimationOptions
  staggerDuration?: number
  staggerFrom?: "first" | "last" | "center" | number
  className?: string
  onClick?: () => void
}

const LetterSwapPingPong = ({
  label,
  reverse = true,
  transition = {
    type: "spring",
    duration: 0.4, // Faster duration
    bounce: 0.1,
  },
  staggerDuration = 0.02, // Faster stagger
  staggerFrom = "first",
  className,
  onClick,
  ...props
}: TextProps) => {
  const [scope, animate] = useAnimate()
  const isHovered = useRef(false)

  const mergeTransition = useCallback((baseTransition: AnimationOptions) => ({
    ...baseTransition,
    delay: stagger(staggerDuration, {
      from: staggerFrom,
    }),
  }), [staggerDuration, staggerFrom])

  const hoverStart = useMemo(() => debounce(
    // eslint-disable-next-line react-hooks/refs
    () => {
      if (isHovered.current) return
      isHovered.current = true

      animate(
        ".letter",
        { y: reverse ? "100%" : "-100%" },
        mergeTransition(transition)
      )

      animate(
        ".letter-secondary",
        {
          top: "0%",
        },
        mergeTransition(transition)
      )
    },
    100,
    { leading: true, trailing: true }
  ), [animate, mergeTransition, reverse, transition])

  const hoverEnd = useMemo(() => debounce(
    // eslint-disable-next-line react-hooks/refs
    () => {
      isHovered.current = false

      animate(
        ".letter",
        {
          y: 0,
        },
        mergeTransition(transition)
      )

      animate(
        ".letter-secondary",
        {
          top: reverse ? "-100%" : "100%",
        },
        mergeTransition(transition)
      )
    },
    100,
    { leading: true, trailing: true }
  ), [animate, mergeTransition, reverse, transition])

  // Attach hover events to the parent button/container so padding triggers it
  useEffect(() => {
    const parent = scope.current?.closest("button") || scope.current?.parentElement
    if (!parent) return

    parent.addEventListener("mouseenter", hoverStart)
    parent.addEventListener("mouseleave", hoverEnd)

    return () => {
      parent.removeEventListener("mouseenter", hoverStart)
      parent.removeEventListener("mouseleave", hoverEnd)
    }
  }, [hoverStart, hoverEnd, scope])

  return (
    <motion.span
      className={`flex justify-center items-center relative overflow-hidden  ${className} `}
      onClick={onClick}
      ref={scope}
      {...props}
    >
      <span className="sr-only">{label}</span>

      {label.split("").map((letter: string, i: number) => {
        return (
          <span
            className="whitespace-pre relative flex"
            key={i}
            aria-hidden={true}
          >
            <motion.span className={`relative letter`} style={{ top: 0 }}>
              {letter}
            </motion.span>
            <motion.span
              className="absolute letter-secondary "
              style={{ top: reverse ? "-100%" : "100%" }}
            >
              {letter}
            </motion.span>
          </span>
        )
      })}
    </motion.span>
  )
}

export default LetterSwapPingPong
