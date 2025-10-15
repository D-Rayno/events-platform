// inertia/types/common.ts
import type { User } from "./user"
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

export interface SharedProps {
  auth?: {
    user?: User
  }
  flash?: FlashMessages
}
