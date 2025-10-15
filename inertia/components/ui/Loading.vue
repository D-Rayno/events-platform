<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'spinner' | 'skeleton' | 'pulse'
  label?: string
  fullscreen?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'spinner',
  fullscreen: false,
})

const sizeClasses = {
  sm: 'w-6 h-6 border-2',
  md: 'w-10 h-10 border-4',
  lg: 'w-16 h-16 border-4',
}

const textSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

const containerClasses = computed(() => ({
  spinner: 'flex flex-col items-center justify-center gap-3',
  skeleton: 'space-y-3',
  pulse: 'flex items-center justify-center',
}))

const loadingIndicatorClasses = computed(() => ({
  spinner: 'animate-spin border-primary-200 border-t-primary-600 rounded-full',
  skeleton: 'h-4 bg-neutral-200 rounded animate-pulse',
  pulse: 'animate-pulse-glow',
}))
</script>

<template>
  <div
    :class="fullscreen ? 'fixed inset-0 bg-white/80 backdrop-blur-sm' : ''"
    class="flex items-center justify-center z-50"
  >
    <div :class="[containerClasses[variant], 'p-6']">
      <!-- Spinner -->
      <div
        v-if="variant === 'spinner'"
        :class="[sizeClasses[size], loadingIndicatorClasses.spinner]"
      />

      <!-- Skeleton -->
      <div v-if="variant === 'skeleton'" class="w-full max-w-sm space-y-3">
        <div class="h-4 bg-neutral-200 rounded animate-pulse" />
        <div class="h-4 bg-neutral-200 rounded animate-pulse w-5/6" />
        <div class="h-4 bg-neutral-200 rounded animate-pulse w-4/6" />
      </div>

      <!-- Pulse -->
      <div v-if="variant === 'pulse'" class="flex gap-1">
        <div
          class="w-2 h-2 bg-primary-600 rounded-full animate-bounce-light"
          :style="{ animationDelay: '0s' }"
        />
        <div
          class="w-2 h-2 bg-primary-500 rounded-full animate-bounce-light"
          :style="{ animationDelay: '0.1s' }"
        />
        <div
          class="w-2 h-2 bg-primary-400 rounded-full animate-bounce-light"
          :style="{ animationDelay: '0.2s' }"
        />
      </div>

      <!-- Label -->
      <p v-if="label" :class="[textSizeClasses[size], 'text-neutral-600 font-medium']">
        {{ label }}
      </p>
    </div>
  </div>
</template>
