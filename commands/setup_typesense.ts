// commands/setup_typesense.ts
import { BaseCommand } from '@adonisjs/core/ace'
import typesenseClient from '#services/typesense_service'
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections.js'
/**
 * CLI Command: Setup Typesense collection for events
 *
 * Usage:
 *   node ace setup:typesense
 */
export default class SetupTypesense extends BaseCommand {
  static commandName = 'setup:typesense'
  static description = 'Sets up the Typesense collection for events'

  /**
   * Runs the command to create the "events" collection in Typesense.
   */
  async run() {
    const schema: CollectionCreateSchema = {
      name: 'events',
      fields: [
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'category', type: 'string', facet: true },
        { name: 'province', type: 'string', facet: true },
        { name: 'start_date', type: 'int64', sort: true },
        { name: 'event_type', type: 'string', facet: true, optional: true },
        { name: 'game_type', type: 'string', facet: true, optional: true },
        { name: 'difficulty', type: 'string', facet: true, optional: true },
      ],
      default_sorting_field: 'start_date',
    }

    try {
      await typesenseClient.collections().create(schema)
      this.logger.success('✅ Typesense collection "events" created successfully.')
    } catch (error: any) {
      if (error.httpStatus === 409) {
        this.logger.info('ℹ️  Typesense collection "events" already exists.')
      } else {
        this.logger.error(`❌ Error creating collection: ${error.message}`)
      }
    }
  }
}
