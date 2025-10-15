<script setup lang="ts">
import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'
import AppHeader from '@/components/shared/Header.vue'
import AppFooter from '@/components/shared/Footer.vue'
import FlashMessages from '@/components/shared/FlashMessage.vue'

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
  <div class="min-h-screen bg-neutral-50 flex flex-col antialiased">
    <AppHeader v-if="showHeader" :user="auth?.user" />
    <FlashMessages />

    <main
      class="flex-1"
      v-motion
      :initial="{ opacity: 0 }"
      :enter="{ opacity: 1, transition: { duration: 300, delay: 100 } }"
    >
      <div :class="containerClass">
        <slot />
      </div>
    </main>

    <AppFooter v-if="showFooter" />
  </div>
</template>
