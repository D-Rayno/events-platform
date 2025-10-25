// app/models/user.ts
import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, afterSave, afterDelete } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Registration from '#models/registration'
import { safeIndexUser, safeDeleteUser } from '#services/typesense_service'
import type { UserDocument } from '#services/typesense_service'

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


  /**
 * After save hook - index user in Typesense
 */
@afterSave()
static async indexUser(user: User) {
  const doc: UserDocument = {
    id: user.id.toString(),
    first_name: user.firstName,
    last_name: user.lastName,
    full_name: user.fullName,
    email: user.email,
    age: user.age,
    province: user.province,
    commune: user.commune,
    phone_number: user.phoneNumber || null,
    is_email_verified: user.isEmailVerified,
    is_active: user.isActive,
    is_blocked: user.isBlocked,
    created_at: user.createdAt.toUnixInteger(),
  }

  await safeIndexUser(doc)
}

/**
 * After delete hook - remove user from Typesense index
 */
@afterDelete()
static async removeUserFromIndex(user: User) {
  await safeDeleteUser(user.id.toString())
}
}