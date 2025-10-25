// database/seeders/registration_seeder.ts - Add duplicate prevention
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Event from '#models/event'
import Registration from '#models/registration'
import { DateTime } from 'luxon'
import string from '@adonisjs/core/helpers/string'

export default class RegistrationSeeder extends BaseSeeder {
  // This seeder should only run through MainSeeder
  static environment = ['development']

  async run() {
    // Check if registrations already exist
    const existingRegsCount = await Registration.query().count('* as total')
    const count = Number(existingRegsCount[0].$extras.total)

    if (count > 0) {
      console.log('ℹ️  Registrations already exist, skipping registration seeding')
      return
    }

    // Fetch all users (excluding admin) and published events
    const users = await User.query().where('is_admin', false).exec()
    const events = await Event.query()
      .whereIn('status', ['published', 'ongoing', 'finished'])
      .exec()

    if (users.length === 0 || events.length === 0) {
      console.log('⚠️  No users or events found. Please seed users and events first.')
      return
    }

    const registrations = []
    const usedCombinations = new Set<string>()

    // Each user registers for 1-5 events randomly
    for (const user of users) {
      const numRegistrations = Math.floor(Math.random() * 5) + 1
      const shuffledEvents = events.sort(() => Math.random() - 0.5)

      let registered = 0
      for (const event of shuffledEvents) {
        if (registered >= numRegistrations) break

        const combination = `${user.id}-${event.id}`
        if (usedCombinations.has(combination)) continue

        // Check age eligibility
        if (!event.isAgeEligible(user.age)) continue

        // Skip if event is full
        if (event.registeredCount >= event.capacity) continue

        usedCombinations.add(combination)

        const price = event.getPriceForAge(user.age)

        // Determine status based on event status
        let status: 'pending' | 'confirmed' | 'attended' | 'canceled'
        let attendedAt: DateTime | null = null

        if (event.status === 'finished') {
          // 80% attended, 15% confirmed, 5% canceled
          const rand = Math.random()
          if (rand < 0.8) {
            status = 'attended'
            attendedAt = event.startDate.plus({ hours: Math.random() * 2 })
          } else if (rand < 0.95) {
            status = 'confirmed'
          } else {
            status = 'canceled'
          }
        } else if (event.status === 'ongoing') {
          // 70% attended, 25% confirmed, 5% canceled
          const rand = Math.random()
          if (rand < 0.7) {
            status = 'attended'
            attendedAt = event.startDate.plus({ hours: Math.random() * 2 })
          } else if (rand < 0.95) {
            status = 'confirmed'
          } else {
            status = 'canceled'
          }
        } else {
          // Published events: 85% confirmed, 10% pending, 5% canceled
          const rand = Math.random()
          if (rand < 0.85) {
            status = 'confirmed'
          } else if (rand < 0.95) {
            status = 'pending'
          } else {
            status = 'canceled'
          }
        }

        // Only count non-canceled registrations
        if (status !== 'canceled') {
          event.registeredCount += 1
        }

        registrations.push({
          userId: user.id,
          eventId: event.id,
          status,
          qrCode: string.generateRandom(32),
          price,
          attendedAt,
          createdAt: event.startDate.minus({ days: Math.random() * 30 + 1 }),
        })

        registered++
      }
    }

    // Batch create registrations
    await Registration.createMany(registrations)

    // Update event registered counts
    for (const event of events) {
      await event.save()
    }

    console.log('✅ Registrations seeded successfully')
    console.log(`   - Total registrations: ${registrations.length}`)
    console.log(`   - Confirmed: ${registrations.filter((r) => r.status === 'confirmed').length}`)
    console.log(`   - Attended: ${registrations.filter((r) => r.status === 'attended').length}`)
    console.log(`   - Pending: ${registrations.filter((r) => r.status === 'pending').length}`)
    console.log(`   - Canceled: ${registrations.filter((r) => r.status === 'canceled').length}`)
  }
}
