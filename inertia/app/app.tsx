/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import '../css/app.css'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { router } from '@inertiajs/react'
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
    const pages = import.meta.glob('../pages/**/*.tsx', { eager: true })
    return pages[`../pages/${name}.tsx`]
  },

  setup({ el, App, props }) {
    const root = createRoot(el)

    // Initialize stores from page props
    const initializeStores = () => {
      const authStore = useAuthStore.getState()
      const appStore = useAppStore.getState()

      if (props.initialPage.props.auth?.user) {
        authStore.initializeAuth(props.initialPage.props.auth.user)
      }

      if (props.initialPage.props.flash) {
        appStore.setFlashMessages(props.initialPage.props.flash)
      }
    }

    initializeStores()

    // Global router event handlers
    router.on('start', () => {
      useAppStore.getState().setLoading(true)
    })

    router.on('finish', () => {
      useAppStore.getState().setLoading(false)
    })

    router.on('success', (event) => {
      const page = event.detail.page
      const authStore = useAuthStore.getState()
      const appStore = useAppStore.getState()

      // Update auth state - properly check for user
      if (page.props.auth?.user) {
        authStore.setUser(page.props.auth.user)
      } else if (!page.props.auth?.user && authStore.user) {
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

    router.on('error', (event) => {
      console.error('Navigation error:', event)

      const errorDetail = event.detail as any
      const status = errorDetail.status || errorDetail.response?.status
      const authStore = useAuthStore.getState()
      const appStore = useAppStore.getState()

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

    root.render(<App {...props} />)
  },
})
