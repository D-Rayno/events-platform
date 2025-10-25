// app/controllers/events_controller.ts - COMPLETE REPLACEMENT
import type { HttpContext } from '@adonisjs/core/http'
import Event from '#models/event'
import Registration from '#models/registration'
import SearchService from '#services/search_service'

export default class EventController {
  /**
   * Affiche la liste des événements publics
   */
  async index({ request, inertia, auth }: HttpContext) {
    const page = request.input('page', 1)
    const search = request.input('search', '').trim()
    const category = request.input('category', '').trim()
    const province = request.input('province', '').trim()
    const eventType = request.input('eventType', '').trim()
    const gameType = request.input('gameType', '').trim()
    const difficulty = request.input('difficulty', '').trim()
    const user = auth.user

    // Try Typesense first
    const searchResult = await SearchService.searchEvents({
      search,
      category,
      province,
      eventType,
      gameType,
      difficulty,
      status: 'published',
      isPublic: true,
      page,
      perPage: 12,
    })

    let orderedEvents: Event[] = []
    let totalFound = 0
    let lastPage = 1

    if (searchResult) {
      // Typesense search successful
      const hits = searchResult.hits || []
      totalFound = searchResult.found || 0
      lastPage = Math.ceil(totalFound / 12)
      const eventIds = hits.map((hit) => parseInt(hit.document.id))

      if (eventIds.length > 0) {
        const dbEvents = await Event.query().whereIn('id', eventIds).exec()
        const eventMap = new Map(dbEvents.map((e) => [e.id, e]))
        orderedEvents = hits
          .map((hit) => eventMap.get(parseInt(hit.document.id))!)
          .filter(Boolean)
      }
    } else {
      // Fallback to database
      console.warn('[Events] Using database fallback for search')
      const result = await this.fallbackDatabaseSearch(
        page,
        search,
        category,
        province,
        eventType,
        gameType,
        difficulty
      )
      orderedEvents = result.events
      totalFound = result.total
      lastPage = result.lastPage
    }

    // Fetch user registrations
    let userRegistrations: number[] = []
    if (user) {
      const registrations = await Registration.query()
        .where('user_id', user.id)
        .whereIn('status', ['pending', 'confirmed', 'attended'])
        .select('event_id')

      userRegistrations = registrations.map((r) => r.eventId)
    }

    // Render with Inertia
    return inertia.render('events/index', {
      events: {
        data: orderedEvents.map((event) => ({
          ...event.serialize(),
          isRegistered: userRegistrations.includes(event.id),
        })),
        meta: {
          current_page: page,
          last_page: lastPage,
          total: totalFound,
          per_page: 12,
        },
      },
      filters: {
        category: category || '',
        search: search || '',
        province: province || '',
        eventType: eventType || '',
        gameType: gameType || '',
        difficulty: difficulty || '',
      },
    })
  }

  /**
   * Fallback database search when Typesense is unavailable
   */
  private async fallbackDatabaseSearch(
    page: number,
    search: string,
    category: string,
    province: string,
    eventType: string,
    gameType: string,
    difficulty: string
  ) {
    let query = Event.query()
      .where('status', 'published')
      .where('is_public', true)
      .orderBy('start_date', 'asc')

    if (search) {
      query = query.where((q) => {
        q.whereLike('name', `%${search}%`).orWhereLike('description', `%${search}%`)
      })
    }

    if (category) query = query.where('category', category)
    if (province) query = query.where('province', province)
    if (eventType) query = query.where('event_type', eventType)
    if (gameType) query = query.where('game_type', gameType)
    if (difficulty) query = query.where('difficulty', difficulty)

    const result = await query.paginate(page, 12)

    return {
      events: result.all(),
      total: result.total,
      lastPage: result.lastPage,
    }
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

    // Update and persist event status (if needed)
    event.updateStatus()
    await event.save()

    // Check if user is already registered
    let userRegistration = null
    if (user) {
      userRegistration = await Registration.query()
        .where('user_id', user.id)
        .where('event_id', event.id)
        .whereIn('status', ['pending', 'confirmed', 'attended'])
        .first()
    }

    return inertia.render('events/show', {
      event: {
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
    })
  }
}