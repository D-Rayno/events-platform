<<<<<<< HEAD
// ============================================
// FILE 3: Updated registrations migration
// database/migrations/1759606230594_create_registrations_table.ts
// ============================================

=======
>>>>>>> 47214e9 (feat: admin api's & user profile management, events and registration for both web and api)
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'registrations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
<<<<<<< HEAD

=======
      
>>>>>>> 47214e9 (feat: admin api's & user profile management, events and registration for both web and api)
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
<<<<<<< HEAD

=======
      
>>>>>>> 47214e9 (feat: admin api's & user profile management, events and registration for both web and api)
      table
        .integer('event_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('events')
        .onDelete('CASCADE')
<<<<<<< HEAD

=======
      
>>>>>>> 47214e9 (feat: admin api's & user profile management, events and registration for both web and api)
      table
        .enum('status', ['pending', 'confirmed', 'attended', 'canceled'])
        .defaultTo('pending')
        .notNullable()
<<<<<<< HEAD

      table.string('qr_code', 64).notNullable().unique()

      table.decimal('price', 10, 2).unsigned().defaultTo(0)

      table.timestamp('attended_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

=======
      
      table.string('qr_code', 64).notNullable().unique()
      
      table.timestamp('attended_at').nullable()
      
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      
      // Index pour éviter les inscriptions doubles
>>>>>>> 47214e9 (feat: admin api's & user profile management, events and registration for both web and api)
      table.unique(['user_id', 'event_id'])
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
