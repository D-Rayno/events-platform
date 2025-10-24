// inertia/hooks/useToast.ts
import { useCallback, useEffect, useRef, useState } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number // ms, 0 means sticky
}

/**
 * React hook replacement for the Vue `useToast` composable.
 * - Manages toasts list
 * - Auto-removes toasts after duration
 * - Cleans up timers on unmount
 *
 * Usage:
 * const { toasts, success, error, removeToast, clearAll } = useToast()
 */
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timersRef = useRef<Record<string, number | ReturnType<typeof setTimeout>>>({})
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      // clear all timers on unmount
      Object.values(timersRef.current).forEach((t) => {
        if (t) clearTimeout(t as any)
      })
      timersRef.current = {}
    }
  }, [])

  const genId = useCallback(() => `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, [])

  const removeToast = useCallback((id: string) => {
    // clear timer if present
    const t = timersRef.current[id]
    if (t) {
      clearTimeout(t as any)
      delete timersRef.current[id]
    }
    // remove toast from state
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (type: ToastType, message: string, duration = 3000) => {
      const id = genId()
      const toast: Toast = { id, type, message, duration }
      setToasts((prev) => [...prev, toast])

      if (duration > 0) {
        const timer = setTimeout(() => {
          // avoid state updates if unmounted
          if (!mountedRef.current) return
          setToasts((prev) => prev.filter((t) => t.id !== id))
          delete timersRef.current[id]
        }, duration)
        timersRef.current[id] = timer
      }

      return id
    },
    [genId]
  )

  const success = useCallback((message: string, duration?: number) => showToast('success', message, duration ?? 3000), [showToast])
  const error = useCallback((message: string, duration?: number) => showToast('error', message, duration ?? 3000), [showToast])
  const warning = useCallback((message: string, duration?: number) => showToast('warning', message, duration ?? 3000), [showToast])
  const info = useCallback((message: string, duration?: number) => showToast('info', message, duration ?? 3000), [showToast])

  const clearAll = useCallback(() => {
    // clear timers
    Object.values(timersRef.current).forEach((t) => {
      if (t) clearTimeout(t as any)
    })
    timersRef.current = {}
    setToasts([])
  }, [])

  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info,
    clearAll,
  } as const
}
