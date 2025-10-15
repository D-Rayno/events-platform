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
  'blur': []
  'focus': []
}>()

const attrs = useAttrs()
const showPassword = ref(false)
const isFocused = ref(false)

const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

const sizeClasses = {
  sm: 'px-3.5 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-5 py-3.5 text-lg',
}

const inputClasses = computed(() => [
  'w-full border-2 rounded-xl transition-all duration-300 placeholder:text-neutral-400',
  'focus:outline-none',
  'disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-500',
  props.error
    ? 'border-error-300 focus:border-error-500 focus:ring-4 focus:ring-error-500/20 bg-error-50/30'
    : isFocused.value
      ? 'border-primary-500 ring-4 ring-primary-500/20 bg-white'
      : 'border-neutral-200 hover:border-neutral-300 bg-white',
  sizeClasses[props.size],
  props.icon ? 'pl-11' : '',
  props.iconRight || props.type === 'password' ? 'pr-11' : '',
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
  isFocused.value = false
  emit('blur')
}

const handleFocus = () => {
  isFocused.value = true
  emit('focus')
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="space-y-2">
    <label
      v-if="label"
      class="block text-sm font-semibold text-neutral-800"
      v-motion
      :initial="{ opacity: 0, y: -5 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 200 } }"
    >
      {{ label }}
      <span v-if="required" class="text-error-500 ml-1">*</span>
    </label>

    <div
      class="relative"
      v-motion
      :initial="{ opacity: 0, y: -10 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 250, delay: 50 } }"
    >
      <div
        v-if="icon"
        :class="[
          'absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300',
          props.error ? 'text-error-500' : isFocused ? 'text-primary-600' : 'text-neutral-400',
        ]"
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
        @focus="handleFocus"
      />

      <div
        v-if="iconRight || type === 'password'"
        class="absolute right-3.5 top-1/2 -translate-y-1/2"
      >
        <button
          v-if="type === 'password'"
          type="button"
          @click="togglePassword"
          class="text-neutral-400 hover:text-neutral-600 transition-all duration-300 hover:scale-110 active:scale-95"
          :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
        >
          <EyeSlashIcon v-if="showPassword" :class="iconSize" />
          <EyeIcon v-else :class="iconSize" />
        </button>

        <component v-else-if="iconRight" :is="iconRight" :class="[iconSize, 'text-neutral-400']" />
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <p v-if="error" class="text-sm text-error-600 font-medium flex items-start gap-1.5">
        <svg class="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
            clip-rule="evenodd"
          />
        </svg>
        {{ error }}
      </p>
    </Transition>

    <p v-if="hint && !error" class="text-sm text-neutral-500">
      {{ hint }}
    </p>
  </div>
</template>
