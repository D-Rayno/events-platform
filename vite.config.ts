import { defineConfig } from 'vite'
import inertia from '@adonisjs/inertia/client'
import react from '@vitejs/plugin-react'
import adonisjs from '@adonisjs/vite/client'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [
    inertia({ ssr: { enabled: true, entrypoint: 'inertia/app/ssr.tsx' } }),
    react(),
    adonisjs({ 
      entrypoints: ['inertia/app/app.tsx'], 
      reload: ['resources/views/**/*.edge'] 
    }),
    tailwindcss(),
  ],

  /**
   * Define aliases for importing modules from
   * your frontend code
   */
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./inertia', import.meta.url)),
      '@': fileURLToPath(new URL('./inertia', import.meta.url)),
      '#ui': fileURLToPath(new URL('./inertia/components/ui', import.meta.url)),
      '#shared': fileURLToPath(new URL('./inertia/components/shared', import.meta.url)),
      '#layouts': fileURLToPath(new URL('./inertia/components/layouts', import.meta.url)),
      '#hooks': fileURLToPath(new URL('./inertia/hooks', import.meta.url)),
      '#services': fileURLToPath(new URL('./inertia/services', import.meta.url)),
      '#stores': fileURLToPath(new URL('./inertia/stores', import.meta.url)),
      '#lib': fileURLToPath(new URL('./inertia/lib', import.meta.url)),
      '#types': fileURLToPath(new URL('./inertia/types', import.meta.url)),
    },
  },
})