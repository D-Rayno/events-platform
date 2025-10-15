// inertia/services/auth.service.ts
import { router } from '@inertiajs/vue3'
import { useAuthStore } from '~/stores/auth'
import type { LoginCredentials, RegisterData } from '~/types/auth'

/**
 * Authentication service
 * Handles all authentication-related operations
 */
class AuthService {
  /**
   * Login user with credentials
   * @param credentials - Email and password
   * @param remember - Remember user session
   */
  async login(credentials: LoginCredentials, remember: boolean = false) {
    return new Promise((resolve, reject) => {
      router.post(
        '/auth/login',
        { ...credentials, remember },
        {
          preserveScroll: true,
          onSuccess: () => resolve(true),
          onError: (errors) => reject(errors),
        }
      )
    })
  }

  /**
   * Register new user
   * @param data - Registration data
   */
  async register(data: RegisterData) {
    return new Promise((resolve, reject) => {
      router.post('/auth/register', data, {
        preserveScroll: true,
        onSuccess: () => resolve(true),
        onError: (errors) => reject(errors),
      })
    })
  }

  /**
   * Logout current user
   */
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

  /**
   * Request password reset
   * @param email - User email
   */
  async forgotPassword(email: string) {
    return new Promise((resolve, reject) => {
      router.post(
        '/auth/forgot-password',
        { email },
        {
          preserveScroll: true,
          onSuccess: () => resolve(true),
          onError: (errors) => reject(errors),
        }
      )
    })
  }

  /**
   * Reset password with token
   * @param token - Reset token
   * @param password - New password
   * @param password_confirmation - Password confirmation
   */
  async resetPassword(token: string, password: string, password_confirmation: string) {
    return new Promise((resolve, reject) => {
      router.post(
        '/auth/reset-password',
        { token, password, password_confirmation },
        {
          preserveScroll: true,
          onSuccess: () => resolve(true),
          onError: (errors) => reject(errors),
        }
      )
    })
  }

  /**
   * Resend verification email
   */
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

  /**
   * Check if user needs email verification
   */
  needsEmailVerification(): boolean {
    const authStore = useAuthStore()
    return authStore.isAuthenticated && !authStore.isEmailVerified
  }

  /**
   * Redirect to appropriate page based on auth state
   */
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