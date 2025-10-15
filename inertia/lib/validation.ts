import * as yup from 'yup'

// Configuration des messages en français
yup.setLocale({
  mixed: {
    default: 'Ce champ est invalide',
    required: 'Ce champ est requis',
    notType: 'Format invalide',
  },
  string: {
    min: ({ min }) => `Ce champ doit contenir au moins ${min} caractères`,
    max: ({ max }) => `Ce champ ne doit pas dépasser ${max} caractères`,
    email: 'Adresse email invalide',
    url: 'URL invalide',
  },
  number: {
    min: ({ min }) => `La valeur doit être supérieure ou égale à ${min}`,
    max: ({ max }) => `La valeur doit être inférieure ou égale à ${max}`,
    integer: 'La valeur doit être un nombre entier',
  },
})

// Schémas de validation
export const registerSchema = yup.object({
  firstName: yup
    .string()
    .required('Le prénom est requis')
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(100, 'Le prénom ne doit pas dépasser 100 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s-]+$/, 'Le prénom ne doit contenir que des lettres'),

  lastName: yup
    .string()
    .required('Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne doit pas dépasser 100 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s-]+$/, 'Le nom ne doit contenir que des lettres'),

  email: yup
    .string()
    .required("L'email est requis")
    .email('Adresse email invalide')
    .max(254, "L'email ne doit pas dépasser 254 caractères"),

  password: yup
    .string()
    .required('Le mot de passe est requis')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .max(100, 'Le mot de passe ne doit pas dépasser 100 caractères')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
    ),

  password_confirmation: yup
    .string()
    .required('La confirmation est requise')
    .oneOf([yup.ref('password')], 'Les mots de passe ne correspondent pas'),

  age: yup
    .number()
    .required("L'âge est requis")
    .integer("L'âge doit être un nombre entier")
    .min(13, 'Vous devez avoir au moins 13 ans')
    .max(120, 'Âge invalide'),

  province: yup.string().required('La province est requise'),

  commune: yup
    .string()
    .required('La commune est requise')
    .min(2, 'La commune doit contenir au moins 2 caractères')
    .max(100, 'La commune ne doit pas dépasser 100 caractères'),

  phoneNumber: yup
    .string()
    .matches(/^(\+213|0)[567]\d{8}$/, 'Numéro de téléphone algérien invalide')
    .optional(),
})

export const loginSchema = yup.object({
  email: yup.string().required("L'email est requis").email('Adresse email invalide'),
  password: yup.string().required('Le mot de passe est requis'),
})

export const forgotPasswordSchema = yup.object({
  email: yup.string().required("L'email est requis").email('Adresse email invalide'),
})

export const resetPasswordSchema = yup.object({
  token: yup.string().required('Token invalide'),
  password: yup
    .string()
    .required('Le mot de passe est requis')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .max(100, 'Le mot de passe ne doit pas dépasser 100 caractères')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
    ),
  password_confirmation: yup
    .string()
    .required('La confirmation est requise')
    .oneOf([yup.ref('password')], 'Les mots de passe ne correspondent pas'),
})

export const updateProfileSchema = yup.object({
  firstName: yup
    .string()
    .required('Le prénom est requis')
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(100, 'Le prénom ne doit pas dépasser 100 caractères'),

  lastName: yup
    .string()
    .required('Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne doit pas dépasser 100 caractères'),

  age: yup
    .number()
    .required("L'âge est requis")
    .integer("L'âge doit être un nombre entier")
    .min(13, 'Vous devez avoir au moins 13 ans')
    .max(120, 'Âge invalide'),

  province: yup.string().required('La province est requise'),

  commune: yup
    .string()
    .required('La commune est requise')
    .min(2, 'La commune doit contenir au moins 2 caractères'),

  phoneNumber: yup
    .string()
    .matches(/^(\+213|0)[567]\d{8}$/, 'Numéro de téléphone algérien invalide')
    .optional(),
})

