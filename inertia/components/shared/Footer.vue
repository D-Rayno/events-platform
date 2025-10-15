<script setup lang="ts">
import { Link } from '@inertiajs/vue3'
import config from '~/theme.config.json'

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-neutral-900 text-neutral-300 border-t border-neutral-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <!-- Brand -->
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span class="text-xl font-bold text-white">{{ config.branding.logo.icon }}</span>
            </div>
            <span class="text-lg font-bold text-white">{{ config.branding.logo.text }}</span>
          </div>
          <p class="text-sm text-neutral-400">
            {{ config.app.description }}
          </p>
        </div>

        <!-- Navigation -->
        <div>
          <h3 class="font-semibold text-white mb-4">Plateforme</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <Link href="/" class="text-neutral-400 hover:text-white transition-colors">
                Accueil
              </Link>
            </li>
            <li>
              <Link href="/events" class="text-neutral-400 hover:text-white transition-colors">
                Événements
              </Link>
            </li>
            <li>
              <Link
                href="/registrations"
                class="text-neutral-400 hover:text-white transition-colors"
              >
                Mes Inscriptions
              </Link>
            </li>
            <li>
              <Link href="/profile" class="text-neutral-400 hover:text-white transition-colors">
                Profil
              </Link>
            </li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h3 class="font-semibold text-white mb-4">Support</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <a href="#" class="text-neutral-400 hover:text-white transition-colors"> Aide </a>
            </li>
            <li>
              <a href="#" class="text-neutral-400 hover:text-white transition-colors">
                Centre d'aide
              </a>
            </li>
            <li>
              <a href="#" class="text-neutral-400 hover:text-white transition-colors"> Contact </a>
            </li>
            <li>
              <a href="#" class="text-neutral-400 hover:text-white transition-colors"> FAQ </a>
            </li>
          </ul>
        </div>

        <!-- Legal -->
        <div>
          <h3 class="font-semibold text-white mb-4">Légal</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <a href="#" class="text-neutral-400 hover:text-white transition-colors">
                Conditions d'utilisation
              </a>
            </li>
            <li>
              <a href="#" class="text-neutral-400 hover:text-white transition-colors">
                Politique de confidentialité
              </a>
            </li>
            <li>
              <a href="#" class="text-neutral-400 hover:text-white transition-colors"> Cookies </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-neutral-800 py-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <!-- Copyright -->
          <p class="text-sm text-neutral-400">
            &copy; {{ currentYear }} {{ config.branding.logo.text }}. Tous droits réservés.
          </p>

          <!-- Social Links -->
          <div class="flex items-center gap-4">
            <a
              v-for="(url, platform) in config.social"
              :key="platform"
              :href="url"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`Suivez-nous sur ${platform}`"
              class="text-neutral-400 hover:text-white transition-colors"
            >
              <span class="capitalize text-sm font-medium">{{ platform }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
