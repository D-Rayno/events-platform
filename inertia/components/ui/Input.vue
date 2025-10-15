<script setup lang="ts">
import { computed, ref } from 'vue'
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
  disabled?: boolean
  autoFocus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'blur': []
  'focus': []
}>()

const showPassword = ref(false)
const isFocused = ref(false)

const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

const sizeClasses = {
  sm: 'px-3.5 py-2.5 text-sm',
  md: 'px-4 py-3.5 text-base',
  lg: 'px-5 py-4 text-lg',
}

const inputClasses = computed(() => [
  'w-full border-2 rounded-xl font-medium transition-all duration-300 ease-out',
  'placeholder:text-gray-400 placeholder:font-normal',
  'focus:outline-none',
  'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 disabled:opacity-50',
  props.error
    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 bg-red-50/30 text-red-900'
    : isFocused.value
      ? 'border-blue-500 ring-4 ring-blue-500/20 bg-white shadow-xl shadow-blue-500/10'
      : 'border-gray-200 hover:border-gray-300 hover:shadow-lg bg-white',
  sizeClasses[props.size],
  props.icon ? 'pl-12' : '',
  props.iconRight || props.type === 'password' ? 'pr-12' : '',
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
  <div class="space-y-2 group">
    <label
      v-if="label"
      class="block text-sm font-semibold text-gray-900 transition-all duration-300 group-hover:text-blue-600"
      v-motion
      :initial="{ opacity: 0, y: -5 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 200 } }"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <div
      class="relative"
      v-motion
      :initial="{ opacity: 0, y: -10 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 250, delay: 50 } }"
    >
      <!-- Icon Left -->
      <div
        v-if="icon"
        :class="[
          'absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 pointer-events-none z-10',
          props.error
            ? 'text-red-500'
            : isFocused
              ? 'text-blue-600 scale-110'
              : 'text-gray-400',
        ]"
      >
        <component :is="icon" :class="iconSize" stroke-width="2.5" />
      </div>

      <!-- Input Field -->
      <input
        :value="modelValue"
        :type="inputType"
        :class="inputClasses"
        :disabled="disabled"
        :autofocus="autoFocus"
        v-bind="$attrs"
        @input="updateValue"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <!-- Password Toggle -->
      <div
        v-if="iconRight || type === 'password'"
        class="absolute right-4 top-1/2 -translate-y-1/2 z-10"
      >
        <button
          v-if="type === 'password' && !disabled"
          type="button"
          @click="togglePassword"
          class="text-gray-400 hover:text-gray-600 transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
          :aria-label="showPassword ? 'Hide password' : 'Show password'"
        >
          <EyeSlashIcon v-if="showPassword" :class="iconSize" />
          <EyeIcon v-else :class="iconSize" />
        </button>

        <component v-else-if="iconRight" :is="iconRight" :class="[iconSize, 'text-gray-400']" />
      </div>

      <!-- Focus Ring Animation -->
      <div
        :class="[
          'absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300',
          isFocused ? 'opacity-100' : 'opacity-0',
        ]"
      >
        <div
          class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse"
        />
      </div>
    </div>

    <!-- Error Message with Animation -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div v-if="error" class="flex items-start gap-2 text-sm text-red-600 font-medium">
        <svg class="w-4 h-4 mt-0.5 shrink-0 animate-shake" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
            clip-rule="evenodd"
          />
        </svg>
        <span>{{ error }}</span>
      </div>
    </Transition>

    <!-- Hint -->
    <p v-if="hint && !error" class="text-sm text-gray-500 flex items-center gap-1.5">
      <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
          clip-rule="evenodd"
        />
      </svg>
      {{ hint }}
    </p>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-2px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(2px);
  }
}

.animate-shake {
  animation: shake 0.4s ease-in-out;
}
</style>