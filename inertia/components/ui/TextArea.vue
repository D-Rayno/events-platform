<script setup lang="ts">
import { computed, useAttrs } from 'vue'

interface Props {
    modelValue?: string
    label?: string
    error?: string
    hint?: string
    required?: boolean
    rows?: number
    maxLength?: number
    showCount?: boolean
    resize?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    rows: 4,
    showCount: false,
    resize: true,
})

const emit = defineEmits<{
    'update:modelValue': [value: string]
    blur: []
}>()

const attrs = useAttrs()

const textareaClasses = computed(() => [
    'w-full px-4 py-2.5 border rounded-lg transition-all duration-200 placeholder:text-neutral-400',
    'focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none',
    'disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-500',
    props.error
        ? 'border-error-500 focus:ring-error-500/20 focus:border-error-500'
        : 'border-neutral-300 hover:border-neutral-400',
    props.resize ? 'resize-y' : 'resize-none',
])

const characterCount = computed(() => {
    const length = props.modelValue?.length || 0
    if (props.maxLength) {
        return `${length}/${props.maxLength}`
    }
    return `${length}`
})

const updateValue = (e: Event) => {
    const target = e.target as HTMLTextAreaElement
    emit('update:modelValue', target.value)
}

const handleBlur = () => {
    emit('blur')
}
</script>

<template>
    <div class="space-y-2">
        <div v-if="label || showCount" class="flex items-center justify-between">
            <label v-if="label" class="block text-sm font-medium text-neutral-700">
                {{ label }}
                <span v-if="required" class="text-error-500 ml-0.5">*</span>
            </label>
            <span v-if="showCount" class="text-xs text-neutral-500">
                {{ characterCount }}
            </span>
        </div>

        <textarea :value="modelValue" :rows="rows" :maxlength="maxLength" :class="textareaClasses" v-bind="attrs"
            @input="updateValue" @blur="handleBlur" v-motion :initial="{ opacity: 0, y: -10 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 200 } }" />

        <p v-if="error" class="text-sm text-error-600 flex items-start gap-1" v-motion :initial="{ opacity: 0, x: -10 }"
            :enter="{ opacity: 1, x: 0, transition: { duration: 150 } }">
            <svg class="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    clip-rule="evenodd" />
            </svg>
            {{ error }}
        </p>

        <p v-if="hint && !error" class="text-sm text-neutral-500">
            {{ hint }}
        </p>
    </div>
</template>