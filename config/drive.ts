import { defineConfig, services } from '@adonisjs/drive'
import env from '#start/env'

export default defineConfig({
  default: env.get('DRIVE_DISK'),

  /**
   * The services object is used to configure multiple file system
   * services each using the same or a different driver.
   */
  services: {
    fs: services.fs({
      location: './public/uploads',
      serveFiles: true,
      routeBasePath: '/uploads',
      visibility: 'public',
    }),
  },
})