export const createEventSchema = yup.object({
  // Basic Information
  name: yup
    .string()
    .required('Le nom est requis')
    .min(3, 'Le nom doit contenir au moins 3 caractères')
    .max(255, 'Le nom ne doit pas dépasser 255 caractères'),

  description: yup
    .string()
    .required('La description est requise')
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(2000, 'La description ne doit pas dépasser 2000 caractères'),

  category: yup
    .string()
    .required('La catégorie est requise')
    .min(2, 'La catégorie doit contenir au moins 2 caractères'),

  // Location
  location: yup
    .string()
    .required('Le lieu est requis')
    .min(3, 'Le lieu doit contenir au moins 3 caractères'),

  province: yup.string().required('La province est requise'),

  commune: yup
    .string()
    .required('La commune est requise')
    .min(2, 'La commune doit contenir au moins 2 caractères'),

  // Dates
  startDate: yup
    .date()
    .required('La date de début est requise')
    .min(new Date(), 'La date de début doit être dans le futur'),

  endDate: yup
    .date()
    .required('La date de fin est requise')
    .min(yup.ref('startDate'), 'La date de fin doit être après la date de début'),

  registrationStartDate: yup.date().nullable(),

  registrationEndDate: yup
    .date()
    .nullable()
    .when('registrationStartDate', {
      is: (val: any) => val != null,
      then: (schema) =>
        schema.min(
          yup.ref('registrationStartDate'),
          'La date de fin des inscriptions doit être après la date de début'
        ),
    }),

  // Capacity & Age
  capacity: yup
    .number()
    .required('La capacité est requise')
    .min(1, 'La capacité doit être au moins 1')
    .max(10000, 'La capacité ne peut pas dépasser 10000'),

  minAge: yup
    .number()
    .required("L'âge minimum est requis")
    .min(0, "L'âge minimum ne peut pas être négatif")
    .max(120, "L'âge minimum est invalide"),

  maxAge: yup
    .number()
    .nullable()
    .min(yup.ref('minAge'), "L'âge maximum doit être supérieur à l'âge minimum")
    .max(120, "L'âge maximum est invalide"),

  // Pricing
  basePrice: yup
    .number()
    .min(0, 'Le prix ne peut pas être négatif')
    .max(1000000, 'Le prix est trop élevé'),

  youthPrice: yup.number().nullable().min(0, 'Le prix jeune ne peut pas être négatif'),

  seniorPrice: yup.number().nullable().min(0, 'Le prix senior ne peut pas être négatif'),

  // Options
  isPublic: yup.boolean(),
  requiresApproval: yup.boolean(),

  tags: yup.array().of(yup.string()),

  // Game-specific fields
  eventType: yup.string().oneOf(['normal', 'game']).nullable(),

  gameType: yup
    .string()
    .nullable()
    .when('eventType', {
      is: 'game',
      then: (schema) => schema.required('Le type de jeu est requis pour un événement de jeu'),
    }),

  difficulty: yup
    .string()
    .nullable()
    .oneOf(['easy', 'medium', 'hard', 'extreme'], 'Difficulté invalide'),

  durationMinutes: yup
    .number()
    .nullable()
    .min(1, 'La durée doit être au moins 1 minute')
    .max(1440, 'La durée ne peut pas dépasser 24 heures'),

  physicalIntensity: yup.string().oneOf(['low', 'medium', 'high'], 'Intensité invalide'),

  // Team configuration
  allowsTeams: yup.boolean(),

  teamRegistration: yup
    .string()
    .oneOf(['individual', 'team', 'both'], "Mode d'inscription invalide"),

  minTeamSize: yup
    .number()
    .nullable()
    .when('allowsTeams', {
      is: true,
      then: (schema) => schema.min(1, 'La taille minimale doit être au moins 1'),
    }),

  maxTeamSize: yup
    .number()
    .nullable()
    .when(['allowsTeams', 'minTeamSize'], {
      is: (allowsTeams: boolean, minTeamSize: number) => allowsTeams && minTeamSize,
      then: (schema) =>
        schema.min(
          yup.ref('minTeamSize'),
          'La taille maximale doit être supérieure à la taille minimale'
        ),
    }),

  maxTeams: yup
    .number()
    .nullable()
    .when('allowsTeams', {
      is: true,
      then: (schema) => schema.min(1, "Le nombre d'équipes doit être au moins 1"),
    }),

  autoTeamFormation: yup.boolean(),

  // Requirements
  requiredItems: yup.array().of(yup.string()),
  prohibitedItems: yup.array().of(yup.string()),
  safetyRequirements: yup.array().of(yup.string()),
  waiverRequired: yup.boolean(),
  rulesDocumentUrl: yup.string().nullable().url('URL invalide'),

  // Timeline
  checkInTime: yup.date().nullable(),

  briefingDurationMinutes: yup
    .number()
    .nullable()
    .min(0, 'La durée du briefing ne peut pas être négative')
    .max(120, 'La durée du briefing ne peut pas dépasser 2 heures'),

  // Prizes
  prizeInformation: yup.string().nullable(),

  prizePool: yup.number().nullable().min(0, 'Le montant ne peut pas être négatif'),

  winnerAnnouncement: yup.date().nullable(),

  // Additional options
  photographyAllowed: yup.boolean(),
  liveStreaming: yup.boolean(),
  specialInstructions: yup.string().nullable(),
})

// Types TypeScript
export type RegisterFormData = yup.InferType<typeof registerSchema>
export type LoginFormData = yup.InferType<typeof loginSchema>
export type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>
export type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>
export type UpdateProfileFormData = yup.InferType<typeof updateProfileSchema>
export type CreateEventFormData = yup.InferType<typeof createEventSchema>
