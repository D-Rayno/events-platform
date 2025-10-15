<script setup lang="ts">
import { computed, ref } from 'vue'
import { UserCircleIcon } from '@heroicons/vue/24/solid'

interface Props {
  src?: string
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  shape?: 'circle' | 'square'
  status?: 'online' | 'offline' | 'away' | 'busy'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  shape: 'circle',
  alt: 'Avatar',
})

const imageError = ref(false)

const sizeClasses = {
  'xs': 'w-6 h-6 text-xs',
  'sm': 'w-8 h-8 text-sm',
  'md': 'w-10 h-10 text-base',
  'lg': 'w-12 h-12 text-lg',
  'xl': 'w-16 h-16 text-xl',
  '2xl': 'w-20 h-20 text-2xl',
}

const shapeClasses = {
  circle: 'rounded-full',
  square: 'rounded-lg',
}

const statusColors = {
  online: 'bg-success-500',
  offline: 'bg-neutral-400',
  away: 'bg-warning-500',
  busy: 'bg-error-500',
}

const statusSize = {
  'xs': 'w-1.5 h-1.5',
  'sm': 'w-2 h-2',
  'md': 'w-2.5 h-2.5',
  'lg': 'w-3 h-3',
  'xl': 'w-3.5 h-3.5',
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

const handleImageError = () => {
  imageError.value = true
}
</script>

<template>
  <div class="relative inline-block">
    <div
      :class="[
        'flex items-center justify-center overflow-hidden',
        sizeClasses[size],
        shapeClasses[shape],
        showImage ? '' : 'bg-primary-100 text-primary-600 font-semibold',
      ]"
    >
      <img
        v-if="showImage"
        :src="src"
        :alt="alt"
        class="w-full h-full object-cover"
        @error="handleImageError"
      />
      <span v-else-if="initials">{{ initials }}</span>
      <UserCircleIcon v-else class="w-full h-full text-neutral-300" />
    </div>

    <span
      v-if="status"
      :class="[
        'absolute bottom-0 right-0 rounded-full border-2 border-white',
        statusColors[status],
        statusSize[size],
      ]"
      :title="status"
    />
  </div>
</template>
