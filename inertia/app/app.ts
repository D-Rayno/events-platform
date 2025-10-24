/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import '../css/app.css'
import { createSSRApp, h } from 'vue'
import type { DefineComponent } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { router } from '@inertiajs/vue3'
import { createPinia } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import { useAppStore } from '~/stores/app'
import { clickAwayDirective } from '~/directives/click-away'


const appName = import.meta.env.VITE_APP_NAME || 'EventHub'

// Helper to resolve page components
function resolvePageComponent(path: string, pages: Record<string, any>) {
  for (const p in pages) {
    if (p.endsWith(`${path.replace('../pages/', '')}.vue`)) {
      return typeof pages[p] === 'function' ? pages[p]() : pages[p]
    }
  }
  throw new Error(`Page not found: ${path}`)
}

createInertiaApp({
  progress: {
    color: '#0ea5e9',
    showSpinner: false,
  },

  title: (title) => `${title} - ${appName}`,

  resolve: (name) => {
    return resolvePageComponent(
      `../pages/${name}`,
      import.meta.glob<DefineComponent>('../pages/**/*.vue')
    )
  },

  setup({ el, App, props, plugin }) {
    const pinia = createPinia()
    const app = createSSRApp({ render: () => h(App, props) })

    // Register global directive
    app.directive('click-away', clickAwayDirective)

    app.use(pinia)
    app.use(plugin)

    // Initialize stores from page props
    const authStore = useAuthStore()
    const appStore = useAppStore()

    if (props.initialPage.props.auth?.user) {
      authStore.initializeAuth(props.initialPage.props.auth.user)
    }

    if (props.initialPage.props.flash) {
      appStore.setFlashMessages(props.initialPage.props.flash)
    }

    // Global router event handlers
    router.on('start', () => {
      appStore.setLoading(true)
    })

    router.on('finish', () => {
      appStore.setLoading(false)
    })

    router.on('success', (event) => {
      const page = event.detail.page

      // Update auth state
      if (page.props.auth?.user) {
        authStore.setUser(page.props.auth.user)
      } else if (authStore.isAuthenticated && !page.props.auth?.user) {
        authStore.clearUser()
      }

      // Update flash messages
      if (page.props.flash) {
        appStore.setFlashMessages(page.props.flash)
      }

      // Close mobile menu on navigation
      appStore.closeMobileMenu()

      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })

    router.on('error', (event) => {
      console.error('Navigation error:', event)
      
      // Type-safe error handling
      const errorDetail = event.detail as any
      const status = errorDetail.status || errorDetail.response?.status
      
      if (status === 401) {
        authStore.clearUser()
        router.visit('/auth/login')
      } else if (status === 403) {
        appStore.addFlashMessage('error', 'You do not have permission to access this page.')
      } else if (status === 404) {
        router.visit('/404')
      } else if (status === 500 || status >= 500) {
        appStore.addFlashMessage('error', 'A server error occurred. Please try again.')
      }
    })

    app.mount(el)
  },
})