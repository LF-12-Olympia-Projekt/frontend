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

      sectionsRef.current.forEach((section, index) => {
        if (!section) return

        const sectionTop = section.offsetTop
        const sectionHeight = section.offsetHeight
        const sectionBottom = sectionTop + sectionHeight
        
        // Calculate position relative to viewport
        const viewportTop = scrollPosition
        const viewportBottom = scrollPosition + windowHeight
        
        // Calculate how much of the section is visible
        const visibleTop = Math.max(viewportTop, sectionTop)
        const visibleBottom = Math.min(viewportBottom, sectionBottom)
        const visibleHeight = Math.max(0, visibleBottom - visibleTop)
        const visibilityRatio = visibleHeight / windowHeight
        
        // Calculate distance from center
        const sectionCenter = sectionTop + sectionHeight / 2
        const viewportCenter = scrollPosition + windowHeight / 2
        const distanceFromCenter = sectionCenter - viewportCenter
        const normalizedDistance = distanceFromCenter / windowHeight
        
        // Enhanced scale effect (0.75 to 1)
        const scale = Math.max(0.75, 1 - Math.abs(normalizedDistance) * 0.25)
        
        // Enhanced opacity effect (0.2 to 1)
        const opacity = Math.max(0.2, 1 - Math.abs(normalizedDistance) * 0.8)
        
        // Depth effect with translateZ and rotateX for more drama
        const translateZ = normalizedDistance * -400
        const translateY = normalizedDistance * 50
        const rotateX = normalizedDistance * 5 // Subtle rotation
        
        // Blur effect for sections further away
        const blur = Math.abs(normalizedDistance) * 3
        
        section.style.transform = `
          scale(${scale}) 
          translateZ(${translateZ}px) 
          translateY(${translateY}px)
          rotateX(${rotateX}deg)
        `
        section.style.opacity = `${opacity}`
        section.style.filter = `blur(${blur}px)`
      })
    }

    container.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => {
      container.removeEventListener("scroll", handleScroll)
    }
  }, [children])

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroll-sections-container overflow-y-scroll snap-y snap-mandatory scroll-smooth",
        className
      )}
      style={{
        height: "calc(100vh - 4rem)",
        perspective: "1500px",
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
            className="snap-center snap-always transition-all duration-500 ease-out"
            style={{
              minHeight: "100vh",
              transformStyle: "preserve-3d",
              willChange: "transform, opacity, filter",
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}