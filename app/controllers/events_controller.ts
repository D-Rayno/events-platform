// app/controllers/events_controller.ts - ENHANCED VERSION
import type { HttpContext } from '@adonisjs/core/http'
import Event from '#models/event'
import Registration from '#models/registration'
import SearchService from '#services/search_service'

export default class EventController {
  /**
   * Display list of public events with enhanced filtering
   */
  async index({ request, inertia, auth }: HttpContext) {
    const page = request.input('page', 1)
    const search = request.input('search', '').trim()
    const category = request.input('category', '').trim()
    const province = request.input('province', '').trim()
    const eventType = request.input('eventType', '').trim()
    const gameType = request.input('gameType', '').trim()
    const difficulty = request.input('difficulty', '').trim()
    const priceRange = request.input('priceRange', '').trim() // new: free, paid, premium
    const status = request.input('status', '').trim() // new: upcoming, ongoing
    const user = auth.user

    console.log('[Events Controller] Filters:', {
      search,
      category,
      province,
      eventType,
      gameType,
      difficulty,
      priceRange,
      status,
    })

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
      console.warn('[Events] Using database fallback for search')
      const result = await this.fallbackDatabaseSearch(
        page,
        search,
        category,
        province,
        eventType,
        gameType,
        difficulty,
        priceRange,
        status
      )
      orderedEvents = result.events
      totalFound = result.total
      lastPage = result.lastPage
    }

    // Apply client-side filters for price range and status (if not using Typesense)
    if (!searchResult) {
      orderedEvents = this.applyClientFilters(orderedEvents, priceRange, status)
      totalFound = orderedEvents.length
      lastPage = Math.ceil(totalFound / 12)
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

    // Get filter statistics for UI
    const filterStats = await this.getFilterStatistics()

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
        priceRange: priceRange || '',
        status: status || '',
      },
      filterStats,
    })
  }

  /**
   * Enhanced fallback database search
   */
  private async fallbackDatabaseSearch(
    page: number,
    search: string,
    category: string,
    province: string,
    eventType: string,
    gameType: string,
    difficulty: string,
    priceRange: string,
    status: string
  ) {
    let query = Event.query()
      .where('status', 'published')
      .where('is_public', true)
      .orderBy('start_date', 'asc')

    // Text search
    if (search) {
      query = query.where((q) => {
        q.whereLike('name', `%${search}%`)
          .orWhereLike('description', `%${search}%`)
          .orWhereLike('location', `%${search}%`)
      })
    }

    // Category filter
    if (category) query = query.where('category', category)
    
    // Location filter
    if (province) query = query.where('province', province)
    
    // Event type filter
    if (eventType) {
      if (eventType === 'normal') {
        query = query.whereNull('event_type')
      } else {
        query = query.whereNotNull('event_type')
      }
    }
    
    // Game type filter
    if (gameType) query = query.where('game_type', gameType)
    
    // Difficulty filter
    if (difficulty) query = query.where('difficulty', difficulty)

    const result = await query.paginate(page, 12)

    return {
      events: result.all(),
      total: result.total,
      lastPage: result.lastPage,
    }
  }

  /**
   * Apply client-side filters (for fallback mode)
   */
  private applyClientFilters(events: Event[], priceRange: string, status: string): Event[] {
    let filtered = events

    // Price range filter
    if (priceRange) {
      filtered = filtered.filter((event) => {
        if (priceRange === 'free') return event.basePrice === 0
        if (priceRange === 'paid') return event.basePrice > 0 && event.basePrice <= 1000
        if (priceRange === 'premium') return event.basePrice > 1000
        return true
      })
    }

    // Status filter
    if (status) {
      filtered = filtered.filter((event) => {
        if (status === 'upcoming') return event.isUpcoming()
        if (status === 'ongoing') return event.isOngoing()
        return true
      })
    }

    return filtered
  }

  /**
   * Get filter statistics for UI
   */
  private async getFilterStatistics() {
    const stats = await Event.query()
      .where('status', 'published')
      .where('is_public', true)
      .exec()

    const gameEvents = stats.filter((e) => e.eventType !== null).length
    const normalEvents = stats.filter((e) => e.eventType === null).length
    const freeEvents = stats.filter((e) => e.basePrice === 0).length
    const paidEvents = stats.filter((e) => e.basePrice > 0).length

    // Get unique game types
    const gameTypes = new Set(stats.map((e) => e.gameType).filter(Boolean))

    return {
      total: stats.length,
      gameEvents,
      normalEvents,
      freeEvents,
      paidEvents,
      availableGameTypes: Array.from(gameTypes),
    }
  }

  /**
   * Display event details with complete information
   */
  async show({ params, inertia, auth, response, session }: HttpContext) {
    const user = auth.user
    const event = await Event.find(params.id)

    if (!event || !event.isPublic) {
      session.flash('error', "Cet événement n'existe pas ou n'est pas accessible.")
      return response.redirect('/events')
    }

    // Update and persist event status
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

    // Calculate user's price based on age
    let userPrice = event.basePrice
    if (user?.age) {
      userPrice = event.getPriceForAge(user.age)
    }

    // Get similar events
    const similarEvents = await this.getSimilarEvents(event)

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
        userPrice, // New: calculated price for current user
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
        gameType: event.gameType,
        difficulty: event.difficulty,
        durationMinutes: event.durationMinutes,
        physicalIntensity: event.physicalIntensity,
        allowsTeams: event.allowsTeams,
        teamRegistration: event.teamRegistration,
        minTeamSize: event.minTeamSize,
        maxTeamSize: event.maxTeamSize,
        maxTeams: event.maxTeams,
        autoTeamFormation: event.autoTeamFormation,
        requiredItems: event.requiredItems,
        prohibitedItems: event.prohibitedItems,
        safetyRequirements: event.safetyRequirements,
        waiverRequired: event.waiverRequired,
        rulesDocumentUrl: event.rulesDocumentUrl,
        checkInTime: event.checkInTime?.toISO(),
        briefingDurationMinutes: event.briefingDurationMinutes,
        prizeInformation: event.prizeInformation,
        prizePool: event.prizePool,
        winnerAnnouncement: event.winnerAnnouncement?.toISO(),
        photographyAllowed: event.photographyAllowed,
        liveStreaming: event.liveStreaming,
        specialInstructions: event.specialInstructions,
        
        // Computed fields
        totalDurationMinutes: event.totalDurationMinutes,
        gameSummary: event.getGameSummary(),
        difficultyBadge: event.getDifficultyBadge(),
        intensityBadge: event.getIntensityBadge(),
        isCheckInOpen: event.isCheckInOpen(),
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
      similarEvents: similarEvents.map((e) => ({
        id: e.id,
        name: e.name,
        imageUrl: e.imageUrl,
        startDate: e.startDate.toISO(),
        province: e.province,
        basePrice: e.basePrice,
        category: e.category,
        eventType: e.eventType,
      })),
    })
  }

  /**
   * Get similar events based on category, location, or type
   */
  private async getSimilarEvents(event: Event, limit: number = 3): Promise<Event[]> {
    const similar = await Event.query()
      .where('status', 'published')
      .where('is_public', true)
      .whereNot('id', event.id)
      .where((query) => {
        query
          .where('category', event.category)
          .orWhere('province', event.province)
          .orWhere('event_type', event.eventType || '')
      })
      .limit(limit)
      .exec()

    return similar
  }
}