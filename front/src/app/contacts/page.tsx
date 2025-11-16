"use client"

import { useState, useMemo } from "react"
import { Mail, MessageSquareText, Plus, Star, User, Phone, Calendar, CheckCircle2, Settings } from "lucide-react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/Card"
import { PageHeader } from "@/components/ui/PageHeader"
import { Toolbar } from "@/components/ui/Toolbar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AlaphiaTable, type AlaphiaTableColumn } from "@/components/ui/AlaphiaTable"
import { DetailPanel, ContactField, CampaignSection } from "@/components/ui/DetailPanel"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useContacts } from "@/lib/api/hooks/useContacts"
import type { Contact, PaginatedContactsResponse } from "@/lib/api/contacts"
import { ApiError } from "@/lib/api/client"

type ContactRow = Contact & {
  name: string
  role: string
  segment: "Enterprise" | "Growth" | "Startup"
  lastTouch: string
  health: "Warm" | "Hot" | "Cold"
  phone?: string
  addedDate?: string
  campaignCount?: number
  campaignScore?: number
}

// Helper function to generate fake segment based on company
function getFakeSegment(company: string | null): "Enterprise" | "Growth" | "Startup" {
  if (!company) return "Startup"
  const hash = company.length % 3
  return hash === 0 ? "Enterprise" : hash === 1 ? "Growth" : "Startup"
}

// Helper function to generate fake health based on contact data
function getFakeHealth(contact: Contact): "Warm" | "Hot" | "Cold" {
  // Use id hash to determine health
  const hash = contact.id.charCodeAt(0) % 3
  return hash === 0 ? "Hot" : hash === 1 ? "Warm" : "Cold"
}

// Helper function to format last touch (using createdAt for now)
function getLastTouch(createdAt: string): string {
  const date = new Date(createdAt)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return format(date, "MMM d, yyyy")
}

const segments = [
  { label: "Enterprise", value: "enterprise", trend: "+3 hot" },
  { label: "Growth", value: "growth", trend: "+1 warm" },
  { label: "Startup", value: "startup", trend: "stable" },
]

export default function ContactsPage() {
  const [selectedContact, setSelectedContact] = useState<ContactRow | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  // Fetch contacts with pagination
  const { data, isLoading, error } = useContacts({
    page: currentPage,
    limit: pageSize,
  })

  // Transform API data to ContactRow format
  const contactsData = useMemo(() => {
    if (!data) return { contacts: [], pagination: null }
    
    const isPaginated = !Array.isArray(data) && 'data' in data
    const contacts = isPaginated ? (data as PaginatedContactsResponse).data : (data as Contact[])
    const pagination = isPaginated ? (data as PaginatedContactsResponse) : null

    const transformedContacts: ContactRow[] = contacts.map((contact) => ({
      ...contact,
      name: `${contact.firstName || ""} ${contact.lastName || ""}`.trim() || "Unknown",
      role: contact.position || "Unknown",
      segment: getFakeSegment(contact.company),
      lastTouch: getLastTouch(contact.createdAt),
      health: getFakeHealth(contact),
      addedDate: format(new Date(contact.createdAt), "MMM d, yyyy"),
      campaignCount: Math.random() > 0.5 ? 1 : undefined,
      campaignScore: Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 15 : undefined,
    }))

    return { contacts: transformedContacts, pagination }
  }, [data])

  const handleRowClick = (contact: ContactRow) => {
    setSelectedContact(contact)
  }

  const handleClosePanel = () => {
    setSelectedContact(null)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
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

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="analytics" className="border border-[var(--border)] rounded-xl bg-[var(--panel)] px-4">
          <AccordionTrigger className="text-sm font-semibold text-[var(--foreground)] hover:no-underline py-3">
            Analytics Overview
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4 md:grid-cols-3 pb-4">
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <section className="space-y-4 w-full">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-[var(--foreground)]">
            <p className="text-sm font-semibold">Active relationships</p>
            <p className="text-sm opacity-70">
              {contactsData.pagination
                ? `Showing ${contactsData.contacts.length} of ${contactsData.pagination.total} contacts`
                : "Aphilia-style slim table with health, segments, and touchpoints."}
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

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-[var(--muted)]">Loading contacts...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-red-400">
              Error: {error instanceof ApiError ? error.message : "Failed to load contacts"}
            </p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="overflow-x-auto">
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
                  key: "email",
                  label: "Email",
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
                  data={contactsData.contacts}
                  columns={columns}
                  onRowClick={handleRowClick}
                  selectedRowKey={selectedContact?.id}
                  getRowKey={(row) => row.id}
                  page={contactsData.pagination ? currentPage : undefined}
                  pageSize={contactsData.pagination ? pageSize : undefined}
                  onPageChange={handlePageChange}
                  showPagination={!!contactsData.pagination}
                  totalItems={contactsData.pagination?.total}
                  totalPages={contactsData.pagination?.totalPages}
                />
              )
            })()}
          </div>
        )}
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
                            value={selectedContact.firstName || undefined}
                            icon={<User className="size-4" />}
                          />
                          <ContactField
                            label="Last Name"
                            value={selectedContact.lastName || undefined}
                            icon={<User className="size-4" />}
                          />
                          <ContactField
                            label="Emails"
                            value={selectedContact.email || undefined}
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
                          {selectedContact.url && (
                            <ContactField
                              label="LinkedIn URL"
                              value={selectedContact.url}
                              icon={<User className="size-4" />}
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

