// app/models/event.ts
import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, afterSave, afterDelete } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Registration from '#models/registration'
import { safeIndexEvent, safeDeleteEvent } from '#services/typesense_service'
import type { EventDocument } from '#services/typesense_service'

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare imageUrl: string | null

  @column()
  declare location: string

  @column()
  declare province: string

  @column()
  declare commune: string

  @column.dateTime()
  declare startDate: DateTime

  @column.dateTime()
  declare endDate: DateTime

  @column()
  declare capacity: number

  @column()
  declare registeredCount: number

  @column()
  declare minAge: number

  @column()
  declare maxAge: number | null

  @column()
  declare basePrice: number

  @column()
  declare youthPrice: number | null

  @column()
  declare seniorPrice: number | null

  @column()
  declare status: 'draft' | 'published' | 'ongoing' | 'finished' | 'cancelled'

  @column()
  declare isPublic: boolean

  @column()
  declare requiresApproval: boolean

  @column()
  declare category: string

  @column()
  declare tags: string[]

  @column.dateTime()
  declare registrationStartDate: DateTime | null

  @column.dateTime()
  declare registrationEndDate: DateTime | null

  @column()
  declare isActive: boolean

  @column()
  declare isFeatured: boolean

  // ============================================
  // GAME-SPECIFIC FIELDS
  // ============================================

  @column()
  declare eventType: string | null

  @column()
  declare gameType: string | null

  @column()
  declare difficulty: 'easy' | 'medium' | 'hard' | 'extreme' | null

  @column()
  declare durationMinutes: number | null

  @column()
  declare physicalIntensity: 'low' | 'medium' | 'high'

  @column()
  declare allowsTeams: boolean

  @column()
  declare teamRegistration: 'individual' | 'team' | 'both'

  @column()
  declare minTeamSize: number | null

  @column()
  declare maxTeamSize: number | null

  @column()
  declare maxTeams: number | null

  @column()
  declare autoTeamFormation: boolean

  @column()
  declare requiredItems: string[] | null

  @column()
  declare prohibitedItems: string[] | null

  @column()
  declare safetyRequirements: string[] | null

  @column()
  declare waiverRequired: boolean

  @column()
  declare rulesDocumentUrl: string | null

  @column.dateTime()
  declare checkInTime: DateTime | null

  @column()
  declare briefingDurationMinutes: number | null

  @column()
  declare prizeInformation: string | null

  @column()
  declare prizePool: number | null

  @column.dateTime()
  declare winnerAnnouncement: DateTime | null

  @column()
  declare photographyAllowed: boolean

  @column()
  declare liveStreaming: boolean

  @column()
  declare specialInstructions: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  /**
   * Relations
   */
  @hasMany(() => Registration)
  declare registrations: HasMany<typeof Registration>

  /**
   * Vérifie si c'est un événement de jeu
   */
  get isGameEvent(): boolean {
    return !!this.eventType
  }

  /**
   * Vérifie si l'événement est complet
   */
  get isFull(): boolean {
    return this.registeredCount >= this.capacity
  }

  /**
   * Sièges disponibles
   */
  get availableSeats(): number {
    return Math.max(0, this.capacity - this.registeredCount)
  }

  /**
   * Vérifie si les inscriptions sont ouvertes
   */
  get isRegistrationOpen(): boolean {
    const now = DateTime.now()
    const start = this.registrationStartDate || this.createdAt
    const end = this.registrationEndDate || this.startDate
    return now >= start && now <= end
  }

  /**
   * Vérifie s'il reste des places
   */
  hasAvailableSeats(): boolean {
    return this.availableSeats > 0
  }

  /**
   * Vérifie si l'événement est en cours
   */
  isOngoing(): boolean {
    const now = DateTime.now()
    return now >= this.startDate && now <= this.endDate
  }

  /**
   * Vérifie si l'événement est terminé
   */
  isFinished(): boolean {
    return this.endDate < DateTime.now()
  }

  /**
   * Vérifie si l'événement est à venir
   */
  isUpcoming(): boolean {
    return this.startDate > DateTime.now()
  }

  /**
   * Vérifie si les inscriptions sont ouvertes (méthode)
   */
  canRegister(): boolean {
    return (
      this.isRegistrationOpen &&
      this.status === 'published' &&
      this.hasAvailableSeats() &&
      !this.isFinished()
    )
  }

  /**
   * Calcule le prix en fonction de l'âge
   */
  getPriceForAge(age: number): number {
    if (this.youthPrice !== null && age < 26) {
      return this.youthPrice
    }
    if (this.seniorPrice !== null && age >= 60) {
      return this.seniorPrice
    }
    return this.basePrice
  }

  /**
   * Vérifie si l'âge est éligible pour l'événement
   */
  isAgeEligible(age: number): boolean {
    if (age < this.minAge) return false
    if (this.maxAge !== null && age > this.maxAge) return false
    return true
  }

  /**
   * Vérifie si le participant est physiquement apte (basé sur l'intensité)
   */
  requiresPhysicalFitness(): boolean {
    return this.physicalIntensity === 'high'
  }

  /**
   * Obtient la durée totale incluant le briefing
   */
  get totalDurationMinutes(): number {
    const gameDuration = this.durationMinutes || 0
    const briefing = this.briefingDurationMinutes || 0
    return gameDuration + briefing
  }

  /**
   * Vérifie si le check-in a commencé
   */
  isCheckInOpen(): boolean {
    if (!this.checkInTime) return false
    const now = DateTime.now()
    return now >= this.checkInTime && now < this.startDate
  }

  /**
   * Met à jour le statut automatiquement selon les dates
   */
  updateStatus(): void {
    const now = DateTime.now()
    if (this.status === 'cancelled' || this.status === 'draft') return

    if (now >= this.endDate) {
      this.status = 'finished'
    } else if (now >= this.startDate) {
      this.status = 'ongoing'
    }
  }

  /**
   * Obtient un résumé des informations du jeu
   */
  getGameSummary(): string | null {
    if (!this.isGameEvent) return null

    const parts: string[] = []
    if (this.gameType) parts.push(`Type: ${this.gameType}`)
    if (this.difficulty) parts.push(`Difficulté: ${this.difficulty}`)
    if (this.durationMinutes) parts.push(`Durée: ${this.durationMinutes} min`)
    if (this.allowsTeams && this.minTeamSize && this.maxTeamSize) {
      parts.push(`Équipes: ${this.minTeamSize}-${this.maxTeamSize} joueurs`)
    }
    return parts.join(' | ')
  }

  /**
   * Obtient le badge de difficulté avec couleur
   */
  getDifficultyBadge(): { text: string; color: string } | null {
    if (!this.difficulty) return null

    const badges = {
      easy: { text: 'Facile', color: 'green' },
      medium: { text: 'Moyen', color: 'yellow' },
      hard: { text: 'Difficile', color: 'orange' },
      extreme: { text: 'Extrême', color: 'red' },
    }
    return badges[this.difficulty]
  }

  /**
   * Obtient le badge d'intensité physique
   */
  getIntensityBadge(): { text: string; color: string } {
    const badges = {
      low: { text: 'Faible', color: 'green' },
      medium: { text: 'Modérée', color: 'yellow' },
      high: { text: 'Intense', color: 'red' },
    }
    return badges[this.physicalIntensity]
  }

  /**
   * After save hook - index event in Typesense
   * This will only run if Typesense is enabled and collection exists
   */
  @afterSave()
  static async indexEvent(event: Event) {
    const doc: EventDocument = {
      id: event.id.toString(),
      name: event.name,
      description: event.description,
      category: event.category,
      province: event.province,
      commune: event.commune,
      start_date: event.startDate.toUnixInteger(),
      status: event.status,
      is_public: event.isPublic,
      event_type: event.eventType || null,
      game_type: event.gameType || null,
      difficulty: event.difficulty || null,
    }

    await safeIndexEvent(doc)
  }

  /**
   * After delete hook - remove event from Typesense index
   */
  @afterDelete()
  static async removeEventFromIndex(event: Event) {
    await safeDeleteEvent(event.id.toString())
  }
}
