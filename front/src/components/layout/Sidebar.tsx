"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  Command,
  FolderKanban,
  LayoutDashboard,
  LineChart,
  MessageSquare,
  Settings2,
  Share2,
  Users,
  Video,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SidebarItem } from "@/components/layout/SidebarItem"
import { cn } from "@/lib/utils"

const primaryNav = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Contacts", icon: Users, href: "/contacts", badge: "24" },
]

const secondaryNav = [
  { label: "Network", icon: Share2, href: "/network" },
  { label: "Settings", icon: Settings2, href: "/settings/account" },
  { label: "Automation", icon: Command, href: "/automation" },
]

type SidebarProps = {
  collapsed?: boolean
  onToggleSidebar?: () => void
}

export function Sidebar({
  collapsed = false,
  onToggleSidebar,
}: SidebarProps) {
  const pathname = usePathname()

  const renderSection = (
    items: typeof primaryNav,
    sectionLabel: string
  ) => (
    <div>
      {!collapsed && (
        <p className="px-5 pb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--foreground)]/60">
          {sectionLabel}
        </p>
      )}
      <div className="space-y-1">
        {items.map((item) => (
          <SidebarItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            href={item.href}
            badge={item.badge}
            collapsed={collapsed}
            isActive={
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href)
            }
          />
        ))}
      </div>
    </div>
  )

  return (
    <aside
      className={cn(
        "hidden h-screen border-r border-[var(--border)] bg-[var(--panel)] text-sm tracking-tight lg:flex",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      <div className="flex w-full flex-col gap-6 py-6">
        <div
          className={cn(
            "flex items-center gap-3 px-5 text-left",
            collapsed && "justify-center px-0"
          )}
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--foreground)_10%,transparent)] text-lg font-semibold text-[var(--foreground)]">
            C
          </div>

          {!collapsed && (
            <div>
              <p className="text-sm font-semibold text-white">Aphilia Studio</p>
              <p className="text-xs text-white/60">Workspace</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            className="ml-auto rounded-md text-white/60 hover:text-white"
            onClick={onToggleSidebar}
          >
            {collapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <ChevronLeft className="size-4" />
            )}
          </Button>
        </div>

        <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-2">
          {renderSection(primaryNav, "Workspace")}
          {renderSection(secondaryNav, "Library")}
        </nav>

        <div className="space-y-3 px-4">
          <div className="rounded-xl border border-white/5 bg-[#1A2234] p-4">
            {!collapsed && (
              <>
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  Upgrade to Pro
                </p>
                <p className="text-xs opacity-60 text-[var(--foreground)]">
                  Unlock AI insights and unlimited recordings.
                </p>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "mt-3 w-full border-[var(--border)] bg-[color-mix(in_srgb,var(--foreground)_5%,transparent)] text-[var(--foreground)] hover:bg-[color-mix(in_srgb,var(--foreground)_10%,transparent)]",
                collapsed && "mt-0 text-xs"
              )}
            >
              {collapsed ? "Pro" : "Upgrade"}
            </Button>
          </div>

          <Link
            href="/settings/account"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--foreground)]/80 hover:bg-[color-mix(in_srgb,var(--foreground)_8%,transparent)]",
              collapsed && "justify-center px-0"
            )}
          >
            <Avatar className="size-8 border border-[var(--border)]">
              <AvatarFallback className="bg-[color-mix(in_srgb,var(--accent)_30%,transparent)] text-[var(--foreground)]">
                RS
              </AvatarFallback>
            </Avatar>

            {!collapsed && (
              <div>
                <p className="text-sm font-semibold text-[var(--foreground)]">Reda Saad</p>
                <p className="text-xs opacity-60 text-[var(--foreground)]">Product Design</p>
              </div>
            )}
          </Link>
        </div>
      </div>
    </aside>
  )
}

