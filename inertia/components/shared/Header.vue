<script setup lang="ts">
import { ref, computed } from 'vue'
import { Link, usePage, router } from '@inertiajs/vue3'
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'
import Button from '#ui/Button.vue'
import Avatar from '#ui/Avatar.vue'
import { useAuthStore } from '~/stores/auth'
import config from '~/info.config.json'

const authStore = useAuthStore()
const page = usePage()
const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)

const isActive = (name: string): boolean => {
  return page.component.startsWith(name)
}

const navLinks = computed(() => [
  { label: 'Événements', href: '/events', name: 'events' },
  { label: 'Mes Inscriptions', href: '/registrations', name: 'registrations', auth: true },
  { label: 'Profil', href: '/profile', name: 'profile', auth: true },
])

const activeLinks = computed(() => {
  return navLinks.value.filter((link) => !link.auth || authStore.isAuthenticated)
})

const handleLogout = () => {
  router.post(
    '/auth/logout',
    {},
    {
      onSuccess: () => {
        authStore.clearUser()
        userMenuOpen.value = false
      },
    }
  )
}
</script>

<template>
  <header
    class="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-200 shadow-sm"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <Link href="/" class="flex items-center gap-2 group">
          <div
            class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105"
            v-motion
            :initial="{ rotate: -180, scale: 0 }"
            :enter="{ rotate: 0, scale: 1, transition: { type: 'spring', stiffness: 200 } }"
          >
            <span class="text-xl font-bold text-white">{{ config.branding.logo.icon }}</span>
          </div>
          <span
            class="text-xl font-bold text-neutral-900 hidden sm:inline group-hover:text-primary-600 transition-colors"
          >
            {{ config.branding.logo.text }}
          </span>
        </Link>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-1">
          <Link
            v-for="(link, index) in activeLinks"
            :key="link.href"
            :href="link.href"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              isActive(link.name)
                ? 'bg-primary-100 text-primary-700'
                : 'text-neutral-700 hover:bg-neutral-100',
            ]"
            v-motion
            :initial="{ opacity: 0, y: -10 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: 50 * index } }"
          >
            {{ link.label }}
          </Link>
        </nav>

        <!-- Right Section -->
        <div class="flex items-center gap-4">
          <!-- Authenticated User -->
          <div v-if="authStore.isAuthenticated && authStore.user" class="flex items-center gap-4">
            <div class="relative">
              <button
                @click="userMenuOpen = !userMenuOpen"
                class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors group"
                aria-label="Menu utilisateur"
                aria-expanded="userMenuOpen"
              >
                <Avatar :name="authStore.fullName" :src="authStore.user.avatar" size="sm" />
                <ChevronDownIcon
                  class="w-4 h-4 text-neutral-600 group-hover:text-neutral-900 transition-all duration-200"
                  :class="{ 'rotate-180': userMenuOpen }"
                />
              </button>

              <!-- Dropdown Menu -->
              <Transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div
                  v-if="userMenuOpen"
                  v-click-away="() => (userMenuOpen = false)"
                  class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden"
                >
                  <div class="px-4 py-3 border-b border-neutral-100 bg-neutral-50">
                    <p class="text-sm font-medium text-neutral-900">
                      {{ authStore.fullName }}
                    </p>
                    <p class="text-xs text-neutral-500 truncate">{{ authStore.user.email }}</p>
                  </div>

                  <Link
                    href="/profile"
                    class="block w-full text-left px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                    @click="userMenuOpen = false"
                  >
                    Mon profil
                  </Link>

                  <Link
                    href="/registrations"
                    class="block w-full text-left px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                    @click="userMenuOpen = false"
                  >
                    Mes inscriptions
                  </Link>

                  <button
                    @click="handleLogout"
                    class="block w-full text-left px-4 py-2.5 text-sm text-error-600 hover:bg-error-50 transition-colors border-t border-neutral-100"
                  >
                    Déconnexion
                  </button>
                </div>
              </Transition>
            </div>
          </div>

          <!-- Guest Auth Links -->
          <template v-else>
            <Button variant="ghost" size="sm" href="/auth/login" class="hidden sm:inline-flex">
              Connexion
            </Button>
            <Button variant="primary" size="sm" href="/auth/register"> S'inscrire </Button>
          </template>

          <!-- Mobile Menu Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            aria-label="Menu de navigation"
          >
            <Bars3Icon v-if="!mobileMenuOpen" class="w-6 h-6 text-neutral-700" />
            <XMarkIcon v-else class="w-6 h-6 text-neutral-700" />
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="transform opacity-0 -translate-y-2"
        enter-to-class="transform opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="transform opacity-100 translate-y-0"
        leave-to-class="transform opacity-0 -translate-y-2"
      >
        <div v-if="mobileMenuOpen" class="md:hidden border-t border-neutral-200 py-2 space-y-1">
          <Link
            v-for="link in activeLinks"
            :key="link.href"
            :href="link.href"
            :class="[
              'block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              isActive(link.name)
                ? 'bg-primary-100 text-primary-700'
                : 'text-neutral-700 hover:bg-neutral-100',
            ]"
            @click="mobileMenuOpen = false"
          >
            {{ link.label }}
          </Link>
        </div>
      </Transition>
    </div>
  </header>
</template>
