import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()

      // Informations de base
      table.string('name', 255).notNullable()
      table.text('description').notNullable()
      table.string('image_url').nullable()

      // Localisation
      table.string('location', 255).notNullable()
      table.string('province', 100).notNullable()
      table.string('commune', 100).notNullable()

      // Dates
      table.timestamp('start_date').notNullable()
      table.timestamp('end_date').notNullable()

      // Capacité
      table.integer('capacity').unsigned().notNullable()
      table.integer('registered_count').unsigned().defaultTo(0)

      // Restrictions d'âge
      table.integer('min_age').unsigned().defaultTo(13)
      table.integer('max_age').unsigned().nullable()

      // Tarification
      table.decimal('base_price', 10, 2).unsigned().defaultTo(0)
      table.decimal('youth_price', 10, 2).unsigned().nullable()
      table.decimal('senior_price', 10, 2).unsigned().nullable()

      // Statut et visibilité
      table
        .enum('status', ['draft', 'published', 'ongoing', 'finished', 'cancelled'])
        .defaultTo('draft')
      table.boolean('is_public').defaultTo(true)
      table.boolean('requires_approval').defaultTo(false)

      // Catégorisation
      table.string('category', 100).notNullable()
      table.json('tags').nullable()

      // Période d'inscription
      table.timestamp('registration_start_date').nullable()
      table.timestamp('registration_end_date').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      // Index pour recherche et filtrage
      table.index(['status', 'start_date'])
      table.index('category')
      table.index(['province', 'commune'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}