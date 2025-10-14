<script setup lang="ts">
import { ref, computed } from 'vue'
import { Link, usePage } from '@inertiajs/vue3'
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'
import Button from '#ui/Button.vue'
import Avatar from '#ui/Avatar.vue'
import config from '~/info.config.json'

interface Props {
  user?: any
}

const props = withDefaults(defineProps<Props>(), {
  user: undefined,
})

const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)
const page = usePage()

const isActive = (name: string): boolean => {
  return page.component.startsWith(name)
}

const navLinks = computed(() => [
  { label: 'Événements', href: '/', name: 'events' },
  { label: 'Mes Inscriptions', href: '/registrations', name: 'registrations', auth: true },
  { label: 'Profil', href: '/profile', name: 'profile', auth: true },
])

const activeLinks = computed(() => {
  return navLinks.value.filter((link) => !link.auth || !!props.user)
})
</script>

<template>
  <header class="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <Link href="/" class="flex items-center gap-2 group">
          <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <span class="text-xl font-bold text-white">{{ config.branding.logo.icon }}</span>
          </div>
          <span class="text-xl font-bold text-neutral-900 hidden sm:inline group-hover:text-primary-600 transition-colors">
            {{ config.branding.logo.text }}
          </span>
        </Link>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-1">
          <template v-for="link in activeLinks" :key="link.href">
            <Link
              :href="link.href"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                isActive(link.name)
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-neutral-700 hover:bg-neutral-100'
              ]"
            >
              {{ link.label }}
            </Link>
          </template>
        </nav>

        <!-- Right Section -->
        <div class="flex items-center gap-4">
          <!-- Auth Section -->
          <div v-if="user" class="flex items-center gap-4">
            <!-- User Menu -->
            <div class="relative">
              <button
                @click="userMenuOpen = !userMenuOpen"
                class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors group"
              >
                <Avatar
                  :name="`${user.firstName} ${user.lastName}`"
                  :src="user.avatar"
                  size="sm"
                />
                <ChevronDownIcon
                  class="w-4 h-4 text-neutral-600 group-hover:text-neutral-900 transition-colors"
                  :class="{ 'rotate-180': userMenuOpen }"
                />
              </button>

              <!-- Dropdown Menu -->
              <div
                v-if="userMenuOpen"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 overflow-hidden animate-slide-down"
                @click.away="userMenuOpen = false"
              >
                <div class="px-4 py-3 border-b border-neutral-100">
                  <p class="text-sm font-medium text-neutral-900">
                    {{ user.firstName }} {{ user.lastName }}
                  </p>
                  <p class="text-xs text-neutral-500">{{ user.email }}</p>
                </div>

                <Link
                  href="/profile"
                  class="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                  @click="userMenuOpen = false"
                >
                  Profil
                </Link>

                <Link
                  href="/auth/logout"
                  method="post"
                  class="block w-full text-left px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
                  @click="userMenuOpen = false"
                >
                  Déconnexion
                </Link>
              </div>
            </div>
          </div>

          <!-- Guest Auth Links -->
          <template v-else>
            <Button
              variant="ghost"
              size="sm"
              href="/auth/login"
              class="hidden sm:inline-flex"
            >
              Connexion
            </Button>
            <Button
              variant="primary"
              size="sm"
              href="/auth/register"
            >
              S'inscrire
            </Button>
          </template>

          <!-- Mobile Menu Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <Bars3Icon v-if="!mobileMenuOpen" class="w-6 h-6 text-neutral-700" />
            <XMarkIcon v-else class="w-6 h-6 text-neutral-700" />
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div
        v-if="mobileMenuOpen"
        class="md:hidden border-t border-neutral-200 py-2 space-y-1 animate-slide-down"
      >
        <template v-for="link in activeLinks" :key="link.href">
          <Link
            :href="link.href"
            :class="[
              'block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              isActive(link.name)
                ? 'bg-primary-100 text-primary-700'
                : 'text-neutral-700 hover:bg-neutral-100'
            ]"
            @click="mobileMenuOpen = false"
          >
            {{ link.label }}
          </Link>
        </template>
      </div>
    </div>
  </header>
</template>