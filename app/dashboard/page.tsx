"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { analyticsService } from "@/lib/services/analytics.service"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { Skeleton } from "@/components/ui/skeleton"
import type { AnalyticsSummary } from "@/types"

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-80 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    analyticsService.getSummary().then((res) => {
      setData(res)
      setLoading(false)
    })
  }, [])

  if (loading || !data) return <DashboardSkeleton />

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground">Welcome back! Here is your platform summary.</p>
      </div>
      <StatsCards data={data} />
      <DashboardCharts data={data} />
    </motion.div>
  )
}
