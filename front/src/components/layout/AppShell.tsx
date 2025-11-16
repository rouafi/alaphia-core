"use client"

import { ReactNode, useMemo, useState } from "react"

import { Sidebar } from "@/components/layout/Sidebar"
import { Topbar } from "@/components/layout/Topbar"

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev)

  const shellPadding = useMemo(
    () => (isSidebarCollapsed ? "px-6 md:px-2" : "px-8 md:px-4"),
    [isSidebarCollapsed]
  )

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Sidebar collapsed={isSidebarCollapsed} onToggleSidebar={toggleSidebar} />

      <div className="flex flex-1 flex-col">
        <Topbar
          collapsed={isSidebarCollapsed}
          onToggleSidebar={toggleSidebar}
        />
        <main className="flex-1 overflow-y-auto bg-transparent">
          <div className={`mx-auto w-[95%] py-10 ${shellPadding}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

