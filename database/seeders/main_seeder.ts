// database/seeders/main_seeder.ts - FIXED
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import app from '@adonisjs/core/services/app'

export default class MainSeeder extends BaseSeeder {
  private async seed(Seeder: { default: typeof BaseSeeder }) {

    /**
     * Do not run when not in the "development" environment.
     * Only run in dev or when explicitly requested
     */
    if (!app.inDev) {
      console.warn('⚠️  Skipping seeder in production mode')
      return
    }

    await new Seeder.default(this.client).run()
  }

  async run() {
    console.log('🌱 Starting database seeding...\n')

    // Run seeders in order
    await this.seed(await import('#database/seeders/user_seeder'))
    await this.seed(await import('#database/seeders/event_seeder'))
    await this.seed(await import('#database/seeders/registration_seeder'))

    console.log('\n✨ Database seeding completed successfully!')
    console.log('📊 Summary:')
    console.log('   - 101 users (1 admin + 100 regular)')
    console.log('   - 30 events (mix of published, ongoing, finished)')
    console.log('   - ~300 registrations')
    console.log('\n🔐 Test credentials:')
    console.log('   Admin: admin@events.dz / Admin@123')
    console.log('   Users: user1@events.dz to user100@events.dz / Password@123')
  }
}