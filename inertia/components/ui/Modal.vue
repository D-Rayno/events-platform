<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

interface Props {
    show?: boolean
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
    closable?: boolean
    title?: string
}

const props = withDefaults(defineProps<Props>(), {
    show: false,
    maxWidth: 'md',
    closable: true,
})

const emit = defineEmits<{
    close: []
}>()

const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
}

const close = () => {
    if (props.closable) {
        emit('close')
    }
}

const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.show && props.closable) {
        close()
    }
}

watch(
    () => props.show,
    (show) => {
        if (show) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
    }
)

onMounted(() => {
    document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
    document.body.style.overflow = ''
})
</script>

<template>
    <Teleport to="body">
        <Transition enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="show"
                class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                @click.self="close">
                <Transition enter-active-class="transition-all duration-200" enter-from-class="opacity-0 scale-95"
                    enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-200"
                    leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                    <div v-if="show" :class="['w-full bg-white rounded-xl shadow-2xl', maxWidthClasses[maxWidth]]"
                        role="dialog" aria-modal="true">
                        <!-- Header -->
                        <div v-if="title || closable"
                            class="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
                            <h3 v-if="title" class="text-lg font-semibold text-neutral-900">
                                {{ title }}
                            </h3>
                            <button v-if="closable" @click="close"
                                class="text-neutral-400 hover:text-neutral-600 transition-colors" aria-label="Fermer">
                                <XMarkIcon class="w-6 h-6" />
                            </button>
                        </div>

                        <!-- Body -->
                        <div class="px-6 py-4">
                            <slot />
                        </div>

                        <!-- Footer -->
                        <div v-if="$slots.footer" class="px-6 py-4 border-t border-neutral-200 bg-neutral-50">
                            <slot name="footer" />
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>