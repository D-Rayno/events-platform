// inertia/types/auth.ts
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  password_confirmation: string
  age: number
  province: string
  commune: string
  phoneNumber?: string
}



