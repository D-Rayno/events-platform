<script setup lang="ts">
import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'
import AppHeader from '../shared/AppHeader.vue'
import AppFooter from '../shared/AppFooter.vue'
import FlashMessages from '../shared/FlashMessages.vue'

interface Props {
  showHeader?: boolean
  showFooter?: boolean
  containerClass?: string
}

withDefaults(defineProps<Props>(), {
  showHeader: true,
  showFooter: true,
  containerClass: '',
})

const page = usePage()


const auth = computed(() => page.props.auth as { user?: any } | undefined)
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <AppHeader v-if="showHeader" :user="auth?.user" />

    <!-- Flash Messages -->
    <FlashMessages />

    <!-- Main Content -->
    <main class="flex-1">
      <div :class="containerClass">
        <slot />
      </div>
    </main>

    <!-- Footer -->
    <AppFooter v-if="showFooter" />
  </div>
</template>