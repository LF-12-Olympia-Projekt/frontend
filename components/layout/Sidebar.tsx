// components/layout/Sidebar.tsx | Task: FE-005 | Role-based collapsible sidebar navigation
"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth, UserRole } from "@/lib/auth-context"
import { useTranslation } from "@/lib/locale-context"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Trophy,
  Medal,
  Dumbbell,
  LayoutDashboard,
  FileText,
  FilePlus,
  ClipboardCheck,
  Users,
  ShieldCheck,
  Blocks,
  ScrollText,
  Gem,
  PanelLeftClose,
  PanelLeft,
  LogOut,
  LogIn,
  PersonStanding,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

interface NavSection {
  items: NavItem[]
}

function useNavSections(locale: string, role: UserRole, dict: any): NavSection[] {
  const s = dict?.sidebar ?? {}

  // Public links – always visible
  const publicSection: NavSection = {
    items: [
      { label: s.results ?? "Results", href: `/${locale}/results`, icon: <Trophy className="h-4 w-4" /> },
      { label: s.medalTable ?? "Medal Table", href: `/${locale}/medals`, icon: <Medal className="h-4 w-4" /> },
      { label: s.sports ?? "Sports", href: `/${locale}/sports`, icon: <Dumbbell className="h-4 w-4" /> },
    ],
  }

  if (role !== "judge" && role !== "admin") return [publicSection]

  // Judge links
  const judgeSection: NavSection = {
    items: [
      { label: s.myDashboard ?? "My Dashboard", href: `/${locale}/judge/dashboard`, icon: <LayoutDashboard className="h-4 w-4" /> },
      { label: s.myResults ?? "My Results", href: `/${locale}/judge/results`, icon: <FileText className="h-4 w-4" /> },
      { label: s.newResult ?? "New Result", href: `/${locale}/judge/results/new`, icon: <FilePlus className="h-4 w-4" /> },
      { label: s.reviewQueue ?? "Review Queue", href: `/${locale}/judge/review`, icon: <ClipboardCheck className="h-4 w-4" /> },
    ],
  }

  if (role === "judge") return [publicSection, judgeSection]

  // Admin links
  const adminSection: NavSection = {
    items: [
      { label: s.adminDashboard ?? "Admin Dashboard", href: `/${locale}/admin/dashboard`, icon: <ShieldCheck className="h-4 w-4" /> },
      { label: s.userManagement ?? "User Management", href: `/${locale}/admin/users`, icon: <Users className="h-4 w-4" /> },
      { label: s.athleteManagement ?? "Athleten-Verwaltung", href: `/${locale}/admin/athletes`, icon: <PersonStanding className="h-4 w-4" /> },
      { label: s.resultManagement ?? "Result Management", href: `/${locale}/admin/results`, icon: <FileText className="h-4 w-4" /> },
      { label: s.sportTemplates ?? "Sport Templates", href: `/${locale}/admin/templates`, icon: <Blocks className="h-4 w-4" /> },
      { label: s.auditLog ?? "Audit Log", href: `/${locale}/admin/audit`, icon: <ScrollText className="h-4 w-4" /> },
      { label: s.medalAssets ?? "Medal Assets", href: `/${locale}/admin/assets`, icon: <Gem className="h-4 w-4" /> },
    ],
  }

  return [publicSection, judgeSection, adminSection]
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated, role, user, logout } = useAuth()
  const { dictionary, locale } = useTranslation()

  const sections = useNavSections(locale, role, dictionary)

  const isActive = (href: string) => {
    // Exact match or starts-with for nested routes
    if (pathname === href) return true
    // For section roots like /judge/results, match child routes too
    if (href !== `/${locale}/results` && pathname.startsWith(href + "/")) return true
    return false
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Nav sections */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
        {sections.map((section, si) => (
          <div key={si}>
            {si > 0 && <Separator className="my-3" />}
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
                title={collapsed ? item.label : undefined}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer: auth action */}
      <div className="border-t px-2 py-3">
        {isAuthenticated ? (
          <div className="space-y-2">
            {!collapsed && user && (
              <p className="truncate px-3 text-xs text-muted-foreground">
                {user.username}
              </p>
            )}
            <button
              onClick={() => { logout(); setMobileOpen(false) }}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              title={collapsed ? (dictionary?.sidebar?.logout ?? "Logout") : undefined}
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>{dictionary?.sidebar?.logout ?? "Logout"}</span>}
            </button>
          </div>
        ) : (
          <Link
            href={`/${locale}/login`}
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            title={collapsed ? (dictionary?.sidebar?.login ?? "Login") : undefined}
          >
            <LogIn className="h-4 w-4" />
            {!collapsed && <span>{dictionary?.sidebar?.login ?? "Login"}</span>}
          </Link>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-3 top-3 z-50 md:hidden"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Toggle sidebar"
      >
        <PanelLeft className="h-5 w-5" />
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r bg-background transition-transform duration-200 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex md:flex-col md:border-r md:bg-background transition-all duration-200",
          collapsed ? "md:w-14" : "md:w-56"
        )}
      >
        {/* Collapse toggle */}
        <div className="flex items-center justify-end border-b px-2 py-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        </div>
        {sidebarContent}
      </aside>
    </>
  )
}
