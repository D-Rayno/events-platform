// inertia/services/auth.service.ts
import { router } from '@inertiajs/react'
import { useAuthStore } from '~/stores/auth'
import type { LoginCredentials, RegisterData } from '~/types/auth'
import { toFormData } from '~/types/auth'

class AuthService {
  async login(credentials: LoginCredentials, remember = false) {
    return new Promise<boolean>((resolve, reject) => {
      router.post('/auth/login', { ...credentials, remember } as Record<string, any>, {
        preserveScroll: true,
        onSuccess: () => resolve(true),
        onError: (errors: any) => reject(errors),
      })
    })
  }

  async register(data: RegisterData) {
    return new Promise<boolean>((resolve, reject) => {
      // Convert to plain object (or form-like object) for Inertia
      const formData = toFormData(data) as Record<string, any>

      router.post('/auth/register', formData, {
        preserveScroll: true,
        onSuccess: () => resolve(true),
        onError: (errors: any) => reject(errors),
      })
    })
  }

  async logout() {
    const authStore = useAuthStore()
    return new Promise<boolean>((resolve, reject) => {
      router.post(
        '/auth/logout',
        {},
        {
          onSuccess: () => {
            authStore.clearUser()
            resolve(true)
          },
          onError: (err: any) => {
            // optional: still clear user on certain errors?
            reject(err)
          },
        }
      )
    })
  }

  async forgotPassword(email: string) {
    return new Promise<boolean>((resolve, reject) => {
      router.post('/auth/forgot-password', { email } as any, {
        preserveScroll: true,
        onSuccess: () => resolve(true),
        onError: (errors: any) => reject(errors),
      })
    })
  }

  async resetPassword(token: string, password: string, password_confirmation: string) {
    return new Promise<boolean>((resolve, reject) => {
      router.post('/auth/reset-password', { token, password, password_confirmation } as any, {
        preserveScroll: true,
        onSuccess: () => resolve(true),
        onError: (errors: any) => reject(errors),
      })
    })
  }

  async resendVerificationEmail() {
    return new Promise<boolean>((resolve, reject) => {
      router.post(
        '/auth/resend-verification',
        {},
        {
          preserveScroll: true,
          onSuccess: () => resolve(true),
          onError: (errors: any) => reject(errors),
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
