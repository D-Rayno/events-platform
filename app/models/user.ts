import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Registration from '#models/registration'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare age: number

  @column()
  declare province: string

  @column()
  declare commune: string

  @column()
  declare phoneNumber: string | null

  @column()
  declare avatarUrl: string | null

  @column()
  declare isEmailVerified: boolean

  @column({ serializeAs: null })
  declare emailVerificationToken: string | null

  @column.dateTime()
  declare emailVerifiedAt: DateTime | null

  @column({ serializeAs: null })
  declare passwordResetToken: string | null

  @column.dateTime({ serializeAs: null })
  declare passwordResetExpiresAt: DateTime | null

  @column()
  declare isActive: boolean

  @column()
  declare isBlocked: boolean

  @column()
  declare isAdmin: boolean

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
   * Access tokens for API authentication
   */
  static accessTokens = DbAccessTokensProvider.forModel(User)

  /**
   * Nom complet de l'utilisateur
   */
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }

  /**
   * Vérifie si l'utilisateur peut se connecter
   */
  canLogin(): boolean {
    return this.isActive && !this.isBlocked && this.isEmailVerified
  }
}