// inertia/types/common.ts
import type { User } from './user'
import type { PageProps as InertiaPageProps } from '@inertiajs/core'

export interface PaginationMeta {
  total: number
  per_page: number
  current_page: number
  last_page: number
  from: number
  to: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface FlashMessages {
  success?: string
  error?: string
  warning?: string
  info?: string
}

// Extend Inertia PageProps to include our shared props
export interface SharedProps extends InertiaPageProps {
  auth?: {
    user?: User
  }
  flash?: FlashMessages
}
