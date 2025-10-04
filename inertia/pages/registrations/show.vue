<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'

defineProps<{
  registration: {
    id: number
    qrCode: string
    qrCodeImage: string
    status: string
    statusLabel: string
    hasAttended: boolean
    attendedAt: string | null
    registeredAt: string
    event: {
      id: number
      name: string
      description: string
      location: string
      startDate: string
      endDate: string
      imageUrl: string | null
      organizerName: string
      organizerEmail: string
      organizerPhone: string | null
    }
  }
}>()

const downloadQRCode = (qrCodeImage: string, eventName: string) => {
  const link = document.createElement('a')
  link.href = qrCodeImage
  link.download = `qr-code-${eventName.replace(/\s+/g, '-').toLowerCase()}.png`
  link.click()
}

const printTicket = () => {
  window.print()
}
</script>

<template>
  <Head :title="`Billet - ${registration.event.name}`" />

  <div class="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Boutons de navigation -->
      <div class="mb-6 flex justify-between items-center print:hidden">
        <Link href="/registrations" class="text-primary hover:underline flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Retour à mes inscriptions
        </Link>

        <div class="flex gap-2">
          <button
            @click="downloadQRCode(registration.qrCodeImage, registration.event.name)"
            class="px-4 py-2 bg-sand-3 hover:bg-sand-4 text-sand-12 font-medium rounded-lg border border-sand-7 transition"
          >
            Télécharger le QR Code
          </button>
          <button
            @click="printTicket"
            class="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition"
          >
            Imprimer le billet
          </button>
        </div>
      </div>

      <!-- Billet / Ticket -->
      <div class="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-sand-7">
        <!-- Header du billet -->
        <div class="bg-gradient-to-r from-primary to-primary/80 p-8 text-white relative overflow-hidden">
          <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <span class="px-4 py-1.5 bg-white/20 backdrop-blur rounded-full text-sm font-medium">
                🎫 E-Billet
              </span>
              <span
                :class="[
                  'px-4 py-1.5 rounded-full text-sm font-bold',
                  registration.status === 'confirmed' ? 'bg-green-500' : 
                  registration.status === 'pending' ? 'bg-yellow-500' :
                  registration.status === 'attended' ? 'bg-blue-500' : 'bg-gray-500'
                ]"
              >
                {{ registration.statusLabel }}
              </span>
            </div>
            
            <h1 class="text-3xl font-bold mb-2">{{ registration.event.name }}</h1>
            <p class="text-white/90">Billet d'accès personnel</p>
          </div>
        </div>

        <!-- Contenu principal -->
        <div class="p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- QR Code -->
            <div class="flex flex-col items-center">
              <div class="bg-white p-6 rounded-xl border-4 border-primary/20 shadow-lg">
                <img
                  :src="registration.qrCodeImage"
                  :alt="`QR Code pour ${registration.event.name}`"
                  class="w-64 h-64"
                />
              </div>
              
              <div class="mt-4 text-center">
                <p class="text-xs text-sand-10 mb-1">Code de référence</p>
                <p class="font-mono text-sm font-medium text-sand-12 bg-sand-3 px-3 py-1 rounded">
                  {{ registration.qrCode }}
                </p>
              </div>

              <!-- Badge présence -->
              <div v-if="registration.hasAttended" class="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 w-full">
                <div class="text-center">
                  <svg class="w-12 h-12 text-blue-600 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <p class="font-semibold text-blue-900">Présence validée</p>
                  <p class="text-sm text-blue-700">Le {{ registration.attendedAt }}</p>
                </div>
              </div>
            </div>

            <!-- Informations de l'événement -->
            <div class="space-y-6">
              <div>
                <h2 class="text-xl font-bold text-sand-12 mb-4">Informations de l'événement</h2>
                
                <div class="space-y-4">
                  <div class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-primary mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p class="font-medium text-sand-12">Date et heure</p>
                      <p class="text-sand-11">Début : {{ registration.event.startDate }}</p>
                      <p class="text-sand-11">Fin : {{ registration.event.endDate }}</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-primary mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p class="font-medium text-sand-12">Lieu</p>
                      <p class="text-sand-11">{{ registration.event.location }}</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-primary mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div>
                      <p class="font-medium text-sand-12">Organisateur</p>
                      <p class="text-sand-11">{{ registration.event.organizerName }}</p>
                      <p class="text-sand-11 text-sm">{{ registration.event.organizerEmail }}</p>
                      <p v-if="registration.event.organizerPhone" class="text-sand-11 text-sm">
                        {{ registration.event.organizerPhone }}
                      </p>
                    </div>
                  </div>

                  <div class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-primary mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p class="font-medium text-sand-12">Inscrit le</p>
                      <p class="text-sand-11">{{ registration.registeredAt }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Instructions -->
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 class="font-semibold text-blue-900 mb-2">📱 Instructions</h3>
                <ul class="text-sm text-blue-800 space-y-1">
                  <li>• Présentez ce QR code à l'entrée</li>
                  <li>• Arrivez 15 minutes en avance</li>
                  <li>• Téléchargez ce billet sur votre téléphone</li>
                  <li>• Imprimez-le ou gardez-le accessible</li>
                </ul>
              </div>

              <!-- Actions -->
              <div class="flex gap-2 print:hidden">
                <Link
                  :href="`/events/${registration.event.id}`"
                  class="flex-1 text-center bg-sand-3 hover:bg-sand-4 text-sand-12 font-medium py-3 px-4 rounded-lg border border-sand-7 transition"
                >
                  Voir l'événement
                </Link>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer du billet -->
        <div class="bg-sand-2 border-t border-sand-6 p-6 text-center">
          <p class="text-sm text-sand-11">
            Ce billet est personnel et non transférable. Conservez-le précieusement.
          </p>
          <p class="text-xs text-sand-10 mt-2">
            © 2025 Plateforme d'événements - Tous droits réservés
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@media print {
  body {
    background: white !important;
  }
  
  .print\:hidden {
    display: none !important;
  }
}
</style>