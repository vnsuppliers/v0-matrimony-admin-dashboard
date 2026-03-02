"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Flag,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  MoreHorizontal,
  Eye,
  Shield,
} from "lucide-react"
import { reportsService } from "@/lib/services/reports.service"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import type { Report } from "@/types"

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [resolveAction, setResolveAction] = useState("Warning sent")
  const [showResolveDialog, setShowResolveDialog] = useState(false)

  const fetchReports = async () => {
    setLoading(true)
    const data = await reportsService.getReports()
    setReports(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const handleResolve = async () => {
    if (!selectedReport) return
    await reportsService.resolveReport(selectedReport.id, resolveAction)
    toast.success("Report resolved")
    setShowResolveDialog(false)
    setSelectedReport(null)
    fetchReports()
  }

  const handleDismiss = async (id: string) => {
    await reportsService.dismissReport(id)
    toast.success("Report dismissed")
    fetchReports()
  }

  const pending = reports.filter((r) => r.status === "pending")
  const resolved = reports.filter((r) => r.status === "resolved")
  const dismissed = reports.filter((r) => r.status === "dismissed")

  const statusIcon = (status: Report["status"]) => {
    switch (status) {
      case "pending": return <Clock className="size-4 text-warning" />
      case "resolved": return <CheckCircle className="size-4 text-success" />
      case "dismissed": return <XCircle className="size-4 text-muted-foreground" />
    }
  }

  const ReportCard = ({ report }: { report: Report }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-none shadow-sm transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <Avatar className="size-10 border">
                <AvatarImage src={report.reported_user_image} />
                <AvatarFallback className="bg-primary/10 text-xs text-primary">
                  {report.reported_user_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{report.reported_user_name}</span>
                  <Badge variant="outline" className="text-[10px] gap-1">
                    {statusIcon(report.status)} {report.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Flag className="size-3" />
                  <span>{report.reason}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{report.description}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span>Reported by: <strong>{report.reporter_name}</strong></span>
                  <span>{new Date(report.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  {report.action_taken && (
                    <Badge variant="secondary" className="text-[10px]">{report.action_taken}</Badge>
                  )}
                </div>
              </div>
            </div>
            {report.status === "pending" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedReport(report)
                      setShowResolveDialog(true)
                    }}
                  >
                    <Shield className="mr-2 size-4" /> Resolve
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDismiss(report.id)}>
                    <XCircle className="mr-2 size-4" /> Dismiss
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Eye className="mr-2 size-4" /> View User
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports Management</h1>
        <p className="text-sm text-muted-foreground">Review and manage user reports</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Pending", count: pending.length, icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
          { label: "Resolved", count: resolved.length, icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
          { label: "Dismissed", count: dismissed.length, icon: XCircle, color: "text-muted-foreground", bg: "bg-muted" },
        ].map((item) => (
          <Card key={item.label} className="border-none shadow-sm">
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`flex size-11 items-center justify-center rounded-xl ${item.bg}`}>
                <item.icon className={`size-5 ${item.color}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                <p className="text-xl font-bold text-foreground">{item.count}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" className="gap-1.5">
            <Clock className="size-3.5" /> Pending ({pending.length})
          </TabsTrigger>
          <TabsTrigger value="resolved" className="gap-1.5">
            <CheckCircle className="size-3.5" /> Resolved ({resolved.length})
          </TabsTrigger>
          <TabsTrigger value="dismissed" className="gap-1.5">
            <XCircle className="size-3.5" /> Dismissed ({dismissed.length})
          </TabsTrigger>
        </TabsList>

        {loading ? (
          <div className="mt-4 flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            <TabsContent value="pending" className="mt-4 flex flex-col gap-3">
              {pending.length === 0 ? (
                <Card className="border-none shadow-sm"><CardContent className="flex flex-col items-center gap-2 py-12 text-center">
                  <CheckCircle className="size-10 text-success" />
                  <p className="text-sm font-medium text-foreground">All caught up!</p>
                  <p className="text-xs text-muted-foreground">No pending reports to review</p>
                </CardContent></Card>
              ) : pending.map((r) => <ReportCard key={r.id} report={r} />)}
            </TabsContent>
            <TabsContent value="resolved" className="mt-4 flex flex-col gap-3">
              {resolved.length === 0 ? (
                <Card className="border-none shadow-sm"><CardContent className="py-12 text-center text-sm text-muted-foreground">No resolved reports</CardContent></Card>
              ) : resolved.map((r) => <ReportCard key={r.id} report={r} />)}
            </TabsContent>
            <TabsContent value="dismissed" className="mt-4 flex flex-col gap-3">
              {dismissed.length === 0 ? (
                <Card className="border-none shadow-sm"><CardContent className="py-12 text-center text-sm text-muted-foreground">No dismissed reports</CardContent></Card>
              ) : dismissed.map((r) => <ReportCard key={r.id} report={r} />)}
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* Resolve Dialog */}
      <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Report</DialogTitle>
            <DialogDescription>
              Choose an action to resolve this report against {selectedReport?.reported_user_name}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Select value={resolveAction} onValueChange={setResolveAction}>
              <SelectTrigger>
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Warning sent">Send Warning</SelectItem>
                <SelectItem value="Account suspended">Suspend Account</SelectItem>
                <SelectItem value="Profile removed">Remove Profile</SelectItem>
                <SelectItem value="Content removed">Remove Content</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResolveDialog(false)}>Cancel</Button>
            <Button onClick={handleResolve}>Resolve Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
