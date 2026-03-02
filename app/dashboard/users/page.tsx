"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Ban,
  CheckCircle,
  Trash2,
  MoreHorizontal,
  Download,
} from "lucide-react"
import { usersService } from "@/lib/services/users.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import type { User, PaginatedResponse } from "@/types"

export default function UsersPage() {
  const router = useRouter()
  const [data, setData] = useState<PaginatedResponse<User> | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [profileType, setProfileType] = useState("all")
  const [subscription, setSubscription] = useState("all")
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    const res = await usersService.getUsers({
      page,
      per_page: 10,
      search,
      profile_type: profileType,
      subscription,
    })
    setData(res)
    setLoading(false)
  }, [page, search, profileType, subscription])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleApprove = async (id: string) => {
    await usersService.updateUserStatus(id, 1)
    toast.success("User approved successfully")
    fetchUsers()
  }

  const handleSuspend = async (id: string) => {
    await usersService.toggleSuspension(id)
    toast.success("User suspension toggled")
    fetchUsers()
  }

  const handleDelete = async () => {
    if (!deleteDialog) return
    await usersService.deleteUser(deleteDialog)
    toast.success("User deleted successfully")
    setDeleteDialog(null)
    fetchUsers()
  }

  const statusBadge = (user: User) => {
    if (user.is_suspended)
      return <Badge variant="destructive" className="text-[10px]">Suspended</Badge>
    if (user.account_status === 0)
      return <Badge variant="outline" className="border-warning text-warning text-[10px]">Pending</Badge>
    return <Badge className="bg-success/10 text-success border-success/20 text-[10px]">Active</Badge>
  }

  const planBadge = (plan: string) => {
    if (plan === "Premium")
      return <Badge className="bg-chart-5/10 text-chart-5 border-chart-5/20 text-[10px]">{plan}</Badge>
    if (plan === "Gold")
      return <Badge className="bg-chart-4/10 text-chart-4 border-chart-4/20 text-[10px]">{plan}</Badge>
    return <Badge variant="secondary" className="text-[10px]">{plan}</Badge>
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage all registered users on the platform
            {data && <span className="ml-1">({data.total} total)</span>}
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="size-4" />
          Export CSV
        </Button>
      </div>

      {/* Search & Filters */}
      <Card className="border-none p-4 shadow-sm">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-primary/10 text-primary" : ""}
            >
              <Filter className="size-4" />
            </Button>
          </div>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="flex flex-wrap gap-3"
            >
              <Select value={profileType} onValueChange={(v) => { setProfileType(v); setPage(1) }}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Profile Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Bride">Bride</SelectItem>
                  <SelectItem value="Groom">Groom</SelectItem>
                </SelectContent>
              </Select>
              <Select value={subscription} onValueChange={(v) => { setSubscription(v); setPage(1) }}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Subscription" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="Free">Free</SelectItem>
                  <SelectItem value="Gold">Gold</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          )}
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden border-none shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">User</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Location</TableHead>
                <TableHead className="font-semibold">Plan</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Joined</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((__, j) => (
                        <TableCell key={j}><Skeleton className="h-5 w-20" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                : data?.data.map((user) => (
                    <TableRow key={user.id} className="cursor-pointer hover:bg-muted/30" onClick={() => router.push(`/dashboard/users/${user.id}`)}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-9 border">
                            <AvatarImage src={user.profile_image} alt={user.name} />
                            <AvatarFallback className="bg-primary/10 text-xs text-primary">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">{user.name}</span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">{user.profile_type}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{user.location}</TableCell>
                      <TableCell>{planBadge(user.subscription_plan)}</TableCell>
                      <TableCell>{statusBadge(user)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon-sm">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/users/${user.id}`)}>
                              <Eye className="mr-2 size-4" /> View Profile
                            </DropdownMenuItem>
                            {user.account_status === 0 && (
                              <DropdownMenuItem onClick={() => handleApprove(user.id)}>
                                <CheckCircle className="mr-2 size-4" /> Approve
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleSuspend(user.id)}>
                              <Ban className="mr-2 size-4" />
                              {user.is_suspended ? "Unsuspend" : "Suspend"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteDialog(user.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 size-4" /> Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {data && data.total_pages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Page {data.page} of {data.total_pages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === data.total_pages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone and all user data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}
