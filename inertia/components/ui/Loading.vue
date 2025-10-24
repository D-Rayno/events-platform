// ============================================
// 9. Enhanced Loading Component (inertia/components/ui/Loading.vue)
// ============================================
<script setup lang="ts">
;

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars'
  label?: string
  fullscreen?: boolean
  color?: 'primary' | 'secondary' | 'white'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'spinner',
  color: 'primary',
})

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
}

const colorClasses = {
  primary: 'border-primary-200 border-t-primary-600',
  secondary: 'border-secondary-200 border-t-secondary-600',
  white: 'border-white/20 border-t-white',
}

const dotColorClasses = {
  primary: 'bg-primary-600',
  secondary: 'bg-secondary-600',
  white: 'bg-white',
}
</script>

<template>
  <div :class="props.fullscreen ? 'fixed inset-0 bg-white/90 backdrop-blur-sm z-50' : ''" class="flex items-center justify-center">
    <div class="flex flex-col items-center gap-4">
      <!-- Spinner -->
      <motion.div
        v-if="props.variant === 'spinner'"
        :class="[sizeClasses[props.size], colorClasses[props.color], 'rounded-full border-4']"
        :animate="{ rotate: 360 }"
        :transition="{ duration: 1, repeat: Infinity, ease: 'linear' }"
      />

      <!-- Dots -->
      <div v-else-if="props.variant === 'dots'" class="flex gap-2">
        <motion.div
          v-for="i in 3"
          :key="i"
          :class="[dotColorClasses[props.color], 'w-3 h-3 rounded-full']"
          :animate="{ y: [-8, 0, -8] }"
          :transition="{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }"
        />
      </div>

      <!-- Pulse -->
      <div v-else-if="props.variant === 'pulse'" class="relative">
        <motion.div
          :class="[sizeClasses[props.size], dotColorClasses[props.color], 'rounded-full']"
          :animate="{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }"
          :transition="{ duration: 1.5, repeat: Infinity }"
        />
      </div>

      <!-- Bars -->
      <div v-else-if="props.variant === 'bars'" class="flex gap-1.5">
        <motion.div
          v-for="i in 4"
          :key="i"
          :class="[dotColorClasses[props.color], 'w-2 rounded-full']"
          :animate="{ height: ['16px', '40px', '16px'] }"
          :transition="{ duration: 1, repeat: Infinity, delay: i * 0.1 }"
        />
      </div>

      <!-- Label -->
      <motion.p
        v-if="props.label"
        class="text-sm font-medium text-neutral-600"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :transition="{ delay: 0.2 }"
      >
        {{ props.label }}
      </motion.p>
    </div>
  </div>
</template>