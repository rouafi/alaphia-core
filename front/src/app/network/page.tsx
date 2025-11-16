"use client"

import { useMemo, useState } from "react"
import ReactFlow, {
  Background,
  Controls,
  type Edge,
  type Node,
} from "reactflow"

import "reactflow/dist/style.css"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/Card"
import { PageHeader } from "@/components/ui/PageHeader"
import { ContactNode } from "@/components/ui/ContactNode"
import { useContacts } from "@/lib/api/hooks/useContacts"
import { Slider } from "@/components/ui/slider"

// Current user data (from seed)
const CURRENT_USER = {
  id: "00000000-0000-0000-0000-000000000000",
  firstName: "Reda",
  lastName: "Ouafi",
  email: "redha.ouafi@gmail.com",
}

// Calculate positions in a circle around the center
function calculateCirclePositions(
  count: number,
  radius: number,
  centerX: number = 0,
  centerY: number = 0
): Array<{ x: number; y: number }> {
  const positions: Array<{ x: number; y: number }> = []
  const angleStep = (2 * Math.PI) / count

  for (let i = 0; i < count; i++) {
    const angle = i * angleStep
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    positions.push({ x, y })
  }

  return positions
}

const nodeTypes = {
  contact: ContactNode,
}

export default function NetworkPage() {
  const [relationshipCount, setRelationshipCount] = useState(50)

  // Fetch contacts - we need all contacts to filter and order them
  // Don't pass pagination params to get all contacts, or fetch multiple pages
  const { data: contactsData, isLoading, error } = useContacts()

  // Process contacts: extract array, sort by newest first, take the requested count
  const contacts = useMemo(() => {
    if (!contactsData) return []

    // Handle both paginated and non-paginated responses
    let contactsArray: any[] = []
    
    if (Array.isArray(contactsData)) {
      // Non-paginated response - array of contacts (when no pagination params)
      contactsArray = contactsData
    } else if (contactsData && typeof contactsData === 'object' && 'data' in contactsData) {
      // Paginated response - extract data array
      contactsArray = (contactsData as any).data || []
    }

    if (contactsArray.length === 0) return []

    // Sort by createdAt DESC (newest first)
    const sorted = [...contactsArray].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return dateB - dateA
    })

    // Take the requested count
    return sorted.slice(0, relationshipCount)
  }, [contactsData, relationshipCount])

  // Create nodes: center user + contacts in a circle
  const nodes = useMemo(() => {
    const centerNode: Node = {
      id: CURRENT_USER.id,
      type: "contact",
      position: { x: 0, y: 0 },
      data: {
        firstName: CURRENT_USER.firstName,
        lastName: CURRENT_USER.lastName,
        email: CURRENT_USER.email,
        isCurrentUser: true,
      },
    }

    // Calculate positions in a circle
    const radius = Math.max(200, Math.sqrt(contacts.length) * 30)
    const positions = calculateCirclePositions(contacts.length, radius)

    const contactNodes: Node[] = contacts.map((contact, index) => ({
      id: contact.id,
      type: "contact",
      position: positions[index],
      data: {
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        company: contact.company,
        isCurrentUser: false,
      },
    }))

    return [centerNode, ...contactNodes]
  }, [contacts])

  // Create edges from center to all contacts
  const edges = useMemo<Edge[]>(() => {
    return contacts.map((contact) => ({
      id: `edge-${CURRENT_USER.id}-${contact.id}`,
      source: CURRENT_USER.id,
      target: contact.id,
      type: "smoothstep",
      animated: true,
      style: {
        stroke: "rgba(59,130,246,0.3)",
        strokeWidth: 1.5,
      },
    }))
  }, [contacts])

  return (
    <div className="space-y-8">
      <PageHeader
        title="Network graph"
        description="Visualize how champions, buyers, and advisors connect across your Aphilia workspace."
        actions={
          <Button className="bg-[#3B82F6] text-white hover:bg-[#3B82F6]/90">
            Sync CRM
          </Button>
        }
      />

      <Card className="p-0">
        <div className="border-b border-white/5 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Relationship map</p>
              <p className="text-sm text-white/60">
                Your network visualized. Drag nodes to explore connections.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 min-w-[200px]">
                <label className="text-xs font-medium text-white/70 whitespace-nowrap">
                  Show {relationshipCount} relationships
                </label>
                <Slider
                  value={[relationshipCount]}
                  onValueChange={(value) => setRelationshipCount(value[0])}
                  min={10}
                  max={100}
                  step={10}
                  className="w-32"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="reactflow-wrapper h-[640px] w-full bg-[#020617]">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-white/60">Loading network...</p>
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-red-400">
                Error loading contacts: {error instanceof Error ? error.message : "Unknown error"}
              </p>
            </div>
          ) : contacts.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-white/60">No contacts found. Import contacts to see your network.</p>
            </div>
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              style={{
                background: "linear-gradient(135deg, #020617 0%, #0F172A 100%)",
              }}
            >
              <Background
                gap={24}
                size={1}
                color="rgba(148,163,184,0.25)"
              />
              <Controls
                className="!bg-[#111827]/80 !text-white"
                showInteractive={false}
              />
            </ReactFlow>
          )}
        </div>
      </Card>
    </div>
  )
}

