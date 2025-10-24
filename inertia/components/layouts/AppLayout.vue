<script setup lang="ts">
import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'
import AppHeader from '#shared/Header.vue'
import AppFooter from '#shared/Footer.vue'
import FlashMessages from '#shared/FlashMessage.vue'
import { useAuthMiddleware } from '#composables/use_auth_middleware'
import { motion } from 'motion-v'

interface Props {
  showHeader?: boolean
  showFooter?: boolean
  containerClass?: string
  layout?: 'default' | 'auth' | 'full'
}

const props = withDefaults(defineProps<Props>(), {
  showHeader: true,
  showFooter: true,
  containerClass: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8',
  layout: 'default',
})

const page = usePage()
const auth = computed(() => page.props.auth as { user?: any } | undefined)

// Check authentication on mount if needed
const { requireAuth } = useAuthMiddleware()
</script>

<template>
  <div class="min-h-screen bg-neutral-50 flex flex-col antialiased">
    <AppHeader v-if="props.showHeader" :user="auth?.user" />
    <FlashMessages />

    <motion.main class="flex-1" :initial="{ opacity: 0 }" :enter="{ opacity: 1, transition: { duration: 300, delay: 100 } }">
      <div v-if="props.layout === 'full'" class="w-full">
        <slot />
      </div>
      <div v-else :class="props.containerClass">
        <slot />
      </div>
    </motion.main>

    <AppFooter v-if="props.showFooter" />
  </div>
</template>