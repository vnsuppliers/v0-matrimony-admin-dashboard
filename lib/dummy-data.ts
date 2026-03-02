import type {
  User,
  Report,
  Subscription,
  ChatConversation,
  ChatMessage,
  AnalyticsSummary,
  ActivityLog,
} from "@/types"

const professions = [
  "Software Engineer", "Doctor", "Lawyer", "Teacher", "Business Analyst",
  "Architect", "Accountant", "Designer", "Pharmacist", "Dentist",
  "Civil Engineer", "Marketing Manager", "Data Scientist", "Nurse", "Banker"
]
const educations = [
  "B.Tech", "MBBS", "MBA", "B.Com", "M.Tech", "LLB", "BBA", "M.Sc", "Ph.D", "B.Sc"
]
const locations = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
  "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow"
]
const religions = ["Hindu", "Muslim", "Christian", "Sikh", "Buddhist", "Jain"]

const firstNamesMale = ["Arjun", "Rahul", "Vikram", "Aditya", "Rohan", "Karan", "Dev", "Nikhil", "Sahil", "Aman", "Ravi", "Sanjay", "Pranav", "Kunal", "Varun"]
const firstNamesFemale = ["Priya", "Ananya", "Neha", "Sneha", "Kavya", "Pooja", "Riya", "Ishita", "Meera", "Divya", "Sanya", "Tara", "Nisha", "Sakshi", "Aisha"]
const lastNames = ["Sharma", "Patel", "Gupta", "Singh", "Kumar", "Reddy", "Joshi", "Desai", "Mehta", "Verma", "Iyer", "Nair", "Kapoor", "Rao", "Das"]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateUsers(count: number): User[] {
  return Array.from({ length: count }, (_, i) => {
    const isBride = i % 2 === 0
    const firstName = isBride ? pick(firstNamesFemale) : pick(firstNamesMale)
    const lastName = pick(lastNames)
    const name = `${firstName} ${lastName}`
    const plan = pick(["Free", "Gold", "Premium"] as const)
    const status = Math.random() > 0.2 ? 1 : 0
    const suspended = Math.random() > 0.9

    return {
      id: `usr_${String(i + 1).padStart(4, "0")}`,
      profile_image: `https://api.dicebear.com/9.x/avataaars/svg?seed=${firstName}${i}`,
      name,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`,
      phone: `+91 ${Math.floor(7000000000 + Math.random() * 2999999999)}`,
      profile_type: isBride ? "Bride" : "Groom",
      profession: pick(professions),
      education: pick(educations),
      location: pick(locations),
      subscription_plan: plan,
      account_status: status as 0 | 1,
      is_suspended: suspended,
      created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      date_of_birth: new Date(1990 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      age: 24 + Math.floor(Math.random() * 12),
      height: `${5 + Math.floor(Math.random() * 2)}'${Math.floor(Math.random() * 12)}"`,
      weight: `${50 + Math.floor(Math.random() * 40)} kg`,
      religion: pick(religions),
      caste: "General",
      mother_tongue: pick(["Hindi", "English", "Tamil", "Telugu", "Kannada", "Bengali"]),
      marital_status: pick(["Never Married", "Divorced", "Widowed"]),
      about: `A ${isBride ? "warm and caring" : "dedicated and ambitious"} individual looking for a life partner. Enjoys reading, traveling, and spending time with family.`,
      gallery: Array.from({ length: 4 }, (__, j) => `https://api.dicebear.com/9.x/avataaars/svg?seed=${firstName}${i}gallery${j}`),
      partner_preferences: {
        age_range: `${24 + Math.floor(Math.random() * 4)}-${30 + Math.floor(Math.random() * 6)}`,
        height_range: `5'2"-6'0"`,
        education: pick(educations),
        profession: pick(professions),
        location: pick(locations),
        religion: pick(religions),
      },
      subscription_expiry: new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
      last_login: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      profile_visibility: Math.random() > 0.1,
    }
  })
}

export const dummyUsers: User[] = generateUsers(85)

export const dummyReports: Report[] = Array.from({ length: 18 }, (_, i) => {
  const reportedUser = dummyUsers[Math.floor(Math.random() * dummyUsers.length)]
  const reporter = dummyUsers[Math.floor(Math.random() * dummyUsers.length)]
  const reasons = [
    "Fake profile", "Inappropriate photos", "Harassment", "Spam messages",
    "Misleading information", "Offensive language", "Scam attempt"
  ]
  return {
    id: `rpt_${String(i + 1).padStart(4, "0")}`,
    reported_user_id: reportedUser.id,
    reported_user_name: reportedUser.name,
    reported_user_image: reportedUser.profile_image,
    reporter_id: reporter.id,
    reporter_name: reporter.name,
    reporter_image: reporter.profile_image,
    reason: pick(reasons),
    description: `User reported for ${pick(reasons).toLowerCase()}. Multiple complaints have been received.`,
    status: pick(["pending", "resolved", "dismissed"] as const),
    action_taken: Math.random() > 0.5 ? pick(["Warning sent", "Account suspended", "Profile removed"]) : undefined,
    created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    resolved_at: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
  }
})

