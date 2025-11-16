"use client"

import { ReactNode, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type AlaphiaTableColumn<T> = {
  key: keyof T | string
  label: string
  render?: (row: T) => ReactNode
  className?: string
}

type AlaphiaTableProps<T> = {
  data: T[]
  columns: AlaphiaTableColumn<T>[]
  className?: string
  containerClassName?: string
  headerClassName?: string
  getRowKey?: (row: T, index: number) => string | number
  showPagination?: boolean
  pageSize?: number
  page?: number
  defaultPage?: number
  onPageChange?: (page: number) => void
}

/**
 * AlaphiaTable
 * Dense, slim table matching Alaphia proportions:
 * - Container: rounded-xl, subtle border, elevated dark surface
 * - Header: text-xs, uppercase, tracking-wide, muted
 * - Rows: ~44px height, tight px-4/py-2 padding, hairline grid, subtle hover
 */
export function AlaphiaTable<T>({
  data,
  columns,
  className,
  containerClassName,
  headerClassName,
  getRowKey,
  showPagination = true,
  pageSize = 10,
  page,
  defaultPage = 1,
  onPageChange,
}: AlaphiaTableProps<T>) {
  const isControlled = typeof page === "number"
  const [internalPage, setInternalPage] = useState(defaultPage)
  const currentPage = isControlled ? (page as number) : internalPage

  const totalPages = Math.max(1, Math.ceil((data?.length ?? 0) / pageSize))
  const safePage = Math.min(Math.max(1, currentPage), totalPages)
  const startIndex = (safePage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, data.length)
  const pagedData = useMemo(
    () => data.slice(startIndex, endIndex),
    [data, startIndex, endIndex]
  )

  const handlePrev = () => {
    const next = Math.max(1, safePage - 1)
    if (!isControlled) setInternalPage(next)
    onPageChange?.(next)
  }
  const handleNext = () => {
    const next = Math.min(totalPages, safePage + 1)
    if (!isControlled) setInternalPage(next)
    onPageChange?.(next)
  }

  return (
    <div className={cn("rounded-xl border border-[var(--border)] bg-[var(--panel)] shadow-none", containerClassName)}>
      <div className={cn("overflow-x-auto rounded-xl", className)}>
        <table className="w-full border-collapse text-sm text-[var(--table-foreground)]">
          <thead>
            <tr
              className={cn(
                "h-9 border-b border-[var(--border)] text-xs font-semibold uppercase tracking-wide text-[var(--table-header-foreground)]",
                headerClassName
              )}
            >
              {columns.map((col, idx) => (
                <th
                  key={String(col.key)}
                  className={cn(
                    "px-4 py-2 text-left",
                    idx === 0 && "first:rounded-tl-xl",
                    idx === columns.length - 1 && "last:rounded-tr-xl"
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagedData.map((row, index) => (
              <tr
                key={getRowKey?.(row, startIndex + index) ?? startIndex + index}
                className="h-11 border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--surface-alt)]"
              >
                {columns.map((col) => (
                  <td key={String(col.key)} className={cn("px-4 py-2", col.className)}>
                    {col.render
                      ? col.render(row)
                      : ((row as Record<string, unknown>)[
                          col.key as string
                        ] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showPagination && data.length > 0 && (
        <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-3 text-xs text-[var(--foreground)]">
          <div>
            Rows {startIndex + 1}–{endIndex} of {data.length}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={handlePrev}
              disabled={safePage <= 1}
              className="h-7 rounded-md border border-[var(--border)] bg-[color-mix(in_srgb,var(--foreground)_4%,transparent)] px-2 text-[var(--foreground)] hover:bg-[color-mix(in_srgb,var(--foreground)_8%,transparent)] disabled:opacity-50"
            >
              <ChevronLeft className="size-4" />
              Prev
            </Button>
            <div className="rounded-md border border-[var(--border)] bg-[color-mix(in_srgb,var(--foreground)_4%,transparent)] px-2 py-1 text-[var(--foreground)]">
              Page {safePage} / {totalPages}
            </div>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={handleNext}
              disabled={safePage >= totalPages}
              className="h-7 rounded-md border border-[var(--border)] bg-[color-mix(in_srgb,var(--foreground)_4%,transparent)] px-2 text-[var(--foreground)] hover:bg-[color-mix(in_srgb,var(--foreground)_8%,transparent)] disabled:opacity-50"
            >
              Next
              <ChevronRight className="ml-1 size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

