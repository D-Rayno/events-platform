import { useForm } from '@inertiajs/vue3'
import { ref } from 'vue'
import type { AnyObjectSchema, ValidationError } from 'yup'

export function use_vlidated_form<T extends Record<string, any>>(
  schema: AnyObjectSchema,
  initialData: T
) {
  const form = useForm(initialData)
  const clientErrors = ref<Partial<Record<keyof T, string>>>({})

  const validateField = async (field: keyof T): Promise<boolean> => {
    try {
      await schema.validateAt(field as string, form.data())
      delete clientErrors.value[field]
      return true
    } catch (error) {
      if (error instanceof Error && 'message' in error) {
        clientErrors.value[field] = error.message
      }
      return false
    }
  }

  const validateAll = async (): Promise<boolean> => {
    try {
      await schema.validate(form.data(), { abortEarly: false })
      clientErrors.value = {}
      return true
    } catch (error) {
      const validationError = error as ValidationError
      const errors: Partial<Record<keyof T, string>> = {}

      validationError.inner?.forEach((err) => {
        const field = err.path as keyof T
        if (field && !errors[field]) {
          errors[field] = err.message
        }
      })

      clientErrors.value = errors
      return false
    }
  }

  const getErrors = () => ({
    ...clientErrors.value,
    ...form.errors,
  })

  const getError = (field: keyof T): string | undefined => {
    return clientErrors.value[field] || form.errors[field as string]
  }

  const clearError = (field: keyof T) => {
    delete clientErrors.value[field]
    if (form.errors[field as string]) {
      form.clearErrors(field as string)
    }
  }

  const clearAllErrors = () => {
    clientErrors.value = {}
    form.clearErrors()
  }

  return {
    form,
    clientErrors,
    validateField,
    validateAll,
    getErrors,
    getError,
    clearError,
    clearAllErrors,
  }
}
