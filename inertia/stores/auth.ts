import { create } from 'zustand'
import type { User } from '~/types/user'

interface AuthState {
  user: User | null
  isInitialized: boolean
  
  // Computed getters
  isAuthenticated: boolean
  isEmailVerified: boolean
  fullName: string
  initials: string
  avatarUrl: string | null
  needsVerification: boolean
  
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

  // Computed getters as properties
  get isAuthenticated() {
    return !!get().user
  },
  
  get isEmailVerified() {
    return get().user?.isEmailVerified || false
  },
  
  get fullName() {
    const user = get().user
    if (!user) return ''
    return `${user.firstName} ${user.lastName}`
  },
  
  get initials() {
    const user = get().user
    if (!user) return ''
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
  },
  
  get avatarUrl() {
    const user = get().user
    if (!user?.avatarUrl) return null
    return user.avatarUrl.startsWith('http')
      ? user.avatarUrl
      : `/uploads/${user.avatarUrl}`
  },
  
  get needsVerification() {
    return get().isAuthenticated && !get().isEmailVerified
  },

  // Actions
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
    // Implement permission logic here
    return false
  },

  getAgeCategory: () => {
    const user = get().user
    if (!user) return null

    const age = user.age
    if (age < 26) return 'youth'
    if (age >= 60) return 'senior'
    return 'adult'
  },
}))