import { dummyReports } from "@/lib/dummy-data"
import type { Report } from "@/types"

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

let reports = [...dummyReports]

export const reportsService = {
  async getReports(): Promise<Report[]> {
    await delay(600)
    return [...reports]
  },

  async resolveReport(id: string, action: string): Promise<Report | null> {
    await delay(400)
    const idx = reports.findIndex((r) => r.id === id)
    if (idx === -1) return null
    reports[idx] = {
      ...reports[idx],
      status: "resolved",
      action_taken: action,
      resolved_at: new Date().toISOString(),
    }
    return reports[idx]
  },

  async dismissReport(id: string): Promise<Report | null> {
    await delay(400)
    const idx = reports.findIndex((r) => r.id === id)
    if (idx === -1) return null
    reports[idx] = { ...reports[idx], status: "dismissed", resolved_at: new Date().toISOString() }
    return reports[idx]
  },
}
