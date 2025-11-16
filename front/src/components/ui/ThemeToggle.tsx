"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    setMounted(true)
    const saved = typeof window !== "undefined" ? localStorage.getItem("theme") : null
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches
    const enabled = saved ? saved === "dark" : prefersDark
    document.documentElement.classList.toggle("dark", enabled)
    setIsDark(enabled)
  }, [])

  const toggle = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem("theme", next ? "dark" : "light")
  }

  if (!mounted) return null

  return (
    <Button
      variant="ghost"
      size="icon"
      type="button"
      onClick={toggle}
      className="rounded-md border border-[var(--border)] text-[color:var(--foreground)]/70 hover:text-[var(--foreground)]"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  )
}

