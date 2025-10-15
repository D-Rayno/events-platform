import { ref, computed, reactive } from 'vue'
import { useForm as inertiaUseForm } from '@inertiajs/vue3'
import type { InertiaForm } from '@inertiajs/vue3'
import type { AnyObjectSchema, ValidationError } from 'yup'

interface FormConfig<T extends Record<string, any>> {
  schema?: AnyObjectSchema
  initialData: T
  onSuccess?: (data?: any) => void
  onError?: (errors?: Record<string, string>) => void
}

export function useForm<T extends Record<string, any>>(config: FormConfig<T>) {
  const { schema, initialData, onSuccess, onError } = config

  const form = inertiaUseForm(initialData) as InertiaForm<T>
  const clientErrors = reactive<Record<string, string>>({})
  const touchedFields = ref<Set<string>>(new Set())
  const isValidating = ref(false)

  const allErrors = computed(() => ({
    ...clientErrors,
    ...(form.errors),
  }))

  const hasErrors = computed(() => Object.keys(allErrors.value).length > 0)

  const validateField = async (field: string): Promise<boolean> => {
    if (!schema) return true

    isValidating.value = true
    try {
      await schema.validateAt(field, form.data())
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
        delete clientErrors[key]
      })
      return true
    } catch (error) {
      const validationError = error as ValidationError
      Object.keys(clientErrors).forEach((key) => {
        delete clientErrors[key]
      })

      validationError.inner?.forEach((err) => {
        const field = err.path
        if (field && !clientErrors[field]) {
          clientErrors[field] = err.message
        }
      })

      return false
    } finally {
      isValidating.value = false
    }
  }

  const getError = (field: string): string | undefined => {
    return clientErrors[field] || (form.errors as any)[field]
  }

  const clearError = (field: string) => {
    delete clientErrors[field]
    if ((form.errors as any)[field]) {
      form.clearErrors(field as any)
    }
  }

  const clearAllErrors = () => {
    Object.keys(clientErrors).forEach((key) => {
      delete clientErrors[key]
    })
    form.clearErrors()
  }

  const touch = (field: string) => {
    touchedFields.value.add(field)
  }

  const isTouched = (field: string): boolean => {
    return touchedFields.value.has(field)
  }

  const shouldShowError = (field: string): boolean => {
    return isTouched(field) && !!getError(field)
  }

  const handleBlur = async (field: string) => {
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
      onError?.(allErrors.value)
      return
    }

    form[method](url, {
      onSuccess: (response) => {
        onSuccess?.(response)
      },
      onError: (errors) => {
        Object.assign(clientErrors, errors as Record<string, string>)
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