// ============================================
// 2. Enhanced Button Component (inertia/components/ui/Button.vue)
// ============================================
<script setup lang="ts">
import { computed } from 'vue'
import { Link } from '@inertiajs/vue3'
import { motion } from 'motion-v'
import { use_theme } from '#composables/use_theme'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'gradient'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  href?: string
  type?: 'button' | 'submit' | 'reset'
  iconLeft?: any
  iconRight?: any
  rounded?: 'sm' | 'md' | 'lg' | 'full'
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  pulse?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  rounded: 'lg',
  shadow: 'md',
})

const { getAnimation } = use_theme()

const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group'

const variantClasses = {
  primary: 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white focus:ring-primary-500/30 active:scale-[0.98]',
  secondary: 'bg-gradient-to-r from-secondary-600 to-secondary-700 hover:from-secondary-700 hover:to-secondary-800 text-white focus:ring-secondary-500/30 active:scale-[0.98]',
  outline: 'border-2 border-neutral-300 hover:border-primary-600 hover:bg-primary-50 text-neutral-700 hover:text-primary-700 focus:ring-primary-500/20 active:scale-[0.98]',
  ghost: 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 focus:ring-neutral-500/20 active:scale-[0.98]',
  danger: 'bg-gradient-to-r from-error-600 to-error-700 hover:from-error-700 hover:to-error-800 text-white focus:ring-error-500/30 active:scale-[0.98]',
  success: 'bg-gradient-to-r from-success-600 to-success-700 hover:from-success-700 hover:to-success-800 text-white focus:ring-success-500/30 active:scale-[0.98]',
  gradient: 'bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-size-200 hover:bg-pos-100 text-white focus:ring-primary-500/30 active:scale-[0.98]',
}

const sizeClasses = {
  xs: 'px-3 py-1.5 text-xs gap-1.5',
  sm: 'px-4 py-2 text-sm gap-2',
  md: 'px-5 py-2.5 text-base gap-2',
  lg: 'px-6 py-3 text-lg gap-2.5',
  xl: 'px-8 py-4 text-xl gap-3',
}

const roundedClasses = {
  sm: 'rounded-md',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  full: 'rounded-full',
}

const shadowClasses = {
  none: '',
  sm: 'shadow-sm hover:shadow',
  md: 'shadow-md hover:shadow-lg',
  lg: 'shadow-lg hover:shadow-xl',
  xl: 'shadow-xl hover:shadow-2xl',
}

const buttonClasses = computed(() => [
  baseClasses,
  variantClasses[props.variant],
  sizeClasses[props.size],
  roundedClasses[props.rounded],
  shadowClasses[props.shadow],
  props.fullWidth ? 'w-full' : '',
  props.pulse ? 'animate-pulse' : '',
])

const iconSize = computed(() => {
  const sizes = { xs: 'w-3.5 h-3.5', sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6', xl: 'w-7 h-7' }
  return sizes[props.size]
})

const isDisabled = computed(() => props.disabled || props.loading)

const buttonAnimation = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  whileHover: { scale: isDisabled.value ? 1 : 1.02 },
  whileTap: { scale: isDisabled.value ? 1 : 0.98 },
  transition: { duration: getAnimation('fast') / 1000 },
}
</script>

<template>
  <component
    :is="href ? Link : motion.button"
    v-bind="buttonAnimation"
    :href="href"
    :type="href ? undefined : type"
    :disabled="isDisabled"
    :class="buttonClasses"
  >
    <!-- Shimmer Effect -->
    <span
      v-if="!loading && !disabled"
      class="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"
    />

    <!-- Loading State -->
    <span v-if="loading" class="inline-flex items-center gap-2">
      <motion.svg
        :class="iconSize"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        :animate="{ rotate: 360 }"
        :transition="{ duration: 1, repeat: Infinity, ease: 'linear' }"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </motion.svg>
      <span>Loading...</span>
    </span>

    <!-- Content -->
    <span v-else class="relative z-10 inline-flex items-center gap-2">
      <component v-if="iconLeft" :is="iconLeft" :class="iconSize" />
      <slot />
      <component v-if="iconRight" :is="iconRight" :class="iconSize" />
    </span>
  </component>
</template>

<style scoped>
.bg-size-200 {
  background-size: 200% 200%;
}
.bg-pos-100 {
  background-position: 100% 0;
}
</style>