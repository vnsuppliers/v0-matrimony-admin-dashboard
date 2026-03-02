"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Edit,
  Ban,
  CheckCircle,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Heart,
  Eye,
  EyeOff,
  Crown,
  Save,
  X,
} from "lucide-react"
import { usersService } from "@/lib/services/users.service"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
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
import { toast } from "sonner"
import type { User } from "@/types"

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<User>>({})
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (params.id) {
      usersService.getUserById(params.id as string).then((u) => {
        setUser(u)
        setLoading(false)
      })
    }
  }, [params.id])

  const handleStartEdit = () => {
    if (!user) return
    setEditData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      profession: user.profession,
      education: user.education,
      location: user.location,
      about: user.about,
    })
    setEditing(true)
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    const updated = await usersService.updateUser(user.id, editData)
    if (updated) {
      setUser(updated)
      toast.success("Profile updated successfully")
    }
    setEditing(false)
    setSaving(false)
  }

  const handleApprove = async () => {
    if (!user) return
    const updated = await usersService.updateUserStatus(user.id, 1)
    if (updated) {
      setUser(updated)
      toast.success("User approved")
    }
  }

  const handleSuspend = async () => {
    if (!user) return
    const updated = await usersService.toggleSuspension(user.id)
    if (updated) {
      setUser(updated)
      toast.success(updated.is_suspended ? "User suspended" : "User unsuspended")
    }
  }

  const handleDelete = async () => {
    if (!user) return
    await usersService.deleteUser(user.id)
    toast.success("User deleted")
    router.push("/dashboard/users")
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-40" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="h-96" />
          <Skeleton className="col-span-2 h-96" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-lg font-medium text-foreground">User not found</p>
        <Button variant="outline" onClick={() => router.push("/dashboard/users")}>
          <ArrowLeft className="mr-2 size-4" /> Back to Users
        </Button>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/users")}>
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">User Profile</h1>
            <p className="text-sm text-muted-foreground">ID: {user.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!editing ? (
            <>
              <Button variant="outline" size="sm" onClick={handleStartEdit}>
                <Edit className="mr-2 size-4" /> Edit
              </Button>
              {user.account_status === 0 && (
                <Button size="sm" onClick={handleApprove} className="bg-success hover:bg-success/90 text-success-foreground">
                  <CheckCircle className="mr-2 size-4" /> Approve
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleSuspend}>
                <Ban className="mr-2 size-4" />
                {user.is_suspended ? "Unsuspend" : "Suspend"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setDeleteDialog(true)} className="text-destructive border-destructive/30 hover:bg-destructive/10">
                <Trash2 className="mr-2 size-4" /> Delete
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" onClick={handleSave} disabled={saving}>
                <Save className="mr-2 size-4" /> Save Changes
              </Button>
              <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
                <X className="mr-2 size-4" /> Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left - Profile Card */}
        <Card className="border-none shadow-sm">
          <CardContent className="flex flex-col items-center gap-4 p-6">
            <Avatar className="size-24 border-4 border-primary/10">
              <AvatarImage src={user.profile_image} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-2xl text-primary">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.profile_type} Profile</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {user.is_suspended ? (
                <Badge variant="destructive">Suspended</Badge>
              ) : user.account_status === 0 ? (
                <Badge variant="outline" className="border-warning text-warning">Pending</Badge>
              ) : (
                <Badge className="bg-success/10 text-success border-success/20">Active</Badge>
              )}
              <Badge variant="outline" className="gap-1">
                <Crown className="size-3" /> {user.subscription_plan}
              </Badge>
              <Badge variant="outline" className="gap-1">
                {user.profile_visibility ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
                {user.profile_visibility ? "Visible" : "Hidden"}
              </Badge>
            </div>
            <Separator />
            <div className="flex w-full flex-col gap-3 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="size-4 shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="size-4 shrink-0" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="size-4 shrink-0" />
                <span>{user.location}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Briefcase className="size-4 shrink-0" />
                <span>{user.profession}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <GraduationCap className="size-4 shrink-0" />
                <span>{user.education}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="size-4 shrink-0" />
                <span>Joined {new Date(user.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right - Details Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="preferences">Partner Preferences</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-4">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {editing ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <Label>Full Name</Label>
                        <Input value={editData.name ?? ""} onChange={(e) => setEditData((d) => ({ ...d, name: e.target.value }))} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>Email</Label>
                        <Input value={editData.email ?? ""} onChange={(e) => setEditData((d) => ({ ...d, email: e.target.value }))} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>Phone</Label>
                        <Input value={editData.phone ?? ""} onChange={(e) => setEditData((d) => ({ ...d, phone: e.target.value }))} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>Profession</Label>
                        <Input value={editData.profession ?? ""} onChange={(e) => setEditData((d) => ({ ...d, profession: e.target.value }))} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>Education</Label>
                        <Input value={editData.education ?? ""} onChange={(e) => setEditData((d) => ({ ...d, education: e.target.value }))} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>Location</Label>
                        <Input value={editData.location ?? ""} onChange={(e) => setEditData((d) => ({ ...d, location: e.target.value }))} />
                      </div>
                      <div className="flex flex-col gap-2 sm:col-span-2">
                        <Label>About</Label>
                        <Textarea value={editData.about ?? ""} onChange={(e) => setEditData((d) => ({ ...d, about: e.target.value }))} rows={4} />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {[
                        { label: "Age", value: `${user.age} years` },
                        { label: "Date of Birth", value: new Date(user.date_of_birth).toLocaleDateString("en-IN") },
                        { label: "Height", value: user.height },
                        { label: "Weight", value: user.weight },
                        { label: "Religion", value: user.religion },
                        { label: "Caste", value: user.caste },
                        { label: "Mother Tongue", value: user.mother_tongue },
                        { label: "Marital Status", value: user.marital_status },
                        { label: "Last Login", value: new Date(user.last_login).toLocaleDateString("en-IN") },
                        { label: "Subscription Expiry", value: new Date(user.subscription_expiry).toLocaleDateString("en-IN") },
                      ].map((item) => (
                        <div key={item.label} className="flex flex-col gap-1">
                          <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
                          <span className="text-sm font-medium text-foreground">{item.value}</span>
                        </div>
                      ))}
                      <div className="flex flex-col gap-1 sm:col-span-2">
                        <span className="text-xs font-medium text-muted-foreground">About</span>
                        <p className="text-sm text-foreground leading-relaxed">{user.about}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="mt-4">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Heart className="size-4 text-primary" />
                    Partner Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {Object.entries(user.partner_preferences).map(([key, val]) => (
                      <div key={key} className="flex flex-col gap-1">
                        <span className="text-xs font-medium capitalize text-muted-foreground">
                          {key.replace(/_/g, " ")}
                        </span>
                        <span className="text-sm font-medium text-foreground">{val}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gallery" className="mt-4">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Photo Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {user.gallery.map((img, i) => (
                      <div key={i} className="aspect-square overflow-hidden rounded-xl border bg-muted">
                        <img
                          src={img}
                          alt={`Gallery ${i + 1}`}
                          className="size-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {user.name}? This action cannot be undone.
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
