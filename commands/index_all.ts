// commands/index_all.ts - NEW FILE
import { BaseCommand } from '@adonisjs/core/ace'
import { CommandOptions } from '@adonisjs/core/types/ace'

export default class IndexAll extends BaseCommand {
  static commandName = 'index:all'
  static description = 'Indexes all collections (events, users, registrations) into Typesense'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('🚀 Starting full indexing process...\n')

    // Index Events
    this.logger.info('📦 Indexing Events...')
    await this.kernel.exec('index:events', [])

    // Index Users
    this.logger.info('\n📦 Indexing Users...')
    await this.kernel.exec('index:users', [])

    // Index Registrations
    this.logger.info('\n📦 Indexing Registrations...')
    await this.kernel.exec('index:registrations', [])

    this.logger.success('\n✅ All collections indexed successfully!')
    this.logger.info('\n💡 Tip: Your search features are now fully operational')
  }
}