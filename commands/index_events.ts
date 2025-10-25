// commands/index_events.ts
import { BaseCommand } from '@adonisjs/core/ace'
import { Application } from '@adonisjs/core/app'
import Event from '#models/event'
import typesenseClient from '#services/typesense_service'
import type { EventDocument } from '#services/typesense_service'

export default class IndexEvents extends BaseCommand {
  static commandName = 'index:events'
  static description = 'Indexes all events into Typesense'

  constructor(app: Application<{}>) {
    super(app)
  }

  async run() {
    // Ensure the database is initialized
    await this.app.container.make('db')

    const events = await Event.all()
    const documents: EventDocument[] = events.map((event) => ({
      id: event.id.toString(),
      name: event.name,
      description: event.description,
      category: event.category,
      province: event.province,
      start_date: event.startDate.toUnixInteger(),
      event_type: event.eventType || null,
      game_type: event.gameType || null,
      difficulty: event.difficulty || null,
    }))

    try {
      await typesenseClient
        .collections<EventDocument>('events')
        .documents()
        .import(documents, { action: 'upsert' })
      this.logger.success(`Indexed ${events.length} events.`)
    } catch (error) {
      this.logger.error(`Error indexing events: ${error.message}`)
    }
  }
}