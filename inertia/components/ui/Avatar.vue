// ============================================
// 10. Enhanced Avatar Component (inertia/components/ui/Avatar.vue)
// ============================================
<script setup lang="ts">
import { computed, ref } from 'vue'

import { UserCircleIcon } from '@heroicons/vue/24/solid'
import { use_theme } from '#composables/use_theme'

interface Props {
  src?: string
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  shape?: 'circle' | 'square' | 'rounded'
  status?: 'online' | 'offline' | 'away' | 'busy'
  ring?: boolean
  ringColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  shape: 'circle',
  alt: 'Avatar',
})

const { getAnimation } = use_theme()
const imageError = ref(false)

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-20 h-20 text-2xl',
}

const shapeClasses = {
  circle: 'rounded-full',
  square: 'rounded-none',
  rounded: 'rounded-xl',
}

const statusColors = {
  online: 'bg-success-500 ring-white',
  offline: 'bg-neutral-400 ring-white',
  away: 'bg-warning-500 ring-white',
  busy: 'bg-error-500 ring-white',
}

const statusSize = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-3.5 h-3.5',
  '2xl': 'w-4 h-4',
}

const initials = computed(() => {
  if (!props.name) return ''
  return props.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const showImage = computed(() => props.src && !imageError.value)
</script>

<template>
  <motion.div class="relative inline-block" :initial="{ opacity: 0, scale: 0.8 }" :animate="{ opacity: 1, scale: 1 }"
    :whileHover="{ scale: 1.05 }" :transition="{ duration: getAnimation('fast') / 1000 }">
    <div :class="[
      'flex items-center justify-center overflow-hidden transition-all duration-300',
      sizeClasses[props.size],
      shapeClasses[props.shape],
      showImage ? '' : 'bg-gradient-to-br from-primary-400 to-secondary-500 text-white font-bold',
      props.ring && 'ring-4 ring-primary-500/20',
    ]">
      <img v-if="showImage" :src="props.src" :alt="props.alt" class="w-full h-full object-cover" @error="imageError = true" />
      <span v-else-if="initials">{{ initials }}</span>
      <UserCircleIcon v-else class="w-full h-full text-neutral-300" />
    </div>

    <!-- Status Indicator -->
    <motion.span v-if="status" :class="[
      'absolute bottom-0 right-0 rounded-full border-2',
      statusColors[status],
      statusSize[size],
    ]" :initial="{ scale: 0 }" :animate="{ scale: 1 }" :transition="{ delay: 0.2, type: 'spring', stiffness: 500 }"
      :title="status" />
  </motion.div>
</template>