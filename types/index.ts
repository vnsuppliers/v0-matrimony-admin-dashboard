export type Role = "super_admin" | "moderator"

export interface AdminUser {
  id: string
  name: string
  email: string
  role: Role
  avatar?: string
}

export interface AuthState {
  user: AdminUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => void
}

export type AccountStatus = 0 | 1 // 0 = pending, 1 = approved

export type ProfileType = "Bride" | "Groom"

export type SubscriptionPlan = "Free" | "Gold" | "Premium"

export interface User {
  id: string
  profile_image: string
  name: string
  email: string
  phone: string
  profile_type: ProfileType
  profession: string
  education: string
  location: string
  subscription_plan: SubscriptionPlan
  account_status: AccountStatus
  is_suspended: boolean
  created_at: string
  date_of_birth: string
  age: number
  height: string
  weight: string
  religion: string
  caste: string
  mother_tongue: string
  marital_status: string
  about: string
  gallery: string[]
  partner_preferences: PartnerPreferences
  subscription_expiry: string
  last_login: string
  profile_visibility: boolean
}

export interface PartnerPreferences {
  age_range: string
  height_range: string
  education: string
  profession: string
  location: string
  religion: string
}

export interface Report {
  id: string
  reported_user_id: string
  reported_user_name: string
  reported_user_image: string
  reporter_id: string
  reporter_name: string
  reporter_image: string
  reason: string
  description: string
  status: "pending" | "resolved" | "dismissed"
  action_taken?: string
  created_at: string
  resolved_at?: string
}

export interface Subscription {
  id: string
  user_id: string
  user_name: string
  user_image: string
  plan: SubscriptionPlan
  amount: number
  start_date: string
  expiry_date: string
  status: "active" | "expired" | "cancelled"
  auto_renew: boolean
}

export interface ChatConversation {
  id: string
  participants: {
    id: string
    name: string
    image: string
    profile_type: ProfileType
  }[]
  last_message: string
  last_message_at: string
  is_flagged: boolean
  flag_reason?: string
  message_count: number
}

export interface ChatMessage {
  id: string
  sender_id: string
  sender_name: string
  content: string
  timestamp: string
  is_flagged: boolean
}

export interface AnalyticsSummary {
  total_users: number
  active_users: number
  pending_users: number
  premium_users: number
  suspended_users: number
  total_revenue: number
  monthly_registrations: { month: string; count: number }[]
  revenue_growth: { month: string; amount: number }[]
  profile_distribution: { type: string; count: number }[]
  subscription_breakdown: { plan: string; count: number }[]
}

export interface ActivityLog {
  id: string
  action: string
  timestamp: string
  details: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}
