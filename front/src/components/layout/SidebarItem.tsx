"use client"

import Link from "next/link"
import { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type SidebarItemProps = {
  icon: LucideIcon
  label: string
  href: string
  badge?: string
  collapsed?: boolean
  isActive?: boolean
}

export function SidebarItem({
  icon: Icon,
  label,
  href,
  badge,
  collapsed = false,
  isActive = false,
}: SidebarItemProps) {
  return (
    <Button
      asChild
      variant="ghost"
      size="sm"
      className={cn(
        "group relative w-full justify-start gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-150",
        "text-[color:var(--foreground)]/70",
        "hover:bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)] hover:text-[var(--foreground)]",
        isActive &&
          "bg-[color-mix(in_srgb,var(--foreground)_10%,transparent)] text-[var(--foreground)]",
        collapsed && "justify-center px-0"
      )}
    >
      <Link href={href} className="flex w-full items-center gap-3">
        <span
          className={cn(
            "absolute left-0 top-1/2 h-6 -translate-y-1/2 rounded-full bg-[var(--accent)] transition-all duration-150",
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-70",
            "w-[3px]"
          )}
        />
        <Icon className="size-5 text-[color:var(--foreground)]/60 transition group-hover:text-[var(--foreground)]" />
        {!collapsed && (
          <>
            <span className="truncate">{label}</span>
            {badge && (
              <span className="ml-auto rounded-full border border-[var(--border)] bg-[var(--surface-alt)] px-2 py-0.5 text-xs font-semibold text-[color:var(--foreground)]/80">
                {badge}
              </span>
            )}
          </>
        )}
      </Link>
    </Button>
  )
}

