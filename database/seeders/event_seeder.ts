// database/seeders/event_seeder.ts - Add environment check and duplicate prevention
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Event from '#models/event'
import { DateTime } from 'luxon'

export default class EventSeeder extends BaseSeeder {
  // This seeder should only run through MainSeeder
  static environment = ['development']

  async run() {
    // Check if events already exist
    const existingEventsCount = await Event.query().count('* as total')
    const count = Number(existingEventsCount[0].$extras.total)
    
    if (count > 0) {
      console.log('ℹ️  Events already exist, skipping event seeding')
      return
    }

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

    const categories = ['sport', 'culture', 'education', 'technology', 'entertainment', 'gaming']

    const eventTypes = ['tournament', 'challenge', 'escape-room', 'competition', null]
    const gameTypes = [
      'squid-game',
      'werewolf',
      'escape-room',
      'treasure-hunt',
      'obstacle-course',
      null,
    ]
    const difficulties: Array<'easy' | 'medium' | 'hard' | 'extreme' | null> = [
      'easy',
      'medium',
      'hard',
      'extreme',
      null,
    ]
    const intensities: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high']
    const teamRegistrations: Array<'individual' | 'team' | 'both'> = ['individual', 'team', 'both']

    const eventNames = {
      sport: [
        'Marathon de la Ville',
        'Tournoi de Football Inter-Quartiers',
        'Challenge Fitness 2025',
        'Course Nocturne',
        'Compétition de Natation',
      ],
      culture: [
        'Festival de Musique Andalouse',
        "Exposition d'Art Contemporain",
        'Journée du Patrimoine',
        'Spectacle de Danse Traditionnelle',
        'Concert Symphonique',
      ],
      education: [
        'Conférence Tech Innovation',
        'Atelier Entrepreneuriat',
        "Salon de l'Éducation",
        'Formation Leadership',
        'Hackathon Universitaire',
      ],
      technology: [
        'DevFest 2025',
        'AI Summit',
        'Startup Weekend',
        'Workshop Cybersécurité',
        'Tech Meetup',
      ],
      entertainment: [
        'Festival du Film',
        'Soirée Stand-Up Comedy',
        'Concert en Plein Air',
        'Festival Gastronomique',
        'Marché Nocturne',
      ],
      gaming: [
        'Squid Game Challenge',
        'Escape Room Tournament',
        'Werewolf Championship',
        'Treasure Hunt Adventure',
        'Obstacle Course Extreme',
      ],
    }

    const descriptions = {
      sport:
        'Rejoignez-nous pour une expérience sportive inoubliable. Que vous soyez débutant ou athlète confirmé, cet événement est fait pour vous. Encadrement professionnel garanti.',
      culture:
        'Découvrez la richesse de notre patrimoine culturel. Un moment unique pour célébrer nos traditions et notre histoire à travers des performances exceptionnelles.',
      education:
        'Développez vos compétences et élargissez vos horizons. Des experts partageront leur savoir-faire et leurs expériences pour vous aider à progresser.',
      technology:
        "Plongez dans l'univers de la technologie et de l'innovation. Networking, démonstrations et conférences vous attendent pour booster votre carrière.",
      entertainment:
        'Passez un moment de détente et de plaisir en famille ou entre amis. Animations, spectacles et surprises au programme !',
      gaming:
        "Testez vos limites dans des défis inspirés des jeux les plus populaires. Stratégie, courage et travail d'équipe seront vos meilleurs alliés.",
    }

    const locations = {
      Alger: ['Stade 5 Juillet', 'Palais de la Culture', 'Centre de Conventions', "Jardin d'Essai"],
      Oran: ['Stade Ahmed Zabana', 'Théâtre Régional', 'Palais des Congrès', 'Front de Mer'],
      Constantine: [
        'Stade Benabdelmalek',
        'Palais de la Culture',
        'Place des Martyrs',
        'Parc Zoologique',
      ],
      Annaba: ['Stade du 19 Mai', 'Théâtre Azzedine Medjoubi', 'Basilique Saint-Augustin', 'Plage'],
      Blida: ['Stade Mustapha Tchaker', 'Maison de la Culture', 'Jardin Public', 'Centre-Ville'],
      Batna: ['Stade du 1er Novembre', 'Maison de la Culture', 'Place de la Liberté', 'Parc'],
      Sétif: ['Stade du 8 Mai', 'Palais de la Culture', 'Centre Commercial', 'Jardin Public'],
      Tlemcen: [
        'Stade Akid Lotfi',
        'Palais de la Culture',
        'Grande Mosquée',
        'Plateau Lalla Setti',
      ],
    }

    const now = DateTime.now()

    // Create 30 diverse events
    for (let i = 1; i <= 30; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)]
      const province = provinces[Math.floor(Math.random() * provinces.length)]
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
      const isGameEvent = eventType !== null

      // Generate realistic dates
      const daysOffset = Math.floor(Math.random() * 180) - 30
      const startDate = now.plus({ days: daysOffset })
      const duration = Math.floor(Math.random() * 5) + 1
      const endDate = startDate.plus({ days: duration })

