<script setup lang="ts">
import { computed, useAttrs } from 'vue'

interface Props {
    modelValue?: string | number
    label?: string
    error?: string
    hint?: string
    required?: boolean
    icon?: string
    type?: string
}

const props = withDefaults(defineProps<Props>(), {
    type: 'text'
})

const emit = defineEmits<{
    'update:modelValue': [value: string | number]
}>()

const attrs = useAttrs()

const inputClasses = computed(() => [
    'w-full px-4 py-2.5 border rounded-lg transition-all duration-200',
    'focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none',
    'disabled:bg-sand-3 disabled:cursor-not-allowed disabled:text-sand-10',
    props.error
        ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
        : 'border-sand-7 hover:border-sand-8',
    props.icon ? 'pl-10' : ''
])

const updateValue = (e: Event) => {
    const target = e.target as HTMLInputElement
    emit('update:modelValue', target.value)
}
</script>

<template>
    <div class="space-y-2">
        <label v-if="label" class="block text-sm font-medium text-sand-12">
            {{ label }}
            <span v-if="required" class="text-red-500 ml-0.5">*</span>
        </label>

        <div class="relative">
            <div v-if="icon" class="absolute left-3 top-1/2 -translate-y-1/2 text-sand-10">
                <component :is="icon" class="w-5 h-5" />
            </div>

            <input :value="modelValue" :type="type" :class="inputClasses" v-bind="attrs" @input="updateValue" />
        </div>

        <p v-if="error" class="text-sm text-red-600 flex items-start gap-1">
            <svg class="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    clip-rule="evenodd" />
            </svg>
            {{ error }}
        </p>

        <p v-if="hint && !error" class="text-sm text-sand-10">
            {{ hint }}
        </p>
    </div>
</template>