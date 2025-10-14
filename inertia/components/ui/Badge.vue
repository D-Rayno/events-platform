<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'neutral'
    size?: 'sm' | 'md' | 'lg'
    rounded?: boolean
    dot?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'neutral',
    size: 'md',
    rounded: false,
    dot: false,
})

const variantClasses = {
    primary: 'bg-primary-100 text-primary-700 border-primary-200',
    secondary: 'bg-secondary-100 text-secondary-700 border-secondary-200',
    success: 'bg-success-100 text-success-700 border-success-200',
    error: 'bg-error-100 text-error-700 border-error-200',
    warning: 'bg-warning-100 text-warning-700 border-warning-200',
    info: 'bg-info-100 text-info-700 border-info-200',
    neutral: 'bg-neutral-100 text-neutral-700 border-neutral-200',
}

const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
}

const dotColors = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    success: 'bg-success-500',
    error: 'bg-error-500',
    warning: 'bg-warning-500',
    info: 'bg-info-500',
    neutral: 'bg-neutral-500',
}

const badgeClasses = computed(() => [
    'inline-flex items-center gap-1.5 font-medium border',
    variantClasses[props.variant],
    sizeClasses[props.size],
    props.rounded ? 'rounded-full' : 'rounded-md',
])
</script>

<template>
    <span :class="badgeClasses">
        <span v-if="dot" :class="['w-1.5 h-1.5 rounded-full', dotColors[variant]]" />
        <slot />
    </span>
</template>