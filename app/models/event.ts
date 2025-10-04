import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Registration from '#models/registration'

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
   * Vérifie si l'événement est complet
   */
  get isFull(): boolean {
    return this.registeredCount >= this.capacity
  }

  /**
   * Places disponibles
   */
  get availableSeats(): number {
    return Math.max(0, this.capacity - this.registeredCount)
  }

  /**
   * Vérifie si les inscriptions sont ouvertes
   */
  get isRegistrationOpen(): boolean {
    const now = DateTime.now()
    
    if (this.status !== 'published') {
      return false
    }

    if (this.registrationStartDate && now < this.registrationStartDate) {
      return false
    }

    if (this.registrationEndDate && now > this.registrationEndDate) {
      return false
    }

    if (this.isFull) {
      return false
    }

    if (now >= this.startDate) {
      return false
    }

    return true
  }

  /**
   * Vérifie si l'événement a encore des places disponibles
   */
  hasAvailableSeats(): boolean {
    return this.availableSeats > 0
  }

  /**
   * Vérifie si l'événement est terminé
   */
  isFinished(): boolean {
    return this.endDate < DateTime.now()
  }

  /**
   * Vérifie si l'événement est en cours
   */
  isOngoing(): boolean {
    const now = DateTime.now()
    return this.startDate <= now && this.endDate >= now
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
    return this.isRegistrationOpen && this.status === 'published' && this.hasAvailableSeats() && !this.isFinished()
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
    if (age < this.minAge) {
      return false
    }

    if (this.maxAge !== null && age > this.maxAge) {
      return false
    }

    return true
  }

  /**
   * Met à jour le statut automatiquement selon les dates
   */
  updateStatus(): void {
    const now = DateTime.now()

    if (this.status === 'cancelled' || this.status === 'draft') {
      return
    }

    if (now >= this.endDate) {
      this.status = 'finished'
    } else if (now >= this.startDate) {
      this.status = 'ongoing'
    }
  }
}