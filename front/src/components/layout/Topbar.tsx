"use client"

import {
  Bell,
  HelpCircle,
  Menu,
  Plus,
  Sparkles,
  TrendingUp,
} from "lucide-react"

import { useAuth0 } from "@auth0/auth0-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/ui/ThemeToggle"

type TopbarProps = {
  collapsed?: boolean
  onToggleSidebar?: () => void
}

export function Topbar({ collapsed = false, onToggleSidebar }: TopbarProps) {
  const { user, isAuthenticated, logout } = useAuth0()

  const fallbackInitials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "WS"

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_95%,transparent)] backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-md border border-white/5 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
            onClick={onToggleSidebar}
          >
            <Menu className="size-5" />
          </Button>
          <div className="hidden md:flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-white/50">
              Product Team
            </span>
            <span className="text-base font-semibold text-white">
              Sprint 28 · Voice AI
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[color:var(--foreground)]/70 shadow-inner md:flex lg:w-80">
            <Sparkles className="mr-2 size-4 text-[var(--accent-secondary)]" />
            <Input
              type="search"
              placeholder="Search recordings, contacts, or notes"
              className="h-6 w-full border-0 bg-transparent p-0 text-sm placeholder:opacity-40 focus-visible:ring-0"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-md border border-[var(--border)] text-[color:var(--foreground)]/70 hover:text-[var(--foreground)]"
          >
            <TrendingUp className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden rounded-md border border-[var(--border)] text-[color:var(--foreground)]/70 hover:text-[var(--foreground)] lg:flex"
          >
            <HelpCircle className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-md border border-[var(--border)] text-[color:var(--foreground)]/70 hover:text-[var(--foreground)]"
          >
            <Bell className="size-4" />
          </Button>
          <Button className="hidden h-9 rounded-md bg-[var(--accent)] px-4 text-sm font-medium text-[var(--color-primary-foreground,#fff)] hover:brightness-110 md:inline-flex">
            <Plus className="mr-2 size-4" />
            New Recording
          </Button>

          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-left text-sm text-[color:var(--foreground)]/70 hover:bg-[color-mix(in_srgb,var(--foreground)_5%,transparent)]">
                <Avatar className="size-9 border border-[var(--border)]">
                  {isAuthenticated && user?.picture ? (
                    <AvatarImage
                      src={user.picture}
                      alt={user.name || "User avatar"}
                    />
                  ) : null}
                  <AvatarFallback className="bg-[color-mix(in_srgb,var(--accent)_20%,transparent)] text-[var(--foreground)]">
                    {fallbackInitials}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "hidden text-left md:block",
                    collapsed && "md:hidden"
                  )}
                >
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {isAuthenticated ? user?.name : "Guest"}
                  </p>
                  <p className="text-xs opacity-50 text-[var(--foreground)]">
                    {isAuthenticated ? user?.email : "Not signed in"}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]"
            >
              <DropdownMenuLabel className="text-[var(--foreground)]">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[var(--divider)]" />
              <DropdownMenuItem className="text-[color:var(--foreground)]/80">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[color:var(--foreground)]/80">
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[color:var(--foreground)]/80">
                Workspace settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[var(--divider)]" />
              <DropdownMenuItem
                className="text-danger"
                onSelect={(event) => {
                  event.preventDefault()
                  logout({ logoutParams: { returnTo: window.location.origin } })
                }}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

