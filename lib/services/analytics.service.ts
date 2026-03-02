import { dummyAnalytics } from "@/lib/dummy-data"
import type { AnalyticsSummary } from "@/types"

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

export const analyticsService = {
  async getSummary(): Promise<AnalyticsSummary> {
    await delay(700)
    return dummyAnalytics
  },
}
