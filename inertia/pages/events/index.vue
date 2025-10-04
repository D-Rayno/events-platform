<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3'
import { ref } from 'vue'

const props = defineProps<{
    events: {
        data: Array<{
            id: number
            name: string
            description: string
            location: string
            startDate: string
            endDate: string
            maxCapacity: number
            registeredCount: number
            availableSpots: number
            imageUrl: string | null
            category: string
            categoryLabel: string
            price: number
            isFull: boolean
            canRegister: boolean
        }>
        meta: {
            total: number
            per_page: number
            current_page: number
            last_page: number
        }
    }
    filters: {
        category?: string
        search?: string
    }
}>()

const categories = [
    { value: 'conference', label: 'Conférence' },
    { value: 'workshop', label: 'Atelier' },
    { value: 'seminar', label: 'Séminaire' },
    { value: 'concert', label: 'Concert' },
    { value: 'sport', label: 'Sport' },
    { value: 'exhibition', label: 'Exhibition' },
    { value: 'networking', label: 'Networking' },
    { value: 'other', label: 'Autre' },
]

const selectedCategory = ref(props.filters.category || '')
const searchQuery = ref(props.filters.search || '')

const applyFilters = () => {
    router.get('/events', {
        category: selectedCategory.value || undefined,
        search: searchQuery.value || undefined,
    }, {
        preserveState: true,
        preserveScroll: true,
    })
}

const clearFilters = () => {
    selectedCategory.value = ''
    searchQuery.value = ''
    router.get('/events')
}
</script>

<template>

    <Head title="Événements" />

    <div class="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10">
        <!-- Header -->
        <div class="bg-white shadow-sm border-b border-sand-7">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-4xl font-bold text-sand-12">Événements</h1>
                        <p class="mt-2 text-sand-11">Découvrez tous nos événements à venir</p>
                    </div>
                    <Link href="/" class="text-primary hover:underline">← Accueil</Link>
                </div>
            </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Filtres -->
            <div class="bg-white rounded-lg shadow-sm border border-sand-7 p-6 mb-8">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-sand-12 mb-2">Rechercher</label>
                        <input v-model="searchQuery" type="text" placeholder="Nom, description..."
                            @keyup.enter="applyFilters"
                            class="w-full px-4 py-2 border border-sand-7 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-sand-12 mb-2">Catégorie</label>
                        <select v-model="selectedCategory" @change="applyFilters"
                            class="w-full px-4 py-2 border border-sand-7 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                            <option value="">Toutes les catégories</option>
                            <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                                {{ cat.label }}
                            </option>
                        </select>
                    </div>

                    <div class="flex items-end gap-2">
                        <button @click="applyFilters"
                            class="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition">
                            Filtrer
                        </button>
                        <button @click="clearFilters"
                            class="px-4 py-2 border border-sand-7 hover:bg-sand-3 rounded-lg transition">
                            Réinitialiser
                        </button>
                    </div>
                </div>
            </div>

            <!-- Compteur -->
            <div class="mb-6 text-sand-11">
                {{ events.meta.total }} événement{{ events.meta.total > 1 ? 's' : '' }} trouvé{{ events.meta.total > 1 ?
                's' : '' }}
            </div>

            <!-- Liste des événements -->
            <div v-if="events.data.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Link v-for="event in events.data" :key="event.id" :href="`/events/${event.id}`"
                    class="bg-white rounded-lg shadow-sm hover:shadow-lg border border-sand-7 hover:border-primary/50 overflow-hidden transition group">
                <!-- Image -->
                <div class="h-48 bg-gradient-to-br from-primary/20 to-primary/40 relative overflow-hidden">
                    <img v-if="event.imageUrl" :src="`/uploads/${event.imageUrl}`" :alt="event.name"
                        class="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    <div v-else class="w-full h-full flex items-center justify-center text-6xl text-primary/50">
                        🎪
                    </div>

                    <!-- Badge catégorie -->
                    <div class="absolute top-3 left-3">
                        <span class="px-3 py-1 bg-white/90 backdrop-blur text-primary text-xs font-medium rounded-full">
                            {{ event.categoryLabel }}
                        </span>
                    </div>

                    <!-- Badge prix -->
                    <div class="absolute top-3 right-3">
                        <span class="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">
                            {{ event.price === 0 ? 'GRATUIT' : `${event.price} DA` }}
                        </span>
                    </div>
                </div>

                <!-- Contenu -->
                <div class="p-6">
                    <h3 class="text-xl font-bold text-sand-12 mb-2 group-hover:text-primary transition">
                        {{ event.name }}
                    </h3>

                    <p class="text-sand-11 text-sm mb-4 line-clamp-2">
                        {{ event.description }}
                    </p>

                    <!-- Infos -->
                    <div class="space-y-2 text-sm text-sand-11">
                        <div class="flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{{ event.startDate }}</span>
                        </div>

                        <div class="flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{{ event.location }}</span>
                        </div>

                        <!-- Places disponibles -->
                        <div class="flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span v-if="event.isFull" class="text-red-600 font-medium">Complet</span>
                            <span v-else>{{ event.availableSpots }} / {{ event.maxCapacity }} places</span>
                        </div>
                    </div>

                    <!-- Statut -->
                    <div class="mt-4 pt-4 border-t border-sand-6">
                        <span v-if="event.canRegister"
                            class="inline-flex items-center text-green-700 text-sm font-medium">
                            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clip-rule="evenodd" />
                            </svg>
                            Inscriptions ouvertes
                        </span>
                        <span v-else-if="event.isFull"
                            class="inline-flex items-center text-red-700 text-sm font-medium">
                            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clip-rule="evenodd" />
                            </svg>
                            Complet
                        </span>
                        <span v-else class="inline-flex items-center text-orange-700 text-sm font-medium">
                            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                    clip-rule="evenodd" />
                            </svg>
                            Inscriptions fermées
                        </span>
                    </div>
                </div>
                </Link>
            </div>

            <!-- Message si aucun événement -->
            <div v-else class="text-center py-12">
                <div class="text-6xl mb-4">🔍</div>
                <h3 class="text-2xl font-bold text-sand-12 mb-2">Aucun événement trouvé</h3>
                <p class="text-sand-11 mb-6">Essayez de modifier vos filtres de recherche</p>
                <button @click="clearFilters"
                    class="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-6 rounded-lg transition">
                    Réinitialiser les filtres
                </button>
            </div>

            <!-- Pagination -->
            <div v-if="events.meta.last_page > 1" class="flex justify-center gap-2">
                <Link v-for="page in events.meta.last_page" :key="page" :href="`/events?page=${page}`" :class="[
                    'px-4 py-2 rounded-lg font-medium transition',
                    page === events.meta.current_page
                        ? 'bg-primary text-white'
                        : 'bg-white border border-sand-7 hover:bg-sand-3 text-sand-12'
                ]" preserve-state>
                {{ page }}
                </Link>
            </div>
        </div>
    </div>
</template>