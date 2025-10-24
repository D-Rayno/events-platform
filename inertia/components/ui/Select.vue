// ============================================
// 8. Enhanced Select Component (inertia/components/ui/Select.vue)
// ============================================
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { AnimatePresence, motion } from 'motion-v'
import { ChevronDownIcon, CheckIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { use_theme } from '#composables/use_theme'

interface Option {
  value: string | number
  label: string
  disabled?: boolean
  icon?: any
  description?: string
}

interface Props {
  modelValue?: string | number
  options: Option[]
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  required?: boolean
  searchable?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Sélectionner une option',
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'change': [value: string | number]
}>()

const { getAnimation } = use_theme()
const isOpen = ref(false)
const searchQuery = ref('')

const selectedOption = computed(() => {
  return props.options.find((opt) => opt.value === props.modelValue)
})

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) return props.options
  const query = searchQuery.value.toLowerCase()
  return props.options.filter((opt) => opt.label.toLowerCase().includes(query))
})

const sizeClasses = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-5 py-4 text-lg',
}

const triggerClasses = computed(() => [
  'w-full flex items-center justify-between border-2 rounded-xl transition-all duration-300 cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
  props.error
    ? 'border-error-300 hover:border-error-400 bg-error-50/30'
    : isOpen.value
      ? 'border-primary-500 ring-4 ring-primary-500/20 bg-white shadow-lg'
      : 'border-neutral-200 hover:border-neutral-300 bg-white',
  sizeClasses[props.size],
])

const selectOption = (option: Option) => {
  if (option.disabled) return
  emit('update:modelValue', option.value)
  emit('change', option.value)
  isOpen.value = false
  searchQuery.value = ''
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.select-container')) {
    isOpen.value = false
  }
}

watch(isOpen, (val) => {
  if (val) {
    document.addEventListener('click', handleClickOutside)
  } else {
    document.removeEventListener('click', handleClickOutside)
  }
})
</script>

<template>
  <div class="space-y-2 select-container">
    <motion.label v-if="label" class="block text-sm font-semibold text-neutral-800" :initial="{ opacity: 0, y: -5 }"
      :animate="{ opacity: 1, y: 0 }">
      {{ label }}
      <span v-if="required" class="text-error-500 ml-1">*</span>
    </motion.label>

    <div class="relative">
      <motion.div :class="triggerClasses" @click="!disabled && (isOpen = !isOpen)"
        :whileTap="{ scale: disabled ? 1 : 0.98 }">
        <span :class="selectedOption ? 'text-neutral-900 font-medium' : 'text-neutral-400'">
          <span v-if="selectedOption" class="flex items-center gap-2">
            <component v-if="selectedOption.icon" :is="selectedOption.icon" class="w-5 h-5" />
            {{ selectedOption.label }}
          </span>
          <span v-else>{{ placeholder }}</span>
        </span>
        <motion.div :animate="{ rotate: isOpen ? 180 : 0 }" :transition="{ duration: getAnimation('fast') / 1000 }">
          <ChevronDownIcon class="w-5 h-5 text-neutral-400" />
        </motion.div>
      </motion.div>

      <!-- Dropdown -->
      <AnimatePresence>
        <motion.div v-if="isOpen"
          class="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border-2 border-neutral-200 overflow-hidden"
          :initial="{ opacity: 0, y: -10, scale: 0.95 }" :animate="{ opacity: 1, y: 0, scale: 1 }"
          :exit="{ opacity: 0, y: -10, scale: 0.95 }"
          :transition="{ duration: getAnimation('normal') / 1000, type: 'spring', stiffness: 300 }">
          <!-- Search -->
          <div v-if="searchable" class="p-3 border-b border-neutral-200 bg-neutral-50">
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input v-model="searchQuery" type="text" placeholder="Rechercher..."
                class="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                @click.stop />
            </div>
          </div>

          <!-- Options -->
          <div class="max-h-72 overflow-y-auto">
            <motion.div v-for="(option, index) in filteredOptions" :key="option.value"
              class="px-4 py-3 cursor-pointer transition-all duration-150" :class="[
                option.disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : option.value === modelValue
                    ? 'bg-primary-50 text-primary-700'
                    : 'hover:bg-neutral-50',
              ]" @click="selectOption(option)" :initial="{ opacity: 0, x: -20 }" :animate="{ opacity: 1, x: 0 }"
              :transition="{ delay: index * 0.03 }" :whileHover="!option.disabled ? { x: 4 } : {}">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <component v-if="option.icon" :is="option.icon" class="w-5 h-5" />
                  <div>
                    <div class="font-medium">{{ option.label }}</div>
                    <div v-if="option.description" class="text-xs text-neutral-500 mt-0.5">
                      {{ option.description }}
                    </div>
                  </div>
                </div>
                <motion.div v-if="option.value === modelValue" :initial="{ scale: 0, rotate: -180 }"
                  :animate="{ scale: 1, rotate: 0 }" :transition="{ type: 'spring', stiffness: 300 }">
                  <CheckIcon class="w-5 h-5 text-primary-600" />
                </motion.div>
              </div>
            </motion.div>

            <div v-if="filteredOptions.length === 0" class="px-4 py-8 text-center text-neutral-500">
              <p class="text-sm">Aucun résultat trouvé</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>

    <!-- Error/Hint -->
    <motion.p v-if="error || hint" class="text-sm flex items-center gap-1.5"
      :class="error ? 'text-error-600 font-medium' : 'text-neutral-500'" :initial="{ opacity: 0, y: -5 }"
      :animate="{ opacity: 1, y: 0 }">
      <svg v-if="error" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
          clip-rule="evenodd" />
      </svg>
      {{ error || hint }}
    </motion.p>
  </div>
</template>
