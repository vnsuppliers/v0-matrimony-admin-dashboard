"use client"

import { create } from "zustand"
import type { AuthState } from "@/types"
import { authService } from "@/lib/services/auth.service"

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    const { user, token } = await authService.login(email, password)
    localStorage.setItem("auth_token", token)
    localStorage.setItem("auth_user", JSON.stringify(user))
    set({ user, token, isAuthenticated: true, isLoading: false })
  },

  logout: () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")
    set({ user: null, token: null, isAuthenticated: false, isLoading: false })
  },

  checkAuth: () => {
    const token = localStorage.getItem("auth_token")
    const userStr = localStorage.getItem("auth_user")
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        set({ user, token, isAuthenticated: true, isLoading: false })
      } catch {
        set({ user: null, token: null, isAuthenticated: false, isLoading: false })
      }
    } else {
      set({ isLoading: false })
    }
  },
}))
