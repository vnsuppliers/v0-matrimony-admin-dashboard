"use client"

import { motion } from "framer-motion"
import { Users, UserCheck, Clock, Crown, ShieldBan, IndianRupee } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { AnalyticsSummary } from "@/types"

const cardConfig = [
  { key: "total_users", label: "Total Users", icon: Users, color: "text-chart-1", bg: "bg-chart-1/10" },
  { key: "active_users", label: "Active Users", icon: UserCheck, color: "text-success", bg: "bg-success/10" },
  { key: "pending_users", label: "Pending Approval", icon: Clock, color: "text-warning", bg: "bg-warning/10" },
  { key: "premium_users", label: "Premium Users", icon: Crown, color: "text-chart-5", bg: "bg-chart-5/10" },
  { key: "suspended_users", label: "Suspended", icon: ShieldBan, color: "text-destructive", bg: "bg-destructive/10" },
  { key: "total_revenue", label: "Total Revenue", icon: IndianRupee, color: "text-chart-2", bg: "bg-chart-2/10", isCurrency: true },
] as const

export function StatsCards({ data }: { data: AnalyticsSummary }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cardConfig.map((cfg, i) => {
        const Icon = cfg.icon
        const value = data[cfg.key as keyof AnalyticsSummary] as number
        return (
          <motion.div
            key={cfg.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <Card className="relative overflow-hidden border-none bg-card shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${cfg.bg}`}>
                  <Icon className={`size-5 ${cfg.color}`} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-muted-foreground">{cfg.label}</span>
                  <span className="text-xl font-bold text-card-foreground">
                    {"isCurrency" in cfg
                      ? `₹${(value / 1000).toFixed(1)}K`
                      : value.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