      // Registration period
      const regStartDays = Math.floor(Math.random() * 30) + 7
      const registrationStartDate = startDate.minus({ days: regStartDays })
      const registrationEndDate = startDate.minus({ days: 1 })

      // Determine status based on dates
      let status: 'draft' | 'published' | 'ongoing' | 'finished' | 'cancelled'
      if (now < startDate) {
        status = Math.random() > 0.2 ? 'published' : 'draft'
      } else if (now >= startDate && now <= endDate) {
        status = 'ongoing'
      } else {
        status = 'finished'
      }

      const capacity = Math.floor(Math.random() * 500) + 50
      const registeredCount =
        status === 'published' ? Math.floor(Math.random() * capacity * 0.8) : 0

      const eventName =
        eventNames[category as keyof typeof eventNames][
          Math.floor(Math.random() * eventNames[category as keyof typeof eventNames].length)
        ]

      // Create tags array properly
      const eventTags = [
        category,
        province.toLowerCase(),
        eventName.split(' ')[0].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      ]

      await Event.create({
        name: `${eventName} ${i}`,
        description: descriptions[category as keyof typeof descriptions],
        imageUrl: `uploads/events/event-${i}.webp`,
        location:
          locations[province as keyof typeof locations][
            Math.floor(Math.random() * locations[province as keyof typeof locations].length)
          ],
        province,
        commune: province,
        startDate,
        endDate,
        capacity,
        registeredCount,
        minAge: [13, 16, 18][Math.floor(Math.random() * 3)],
        maxAge: Math.random() > 0.7 ? [35, 50, 60][Math.floor(Math.random() * 3)] : null,
        basePrice: Math.floor(Math.random() * 5000) + 500,
        youthPrice: Math.random() > 0.5 ? Math.floor(Math.random() * 3000) + 300 : null,
        seniorPrice: Math.random() > 0.5 ? Math.floor(Math.random() * 2000) + 200 : null,
        status,
        isPublic: Math.random() > 0.1,
        requiresApproval: Math.random() > 0.8,
        category,
        tags: eventTags,
        registrationStartDate,
        registrationEndDate,
        isActive: true,
        isFeatured: Math.random() > 0.8,

        // Game-specific fields
        eventType: isGameEvent ? eventType : null,
        gameType: isGameEvent
          ? gameTypes[Math.floor(Math.random() * (gameTypes.length - 1))]
          : null,
        difficulty: isGameEvent
          ? difficulties[Math.floor(Math.random() * (difficulties.length - 1))]
          : null,
        durationMinutes: isGameEvent ? [60, 90, 120, 180][Math.floor(Math.random() * 4)] : null,
        physicalIntensity: isGameEvent
          ? intensities[Math.floor(Math.random() * intensities.length)]
          : 'medium',
        allowsTeams: isGameEvent && Math.random() > 0.5,
        teamRegistration: isGameEvent
          ? teamRegistrations[Math.floor(Math.random() * 3)]
          : 'individual',
        minTeamSize:
          isGameEvent && Math.random() > 0.5 ? [2, 3, 4][Math.floor(Math.random() * 3)] : null,
        maxTeamSize:
          isGameEvent && Math.random() > 0.5
            ? [5, 6, 8, 10][Math.floor(Math.random() * 4)]
            : null,
        maxTeams:
          isGameEvent && Math.random() > 0.5 ? [10, 20, 30][Math.floor(Math.random() * 3)] : null,
        autoTeamFormation: isGameEvent && Math.random() > 0.7,
        
        // JSON arrays
        requiredItems: isGameEvent ? ['Comfortable shoes', 'Water bottle', 'ID Card'] : null,
        prohibitedItems: isGameEvent ? ['Phones', 'Cameras', 'Sharp objects'] : null,
        safetyRequirements: isGameEvent
          ? ['Medical certificate', 'Liability waiver', 'Emergency contact']
          : null,
        
        waiverRequired: isGameEvent && Math.random() > 0.5,
        rulesDocumentUrl: null,
        checkInTime: isGameEvent ? startDate.minus({ hours: 1 }) : null,
        briefingDurationMinutes: isGameEvent ? [15, 30, 45][Math.floor(Math.random() * 3)] : null,
        prizeInformation: isGameEvent && Math.random() > 0.6 ? 'Cash prizes and trophies' : null,
        prizePool:
          isGameEvent && Math.random() > 0.6 ? Math.floor(Math.random() * 50000) + 10000 : null,
        winnerAnnouncement: isGameEvent ? endDate.plus({ hours: 2 }) : null,
        photographyAllowed: Math.random() > 0.3,
        liveStreaming: isGameEvent && Math.random() > 0.7,
        specialInstructions: isGameEvent ? 'Arrive 30 minutes early for registration' : null,
      })
    }

    const events = await Event.all()

    console.log('✅ Events seeded successfully: 30 events created')
    console.log(`   - Published: ${events.filter((e) => e.status === 'published').length}`)
    console.log(`   - Ongoing: ${events.filter((e) => e.status === 'ongoing').length}`)
    console.log(`   - Finished: ${events.filter((e) => e.status === 'finished').length}`)
    console.log(`   - Game events: ${events.filter((e) => e.eventType !== null).length}`)
    console.log('   📸 Using 30 event images')
  }
}