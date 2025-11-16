"use client"

import { Mail, MessageSquareText, Plus, Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/Card"
import { PageHeader } from "@/components/ui/PageHeader"
import { Toolbar } from "@/components/ui/Toolbar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AlaphiaTable, type AlaphiaTableColumn } from "@/components/ui/AlaphiaTable"

type ContactRow = {
  name: string
  company: string
  role: string
  segment: "Enterprise" | "Growth" | "Startup"
  lastTouch: string
  health: "Warm" | "Hot" | "Cold"
}

const contacts: ContactRow[] = [
  {
    name: "Nora Campbell",
    company: "Linear",
    role: "VP Product",
    segment: "Enterprise",
    lastTouch: "2h ago",
    health: "Hot",
  },
  {
    name: "Dev Patel",
    company: "Vercel",
    role: "Head of DX",
    segment: "Enterprise",
    lastTouch: "Yesterday",
    health: "Warm",
  },
  {
    name: "Mina Okafor",
    company: "Mercury",
    role: "Design Lead",
    segment: "Growth",
    lastTouch: "3 days ago",
    health: "Cold",
  },
  {
    name: "Leo Fernandez",
    company: "Figma",
    role: "Collab PM",
    segment: "Enterprise",
    lastTouch: "5 days ago",
    health: "Warm",
  },
  {
    name: "Sophia Keller",
    company: "Arcade",
    role: "Founder",
    segment: "Startup",
    lastTouch: "1 week ago",
    health: "Hot",
  },
]

const segments = [
  { label: "Enterprise", value: "enterprise", trend: "+3 hot" },
  { label: "Growth", value: "growth", trend: "+1 warm" },
  { label: "Startup", value: "startup", trend: "stable" },
]

export default function ContactsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Contacts"
        description="Follow every champion, buyer, and user tester interacting with Aphilia."
        actions={
          <div className="flex gap-2">
            <Button variant="ghost" className="text-white/70 hover:text-white">
              Import CSV
            </Button>
            <Button className="bg-[#3B82F6] text-white hover:bg-[#3B82F6]/90">
              <Plus className="mr-2 size-4" />
              New contact
            </Button>
          </div>
        }
      />

      <Toolbar
        filters={[
          { label: "All", value: "all", count: 128 },
          { label: "Champions", value: "champions", count: 22 },
          { label: "Buyers", value: "buyers", count: 14 },
          { label: "Stakeholders", value: "stakeholders", count: 9 },
        ]}
        searchPlaceholder="Search contacts"
        actions={
          <Button
            variant="ghost"
            className="rounded-lg border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
          >
            <Star className="mr-2 size-4 text-amber-300" />
            Smart lists
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {segments.map((segment) => (
          <Card
            key={segment.value}
            title={segment.label}
            description="Active cycle"
            padding="md"
            actions={
              <Badge className="border-white/10 bg-white/5 text-xs text-white/60">
                {segment.trend}
              </Badge>
            }
          >
            <p className="text-3xl font-semibold text-[var(--foreground)]">
              {segment.value === "enterprise"
                ? "58"
                : segment.value === "growth"
                  ? "41"
                  : "29"}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
              Opportunities
            </p>
          </Card>
        ))}
      </div>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-[var(--foreground)]">
            <p className="text-sm font-semibold">Active relationships</p>
            <p className="text-sm opacity-70">
              Aphilia-style slim table with health, segments, and touchpoints.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" className="text-[color:var(--foreground)]/70 hover:text-[var(--foreground)]">
              <Mail className="mr-2 size-4" />
              Sequence
            </Button>
            <Button className="border border-[var(--border)] bg-[var(--surface-alt)] text-[var(--foreground)] hover:bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)]">
              <MessageSquareText className="mr-2 size-4" />
              Share recap
            </Button>
          </div>
        </div>

        {(() => {
          const columns: AlaphiaTableColumn<ContactRow>[] = [
            {
              key: "name",
              label: "Contact",
              render: (contact) => (
                <div className="flex items-center gap-3">
                  <Avatar className="size-8 border border-white/10 bg-transparent">
                    <AvatarFallback className="bg-[#3B82F6]/20 text-white text-xs">
                      {contact.name
                        .split(" ")
                        .map((namePart) => namePart[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-[var(--table-foreground)]">
                      {contact.name}
                    </p>
                    <p className="text-xs text-[var(--muted)]">{contact.role}</p>
                  </div>
                </div>
              ),
            },
            {
              key: "company",
              label: "Company",
              className: "text-sm font-medium text-[var(--table-foreground)]",
            },
            {
              key: "segment",
              label: "Segment",
              render: (contact) => (
                <Badge className="rounded-full border border-slate-700/70 bg-slate-800/70 px-3 py-0.5 text-xs font-medium text-slate-200">
                  {contact.segment}
                </Badge>
              ),
            },
            {
              key: "health",
              label: "Health",
              render: (contact) => (
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold ${
                    contact.health === "Hot"
                      ? "border-rose-400/50 bg-rose-500/10 text-rose-200"
                      : contact.health === "Warm"
                        ? "border-amber-400/50 bg-amber-500/10 text-amber-200"
                        : "border-slate-600 bg-slate-800 text-slate-300"
                  }`}
                >
                  {contact.health}
                </span>
              ),
            },
            {
              key: "lastTouch",
              label: "Last touch",
              className: "text-sm font-medium text-[var(--table-foreground)]",
            },
          ]
          return <AlaphiaTable data={contacts} columns={columns} />
        })()}
      </section>
    </div>
  )
}

