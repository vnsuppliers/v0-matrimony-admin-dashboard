import { dummyUsers } from "@/lib/dummy-data"
import type { User, PaginatedResponse, AccountStatus } from "@/types"

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

let users = [...dummyUsers]

export const usersService = {
  async getUsers(params?: {
    page?: number
    per_page?: number
    search?: string
    profile_type?: string
    profession?: string
    education?: string
    location?: string
    subscription?: string
    sort_by?: string
    sort_order?: "asc" | "desc"
  }): Promise<PaginatedResponse<User>> {
    await delay(600)
    let filtered = [...users]

    if (params?.search) {
      const s = params.search.toLowerCase()
      filtered = filtered.filter(
        (u) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s)
      )
    }
    if (params?.profile_type && params.profile_type !== "all") {
      filtered = filtered.filter((u) => u.profile_type === params.profile_type)
    }
    if (params?.profession && params.profession !== "all") {
      filtered = filtered.filter((u) => u.profession === params.profession)
    }
    if (params?.education && params.education !== "all") {
      filtered = filtered.filter((u) => u.education === params.education)
    }
    if (params?.location && params.location !== "all") {
      filtered = filtered.filter((u) => u.location === params.location)
    }
    if (params?.subscription && params.subscription !== "all") {
      filtered = filtered.filter((u) => u.subscription_plan === params.subscription)
    }

    if (params?.sort_by) {
      filtered.sort((a, b) => {
        const key = params.sort_by as keyof User
        const aVal = a[key]
        const bVal = b[key]
        if (typeof aVal === "string" && typeof bVal === "string") {
          return params.sort_order === "desc" ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal)
        }
        return 0
      })
    }

    const page = params?.page ?? 1
    const perPage = params?.per_page ?? 10
    const start = (page - 1) * perPage
    const paged = filtered.slice(start, start + perPage)

    return {
      data: paged,
      total: filtered.length,
      page,
      per_page: perPage,
      total_pages: Math.ceil(filtered.length / perPage),
    }
  },

  async getUserById(id: string): Promise<User | null> {
    await delay(400)
    return users.find((u) => u.id === id) ?? null
  },

  async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    await delay(500)
    const idx = users.findIndex((u) => u.id === id)
    if (idx === -1) return null
    users[idx] = { ...users[idx], ...data }
    return users[idx]
  },

  async updateUserStatus(id: string, status: AccountStatus): Promise<User | null> {
    await delay(400)
    const idx = users.findIndex((u) => u.id === id)
    if (idx === -1) return null
    users[idx] = { ...users[idx], account_status: status }
    return users[idx]
  },

  async toggleSuspension(id: string): Promise<User | null> {
    await delay(400)
    const idx = users.findIndex((u) => u.id === id)
    if (idx === -1) return null
    users[idx] = { ...users[idx], is_suspended: !users[idx].is_suspended }
    return users[idx]
  },

  async deleteUser(id: string): Promise<boolean> {
    await delay(500)
    const len = users.length
    users = users.filter((u) => u.id !== id)
    return users.length < len
  },
}
