<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { ChevronDownIcon, CheckIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

interface Option {
  value: string | number
  label: string
  disabled?: boolean
  icon?: any
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
  searchable: false,
  disabled: false,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'change': [value: string | number]
  'blur': []
}>()

// Component state
const isOpen = ref(false)
const searchQuery = ref('')
const triggerRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const portalRef = ref<HTMLElement | null>(null)
const selectedIndex = ref(-1)

// Computed properties
const selectedOption = computed(() => {
  return props.options.find((opt) => opt.value === props.modelValue)
})

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) {
    return props.options
  }

  const query = searchQuery.value.toLowerCase()
  return props.options.filter((opt) => opt.label.toLowerCase().includes(query))
})

const sizeClasses = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-base',
  lg: 'px-5 py-3 text-lg',
}

const triggerClasses = computed(() => [
  'w-full flex items-center justify-between border-2 rounded-xl transition-all duration-300',
  'focus:outline-none cursor-pointer',
  'disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-500',
  props.error
    ? 'border-error-300 hover:border-error-400 bg-error-50/30'
    : isOpen.value
      ? 'border-primary-500 ring-4 ring-primary-500/20 bg-white'
      : 'border-neutral-200 hover:border-neutral-300 bg-white',
  sizeClasses[props.size],
  props.disabled && 'opacity-60',
])

// Methods
const toggle = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value

  if (isOpen.value) {
    nextTick(() => {
      updateDropdownPosition()
      if (props.searchable) {
        const searchInput = dropdownRef.value?.querySelector('input')
        searchInput?.focus()
      }
    })
  } else {
    searchQuery.value = ''
    emit('blur')
  }
}

const selectOption = (option: Option) => {
  if (option.disabled) return

  emit('update:modelValue', option.value)
  emit('change', option.value)
  isOpen.value = false
  searchQuery.value = ''
}

const updateDropdownPosition = () => {
  if (!triggerRef.value || !portalRef.value) return

  const rect = triggerRef.value.getBoundingClientRect()
  const portal = portalRef.value

  // Calculate position
  portal.style.position = 'fixed'
  portal.style.left = `${rect.left}px`
  portal.style.width = `${rect.width}px`

  // Check if dropdown should open upward
  const spaceBelow = window.innerHeight - rect.bottom
  const spaceAbove = rect.top
  const dropdownHeight = 300 // Approximate max height

  if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
    // Open upward
    portal.style.bottom = `${window.innerHeight - rect.top + 4}px`
    portal.style.top = 'auto'
  } else {
    // Open downward
    portal.style.top = `${rect.bottom + 4}px`
    portal.style.bottom = 'auto'
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (
    !triggerRef.value?.contains(event.target as Node) &&
    !dropdownRef.value?.contains(event.target as Node)
  ) {
    isOpen.value = false
    searchQuery.value = ''
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (!isOpen.value) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value = Math.min(selectedIndex.value + 1, filteredOptions.value.length - 1)
      scrollToSelected()
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
      scrollToSelected()
      break
    case 'Enter':
      event.preventDefault()
      if (selectedIndex.value >= 0) {
        selectOption(filteredOptions.value[selectedIndex.value])
      }
      break
    case 'Escape':
      event.preventDefault()
      isOpen.value = false
      searchQuery.value = ''
      break
  }
}

const scrollToSelected = () => {
  nextTick(() => {
    const selected = dropdownRef.value?.querySelector(`[data-index="${selectedIndex.value}"]`)
    selected?.scrollIntoView({ block: 'nearest' })
  })
}

// Lifecycle hooks
watch(isOpen, (newVal) => {
  if (newVal) {
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('scroll', updateDropdownPosition, true)
    window.addEventListener('resize', updateDropdownPosition)
  } else {
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('scroll', updateDropdownPosition, true)
    window.removeEventListener('resize', updateDropdownPosition)
    selectedIndex.value = -1
  }
})

onMounted(() => {
  // Create portal container
  const portal = document.createElement('div')
  portal.style.zIndex = '9999'
  document.body.appendChild(portal)
  portalRef.value = portal
})

onUnmounted(() => {
  // Clean up portal
  if (portalRef.value) {
    document.body.removeChild(portalRef.value)
  }
})
</script>

<template>
  <div class="space-y-2">
    <!-- Label -->
    <label v-if="label" class="block text-sm font-semibold text-neutral-800" v-motion :initial="{ opacity: 0, y: -5 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 200 } }">
      {{ label }}
      <span v-if="required" class="text-error-500 ml-1">*</span>
    </label>

    <!-- Trigger Button -->
    <div ref="triggerRef" :class="triggerClasses" @click="toggle" :aria-expanded="isOpen" :aria-haspopup="true"
      role="button" tabindex="0" @keydown.enter.prevent="toggle" @keydown.space.prevent="toggle" v-motion
      :initial="{ opacity: 0, y: -10 }" :enter="{ opacity: 1, y: 0, transition: { duration: 250, delay: 50 } }">
      <span :class="selectedOption ? 'text-neutral-900' : 'text-neutral-400'">
        {{ selectedOption?.label || placeholder }}
      </span>
      <ChevronDownIcon :class="[
        'w-5 h-5 transition-transform duration-300',
        isOpen ? 'rotate-180 text-primary-600' : 'text-neutral-400',
      ]" />
    </div>

    <!-- Dropdown Portal -->
    <Teleport to="body">
      <Transition enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 scale-95 translate-y-[-10px]" enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-[-10px]">
        <div v-if="isOpen" ref="dropdownRef"
          class="bg-white rounded-xl shadow-2xl border-2 border-neutral-200 overflow-hidden" style="z-index: 9999">
          <!-- Search Input -->
          <div v-if="searchable" class="p-3 border-b border-neutral-200">
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input v-model="searchQuery" type="text" placeholder="Rechercher..."
                class="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                @click.stop />
            </div>
          </div>

          <!-- Options List -->
          <div class="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-neutral-100">
            <div v-for="(option, index) in filteredOptions" :key="option.value" :data-index="index" :class="[
              'flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-150',
              option.disabled
                ? 'opacity-50 cursor-not-allowed'
                : selectedIndex === index || option.value === modelValue
                  ? 'bg-primary-50 text-primary-700'
                  : 'hover:bg-neutral-50 text-neutral-900',
            ]" @click="selectOption(option)" @mouseenter="selectedIndex = index">
              <div class="flex items-center gap-3">
                <component v-if="option.icon" :is="option.icon" class="w-5 h-5" />
                <span class="font-medium">{{ option.label }}</span>
              </div>
              <CheckIcon v-if="option.value === modelValue" class="w-5 h-5 text-primary-600 animate-scale-in" />
            </div>

            <!-- No Results -->
            <div v-if="filteredOptions.length === 0" class="px-4 py-8 text-center text-neutral-500">
              <p class="text-sm">Aucun résultat trouvé</p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Error Message -->
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-1">
      <p v-if="error" class="text-sm text-error-600 font-medium flex items-start gap-1.5">
        <svg class="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
            clip-rule="evenodd" />
        </svg>
        {{ error }}
      </p>
    </Transition>

    <!-- Hint -->
    <p v-if="hint && !error" class="text-sm text-neutral-500">
      {{ hint }}
    </p>
  </div>
</template>

<style scoped>
@keyframes scale-in {
  from {
    transform: scale(0);
  }

  to {
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scale-in 0.2s ease-out;
}

/* Custom scrollbar */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>