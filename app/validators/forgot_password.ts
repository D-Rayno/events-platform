import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

/**
 * Validateur pour le mot de passe oublié
 */
export const forgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().normalizeEmail(),
  })
)

/**
 * Messages d'erreur en français
 */
forgotPasswordValidator.messagesProvider = new (class {
  getMessage(defaultMessage: string, rule: string, field: FieldContext) {
    const fieldMessages: Record<string, Record<string, string>> = {
      email: {
        required: "L'adresse email est obligatoire",
        email: "L'adresse email n'est pas valide",
      },
    }

    return (
      fieldMessages[field.name]?.[rule] || defaultMessage || `Le champ ${field.name} est invalide`
    )
  }
})()
