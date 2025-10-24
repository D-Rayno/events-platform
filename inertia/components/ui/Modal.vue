// ============================================
// 6. Enhanced Modal Component (inertia/components/ui/Modal.vue)
// ============================================
<script setup lang="ts">
import { watch, onUnmounted } from 'vue'
import { AnimatePresence, motion } from 'motion-v'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { use_theme } from '#composables/use_theme'

interface Props {
  show?: boolean
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
  closable?: boolean
  title?: string
  closeOnBackdrop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  maxWidth: 'md',
  closable: true,
  closeOnBackdrop: true,
})

const emit = defineEmits<{ close: [] }>()
const { getAnimation } = use_theme()

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  full: 'max-w-full mx-4',
}

const close = () => {
  if (props.closable) emit('close')
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) close()
}

watch(
  () => props.show,
  (show) => {
    document.body.style.overflow = show ? 'hidden' : ''
  }
)

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <AnimatePresence>
      <motion.div v-if="props.show" class="fixed inset-0 z-50 flex items-center justify-center p-4"
        :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :exit="{ opacity: 0 }"
        :transition="{ duration: getAnimation('fast') / 1000 }">
        <!-- Backdrop -->
        <motion.div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="handleBackdropClick"
          :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :exit="{ opacity: 0 }" />

        <!-- Modal -->
        <motion.div :class="['w-full bg-white rounded-2xl shadow-2xl relative z-10', maxWidthClasses[props.maxWidth]]"
          :initial="{ opacity: 0, scale: 0.9, y: 20 }" :animate="{ opacity: 1, scale: 1, y: 0 }"
          :exit="{ opacity: 0, scale: 0.9, y: 20 }"
          :transition="{ duration: getAnimation('normal') / 1000, type: 'spring', stiffness: 300 }" role="dialog"
          aria-modal="true">
          <!-- Header -->
          <div v-if="props.title || props.closable"
            class="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
            <motion.h3 v-if="props.title" class="text-xl font-bold text-neutral-900" :initial="{ opacity: 0, x: -20 }"
              :animate="{ opacity: 1, x: 0 }" :transition="{ delay: 0.1 }">
              {{ props.title }}
            </motion.h3>
            <motion.button v-if="props.closable" @click="close"
              class="text-neutral-400 hover:text-neutral-600 transition-colors rounded-lg p-2 hover:bg-neutral-100"
              :whileHover="{ scale: 1.1, rotate: 90 }" :whileTap="{ scale: 0.9 }" aria-label="Fermer">
              <XMarkIcon class="w-6 h-6" />
            </motion.button>
          </div>

          <!-- Body -->
          <motion.div class="px-6 py-4" :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
            :transition="{ delay: 0.15 }">
            <slot />
          </motion.div>

          <!-- Footer -->
          <motion.div v-if="$slots.footer" class="px-6 py-4 border-t border-neutral-200 bg-neutral-50 rounded-b-2xl"
            :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: 0.2 }">
            <slot name="footer" />
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  </Teleport>
</template>