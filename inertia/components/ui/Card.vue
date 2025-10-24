// ============================================
// 4. Enhanced Card Component (inertia/components/ui/Card.vue)
// ============================================
<script setup lang="ts">
import { computed } from 'vue'

import { use_theme } from '#composables/use_theme'

interface Props {
  variant?: 'default' | 'bordered' | 'elevated' | 'gradient' | 'glass'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  hoverable?: boolean
  clickable?: boolean
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md',
  rounded: 'xl',
})

const { getAnimation } = use_theme()

const variantClasses = {
  default: 'bg-white border border-neutral-200 shadow-sm',
  bordered: 'bg-white border-2 border-neutral-300',
  elevated: 'bg-white shadow-xl border border-neutral-100',
  gradient: 'bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/30 border border-neutral-200 shadow-lg',
  glass: 'bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg',
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
}

const roundedClasses = {
  sm: 'rounded-md',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
  '2xl': 'rounded-3xl',
}

const cardClasses = computed(() => [
  'transition-all duration-300',
  variantClasses[props.variant],
  paddingClasses[props.padding],
  roundedClasses[props.rounded],
  props.hoverable && 'hover:shadow-2xl hover:-translate-y-2',
  props.clickable && 'cursor-pointer active:scale-[0.98]',
])

const cardAnimation = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: getAnimation('normal') / 1000 },
  ...(props.hoverable && {
    whileHover: { y: -8, transition: { duration: getAnimation('fast') / 1000 } },
  }),
}
</script>

<template>
  <motion.div :class="cardClasses" v-bind="cardAnimation">
    <slot />
  </motion.div>
</template>