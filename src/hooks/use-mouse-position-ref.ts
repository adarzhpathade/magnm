import { RefObject, useEffect, useRef } from "react"

export const useMousePositionRef = (
  containerRef?: RefObject<HTMLElement | SVGElement | null>
) => {
  const positionRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const updatePosition = (x: number, y: number) => {
      if (containerRef && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const relativeX = x - (rect.left + rect.width / 2)
        const relativeY = y - (rect.top + rect.height / 2)
        positionRef.current = { x: relativeX, y: relativeY }
      } else {
        const relativeX = x - window.innerWidth / 2
        const relativeY = y - window.innerHeight / 2
        positionRef.current = { x: relativeX, y: relativeY }
      }
    }

    const handleMouseMove = (ev: MouseEvent) => {
      updatePosition(ev.clientX, ev.clientY)
    }

    const handleTouchMove = (ev: TouchEvent) => {
      const touch = ev.touches[0]
      if (touch) {
        updatePosition(touch.clientX, touch.clientY)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("touchmove", handleTouchMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchmove", handleTouchMove)
    }
  }, [containerRef])

  return positionRef
}

export default useMousePositionRef
