import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  age: number
  province: string
  commune: string
  phoneNumber?: string
  avatar?: string
  emailVerifiedAt?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  const isEmailVerified = computed(() => !!user.value?.emailVerifiedAt)
  const fullName = computed(() =>
    user.value ? `${user.value.firstName} ${user.value.lastName}` : ''
  )

  function setUser(userData: User | null) {
    user.value = userData
  }

  function updateUser(updates: Partial<User>) {
    if (user.value) {
      user.value = { ...user.value, ...updates }
    }
  }

  function clearUser() {
    user.value = null
  }

  return {
    user,
    isAuthenticated,
    isEmailVerified,
    fullName,
    setUser,
    updateUser,
    clearUser,
  }
})
