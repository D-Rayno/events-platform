<script setup lang="ts">
import { computed } from 'vue'
import { Link } from '@inertiajs/vue3'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  href?: string
  type?: 'button' | 'submit' | 'reset'
  iconLeft?: any
  iconRight?: any
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  loading: false,
  disabled: false,
  fullWidth: false,
})

const baseClasses =
  'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none relative overflow-hidden'

const variantClasses = {
  primary:
    'bg-gradient-to-br from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 focus:ring-primary-500 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5 active:translate-y-0',
  secondary:
    'bg-gradient-to-br from-secondary-600 to-secondary-700 text-white hover:from-secondary-700 hover:to-secondary-800 focus:ring-secondary-500 shadow-lg shadow-secondary-500/30 hover:shadow-xl hover:shadow-secondary-500/40 hover:-translate-y-0.5 active:translate-y-0',
  outline:
    'border-2 border-neutral-300 text-neutral-700 hover:border-primary-600 hover:text-primary-600 hover:bg-primary-50 focus:ring-primary-500 hover:-translate-y-0.5 active:translate-y-0',
  ghost:
    'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 focus:ring-neutral-500 hover:-translate-y-0.5 active:translate-y-0',
  danger:
    'bg-gradient-to-br from-error-600 to-error-700 text-white hover:from-error-700 hover:to-error-800 focus:ring-error-500 shadow-lg shadow-error-500/30 hover:shadow-xl hover:shadow-error-500/40 hover:-translate-y-0.5 active:translate-y-0',
  success:
    'bg-gradient-to-br from-success-600 to-success-700 text-white hover:from-success-700 hover:to-success-800 focus:ring-success-500 shadow-lg shadow-success-500/30 hover:shadow-xl hover:shadow-success-500/40 hover:-translate-y-0.5 active:translate-y-0',
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm gap-2',
  md: 'px-6 py-3 text-base gap-2.5',
  lg: 'px-8 py-4 text-lg gap-3',
}

const buttonClasses = computed(() => [
  baseClasses,
  variantClasses[props.variant],
  sizeClasses[props.size],
  props.fullWidth ? 'w-full' : '',
])

const iconSize = computed(() => {
  const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' }
  return sizes[props.size]
})

const isDisabled = computed(() => props.disabled || props.loading)
</script>

<template>
  <component
    :is="href ? Link : 'button'"
    :href="href"
    :type="href ? undefined : type"
    :disabled="isDisabled"
    :class="buttonClasses"
    v-motion
    :initial="{ opacity: 0, scale: 0.9 }"
    :enter="{ opacity: 1, scale: 1, transition: { duration: 200, type: 'spring', stiffness: 300 } }"
  >
    <span v-if="loading" class="absolute inset-0 flex items-center justify-center">
      <svg
        :class="['animate-spin', iconSize]"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </span>

    <span :class="loading ? 'invisible' : 'flex items-center gap-2'">
      <component :is="iconLeft" v-if="iconLeft" :class="iconSize" />
      <slot />
      <component :is="iconRight" v-if="iconRight" :class="iconSize" />
    </span>
  </component>
</template>
