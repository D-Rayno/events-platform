// commands/index_users.ts - NEW FILE
import { BaseCommand } from '@adonisjs/core/ace'
import User from '#models/user'
import typesenseClient, { isTypesenseReady, Collections } from '#services/typesense_service'
import type { UserDocument } from '#services/typesense_service'
import typesenseConfig from '#config/typesense'

export default class IndexUsers extends BaseCommand {
  static commandName = 'index:users'
  static description = 'Indexes all users into Typesense'

  async run() {
    if (!typesenseConfig.enabled) {
      this.logger.warning(
        '⚠️  Typesense is disabled. Enable it in .env with TYPESENSE_ENABLED=true'
      )
      return
    }

    this.logger.info('🔍 Checking Typesense availability...')

    const ready = await isTypesenseReady(Collections.USERS)
    if (!ready) {
      this.logger.error(
        '❌ Typesense users collection not found. Run "node ace setup:typesense" first.'
      )
      return
    }

    this.logger.info('📊 Fetching users from database...')
    const users = await User.all()

    if (users.length === 0) {
      this.logger.warning('⚠️  No users found in database')
      return
    }

    this.logger.info(`Found ${users.length} users. Starting indexing...`)

    const documents: UserDocument[] = users.map((user) => ({
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
    }))

    try {
      const results = await typesenseClient
        .collections<UserDocument>(Collections.USERS)
        .documents()
        .import(documents, { action: 'upsert' })

      // Count successes and failures
      const failed = results.filter((r) => !r.success).length
      const succeeded = results.length - failed

      if (failed > 0) {
        this.logger.warning(`⚠️  Indexed ${succeeded} users, ${failed} failed`)
        results
          .filter((r) => !r.success)
          .forEach((r) => {
            this.logger.error(`Failed to index user: ${r.error}`)
          })
      } else {
        this.logger.success(`✅ Successfully indexed all ${succeeded} users`)
      }
    } catch (error: any) {
      this.logger.error(`❌ Error indexing users: ${error.message}`)
    }
  }
}