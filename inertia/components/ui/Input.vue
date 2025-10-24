// ============================================
// 3. Enhanced Input Component (inertia/components/ui/Input.vue)
// ============================================
<script setup lang="ts">
import { computed, ref } from 'vue'
import { motion } from 'motion-v'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import { use_theme } from '#composables/use_theme'

interface Props {
  modelValue?: string | number
  label?: string
  error?: string
  hint?: string
  success?: string
  required?: boolean
  icon?: any
  iconRight?: any
  type?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  autoFocus?: boolean
  variant?: 'default' | 'filled' | 'flushed'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  variant: 'default',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'blur': []
  'focus': []
}>()

const { getAnimation } = use_theme()
const showPassword = ref(false)
const isFocused = ref(false)

const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

const sizeClasses = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-5 py-4 text-lg',
}

const variantClasses = {
  default: 'border-2 rounded-xl',
  filled: 'border-0 rounded-xl bg-neutral-100',
  flushed: 'border-0 border-b-2 rounded-none px-0',
}

const inputClasses = computed(() => [
  'w-full font-medium transition-all duration-300 placeholder:text-neutral-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
  sizeClasses[props.size],
  variantClasses[props.variant],
  props.error
    ? 'border-error-400 focus:border-error-500 focus:ring-4 focus:ring-error-500/20 bg-error-50/30 text-error-900'
    : props.success
      ? 'border-success-400 focus:border-success-500 focus:ring-4 focus:ring-success-500/20 bg-success-50/30 text-success-900'
      : isFocused.value
        ? 'border-primary-500 ring-4 ring-primary-500/20 bg-white'
        : 'border-neutral-200 hover:border-neutral-300 bg-white',
  props.icon ? 'pl-11' : '',
  props.iconRight || props.type === 'password' ? 'pr-11' : '',
])

const labelAnimation = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: getAnimation('fast') / 1000 },
}

const inputAnimation = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: getAnimation('normal') / 1000, delay: 0.05 },
}

const updateValue = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="space-y-2">
    <motion.label v-if="props.label" v-bind="labelAnimation"
      class="block text-sm font-semibold text-neutral-800 transition-colors" :class="{ 'text-primary-600': isFocused }">
      {{ props.label }}
      <span v-if="required" class="text-error-500 ml-1">*</span>
    </motion.label>

    <motion.div v-bind="inputAnimation" class="relative group">
      <!-- Icon Left -->
      <motion.div v-if="props.icon"
        class="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 transition-all duration-300" :class="props.error
            ? 'text-error-500'
            : props.success
              ? 'text-success-500'
              : isFocused
                ? 'text-primary-600'
                : 'text-neutral-400'
          " :animate="{ scale: isFocused ? 1.1 : 1, rotate: isFocused ? 5 : 0 }"
        :transition="{ duration: getAnimation('fast') / 1000 }">
        <component :is="props.icon" class="w-5 h-5" />
      </motion.div>

      <!-- Input -->
      <input :value="props.modelValue" :type="inputType" :class="inputClasses" :disabled="props.disabled"
        :autofocus="props.autoFocus" v-bind="$attrs" @input="updateValue" @blur="isFocused = false; emit('blur')"
        @focus="isFocused = true; emit('focus')" />

      <!-- Password Toggle / Icon Right -->
      <div v-if="props.iconRight || props.type === 'password'" class="absolute right-3.5 top-1/2 -translate-y-1/2 z-10">
        <motion.button v-if="props.type === 'password' && !props.disabled" type="button"
          @click="showPassword = !showPassword"
          class="text-neutral-400 hover:text-neutral-700 transition-colors p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30"
          :whileHover="{ scale: 1.1 }" :whileTap="{ scale: 0.95 }">
          <motion.div :animate="{ rotate: showPassword ? 180 : 0 }"
            :transition="{ duration: getAnimation('fast') / 1000 }">
            <EyeSlashIcon v-if="showPassword" class="w-5 h-5" />
            <EyeIcon v-else class="w-5 h-5" />
          </motion.div>
        </motion.button>
        <component v-else-if="props.iconRight" :is="props.iconRight" class="w-5 h-5 text-neutral-400" />
      </div>

      <!-- Focus Border Animation -->
      <motion.div v-if="props.variant === 'default'"
        class="absolute inset-0 rounded-xl border-2 border-primary-500 pointer-events-none"
        :initial="{ opacity: 0, scale: 0.95 }" :animate="{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.95 }"
        :transition="{ duration: getAnimation('fast') / 1000 }" />
    </motion.div>

    <!-- Messages -->
    <motion.div v-if="props.error || props.success || props.hint" :initial="{ opacity: 0, y: -5 }"
      :animate="{ opacity: 1, y: 0 }" :transition="{ duration: getAnimation('normal') / 1000 }">
      <p v-if="error" class="text-sm text-error-600 font-medium flex items-center gap-1.5">
        <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
            clip-rule="evenodd" />
        </svg>
        {{ props.error }}
      </p>
      <p v-else-if="props.success" class="text-sm text-success-600 font-medium flex items-center gap-1.5">
        <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clip-rule="evenodd" />
        </svg>
        {{ props.success }}
      </p>
      <p v-else-if="props.hint" class="text-sm text-neutral-500 flex items-center gap-1.5">
        <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
            clip-rule="evenodd" />
        </svg>
        {{ props.hint }}
      </p>
    </motion.div>
  </div>
</template>