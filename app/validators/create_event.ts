import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/compiler/types'

export const createEventValidator = vine.compile(
  vine.object({
<<<<<<< HEAD
    // Informations de base
=======
>>>>>>> 47214e9 (feat: admin api's & user profile management, events and registration for both web and api)
    name: vine.string().trim().minLength(3).maxLength(255),
    description: vine.string().trim().optional(),
    location: vine.string().trim().minLength(2).maxLength(255),
    province: vine.string().trim().minLength(2).maxLength(100),
    commune: vine.string().trim().minLength(2).maxLength(100),
<<<<<<< HEAD

    // Dates
    startDate: vine.date(),
    endDate: vine.date().afterField('startDate'),
    registrationStartDate: vine.date().optional(),
    registrationEndDate: vine.date().optional(),

    // Capacité et restrictions
    capacity: vine.number().min(1),
    minAge: vine.number().min(0).optional(),
    maxAge: vine.number().optional(),

    // Tarification
    basePrice: vine.number().optional(),
    youthPrice: vine.number().optional(),
    seniorPrice: vine.number().optional(),

    // Catégorie et tags
    category: vine.string().trim().minLength(2).maxLength(100),
    tags: vine.array(vine.string().trim()).optional(),

    // Paramètres
    isPublic: vine.boolean().optional(),
    requiresApproval: vine.boolean().optional(),

    // ============================================
    // GAME-SPECIFIC FIELDS (all optional)
    // ============================================

    eventType: vine.enum(['normal', 'game']).optional(),
    gameType: vine.string().trim().minLength(2).maxLength(100).optional(),
    difficulty: vine.enum(['easy', 'medium', 'hard', 'extreme']).optional(),
    durationMinutes: vine.number().min(1).max(1440).optional(),
    physicalIntensity: vine.enum(['low', 'medium', 'high']).optional(),

    // Configuration des équipes
    allowsTeams: vine.boolean().optional(),
    teamRegistration: vine.enum(['individual', 'team', 'both']).optional(),
    minTeamSize: vine.number().min(1).optional(),
    maxTeamSize: vine.number().min(1).optional(),
    maxTeams: vine.number().min(1).optional(),
    autoTeamFormation: vine.boolean().optional(),

    // Exigences
    requiredItems: vine.array(vine.string().trim()).optional(),
    prohibitedItems: vine.array(vine.string().trim()).optional(),
    safetyRequirements: vine.array(vine.string().trim()).optional(),
    waiverRequired: vine.boolean().optional(),
    rulesDocumentUrl: vine.string().trim().url().optional(),

    // Timeline
    checkInTime: vine.date().optional(),
    briefingDurationMinutes: vine.number().min(0).max(120).optional(),

    // Récompenses
    prizeInformation: vine.string().trim().optional(),
    prizePool: vine.number().min(0).optional(),
    winnerAnnouncement: vine.date().optional(),

    // Paramètres additionnels
    photographyAllowed: vine.boolean().optional(),
    liveStreaming: vine.boolean().optional(),
    specialInstructions: vine.string().trim().optional(),
=======
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
>>>>>>> 47214e9 (feat: admin api's & user profile management, events and registration for both web and api)
  })
)

/**
 * Messages d'erreur personnalisés en français
 */
<<<<<<< HEAD
createEventValidator.messagesProvider = new (class {
  getMessage(
    defaultMessage: string,
    rule: string,
    field: FieldContext,
    args?: Record<string, any>
  ) {
    const messages: Record<string, string> = {
      required: 'Le champ est obligatoire',
      string: 'Le champ doit être une chaîne de caractères',
      minLength: `Le champ doit contenir au moins ${args?.minLength ?? ''} caractères`,
      maxLength: `Le champ ne peut pas dépasser ${args?.maxLength ?? ''} caractères`,
      number: 'Le champ doit être un nombre',
      min: `La valeur doit être au moins ${args?.min ?? ''}`,
      max: `La valeur ne peut pas dépasser ${args?.max ?? ''}`,
      date: "La date n'est pas valide",
      afterField: 'La date de fin doit être après la date de début',
      boolean: 'La valeur doit être un booléen',
      array: 'Le champ doit être un tableau',
      enum: 'La valeur sélectionnée est invalide',
      url: "L'URL n'est pas valide",
=======
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
>>>>>>> 47214e9 (feat: admin api's & user profile management, events and registration for both web and api)
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
<<<<<<< HEAD
        afterField: 'La date de fin doit être après la date de début',
=======
>>>>>>> 47214e9 (feat: admin api's & user profile management, events and registration for both web and api)
      },
      capacity: {
        required: 'La capacité est obligatoire',
        min: 'La capacité doit être au moins 1',
      },
      category: {
        required: 'La catégorie est obligatoire',
      },
<<<<<<< HEAD
      gameType: {
        required: 'Le type de jeu est obligatoire pour un événement de jeu',
      },
      durationMinutes: {
        min: 'La durée doit être au moins 1 minute',
        max: 'La durée ne peut pas dépasser 24 heures (1440 minutes)',
      },
      briefingDurationMinutes: {
        min: 'La durée du briefing ne peut pas être négative',
        max: 'La durée du briefing ne peut pas dépasser 2 heures',
      },
      minTeamSize: {
        min: "La taille minimale d'équipe doit être au moins 1",
      },
      maxTeamSize: {
        min: "La taille maximale d'équipe doit être au moins 1",
      },
      prizePool: {
        min: 'Le montant des récompenses ne peut pas être négatif',
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
=======
    }

    return fieldMessages[field.name]?.[rule] || messages[rule] || defaultMessage || `Le champ ${field.name} est invalide`
  }
}()
>>>>>>> 47214e9 (feat: admin api's & user profile management, events and registration for both web and api)
