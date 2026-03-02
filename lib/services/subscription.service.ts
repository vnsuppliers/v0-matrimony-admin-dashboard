import { dummySubscriptions } from "@/lib/dummy-data"
import type { Subscription } from "@/types"

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

let subscriptions = [...dummySubscriptions]

export const subscriptionService = {
  async getSubscriptions(): Promise<Subscription[]> {
    await delay(600)
    return [...subscriptions]
  },

  async renewSubscription(id: string): Promise<Subscription | null> {
    await delay(500)
    const idx = subscriptions.findIndex((s) => s.id === id)
    if (idx === -1) return null
    subscriptions[idx] = {
      ...subscriptions[idx],
      status: "active",
      expiry_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    }
    return subscriptions[idx]
  },

  async cancelSubscription(id: string): Promise<Subscription | null> {
    await delay(500)
    const idx = subscriptions.findIndex((s) => s.id === id)
    if (idx === -1) return null
    subscriptions[idx] = {
      ...subscriptions[idx],
      status: "cancelled",
      auto_renew: false,
    }
    return subscriptions[idx]
  },

  getRevenueSummary() {
    const active = subscriptions.filter((s) => s.status === "active")
    const total = subscriptions.reduce((acc, s) => acc + s.amount, 0)
    const monthly = Math.round(total / 12)
    return { total, monthly, activeCount: active.length, totalCount: subscriptions.length }
  },
}
