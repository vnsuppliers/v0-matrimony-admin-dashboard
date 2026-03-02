"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Moon, Sun, Bell, LogOut, Menu, User as UserIcon, Settings, Check } from "lucide-react"
import { useTheme } from "next-themes"
import { useAuthStore } from "@/lib/store/auth-store"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

const dummyNotifications = [
  { id: "1", title: "New user registration", description: "Priya Sharma just signed up.", time: "2 min ago", read: false },
  { id: "2", title: "Report flagged", description: "A profile has been reported for inappropriate content.", time: "15 min ago", read: false },
  { id: "3", title: "Subscription expired", description: "Rahul Verma's Premium plan has expired.", time: "1 hr ago", read: false },
  { id: "4", title: "Chat flagged", description: "A conversation has been flagged for review.", time: "3 hrs ago", read: true },
  { id: "5", title: "System update", description: "Dashboard v2.1 deployed successfully.", time: "5 hrs ago", read: true },
]

interface TopNavbarProps {
  onMobileMenuToggle: () => void
}

export function TopNavbar({ onMobileMenuToggle }: TopNavbarProps) {
  const { user, logout } = useAuthStore()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [notifications, setNotifications] = useState(dummyNotifications)
  const [notifOpen, setNotifOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/80 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          onClick={onMobileMenuToggle}
          aria-label="Toggle menu"
        >
          <Menu className="size-5" />
        </Button>
        <h2 className="text-lg font-semibold text-foreground">
          {user?.role === "super_admin" ? "Super Admin" : "Moderator"}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications Popover */}
        <Popover open={notifOpen} onOpenChange={setNotifOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="size-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 overflow-hidden p-0">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h4 className="text-sm font-semibold text-foreground">Notifications</h4>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary hover:text-primary/80" onClick={markAllRead}>
                  Mark all read
                </Button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Bell className="mb-2 size-8 opacity-30" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {notifications.map((notif) => (
                    <button
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-accent ${
                        !notif.read ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="mt-1 shrink-0">
                        {!notif.read ? (
                          <span className="flex size-2 rounded-full bg-primary" />
                        ) : (
                          <Check className="size-3 text-muted-foreground/50" />
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className={`text-sm leading-tight ${!notif.read ? "font-semibold text-foreground" : "font-medium text-muted-foreground"}`}>
                          {notif.title}
                        </span>
                        <span className="text-xs text-muted-foreground">{notif.description}</span>
                        <span className="mt-0.5 text-[10px] text-muted-foreground/70">{notif.time}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          <Sun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-3">
              <Avatar className="size-7">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-primary/10 text-xs text-primary">
                  {user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:inline-block">{user?.name}</span>
              <Badge variant="secondary" className="hidden text-[10px] md:inline-flex">
                {user?.role === "super_admin" ? "Admin" : "Mod"}
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="flex cursor-pointer items-center">
                <Settings className="mr-2 size-4" />
                Profile Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
