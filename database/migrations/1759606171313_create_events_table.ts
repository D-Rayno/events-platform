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

<<<<<<< HEAD
      // Statut admin
      table.boolean('is_active').defaultTo(true)
      table.boolean('is_featured').defaultTo(false)

      // ============================================
      // GAME-SPECIFIC FIELDS
      // ============================================

      // Type d'événement (null = événement normal)
      table
        .string('event_type', 50)
        .nullable()
        .comment('null for normal events, game type for game events')

      // Informations de jeu
      table.string('game_type', 100).nullable().comment('squid-game, werewolf, escape-room, etc.')
      table.enum('difficulty', ['easy', 'medium', 'hard', 'extreme']).nullable()
      table.integer('duration_minutes').unsigned().nullable()
      table.enum('physical_intensity', ['low', 'medium', 'high']).defaultTo('medium')

      // Configuration des équipes
      table.boolean('allows_teams').defaultTo(false)
      table.enum('team_registration', ['individual', 'team', 'both']).defaultTo('individual')
      table.integer('min_team_size').unsigned().nullable()
      table.integer('max_team_size').unsigned().nullable()
      table.integer('max_teams').unsigned().nullable()
      table.boolean('auto_team_formation').defaultTo(false)

      // Exigences et sécurité
      table.json('required_items').nullable().comment('["comfortable shoes", "water bottle"]')
      table.json('prohibited_items').nullable().comment('["phones", "cameras"]')
      table.json('safety_requirements').nullable()
      table.boolean('waiver_required').defaultTo(false)
      table.string('rules_document_url').nullable()

      // Timeline du jeu
      table.timestamp('check_in_time').nullable()
      table.integer('briefing_duration_minutes').unsigned().nullable()

      // Récompenses
      table.text('prize_information').nullable()
      table.decimal('prize_pool', 10, 2).unsigned().nullable()
      table.timestamp('winner_announcement').nullable()

      // Paramètres supplémentaires
      table.boolean('photography_allowed').defaultTo(true)
      table.boolean('live_streaming').defaultTo(false)
      table.text('special_instructions').nullable()

      // Timestamps
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      // Index
      table.index(['status', 'start_date'])
      table.index('category')
      table.index(['province', 'commune'])
      table.index('event_type')
      table.index('game_type')
      table.index('difficulty')
=======
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      // Index pour recherche et filtrage
      table.index(['status', 'start_date'])
      table.index('category')
      table.index(['province', 'commune'])
>>>>>>> 47214e9 (feat: admin api's & user profile management, events and registration for both web and api)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 47214e9 (feat: admin api's & user profile management, events and registration for both web and api)
