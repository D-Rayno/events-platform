<script setup lang="ts">
import { ref } from 'vue'
import { Link } from '@inertiajs/vue3'
import { useTheme } from '../../composables/useTheme'
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  TicketIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/vue/24/outline'

interface Props {
  user?: {
    id: number
    firstName: string
    lastName: string
    email: string
    avatarUrl?: string
  }
}

defineProps<Props>()

const { appName, logo } = useTheme()
const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)

const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'Événements', href: '/events' },
]
</script>

<template>
  <header class="bg-white shadow-sm sticky top-0 z-40">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Navigation principale">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <Link href="/" class="flex items-center space-x-2">
            <span class="text-2xl">{{ logo.icon }}</span>
            <span class="text-xl font-bold text-gray-900">{{ appName }}</span>
          </Link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <Link
            v-for="item in navigation"
            :key="item.name"
            :href="item.href"
            class="text-gray-700 hover:text-primary font-medium transition"
          >
            {{ item.name }}
          </Link>
        </div>

        <!-- User Menu / Auth Links -->
        <div class="hidden md:flex items-center space-x-4">
          <template v-if="user">
            <!-- User Dropdown -->
            <div class="relative">
              <button
                @click="userMenuOpen = !userMenuOpen"
                class="flex items-center space-x-2 text-gray-700 hover:text-primary transition"
              >
                <UserCircleIcon class="h-8 w-8" />
                <span class="font-medium">{{ user.firstName }}</span>
              </button>

              <!-- Dropdown Menu -->
              <div
                v-show="userMenuOpen"
                @click="userMenuOpen = false"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200"
              >
                <Link
                  href="/profile"
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <UserCircleIcon class="h-5 w-5 mr-2" />
                  Mon Profil
                </Link>
                <Link
                  href="/registrations"
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <TicketIcon class="h-5 w-5 mr-2" />
                  Mes Inscriptions
                </Link>
                <hr class="my-1" />
                <Link
                  href="/auth/logout"
                  method="post"
                  as="button"
                  class="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <ArrowRightOnRectangleIcon class="h-5 w-5 mr-2" />
                  Déconnexion
                </Link>
              </div>
            </div>
          </template>

          <template v-else>
            <Link
              href="/auth/login"
              class="text-gray-700 hover:text-primary font-medium transition"
            >
              Connexion
            </Link>
            <Link
              href="/auth/register"
              class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 font-medium transition"
            >
              S'inscrire
            </Link>
          </template>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="text-gray-700 hover:text-primary"
          >
            <Bars3Icon v-if="!mobileMenuOpen" class="h-6 w-6" />
            <XMarkIcon v-else class="h-6 w-6" />
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-show="mobileMenuOpen" class="md:hidden py-4 space-y-2">
        <Link
          v-for="item in navigation"
          :key="item.name"
          :href="item.href"
          class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          @click="mobileMenuOpen = false"
        >
          {{ item.name }}
        </Link>

        <hr class="my-2" />

        <template v-if="user">
          <Link
            href="/profile"
            class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            @click="mobileMenuOpen = false"
          >
            Mon Profil
          </Link>
          <Link
            href="/registrations"
            class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            @click="mobileMenuOpen = false"
          >
            Mes Inscriptions
          </Link>
          <Link
            href="/auth/logout"
            method="post"
            as="button"
            class="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
            @click="mobileMenuOpen = false"
          >
            Déconnexion
          </Link>
        </template>

        <template v-else>
          <Link
            href="/auth/login"
            class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            @click="mobileMenuOpen = false"
          >
            Connexion
          </Link>
          <Link
            href="/auth/register"
            class="block px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-lg text-center"
            @click="mobileMenuOpen = false"
          >
            S'inscrire
          </Link>
        </template>
      </div>
    </nav>
  </header>
</template>