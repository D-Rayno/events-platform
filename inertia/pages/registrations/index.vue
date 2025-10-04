<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3'

defineProps<{
    registrations: Array<{
        id: number
        status: keyof BadgeReturn
        statusLabel: string
        hasAttended: boolean
        registeredAt: string
        event: {
            id: number
            name: string
            location: string
            startDate: string
            endDate: string
            imageUrl: string | null
            category: string
            categoryLabel: string
            isUpcoming: boolean
            isOngoing: boolean
            isPast: boolean
        }
    }>
}>()

type BadgeReturn = typeof BADGES | 'bg-gray-100 text-gray-800'

const cancelRegistration = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir annuler cette inscription ?')) {
        router.delete(`/registrations/${id}`, {
            preserveScroll: true,
        })
    }
}

const BADGES = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-gray-100 text-gray-800',
    rejected: 'bg-red-100 text-red-800',
    attended: 'bg-blue-100 text-blue-800',
} as const



const getStatusBadge = (status: keyof BadgeReturn): BadgeReturn => {

    return BADGES[status] || 'bg-gray-100 text-gray-800'
}
</script>

<template>

    <Head title="Mes inscriptions" />

    <div class="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10">
        <!-- Header -->
        <div class="bg-white shadow-sm border-b border-sand-7">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-4xl font-bold text-sand-12">Mes inscriptions</h1>
                        <p class="mt-2 text-sand-11">Gérez vos inscriptions aux événements</p>
                    </div>
                    <div class="flex gap-3">
                        <Link href="/events" class="text-primary hover:underline">Découvrir des événements</Link>
                        <span class="text-sand-7">|</span>
                        <Link href="/profile" class="text-primary hover:underline">Mon profil</Link>
                    </div>
                </div>
            </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Liste des inscriptions -->
            <div v-if="registrations.length > 0" class="space-y-4">
                <div v-for="reg in registrations" :key="reg.id"
                    class="bg-white rounded-lg shadow-sm border border-sand-7 hover:shadow-md transition overflow-hidden">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
                        <!-- Image et badge -->
                        <div class="relative">
                            <div
                                class="h-32 md:h-full rounded-lg bg-gradient-to-br from-primary/20 to-primary/40 overflow-hidden">
                                <img v-if="reg.event.imageUrl" :src="`/uploads/${reg.event.imageUrl}`"
                                    :alt="reg.event.name" class="w-full h-full object-cover" />
                                <div v-else
                                    class="w-full h-full flex items-center justify-center text-4xl text-primary/50">
                                    🎪
                                </div>
                            </div>
                            <span :class="[
                                'absolute top-2 right-2 px-3 py-1 text-xs font-medium rounded-full',
                                getStatusBadge(reg.status)
                            ]">
                                {{ reg.statusLabel }}
                            </span>
                        </div>

                        <!-- Informations de l'événement -->
                        <div class="md:col-span-2 space-y-3">
                            <div>
                                <Link :href="`/events/${reg.event.id}`"
                                    class="text-xl font-bold text-sand-12 hover:text-primary transition">
                                {{ reg.event.name }}
                                </Link>
                                <span class="ml-2 px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                                    {{ reg.event.categoryLabel }}
                                </span>
                            </div>

                            <div class="space-y-2 text-sm text-sand-11">
                                <div class="flex items-center gap-2">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{{ reg.event.startDate }}</span>
                                </div>

                                <div class="flex items-center gap-2">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{{ reg.event.location }}</span>
                                </div>

                                <div class="flex items-center gap-2">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Inscrit le {{ reg.registeredAt }}</span>
                                </div>
                            </div>

                            <!-- Statut de l'événement -->
                            <div>
                                <span v-if="reg.event.isUpcoming"
                                    class="inline-flex items-center text-green-700 text-xs font-medium">
                                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    À venir
                                </span>
                                <span v-else-if="reg.event.isOngoing"
                                    class="inline-flex items-center text-blue-700 text-xs font-medium">
                                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    En cours
                                </span>
                                <span v-else class="inline-flex items-center text-gray-700 text-xs font-medium">
                                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    Terminé
                                </span>

                                <!-- Badge présence -->
                                <span v-if="reg.hasAttended"
                                    class="ml-2 inline-flex items-center text-blue-700 text-xs font-medium">
                                    ✓ Présence validée
                                </span>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex flex-col justify-between gap-2">
                            <Link :href="`/registrations/${reg.id}`"
                                class="w-full bg-primary hover:bg-primary/90 text-white text-center font-medium py-2 px-4 rounded-lg transition">
                            Voir le QR Code
                            </Link>

                            <button
                                v-if="(reg.status === 'confirmed' || reg.status === 'pending') && reg.event.isUpcoming"
                                @click="cancelRegistration(reg.id)"
                                class="w-full bg-red-50 hover:bg-red-100 text-red-700 font-medium py-2 px-4 rounded-lg border border-red-200 transition">
                                Annuler
                            </button>

                            <Link :href="`/events/${reg.event.id}`"
                                class="w-full bg-sand-3 hover:bg-sand-4 text-sand-12 text-center font-medium py-2 px-4 rounded-lg border border-sand-7 transition">
                            Voir l'événement
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Message si aucune inscription -->
            <div v-else class="text-center py-12">
                <div class="text-6xl mb-4">📋</div>
                <h3 class="text-2xl font-bold text-sand-12 mb-2">Aucune inscription</h3>
                <p class="text-sand-11 mb-6">Vous n'êtes inscrit à aucun événement pour le moment</p>
                <Link href="/events"
                    class="inline-block bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition">
                Découvrir les événements
                </Link>
            </div>
        </div>
    </div>
</template>