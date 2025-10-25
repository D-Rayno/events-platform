// database/seeders/main_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class MainSeeder extends BaseSeeder {
  private async seed(Seeder: { default: typeof BaseSeeder }) {
    await new Seeder.default(this.client).run()
  }

  async run() {
    console.log('🌱 Starting database seeding...\n')

    // Run seeders in order
    await this.seed(await import('#database/seeders/user_seeder'))
    await this.seed(await import('#database/seeders/event_seeder'))
    await this.seed(await import('#database/seeders/registration_seeder'))

    console.log('\n✨ Database seeding completed successfully!')
  }
}
