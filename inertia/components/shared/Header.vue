<script setup lang="ts">
import { ref, computed } from 'vue'
import { Link, usePage, router } from '@inertiajs/vue3'
import { Bars3Icon, XMarkIcon, ChevronDownIcon, UserCircleIcon } from '@heroicons/vue/24/outline'
import Button from '#ui/Button.vue'
import Avatar from '#ui/Avatar.vue'
import { useAuthStore } from '~/stores/auth'
import { use_theme } from '~/composables/use_theme'

const authStore = useAuthStore()
const page = usePage()
const { config } = use_theme()

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
    class="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-neutral-200/80 shadow-sm"
    v-motion
    :initial="{ y: -100, opacity: 0 }"
    :enter="{ y: 0, opacity: 1, transition: { duration: 400, delay: 100 } }"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <Link href="/" class="flex items-center gap-3 group">
          <div
            class="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
          >
            <span class="text-2xl">{{ config.branding.logo.icon }}</span>
          </div>
          <span
            class="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent hidden sm:inline group-hover:from-primary-700 group-hover:to-secondary-700 transition-all"
          >
            {{ config.branding.logo.text }}
          </span>
        </Link>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-2">
          <Link
            v-for="(link, index) in activeLinks"
            :key="link.href"
            :href="link.href"
            :class="[
              'relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group',
              isActive(link.name)
                ? 'bg-primary-50 text-primary-700'
                : 'text-neutral-700 hover:bg-neutral-50',
            ]"
            v-motion
            :initial="{ opacity: 0, y: -10 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: 150 + index * 50 } }"
          >
            <span class="relative z-10">{{ link.label }}</span>
            <div
              v-if="isActive(link.name)"
              class="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-xl"
            />
          </Link>
        </nav>

        <!-- Right Section -->
        <div class="flex items-center gap-4">
          <!-- Authenticated User -->
          <div
            v-if="authStore.isAuthenticated && authStore.user"
            class="hidden md:flex items-center gap-4"
          >
            <div class="relative">
              <button
                @click="userMenuOpen = !userMenuOpen"
                class="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-50 transition-all group"
                aria-label="Menu utilisateur"
                :aria-expanded="userMenuOpen"
              >
                <Avatar :name="authStore.fullName" :src="authStore.avatarUrl" size="sm" />
                <div class="hidden lg:block text-left">
                  <div
                    class="text-sm font-medium text-neutral-900 group-hover:text-primary-600 transition-colors"
                  >
                    {{ authStore.user.firstName }}
                  </div>
                  <div class="text-xs text-neutral-500">Mon compte</div>
                </div>
                <ChevronDownIcon
                  :class="[
                    'w-4 h-4 text-neutral-600 transition-all duration-300',
                    userMenuOpen ? 'rotate-180 text-primary-600' : '',
                  ]"
                />
              </button>

              <!-- Dropdown Menu -->
              <Transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="transform opacity-0 scale-95 -translate-y-2"
                enter-to-class="transform opacity-100 scale-100 translate-y-0"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div
                  v-if="userMenuOpen"
                  v-click-away="() => (userMenuOpen = false)"
                  class="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden"
                >
                  <div
                    class="px-4 py-4 border-b border-neutral-100 bg-gradient-to-r from-primary-50 to-secondary-50"
                  >
                    <div class="flex items-center gap-3">
                      <Avatar :name="authStore.fullName" :src="authStore.avatarUrl" size="md" />
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-neutral-900 truncate">
                          {{ authStore.fullName }}
                        </p>
                        <p class="text-xs text-neutral-600 truncate">{{ authStore.user.email }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="py-2">
                    <Link
                      href="/profile"
                      class="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                      @click="userMenuOpen = false"
                    >
                      <UserCircleIcon class="w-5 h-5" />
                      <span>Mon profil</span>
                    </Link>

                    <Link
                      href="/registrations"
                      class="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                      @click="userMenuOpen = false"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <span>Mes inscriptions</span>
                    </Link>
                  </div>

                  <div class="border-t border-neutral-100">
                    <button
                      @click="handleLogout"
                      class="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-error-600 hover:bg-error-50 transition-colors"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Déconnexion</span>
                    </button>
                  </div>
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
            class="md:hidden p-2 hover:bg-neutral-100 rounded-xl transition-colors"
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
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <div
          v-if="mobileMenuOpen"
          class="md:hidden border-t border-neutral-200 py-4 space-y-2 bg-white/95 backdrop-blur-lg"
        >
          <Link
            v-for="link in activeLinks"
            :key="link.href"
            :href="link.href"
            :class="[
              'block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
              isActive(link.name)
                ? 'bg-primary-50 text-primary-700'
                : 'text-neutral-700 hover:bg-neutral-50',
            ]"
            @click="mobileMenuOpen = false"
          >
            {{ link.label }}
          </Link>

          <div
            v-if="!authStore.isAuthenticated"
            class="pt-2 border-t border-neutral-200 space-y-2 mt-4"
          >
            <Link
              href="/auth/login"
              class="block px-4 py-3 text-center rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-all"
              @click="mobileMenuOpen = false"
            >
              Connexion
            </Link>
            <Link
              href="/auth/register"
              class="block px-4 py-3 text-center rounded-xl text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 transition-all"
              @click="mobileMenuOpen = false"
            >
              S'inscrire
            </Link>
          </div>
        </div>
      </Transition>
    </div>
  </header>
</template>
