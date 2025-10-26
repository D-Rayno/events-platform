import app from '@adonisjs/core/services/app'
import { defineConfig, targets } from '@adonisjs/core/logger'

const loggerConfig = defineConfig({
  default: 'app',

  /**
   * The loggers object can be used to define multiple loggers.
   * By default, we configure only one logger (named "app").
   */
  loggers: {
    app: {
      enabled: true,
      name: app.appName,
      level: app.inProduction ? 'info' : 'debug',
      
      /**
       * IMPORTANT: Use pino-pretty only in development
       * In production, use standard pino transport for better performance
       */
      transport: app.inProduction
        ? undefined  // Use default transport in production (faster, JSON output)
        : {
            targets: targets()
              .pushIf(!app.inProduction, targets.pretty())
              .toArray(),
          },
    },
  },
})

export default loggerConfig

/**
 * Inferring types for the list of loggers you have configured
 * in your application.
 */
declare module '@adonisjs/core/types' {
  export interface LoggersList extends InferLoggers<typeof loggerConfig> {}
}