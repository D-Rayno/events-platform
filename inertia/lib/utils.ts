/**
 * Format a date to a readable string
 */
export const formatDate = (date: Date | string, locale: string = 'fr-FR'): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

/**
 * Format a date and time
 */
export const formatDateTime = (date: Date | string, locale: string = 'fr-FR'): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

/**
 * Format a time
 */
export const formatTime = (date: Date | string, locale: string = 'fr-FR'): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

/**
 * Check if date is in the past
 */
export const isPast = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d < new Date()
}

/**
 * Check if date is today
 */
export const isToday = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  )
}

/**
 * Get relative time string (e.g., "2 days ago")
 */
export const getRelativeTime = (date: Date | string, locale: string = 'fr-FR'): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  const now = new Date()
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (seconds < 60) return rtf.format(-Math.floor(seconds), 'second')
  if (seconds < 3600) return rtf.format(-Math.floor(seconds / 60), 'minute')
  if (seconds < 86400) return rtf.format(-Math.floor(seconds / 3600), 'hour')
  if (seconds < 604800) return rtf.format(-Math.floor(seconds / 86400), 'day')

  return formatDate(d, locale)
}

/**
 * Truncate text with ellipsis
 */
export const truncate = (text: string, length: number, ellipsis: string = '...'): string => {
  return text.length > length ? text.substring(0, length) + ellipsis : text
}

/**
 * Capitalize first letter of string
 */
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Format file size to readable format
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * Math.pow(10, dm)) / Math.pow(10, dm) + ' ' + sizes[i]
}

/**
 * Format currency
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'DZD',
  locale: string = 'fr-FR'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Generate unique ID
 */
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Clone deep object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Merge objects
 */
export const merge = <T extends Record<string, any>>(target: T, ...sources: T[]): T => {
  if (!sources.length) return target
  const source = sources.shift()

  if (typeof target === 'object' && typeof source === 'object') {
    for (const key in source) {
      if (typeof source[key] === 'object') {
        if (!target[key]) Object.assign(target, { [key]: {} })
        merge(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return merge(target, ...sources)
}

/**
 * Check if value is empty
 */
export const isEmpty = (value: any): boolean => {
  return (
    value === null ||
    value === undefined ||
    value === '' ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0)
  )
}

/**
 * Extract initials from name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Parse query string to object
 */
export const parseQuery = (query: string): Record<string, string> => {
  const params = new URLSearchParams(query)
  const obj: Record<string, string> = {}

  params.forEach((value, key) => {
    obj[key] = value
  })

  return obj
}

/**
 * Build query string from object
 */
export const buildQuery = (obj: Record<string, any>): string => {
  const params = new URLSearchParams()

  Object.entries(obj).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      params.append(key, String(value))
    }
  })

  return params.toString()
}
