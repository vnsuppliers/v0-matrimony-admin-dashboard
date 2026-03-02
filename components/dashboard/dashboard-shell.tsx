"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { AppSidebar } from "./app-sidebar"
import { TopNavbar } from "./top-navbar"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Heart, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Users, Flag, CreditCard, MessageCircle, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/store/auth-store"

const mobileNav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/dashboard/users", icon: Users },
  { label: "Reports", href: "/dashboard/reports", icon: Flag },
  { label: "Subscriptions", href: "/dashboard/subscriptions", icon: CreditCard },
  { label: "Chat Monitor", href: "/dashboard/chats", icon: MessageCircle },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="flex w-72 flex-col p-0">
          <div className="flex h-16 items-center gap-3 border-b px-4">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
              <Heart className="size-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground">Matrimony</span>
              <span className="text-[10px] text-muted-foreground">Admin Panel</span>
            </div>
          </div>
          <nav className="flex flex-col gap-1 p-3">
            {mobileNav.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className="size-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
          <div className="mt-auto border-t p-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="size-4" />
              <span className="text-xs">Log out</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div
        className={cn(
          "flex min-h-screen flex-col transition-all duration-300",
          collapsed ? "md:ml-[68px]" : "md:ml-64"
        )}
      >
        <TopNavbar
          onMobileMenuToggle={() => setMobileOpen(true)}
        />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
