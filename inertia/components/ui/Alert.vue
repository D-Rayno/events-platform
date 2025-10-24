// ============================================
// 5. Enhanced Alert Component (inertia/components/ui/Alert.vue)
// ============================================
<script setup lang="ts">
import { computed } from 'vue'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import { use_theme } from '#composables/use_theme'

interface Props {
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  dismissible?: boolean
  variant?: 'default' | 'left-accent' | 'top-accent' | 'solid'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  variant: 'default',
})

const emit = defineEmits<{ dismiss: [] }>()
const { getAnimation } = use_theme()

const config = {
  success: {
    icon: CheckCircleIcon,
    default: 'bg-success-50 border-success-200 text-success-800',
    solid: 'bg-success-600 text-white',
    accent: 'border-l-4 border-success-600 bg-success-50',
    iconColor: 'text-success-600',
  },
  error: {
    icon: XCircleIcon,
    default: 'bg-error-50 border-error-200 text-error-800',
    solid: 'bg-error-600 text-white',
    accent: 'border-l-4 border-error-600 bg-error-50',
    iconColor: 'text-error-600',
  },
  warning: {
    icon: ExclamationTriangleIcon,
    default: 'bg-warning-50 border-warning-200 text-warning-800',
    solid: 'bg-warning-600 text-white',
    accent: 'border-l-4 border-warning-600 bg-warning-50',
    iconColor: 'text-warning-600',
  },
  info: {
    icon: InformationCircleIcon,
    default: 'bg-info-50 border-info-200 text-info-800',
    solid: 'bg-info-600 text-white',
    accent: 'border-l-4 border-info-600 bg-info-50',
    iconColor: 'text-info-600',
  },
}

const alertConfig = computed(() => config[props.type])

const alertClasses = computed(() => {
  const base = 'border rounded-xl p-4 flex gap-3'
  if (props.variant === 'solid') return `${base} ${alertConfig.value.solid}`
  if (props.variant === 'left-accent') return `${base} ${alertConfig.value.accent}`
  return `${base} ${alertConfig.value.default}`
})

const iconClasses = computed(() =>
  props.variant === 'solid' ? 'text-white' : alertConfig.value.iconColor
)
</script>

<template>
  <motion.div
    :class="alertClasses"
    role="alert"
    :initial="{ opacity: 0, x: -50, scale: 0.95 }"
    :animate="{ opacity: 1, x: 0, scale: 1 }"
    :exit="{ opacity: 0, x: 50, scale: 0.95 }"
    :transition="{ duration: getAnimation('normal') / 1000, type: 'spring', stiffness: 200 }"
  >
    <motion.div
      :animate="{ rotate: [0, 10, -10, 0] }"
      :transition="{ duration: 0.5, repeat: 2 }"
    >
      <component :is="alertConfig.icon" :class="['w-6 h-6 shrink-0', iconClasses]" />
    </motion.div>

    <div class="flex-1 min-w-0">
      <h3 v-if="title" class="font-semibold mb-1">{{ title }}</h3>
      <div class="text-sm">
        <slot />
      </div>
    </div>

    <motion.button
      v-if="dismissible"
      @click="emit('dismiss')"
      class="shrink-0 transition-colors rounded-lg p-1"
      :class="variant === 'solid' ? 'hover:bg-white/20' : 'hover:bg-black/5'"
      :whileHover="{ scale: 1.1, rotate: 90 }"
      :whileTap="{ scale: 0.9 }"
      aria-label="Fermer"
    >
      <XMarkIcon class="w-5 h-5" />
    </motion.button>
  </motion.div>
</template>