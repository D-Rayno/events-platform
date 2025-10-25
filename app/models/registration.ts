// app/models/registration.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, afterSave, afterDelete } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Event from '#models/event'
import { safeIndexRegistration, safeDeleteRegistration } from '#services/typesense_service'
import type { RegistrationDocument } from '#services/typesense_service'

export default class Registration extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare eventId: number

  @column()
  declare status: 'pending' | 'confirmed' | 'attended' | 'canceled'

  @column()
  declare qrCode: string

  @column()
  declare price: number

  @column.dateTime()
  declare attendedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  /**
   * Relations
   */
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Event)
  declare event: BelongsTo<typeof Event>

  /**
   * Vérifie si l'inscription est active
   */
  get isActive(): boolean {
    return this.status === 'pending' || this.status === 'confirmed'
  }

  /**
   * Vérifie si l'utilisateur a assisté à l'événement
   */
  hasAttended(): boolean {
    return this.status === 'attended'
  }

  /**
   * Vérifie si l'inscription est annulée
   */
  isCanceled(): boolean {
    return this.status === 'canceled'
  }

  /**
   * After save hook - index registration in Typesense
   */
  @afterSave()
  static async indexRegistration(registration: Registration) {
    // Load relations if not loaded
    await registration.load('user')
    await registration.load('event')

    const doc: RegistrationDocument = {
      id: registration.id.toString(),
      user_id: registration.userId,
      event_id: registration.eventId,
      user_name: registration.user.fullName,
      user_email: registration.user.email,
      event_name: registration.event.name,
      event_location: registration.event.location,
      status: registration.status,
      qr_code: registration.qrCode,
      created_at: registration.createdAt.toUnixInteger(),
      event_start_date: registration.event.startDate.toUnixInteger(),
    }

    await safeIndexRegistration(doc)
  }

  /**
   * After delete hook - remove registration from Typesense index
   */
  @afterDelete()
  static async removeRegistrationFromIndex(registration: Registration) {
    await safeDeleteRegistration(registration.id.toString())
  }
}
