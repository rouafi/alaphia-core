"use client"

import { ReactNode } from "react"
import {
  X,
  Maximize2,
  MoreVertical,
  Send,
  Phone,
  Mail,
  List,
  Pencil,
  Linkedin,
  Settings,
  Plus,
  Calendar,
  CheckCircle2,
  Flame,
  Heart,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

type DetailPanelProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  avatar?: ReactNode
  children?: ReactNode
  tabs?: Array<{
    id: string
    label: string
    count?: number
    content: ReactNode
  }>
  defaultTab?: string
}

export function DetailPanel({
  isOpen,
  onClose,
  title,
  subtitle,
  avatar,
  children,
  tabs,
  defaultTab = "general",
}: DetailPanelProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-full max-w-[480px] transform border-l border-[var(--border)] bg-[var(--panel)] shadow-2xl transition-transform duration-300 ease-out md:max-w-[480px]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-full flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
            <div className="flex items-center gap-3">
              {avatar}
              <div className="min-w-0 flex-1">
                {title && (
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-[var(--foreground)] truncate">
                      {title}
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="h-6 w-6 text-[var(--muted)] hover:text-[var(--foreground)]"
                    >
                      <Linkedin className="size-4" />
                    </Button>
                  </div>
                )}
                {subtitle && (
                  <p className="mt-0.5 text-sm text-[var(--muted)] truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onClose}
                className="h-8 w-8 text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                <X className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-8 w-8 text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                <Maximize2 className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-8 w-8 text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                <MoreVertical className="size-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 border-b border-[var(--border)] px-6 py-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-[var(--border)] bg-[var(--surface-alt)] text-[var(--foreground)] hover:bg-[var(--surface)]"
            >
              <Send className="mr-2 size-4" />
              Add to campaign
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8 border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <Phone className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8 border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <Mail className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8 border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <List className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8 border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <Pencil className="size-4" />
            </Button>
          </div>

          {/* Tabs */}
          {tabs && tabs.length > 0 ? (
            <Tabs defaultValue={defaultTab} className="flex flex-1 flex-col overflow-hidden">
              <div className="border-b border-[var(--border)] px-6">
                <TabsList className="h-auto border-none bg-transparent p-0">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium text-[var(--muted)] data-[state=active]:border-[var(--accent)] data-[state=active]:text-[var(--foreground)] data-[state=active]:shadow-none"
                    >
                      {tab.label}
                      {tab.count !== undefined && (
                        <span className="ml-2 rounded-full bg-[var(--surface-alt)] px-1.5 py-0.5 text-xs text-[var(--muted)]">
                          {tab.count}
                        </span>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              <div className="flex-1 overflow-y-auto">
                {tabs.map((tab) => (
                  <TabsContent
                    key={tab.id}
                    value={tab.id}
                    className="m-0 h-full p-6 focus-visible:outline-none focus-visible:ring-0"
                  >
                    {tab.content}
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          ) : (
            <div className="flex-1 overflow-y-auto p-6">{children}</div>
          )}
        </div>
      </div>
    </>
  )
}

type ContactFieldProps = {
  label: string
  value?: string
  icon?: ReactNode
  action?: ReactNode
  warning?: boolean
}

export function ContactField({
  label,
  value,
  icon,
  action,
  warning,
}: ContactFieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <div className="text-[var(--muted)]">{icon}</div>}
          <span className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">
            {label}
          </span>
        </div>
        {action}
      </div>
      {value && (
        <div className="flex items-center gap-2">
          <p className="text-sm text-[var(--foreground)]">{value}</p>
          {warning && (
            <div className="text-amber-500">
              <svg className="size-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.93c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

type CampaignSectionProps = {
  title: string
  count?: number
  status?: string
  score?: number
  onShowSteps?: () => void
}

export function CampaignSection({
  title,
  count,
  status,
  score,
  onShowSteps,
}: CampaignSectionProps) {
  return (
    <div className="space-y-3 rounded-lg border border-[var(--border)] bg-[var(--surface-alt)] p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
            <svg className="size-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.114 1.526c.562.22 1.21.286 1.957.31V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.114-1.526c-.562-.22-1.21-.286-1.957-.31V5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[var(--foreground)]">
              {title}
              {count !== undefined && ` (${count})`}
            </h4>
          </div>
        </div>
        {onShowSteps && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onShowSteps}
            className="text-xs text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            Show steps
          </Button>
        )}
      </div>
      <div className="flex items-center gap-3">
        {status && (
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-emerald-500" />
            <span className="text-xs text-[var(--muted)]">{status}</span>
          </div>
        )}
        {score !== undefined && (
          <div className="flex items-center gap-1.5">
            <Flame className="size-4 text-amber-500" />
            <span className="text-xs font-medium text-[var(--foreground)]">
              {score}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Heart className="size-4 fill-red-500 text-red-500" />
          <Heart className="size-4 text-[var(--muted)]" />
        </div>
        <Button variant="ghost" size="icon-sm" className="ml-auto h-6 w-6">
          <MoreVertical className="size-4" />
        </Button>
      </div>
    </div>
  )
}

