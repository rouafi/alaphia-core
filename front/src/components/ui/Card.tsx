import { ReactNode } from "react"

import { cn } from "@/lib/utils"

type CardProps = {
  title?: string
  description?: string
  actions?: ReactNode
  footer?: ReactNode
  children?: ReactNode
  className?: string
  padding?: "sm" | "md" | "lg"
}

const paddingMap = {
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
}

export function Card({
  title,
  description,
  actions,
  footer,
  children,
  className,
  padding = "lg",
}: CardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--foreground)] shadow-[0px_20px_45px_rgba(0,0,0,0.15)]",
        paddingMap[padding],
        className
      )}
    >
      {(title || description || actions) && (
        <header className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-[var(--foreground)]">{title}</h3>
            )}
            {description && (
              <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>
            )}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </header>
      )}

      {children}

      {footer && <footer className="mt-6 border-t border-[var(--divider)] pt-4">{footer}</footer>}
    </section>
  )
}

