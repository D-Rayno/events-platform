import { create } from 'zustand'
import type { User } from '~/types/user'

interface AuthState {
  user: User | null
  isInitialized: boolean
  
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

// Computed getters as separate functions
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isInitialized: false,

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
    permission;
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

// Export computed selector hooks
export const useIsAuthenticated = () => useAuthStore((state) => !!state.user)
export const useIsEmailVerified = () => useAuthStore((state) => state.user?.isEmailVerified || false)
export const useFullName = () => useAuthStore((state) => {
  const user = state.user
  if (!user) return ''
  return `${user.firstName} ${user.lastName}`
})
export const useInitials = () => useAuthStore((state) => {
  const user = state.user
  if (!user) return ''
  return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
})
export const useAvatarUrl = () => useAuthStore((state) => {
  const user = state.user
  if (!user?.avatarUrl) return null
  return user.avatarUrl.startsWith('http')
    ? user.avatarUrl
    : `/uploads/${user.avatarUrl}`
})
export const useNeedsVerification = () => {
  const isAuth = useIsAuthenticated()
  const isVerified = useIsEmailVerified()
  return isAuth && !isVerified
}