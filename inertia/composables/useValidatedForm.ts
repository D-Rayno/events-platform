import { useForm } from '@inertiajs/vue3'
import { ref } from 'vue'
import { z } from 'zod'

export function useValidatedForm<T extends Record<string, any>>(
  schema: z.ZodSchema<T>,
  initialData: T
) {
  const form = useForm(initialData)
  const clientErrors = ref<Partial<Record<keyof T, string>>>({})

  // Validation côté client
  const validateField = (field: keyof T) => {
    try {
      const fieldSchema = schema.shape[field as string]
      if (fieldSchema) {
        fieldSchema.parse(form[field])
        delete clientErrors.value[field]
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        clientErrors.value[field] = error.errors[0]?.message || 'Erreur de validation'
      }
    }
  }

  const validateAll = (): boolean => {
    try {
      schema.parse(form.data())
      clientErrors.value = {}
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof T, string>> = {}
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof T
          if (field && !errors[field]) {
            errors[field] = err.message
          }
        })
        clientErrors.value = errors
      }
      return false
    }
  }

  // Fusionner les erreurs client et serveur
  const getErrors = () => {
    return {
      ...clientErrors.value,
      ...form.errors
    }
  }

  const getError = (field: keyof T): string | undefined => {
    return clientErrors.value[field] || form.errors[field as string]
  }

  // Nettoyer l'erreur quand l'utilisateur commence à taper
  const clearError = (field: keyof T) => {
    delete clientErrors.value[field]
    if (form.errors[field as string]) {
      form.clearErrors(field as string)
    }
  }

  return {
    form,
    clientErrors,
    validateField,
    validateAll,
    getErrors,
    getError,
    clearError
  }
}