import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

/**
 * Validateur pour la mise à jour d'événement
 * Tous les champs sont optionnels car c'est une mise à jour partielle
 */
export const updateEventValidator = vine.compile(
  vine.object({
    // Informations de base
    name: vine.string().trim().minLength(3).maxLength(255).optional(),
    description: vine.string().trim().minLength(10).optional(),
    location: vine.string().trim().minLength(3).maxLength(255).optional(),
    province: vine.string().trim().minLength(2).maxLength(100).optional(),
    commune: vine.string().trim().minLength(2).maxLength(100).optional(),
    
    // Dates
    startDate: vine.date({
      formats: ['YYYY-MM-DD HH:mm', 'YYYY-MM-DDTHH:mm'],
    }).optional(),
    endDate: vine.date({
      formats: ['YYYY-MM-DD HH:mm', 'YYYY-MM-DDTHH:mm'],
    }).optional(),
    registrationStartDate: vine.date().optional(),
    registrationEndDate: vine.date().optional(),
    
    // Capacité
    capacity: vine.number().min(1).max(10000).optional(),
    minAge: vine.number().min(0).optional(),
    maxAge: vine.number().optional(),
    
    // Tarification
    basePrice: vine.number().min(0).max(1000000).optional(),
    youthPrice: vine.number().min(0).optional(),
    seniorPrice: vine.number().min(0).optional(),
    
    // Catégorie
    category: vine.string().trim().minLength(2).maxLength(100).optional(),
    tags: vine.array(vine.string().trim()).optional(),
    
    // Statut
    status: vine.enum(['draft', 'published', 'ongoing', 'finished', 'cancelled']).optional(),
    isPublic: vine.boolean().optional(),
    requiresApproval: vine.boolean().optional(),
    isActive: vine.boolean().optional(),
    isFeatured: vine.boolean().optional(),
    
    // ============================================
    // GAME-SPECIFIC FIELDS
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
    
    // Image
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
      'enum': 'La valeur sélectionnée est invalide',
      'url': 'L\'URL n\'est pas valide',
      'file.size': 'La taille du fichier ne doit pas dépasser 5 Mo',
      'file.extname': 'Le format du fichier doit être jpg, jpeg, png ou webp',
    }

    const fieldMessages: Record<string, Record<string, string>> = {
      name: {
        minLength: 'Le nom doit contenir au moins 3 caractères',
      },
      description: {
        minLength: 'La description doit contenir au moins 10 caractères',
      },
      capacity: {
        min: 'La capacité doit être au moins 1',
        max: 'La capacité ne peut pas dépasser 10 000',
      },
      basePrice: {
        min: 'Le prix ne peut pas être négatif',
      },
      gameType: {
        minLength: 'Le type de jeu doit contenir au moins 2 caractères',
      },
      durationMinutes: {
        min: 'La durée doit être au moins 1 minute',
        max: 'La durée ne peut pas dépasser 24 heures',
      },
      briefingDurationMinutes: {
        max: 'La durée du briefing ne peut pas dépasser 2 heures',
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