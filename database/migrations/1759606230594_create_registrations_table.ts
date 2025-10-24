// ============================================
// FILE 3: Updated registrations migration
// database/migrations/1759606230594_create_registrations_table.ts
// ============================================

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'registrations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()

      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table
        .integer('event_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('events')
        .onDelete('CASCADE')

      table
        .enum('status', ['pending', 'confirmed', 'attended', 'canceled'])
        .defaultTo('pending')
        .notNullable()

      table.string('qr_code', 64).notNullable().unique()

      table.decimal('price', 10, 2).unsigned().defaultTo(0)

      table.timestamp('attended_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.unique(['user_id', 'event_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
