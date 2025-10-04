import type { HttpContext } from '@adonisjs/core/http'
import Event from '#models/event'
import db from '@adonisjs/lucid/services/db'
import { createEventValidator } from '#validators/create_event'
import { DateTime } from 'luxon'
<<<<<<< HEAD
import Registration from '#models/registration'

export default class EventController {
  /**
   * Affiche la liste des événements publics
   */
  async index({ request, inertia, auth }: HttpContext) {
    const page = request.input('page', 1)
    const search = request.input('search')
    const category = request.input('category')
    const province = request.input('province')
    const eventType = request.input('eventType') // normal or game
    const gameType = request.input('gameType')
    const difficulty = request.input('difficulty')
    const user = auth.user

    let query = Event.query()
      .where('is_public', true)
      .where('status', 'published')
      .orderBy('start_date', 'asc')

=======

export default class EventController {
  /**
   * Liste tous les événements avec statistiques
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)
    const search = request.input('search')
    const category = request.input('category')
    const status = request.input('status') // 'upcoming', 'ongoing', 'finished', 'all'

    let query = Event.query()

    // Recherche
>>>>>>> 47214e9 (feat: admin api's & user profile management, events and registration for both web and api)
    if (search) {
      query = query.where((q) => {
        q.whereLike('name', `%${search}%`).orWhereLike('description', `%${search}%`)
      })
    }

<<<<<<< HEAD
=======
    // Filtrer par catégorie
>>>>>>> 47214e9 (feat: admin api's & user profile management, events and registration for both web and api)
    if (category) {
      query = query.where('category', category)
    }

<<<<<<< HEAD
    if (province) {
      query = query.where('province', province)
    }

    if (eventType) {
      query = query.where('event_type', eventType)
    }

    if (gameType) {
      query = query.where('game_type', gameType)
    }

    if (difficulty) {
      query = query.where('difficulty', difficulty)
    }

    const events = await query.paginate(page, 12)

    // Si l'utilisateur est connecté, récupérer ses inscriptions
    let userRegistrations: number[] = []
    if (user) {
      const registrations = await Registration.query()
        .where('user_id', user.id)
        .whereIn('status', ['pending', 'confirmed', 'attended'])
        .select('event_id')

      userRegistrations = registrations.map((r) => r.eventId)
    }

    return inertia.render('events/index', {
      events: {
        data: events.all().map((event) => ({
          id: event.id,
          name: event.name,
          description: event.description,
          location: event.location,
          province: event.province,
          commune: event.commune,
          startDate: event.startDate.toISO(),
          endDate: event.endDate.toISO(),
          capacity: event.capacity,
          registeredCount: event.registeredCount,
          availableSeats: event.availableSeats,
          imageUrl: event.imageUrl,
          category: event.category,
          basePrice: event.basePrice,
          isFull: event.isFull,
          canRegister: event.canRegister(),
          isRegistered: userRegistrations.includes(event.id),
          isUpcoming: event.isUpcoming(),
          isOngoing: event.isOngoing(),
          isFinished: event.isFinished(),
          // Game-specific fields
          eventType: event.eventType,
          gameType: event.gameType,
          difficulty: event.difficulty,
          difficultyBadge: event.getDifficultyBadge(),
          intensityBadge: event.getIntensityBadge(),
          durationMinutes: event.durationMinutes,
          allowsTeams: event.allowsTeams,
          teamRegistration: event.teamRegistration,
          minTeamSize: event.minTeamSize,
          maxTeamSize: event.maxTeamSize,
          availableTeamSlots: event.availableTeamSlots,
          prizePool: event.prizePool,
          gameSummary: event.getGameSummary(),
        })),
        meta: events.getMeta(),
      },
      filters: {
        category,
        search,
        province,
        eventType,
        gameType,
        difficulty,
      },
    })
  }

  /**
   * Affiche les détails d'un événement
   */
  async show({ params, inertia, auth, response, session }: HttpContext) {
    const user = auth.user

    const event = await Event.find(params.id)

    if (!event || !event.isPublic) {
      session.flash('error', "Cet événement n'existe pas ou n'est pas accessible.")
      return response.redirect('/events')
    }

    // Mettre à jour le statut si nécessaire
    event.updateStatus()
    await event.save()

    // Vérifier si l'utilisateur est inscrit
    let userRegistration = null
    if (user) {
      userRegistration = await Registration.query()
        .where('user_id', user.id)
        .where('event_id', event.id)
        .whereIn('status', ['pending', 'confirmed', 'attended'])
        .first()
    }

    // Check age eligibility if user is logged in
    const isAgeEligible = user ? event.isAgeEligible(user.age) : true
    const userPrice = user ? event.getPriceForAge(user.age) : event.basePrice

    return inertia.render('events/show', {
      event: {
=======
    // Filtrer par statut
    if (status && status !== 'all') {
      const now = DateTime.now()
      if (status === 'upcoming') {
        query = query.where('start_date', '>', now.toSQL())
      } else if (status === 'ongoing') {
        query = query.where('start_date', '<=', now.toSQL()).where('end_date', '>=', now.toSQL())
      } else if (status === 'finished') {
        query = query.where('end_date', '<', now.toSQL())
      }
    }

    const events = await query
      .withCount('registrations', (q) => {
        q.whereIn('status', ['confirmed', 'attended'])
      })
      .orderBy('start_date', 'desc')
      .paginate(page, limit)

    return response.ok({
      success: true,
      data: events.all().map((event) => ({
>>>>>>> 47214e9 (feat: admin api's & user profile management, events and registration for both web and api)
        id: event.id,
        name: event.name,
        description: event.description,
        location: event.location,
<<<<<<< HEAD
        province: event.province,
        commune: event.commune,
        startDate: event.startDate.toISO(),
        endDate: event.endDate.toISO(),
        capacity: event.capacity,
        registeredCount: event.registeredCount,
        availableSeats: event.availableSeats,
        imageUrl: event.imageUrl,
        category: event.category,
        tags: event.tags,
        basePrice: event.basePrice,
        youthPrice: event.youthPrice,
        seniorPrice: event.seniorPrice,
        minAge: event.minAge,
        maxAge: event.maxAge,
        status: event.status,
        requiresApproval: event.requiresApproval,
        registrationStartDate: event.registrationStartDate?.toISO(),
        registrationEndDate: event.registrationEndDate?.toISO(),
        isFull: event.isFull,
        canRegister: event.canRegister(),
        isUpcoming: event.isUpcoming(),
        isOngoing: event.isOngoing(),
        isFinished: event.isFinished(),

        // Game-specific fields
        eventType: event.eventType,
        isGameEvent: event.isGameEvent,
        gameType: event.gameType,
        difficulty: event.difficulty,
        difficultyBadge: event.getDifficultyBadge(),
        durationMinutes: event.durationMinutes,
        physicalIntensity: event.physicalIntensity,
        intensityBadge: event.getIntensityBadge(),
        allowsTeams: event.allowsTeams,
        teamRegistration: event.teamRegistration,
        minTeamSize: event.minTeamSize,
        maxTeamSize: event.maxTeamSize,
        maxTeams: event.maxTeams,
        availableTeamSlots: event.availableTeamSlots,
        autoTeamFormation: event.autoTeamFormation,
        requiredItems: event.requiredItems,
        prohibitedItems: event.prohibitedItems,
        safetyRequirements: event.safetyRequirements,
        waiverRequired: event.waiverRequired,
        rulesDocumentUrl: event.rulesDocumentUrl,
        checkInTime: event.checkInTime?.toISO(),
        isCheckInOpen: event.isCheckInOpen(),
        briefingDurationMinutes: event.briefingDurationMinutes,
        totalDurationMinutes: event.totalDurationMinutes,
        prizeInformation: event.prizeInformation,
        prizePool: event.prizePool,
        winnerAnnouncement: event.winnerAnnouncement?.toISO(),
        photographyAllowed: event.photographyAllowed,
        liveStreaming: event.liveStreaming,
        specialInstructions: event.specialInstructions,
        gameSummary: event.getGameSummary(),
      },
      registration: userRegistration
        ? {
            id: userRegistration.id,
            status: userRegistration.status,
            createdAt: userRegistration.createdAt.toISO(),
          }
        : null,
      isRegistered: !!userRegistration,
      userAge: user?.age,
      isAgeEligible,
      userPrice,
    })
  }
=======
        startDate: event.startDate.toISO(),
        endDate: event.endDate.toISO(),
        capacity: event.capacity,
        availableSeats: event.availableSeats,
        registrationsCount: event.$extras.registrations_count || 0,
        imageUrl: event.imageUrl,
        category: event.category,
        isActive: event.isActive,
        isFeatured: event.isFeatured,
        isUpcoming: event.isUpcoming(),
        isOngoing: event.isOngoing(),
        isFinished: event.isFinished(),
        createdAt: event.createdAt.toISO(),
      })),
      meta: events.getMeta(),
    })
  }

  /**
   * Affiche les détails d'un événement avec toutes les inscriptions
   */
  async show({ params, response }: HttpContext) {
    const event = await Event.query()
      .where('id', params.id)
      .preload('registrations', (q) => {
        q.preload('user').orderBy('created_at', 'desc')
      })
      .first()

    if (!event) {
      return response.notFound({
        error: 'Événement non trouvé',
        message: "Cet événement n'existe pas.",
      })
    }

    // Statistiques des inscriptions
    const stats = {
      total: event.registrations.length,
      confirmed: event.registrations.filter((r) => r.status === 'confirmed').length,
      attended: event.registrations.filter((r) => r.status === 'attended').length,
      canceled: event.registrations.filter((r) => r.status === 'canceled').length,
    }

    return response.ok({
      success: true,
      data: {
        id: event.id,
        name: event.name,
        description: event.description,
        location: event.location,
        startDate: event.startDate.toISO(),
        endDate: event.endDate.toISO(),
        capacity: event.capacity,
        availableSeats: event.availableSeats,
        imageUrl: event.imageUrl,
        category: event.category,
        isActive: event.isActive,
        isFeatured: event.isFeatured,
        isUpcoming: event.isUpcoming(),
        isOngoing: event.isOngoing(),
        isFinished: event.isFinished(),
        createdAt: event.createdAt.toISO(),
        stats,
        registrations: event.registrations.map((reg) => ({
          id: reg.id,
          status: reg.status,
          qrCode: reg.qrCode,
          attendedAt: reg.attendedAt?.toISO(),
          createdAt: reg.createdAt.toISO(),
          user: {
            id: reg.user.id,
            firstName: reg.user.firstName,
            lastName: reg.user.lastName,
            email: reg.user.email,
          },
        })),
      },
    })
  }

>>>>>>> 47214e9 (feat: admin api's & user profile management, events and registration for both web and api)
  /**
   * Créer un nouvel événement
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createEventValidator)

      const event = await Event.create({
        name: data.name,
        description: data.description,
        location: data.location,
        province: data.province,
        commune: data.commune,
        startDate: DateTime.fromJSDate(data.startDate),
        endDate: DateTime.fromJSDate(data.endDate),
        capacity: data.capacity,
        registeredCount: 0,
        minAge: data.minAge || 13,
        maxAge: data.maxAge,
        basePrice: data.basePrice || 0,
        youthPrice: data.youthPrice,
        seniorPrice: data.seniorPrice,
        category: data.category,
        tags: data.tags || [],
        status: 'draft',
        isPublic: data.isPublic !== undefined ? data.isPublic : true,
        requiresApproval: data.requiresApproval || false,
<<<<<<< HEAD
        registrationStartDate: data.registrationStartDate
          ? DateTime.fromJSDate(data.registrationStartDate)
          : undefined,
        registrationEndDate: data.registrationEndDate
          ? DateTime.fromJSDate(data.registrationEndDate)
          : undefined,
=======
        registrationStartDate: data.registrationStartDate ? DateTime.fromJSDate(data.registrationStartDate) : undefined,
        registrationEndDate: data.registrationEndDate ? DateTime.fromJSDate(data.registrationEndDate) : undefined,
>>>>>>> 47214e9 (feat: admin api's & user profile management, events and registration for both web and api)
        imageUrl: null,
      })

      return response.created({
        success: true,
        message: 'Événement créé avec succès',
        data: {
          id: event.id,
          name: event.name,
        },
      })
    } catch (error) {
      console.error('Erreur création événement:', error)
      return response.internalServerError({
        error: 'Erreur serveur',
        message: 'Une erreur est survenue lors de la création.',
      })
    }
  }

  /**
   * Mettre à jour un événement
   */
  async update({ params, request, response }: HttpContext) {
    const event = await Event.find(params.id)

    if (!event) {
      return response.notFound({
        error: 'Événement non trouvé',
        message: "Cet événement n'existe pas.",
      })
    }

    try {
      const data = request.only([
        'name',
        'description',
        'location',
        'startDate',
        'endDate',
        'capacity',
        'imageUrl',
        'category',
        'isActive',
        'isFeatured',
      ])

      event.merge(data)
      await event.save()

      return response.ok({
        success: true,
        message: 'Événement mis à jour avec succès',
        data: {
          id: event.id,
          name: event.name,
        },
      })
    } catch (error) {
      console.error('Erreur mise à jour événement:', error)
      return response.internalServerError({
        error: 'Erreur serveur',
        message: 'Une erreur est survenue lors de la mise à jour.',
      })
    }
  }

  /**
   * Supprimer un événement
   */
  async destroy({ params, response }: HttpContext) {
    const event = await Event.find(params.id)

    if (!event) {
      return response.notFound({
        error: 'Événement non trouvé',
        message: "Cet événement n'existe pas.",
      })
    }

    try {
      // Vérifier s'il y a des inscriptions actives
      const activeRegistrations = await db
        .from('registrations')
        .where('event_id', event.id)
        .whereIn('status', ['confirmed', 'attended'])
        .count('* as total')

      const count = activeRegistrations[0].total

      if (count > 0) {
        return response.badRequest({
          error: 'Suppression impossible',
          message: `Cet événement a ${count} inscription(s) active(s). Veuillez les gérer avant de supprimer l'événement.`,
        })
      }

      await event.delete()

      return response.ok({
        success: true,
        message: 'Événement supprimé avec succès',
      })
    } catch (error) {
      console.error('Erreur suppression événement:', error)
      return response.internalServerError({
        error: 'Erreur serveur',
        message: 'Une erreur est survenue lors de la suppression.',
      })
    }
  }

  /**
   * Obtenir les statistiques globales des événements
   */
  async stats({ response }: HttpContext) {
    const now = DateTime.now()

    const totalEvents = await Event.query().count('* as total').first()
<<<<<<< HEAD
    const upcomingEvents = await Event.query()
      .where('start_date', '>', now.toSQL())
      .count('* as total')
      .first()
    const ongoingEvents = await Event.query()
      .where('start_date', '<=', now.toSQL())
      .where('end_date', '>=', now.toSQL())
      .count('* as total')
      .first()
    const finishedEvents = await Event.query()
      .where('end_date', '<', now.toSQL())
      .count('* as total')
      .first()
=======
    const upcomingEvents = await Event.query().where('start_date', '>', now.toSQL()).count('* as total').first()
    const ongoingEvents = await Event.query().where('start_date', '<=', now.toSQL()).where('end_date', '>=', now.toSQL()).count('* as total').first()
    const finishedEvents = await Event.query().where('end_date', '<', now.toSQL()).count('* as total').first()
>>>>>>> 47214e9 (feat: admin api's & user profile management, events and registration for both web and api)

    return response.ok({
      success: true,
      data: {
        total: Number(totalEvents?.$extras.total ?? 0),
        upcoming: Number(upcomingEvents?.$extras.total ?? 0),
        ongoing: Number(ongoingEvents?.$extras.total ?? 0),
        finished: Number(finishedEvents?.$extras.total ?? 0),
      },
    })
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 47214e9 (feat: admin api's & user profile management, events and registration for both web and api)
