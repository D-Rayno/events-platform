import '@inertiajs/vue3'

declare module '@inertiajs/vue3' {
  export interface PageProps {
    auth?: {
      user?: {
        id: number
        firstName: string
        lastName: string
        email: string
        age: number
        province: string
        commune: string
        phoneNumber?: string
        avatarUrl?: string | null
        isEmailVerified: boolean
        emailVerifiedAt?: string
        createdAt: string
      }
    }
    flash?: {
      success?: string
      error?: string
      warning?: string
      info?: string
    }
    errors?: Record<string, string>
  }
}
