// inertia/types/user.ts
export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  age: number
  province: string
  commune: string
  phoneNumber?: string
  avatarUrl?: string | null
  avatar?: string | null // Add this for compatibility
  isEmailVerified: boolean
  emailVerifiedAt?: string
  createdAt: string
}

export interface UpdateProfileData {
  firstName?: string
  lastName?: string
  age?: number
  province?: string
  commune?: string
  phoneNumber?: string
  avatar?: File | null
  avatarUrl?: string | null
}
