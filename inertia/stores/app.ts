import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { FlashMessages } from '~/types/common'

/**
 * Application Store
 * Manages global app state like loading, flash messages, and UI state
 */
export const useAppStore = defineStore('app', () => {
  // State
  const loading = ref(false)
  const flashMessages = ref<FlashMessages>({})
  const mobileMenuOpen = ref(false)
  const sidebarOpen = ref(true)

  // Actions
  /**
   * Set loading state
   */
  function setLoading(state: boolean) {
    loading.value = state
  }

  /**
   * Set flash messages from server
   */
  function setFlashMessages(messages: FlashMessages) {
    flashMessages.value = messages
  }

  /**
   * Add a flash message
   */
  function addFlashMessage(type: keyof FlashMessages, message: string) {
    flashMessages.value[type] = message
  }

  /**
   * Clear flash messages
   */
  function clearFlashMessages() {
    flashMessages.value = {}
  }

  /**
   * Clear specific flash message
   */
  function clearFlashMessage(type: keyof FlashMessages) {
    delete flashMessages.value[type]
  }

  /**
   * Toggle mobile menu
   */
  function toggleMobileMenu() {
    mobileMenuOpen.value = !mobileMenuOpen.value
  }

  /**
   * Close mobile menu
   */
  function closeMobileMenu() {
    mobileMenuOpen.value = false
  }

  /**
   * Toggle sidebar
   */
  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  return {
    // State
    loading,
    flashMessages,
    mobileMenuOpen,
    sidebarOpen,

    // Actions
    setLoading,
    setFlashMessages,
    addFlashMessage,
    clearFlashMessages,
    clearFlashMessage,
    toggleMobileMenu,
    closeMobileMenu,
    toggleSidebar,
  }
})
