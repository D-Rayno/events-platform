/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import '../css/app.css'
import { createSSRApp, h } from 'vue'
import type { DefineComponent } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'
import { router } from '@inertiajs/vue3'
import { useAuthStore } from '~/stores/auth'
import { useAppStore } from '~/stores/app'

const appName = import.meta.env.VITE_APP_NAME || 'Event Platform'

createInertiaApp({
  progress: { 
    color: '#5468FF',
    showSpinner: true,
  },

  title: (title) => `${title} - ${appName}`,

  resolve: (name) => {
    return resolvePageComponent(
      `../pages/${name}.vue`,
      import.meta.glob<DefineComponent>('../pages/**/*.vue')
    )
  },

  setup({ el, App, props, plugin }) {
    const pinia = createPinia()
    const app = createSSRApp({ render: () => h(App, props) })

    app.use(pinia)
    app.use(MotionPlugin)
    app.use(plugin)

    // Initialize auth store from page props
    const authStore = useAuthStore()
    const appStore = useAppStore()

    if (props.initialPage.props.auth?.user) {
      authStore.initializeAuth(props.initialPage.props.auth.user)
    }

    if (props.initialPage.props.flash) {
      appStore.setFlashMessages(props.initialPage.props.flash)
    }

    // Listen to Inertia events
    router.on('start', () => {
      appStore.setLoading(true)
    })

    router.on('finish', () => {
      appStore.setLoading(false)
    })

    router.on('success', (event) => {
      // Update auth on each successful navigation
      if (event.detail.page.props.auth?.user) {
        authStore.setUser(event.detail.page.props.auth.user)
      }

      // Update flash messages
      if (event.detail.page.props.flash) {
        appStore.setFlashMessages(event.detail.page.props.flash)
      }

      // Close mobile menu on navigation
      appStore.closeMobileMenu()

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })

    app.mount(el)
  },
})