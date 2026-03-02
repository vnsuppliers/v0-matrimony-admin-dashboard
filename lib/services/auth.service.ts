import type { AdminUser } from "@/types"

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

const ADMIN_ACCOUNTS = [
  {
    email: "admin@matrimony.com",
    password: "admin123",
    user: {
      id: "admin_001",
      name: "Super Admin",
      email: "admin@matrimony.com",
      role: "super_admin" as const,
      avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=admin",
    },
  },
  {
    email: "mod@matrimony.com",
    password: "mod123",
    user: {
      id: "admin_002",
      name: "Moderator",
      email: "mod@matrimony.com",
      role: "moderator" as const,
      avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=moderator",
    },
  },
]

export const authService = {
  async login(email: string, password: string): Promise<{ user: AdminUser; token: string }> {
    await delay(800)
    const account = ADMIN_ACCOUNTS.find((a) => a.email === email && a.password === password)
    if (!account) {
      throw new Error("Invalid email or password")
    }
    return {
      user: account.user,
      token: `jwt_token_${Date.now()}_${account.user.id}`,
    }
  },

  async verifyToken(token: string): Promise<AdminUser | null> {
    await delay(300)
    if (token && token.startsWith("jwt_token_")) {
      const adminId = token.split("_").pop()
      const account = ADMIN_ACCOUNTS.find((a) => a.user.id === adminId)
      return account?.user ?? ADMIN_ACCOUNTS[0].user
    }
    return null
  },

  async logout(): Promise<void> {
    await delay(200)
  },
}
