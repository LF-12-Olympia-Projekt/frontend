"use client"

import { ReactNode } from "react"
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
  return (
    <div
      className={cn("overflow-y-auto", className)}
      style={{ height: "calc(100vh - 4rem)" }}
    >
      {children.map((child, index) => (
        <div
          key={index}
          className={cn("relative", sectionBackgrounds[index])}
          style={{ minHeight: "100vh" }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}