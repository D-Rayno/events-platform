// app/controllers/events_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Event from '#models/event'
import Registration from '#models/registration'

export default class EventController {
  /**
   * Affiche la liste des événements publics
   */
  async index({ request, inertia, auth }: HttpContext) {
    const page = request.input('page', 1)
    const search = request.input('search', '')
    const category = request.input('category', '')
    const province = request.input('province', '')
    const user = auth.user

    let query = Event.query()
      .where('is_public', true)
      .where('status', 'published')
      .orderBy('start_date', 'asc')

    // FIX: Remove COLLATE from search to fix charset issue
    if (search && search.trim()) {
      query = query.where((q) => {
        q.whereLike('name', `%${search}%`)
          .orWhereLike('description', `%${search}%`)
      })
    }

    if (category && category.trim()) {
      query = query.where('category', category)
    }

    if (province && province.trim()) {
      query = query.where('province', province)
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
        })),
        meta: events.getMeta(),
      },
      filters: {
        category: category || '',
        search: search || '',
        province: province || '',
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

    event.updateStatus()
    await event.save()

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