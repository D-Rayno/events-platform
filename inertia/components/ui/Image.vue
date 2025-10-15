<script setup lang="ts">
import { ref, computed } from 'vue'
import { PhotoIcon } from '@heroicons/vue/24/outline'

interface Props {
  src?: string
  alt?: string
  fallback?: string
  aspectRatio?: '1/1' | '4/3' | '16/9' | '21/9' | 'auto'
  objectFit?: 'cover' | 'contain' | 'fill' | 'none'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  loading?: 'lazy' | 'eager'
}

const props = withDefaults(defineProps<Props>(), {
  alt: 'Image',
  aspectRatio: 'auto',
  objectFit: 'cover',
  rounded: 'md',
  loading: 'lazy',
})

const imageLoaded = ref(false)
const imageError = ref(false)

const aspectRatioClasses = {
  '1/1': 'aspect-square',
  '4/3': 'aspect-[4/3]',
  '16/9': 'aspect-video',
  '21/9': 'aspect-[21/9]',
  'auto': '',
}

const objectFitClasses = {
  cover: 'object-cover',
  contain: 'object-contain',
  fill: 'object-fill',
  none: 'object-none',
}

const roundedClasses = {
  none: '',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
}

const containerClasses = computed(() => [
  'relative overflow-hidden bg-neutral-100',
  aspectRatioClasses[props.aspectRatio],
  roundedClasses[props.rounded],
])

const imageClasses = computed(() => [
  'w-full h-full transition-opacity duration-300',
  objectFitClasses[props.objectFit],
  imageLoaded.value ? 'opacity-100' : 'opacity-0',
])

const handleLoad = () => {
  imageLoaded.value = true
}

const handleError = () => {
  imageError.value = true
}

const displaySrc = computed(() => {
  if (imageError.value && props.fallback) {
    return props.fallback
  }
  return props.src
})
</script>

<template>
  <div :class="containerClasses">
    <!-- Skeleton loader -->
    <div
      v-if="!imageLoaded"
      class="absolute inset-0 bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-100 animate-pulse"
    />

    <!-- Error placeholder -->
    <div
      v-if="imageError && !fallback"
      class="absolute inset-0 flex items-center justify-center text-neutral-400"
    >
      <PhotoIcon class="w-12 h-12" />
    </div>

    <!-- Image -->
    <img
      v-if="displaySrc"
      :src="displaySrc"
      :alt="alt"
      :class="imageClasses"
      :loading="loading"
      @load="handleLoad"
      @error="handleError"
    />
  </div>
</template>
