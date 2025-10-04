import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/compiler/types'

export const createEventValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255),
    description: vine.string().trim().optional(),
    location: vine.string().trim().minLength(2).maxLength(255),
    province: vine.string().trim().minLength(2).maxLength(100),
    commune: vine.string().trim().minLength(2).maxLength(100),
    startDate: vine.date(),
    endDate: vine.date().afterField('startDate'),
    capacity: vine.number().min(1),
    minAge: vine.number().min(0).optional(),
    maxAge: vine.number().optional(),
    basePrice: vine.number().optional(),
    youthPrice: vine.number().optional(),
    seniorPrice: vine.number().optional(),
    category: vine.string().trim().minLength(2).maxLength(100),
    tags: vine.array(vine.string().trim()).optional(),
    isPublic: vine.boolean().optional(),
    requiresApproval: vine.boolean().optional(),
    registrationStartDate: vine.date().optional(),
    registrationEndDate: vine.date().optional(),
  })
)

/**
 * Messages d'erreur personnalisés en français
 */
createEventValidator.messagesProvider = new class {
  getMessage(defaultMessage: string, rule: string, field: FieldContext, args?: Record<string, any>) {
    const messages: Record<string, string> = {
      'required': 'Le champ est obligatoire',
      'string': 'Le champ doit être une chaîne de caractères',
      'minLength': `Le champ doit contenir au moins ${args?.count ?? ''} caractères`,
      'maxLength': `Le champ ne peut pas dépasser ${args?.count ?? ''} caractères`,
      'number': 'Le champ doit être un nombre',
      'min': `La valeur doit être au moins ${args?.value ?? ''}`,
      'date': 'La date n\'est pas valide',
      'afterField': 'La date de fin doit être après la date de début',
      'boolean': 'La valeur doit être un booléen',
      'array': 'Le champ doit être un tableau',
    }

    const fieldMessages: Record<string, Record<string, string>> = {
      name: {
        required: 'Le nom est obligatoire',
        minLength: 'Le nom doit contenir au moins 3 caractères',
      },
      location: {
        required: 'Le lieu est obligatoire',
      },
      startDate: {
        required: 'La date de début est obligatoire',
      },
      endDate: {
        required: 'La date de fin est obligatoire',
      },
      capacity: {
        required: 'La capacité est obligatoire',
        min: 'La capacité doit être au moins 1',
      },
      category: {
        required: 'La catégorie est obligatoire',
      },
    }

    return fieldMessages[field.name]?.[rule] || messages[rule] || defaultMessage || `Le champ ${field.name} est invalide`
  }
}()