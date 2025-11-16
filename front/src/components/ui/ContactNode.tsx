"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

// Color palette for avatars (similar to Claap/Juno style)
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

type ContactNodeData = {
  firstName: string | null
  lastName: string | null
  email: string | null
  company: string | null
  position?: string | null
  url?: string | null
  isCurrentUser?: boolean
}

export const ContactNode = memo(({ data }: NodeProps<ContactNodeData>) => {
  const initials = getInitials(data.firstName, data.lastName)
  const identifier = data.email || `${data.firstName}${data.lastName}` || "unknown"
  const color = getAvatarColor(identifier)
  const size = data.isCurrentUser ? 80 : 60

  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-0" />
      <div
        className={cn(
          "flex items-center justify-center rounded-full border-2 transition-all hover:scale-110",
          data.isCurrentUser
            ? "border-[#3B82F6] shadow-lg shadow-[#3B82F6]/20"
            : "border-white/10 shadow-md cursor-pointer"
        )}
        style={{
          width: size,
          height: size,
          backgroundColor: color,
        }}
      >
        <span className="text-lg font-semibold text-white">{initials}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0" />
    </div>
  )
})

ContactNode.displayName = "ContactNode"

