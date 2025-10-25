// inertia/types/events.ts
export interface Event {
  id: number
  name: string
  description: string
  location: string
  province: string
  commune: string
  startDate: string
  endDate: string
  capacity: number
  registeredCount: number
  availableSeats: number
  imageUrl: string | null
  category: string
  tags?: string[]
  basePrice: number
  youthPrice?: number
  seniorPrice?: number
  userPrice?: number
  minAge: number
  maxAge?: number
  status: string
  requiresApproval: boolean
  registrationStartDate?: string
  registrationEndDate?: string
  isFull: boolean
  canRegister: boolean
  isUpcoming: boolean
  isOngoing: boolean
  isFinished: boolean
  isRegistered?: boolean
  
  // Game-specific fields
  eventType?: string | null
  gameType?: string | null
  gameSummary?: string
  difficulty?: string | null
  durationMinutes?: number | null
  physicalIntensity?: string | null
  allowsTeams?: boolean
  teamRegistration?: string | null
  minTeamSize?: number | null
  maxTeamSize?: number | null
  maxTeams?: number | null
  autoTeamFormation?: boolean
  requiredItems?: string[] | null
  prohibitedItems?: string[] | null
  safetyRequirements?: string[] | null
  waiverRequired?: boolean
  rulesDocumentUrl?: string | null
  checkInTime?: string | null
  briefingDurationMinutes?: number | null
  prizeInformation?: string | null
  prizePool?: number | null
  winnerAnnouncement?: string | null
  photographyAllowed?: boolean
  liveStreaming?: boolean
  specialInstructions?: string | null
  totalDurationMinutes?: number
  isCheckInOpen?: boolean
}

export interface Registration {
  id: number
  status: string
  createdAt: string
  eventId?: number
  userId?: number
}

export interface SimilarEvent {
  id: number
  name: string
  imageUrl: string | null
  startDate: string
  province: string
  basePrice: number
  category: string
  eventType?: string
}

export interface FilterStats {
  total: number
  gameEvents: number
  normalEvents: number
  freeEvents: number
  paidEvents: number
  availableGameTypes: string[]
}

export interface EventFilters {
  search?: string
  category?: string
  province?: string
  eventType?: string
  gameType?: string
  difficulty?: string
  priceRange?: string
  status?: string
}

export interface GameInfo {
  gameType?: string | null
  difficulty?: string | null
  durationMinutes?: number | null
  physicalIntensity?: string | null
  allowsTeams?: boolean
  teamRegistration?: string | null
  minTeamSize?: number | null
  maxTeamSize?: number | null
  maxTeams?: number | null
  autoTeamFormation?: boolean
  requiredItems?: string[] | null
  prohibitedItems?: string[] | null
  safetyRequirements?: string[] | null
  waiverRequired?: boolean
  rulesDocumentUrl?: string | null
  checkInTime?: string | null
  briefingDurationMinutes?: number | null
  prizeInformation?: string | null
  prizePool?: number | null
  winnerAnnouncement?: string | null
  photographyAllowed?: boolean
  liveStreaming?: boolean
  specialInstructions?: string | null
  totalDurationMinutes?: number
}