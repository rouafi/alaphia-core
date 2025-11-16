"use client"

import { ChangeEvent, ReactNode, useMemo, useState } from "react"
import { Filter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type ToolbarFilter = {
  label: string
  value: string
  count?: number
}

type ToolbarProps = {
  filters?: ToolbarFilter[]
  defaultFilter?: string
  searchPlaceholder?: string
  actions?: ReactNode
  className?: string
  onFilterChange?: (value: string) => void
  onSearch?: (value: string) => void
}

export function Toolbar({
  filters = [],
  defaultFilter,
  searchPlaceholder = "Search…",
  actions,
  className,
  onFilterChange,
  onSearch,
}: ToolbarProps) {
  const initialFilter = useMemo(
    () => defaultFilter ?? filters[0]?.value ?? "all",
    [defaultFilter, filters]
  )
  const [activeFilter, setActiveFilter] = useState(initialFilter)
  const [query, setQuery] = useState("")

  const handleFilterClick = (value: string) => {
    setActiveFilter(value)
    onFilterChange?.(value)
  }

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setQuery(value)
    onSearch?.(value)
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 md:flex-row md:items-center md:justify-between",
        className
      )}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <div className="flex items-center rounded-lg border border-[var(--border)] bg-[var(--surface-alt)] px-3 py-2 text-sm text-[color:var(--foreground)]/70">
          <Search className="mr-2 size-4 opacity-40 text-[var(--foreground)]" />
          <Input
            value={query}
            onChange={handleSearchChange}
            placeholder={searchPlaceholder}
            className="h-6 border-none bg-transparent p-0 text-sm text-[var(--foreground)] placeholder:opacity-40 focus-visible:ring-0"
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          className="rounded-lg border border-[var(--border)] bg-[var(--surface-alt)] text-[color:var(--foreground)]/70 hover:bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)]"
        >
          <Filter className="mr-2 size-4" />
          Filters
        </Button>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const isActive = filter.value === activeFilter
            return (
              <Button
                key={filter.value}
                size="sm"
                variant="ghost"
                type="button"
                onClick={() => handleFilterClick(filter.value)}
                className={cn(
                  "rounded-full border border-[var(--border)] bg-transparent px-3 text-xs font-semibold uppercase tracking-wide text-[color:var(--foreground)]/70",
                  isActive &&
                    "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--foreground)]"
                )}
              >
                {filter.label}
                {filter.count !== undefined && (
                  <span className="ml-2 rounded-full border border-[var(--border)] bg-[var(--surface-alt)] px-1.5 py-0.5 text-[10px] text-[color:var(--foreground)]/80">
                    {filter.count}
                  </span>
                )}
              </Button>
            )
          })}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 text-[var(--foreground)]">{actions}</div>}
    </div>
  )
}

