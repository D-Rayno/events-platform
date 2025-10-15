// inertia/services/event.service.ts
import { router } from '@inertiajs/vue3'
import type { EventFilters } from '~/types/event'

/**
 * Event service
 * Handles all event-related operations
 */
class EventService {
  /**
   * Fetch events with filters
   * @param filters - Search filters
   * @param page - Page number
   */
  async fetchEvents(filters: EventFilters = {}, page: number = 1) {
    return new Promise((resolve) => {
      router.get(
        '/events',
        { ...filters, page },
        {
          preserveState: true,
          preserveScroll: true,
          onSuccess: () => resolve(true),
        }
      )
    })
  }

  /**
   * Get event details
   * @param id - Event ID
   */
  async getEvent(id: number) {
    return new Promise((resolve) => {
      router.visit(`/events/${id}`, {
        onSuccess: () => resolve(true),
      })
    })
  }

  /**
   * Register for an event
   * @param eventId - Event ID
   */
  async register(eventId: number) {
    return new Promise((resolve, reject) => {
      router.post(
        `/events/${eventId}/register`,
        {},
        {
          preserveScroll: true,
          onSuccess: () => resolve(true),
          onError: (errors) => reject(errors),
        }
      )
    })
  }

  /**
   * Build query string for filters
   * @param filters - Event filters
   */
  buildFilterQuery(filters: EventFilters): string {
    const params = new URLSearchParams()

    if (filters.search) params.append('search', filters.search)
    if (filters.category) params.append('category', filters.category)
    if (filters.province) params.append('province', filters.province)
    if (filters.eventType) params.append('eventType', filters.eventType)
    if (filters.gameType) params.append('gameType', filters.gameType)
    if (filters.difficulty) params.append('difficulty', filters.difficulty)

    return params.toString()
  }

  /**
   * Check if user can register for event
   * @param event - Event data
   */
  canRegister(event: any): boolean {
    return event.canRegister && !event.isFull && event.isUpcoming
  }

  /**
   * Get event status badge
   * @param event - Event data
   */
  getStatusBadge(event: any): { text: string; color: string } {
    if (event.isOngoing) {
      return { text: 'En cours', color: 'blue' }
    } else if (event.isUpcoming) {
      return { text: 'À venir', color: 'green' }
    } else {
      return { text: 'Terminé', color: 'gray' }
    }
  }
}

export const eventService = new EventService()
