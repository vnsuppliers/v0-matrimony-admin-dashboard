"use client"

import { useState } from "react"
import { useAuthStore } from "@/lib/store/auth-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import {
  User,
  Mail,
  Shield,
  Bell,
  Lock,
  Save,
  Eye,
  EyeOff,
} from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuthStore()
  const [saving, setSaving] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
  })

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  const [notifSettings, setNotifSettings] = useState({
    newRegistrations: true,
    reportFlags: true,
    subscriptionChanges: true,
    chatFlags: false,
    systemUpdates: true,
  })

  const handleSaveProfile = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast.success("Profile updated successfully")
    }, 800)
  }

  const handleChangePassword = () => {
    if (!passwords.current) {
      toast.error("Please enter your current password")
      return
    }
    if (passwords.new.length < 6) {
      toast.error("New password must be at least 6 characters")
      return
    }
    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords do not match")
      return
    }
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setPasswords({ current: "", new: "", confirm: "" })
      toast.success("Password changed successfully")
    }, 800)
  }

  const handleSaveNotifications = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast.success("Notification preferences saved")
    }, 500)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and notification preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Profile */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="size-5 text-primary" />
                <CardTitle className="text-base">Profile Information</CardTitle>
              </div>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="size-16">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-primary/10 text-lg text-primary">
                    {user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                  <Badge variant="secondary" className="w-fit text-xs">
                    {user?.role === "super_admin" ? "Super Admin" : "Moderator"}
                  </Badge>
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name" className="flex items-center gap-1.5 text-sm">
                    <User className="size-3.5 text-muted-foreground" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email" className="flex items-center gap-1.5 text-sm">
                    <Mail className="size-3.5 text-muted-foreground" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={saving} className="gap-2">
                  <Save className="size-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="size-5 text-primary" />
                <CardTitle className="text-base">Change Password</CardTitle>
              </div>
              <CardDescription>Ensure your account is using a secure password</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="current-password" className="text-sm">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwords.current}
                    onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                    placeholder="Enter current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="new-password" className="text-sm">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={passwords.new}
                      onChange={(e) => setPasswords((p) => ({ ...p, new: e.target.value }))}
                      placeholder="Enter new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="confirm-password" className="text-sm">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleChangePassword} disabled={saving} variant="outline" className="gap-2">
                  <Lock className="size-4" />
                  {saving ? "Changing..." : "Change Password"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Notification Preferences & Account Info */}
        <div className="flex flex-col gap-6">
          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="size-5 text-primary" />
                <CardTitle className="text-base">Notifications</CardTitle>
              </div>
              <CardDescription>Choose what alerts you receive</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {[
                { key: "newRegistrations" as const, label: "New Registrations", desc: "When a new user signs up" },
                { key: "reportFlags" as const, label: "Report Flags", desc: "When a user is reported" },
                { key: "subscriptionChanges" as const, label: "Subscription Changes", desc: "Plan upgrades, cancellations" },
                { key: "chatFlags" as const, label: "Chat Flags", desc: "Flagged conversations" },
                { key: "systemUpdates" as const, label: "System Updates", desc: "Maintenance and updates" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                    <span className="text-xs text-muted-foreground">{item.desc}</span>
                  </div>
                  <Switch
                    checked={notifSettings[item.key]}
                    onCheckedChange={(checked) =>
                      setNotifSettings((prev) => ({ ...prev, [item.key]: checked }))
                    }
                  />
                </div>
              ))}
              <Separator />
              <Button onClick={handleSaveNotifications} disabled={saving} variant="outline" size="sm" className="w-full gap-2">
                <Save className="size-3.5" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="size-5 text-primary" />
                <CardTitle className="text-base">Account Info</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Role</span>
                <Badge variant="outline" className="text-xs">
                  {user?.role === "super_admin" ? "Super Admin" : "Moderator"}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">User ID</span>
                <span className="font-mono text-xs text-foreground">{user?.id}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge className="bg-success/10 text-success text-xs">Active</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
