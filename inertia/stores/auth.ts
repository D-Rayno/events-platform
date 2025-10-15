import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '~/types/user'

/**
 * Authentication Store
 * Manages user authentication state and related operations
 */
export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const isInitialized = ref(false)

  // Computed properties
  const isAuthenticated = computed(() => !!user.value)

  const isEmailVerified = computed(() => {
    return user.value?.isEmailVerified || false
  })

  const fullName = computed(() => {
    if (!user.value) return ''
    return `${user.value.firstName} ${user.value.lastName}`
  })

  const initials = computed(() => {
    if (!user.value) return ''
    return `${user.value.firstName[0]}${user.value.lastName[0]}`.toUpperCase()
  })

  const avatarUrl = computed(() => {
    if (!user.value?.avatarUrl) return null
    return user.value.avatarUrl.startsWith('http')
      ? user.value.avatarUrl
      : `/uploads/${user.value.avatarUrl}`
  })

  const needsVerification = computed(() => {
    return isAuthenticated.value && !isEmailVerified.value
  })

  // Actions
  /**
   * Initialize auth state from shared props
   * @param userData - User data from server
   */
  function initializeAuth(userData: User | null) {
    user.value = userData
    isInitialized.value = true
  }

  /**
   * Set user data
   * @param userData - User data to set
   */
  function setUser(userData: User | null) {
    user.value = userData
  }

  /**
   * Update user data (partial update)
   * @param updates - Partial user data to update
   */
  function updateUser(updates: Partial<User>) {
    if (user.value) {
      user.value = { ...user.value, ...updates }
    }
  }

  /**
   * Clear user data (logout)
   */
  function clearUser() {
    user.value = null
  }

  /**
   * Update user avatar
   * @param avatarUrl - New avatar URL
   */
  function updateAvatar(avatarUrl: string | null) {
    if (user.value) {
      user.value.avatarUrl = avatarUrl
    }
  }

  /**
   * Mark email as verified
   */
  function markEmailAsVerified() {
    if (user.value) {
      user.value.isEmailVerified = true
      user.value.emailVerifiedAt = new Date().toISOString()
    }
  }

  /**
   * Check if user has a specific permission or role
   * @param permission - Permission to check
   */
  function hasPermission(permission: string): boolean {
    // Implement permission logic here
    return false
  }

  /**
   * Get user age category
   */
  function getAgeCategory(): 'youth' | 'adult' | 'senior' | null {
    if (!user.value) return null

    const age = user.value.age
    if (age < 26) return 'youth'
    if (age >= 60) return 'senior'
    return 'adult'
  }

  return {
    // State
    user,
    isInitialized,

    // Computed
    isAuthenticated,
    isEmailVerified,
    fullName,
    initials,
    avatarUrl,
    needsVerification,

    // Actions
    initializeAuth,
    setUser,
    updateUser,
    clearUser,
    updateAvatar,
    markEmailAsVerified,
    hasPermission,
    getAgeCategory,
  }
})
