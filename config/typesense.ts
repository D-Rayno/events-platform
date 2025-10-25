// config/typesense.ts
import env from '#start/env'

export default {
  host: env.get('TYPESENSE_HOST', 'localhost'),
  port: parseInt(env.get('TYPESENSE_PORT', '8108')),
  protocol: env.get('TYPESENSE_PROTOCOL', 'http'),
  apiKey: env.get('TYPESENSE_API_KEY', ''),
  connectionTimeoutSeconds: 10,
}