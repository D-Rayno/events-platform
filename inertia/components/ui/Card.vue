<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    variant?: 'default' | 'bordered' | 'elevated' | 'flat'
    padding?: 'none' | 'sm' | 'md' | 'lg'
    hoverable?: boolean
    clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'default',
    padding: 'md',
    hoverable: false,
    clickable: false,
})

const variantClasses = {
    default: 'bg-white border border-neutral-200 shadow-sm',
    bordered: 'bg-white border-2 border-neutral-300',
    elevated: 'bg-white shadow-lg border border-neutral-100',
    flat: 'bg-neutral-50',
}

const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
}

const cardClasses = computed(() => [
    'rounded-lg transition-all duration-200',
    variantClasses[props.variant],
    paddingClasses[props.padding],
    props.hoverable && 'hover:shadow-md hover:-translate-y-1',
    props.clickable && 'cursor-pointer active:scale-[0.98]',
])
</script>

<template>
    <div :class="cardClasses" v-motion :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 300 } }">
        <slot />
    </div>
</template>