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

const appName = import.meta.env.VITE_APP_NAME || 'EventHub'

createInertiaApp({
  progress: {
    color: '#0ea5e9',
    showSpinner: false,
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
        // User logged out
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

    router.on('error', (error) => {
      console.error('Navigation error:', error)
      if (error.detail.status === 401) {
        // Unauthorized - redirect to login
        authStore.clearUser()
        router.visit('/auth/login')
      } else if (error.detail.status === 403) {
        // Forbidden
        appStore.addFlashMessage('error', 'You do not have permission to access this page.')
      } else if (error.detail.status === 404) {
        // Not found
        router.visit('/404')
      } else if (error.detail.status === 500) {
        // Server error
        appStore.addFlashMessage('error', 'A server error occurred. Please try again.')
      }
    })

    // Redirect unauthenticated users if needed
    const publicPages = [
      'auth/login',
      'auth/register',
      'auth/forgot_password',
      'auth/reset_password',
      'home',
      'events/index',
      'events/show',
    ]

    router.on('before', (event) => {
      const pageName = props.initialPage.component
      const isPublicPage = publicPages.some((page) => pageName.includes(page))

      if (!isPublicPage && !authStore.isAuthenticated) {
        event.preventDefault()
        router.visit('/auth/login')
        return false
      }

      return true
    })

    app.mount(el)
  },
})