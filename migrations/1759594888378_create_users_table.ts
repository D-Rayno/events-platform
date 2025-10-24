import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()

      // Informations de base
      table.string('first_name', 100).notNullable()
      table.string('last_name', 100).notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()

      // Informations supplémentaires
      table.integer('age').notNullable()
      table.string('province', 100).notNullable()
      table.string('commune', 100).notNullable()
      table.string('phone_number', 20).nullable()

      // Avatar
      table.string('avatar_url').nullable()

      // Vérification email
      table.boolean('is_email_verified').defaultTo(false)
      table.string('email_verification_token').nullable()
      table.timestamp('email_verified_at').nullable()

      // Réinitialisation mot de passe
      table.string('password_reset_token').nullable()
      table.timestamp('password_reset_expires_at').nullable()

      // Statut du compte (removed .after() modifier)
      table.boolean('is_active').defaultTo(true)
      table.boolean('is_blocked').defaultTo(false)
      table.boolean('is_admin').defaultTo(false)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
