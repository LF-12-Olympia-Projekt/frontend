"use client"

import React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface PageWrapperProps {
    children: React.ReactNode
}

export function PageWrapper({ children }: PageWrapperProps) {
    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    )
}
