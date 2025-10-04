import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/compiler/types'

/**
 * Validateur pour l'inscription d'un utilisateur
 */
export const registerValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(2).maxLength(100),

    lastName: vine.string().trim().minLength(2).maxLength(100),

    email: vine
      .string()
      .trim()
      .email()
      .normalizeEmail()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),

    password: vine.string().minLength(8).maxLength(100).confirmed(),

    age: vine.number().min(13).max(120),

    province: vine.string().trim().minLength(2).maxLength(100),

    commune: vine.string().trim().minLength(2).maxLength(100),

    phoneNumber: vine.string().trim().mobile().optional(),
  })
)

/**
 * Messages d'erreur personnalisés en français
 */
registerValidator.messagesProvider = new (class {
  getMessage(
    defaultMessage: string,
    rule: string,
    field: FieldContext,
    args?: Record<string, any>
  ) {
    const messages: Record<string, string> = {
      'required': 'Le champ est obligatoire',
      'string': 'Le champ doit être une chaîne de caractères',
      'email': "L'adresse email n'est pas valide",
      'email.unique': 'Cette adresse email est déjà utilisée',
      'minLength': `Le champ doit contenir au moins ${args?.count ?? rule} caractères`,
      'maxLength': `Le champ ne peut pas dépasser ${args?.count ?? rule} caractères`,
      'confirmed': 'Les mots de passe ne correspondent pas',
      'number': 'Le champ doit être un nombre',
      'min': `La valeur doit être au moins ${args?.value ?? rule}`,
      'max': `La valeur ne peut pas dépasser ${args?.value ?? rule}`,
      'mobile': "Le numéro de téléphone n'est pas valide",
    }

    const fieldMessages: Record<string, Record<string, string>> = {
      firstName: {
        required: 'Le prénom est obligatoire',
        minLength: 'Le prénom doit contenir au moins 2 caractères',
      },
      lastName: {
        required: 'Le nom est obligatoire',
        minLength: 'Le nom doit contenir au moins 2 caractères',
      },
      email: {
        required: "L'adresse email est obligatoire",
        email: "L'adresse email n'est pas valide",
        unique: 'Cette adresse email est déjà utilisée',
      },
      password: {
        required: 'Le mot de passe est obligatoire',
        minLength: 'Le mot de passe doit contenir au moins 8 caractères',
        confirmed: 'Les mots de passe ne correspondent pas',
      },
      age: {
        required: "L'âge est obligatoire",
        min: 'Vous devez avoir au moins 13 ans pour vous inscrire',
      },
      province: {
        required: 'La province est obligatoire',
      },
      commune: {
        required: 'La commune est obligatoire',
      },
      phoneNumber: {
        mobile: "Le numéro de téléphone n'est pas valide",
      },
    }

    return (
      fieldMessages[field.name]?.[rule] ||
      messages[rule] ||
      defaultMessage ||
      `Le champ ${field.name} est invalide`
    )
  }
})()
