// inertia/types/auth.ts
export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  password_confirmation: string
  age: number | string
  province: string
  commune: string
  phoneNumber?: string
}

// Convert RegisterData to FormData compatible format
export type RegisterFormData = Record<string, string | number | File>

// Helper to convert RegisterData to FormData compatible
export function toFormData(data: RegisterData): RegisterFormData {
  return {
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
}
