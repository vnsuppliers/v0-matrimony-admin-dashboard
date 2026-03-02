"use client"

import { motion } from "framer-motion"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AnalyticsSummary } from "@/types"

const COLORS = [
  "oklch(0.58 0.18 350)",
  "oklch(0.65 0.15 280)",
  "oklch(0.60 0.12 200)",
  "oklch(0.75 0.15 60)",
]

export function DashboardCharts({ data }: { data: AnalyticsSummary }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Monthly Registrations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-card-foreground">Monthly Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data.monthly_registrations}>
                <defs>
                  <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.58 0.18 350)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="oklch(0.58 0.18 350)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.85 0 0)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="oklch(0.6 0 0)" />
                <YAxis tick={{ fontSize: 12 }} stroke="oklch(0.6 0 0)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.98 0 0)",
                    border: "1px solid oklch(0.9 0 0)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="oklch(0.58 0.18 350)"
                  fill="url(#regGrad)"
                  strokeWidth={2}
                  name="Users"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Revenue Growth */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-card-foreground">Revenue Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.revenue_growth}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.85 0 0)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="oklch(0.6 0 0)" />
                <YAxis tick={{ fontSize: 12 }} stroke="oklch(0.6 0 0)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.98 0 0)",
                    border: "1px solid oklch(0.9 0 0)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [`₹${(value / 1000).toFixed(1)}K`, "Revenue"]}
                />
                <Bar dataKey="amount" fill="oklch(0.65 0.15 280)" radius={[6, 6, 0, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bride vs Groom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-card-foreground">Bride vs Groom Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data.profile_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="type"
                >
                  {data.profile_distribution.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.98 0 0)",
                    border: "1px solid oklch(0.9 0 0)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Subscription Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-card-foreground">Subscription Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data.subscription_breakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="plan"
                >
                  {data.subscription_breakdown.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.98 0 0)",
                    border: "1px solid oklch(0.9 0 0)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
