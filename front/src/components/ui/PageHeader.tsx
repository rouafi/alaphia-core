import { ReactNode } from "react"

import { cn } from "@/lib/utils"

type PageHeaderProps = {
  title: string
  description?: string
  actions?: ReactNode
  meta?: ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  actions,
  meta,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-[var(--divider)] pb-6 md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] opacity-60 text-[var(--foreground)]">
          Workspace · Aphilia Dark
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">{title}</h1>
        {description && (
          <p className="mt-2 max-w-3xl text-sm opacity-70 text-[var(--foreground)]">
            {description}
          </p>
        )}
        {meta && <div className="mt-4 flex flex-wrap gap-4 text-xs opacity-70 text-[var(--foreground)]">{meta}</div>}
      </div>
      {actions && <div className="flex flex-col gap-3 md:items-end">{actions}</div>}
    </div>
  )
}

