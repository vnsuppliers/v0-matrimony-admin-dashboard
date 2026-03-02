"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Flag,
  CreditCard,
  MessageCircle,
  Heart,
  ChevronLeft,
  LogOut,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuthStore } from "@/lib/store/auth-store"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/dashboard/users", icon: Users },
  { label: "Reports", href: "/dashboard/reports", icon: Flag },
  { label: "Subscriptions", href: "/dashboard/subscriptions", icon: CreditCard },
  { label: "Chat Monitor", href: "/dashboard/chats", icon: MessageCircle },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
]

interface AppSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-sidebar transition-all duration-300",
          collapsed ? "w-[68px]" : "w-64"
        )}
      >
        {/* Logo + Collapse Toggle */}
        <div className={cn("flex h-16 items-center border-b px-4", collapsed ? "justify-center" : "justify-between")}>
          <div className={cn("flex items-center", collapsed ? "" : "gap-3")}>
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Heart className="size-5 text-primary" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-bold text-sidebar-foreground">Matrimony</span>
                <span className="text-[10px] text-muted-foreground">Admin Panel</span>
              </div>
            )}
          </div>
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onToggle}
              className="shrink-0 text-muted-foreground hover:text-foreground"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="size-4" />
            </Button>
          )}
          {collapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={onToggle}
                  className="absolute -right-3 top-5 z-50 size-6 rounded-full border bg-card shadow-sm"
                  aria-label="Expand sidebar"
                >
                  <ChevronLeft className="size-3 rotate-180" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Expand</TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href)
              const Icon = item.icon

              const link = (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                    collapsed && "justify-center px-0"
                  )}
                >
                  <Icon className="size-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              )

              if (collapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{link}</TooltipTrigger>
                    <TooltipContent side="right" className="font-medium">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                )
              }

              return link
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="border-t p-3">
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full px-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                Log out
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="size-4" />
              <span className="text-xs">Log out</span>
            </Button>
          )}
        </div>
      </aside>
    </TooltipProvider>
  )
}
