<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePage } from '@inertiajs/vue3'
import Alert from '#ui/Alert.vue'
import config from '~/theme.config.json'

interface FlashMessages {
  success?: string
  error?: string
  info?: string
  warning?: string
}

const page = usePage()
const dismissedFlash = ref<Set<string>>(new Set())

const flash = computed<FlashMessages>(() => {
  const props = page.props as any
  return {
    success: props.flash?.success,
    error: props.flash?.error,
    info: props.flash?.info,
    warning: props.flash?.warning,
  }
})

const visibleFlash = computed(() => {
  const visible: Record<string, string> = {}
  const entries = Object.entries(flash.value) as [keyof FlashMessages, string | undefined][]
  
  entries.forEach(([key, value]) => {
    if (value && !dismissedFlash.value.has(key)) {
      visible[key] = value
    }
  })
  return visible
})

const dismissFlash = (type: string) => {
  dismissedFlash.value.add(type)
}
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex flex-col relative overflow-hidden"
  >
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl"
        v-motion
        :initial="{ scale: 0, opacity: 0 }"
        :enter="{ scale: 1, opacity: 1, transition: { duration: 1000, ease: 'easeOut' } }"
      />
      <div
        class="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-200/30 rounded-full blur-3xl"
        v-motion
        :initial="{ scale: 0, opacity: 0 }"
        :enter="{
          scale: 1,
          opacity: 1,
          transition: { duration: 1000, delay: 200, ease: 'easeOut' },
        }"
      />
    </div>

    <!-- Header with Logo -->
    <header
      class="relative py-6 px-4"
      v-motion
      :initial="{ y: -20, opacity: 0 }"
      :enter="{ y: 0, opacity: 1, transition: { duration: 400 } }"
    >
      <div class="max-w-7xl mx-auto">
        <a href="/" class="inline-flex items-center gap-3 group">
          <div
            class="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
            v-motion
            :initial="{ rotate: -180, scale: 0 }"
            :enter="{
              rotate: 0,
              scale: 1,
              transition: { type: 'spring', stiffness: 200, delay: 100 },
            }"
          >
            <span class="text-xl font-bold text-white">{{ config.branding.logo.icon }}</span>
          </div>
          <span
            class="text-xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors duration-300"
          >
            {{ config.branding.logo.text }}
          </span>
        </a>
      </div>
    </header>

    <!-- Flash Messages -->
    <div v-if="Object.keys(visibleFlash).length" class="relative px-4 pb-4">
      <div class="max-w-md mx-auto space-y-2">
        <Alert
          v-for="(message, type) in visibleFlash"
          :key="type"
          :type="type as any"
          dismissible
          @dismiss="dismissFlash(type)"
        >
          {{ message }}
        </Alert>
      </div>
    </div>

    <!-- Main Content -->
    <main class="relative flex-1 flex items-center justify-center px-4 py-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer
      class="relative py-6 text-center text-sm text-neutral-600"
      v-motion
      :initial="{ y: 20, opacity: 0 }"
      :enter="{ y: 0, opacity: 1, transition: { duration: 400, delay: 200 } }"
    >
      <p>
        &copy; {{ new Date().getFullYear() }} {{ config.branding.logo.text }}. Tous droits réservés.
      </p>
    </footer>
  </div>
</template>