"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <DashboardShell>{children}</DashboardShell>
    </ProtectedRoute>
  )
}
