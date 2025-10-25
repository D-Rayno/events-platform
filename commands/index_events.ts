// commands/index_events.ts
import { BaseCommand } from '@adonisjs/core/ace'
import Event from '#models/event'
import typesenseClient, { isTypesenseReady, Collections } from '#services/typesense_service'
import type { EventDocument } from '#services/typesense_service'
import typesenseConfig from '#config/typesense'

export default class IndexEvents extends BaseCommand {
  static commandName = 'index:events'
  static description = 'Indexes all events into Typesense'

  async run() {
    if (!typesenseConfig.enabled) {
      this.logger.warning(
        '⚠️  Typesense is disabled. Enable it in .env with TYPESENSE_ENABLED=true'
      )
      return
    }

    this.logger.info('🔍 Checking Typesense availability...')

    const ready = await isTypesenseReady(Collections.EVENTS)
    if (!ready) {
      this.logger.error('❌ Typesense collection not found. Run "node ace setup:typesense" first.')
      return
    }

    this.logger.info('📊 Fetching events from database...')
    const events = await Event.all()

    if (events.length === 0) {
      this.logger.warning('⚠️  No events found in database')
      return
    }

    this.logger.info(`Found ${events.length} events. Starting indexing...`)

    const documents: EventDocument[] = events.map((event) => ({
      id: event.id.toString(),
      name: event.name || '',
      description: event.description || '',
      category: event.category || '',
      province: event.province || '',
      commune: event.commune || '',
      start_date: event.startDate.toUnixInteger(),
      status: event.status || 'draft',
      is_public: Boolean(event.isPublic),
      event_type: event.eventType || null,
      game_type: event.gameType || null,
      difficulty: event.difficulty || null,
    }))

    try {
      const results = await typesenseClient
        .collections<EventDocument>(Collections.EVENTS)
        .documents()
        .import(documents, { action: 'upsert' })

      // Count successes and failures
      const failed = results.filter((r) => !r.success).length
      const succeeded = results.length - failed

      if (failed > 0) {
        this.logger.warning(`⚠️  Indexed ${succeeded} events, ${failed} failed`)
        results
          .filter((r) => !r.success)
          .forEach((r, index) => {
            const event = events[index]
            this.logger.error(`\nFailed to index event ID ${event?.id}:`)
            this.logger.error(`  Name: ${event?.name}`)
            this.logger.error(`  Error: ${r.error}`)
            
            if (r.document) {
              this.logger.error(`  Document: ${JSON.stringify(r.document, null, 2)}`)
            }
          })
      } else {
        this.logger.success(`✅ Successfully indexed all ${succeeded} events`)
      }
    } catch (error: any) {
      this.logger.error(`❌ Error indexing events: ${error.message}`)
      
      if (error.importResults) {
        this.logger.error('\nDetailed import errors:')
        error.importResults.forEach((result: any, index: number) => {
          if (!result.success) {
            const event = events[index]
            this.logger.error(`\nEvent ${index + 1} (ID: ${event?.id}, Name: ${event?.name}):`)
            this.logger.error(`  Error: ${result.error}`)
            this.logger.error(`  Document: ${JSON.stringify(documents[index], null, 2)}`)
          }
        })
      }
    }
  }
}