// ============================================
// 7. Enhanced Badge Component (inertia/components/ui/Badge.vue)
// ============================================
<script setup lang="ts">
import { computed } from 'vue'
import { motion } from 'motion-v'
import { use_theme } from '#composables/use_theme'

interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
  rounded?: boolean
  dot?: boolean
  pulse?: boolean
  outline?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'neutral',
  size: 'md',
  rounded: false,
  dot: false,
  pulse: false,
  outline: false,
})

const { getAnimation } = use_theme()

const variantClasses = {
  primary: props.outline
    ? 'bg-primary-50 text-primary-700 border-2 border-primary-300'
    : 'bg-primary-100 text-primary-700 border border-primary-200',
  secondary: props.outline
    ? 'bg-secondary-50 text-secondary-700 border-2 border-secondary-300'
    : 'bg-secondary-100 text-secondary-700 border border-secondary-200',
  success: props.outline
    ? 'bg-success-50 text-success-700 border-2 border-success-300'
    : 'bg-success-100 text-success-700 border border-success-200',
  error: props.outline
    ? 'bg-error-50 text-error-700 border-2 border-error-300'
    : 'bg-error-100 text-error-700 border border-error-200',
  warning: props.outline
    ? 'bg-warning-50 text-warning-700 border-2 border-warning-300'
    : 'bg-warning-100 text-warning-700 border border-warning-200',
  info: props.outline
    ? 'bg-info-50 text-info-700 border-2 border-info-300'
    : 'bg-info-100 text-info-700 border border-info-200',
  neutral: props.outline
    ? 'bg-neutral-50 text-neutral-700 border-2 border-neutral-300'
    : 'bg-neutral-100 text-neutral-700 border border-neutral-200',
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
}

const dotColors = {
  primary: 'bg-primary-500',
  secondary: 'bg-secondary-500',
  success: 'bg-success-500',
  error: 'bg-error-500',
  warning: 'bg-warning-500',
  info: 'bg-info-500',
  neutral: 'bg-neutral-500',
}

const badgeClasses = computed(() => [
  'inline-flex items-center gap-1.5 font-semibold transition-all duration-300',
  variantClasses[props.variant],
  sizeClasses[props.size],
  props.rounded ? 'rounded-full' : 'rounded-lg',
])
</script>

<template>
  <motion.span
    :class="badgeClasses"
    :initial="{ opacity: 0, scale: 0.8 }"
    :animate="{ opacity: 1, scale: 1 }"
    :whileHover="{ scale: 1.05 }"
    :transition="{ duration: getAnimation('fast') / 1000 }"
  >
    <motion.span
      v-if="dot"
      :class="['w-2 h-2 rounded-full', dotColors[variant]]"
      :animate="pulse ? { scale: [1, 1.3, 1], opacity: [1, 0.7, 1] } : {}"
      :transition="pulse ? { duration: 2, repeat: Infinity } : {}"
    />
    <slot />
  </motion.span>
</template>