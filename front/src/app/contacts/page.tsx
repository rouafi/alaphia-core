"use client"

import { useState } from "react"
import { Mail, MessageSquareText, Plus, Star, User, Phone, Calendar, CheckCircle2, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/Card"
import { PageHeader } from "@/components/ui/PageHeader"
import { Toolbar } from "@/components/ui/Toolbar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AlaphiaTable, type AlaphiaTableColumn } from "@/components/ui/AlaphiaTable"
import { DetailPanel, ContactField, CampaignSection } from "@/components/ui/DetailPanel"

type ContactRow = {
  id: string
  name: string
  company: string
  role: string
  segment: "Enterprise" | "Growth" | "Startup"
  lastTouch: string
  health: "Warm" | "Hot" | "Cold"
  email?: string
  phone?: string
  linkedInUrl?: string
  addedDate?: string
  campaignCount?: number
  campaignScore?: number
}

const contacts: ContactRow[] = [
  {
    id: "1",
    name: "Nora Campbell",
    company: "Linear",
    role: "VP Product",
    segment: "Enterprise",
    lastTouch: "2h ago",
    health: "Hot",
    email: "nora.campbell@linear.app",
    phone: "+1 (555) 123-4567",
    linkedInUrl: "https://linkedin.com/in/noracampbell",
    addedDate: "Oct. 7, 2025",
    campaignCount: 1,
    campaignScore: 24,
  },
  {
    id: "2",
    name: "Dev Patel",
    company: "Vercel",
    role: "Head of DX",
    segment: "Enterprise",
    lastTouch: "Yesterday",
    health: "Warm",
    email: "dev@vercel.com",
    phone: "+1 (555) 234-5678",
    linkedInUrl: "https://linkedin.com/in/devpatel",
    addedDate: "Oct. 5, 2025",
    campaignCount: 1,
    campaignScore: 23,
  },
  {
    id: "3",
    name: "Mina Okafor",
    company: "Mercury",
    role: "Design Lead",
    segment: "Growth",
    lastTouch: "3 days ago",
    health: "Cold",
    email: "mina@mercury.com",
    phone: "+1 (555) 345-6789",
    linkedInUrl: "https://linkedin.com/in/minaokafor",
    addedDate: "Oct. 3, 2025",
  },
  {
    id: "4",
    name: "Leo Fernandez",
    company: "Figma",
    role: "Collab PM",
    segment: "Enterprise",
    lastTouch: "5 days ago",
    health: "Warm",
    email: "leo@figma.com",
    phone: "+1 (555) 456-7890",
    linkedInUrl: "https://linkedin.com/in/leofernandez",
    addedDate: "Oct. 1, 2025",
    campaignCount: 1,
    campaignScore: 21,
  },
  {
    id: "5",
    name: "Sophia Keller",
    company: "Arcade",
    role: "Founder",
    segment: "Startup",
    lastTouch: "1 week ago",
    health: "Hot",
    email: "sophia@arcade.io",
    phone: "+1 (555) 567-8901",
    linkedInUrl: "https://linkedin.com/in/sophiakeller",
    addedDate: "Sep. 28, 2025",
    campaignCount: 1,
    campaignScore: 21,
  },
]

const segments = [
  { label: "Enterprise", value: "enterprise", trend: "+3 hot" },
  { label: "Growth", value: "growth", trend: "+1 warm" },
  { label: "Startup", value: "startup", trend: "stable" },
]

export default function ContactsPage() {
  const [selectedContact, setSelectedContact] = useState<ContactRow | null>(null)

  const handleRowClick = (contact: ContactRow) => {
    setSelectedContact(contact)
  }

  const handleClosePanel = () => {
    setSelectedContact(null)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((namePart) => namePart[0])
      .join("")
      .slice(0, 2)
  }

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
          return (
            <AlaphiaTable
              data={contacts}
              columns={columns}
              onRowClick={handleRowClick}
              selectedRowKey={selectedContact?.id}
              getRowKey={(row) => row.id}
            />
          )
        })()}
      </section>

      {/* Detail Panel */}
      <DetailPanel
        isOpen={selectedContact !== null}
        onClose={handleClosePanel}
        title={selectedContact?.name}
        subtitle={selectedContact?.role ? `${selectedContact.role} at ${selectedContact.company}` : undefined}
        avatar={
          selectedContact && (
            <Avatar className="size-10 border border-[var(--border)] bg-transparent">
              <AvatarFallback className="bg-[#3B82F6]/20 text-[var(--foreground)] text-sm">
                {getInitials(selectedContact.name)}
              </AvatarFallback>
            </Avatar>
          )
        }
        tabs={
          selectedContact
            ? [
                {
                  id: "general",
                  label: "General",
                  content: (
                    <div className="space-y-6">
                      {/* Campaign Section */}
                      {selectedContact.campaignCount !== undefined && (
                        <CampaignSection
                          title="Alaphia Campaign"
                          count={selectedContact.campaignCount}
                          status="Active"
                          score={selectedContact.campaignScore}
                          onShowSteps={() => console.log("Show steps")}
                        />
                      )}

                      {/* Contact Fields */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-[var(--foreground)]">
                            Contact fields
                          </h4>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="h-6 w-6 text-[var(--muted)] hover:text-[var(--foreground)]"
                            >
                              <Settings className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="h-6 w-6 text-[var(--muted)] hover:text-[var(--foreground)]"
                            >
                              <Plus className="size-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <ContactField
                            label="First Name"
                            value={selectedContact.name.split(" ")[0]}
                            icon={<User className="size-4" />}
                          />
                          <ContactField
                            label="Last Name"
                            value={selectedContact.name.split(" ").slice(1).join(" ")}
                            icon={<User className="size-4" />}
                          />
                          <ContactField
                            label="Emails"
                            value={selectedContact.email}
                            icon={<Mail className="size-4" />}
                            action={
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs text-[var(--muted)] hover:text-[var(--foreground)]"
                              >
                                <Plus className="mr-1 size-3" />
                                Add email
                              </Button>
                            }
                          />
                          {selectedContact.phone && (
                            <ContactField
                              label="Main phone"
                              value={selectedContact.phone}
                              icon={<Phone className="size-4" />}
                            />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-[var(--muted)] hover:text-[var(--foreground)]"
                          >
                            Show all
                          </Button>
                        </div>
                      </div>

                      {/* Integration Status */}
                      <div className="space-y-2 rounded-lg border border-[var(--border)] bg-[var(--surface-alt)] p-4">
                        <h4 className="text-sm font-semibold text-[var(--foreground)]">
                          HubSpot Profile
                        </h4>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="size-4 text-emerald-500" />
                          <span className="text-sm text-[var(--muted)]">Connected</span>
                        </div>
                      </div>

                      {/* Date Added */}
                      {selectedContact.addedDate && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="size-4 text-[var(--muted)]" />
                            <span className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">
                              Date added to Alaphia
                            </span>
                          </div>
                          <p className="text-sm text-[var(--foreground)]">
                            {selectedContact.addedDate}
                          </p>
                        </div>
                      )}
                    </div>
                  ),
                },
                {
                  id: "activities",
                  label: "Activities",
                  count: 0,
                  content: (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <p className="text-sm text-[var(--muted)]">No activities yet</p>
                    </div>
                  ),
                },
                {
                  id: "campaigns",
                  label: "Campaigns",
                  count: selectedContact.campaignCount ?? 0,
                  content: (
                    <div className="space-y-4">
                      {selectedContact.campaignCount !== undefined && selectedContact.campaignCount > 0 ? (
                        <CampaignSection
                          title="Alaphia Campaign"
                          count={selectedContact.campaignCount}
                          status="Active"
                          score={selectedContact.campaignScore}
                          onShowSteps={() => console.log("Show steps")}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <p className="text-sm text-[var(--muted)]">No campaigns yet</p>
                        </div>
                      )}
                    </div>
                  ),
                },
                {
                  id: "tasks",
                  label: "Tasks",
                  count: 0,
                  content: (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <p className="text-sm text-[var(--muted)]">No tasks yet</p>
                    </div>
                  ),
                },
                {
                  id: "signals",
                  label: "Signals",
                  content: (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <p className="text-sm text-[var(--muted)]">No signals yet</p>
                    </div>
                  ),
                },
              ]
            : undefined
        }
      />
    </div>
  )
}

