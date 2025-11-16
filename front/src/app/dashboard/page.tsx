"use client"

import { ArrowUpRight, Play, UploadCloud } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/Card"
import { ClaapTable, type ClaapTableColumn } from "@/components/ui/ClaapTable"
import { PageHeader } from "@/components/ui/PageHeader"
import { Toolbar } from "@/components/ui/Toolbar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type RecordingRow = {
  title: string
  owner: string
  team: string
  status: "In review" | "Approved" | "Draft"
  duration: string
  updated: string
}

const metrics = [
  {
    label: "Recordings this week",
    value: "18",
    change: "+12% vs last week",
  },
  {
    label: "Active contacts",
    value: "124",
    change: "+6 new relationships",
  },
  {
    label: "Avg. watch time",
    value: "12m 40s",
    change: "+2m engagement",
  },
]

const recordings: RecordingRow[] = [
  {
    title: "Voice Intelligence sprint review",
    owner: "Léa Martin",
    team: "Product",
    status: "In review",
    duration: "18:24",
    updated: "2h ago",
  },
  {
    title: "Growth funnel analysis",
    owner: "Alex Rivera",
    team: "Marketing",
    status: "Approved",
    duration: "11:56",
    updated: "Yesterday",
  },
  {
    title: "Customer call · Notion AI",
    owner: "Sam Chau",
    team: "Success",
    status: "Draft",
    duration: "32:10",
    updated: "1 day ago",
  },
  {
    title: "Weekly leadership sync",
    owner: "Maya Lopez",
    team: "Leadership",
    status: "Approved",
    duration: "24:02",
    updated: "2 days ago",
  },
]

const recordingColumns: ClaapTableColumn<RecordingRow>[] = [
  {
    key: "title",
    label: "Recording",
    render: (row) => (
      <div className="flex items-center gap-3">
        <button className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white">
          <Play className="size-3.5" />
        </button>
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-[var(--table-foreground)]">{row.title}</p>
          <p className="text-xs text-[var(--muted)]">{row.team}</p>
        </div>
      </div>
    ),
  },
  {
    key: "owner",
    label: "Owner",
    render: (row) => (
      <div className="flex items-center gap-3">
        <Avatar className="size-8 border border-white/5 bg-transparent">
          <AvatarFallback className="bg-[#3B82F6]/20 text-white">
            {row.owner
              .split(" ")
              .map((p) => p[0])
              .join("")
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-[var(--table-foreground)]">{row.owner}</p>
          <p className="text-xs text-[var(--muted)]">Aphilia · {row.team}</p>
        </div>
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (row) => {
      const pillClass =
        row.status === "Approved"
          ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-200"
          : row.status === "Draft"
            ? "border-slate-600 bg-slate-800 text-slate-300"
            : "border-sky-400/50 bg-sky-500/10 text-sky-200"
      return (
        <span
          className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold ${pillClass}`}
        >
          {row.status}
        </span>
      )
    },
  },
  {
    key: "duration",
    label: "Duration",
    className: "text-sm font-medium text-[var(--table-foreground)]",
  },
  {
    key: "updated",
    label: "Last activity",
    className: "text-sm font-medium text-[var(--table-foreground)]",
  },
]

const reviewers = [
  { name: "Léa Martin", avatar: "LM", minutes: "42m this week" },
  { name: "Alex Rivera", avatar: "AR", minutes: "38m this week" },
  { name: "Dana Singh", avatar: "DS", minutes: "32m this week" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Monitor recordings, contact engagement, and workspace velocity at a glance."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="border-white/10 text-white/80">
              Share dashboard
            </Button>
            <Button className="bg-[#3B82F6] text-white hover:bg-[#3B82F6]/90">
              <UploadCloud className="mr-2 size-4" />
              Upload recording
            </Button>
          </div>
        }
        meta={
          <>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
              Last synced · 5m ago
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
              AI summaries enabled
            </span>
          </>
        }
      />

      <Toolbar
        filters={[
          { label: "All recordings", value: "all", count: 42 },
          { label: "Team updates", value: "updates" },
          { label: "Customer calls", value: "customers" },
          { label: "Reviews", value: "reviews" },
        ]}
        searchPlaceholder="Search dashboard activity"
        actions={
          <Button
            variant="ghost"
            className="rounded-lg border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
          >
            Export CSV
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label} padding="md">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              {metric.label}
            </p>
            <p className="mt-4 text-3xl font-semibold text-white">
              {metric.value}
            </p>
            <p className="mt-2 text-sm text-emerald-300">{metric.change}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card
          title="Recent recordings"
          description="Slim Aphilia table density with reactions, owners, and review status."
          actions={
            <Button variant="ghost" className="text-white/70 hover:text-white">
              View all
              <ArrowUpRight className="ml-2 size-4" />
            </Button>
          }
        >
          <ClaapTable data={recordings} columns={recordingColumns} />
        </Card>

        <div className="space-y-4">
          <Card
            title="Top reviewers"
            description="Who’s giving the most feedback across the workspace."
            padding="md"
          >
            <div className="space-y-4">
              {reviewers.map((reviewer) => (
                <div
                  key={reviewer.name}
                  className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9 border border-white/10 bg-transparent">
                      <AvatarFallback className="bg-[#8B5CF6]/20 text-white">
                        {reviewer.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {reviewer.name}
                      </p>
                      <p className="text-xs text-white/50">
                        Product · Paris, FR
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-white/80">
                    {reviewer.minutes}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card
            title="Upcoming reviews"
            description="Scheduled syncs and async reviews for this sprint."
            padding="md"
          >
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-center justify-between rounded-lg border border-white/5 px-3 py-2">
                <span>Voice AI QA · Tomorrow</span>
                <Badge className="border border-[#3B82F6]/40 bg-[#3B82F6]/10 text-[#93C5FD]">
                  Async
                </Badge>
              </li>
              <li className="flex items-center justify-between rounded-lg border border-white/5 px-3 py-2">
                <span>Growth retro · Thu 3pm</span>
                <Badge className="border border-white/10 bg-white/5 text-white/70">
                  Live
                </Badge>
              </li>
              <li className="flex items-center justify-between rounded-lg border border-white/5 px-3 py-2">
                <span>Customer calls digest</span>
                <Badge className="border border-emerald-400/40 bg-emerald-400/10 text-emerald-200">
                  Shared
                </Badge>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}

