import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Event from '#models/event'

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
<<<<<<< HEAD
}
=======
}
>>>>>>> 47214e9 (feat: admin api's & user profile management, events and registration for both web and api)
