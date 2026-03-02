"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  CreditCard,
  Crown,
  IndianRupee,
  RefreshCw,
  XCircle,
  TrendingUp,
  Users,
  Search,
} from "lucide-react"
import { subscriptionService } from "@/lib/services/subscription.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import type { Subscription } from "@/types"

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [planFilter, setPlanFilter] = useState("all")

  const fetchData = async () => {
    setLoading(true)
    const data = await subscriptionService.getSubscriptions()
    setSubscriptions(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleRenew = async (id: string) => {
    await subscriptionService.renewSubscription(id)
    toast.success("Subscription renewed")
    fetchData()
  }

  const handleCancel = async (id: string) => {
    await subscriptionService.cancelSubscription(id)
    toast.success("Subscription cancelled")
    fetchData()
  }

  const filtered = subscriptions.filter((s) => {
    const matchSearch = s.user_name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || s.status === statusFilter
    const matchPlan = planFilter === "all" || s.plan === planFilter
    return matchSearch && matchStatus && matchPlan
  })

  const summary = subscriptionService.getRevenueSummary()

  const statusBadge = (status: string) => {
    switch (status) {
      case "active": return <Badge className="bg-success/10 text-success border-success/20 text-[10px]">Active</Badge>
      case "expired": return <Badge variant="outline" className="text-[10px] text-muted-foreground">Expired</Badge>
      case "cancelled": return <Badge variant="destructive" className="text-[10px]">Cancelled</Badge>
      default: return null
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Subscriptions</h1>
        <p className="text-sm text-muted-foreground">Manage user subscriptions and revenue</p>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Revenue", value: `₹${(summary.total / 1000).toFixed(1)}K`, icon: IndianRupee, color: "text-chart-1", bg: "bg-chart-1/10" },
          { label: "Monthly Revenue", value: `₹${(summary.monthly / 1000).toFixed(1)}K`, icon: TrendingUp, color: "text-success", bg: "bg-success/10" },
          { label: "Active Subs", value: summary.activeCount.toString(), icon: Crown, color: "text-chart-5", bg: "bg-chart-5/10" },
          { label: "Total Subs", value: summary.totalCount.toString(), icon: Users, color: "text-chart-2", bg: "bg-chart-2/10" },
        ].map((item) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-none shadow-sm">
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`flex size-11 items-center justify-center rounded-xl ${item.bg}`}>
                  <item.icon className={`size-5 ${item.color}`} />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                  <p className="text-xl font-bold text-foreground">{item.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-none p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by user name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="Gold">Gold</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden border-none shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">User</TableHead>
                <TableHead className="font-semibold">Plan</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="font-semibold">Start Date</TableHead>
                <TableHead className="font-semibold">Expiry</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Auto-Renew</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 8 }).map((__, j) => (
                        <TableCell key={j}><Skeleton className="h-5 w-20" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                : filtered.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8 border">
                            <AvatarImage src={sub.user_image} />
                            <AvatarFallback className="bg-primary/10 text-xs text-primary">
                              {sub.user_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-foreground">{sub.user_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1 text-[10px]">
                          <Crown className="size-3" /> {sub.plan}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-foreground">₹{sub.amount}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(sub.start_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(sub.expiry_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}
                      </TableCell>
                      <TableCell>{statusBadge(sub.status)}</TableCell>
                      <TableCell>
                        <Badge variant={sub.auto_renew ? "default" : "secondary"} className="text-[10px]">
                          {sub.auto_renew ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {sub.status !== "active" && (
                            <Button variant="ghost" size="icon-sm" onClick={() => handleRenew(sub.id)} title="Renew">
                              <RefreshCw className="size-4 text-success" />
                            </Button>
                          )}
                          {sub.status === "active" && (
                            <Button variant="ghost" size="icon-sm" onClick={() => handleCancel(sub.id)} title="Cancel">
                              <XCircle className="size-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <CreditCard className="size-10 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">No subscriptions found</p>
            <p className="text-xs text-muted-foreground">Try adjusting your filters</p>
          </div>
        )}
      </Card>
    </motion.div>
  )
}
