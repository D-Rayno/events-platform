// inertia/hooks/useValidatedForm.ts
import { useCallback, useMemo, useState } from 'react'
import { useForm as inertiaUseForm } from '@inertiajs/react'
import type { InertiaForm } from '@inertiajs/react'
import type { AnyObjectSchema, ValidationError } from 'yup'

/**
 * Merged & upgraded form hook for React + Inertia.
 * - Replaces the two Vue hooks with a single React hook that supports:
 *   - optional Yup schema validation (validate field / validate all)
 *   - client-side errors merged with server-side errors
 *   - touched tracking, blur handling
 *   - submit wrapper that validates before sending
 *
 * Usage:
 * const { form, validateField, submit, getError, shouldShowError, ... } = useValidatedForm({
 *   schema,
 *   initialData,
 *   onSuccess,
 *   onError
 * })
 */
interface UseValidatedFormConfig<T extends Record<string, any>> {
  schema?: AnyObjectSchema
  initialData: T
  onSuccess?: (response?: any) => void
  onError?: (errors?: Record<string, string>) => void
}

export function useValidatedForm<T extends Record<string, any>>(config: UseValidatedFormConfig<T>) {
  const { schema, initialData, onSuccess, onError } = config

  const form = inertiaUseForm(initialData) as InertiaForm<T>

  // client-side validation errors
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({})

  // touched fields set
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())

  const [isValidating, setIsValidating] = useState(false)

  const allErrors = useMemo(() => {
    return {
      ...clientErrors,
      ...(form.errors as Record<string, string> | undefined),
    }
  }, [clientErrors, form.errors])

  const hasErrors = useMemo(() => Object.keys(allErrors).length > 0, [allErrors])

  const validateField = useCallback(
    async (field: string): Promise<boolean> => {
      if (!schema) return true

      setIsValidating(true)
      try {
        await schema.validateAt(field, form.data())
        setClientErrors((prev) => {
          if (prev[field]) {
            const copy = { ...prev }
            delete copy[field]
            return copy
          }
          return prev
        })
        return true
      } catch (err) {
        const validationError = err as ValidationError
        const message = (validationError && validationError.message) || String(err)
        setClientErrors((prev) => ({ ...prev, [field]: message }))
        return false
      } finally {
        setIsValidating(false)
      }
    },
    [schema, form]
  )

  const validateAll = useCallback(async (): Promise<boolean> => {
    if (!schema) return true

    setIsValidating(true)
    try {
      await schema.validate(form.data(), { abortEarly: false })
      setClientErrors({})
      return true
    } catch (err) {
      const validationError = err as ValidationError
      const errors: Record<string, string> = {}

      validationError.inner?.forEach((e) => {
        const path = e.path
        if (path && !errors[path]) {
          errors[path] = e.message
        }
      })

      setClientErrors(errors)
      return false
    } finally {
      setIsValidating(false)
    }
  }, [schema, form])

  const getError = useCallback(
    (field: string): string | undefined => {
      return clientErrors[field] || (form.errors as Record<string, string> | undefined)?.[field]
    },
    [clientErrors, form.errors]
  )

  const clearError = useCallback(
    (field: string) => {
      setClientErrors((prev) => {
        if (!prev[field]) return prev
        const copy = { ...prev }
        delete copy[field]
        return copy
      })
      if ((form.errors as Record<string, string> | undefined)?.[field]) {
        // form.clearErrors accepts a field name (some versions accept string | string[])
        // use `any` to avoid TS mismatch with Inertia types
        ;(form as any).clearErrors(field)
      }
    },
    [form]
  )

  const clearAllErrors = useCallback(() => {
    setClientErrors({})
    ;(form as any).clearErrors()
  }, [form])

  const touch = useCallback((field: string) => {
    setTouchedFields((prev) => {
      const next = new Set(prev)
      next.add(field)
      return next
    })
  }, [])

  const isTouched = useCallback((field: string): boolean => {
    return touchedFields.has(field)
  }, [touchedFields])

  const shouldShowError = useCallback(
    (field: string): boolean => {
      return isTouched(field) && !!getError(field)
    },
    [isTouched, getError]
  )

  const handleBlur = useCallback(
    async (field: string) => {
      touch(field)
      await validateField(field)
    },
    [touch, validateField]
  )

  const reset = useCallback(() => {
    ;(form as any).reset()
    clearAllErrors()
    setTouchedFields(new Set())
  }, [form, clearAllErrors])

  /**
   * Submit wrapper: validates (client-side) then calls Inertia form method
   * method: 'post' | 'put' | 'patch' | 'delete'
   */
  const submit = useCallback(
    async (method: 'post' | 'put' | 'patch' | 'delete' = 'post', url: string, options: any = {}) => {
      const isValid = await validateAll()
      if (!isValid) {
        onError?.(allErrors)
        return
      }

      // call inertia method on the form (typed any to access dynamic methods)
      ;(form as any)[method](url, {
        // merge provided callbacks with our handlers
        preserveScroll: true,
        ...options,
        onSuccess: (resp: any) => {
          onSuccess?.(resp)
          options?.onSuccess?.(resp)
        },
        onError: (errors: Record<string, string>) => {
          // merge server errors into clientErrors
          setClientErrors((prev) => ({ ...prev, ...(errors || {}) }))
          onError?.(errors)
          options?.onError?.(errors)
        },
      })
    },
    [form, validateAll, onSuccess, onError, allErrors]
  )

  return {
    // inertia form
    form: form as InertiaForm<T>,

    // client state
    clientErrors,
    touchedFields,
    isValidating,

    // derived
    allErrors,
    hasErrors,

    // validation
    validateField,
    validateAll,

    // errors helpers
    getError,
    clearError,
    clearAllErrors,

    // touched helpers
    touch,
    isTouched,
    shouldShowError,
    handleBlur,

    // form management
    reset,
    submit,
  } as const
}
