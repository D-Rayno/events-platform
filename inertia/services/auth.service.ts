// inertia/services/auth.service.ts
import { router } from '@inertiajs/vue3'
import { useAuthStore } from '~/stores/auth'
import type { LoginCredentials, RegisterData, toFormData } from '~/types/auth'

class AuthService {
  async login(credentials: LoginCredentials, remember: boolean = false) {
    return new Promise((resolve, reject) => {
      router.post('/auth/login', { ...credentials, remember } as Record<string, any>, {
        preserveScroll: true,
        onSuccess: () => resolve(true),
        onError: (errors) => reject(errors),
      })
    })
  }

  async register(data: RegisterData) {
    return new Promise((resolve, reject) => {
      // Convert to plain object for Inertia
      const formData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        age: typeof data.age === 'string' ? Number.parseInt(data.age) : data.age,
        province: data.province,
        commune: data.commune,
        ...(data.phoneNumber && { phoneNumber: data.phoneNumber }),
      }

      router.post('/auth/register', formData as any, {
        preserveScroll: true,
        onSuccess: () => resolve(true),
        onError: (errors) => reject(errors),
      })
    })
  }

  async logout() {
    const authStore = useAuthStore()
    return new Promise((resolve) => {
      router.post(
        '/auth/logout',
        {},
        {
          onSuccess: () => {
            authStore.clearUser()
            resolve(true)
          },
        }
      )
    })
  }

  async forgotPassword(email: string) {
    return new Promise((resolve, reject) => {
      router.post('/auth/forgot-password', { email } as any, {
        preserveScroll: true,
        onSuccess: () => resolve(true),
        onError: (errors) => reject(errors),
      })
    })
  }

  async resetPassword(token: string, password: string, password_confirmation: string) {
    return new Promise((resolve, reject) => {
      router.post('/auth/reset-password', { token, password, password_confirmation } as any, {
        preserveScroll: true,
        onSuccess: () => resolve(true),
        onError: (errors) => reject(errors),
      })
    })
  }

  async resendVerificationEmail() {
    return new Promise((resolve, reject) => {
      router.post(
        '/auth/resend-verification',
        {},
        {
          preserveScroll: true,
          onSuccess: () => resolve(true),
          onError: (errors) => reject(errors),
        }
      )
    })
  }

  needsEmailVerification(): boolean {
    const authStore = useAuthStore()
    return authStore.isAuthenticated && !authStore.isEmailVerified
  }

  redirectBasedOnAuthState() {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
      router.visit('/auth/login')
    } else if (!authStore.isEmailVerified) {
      router.visit('/')
    }
  }
}

export const authService = new AuthService()
