// app/services/search_service.ts - NEW FILE
import typesenseClient, { Collections, isTypesenseReady } from '#services/typesense_service'
import type { SearchParams } from 'typesense/lib/Typesense/Types.js'
/**
 * Generic search result interface
 */
export interface SearchResult<T> {
  hits: Array<{
    document: T
    highlights?: any[]
  }>
  found: number
  page: number
  out_of: number
}

/**
 * Generic Typesense search helper
 */
export default class SearchService {
  /**
   * Perform a search on any collection with type safety
   */
  static async search<T extends Record<string, any>>(
    collection: Collections,
    params: Partial<SearchParams<any, any>>
  ): Promise<SearchResult<T> | null> {
    const ready = await isTypesenseReady(collection)
    if (!ready) {
      console.warn(`[SearchService] Collection ${collection} not ready`)
      return null
    }

    try {
      const defaultParams: SearchParams<any, any> = {
        q: '*',
        query_by: '',
        per_page: 50,
        page: 1,
        ...params,
      }

      const result = await typesenseClient
        .collections<T>(collection)
        .documents()
        .search(defaultParams)

      return result as SearchResult<T>
    } catch (error) {
      console.error(`[SearchService] Error searching ${collection}:`, error.message)
      return null
    }
  }

  /**
   * Search events with common filters
   */
  static async searchEvents(params: {
    search?: string
    category?: string
    province?: string
    eventType?: string
    gameType?: string
    difficulty?: string
    status?: string
    isPublic?: boolean
    page?: number
    perPage?: number
  }) {
    const filters: string[] = []

    if (params.status) filters.push(`status:=${params.status}`)
    if (params.isPublic !== undefined) filters.push(`is_public:=${params.isPublic}`)
    if (params.category) filters.push(`category:=${params.category}`)
    if (params.province) filters.push(`province:=${params.province}`)
    if (params.eventType) filters.push(`event_type:=${params.eventType}`)
    if (params.gameType) filters.push(`game_type:=${params.gameType}`)
    if (params.difficulty) filters.push(`difficulty:=${params.difficulty}`)

    return this.search(Collections.EVENTS, {
      q: params.search || '*',
      query_by: 'name,description',
      filter_by: filters.length > 0 ? filters.join(' && ') : undefined,
      sort_by: 'start_date:asc',
      page: params.page || 1,
      per_page: params.perPage || 12,
    })
  }

  /**
   * Search users with common filters
   */
  static async searchUsers(params: {
    search?: string
    province?: string
    isBlocked?: boolean
    isVerified?: boolean
    isActive?: boolean
    page?: number
    perPage?: number
  }) {
    const filters: string[] = []

    if (params.province) filters.push(`province:=${params.province}`)
    if (params.isBlocked !== undefined) filters.push(`is_blocked:=${params.isBlocked}`)
    if (params.isVerified !== undefined) filters.push(`is_email_verified:=${params.isVerified}`)
    if (params.isActive !== undefined) filters.push(`is_active:=${params.isActive}`)

    return this.search(Collections.USERS, {
      q: params.search || '*',
      query_by: 'first_name,last_name,email,full_name',
      filter_by: filters.length > 0 ? filters.join(' && ') : undefined,
      sort_by: 'created_at:desc',
      page: params.page || 1,
      per_page: params.perPage || 50,
    })
  }

  /**
   * Search registrations with common filters
   */
  static async searchRegistrations(params: {
    search?: string
    status?: string
    eventId?: number
    userId?: number
    page?: number
    perPage?: number
  }) {
    const filters: string[] = []

    if (params.status) filters.push(`status:=${params.status}`)
    if (params.eventId) filters.push(`event_id:=${params.eventId}`)
    if (params.userId) filters.push(`user_id:=${params.userId}`)

    return this.search(Collections.REGISTRATIONS, {
      q: params.search || '*',
      query_by: 'user_name,user_email,event_name,qr_code',
      filter_by: filters.length > 0 ? filters.join(' && ') : undefined,
      sort_by: 'created_at:desc',
      page: params.page || 1,
      per_page: params.perPage || 50,
    })
  }

  /**
   * Get autocomplete suggestions for a field
   */
  static async autocomplete(
    collection: Collections,
    queryBy: string,
    query: string,
    limit: number = 10
  ) {
    const ready = await isTypesenseReady(collection)
    if (!ready) return []

    try {
      const result = await typesenseClient.collections(collection).documents().search({
        q: query,
        query_by: queryBy,
        per_page: limit,
      })

      return result.hits?.map((hit) => hit.document) || []
    } catch (error) {
      console.error('[SearchService] Autocomplete error:', error.message)
      return []
    }
  }

  /**
   * Get facet counts for filtering
   */
  static async getFacets(
    collection: Collections,
    facetBy: string,
    query: string = '*',
    queryBy: string = '*'
  ) {
    const ready = await isTypesenseReady(collection)
    if (!ready) return []

    try {
      const result = await typesenseClient.collections(collection).documents().search({
        q: query,
        query_by: queryBy,
        facet_by: facetBy,
        per_page: 0,
      })

      return result.facet_counts || []
    } catch (error) {
      console.error('[SearchService] Facets error:', error.message)
      return []
    }
  }
}
