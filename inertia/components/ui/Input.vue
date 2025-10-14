<script setup lang="ts">
import { computed, useAttrs, ref } from 'vue'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

interface Props {
  modelValue?: string | number
  label?: string
  error?: string
  hint?: string
  required?: boolean
  icon?: any
  iconRight?: any
  type?: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: []
}>()

const attrs = useAttrs()
const showPassword = ref(false)

const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

const sizeClasses = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-base',
  lg: 'px-5 py-3 text-lg',
}

const inputClasses = computed(() => [
  'w-full border rounded-lg transition-all duration-200 placeholder:text-neutral-400',
  'focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none',
  'disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-500',
  props.error
    ? 'border-error-500 focus:ring-error-500/20 focus:border-error-500'
    : 'border-neutral-300 hover:border-neutral-400',
  sizeClasses[props.size],
  props.icon ? 'pl-10' : '',
  props.iconRight || props.type === 'password' ? 'pr-10' : '',
])

const iconSize = computed(() => {
  const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' }
  return sizes[props.size]
})

const updateValue = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleBlur = () => {
  emit('blur')
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="space-y-2">
    <label v-if="label" class="block text-sm font-medium text-neutral-700">
      {{ label }}
      <span v-if="required" class="text-error-500 ml-0.5">*</span>
    </label>

    <div class="relative">
      <div
        v-if="icon"
        class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
      >
        <component :is="icon" :class="iconSize" />
      </div>

      <input
        :value="modelValue"
        :type="inputType"
        :class="inputClasses"
        v-bind="attrs"
        @input="updateValue"
        @blur="handleBlur"
        v-motion
        :initial="{ opacity: 0, y: -10 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 200 } }"
      />

      <div
        v-if="iconRight || type === 'password'"
        class="absolute right-3 top-1/2 -translate-y-1/2"
      >
        <button
          v-if="type === 'password'"
          type="button"
          @click="togglePassword"
          class="text-neutral-400 hover:text-neutral-600 transition-colors"
          :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
        >
          <EyeSlashIcon v-if="showPassword" :class="iconSize" />
          <EyeIcon v-else :class="iconSize" />
        </button>

        <component
          v-else-if="iconRight"
          :is="iconRight"
          :class="[iconSize, 'text-neutral-400']"
        />
      </div>
    </div>

    <p
      v-if="error"
      class="text-sm text-error-600 flex items-start gap-1"
      v-motion
      :initial="{ opacity: 0, x: -10 }"
      :enter="{ opacity: 1, x: 0, transition: { duration: 150 } }"
    >
      <svg class="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
          clip-rule="evenodd"
        />
      </svg>
      {{ error }}
    </p>

    <p v-if="hint && !error" class="text-sm text-neutral-500">
      {{ hint }}
    </p>
  </div>
</template>