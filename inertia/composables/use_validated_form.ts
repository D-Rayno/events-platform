import { useForm } from '@inertiajs/vue3'
import { ref } from 'vue'
import type { InertiaForm } from '@inertiajs/vue3'
import type { AnyObjectSchema, ValidationError } from 'yup'

export function use_vlidated_form<T extends Record<string, any>>(
  schema: AnyObjectSchema,
  initialData: T
) {
  const form = useForm(initialData) as InertiaForm<T>
  const clientErrors = ref<Record<string, string>>({})

  const validateField = async (field: string): Promise<boolean> => {
    try {
      await schema.validateAt(field, form.data())
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
      const errors: Record<string, string> = {}

      validationError.inner?.forEach((err) => {
        const field = err.path
        if (field && !errors[field]) {
          errors[field] = err.message
        }
      })

      clientErrors.value = errors
      return false
    }
  }

  const getErrors = (): Record<string, string> => ({
    ...clientErrors.value,
    ...(form.errors),
  })

  const getError = (field: string): string | undefined => {
    return clientErrors.value[field] || (form.errors as unknown as Record<string, string>)[field]
  }

  const clearError = (field: string) => {
    delete clientErrors.value[field]
    if ((form.errors as unknown as Record<string, string>)[field]) {
      form.clearErrors(field as any)
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