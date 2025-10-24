import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

/**
 * Validateur pour la réinitialisation du mot de passe
 */
export const resetPasswordValidator = vine.compile(
  vine.object({
    token: vine.string().trim().minLength(1),

    password: vine.string().minLength(8).maxLength(100).confirmed(),
  })
)

/**
 * Messages d'erreur en français
 */
resetPasswordValidator.messagesProvider = new (class {
  getMessage(defaultMessage: string, rule: string, field: FieldContext) {
    const fieldMessages: Record<string, Record<string, string>> = {
      token: {
        required: 'Le token est obligatoire',
      },
      password: {
        required: 'Le mot de passe est obligatoire',
        minLength: 'Le mot de passe doit contenir au moins 8 caractères',
        confirmed: 'Les mots de passe ne correspondent pas',
      },
    }

    return (
      fieldMessages[field.name]?.[rule] || defaultMessage || `Le champ ${field.name} est invalide`
    )
  }
})()
