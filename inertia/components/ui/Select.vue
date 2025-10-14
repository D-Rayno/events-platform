<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

interface Option {
    value: string | number
    label: string
    disabled?: boolean
}

interface Props {
    modelValue?: string | number
    label?: string
    error?: string
    hint?: string
    required?: boolean
    placeholder?: string
    options: Option[]
    size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
    size: 'md',
    placeholder: 'Sélectionnez une option',
})

const emit = defineEmits<{
    'update:modelValue': [value: string | number]
    blur: []
}>()

const attrs = useAttrs()

const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3 text-lg',
}

const selectClasses = computed(() => [
    'w-full border rounded-lg transition-all duration-200 appearance-none pr-10',
    'focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none',
    'disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-500',
    'bg-white cursor-pointer',
    props.error
        ? 'border-error-500 focus:ring-error-500/20 focus:border-error-500'
        : 'border-neutral-300 hover:border-neutral-400',
    sizeClasses[props.size],
])

const updateValue = (e: Event) => {
    const target = e.target as HTMLSelectElement
    emit('update:modelValue', target.value)
}

const handleBlur = () => {
    emit('blur')
}
</script>

<template>
    <div class="space-y-2">
        <label v-if="label" class="block text-sm font-medium text-neutral-700">
            {{ label }}
            <span v-if="required" class="text-error-500 ml-0.5">*</span>
        </label>

        <div class="relative">
            <select :value="modelValue" :class="selectClasses" v-bind="attrs" @change="updateValue" @blur="handleBlur"
                v-motion :initial="{ opacity: 0, y: -10 }" :enter="{ opacity: 1, y: 0, transition: { duration: 200 } }">
                <option value="" disabled selected>{{ placeholder }}</option>
                <option v-for="option in options" :key="option.value" :value="option.value" :disabled="option.disabled">
                    {{ option.label }}
                </option>
            </select>

            <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                <ChevronDownIcon class="w-5 h-5" />
            </div>
        </div>

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