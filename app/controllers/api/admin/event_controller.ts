// File: app/controllers/api/admin/event_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

// Models
import Event from '#models/event'
import Registration from '#models/registration'

// Services & Validators
import typesenseClient, { EventDocument } from '#services/typesense_service'
import { createEventValidator } from '#validators/create_event'

export default class EventController {
  /**
   * ------------------------------------------------------------
   * INDEX - List published & public events (Typesense search)
   * ------------------------------------------------------------
   */
  async index({ request, inertia, auth }: HttpContext) {
    const user = auth.user
    const page = Number(request.input('page', 1))
    const search = (request.input('search', '') as string).trim()

    // Filters
    const filters = {
      category: request.input('category', ''),
      province: request.input('province', ''),
      eventType: request.input('eventType', ''),
      gameType: request.input('gameType', ''),
      difficulty: request.input('difficulty', ''),
    }

    // Build Typesense filter query dynamically
    let filterBy = 'status:published && is_public:true'
    for (const [key, value] of Object.entries(filters)) {
      if (value) filterBy += ` && ${key}:${value}`
    }

    const searchParams = {
      q: search || '*',
      query_by: 'name,description',
      filter_by: filterBy,
      sort_by: 'start_date:asc',
      page,
      per_page: 12,
    }

    // Execute Typesense search
    const searchResults = await typesenseClient
      .collections<EventDocument>('events')
      .documents()
      .search(searchParams)

    const hits = searchResults.hits || []
    const found = searchResults.found || 0
    const lastPage = Math.ceil(found / 12)

    // Extract event IDs & retrieve from DB
    const eventIds = hits.map((hit) => Number(hit.document.id))
    const dbEvents = eventIds.length
      ? await Event.query().whereIn('id', eventIds)
      : []

    // Preserve order as in Typesense
    const eventMap = new Map(dbEvents.map((e) => [e.id, e]))
    const orderedEvents = hits
      .map((hit) => eventMap.get(Number(hit.document.id))!)
      .filter(Boolean)

    // Retrieve user registrations (for badges like "registered")
    let userRegistrations: number[] = []
    if (user) {
      const regs = await Registration.query()
        .where('user_id', user.id)
        .whereIn('status', ['pending', 'confirmed', 'attended'])
        .select('event_id')
      userRegistrations = regs.map((r) => r.eventId)
    }

    return inertia.render('events/index', {
      events: {
        data: orderedEvents.map((event) => ({
          id: event.id,
          name: event.name,
          description: event.description,
          province: event.province,
          startDate: event.startDate?.toISO(),
          endDate: event.endDate?.toISO(),
          category: event.category,
          imageUrl: event.imageUrl,
          isRegistered: userRegistrations.includes(event.id),
        })),
        meta: {
          current_page: page,
          last_page: lastPage,
          total: found,
          per_page: 12,
        },
      },
      filters,
    })
  }

  /**
   * ------------------------------------------------------------
   * SHOW - Display single event details
   * ------------------------------------------------------------
   */
  async show({ params, inertia, auth, response, session }: HttpContext) {
    const user = auth.user
    const event = await Event.find(params.id)

    if (!event || !event.isPublic) {
      session.flash('error', "Cet événement n'existe pas ou n'est pas accessible.")
      return response.redirect('/events')
    }

    await event.updateStatus()
    await event.save()

    const userRegistration = user
      ? await Registration.query()
          .where('user_id', user.id)
          .where('event_id', event.id)
          .whereIn('status', ['pending', 'confirmed', 'attended'])
          .first()
      : null

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
        category: event.category,
        capacity: event.capacity,
        registeredCount: event.registeredCount,
        availableSeats: event.availableSeats,
        basePrice: event.basePrice,
        imageUrl: event.imageUrl,
        isFull: event.isFull,
        isUpcoming: event.isUpcoming(),
        isOngoing: event.isOngoing(),
        isFinished: event.isFinished(),
        // Game metadata
        eventType: event.eventType,
        gameType: event.gameType,
        difficulty: event.difficulty,
        difficultyBadge: event.getDifficultyBadge(),
        intensityBadge: event.getIntensityBadge(),
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

  /**
   * ------------------------------------------------------------
   * STORE - Create new event
   * ------------------------------------------------------------
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
        category: data.category,
        minAge: data.minAge,
        maxAge: data.maxAge,
        basePrice: data.basePrice,
        youthPrice: data.youthPrice,
        seniorPrice: data.seniorPrice,
        requiresApproval: data.requiresApproval,
        registrationStartDate: data.registrationStartDate
          ? DateTime.fromJSDate(data.registrationStartDate)
          : undefined,
        registrationEndDate: data.registrationEndDate
          ? DateTime.fromJSDate(data.registrationEndDate)
          : undefined,
        imageUrl: null,
      })

      return response.created({
        success: true,
        message: 'Événement créé avec succès',
        data: { id: event.id, name: event.name },
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
   * ------------------------------------------------------------
   * UPDATE - Update existing event
   * ------------------------------------------------------------
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
        data: { id: event.id, name: event.name },
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
   * ------------------------------------------------------------
   * DESTROY - Delete an event safely
   * ------------------------------------------------------------
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
      const activeRegistrations = await db
        .from('registrations')
        .where('event_id', event.id)
        .whereIn('status', ['confirmed', 'attended'])
        .count('* as total')

      const count = activeRegistrations[0].total
      if (count > 0) {
        return response.badRequest({
          error: 'Suppression impossible',
          message: `Cet événement a ${count} inscription(s) active(s). Veuillez les gérer avant suppression.`,
        })
      }

      await event.delete()
      return response.ok({ success: true, message: 'Événement supprimé avec succès' })
    } catch (error) {
      console.error('Erreur suppression événement:', error)
      return response.internalServerError({
        error: 'Erreur serveur',
        message: 'Une erreur est survenue lors de la suppression.',
      })
    }
  }

  /**
   * ------------------------------------------------------------
   * STATS - Global statistics of all events
   * ------------------------------------------------------------
   */
  async stats({ response }: HttpContext) {
    const now = DateTime.now()

    const totalEvents = await Event.query().count('* as total').first()
    const upcoming = await Event.query()
      .where('start_date', '>', now.toSQL())
      .count('* as total')
      .first()
    const ongoing = await Event.query()
      .where('start_date', '<=', now.toSQL())
      .where('end_date', '>=', now.toSQL())
      .count('* as total')
      .first()
    const finished = await Event.query()
      .where('end_date', '<', now.toSQL())
      .count('* as total')
      .first()

    return response.ok({
      success: true,
      data: {
        total: Number(totalEvents?.$extras.total ?? 0),
        upcoming: Number(upcoming?.$extras.total ?? 0),
        ongoing: Number(ongoing?.$extras.total ?? 0),
        finished: Number(finished?.$extras.total ?? 0),
      },
    })
  }
}
