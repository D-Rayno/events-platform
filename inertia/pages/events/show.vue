<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3'

const props = defineProps<{
  event: {
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
    organizerName: string
    organizerEmail: string
    organizerPhone: string | null
    isFeatured: boolean
    requiresApproval: boolean
    canRegister: boolean
    isFull: boolean
    isUpcoming: boolean
    isOngoing: boolean
    isPast: boolean
  }
  isRegistered: boolean
  registration: {
    id: number
    status: string
    registeredAt: string
  } | null
}>()

const register = () => {
  if (confirm('Voulez-vous vous inscrire à cet événement ?')) {
    router.post(
      `/events/${props.event.id}/register`,
      {},
      {
        preserveScroll: true,
      }
    )
  }
}
</script>

<template>
  <Head :title="event.name" />

  <div class="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10">
    <!-- Header avec image -->
    <div class="relative h-96 bg-gradient-to-br from-primary/20 to-primary/40">
      <img
        v-if="event.imageUrl"
        :src="`/uploads/${event.imageUrl}`"
        :alt="event.name"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

      <!-- Breadcrumb -->
      <div class="absolute top-8 left-0 right-0">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center gap-2 text-white text-sm">
            <Link href="/" class="hover:underline">Accueil</Link>
            <span>/</span>
            <Link href="/events" class="hover:underline">Événements</Link>
            <span>/</span>
            <span class="font-medium">{{ event.name }}</span>
          </div>
        </div>
      </div>

      <!-- Titre -->
      <div class="absolute bottom-8 left-0 right-0">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-end gap-4">
            <span class="px-4 py-1.5 bg-white text-primary text-sm font-bold rounded-full">
              {{ event.categoryLabel }}
            </span>
            <span
              v-if="event.isFeatured"
              class="px-4 py-1.5 bg-yellow-500 text-white text-sm font-bold rounded-full"
            >
              ⭐ En vedette
            </span>
          </div>
          <h1 class="text-5xl font-bold text-white mt-4">{{ event.name }}</h1>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Contenu principal -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Description -->
          <div class="bg-white rounded-lg shadow-sm border border-sand-7 p-8">
            <h2 class="text-2xl font-bold text-sand-12 mb-4">À propos de l'événement</h2>
            <p class="text-sand-11 whitespace-pre-line leading-relaxed">{{ event.description }}</p>
          </div>

          <!-- Organisateur -->
          <div class="bg-white rounded-lg shadow-sm border border-sand-7 p-8">
            <h2 class="text-2xl font-bold text-sand-12 mb-4">Organisateur</h2>
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <div
                  class="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xl"
                >
                  {{ event.organizerName[0] }}
                </div>
                <div>
                  <p class="font-semibold text-sand-12">{{ event.organizerName }}</p>
                  <a
                    :href="`mailto:${event.organizerEmail}`"
                    class="text-primary hover:underline text-sm"
                  >
                    {{ event.organizerEmail }}
                  </a>
                </div>
              </div>
              <p v-if="event.organizerPhone" class="text-sand-11 text-sm">
                📞 {{ event.organizerPhone }}
              </p>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Carte d'inscription -->
          <div class="bg-white rounded-lg shadow-lg border border-sand-7 p-6 sticky top-8">
            <!-- Prix -->
            <div class="text-center mb-6">
              <div class="text-4xl font-bold text-primary">
                {{ event.price === 0 ? 'GRATUIT' : `${event.price} DA` }}
              </div>
            </div>

            <!-- Informations clés -->
            <div class="space-y-4 mb-6">
              <div class="flex items-start gap-3">
                <svg
                  class="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <div class="flex-1">
                  <p class="font-medium text-sand-12">Date de début</p>
                  <p class="text-sm text-sand-11">{{ event.startDate }}</p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <svg
                  class="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <div class="flex-1">
                  <p class="font-medium text-sand-12">Date de fin</p>
                  <p class="text-sm text-sand-11">{{ event.endDate }}</p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <svg
                  class="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div class="flex-1">
                  <p class="font-medium text-sand-12">Lieu</p>
                  <p class="text-sm text-sand-11">{{ event.location }}</p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <svg
                  class="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <div class="flex-1">
                  <p class="font-medium text-sand-12">Places disponibles</p>
                  <p class="text-sm text-sand-11">
                    {{ event.availableSpots }} / {{ event.maxCapacity }}
                  </p>
                  <div class="mt-2 w-full bg-sand-4 rounded-full h-2">
                    <div
                      class="bg-primary h-2 rounded-full transition-all"
                      :style="{ width: `${(event.registeredCount / event.maxCapacity) * 100}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bouton d'inscription -->
            <div v-if="isRegistered" class="space-y-3">
              <div class="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p class="text-green-800 font-medium mb-1">✓ Vous êtes inscrit</p>
                <p class="text-green-700 text-sm">Inscrit le {{ registration?.registeredAt }}</p>
              </div>
              <Link
                :href="`/registrations/${registration?.id}`"
                class="block w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg text-center transition"
              >
                Voir mon QR Code
              </Link>
            </div>

            <div v-else>
              <button
                v-if="event.canRegister"
                @click="register"
                class="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                S'inscrire maintenant
              </button>

              <div
                v-else-if="event.isFull"
                class="bg-red-50 border border-red-200 rounded-lg p-4 text-center"
              >
                <p class="text-red-800 font-medium">Événement complet</p>
              </div>

              <div
                v-else-if="event.isPast"
                class="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center"
              >
                <p class="text-gray-800 font-medium">Événement terminé</p>
              </div>

              <div v-else class="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                <p class="text-orange-800 font-medium">Inscriptions fermées</p>
              </div>
            </div>

            <!-- Info approbation -->
            <div v-if="event.requiresApproval && !isRegistered" class="mt-4 text-center">
              <p class="text-xs text-sand-10">ℹ️ Votre inscription nécessitera une validation</p>
            </div>
          </div>

          <!-- Statistiques -->
          <div class="bg-white rounded-lg shadow-sm border border-sand-7 p-6">
            <h3 class="font-semibold text-sand-12 mb-4">Informations</h3>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-sand-11">Inscrits</span>
                <span class="font-medium text-sand-12">{{ event.registeredCount }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sand-11">Places totales</span>
                <span class="font-medium text-sand-12">{{ event.maxCapacity }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sand-11">Statut</span>
                <span v-if="event.isUpcoming" class="text-green-700 font-medium">À venir</span>
                <span v-else-if="event.isOngoing" class="text-blue-700 font-medium">En cours</span>
                <span v-else class="text-gray-700 font-medium">Terminé</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
