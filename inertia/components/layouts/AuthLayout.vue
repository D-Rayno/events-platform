<script setup lang="ts">
import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'
import Alert from '../ui/Alert.vue'
import config from '../../info.config.json'

const page = usePage()

const flash = computed(() => ({
  success: page.props.flash?.success,
  error: page.props.flash?.error,
  info: page.props.flash?.info
}))

const dismissFlash = (type: 'success' | 'error' | 'info') => {
  if (flash.value[type]) {
    flash.value[type] = null
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10 flex flex-col">
    <!-- Header with Logo -->
    <header class="py-6 px-4">
      <div class="max-w-7xl mx-auto">
        <a href="/" class="inline-flex items-center gap-2 group">
          <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <span class="text-xl font-bold text-sand-12 group-hover:text-primary transition-colors">
            {{ config.app.name }}
          </span>
        </a>
      </div>
    </header>

    <!-- Flash Messages -->
    <div v-if="flash.success || flash.error || flash.info" class="px-4 pb-4">
      <div class="max-w-md mx-auto space-y-2">
        <Alert v-if="flash.success" type="success" dismissible @dismiss="dismissFlash('success')">
          {{ flash.success }}
        </Alert>
        <Alert v-if="flash.error" type="error" dismissible @dismiss="dismissFlash('error')">
          {{ flash.error }}
        </Alert>
        <Alert v-if="flash.info" type="info" dismissible @dismiss="dismissFlash('info')">
          {{ flash.info }}
        </Alert>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-1 flex items-center justify-center px-4 py-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="py-6 text-center text-sm text-sand-10">
      <p>&copy; {{ new Date().getFullYear() }} {{ config.app.name }}. Tous droits réservés.</p>
    </footer>
  </div>
</template>