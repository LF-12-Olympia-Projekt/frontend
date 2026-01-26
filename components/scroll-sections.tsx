"use client"

import { ReactNode, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface ScrollSectionsProps {
  children: ReactNode[]
  className?: string
}

export function ScrollSections({ children, className }: ScrollSectionsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollPosition = container.scrollTop
      const windowHeight = container.clientHeight

      sectionsRef.current.forEach((section) => {
        if (!section) return

        const sectionTop = section.offsetTop
        const sectionHeight = section.offsetHeight
        
        // Calculate distance from center
        const sectionCenter = sectionTop + sectionHeight / 2
        const viewportCenter = scrollPosition + windowHeight / 2
        const distanceFromCenter = sectionCenter - viewportCenter
        const normalizedDistance = Math.min(Math.max(distanceFromCenter / windowHeight, -1.5), 1.5)
        
        // Subtle scale effect (0.92 to 1)
        const scale = 1 - Math.abs(normalizedDistance) * 0.08
        
        // Subtle opacity effect (0.6 to 1)
        const opacity = Math.max(0.6, 1 - Math.abs(normalizedDistance) * 0.4)
        
        // Subtle depth effect
        const translateZ = normalizedDistance * -150
        const translateY = normalizedDistance * 20
        
        section.style.transform = `scale(${scale}) translateZ(${translateZ}px) translateY(${translateY}px)`
        section.style.opacity = `${opacity}`
      })
    }

    // Use requestAnimationFrame for smoother performance
    let ticking = false
    const optimizedHandleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    container.addEventListener("scroll", optimizedHandleScroll, { passive: true })
    handleScroll() // Initial call

    return () => {
      container.removeEventListener("scroll", optimizedHandleScroll)
    }
  }, [children])

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroll-sections-container overflow-y-scroll",
        className
      )}
      style={{
        height: "calc(100vh - 4rem)",
        perspective: "1200px",
        perspectiveOrigin: "50% 50%",
      }}
    >
      <div className="relative" style={{ transformStyle: "preserve-3d" }}>
        {children.map((child, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) sectionsRef.current[index] = el
            }}
            className="transition-all duration-300 ease-out"
            style={{
              minHeight: "100vh",
              transformStyle: "preserve-3d",
              willChange: "transform, opacity",
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}