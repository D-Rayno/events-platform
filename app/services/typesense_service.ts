// app/services/typesense_service.ts - COMPLETE REPLACEMENT
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
  commune: string
  start_date: number
  status: string
  is_public: boolean
  event_type: string | null
  game_type: string | null
  difficulty: string | null
}

/**
 * Schema definition for a User document stored in Typesense.
 */
export interface UserDocument {
  id: string
  first_name: string
  last_name: string
  full_name: string
  email: string
  age: number
  province: string
  commune: string | null
  phone_number: string | null
  is_email_verified: boolean
  is_active: boolean
  is_blocked: boolean
  created_at: number
}

/**
 * Schema definition for a Registration document stored in Typesense.
 */
export interface RegistrationDocument {
  id: string
  user_id: number
  event_id: number
  user_name: string
  user_email: string
  event_name: string
  event_location: string
  status: string
  qr_code: string
  created_at: number
  event_start_date: number
}

/**
 * Collection names enum
 */
export enum Collections {
  EVENTS = 'events',
  USERS = 'users',
  REGISTRATIONS = 'registrations',
}

/**
 * Initializes a Typesense client instance.
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

/**
 * Helper to check if Typesense is enabled and specific collection exists
 */
export async function isTypesenseReady(collection?: Collections): Promise<boolean> {
  if (!typesenseConfig.enabled) {
    return false
  }

  try {
    if (collection) {
      await client.collections(collection).retrieve()
    } else {
      // Check if at least one collection exists
      await client.collections(Collections.EVENTS).retrieve()
    }
    return true
  } catch (error) {
    console.warn(`[Typesense] Collection ${collection || 'default'} not ready:`, error.message)
    return false
  }
}

/**
 * Safe wrapper for indexing events
 */
export async function safeIndexEvent(eventData: EventDocument): Promise<void> {
  const ready = await isTypesenseReady(Collections.EVENTS)
  if (!ready) {
    console.warn('[Typesense] Skipping event index - service not ready')
    return
  }

  try {
    await client.collections<EventDocument>(Collections.EVENTS).documents().upsert(eventData)
  } catch (error) {
    console.error('[Typesense] Error indexing event:', error.message)
  }
}

/**
 * Safe wrapper for deleting events
 */
export async function safeDeleteEvent(eventId: string): Promise<void> {
  const ready = await isTypesenseReady(Collections.EVENTS)
  if (!ready) {
    console.warn('[Typesense] Skipping event delete - service not ready')
    return
  }

  try {
    await client.collections<EventDocument>(Collections.EVENTS).documents(eventId).delete()
  } catch (error) {
    console.error('[Typesense] Error deleting event:', error.message)
  }
}

/**
 * Safe wrapper for indexing users
 */
export async function safeIndexUser(userData: UserDocument): Promise<void> {
  const ready = await isTypesenseReady(Collections.USERS)
  if (!ready) {
    console.warn('[Typesense] Skipping user index - service not ready')
    return
  }

  try {
    await client.collections<UserDocument>(Collections.USERS).documents().upsert(userData)
  } catch (error) {
    console.error('[Typesense] Error indexing user:', error.message)
  }
}

/**
 * Safe wrapper for deleting users
 */
export async function safeDeleteUser(userId: string): Promise<void> {
  const ready = await isTypesenseReady(Collections.USERS)
  if (!ready) {
    console.warn('[Typesense] Skipping user delete - service not ready')
    return
  }

  try {
    await client.collections<UserDocument>(Collections.USERS).documents(userId).delete()
  } catch (error) {
    console.error('[Typesense] Error deleting user:', error.message)
  }
}

/**
 * Safe wrapper for indexing registrations
 */
export async function safeIndexRegistration(registrationData: RegistrationDocument): Promise<void> {
  const ready = await isTypesenseReady(Collections.REGISTRATIONS)
  if (!ready) {
    console.warn('[Typesense] Skipping registration index - service not ready')
    return
  }

  try {
    await client
      .collections<RegistrationDocument>(Collections.REGISTRATIONS)
      .documents()
      .upsert(registrationData)
  } catch (error) {
    console.error('[Typesense] Error indexing registration:', error.message)
  }
}

/**
 * Safe wrapper for deleting registrations
 */
export async function safeDeleteRegistration(registrationId: string): Promise<void> {
  const ready = await isTypesenseReady(Collections.REGISTRATIONS)
  if (!ready) {
    console.warn('[Typesense] Skipping registration delete - service not ready')
    return
  }

  try {
    await client
      .collections<RegistrationDocument>(Collections.REGISTRATIONS)
      .documents(registrationId)
      .delete()
  } catch (error) {
    console.error('[Typesense] Error deleting registration:', error.message)
  }
}

export default client