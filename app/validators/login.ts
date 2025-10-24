import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

/**
 * Validateur pour la connexion
 */
export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().normalizeEmail(),

    password: vine.string().minLength(1),
  })
)

/**
 * Messages d'erreur en français
 */
loginValidator.messagesProvider = new (class {
  getMessage(defaultMessage: string, rule: string, field: FieldContext) {
    const fieldMessages: Record<string, Record<string, string>> = {
      email: {
        required: "L'adresse email est obligatoire",
        email: "L'adresse email n'est pas valide",
      },
      password: {
        required: 'Le mot de passe est obligatoire',
      },
    }

    return (
      fieldMessages[field.name]?.[rule] || defaultMessage || `Le champ ${field.name} est invalide`
    )
  }
})()
