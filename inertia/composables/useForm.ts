import { ref, computed, reactive } from 'vue'
import { useForm as inertiaUseForm } from '@inertiajs/vue3'
import type { AnyObjectSchema, ValidationError } from 'yup'

interface FormConfig<T extends Record<string, any>> {
  schema?: AnyObjectSchema
  initialData: T
  onSuccess?: (data?: any) => void
  onError?: (errors?: Record<string, string>) => void
}

export function useForm<T extends Record<string, any>>(config: FormConfig<T>) {
  const { schema, initialData, onSuccess, onError } = config

  const form = inertiaUseForm(initialData)
  const clientErrors = reactive<Partial<Record<keyof T, string>>>({})
  const touchedFields = ref<Set<keyof T>>(new Set())
  const isValidating = ref(false)

  const allErrors = computed(() => ({
    ...clientErrors,
    ...form.errors,
  }))

  const hasErrors = computed(() => Object.keys(allErrors.value).length > 0)

  const validateField = async (field: keyof T): Promise<boolean> => {
    if (!schema) return true

    isValidating.value = true
    try {
      await schema.validateAt(field as string, form.data())
      delete clientErrors[field]
      return true
    } catch (error) {
      if (error instanceof Error && 'message' in error) {
        clientErrors[field] = error.message
      }
      return false
    } finally {
      isValidating.value = false
    }
  }

  const validateAll = async (): Promise<boolean> => {
    if (!schema) return true

    isValidating.value = true
    try {
      await schema.validate(form.data(), { abortEarly: false })
      Object.keys(clientErrors).forEach((key) => {
        delete clientErrors[key as keyof T]
      })
      return true
    } catch (error) {
      const validationError = error as ValidationError
      Object.keys(clientErrors).forEach((key) => {
        delete clientErrors[key as keyof T]
      })

      validationError.inner?.forEach((err) => {
        const field = err.path as keyof T
        if (field && !clientErrors[field]) {
          clientErrors[field] = err.message
        }
      })

      return false
    } finally {
      isValidating.value = false
    }
  }

  const getError = (field: keyof T): string | undefined => {
    return clientErrors[field] || form.errors[field as string]
  }

  const clearError = (field: keyof T) => {
    delete clientErrors[field]
    if (form.errors[field as string]) {
      form.clearErrors(field as string)
    }
  }

  const clearAllErrors = () => {
    Object.keys(clientErrors).forEach((key) => {
      delete clientErrors[key as keyof T]
    })
    form.clearErrors()
  }

  const touch = (field: keyof T) => {
    touchedFields.value.add(field)
  }

  const isTouched = (field: keyof T): boolean => {
    return touchedFields.value.has(field)
  }

  const shouldShowError = (field: keyof T): boolean => {
    return isTouched(field) && !!getError(field)
  }

  const handleBlur = async (field: keyof T) => {
    touch(field)
    await validateField(field)
  }

  const reset = () => {
    form.reset()
    clearAllErrors()
    touchedFields.value.clear()
  }

  const submit = async (method: 'post' | 'put' | 'patch' | 'delete' = 'post', url: string) => {
    const isValid = await validateAll()
    if (!isValid) {
      onError?.(allErrors.value as Record<string, string>)
      return
    }

    form[method](url, {
      onSuccess: (response) => {
        onSuccess?.(response)
      },
      onError: (errors) => {
        Object.assign(clientErrors, errors)
        onError?.(errors as Record<string, string>)
      },
    })
  }

  return {
    form,
    clientErrors,
    touchedFields,
    isValidating,
    allErrors,
    hasErrors,
    validateField,
    validateAll,
    getError,
    clearError,
    clearAllErrors,
    touch,
    isTouched,
    shouldShowError,
    handleBlur,
    reset,
    submit,
  }
}
