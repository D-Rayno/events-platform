import { defineConfig } from 'vite'
import { getDirname } from '@adonisjs/core/helpers'
import inertia from '@adonisjs/inertia/client'
import vue from '@vitejs/plugin-vue'
import adonisjs from '@adonisjs/vite/client'
import tailwindcss from '@tailwindcss/vite'

const __dirname = getDirname(import.meta.url)

export default defineConfig({
  plugins: [
    inertia({ ssr: { enabled: true, entrypoint: 'inertia/app/ssr.ts' } }),
    tailwindcss(),
    vue(),
    adonisjs({
      entrypoints: ['inertia/app/app.ts'],
      reload: ['resources/views/**/*.edge'],
    }),
  ],

  resolve: {
    alias: {
      '~/': `${__dirname}/inertia/`,
      '#ui': `${__dirname}/inertia/components/ui`,
      '#shared': `${__dirname}/inertia/components/shared`,
      '#layouts': `${__dirname}/inertia/components/layouts`,
      '#composables': `${__dirname}/inertia/composables`,
      '#services': `${__dirname}/inertia/services`,
      '#stores': `${__dirname}/inertia/stores`,
      '#lib': `${__dirname}/inertia/lib`,
      '#types': `${__dirname}/inertia/types`,
    },
  },
})