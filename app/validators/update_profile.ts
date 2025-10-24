import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

/**
 * Validateur pour la mise à jour du profil
 */
export const updateProfileValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(2).maxLength(100),

    lastName: vine.string().trim().minLength(2).maxLength(100),

    age: vine.number().min(13).max(120),

    province: vine.string().trim().minLength(2).maxLength(100),

    commune: vine.string().trim().minLength(2).maxLength(100),

    phoneNumber: vine.string().trim().mobile().optional(),

    avatar: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      })
      .optional(),
  })
)

/**
 * Messages d'erreur en français
 */
updateProfileValidator.messagesProvider = new (class {
  getMessage(
    defaultMessage: string,
    rule: string,
    field: FieldContext,
    args?: Record<string, any>
  ) {
    const messages: Record<string, string> = {
      'required': 'Le champ est obligatoire',
      'string': 'Le champ doit être une chaîne de caractères',
      'minLength': `Le champ doit contenir au moins ${args?.minLength ?? 2} caractères`,
      'maxLength': `Le champ ne peut pas dépasser ${args?.maxLength ?? 100} caractères`,
      'number': 'Le champ doit être un nombre',
      'min': `La valeur doit être au moins ${args?.min ?? 13}`,
      'max': `La valeur ne peut pas dépasser ${args?.max ?? 120}`,
      'mobile': "Le numéro de téléphone n'est pas valide",
      'file.size': 'La taille du fichier ne doit pas dépasser 2 Mo',
      'file.extname': 'Le format du fichier doit être jpg, jpeg, png ou webp',
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
      age: {
        required: "L'âge est obligatoire",
        min: 'Vous devez avoir au moins 13 ans',
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
      avatar: {
        'file.size': 'La photo ne doit pas dépasser 2 Mo',
        'file.extname': 'La photo doit être au format jpg, jpeg, png ou webp',
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
