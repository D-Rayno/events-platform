// commands/setup_typesense.ts
import { BaseCommand } from '@adonisjs/core/ace'
import typesenseClient from '#services/typesense_service'
import typesenseConfig from '#config/typesense'
import { Collections } from '#services/typesense_service'
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections.js'
import { flags } from '@adonisjs/core/ace'

/**
 * CLI Command: Setup all Typesense collections
 *
 * Usage:
 *   node ace setup:typesense
 *   node ace setup:typesense --collection=events
 */
export default class SetupTypesense extends BaseCommand {
  static commandName = 'setup:typesense'
  static description = 'Sets up Typesense collections for events, users, and registrations'

  @flags.string({ description: 'Specific collection to setup (events, users, registrations)' })
  declare collection?: string

  @flags.boolean({ description: 'Force recreate collections without prompting' })
  declare force: boolean

  async run() {
    if (!typesenseConfig.enabled) {
      this.logger.warning(
        '⚠️  Typesense is disabled. Enable it in .env with TYPESENSE_ENABLED=true'
      )
      return
    }

    this.logger.info('🔧 Setting up Typesense collections...')

    const schemas = this.getSchemas()
    const collectionsToSetup = this.collection
      ? [this.collection]
      : Object.values(Collections)

    for (const collectionName of collectionsToSetup) {
      const schema = schemas[collectionName as Collections]
      if (!schema) {
        this.logger.error(`❌ Unknown collection: ${collectionName}`)
        continue
      }

      await this.setupCollection(collectionName, schema)
    }

    this.logger.success('✅ All collections setup complete!')
    this.logger.info('💡 Run indexing commands to populate collections:')
    this.logger.info('   - node ace index:events')
    this.logger.info('   - node ace index:users')
    this.logger.info('   - node ace index:registrations')
    this.logger.info('   - node ace index:all (to index everything)')
  }

  private async setupCollection(name: string, schema: CollectionCreateSchema) {
    this.logger.info(`\n📦 Setting up collection: ${name}`)

    try {
      // Check if collection exists
      try {
        const existing = await typesenseClient.collections(name).retrieve()
        this.logger.warning(`⚠️  Collection "${name}" already exists`)
        this.logger.info(
          `Current fields: ${existing.fields?.map((f) => f.name).join(', ')}`
        )

        let shouldRecreate = this.force
        if (!shouldRecreate) {
          shouldRecreate = await this.prompt.confirm(
            `Delete and recreate "${name}" collection? (This will delete all indexed data)`
          )
        }

        if (shouldRecreate) {
          await typesenseClient.collections(name).delete()
          this.logger.info(`🗑️  Deleted existing collection: ${name}`)
        } else {
          this.logger.info(`✅ Keeping existing collection: ${name}`)
          return
        }
      } catch (error: any) {
        if (error.httpStatus !== 404) {
          throw error
        }
        // Collection doesn't exist, continue with creation
      }

      await typesenseClient.collections().create(schema)
      this.logger.success(`✅ Collection "${name}" created successfully`)
    } catch (error: any) {
      this.logger.error(`❌ Error setting up "${name}": ${error.message}`)
      if (error.httpStatus) {
        this.logger.error(`HTTP Status: ${error.httpStatus}`)
      }
    }
  }

  private getSchemas(): Record<Collections, CollectionCreateSchema> {
    return {
      [Collections.EVENTS]: {
        name: Collections.EVENTS,
        fields: [
          { name: 'id', type: 'string' },
          { name: 'name', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'category', type: 'string', facet: true },
          { name: 'province', type: 'string', facet: true },
          { name: 'commune', type: 'string', facet: true, optional: true },
          { name: 'start_date', type: 'int64', sort: true },
          { name: 'status', type: 'string', facet: true },
          { name: 'is_public', type: 'bool', facet: true },
          { name: 'event_type', type: 'string', facet: true, optional: true },
          { name: 'game_type', type: 'string', facet: true, optional: true },
          { name: 'difficulty', type: 'string', facet: true, optional: true },
        ],
        default_sorting_field: 'start_date',
      },

      [Collections.USERS]: {
        name: Collections.USERS,
        fields: [
          { name: 'id', type: 'string' },
          { name: 'first_name', type: 'string' },
          { name: 'last_name', type: 'string' },
          { name: 'full_name', type: 'string' },
          { name: 'email', type: 'string' },
          { name: 'age', type: 'int32', facet: true },
          { name: 'province', type: 'string', facet: true },
          { name: 'commune', type: 'string', facet: true, optional: true },
          { name: 'phone_number', type: 'string', optional: true },
          { name: 'is_email_verified', type: 'bool', facet: true },
          { name: 'is_active', type: 'bool', facet: true },
          { name: 'is_blocked', type: 'bool', facet: true },
          { name: 'created_at', type: 'int64', sort: true },
        ],
        default_sorting_field: 'created_at',
      },

      [Collections.REGISTRATIONS]: {
        name: Collections.REGISTRATIONS,
        fields: [
          { name: 'id', type: 'string' },
          { name: 'user_id', type: 'int32', facet: true },
          { name: 'event_id', type: 'int32', facet: true },
          { name: 'user_name', type: 'string' },
          { name: 'user_email', type: 'string' },
          { name: 'event_name', type: 'string' },
          { name: 'event_location', type: 'string' },
          { name: 'status', type: 'string', facet: true },
          { name: 'qr_code', type: 'string' },
          { name: 'created_at', type: 'int64', sort: true },
          { name: 'event_start_date', type: 'int64', sort: true },
        ],
        default_sorting_field: 'created_at',
      },
    }
  }
}