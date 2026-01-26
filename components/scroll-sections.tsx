"use client"

import { ReactNode, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface ScrollSectionsProps {
  children: ReactNode[]
  className?: string
}

const sectionBackgrounds = [
  "bg-gradient-to-b from-background to-muted/30", // Hero
  "bg-background", // Sports
  "bg-muted/50", // Live Results
  "bg-background", // Medal Table
  "bg-muted/50", // Highlights
]

export function ScrollSections({ children, className }: ScrollSectionsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionsRef = useRef<HTMLDivElement[]>([])
  const contentRefs = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollPosition = container.scrollTop
      const windowHeight = container.clientHeight

      contentRefs.current.forEach((content) => {
        if (!content) return

        const section = content.parentElement
        if (!section) return

        const sectionTop = section.offsetTop
        const sectionHeight = section.offsetHeight
        
        // Calculate distance from center
        const sectionCenter = sectionTop + sectionHeight / 2
        const viewportCenter = scrollPosition + windowHeight / 2
        const distanceFromCenter = sectionCenter - viewportCenter
        const normalizedDistance = Math.min(Math.max(distanceFromCenter / windowHeight, -1.5), 1.5)
        
        // Subtle scale effect (0.94 to 1)
        const scale = 1 - Math.abs(normalizedDistance) * 0.06
        
        // Subtle opacity effect (0.7 to 1)
        const opacity = Math.max(0.7, 1 - Math.abs(normalizedDistance) * 0.3)
        
        // Subtle depth effect
        const translateZ = normalizedDistance * -100
        
        content.style.transform = `scale(${scale}) translateZ(${translateZ}px)`
        content.style.opacity = `${opacity}`
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
            className={cn("relative", sectionBackgrounds[index])}
            style={{
              minHeight: "100vh",
            }}
          >
            <div
              ref={(el) => {
                if (el) contentRefs.current[index] = el
              }}
              className="transition-all duration-300 ease-out"
              style={{
                transformStyle: "preserve-3d",
                willChange: "transform, opacity",
              }}
            >
              {child}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}