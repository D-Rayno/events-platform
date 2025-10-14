<script setup lang="ts">
import { computed } from 'vue'
import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XCircleIcon,
    XMarkIcon,
} from '@heroicons/vue/24/outline'

interface Props {
    type?: 'success' | 'error' | 'warning' | 'info'
    title?: string
    dismissible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    type: 'info',
    dismissible: false,
})

const emit = defineEmits<{
    dismiss: []
}>()

const config = {
    success: {
        icon: CheckCircleIcon,
        classes: 'bg-success-50 border-success-200 text-success-800',
        iconClasses: 'text-success-600',
    },
    error: {
        icon: XCircleIcon,
        classes: 'bg-error-50 border-error-200 text-error-800',
        iconClasses: 'text-error-600',
    },
    warning: {
        icon: ExclamationTriangleIcon,
        classes: 'bg-warning-50 border-warning-200 text-warning-800',
        iconClasses: 'text-warning-600',
    },
    info: {
        icon: InformationCircleIcon,
        classes: 'bg-info-50 border-info-200 text-info-800',
        iconClasses: 'text-info-600',
    },
}

const alertConfig = computed(() => config[props.type])
</script>

<template>
    <div :class="['border rounded-lg p-4 flex gap-3', alertConfig.classes]" role="alert" v-motion
        :initial="{ opacity: 0, x: -20 }" :enter="{ opacity: 1, x: 0, transition: { duration: 200 } }"
        :leave="{ opacity: 0, x: -20, transition: { duration: 150 } }">
        <component :is="alertConfig.icon" :class="['w-5 h-5 shrink-0', alertConfig.iconClasses]" />

        <div class="flex-1 min-w-0">
            <h3 v-if="title" class="font-semibold mb-1">{{ title }}</h3>
            <div class="text-sm">
                <slot />
            </div>
        </div>

        <button v-if="dismissible" @click="emit('dismiss')" class="shrink-0 hover:opacity-70 transition-opacity"
            aria-label="Fermer">
            <XMarkIcon class="w-5 h-5" />
        </button>
    </div>
</template>