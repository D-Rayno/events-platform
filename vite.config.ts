import { defineConfig } from 'vite'
import { getDirname } from '@adonisjs/core/helpers'
import inertia from '@adonisjs/inertia/client'
import vue from '@vitejs/plugin-vue'
import adonisjs from '@adonisjs/vite/client'
import tailwindcss from '@tailwindcss/vite'
import MotionResolver from 'motion-v/resolver'
import Components from 'unplugin-vue-components/vite'

const __dirname = getDirname(import.meta.url)

export default defineConfig({
  plugins: [
    inertia({ ssr: { enabled: true, entrypoint: 'inertia/app/ssr.ts' } }),
    vue(),
    Components({
      dts: true,
      resolvers: [MotionResolver()],
      extensions: ['vue'],
    }),
    tailwindcss(),
    adonisjs({
      entrypoints: ['inertia/app/app.ts'],
      reload: ['resources/views/**/*.edge'],
    }),
  ],

  resolve: {
    alias: {
      '~/': `${__dirname}/inertia/`,
      '#ui': `${__dirname}/inertia/components/ui`,
      '#ui/*': `${__dirname}/inertia/components/ui/*`,
      '#shared': `${__dirname}/inertia/components/shared`,
      '#shared/*': `${__dirname}/inertia/components/shared/*`,
      '#layouts': `${__dirname}/inertia/components/layouts`,
      '#layouts/*': `${__dirname}/inertia/components/layouts/*`,
      '#composables': `${__dirname}/inertia/composables`,
      '#composables/*': `${__dirname}/inertia/composables/*`,
      '#services': `${__dirname}/inertia/services`,
      '#services/*': `${__dirname}/inertia/services/*`,
      '#stores': `${__dirname}/inertia/stores`,
      '#stores/*': `${__dirname}/inertia/stores/*`,
      '#lib': `${__dirname}/inertia/lib`,
      '#lib/*': `${__dirname}/inertia/lib/*`,
      '#types': `${__dirname}/inertia/types`,
      '#types/*': `${__dirname}/inertia/types/*`,
    },
  },
})
