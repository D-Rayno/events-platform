<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import Button from '#ui/Button.vue'

interface Props {
    currentPage: number
    lastPage: number
    totalItems?: number
    itemsPerPage?: number
}

const props = withDefaults(defineProps<Props>(), {
    totalItems: 0,
    itemsPerPage: 12,
})

const emit = defineEmits<{
    'change-page': [page: number]
}>()

const pages = computed(() => {
    const pages: (number | string)[] = []
    const delta = 2
    const left = Math.max(1, props.currentPage - delta)
    const right = Math.min(props.lastPage, props.currentPage + delta)

    if (left > 1) {
        pages.push(1)
        if (left > 2) pages.push('...')
    }

    for (let i = left; i <= right; i++) {
        pages.push(i)
    }

    if (right < props.lastPage) {
        if (right < props.lastPage - 1) pages.push('...')
        pages.push(props.lastPage)
    }

    return pages
})

const hasPrevious = computed(() => props.currentPage > 1)
const hasNext = computed(() => props.currentPage < props.lastPage)

const goToPage = (page: number | string) => {
    if (typeof page === 'number' && page >= 1 && page <= props.lastPage) {
        emit('change-page', page)
    }
}

const goToPrevious = () => {
    if (hasPrevious.value) {
        emit('change-page', props.currentPage - 1)
    }
}

const goToNext = () => {
    if (hasNext.value) {
        emit('change-page', props.currentPage + 1)
    }
}
</script>

<template>
    <div class="flex items-center justify-between gap-4 py-4">
        <!-- Info -->
        <p v-if="totalItems" class="text-sm text-neutral-600">
            Affichage de {{ (currentPage - 1) * itemsPerPage + 1 }} à
            {{ Math.min(currentPage * itemsPerPage, totalItems) }} sur {{ totalItems }}
        </p>
        <div v-else />

        <!-- Navigation -->
        <div class="flex items-center gap-2">
            <Button variant="outline" size="sm" :disabled="!hasPrevious" :icon-left="ChevronLeftIcon"
                @click="goToPrevious">
                Précédent
            </Button>

            <div class="flex items-center gap-1 hidden sm:flex">
                <button v-for="page in pages" :key="`page-${page}`" @click="goToPage(page)" :disabled="page === '...'"
                    :class="[
                        'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                        page === currentPage
                            ? 'bg-primary-600 text-white shadow-md'
                            : page === '...'
                                ? 'text-neutral-500 cursor-default'
                                : 'border border-neutral-300 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 active:scale-95'
                    ]">
                    {{ page }}
                </button>
            </div>

            <Button variant="outline" size="sm" :disabled="!hasNext" :icon-right="ChevronRightIcon" @click="goToNext">
                Suivant
            </Button>
        </div>
    </div>
</template>