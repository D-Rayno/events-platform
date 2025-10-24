import { create } from 'zustand'
import type { FlashMessages } from '~/types/common'

interface AppState {
  loading: boolean
  flashMessages: FlashMessages
  mobileMenuOpen: boolean
  sidebarOpen: boolean

  // Actions
  setLoading: (state: boolean) => void
  setFlashMessages: (messages: FlashMessages) => void
  addFlashMessage: (type: keyof FlashMessages, message: string) => void
  clearFlashMessages: () => void
  clearFlashMessage: (type: keyof FlashMessages) => void
  toggleMobileMenu: () => void
  closeMobileMenu: () => void
  toggleSidebar: () => void
}

export const useAppStore = create<AppState>((set) => ({
  loading: false,
  flashMessages: {},
  mobileMenuOpen: false,
  sidebarOpen: true,

  setLoading: (state) => set({ loading: state }),

  setFlashMessages: (messages) => set({ flashMessages: messages }),

  addFlashMessage: (type, message) =>
    set((state) => ({
      flashMessages: { ...state.flashMessages, [type]: message },
    })),

  clearFlashMessages: () => set({ flashMessages: {} }),

  clearFlashMessage: (type) =>
    set((state) => {
      const { [type]: _, ...rest } = state.flashMessages
      return { flashMessages: rest }
    }),

  toggleMobileMenu: () =>
    set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),

  closeMobileMenu: () => set({ mobileMenuOpen: false }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}))