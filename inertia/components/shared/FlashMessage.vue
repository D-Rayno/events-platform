<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePage } from '@inertiajs/vue3'
import Alert from '#ui/Alert.vue'

const page = usePage()
const dismissedMessages = ref<Set<string>>(new Set())

const flash = computed(() => ({
    success: page.props.flash?.success,
    error: page.props.flash?.error,
    warning: page.props.flash?.warning,
    info: page.props.flash?.info,
}))

const visibleMessages = computed(() => {
    const messages = []

    if (flash.value.success && !dismissedMessages.value.has('success')) {
        messages.push({ type: 'success', message: flash.value.success })
    }
    if (flash.value.error && !dismissedMessages.value.has('error')) {
        messages.push({ type: 'error', message: flash.value.error })
    }
    if (flash.value.warning && !dismissedMessages.value.has('warning')) {
        messages.push({ type: 'warning', message: flash.value.warning })
    }
    if (flash.value.info && !dismissedMessages.value.has('info')) {
        messages.push({ type: 'info', message: flash.value.info })
    }

    return messages
})

const dismiss = (type: string) => {
    dismissedMessages.value.add(type)
}
</script>

<template>
    <div v-if="visibleMessages.length"
        class="fixed top-20 left-4 right-4 md:left-auto md:right-8 z-40 space-y-2 max-w-md">
        <transition-group name="slide-fade">
            <Alert v-for="msg in visibleMessages" :key="msg.type" :type="msg.type" dismissible
                @dismiss="dismiss(msg.type)">
                {{ msg.message }}
            </Alert>
        </transition-group>
    </div>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.3s ease;
}

.slide-fade-enter-from {
    transform: translateX(20px);
    opacity: 0;
}

.slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
}

.slide-fade-move {
    transition: transform 0.3s ease;
}
</style>