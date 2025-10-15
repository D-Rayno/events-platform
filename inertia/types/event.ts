// inertia/types/event.ts
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
  basePrice: number
  isFull: boolean
  canRegister: boolean
  isUpcoming: boolean
  isOngoing: boolean
  isFinished: boolean
  eventType?: string
  gameType?: string
  difficulty?: string
}

export interface EventFilters {
  search?: string
  category?: string
  province?: string
  eventType?: string
  gameType?: string
  difficulty?: string
  page?: number
}
