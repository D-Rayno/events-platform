// app/controllers/events_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Event from '#models/event'
import Registration from '#models/registration'
import typesenseClient from '#services/typesense_service'
import type { EventDocument } from '#services/typesense_service'

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

    // Build dynamic Typesense filter query
    let filterBy = 'status:published && is_public:true'
    if (category) filterBy += ` && category:${category}`
    if (province) filterBy += ` && province:${province}`
    if (eventType) filterBy += ` && event_type:${eventType}`
    if (gameType) filterBy += ` && game_type:${gameType}`
    if (difficulty) filterBy += ` && difficulty:${difficulty}`

    const searchParams = {
      q: search || '*',
      query_by: 'name,description',
      filter_by: filterBy,
      sort_by: 'start_date:asc',
      page,
      per_page: 12,
    }

    // Perform search in Typesense
    const searchResults = await typesenseClient
      .collections<EventDocument>('events')
      .documents()
      .search(searchParams)

    const hits = searchResults.hits || []
    const found = searchResults.found || 0
    const lastPage = Math.ceil(found / 12)
    const eventIds = hits.map((hit) => parseInt(hit.document.id))

    // Get events from the database matching Typesense results
    const dbEvents = await Event.query().whereIn('id', eventIds).exec()
    const eventMap = new Map(dbEvents.map((e) => [e.id, e]))
    const orderedEvents = hits
      .map((hit) => eventMap.get(parseInt(hit.document.id))!)
      .filter(Boolean)

    // Fetch user registrations
    let userRegistrations: number[] = []
    if (user) {
      const registrations = await Registration.query()
        .where('user_id', user.id)
        .whereIn('status', ['pending', 'confirmed', 'attended'])
        .select('event_id')

      userRegistrations = registrations.map((r) => r.eventId)
    }

    // Render with Inertia, using ordered events
    return inertia.render('events/index', {
      events: {
        data: orderedEvents.map((event) => ({
          ...event.serialize(),
          isRegistered: userRegistrations.includes(event.id),
        })),
        meta: {
          current_page: page,
          last_page: lastPage,
          total: found,
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
