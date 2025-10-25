import { create } from 'zustand'
import type { User } from '~/types/user'

interface AuthState {
  user: User | null
  isInitialized: boolean

  // Derived / Computed values
  isAuthenticated: () => boolean
  isEmailVerified: () => boolean
  fullName: () => string
  initials: () => string
  avatarUrl: () => string | null
  needsVerification: () => boolean

  // Actions
  initializeAuth: (userData: User | null) => void
  setUser: (userData: User | null) => void
  updateUser: (updates: Partial<User>) => void
  clearUser: () => void
  updateAvatar: (url: string | null) => void
  markEmailAsVerified: () => void
  hasPermission: (permission: string) => boolean
  getAgeCategory: () => 'youth' | 'adult' | 'senior' | null
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isInitialized: false,

  /**
   * ─── COMPUTED SELECTORS ────────────────────────────────
   */
  isAuthenticated: () => !!get().user,

  isEmailVerified: () => get().user?.isEmailVerified || false,

  fullName: () => {
    const user = get().user
    return user ? `${user.firstName} ${user.lastName}` : ''
  },

  initials: () => {
    const user = get().user
    if (!user) return ''
    const first = user.firstName?.[0]?.toUpperCase() ?? ''
    const last = user.lastName?.[0]?.toUpperCase() ?? ''
    return `${first}${last}`
  },

  avatarUrl: () => {
    const user = get().user
    if (!user?.avatarUrl) return null
    return user.avatarUrl.startsWith('http')
      ? user.avatarUrl
      : `/uploads/${user.avatarUrl}`
  },

  needsVerification: () =>
    get().isAuthenticated() && !get().isEmailVerified(),

  /**
   * ─── ACTIONS ───────────────────────────────────────────
   */
  initializeAuth: (userData) => {
    set({ user: userData, isInitialized: true })
  },

  setUser: (userData) => {
    set({ user: userData })
  },

  updateUser: (updates) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    }))
  },

  clearUser: () => {
    set({ user: null })
  },

  updateAvatar: (url) => {
    set((state) => ({
      user: state.user ? { ...state.user, avatarUrl: url } : null,
    }))
  },

  markEmailAsVerified: () => {
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            isEmailVerified: true,
            emailVerifiedAt: new Date().toISOString(),
          }
        : null,
    }))
  },

  hasPermission: (permission: string) => {
    // const user = get().user
    // if (!user?.permissions) return false
    // return user.permissions.includes(permission)
    return !!permission
  },

  getAgeCategory: () => {
    const user = get().user
    if (!user || !user.age) return null
    if (user.age < 26) return 'youth'
    if (user.age >= 60) return 'senior'
    return 'adult'
  },
}))
