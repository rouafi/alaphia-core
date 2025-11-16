import { ReactNode } from "react"

import { cn } from "@/lib/utils"

export type DataTableColumn<T> = {
  key: keyof T | string
  label: string
  width?: string
  align?: "left" | "center" | "right"
  render?: (row: T) => ReactNode
}

type DataTableProps<T> = {
  data: T[]
  columns: DataTableColumn<T>[]
  emptyState?: ReactNode
  className?: string
  getRowKey?: (row: T, index: number) => string | number
}

export function DataTable<T>({
  data,
  columns,
  emptyState,
  className,
  getRowKey,
}: DataTableProps<T>) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-white/[0.04] bg-[#111827]/80",
        className
      )}
    >
      <table className="w-full border-collapse text-sm text-white/80">
        <thead>
          <tr className="h-10 border-b border-white/[0.04] text-[11px] font-semibold uppercase tracking-[0.28em] text-white/40">
            {columns.map((column, columnIndex) => {
              const resolvedAlign =
                column.align ?? (columnIndex === 0 ? "left" : "right")

              return (
                <th
                  key={String(column.key)}
                  className={cn(
                    "px-4 font-semibold",
                    resolvedAlign === "right" && "text-right",
                    resolvedAlign === "center" && "text-center"
                  )}
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-sm text-white/50"
              >
                {emptyState ?? "No data available."}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={getRowKey?.(row, index) ?? index}
                className="h-10 border-b border-white/[0.04] text-white/85 transition hover:bg-[#1E293B]/30"
              >
                {columns.map((column, columnIndex) => {
                  const resolvedAlign =
                    column.align ?? (columnIndex === 0 ? "left" : "right")

                  return (
                    <td
                      key={String(column.key)}
                      className={cn(
                        "px-4 align-middle text-[13px]",
                        resolvedAlign === "right" && "text-right",
                        resolvedAlign === "center" && "text-center"
                      )}
                    >
                      {column.render
                        ? column.render(row)
                        : ((row as Record<string, unknown>)[
                            column.key as string
                          ] as ReactNode)}
                    </td>
                  )
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

