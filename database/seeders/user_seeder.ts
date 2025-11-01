// database/seeders/user_seeder.ts - Add environment check
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import { DateTime } from 'luxon'

export default class UserSeeder extends BaseSeeder {
  // This seeder should only run through MainSeeder
  static environment = ['production']

  async run() {
    const provinces = [
      'Alger',
      'Oran',
      'Constantine',
      'Annaba',
      'Blida',
      'Batna',
      'Sétif',
      'Tlemcen',
    ]

    const communes = {
      Alger: ['Bab El Oued', 'Kouba', 'Hussein Dey', 'Birtouta', 'Dar El Beida'],
      Oran: ['Es Senia', 'Bir El Djir', 'Arzew', 'Mers El Kébir'],
      Constantine: ['El Khroub', 'Ain Smara', 'Didouche Mourad', 'Hamma Bouziane'],
      Annaba: ['El Bouni', 'El Hadjar', 'Berrahal', 'Seraidi'],
      Blida: ['Boufarik', 'Larbaa', 'Meftah', 'Bougara'],
      Batna: ['Arris', 'Merouana', 'Barika', 'Tazoult'],
      Sétif: ['El Eulma', 'Bejaia', 'Ain Arnat', 'Ain Oulmene'],
      Tlemcen: ['Maghnia', 'Ouled Mimoun', 'Ghazaouet', 'Remchi'],
    }

    const firstNames = [
      'Mohamed',
      'Ahmed',
      'Fatima',
      'Amina',
      'Youcef',
      'Sarah',
      'Karim',
      'Asma',
      'Rachid',
      'Nadia',
      'Hamza',
      'Samia',
      'Amine',
      'Leila',
      'Sofiane',
      'Meriem',
      'Bilal',
      'Houda',
      'Riadh',
      'Wafa',
    ]

    const lastNames = [
      'Benali',
      'Brahim',
      'Cherif',
      'Djamel',
      'Fadel',
      'Guerfi',
      'Hamdi',
      'Kadri',
      'Mansouri',
      'Nouri',
      'Ouadi',
      'Salah',
      'Touati',
      'Younsi',
      'Zerrouki',
      'Amara',
      'Bouazza',
      'Chelbi',
      'Dridi',
      'Farsi',
    ]

    // Check if admin already exists
    const existingAdmin = await User.findBy('email', 'admin@events.dz')
    if (!existingAdmin) {
      // Create admin user
      await User.create({
        firstName: 'Admin',
        lastName: 'System',
        email: 'admin@events.dz',
        password: 'Admin@123',
        age: 30,
        province: 'Alger',
        commune: 'Kouba',
        phoneNumber: '+213555000000',
        avatarUrl: 'uploads/avatars/avatar-1.webp',
        isEmailVerified: true,
        emailVerifiedAt: DateTime.now(),
        isActive: true,
        isBlocked: false,
        isAdmin: true,
      })
    }

    // Check if users already exist
    const existingUsersCount = await User.query().where('is_admin', false).count('* as total')
    const count = Number(existingUsersCount[0].$extras.total)
    
    if (count > 0) {
      console.log('ℹ️  Users already exist, skipping user seeding')
      return
    }

    // Create 100 regular users (cycling through 30 avatar images)
    const users = []
    for (let i = 1; i <= 100; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
      const province = provinces[Math.floor(Math.random() * provinces.length)]
      const commune =
        communes[province as keyof typeof communes][
          Math.floor(Math.random() * communes[province as keyof typeof communes].length)
        ]
      const age = Math.floor(Math.random() * (65 - 16 + 1)) + 16
      const isVerified = Math.random() > 0.1

      // Cycle through 30 avatars (avatar-1.webp to avatar-30.webp)
      const avatarNumber = ((i - 1) % 30) + 1

      users.push({
        firstName,
        lastName,
        email: `user${i}@events.dz`,
        password: 'Password@123',
        age,
        province,
        commune,
        phoneNumber: `+21355${String(i).padStart(7, '0')}`,
        avatarUrl: `uploads/avatars/avatar-${avatarNumber}.webp`,
        isEmailVerified: isVerified,
        emailVerifiedAt: isVerified ? DateTime.now().minus({ days: Math.random() * 30 }) : null,
        isActive: true,
        isBlocked: Math.random() > 0.95,
        isAdmin: false,
      })
    }

    await User.createMany(users)

    console.log('✅ Users seeded successfully: 101 users created')
    console.log('   📸 Using 30 avatar images (cycling)')
  }
}