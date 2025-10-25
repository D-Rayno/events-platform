// inertia/lib/constants.ts - ENHANCED VERSION
export const PROVINCES = [
  'Adrar',
  'Chlef',
  'Laghouat',
  'Oum El Bouaghi',
  'Batna',
  'Béjaïa',
  'Biskra',
  'Béchar',
  'Blida',
  'Bouira',
  'Tamanrasset',
  'Tébessa',
  'Tlemcen',
  'Tiaret',
  'Tizi Ouzou',
  'Alger',
  'Djelfa',
  'Jijel',
  'Sétif',
  'Saïda',
  'Skikda',
  'Sidi Bel Abbès',
  'Annaba',
  'Guelma',
  'Constantine',
  'Médéa',
  'Mostaganem',
  "M'Sila",
  'Mascara',
  'Ouargla',
  'Oran',
  'El Bayadh',
  'Illizi',
  'Bordj Bou Arréridj',
  'Boumerdès',
  'El Tarf',
  'Tindouf',
  'Tissemsilt',
  'El Oued',
  'Khenchela',
  'Souk Ahras',
  'Tipaza',
  'Mila',
  'Aïn Defla',
  'Naâma',
  'Aïn Témouchent',
  'Ghardaïa',
  'Relizane',
]

export const EVENT_CATEGORIES = [
  'Sport',
  'Culture',
  'Éducation',
  'Technologie',
  'Divertissement',
  'Gaming',
  'Conférence',
  'Atelier',
  'Formation',
  'Séminaire',
  'Networking',
  'Musique',
  'Art',
  'Cinéma',
  'Gastronomie',
  'Santé & Bien-être',
  'Famille',
  'Jeunesse',
  'Solidarité',
  'Environnement',
]

export const EVENT_TYPES = {
  NORMAL: 'normal',
  GAME: 'game',
} as const

export const GAME_TYPES = {
  SQUID_GAME: 'squid-game',
  WEREWOLF: 'werewolf',
  ESCAPE_ROOM: 'escape-room',
  TREASURE_HUNT: 'treasure-hunt',
  OBSTACLE_COURSE: 'obstacle-course',
  SURVIVAL: 'survival',
  QUIZ: 'quiz',
  RIDDLE: 'riddle',
  STRATEGY: 'strategy',
  ADVENTURE: 'adventure',
} as const

export const GAME_TYPE_LABELS: Record<string, string> = {
  'squid-game': '🦑 Squid Game',
  'werewolf': '🐺 Loup-Garou',
  'escape-room': '🔐 Escape Room',
  'treasure-hunt': '🗺️ Chasse au trésor',
  'obstacle-course': '🏃 Parcours d\'obstacles',
  'survival': '🏕️ Survie',
  'quiz': '🧠 Quiz',
  'riddle': '🔍 Énigmes',
  'strategy': '♟️ Stratégie',
  'adventure': '🗺️ Aventure',
}

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
  EXTREME: 'extreme',
} as const

export const DIFFICULTY_LABELS: Record<string, string> = {
  easy: '😊 Facile',
  medium: '😐 Moyen',
  hard: '😰 Difficile',
  extreme: '💀 Extrême',
}

export const PHYSICAL_INTENSITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const

export const PHYSICAL_INTENSITY_LABELS: Record<string, string> = {
  low: '🟢 Faible',
  medium: '🟡 Modérée',
  high: '🔴 Intense',
}

export const TEAM_REGISTRATION_TYPES = {
  INDIVIDUAL: 'individual',
  TEAM: 'team',
  BOTH: 'both',
} as const

export const TEAM_REGISTRATION_LABELS: Record<string, string> = {
  individual: '👤 Individuel',
  team: '👥 En équipe',
  both: '👥👤 Les deux',
}

export const EVENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ONGOING: 'ongoing',
  FINISHED: 'finished',
  CANCELLED: 'cancelled',
} as const

export const EVENT_STATUS_LABELS: Record<string, string> = {
  draft: '📝 Brouillon',
  published: '✅ Publié',
  ongoing: '⚡ En cours',
  finished: '✓ Terminé',
  cancelled: '❌ Annulé',
}

export const REGISTRATION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'canceled',
  ATTENDED: 'attended',
} as const

export const REGISTRATION_STATUS_LABELS: Record<string, string> = {
  pending: '⏳ En attente',
  confirmed: '✅ Confirmé',
  canceled: '❌ Annulé',
  attended: '✓ Présent',
}

export const PRICE_RANGES = {
  FREE: { min: 0, max: 0, label: '💚 Gratuit' },
  PAID: { min: 1, max: 1000, label: '💰 Payant' },
  PREMIUM: { min: 1001, max: Infinity, label: '💎 Premium' },
}

export const AGE_CATEGORIES = {
  YOUTH: { min: 13, max: 25, label: 'Jeunes (-26 ans)' },
  ADULT: { min: 26, max: 59, label: 'Adultes' },
  SENIOR: { min: 60, max: 120, label: 'Seniors (60+)' },
}

// Helper functions
export function getGameTypeLabel(gameType: string | null | undefined): string {
  if (!gameType) return ''
  return GAME_TYPE_LABELS[gameType] || gameType
}

export function getDifficultyLabel(difficulty: string | null | undefined): string {
  if (!difficulty) return ''
  return DIFFICULTY_LABELS[difficulty] || difficulty
}

export function getIntensityLabel(intensity: string | null | undefined): string {
  if (!intensity) return ''
  return PHYSICAL_INTENSITY_LABELS[intensity] || intensity
}

export function getTeamRegistrationLabel(type: string | null | undefined): string {
  if (!type) return ''
  return TEAM_REGISTRATION_LABELS[type] || type
}

export function getEventStatusLabel(status: string | null | undefined): string {
  if (!status) return ''
  return EVENT_STATUS_LABELS[status] || status
}

export function getRegistrationStatusLabel(status: string | null | undefined): string {
  if (!status) return ''
  return REGISTRATION_STATUS_LABELS[status] || status
}

export function getPriceRange(price: number): string {
  if (price === 0) return PRICE_RANGES.FREE.label
  if (price <= 1000) return PRICE_RANGES.PAID.label
  return PRICE_RANGES.PREMIUM.label
}

export function getAgeCategory(age: number): string {
  if (age < AGE_CATEGORIES.ADULT.min) return AGE_CATEGORIES.YOUTH.label
  if (age < AGE_CATEGORIES.SENIOR.min) return AGE_CATEGORIES.ADULT.label
  return AGE_CATEGORIES.SENIOR.label
}