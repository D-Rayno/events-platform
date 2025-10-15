import { createInertiaApp } from '@inertiajs/vue3'
import { renderToString } from '@vue/server-renderer'
import { createSSRApp, h, type DefineComponent } from 'vue'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'
import { clickAwayDirective } from '~/directives/click-away'
import '../css/app.css'

// Helper to resolve page components (same as app.ts)
// function resolvePageComponent(path: string, pages: Record<string, any>) {
//   for (const p in pages) {
//     if (p.endsWith(`${path.replace('../pages/', '')}.vue`)) {
//       return typeof pages[p] === 'function' ? pages[p]() : pages[p]
//     }
//   }
//   throw new Error(`Page not found: ${path}`)
// }

export default function render(page: any) {
  return createInertiaApp({
    page,
    render: renderToString,
    resolve: (name) => {
      const pages = import.meta.glob<DefineComponent>('../pages/**/*.vue', { eager: true })
      return pages[`../pages/${name}.vue`]
    },

    setup({ App, props, plugin }) {
      const pinia = createPinia()
      const app = createSSRApp({ render: () => h(App, props) })
      
      // Register directive on SSR too
      app.directive('click-away', clickAwayDirective)
      
      return app
        .use(plugin)
        .use(MotionPlugin)
        .use(pinia)
    },
  })
}