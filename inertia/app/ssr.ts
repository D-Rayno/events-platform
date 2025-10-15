import { createInertiaApp } from '@inertiajs/vue3'
import { renderToString } from '@vue/server-renderer'
import { createSSRApp, h, type DefineComponent } from 'vue'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'
import '../css/app.css'

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
      return createSSRApp({ render: () => h(App, props) })
        .use(plugin)
        .use(MotionPlugin)
        .use(pinia)
    },
  })
}
