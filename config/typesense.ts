// config/typesense.ts
import env from '#start/env'

const config = {
  host: env.get('TYPESENSE_HOST'),
  port: parseInt(env.get('TYPESENSE_PORT')),
  protocol: env.get('TYPESENSE_PROTOCOL') as 'http' | 'https',
  apiKey: env.get('TYPESENSE_API_KEY'),
  connectionTimeoutSeconds: 10,
  enabled: env.get('TYPESENSE_ENABLED'),
}

export default config