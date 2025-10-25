// commands/index_users.ts - FIXED VERSION
import { BaseCommand } from '@adonisjs/core/ace'
import User from '#models/user'
import typesenseClient, { isTypesenseReady, Collections } from '#services/typesense_service'
import type { UserDocument } from '#services/typesense_service'
import typesenseConfig from '#config/typesense'
import { CommandOptions } from '@adonisjs/core/types/ace'

export default class IndexUsers extends BaseCommand {
  static commandName = 'index:users'
  static description = 'Indexes all users into Typesense'

  static options: CommandOptions = {
    startApp: true, // FIXED: This ensures the app is properly started
  }

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
    
    try {
      const users = await User.all()

      if (users.length === 0) {
        this.logger.warning('⚠️  No users found in database')
        return
      }

      this.logger.info(`Found ${users.length} users. Starting indexing...`)

      const documents: UserDocument[] = users.map((user) => ({
        id: user.id.toString(),
        first_name: user.firstName || '',
        last_name: user.lastName || '',
        full_name: user.fullName || `${user.firstName} ${user.lastName}`,
        email: user.email || '',
        age: user.age || 0,
        province: user.province || '',
        commune: user.commune || null,
        phone_number: user.phoneNumber || null,
        is_email_verified: Boolean(user.isEmailVerified),
        is_active: Boolean(user.isActive),
        is_blocked: Boolean(user.isBlocked),
        created_at: user.createdAt.toUnixInteger(),
      }))

      const results = await typesenseClient
        .collections<UserDocument>(Collections.USERS)
        .documents()
        .import(documents, { action: 'upsert' })

      // Count successes and failures
      const failed = results.filter((r) => !r.success).length
      const succeeded = results.length - failed

      if (failed > 0) {
        this.logger.warning(`⚠️  Indexed ${succeeded} users, ${failed} failed`)
        
        // Show detailed error information
        results
          .filter((r) => !r.success)
          .forEach((r, index) => {
            const user = users[index]
            this.logger.error(`\nFailed to index user ID ${user?.id}:`)
            this.logger.error(`  Email: ${user?.email}`)
            this.logger.error(`  Error: ${r.error}`)
            
            // Log the problematic document for debugging
            if (r.document) {
              this.logger.error(`  Document: ${JSON.stringify(r.document, null, 2)}`)
            }
          })
      } else {
        this.logger.success(`✅ Successfully indexed all ${succeeded} users`)
      }
    } catch (error: any) {
      this.logger.error(`❌ Error indexing users: ${error.message}`)
      
      // Check if it's an import error with detailed results
      if (error.importResults) {
        this.logger.error('\nDetailed import errors:')
        error.importResults.forEach((result: any, index: number) => {
          if (!result.success) {
            this.logger.error(`\nUser ${index + 1}:`)
            this.logger.error(`  Error: ${result.error}`)
          }
        })
      }
    }
  }
}