export const dummySubscriptions: Subscription[] = dummyUsers
  .filter((u) => u.subscription_plan !== "Free")
  .map((u, i) => ({
    id: `sub_${String(i + 1).padStart(4, "0")}`,
    user_id: u.id,
    user_name: u.name,
    user_image: u.profile_image,
    plan: u.subscription_plan,
    amount: u.subscription_plan === "Gold" ? 999 : 1999,
    start_date: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
    expiry_date: u.subscription_expiry,
    status: new Date(u.subscription_expiry) > new Date() ? "active" : "expired",
    auto_renew: Math.random() > 0.4,
  }))

export const dummyChats: ChatConversation[] = Array.from({ length: 25 }, (_, i) => {
  const user1 = dummyUsers[i * 2]
  const user2 = dummyUsers[i * 2 + 1]
  const messages = [
    "Hi, I liked your profile!", "Thanks! Would love to connect.",
    "What are your hobbies?", "I enjoy reading and traveling.",
    "That sounds wonderful!", "Shall we exchange numbers?",
    "Your profile looks interesting.", "Let's get to know each other better.",
  ]
  return {
    id: `chat_${String(i + 1).padStart(4, "0")}`,
    participants: [
      { id: user1.id, name: user1.name, image: user1.profile_image, profile_type: user1.profile_type },
      { id: user2.id, name: user2.name, image: user2.profile_image, profile_type: user2.profile_type },
    ],
    last_message: pick(messages),
    last_message_at: new Date(Date.now() - Math.random() * 48 * 60 * 60 * 1000).toISOString(),
    is_flagged: Math.random() > 0.8,
    flag_reason: Math.random() > 0.8 ? pick(["Inappropriate content", "Spam", "Suspicious activity"]) : undefined,
    message_count: Math.floor(5 + Math.random() * 50),
  }
})

export const dummyChatMessages: ChatMessage[] = Array.from({ length: 30 }, (_, i) => ({
  id: `msg_${String(i + 1).padStart(4, "0")}`,
  sender_id: dummyUsers[i % dummyUsers.length].id,
  sender_name: dummyUsers[i % dummyUsers.length].name,
  content: pick([
    "Hello! How are you?",
    "I really liked your profile.",
    "What do you do for a living?",
    "I'm looking for a genuine connection.",
    "Would you like to meet sometime?",
    "Tell me more about yourself.",
    "I enjoy cooking and reading books.",
    "That's great! We have similar interests.",
  ]),
  timestamp: new Date(Date.now() - (30 - i) * 10 * 60 * 1000).toISOString(),
  is_flagged: Math.random() > 0.9,
}))

export const dummyAnalytics: AnalyticsSummary = {
  total_users: dummyUsers.length,
  active_users: dummyUsers.filter((u) => u.account_status === 1 && !u.is_suspended).length,
  pending_users: dummyUsers.filter((u) => u.account_status === 0).length,
  premium_users: dummyUsers.filter((u) => u.subscription_plan === "Premium").length,
  suspended_users: dummyUsers.filter((u) => u.is_suspended).length,
  total_revenue: dummySubscriptions.reduce((acc, s) => acc + s.amount, 0),
  monthly_registrations: [
    { month: "Jul", count: 12 }, { month: "Aug", count: 18 },
    { month: "Sep", count: 15 }, { month: "Oct", count: 22 },
    { month: "Nov", count: 28 }, { month: "Dec", count: 35 },
    { month: "Jan", count: 30 }, { month: "Feb", count: 25 },
    { month: "Mar", count: 38 }, { month: "Apr", count: 42 },
    { month: "May", count: 48 }, { month: "Jun", count: 55 },
  ],
  revenue_growth: [
    { month: "Jul", amount: 15000 }, { month: "Aug", amount: 22000 },
    { month: "Sep", amount: 18000 }, { month: "Oct", amount: 28000 },
    { month: "Nov", amount: 35000 }, { month: "Dec", amount: 42000 },
    { month: "Jan", amount: 38000 }, { month: "Feb", amount: 32000 },
    { month: "Mar", amount: 45000 }, { month: "Apr", amount: 52000 },
    { month: "May", amount: 58000 }, { month: "Jun", amount: 65000 },
  ],
  profile_distribution: [
    { type: "Bride", count: dummyUsers.filter((u) => u.profile_type === "Bride").length },
    { type: "Groom", count: dummyUsers.filter((u) => u.profile_type === "Groom").length },
  ],
  subscription_breakdown: [
    { plan: "Free", count: dummyUsers.filter((u) => u.subscription_plan === "Free").length },
    { plan: "Gold", count: dummyUsers.filter((u) => u.subscription_plan === "Gold").length },
    { plan: "Premium", count: dummyUsers.filter((u) => u.subscription_plan === "Premium").length },
  ],
}

export const dummyActivityLogs: ActivityLog[] = [
  { id: "log_001", action: "Profile Updated", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), details: "Updated profession and location" },
  { id: "log_002", action: "Photo Uploaded", timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), details: "Added 2 new gallery photos" },
  { id: "log_003", action: "Subscription Upgraded", timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), details: "Upgraded from Free to Gold" },
  { id: "log_004", action: "Password Changed", timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), details: "Password changed successfully" },
  { id: "log_005", action: "Profile Created", timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(), details: "New account registration" },
]
