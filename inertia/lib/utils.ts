import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date to a readable string
 */
export const formatDate = (date: Date | string, locale: string = 'fr-FR'): string => {
  try {
    const d = typeof date === 'string' ? new Date(date) : date
    
    // Check if date is valid
    if (isNaN(d.getTime())) {
      console.error('Invalid date:', date)
      return 'Date invalide'
    }
    
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(d)
  } catch (error) {
    console.error('Error formatting date:', error, date)
    return 'Date invalide'
  }
}

/**
 * Format a date and time
 */
export const formatDateTime = (date: Date | string, locale: string = 'fr-FR'): string => {
  try {
    const d = typeof date === 'string' ? new Date(date) : date
    
    // Check if date is valid
    if (isNaN(d.getTime())) {
      console.error('Invalid date:', date)
      return 'Date invalide'
    }
    
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d)
  } catch (error) {
    console.error('Error formatting datetime:', error, date)
    return 'Date invalide'
  }
}

/**
 * Format a time
 */
export const formatTime = (date: Date | string, locale: string = 'fr-FR'): string => {
  try {
    const d = typeof date === 'string' ? new Date(date) : date
    
    // Check if date is valid
    if (isNaN(d.getTime())) {
      console.error('Invalid date:', date)
      return 'Heure invalide'
    }
    
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
    }).format(d)
  } catch (error) {
    console.error('Error formatting time:', error, date)
    return 'Heure invalide'
  }
}

/**
 * Check if date is in the past
 */
export const isPast = (date: Date | string): boolean => {
  try {
    const d = typeof date === 'string' ? new Date(date) : date
    if (isNaN(d.getTime())) return false
    return d < new Date()
  } catch {
    return false
  }
}

/**
 * Check if date is today
 */
export const isToday = (date: Date | string): boolean => {
  try {
    const d = typeof date === 'string' ? new Date(date) : date
    if (isNaN(d.getTime())) return false
    
    const today = new Date()
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    )
  } catch {
    return false
  }
}

/**
 * Get relative time string (e.g., "2 days ago")
 */
export const getRelativeTime = (date: Date | string, locale: string = 'fr-FR'): string => {
  try {
    const d = typeof date === 'string' ? new Date(date) : date
    if (isNaN(d.getTime())) return 'Date invalide'
    
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

    const now = new Date()
    const seconds = Math.floor((now.getTime() - d.getTime()) / 1000)

    if (seconds < 60) return rtf.format(-Math.floor(seconds), 'second')
    if (seconds < 3600) return rtf.format(-Math.floor(seconds / 60), 'minute')
    if (seconds < 86400) return rtf.format(-Math.floor(seconds / 3600), 'hour')
    if (seconds < 604800) return rtf.format(-Math.floor(seconds / 86400), 'day')

    return formatDate(d, locale)
  } catch (error) {
    console.error('Error getting relative time:', error, date)
    return 'Date invalide'
  }
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
export const deepClone = <T,>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
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