// inertia/types/index.ts - Centralized type exports

export * from './auth'
export * from './user'
export * from './event'
export * from './registration'
export * from './common'

// Additional shared types
export interface Option {
  value: string | number
  label: string
  disabled?: boolean
  icon?: any
}

export type AlertType = 'success' | 'error' | 'warning' | 'info'
export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'neutral'
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface FormErrors {
  [key: string]: string
}

export interface ValidationResult {
  valid: boolean
  error?: string
}

// Inertia shared props extension
declare module '@inertiajs/core' {
  interface PageProps {
    auth?: {
      user?: import('./user').User
    }
    flash?: import('./common').FlashMessages
    errors?: FormErrors
  }
}
