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
       * CRITICAL FIX: Only use transport in development
       * In production, omit the transport property entirely to use default JSON logging
       */
      ...(app.inProduction 
        ? {} 
        : {
            transport: {
              targets: targets()
                .push(targets.pretty())
                .toArray(),
            },
          }),
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