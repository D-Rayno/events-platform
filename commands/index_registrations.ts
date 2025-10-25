// commands/index_registrations.ts - NEW FILE
import { BaseCommand } from '@adonisjs/core/ace'
import Registration from '#models/registration'
import typesenseClient, { isTypesenseReady, Collections } from '#services/typesense_service'
import type { RegistrationDocument } from '#services/typesense_service'
import typesenseConfig from '#config/typesense'

export default class IndexRegistrations extends BaseCommand {
  static commandName = 'index:registrations'
  static description = 'Indexes all registrations into Typesense'

  async run() {
    if (!typesenseConfig.enabled) {
      this.logger.warning(
        '⚠️  Typesense is disabled. Enable it in .env with TYPESENSE_ENABLED=true'
      )
      return
    }

    this.logger.info('🔍 Checking Typesense availability...')

    const ready = await isTypesenseReady(Collections.REGISTRATIONS)
    if (!ready) {
      this.logger.error(
        '❌ Typesense registrations collection not found. Run "node ace setup:typesense" first.'
      )
      return
    }

    this.logger.info('📊 Fetching registrations from database...')
    const registrations = await Registration.query().preload('user').preload('event')

    if (registrations.length === 0) {
      this.logger.warning('⚠️  No registrations found in database')
      return
    }

    this.logger.info(`Found ${registrations.length} registrations. Starting indexing...`)

    const documents: RegistrationDocument[] = registrations.map((reg) => ({
      id: reg.id.toString(),
      user_id: reg.userId,
      event_id: reg.eventId,
      user_name: reg.user.fullName,
      user_email: reg.user.email,
      event_name: reg.event.name,
      event_location: reg.event.location,
      status: reg.status,
      qr_code: reg.qrCode,
      created_at: reg.createdAt.toUnixInteger(),
      event_start_date: reg.event.startDate.toUnixInteger(),
    }))

    try {
      const results = await typesenseClient
        .collections<RegistrationDocument>(Collections.REGISTRATIONS)
        .documents()
        .import(documents, { action: 'upsert' })

      // Count successes and failures
      const failed = results.filter((r) => !r.success).length
      const succeeded = results.length - failed

      if (failed > 0) {
        this.logger.warning(`⚠️  Indexed ${succeeded} registrations, ${failed} failed`)
        results
          .filter((r) => !r.success)
          .forEach((r) => {
            this.logger.error(`Failed to index registration: ${r.error}`)
          })
      } else {
        this.logger.success(`✅ Successfully indexed all ${succeeded} registrations`)
      }
    } catch (error: any) {
      this.logger.error(`❌ Error indexing registrations: ${error.message}`)
    }
  }
}
