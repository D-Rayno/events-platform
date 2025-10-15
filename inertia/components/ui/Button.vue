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
  'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden'

const variantClasses = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0',
  secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0',
  outline: 'border-2 border-neutral-300 text-neutral-700 hover:border-primary-600 hover:text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
  ghost: 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 focus:ring-neutral-500',
  danger: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500 shadow-md hover:shadow-lg',
  success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500 shadow-md hover:shadow-lg',
}

const sizeClasses = {
  sm: 'px-3 py-2 text-sm gap-1.5',
  md: 'px-4 py-2.5 text-base gap-2',
  lg: 'px-6 py-3 text-lg gap-2.5',
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
    :initial="{ opacity: 0, scale: 0.95 }"
    :enter="{ opacity: 1, scale: 1, transition: { duration: 150, type: 'spring', stiffness: 300 } }"
  >
    <!-- Loading State -->
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

    <!-- Content -->
    <span :class="loading ? 'invisible' : 'inline-flex items-center gap-2'">
      <component v-if="iconLeft" :is="iconLeft" :class="iconSize" />
      <slot />
      <component v-if="iconRight" :is="iconRight" :class="iconSize" />
    </span>
  </component>
</template>