import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

/**
 * Validateur pour la mise à jour d'événement
 */
export const updateEventValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255),

    description: vine.string().trim().minLength(10),

    location: vine.string().trim().minLength(3).maxLength(255),

    startDate: vine.date({
      formats: ['YYYY-MM-DD HH:mm', 'YYYY-MM-DDTHH:mm'],
    }),

    endDate: vine.date({
      formats: ['YYYY-MM-DD HH:mm', 'YYYY-MM-DDTHH:mm'],
    }),

    maxCapacity: vine.number().min(1).max(10000),

    category: vine.enum([
      'conference',
      'workshop',
      'seminar',
      'concert',
      'sport',
      'exhibition',
      'networking',
      'other',
    ]),

    status: vine.enum(['draft', 'published', 'cancelled', 'completed']),

    price: vine.number().min(0).max(1000000),

    organizerName: vine.string().trim().minLength(2).maxLength(255),

    organizerEmail: vine.string().trim().email().normalizeEmail(),

    organizerPhone: vine.string().trim().mobile().optional(),

    isFeatured: vine.boolean().optional(),

    requiresApproval: vine.boolean().optional(),

    image: vine
      .file({
        size: '5mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      })
      .optional(),
  })
)

/**
 * Messages d'erreur en français
 */
updateEventValidator.messagesProvider = new (class {
  getMessage(
    defaultMessage: string,
    rule: string,
    field: FieldContext,
    args?: Record<string, any>
  ) {
    const messages: Record<string, string> = {
      'required': 'Le champ est obligatoire',
      'string': 'Le champ doit être une chaîne de caractères',
      'minLength': `Le champ doit contenir au moins ${args?.minLength ?? 3} caractères`,
      'maxLength': `Le champ ne peut pas dépasser ${args?.maxLength ?? 255} caractères`,
      'number': 'Le champ doit être un nombre',
      'min': `La valeur doit être au moins ${args?.min ?? 1}`,
      'max': `La valeur ne peut pas dépasser ${args?.max ?? 10000}`,
      'date': 'Le format de la date est invalide',
      'email': "L'adresse email n'est pas valide",
      'mobile': "Le numéro de téléphone n'est pas valide",
      'enum': 'La valeur sélectionnée est invalide',
      'file.size': 'La taille du fichier ne doit pas dépasser 5 Mo',
      'file.extname': 'Le format du fichier doit être jpg, jpeg, png ou webp',
    }

    const fieldMessages: Record<string, Record<string, string>> = {
      name: {
        required: "Le nom de l'événement est obligatoire",
        minLength: 'Le nom doit contenir au moins 3 caractères',
      },
      description: {
        required: 'La description est obligatoire',
        minLength: 'La description doit contenir au moins 10 caractères',
      },
      location: {
        required: "Le lieu de l'événement est obligatoire",
      },
      startDate: {
        required: 'La date de début est obligatoire',
        date: 'Le format de la date de début est invalide',
      },
      endDate: {
        required: 'La date de fin est obligatoire',
        date: 'Le format de la date de fin est invalide',
      },
      maxCapacity: {
        required: 'La capacité maximale est obligatoire',
        min: 'La capacité doit être au moins 1',
      },
      category: {
        required: 'La catégorie est obligatoire',
        enum: 'La catégorie sélectionnée est invalide',
      },
      status: {
        required: 'Le statut est obligatoire',
        enum: 'Le statut sélectionné est invalide',
      },
      price: {
        required: 'Le prix est obligatoire',
        min: 'Le prix ne peut pas être négatif',
      },
      organizerName: {
        required: "Le nom de l'organisateur est obligatoire",
      },
      organizerEmail: {
        required: "L'email de l'organisateur est obligatoire",
        email: "L'email de l'organisateur n'est pas valide",
      },
      organizerPhone: {
        mobile: "Le numéro de téléphone n'est pas valide",
      },
      image: {
        'file.size': "L'image ne doit pas dépasser 5 Mo",
        'file.extname': "L'image doit être au format jpg, jpeg, png ou webp",
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
