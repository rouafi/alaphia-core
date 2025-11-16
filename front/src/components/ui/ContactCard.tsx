"use client"

import { X } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// LinkedIn icon SVG
const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

// Color palette for avatars (same as ContactNode)
const avatarColors = [
  "#EF4444", // red
  "#F97316", // orange
  "#F59E0B", // amber
  "#EAB308", // yellow
  "#84CC16", // lime
  "#22C55E", // green
  "#10B981", // emerald
  "#14B8A6", // teal
  "#06B6D4", // cyan
  "#3B82F6", // blue
  "#6366F1", // indigo
  "#8B5CF6", // purple
  "#A855F7", // violet
  "#D946EF", // fuchsia
  "#EC4899", // pink
  "#F43F5E", // rose
]

// Generate a consistent color for a contact based on their name/ID
function getAvatarColor(identifier: string): string {
  let hash = 0
  for (let i = 0; i < identifier.length; i++) {
    hash = identifier.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % avatarColors.length
  return avatarColors[index]
}

// Get initials from name
function getInitials(firstName: string | null, lastName: string | null): string {
  const first = firstName?.charAt(0).toUpperCase() || ""
  const last = lastName?.charAt(0).toUpperCase() || ""
  return (first + last).slice(0, 2) || "?"
}

type ContactCardProps = {
  firstName: string | null
  lastName: string | null
  email: string | null
  company: string | null
  position: string | null
  url: string | null
  onClose: () => void
  className?: string
}

export function ContactCard({
  firstName,
  lastName,
  email,
  company,
  position,
  url,
  onClose,
  className,
}: ContactCardProps) {
  const fullName = `${firstName || ""} ${lastName || ""}`.trim() || "Unknown"
  const identifier = email || `${firstName}${lastName}` || "unknown"
  const color = getAvatarColor(identifier)
  const initials = getInitials(firstName, lastName)

  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--border)] bg-[var(--panel)] shadow-lg",
        "p-6 space-y-4 min-w-[280px]",
        className
      )}
    >
      {/* Header with close button */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1">
          <Avatar
            className="size-12 border-2 border-[var(--border)]"
            style={{ backgroundColor: color }}
          >
            <AvatarFallback className="text-white font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-[var(--foreground)] truncate">
                {fullName}
              </h3>
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 text-[#0077B5] hover:text-[#005885] transition-colors"
                  aria-label="LinkedIn profile"
                >
                  <LinkedInIcon className="size-5" />
                </a>
              )}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          className="h-6 w-6 text-[var(--muted)] hover:text-[var(--foreground)]"
        >
          <X className="size-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {email && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)] mb-1">
              Email
            </p>
            <p className="text-sm text-[var(--foreground)]">{email}</p>
          </div>
        )}

        {company && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)] mb-1">
              Company
            </p>
            <p className="text-sm text-[var(--foreground)]">{company}</p>
          </div>
        )}

        {position && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)] mb-1">
              Role
            </p>
            <p className="text-sm text-[var(--foreground)]">{position}</p>
          </div>
        )}
      </div>
    </div>
  )
}

