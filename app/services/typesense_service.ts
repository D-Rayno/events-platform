// app/services/typesense_service.ts
import { Client } from 'typesense'
import typesenseConfig from '#config/typesense'

/**
 * Schema definition for an Event document stored in Typesense.
 */
export interface EventDocument {
  id: string
  name: string
  description: string
  category: string
  province: string
  start_date: number
  event_type: string | null
  game_type: string | null
  difficulty: string | null
}

/**
 * Initializes a Typesense client instance.
 *
 * The client is configured using values from `config/typesense.ts`.
 * Example usage:
 * ```ts
 * import typesenseClient from '#services/typesense_service'
 *
 * const result = await typesenseClient
 *   .collections<EventDocument>('events')
 *   .documents()
 *   .search({ q: 'test', query_by: 'name,description' })
 * ```
 */
const client = new Client({
  nodes: [
    {
      host: typesenseConfig.host,
      port: typesenseConfig.port,
      protocol: typesenseConfig.protocol,
    },
  ],
  apiKey: typesenseConfig.apiKey,
  connectionTimeoutSeconds: typesenseConfig.connectionTimeoutSeconds,
})

export default client