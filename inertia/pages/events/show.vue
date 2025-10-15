<script setup lang="ts">
import { Head, Link, router, usePage } from '@inertiajs/vue3'
import { ref, computed } from 'vue'
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  TicketIcon,
  ShareIcon,
  ArrowLeftIcon,
} from '@heroicons/vue/24/outline'
import AppLayout from '#layouts/AppLayout.vue'
import Button from '#ui/Button.vue'
import Card from '#ui/Card.vue'
import Badge from '#ui/Badge.vue'
import Image from '#ui/Image.vue'
import Alert from '#ui/Alert.vue'
import { useAuthStore } from '#stores/auth'

interface Event {
  id: number
  name: string
  description: string
  location: string
  province: string
  commune: string
  startDate: string
  endDate: string
  capacity: number
  registeredCount: number
  availableSeats: number
  imageUrl: string | null
  category: string
  basePrice: number
  minAge: number
  maxAge: number | null
  isFull: boolean
  canRegister: boolean
  requiresApproval: boolean
  isUpcoming: boolean
  isOngoing: boolean
  isFinished: boolean
}

interface PageProps {
  event: Event
  isRegistered: boolean
  registration: {
    id: number
    status: string
    createdAt: string
  } | null
  userAge: number | null
  isAgeEligible: boolean
  userPrice: number
}

const props = defineProps<PageProps>()
const page = usePage()
const authStore = useAuthStore()

const registering = ref(false)

const availabilityPercentage = computed(() => {
  return Math.min((props.event.registeredCount / props.event.capacity) * 100, 100)
})

const statusBadgeConfig = computed(() => {
  if (props.event.isOngoing) return { text: 'Happening Now', color: 'info' as const }
  if (props.event.isFinished) return { text: 'Finished', color: 'neutral' as const }
  return { text: 'Upcoming', color: 'success' as const }
})

const handleRegister = () => {
  if (!authStore.isAuthenticated) {
    router.visit('/auth/login')
    return
  }

  if (!props.isAgeEligible) {
    alert(`This event is for ages ${props.event.minAge} to ${props.event.maxAge || 'any age'}`)
    return
  }

  if (confirm('Register for this event?')) {
    registering.value = true
    router.post(`/events/${props.event.id}/register`, {}, {
      onFinish: () => {
        registering.value = false
      },
    })
  }
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(window.location.href)
  alert('Event link copied to clipboard!')
}
</script>

<template>
  <Head :title="event.name" />

  <AppLayout>
    <!-- Back Button -->
    <Link
      href="/events"
      class="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-6"
    >
      <ArrowLeftIcon class="w-5 h-5" />
      Back to Events
    </Link>

    <!-- Hero Section -->
    <div
      class="relative h-96 rounded-2xl overflow-hidden mb-8 shadow-lg"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
    >
      <Image
        :src="event.imageUrl as string | undefined"
        :alt="event.name"
        aspect-ratio="21/9"
        rounded="xl"
      />
      <!-- Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      <!-- Title & Status -->
      <div class="absolute bottom-0 left-0 right-0 p-8 text-white">
        <div class="flex items-end justify-between gap-4">
          <div>
            <div class="flex gap-2 mb-3">
              <Badge variant="secondary" size="sm">{{ event.category }}</Badge>
              <Badge :variant="statusBadgeConfig.color" size="sm">
                {{ statusBadgeConfig.text }}
              </Badge>
            </div>
            <h1 class="text-4xl md:text-5xl font-bold">{{ event.name }}</h1>
          </div>
          <div class="text-right">
            <div class="text-4xl font-bold">
              {{ event.basePrice === 0 ? 'Free' : `$${event.basePrice}` }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      <!-- Left Content -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Description -->
        <Card>
          <h2 class="text-2xl font-bold text-neutral-900 mb-4">About This Event</h2>
          <p class="text-neutral-700 leading-relaxed whitespace-pre-line">
            {{ event.description }}
          </p>
        </Card>

        <!-- Event Details -->
        <Card>
          <h2 class="text-2xl font-bold text-neutral-900 mb-6">Event Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Date -->
            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-primary-100">
                  <CalendarIcon class="w-6 h-6 text-primary-600" />
                </div>
              </div>
              <div>
                <h3 class="font-semibold text-neutral-900">Date & Time</h3>
                <p class="text-neutral-600 text-sm mt-1">Starts: {{ event.startDate }}</p>
                <p class="text-neutral-600 text-sm">Ends: {{ event.endDate }}</p>
              </div>
            </div>

            <!-- Location -->
            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-primary-100">
                  <MapPinIcon class="w-6 h-6 text-primary-600" />
                </div>
              </div>
              <div>
                <h3 class="font-semibold text-neutral-900">Location</h3>
                <p class="text-neutral-600 text-sm mt-1">{{ event.location }}</p>
                <p class="text-neutral-600 text-sm">{{ event.commune }}, {{ event.province }}</p>
              </div>
            </div>

            <!-- Capacity -->
            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-primary-100">
                  <UsersIcon class="w-6 h-6 text-primary-600" />
                </div>
              </div>
              <div>
                <h3 class="font-semibold text-neutral-900">Capacity</h3>
                <p class="text-neutral-600 text-sm mt-1">
                  {{ event.registeredCount }} / {{ event.capacity }} registered
                </p>
                <div class="mt-2 h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all"
                    :style="{ width: `${availabilityPercentage}%` }"
                  />
                </div>
              </div>
            </div>

            <!-- Age Requirements -->
            <div v-if="event.minAge || event.maxAge" class="flex gap-4">
              <div class="flex-shrink-0">
                <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-primary-100">
                  <TicketIcon class="w-6 h-6 text-primary-600" />
                </div>
              </div>
              <div>
                <h3 class="font-semibold text-neutral-900">Age Requirements</h3>
                <p class="text-neutral-600 text-sm mt-1">
                  {{ event.minAge }}
                  {{ event.maxAge ? ` to ${event.maxAge}` : '+ years old' }}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- Right Sidebar -->
      <div class="lg:col-span-1">
        <!-- Registration Card -->
        <Card
          class="sticky top-20"
          v-motion
          :initial="{ opacity: 0, x: 20 }"
          :enter="{ opacity: 1, x: 0, transition: { duration: 400, delay: 150 } }"
        >
          <!-- Already Registered -->
          <div v-if="isRegistered" class="mb-6">
            <Alert type="success">
              <div class="flex items-start gap-2">
                <svg class="w-5 h-5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                <div>
                  <p class="font-semibold">You're Registered!</p>
                  <p class="text-sm text-neutral-600">
                    Registered {{ registration?.createdAt }}
                  </p>
                </div>
              </div>
            </Alert>

            <div class="mt-4 space-y-3">
              <Link :href="`/registrations/${registration?.id}`" class="block">
                <Button variant="primary" size="md" full-width :icon-left="TicketIcon">
                  View QR Code
                </Button>
              </Link>
              <Link href="/registrations" class="block">
                <Button variant="outline" size="md" full-width>
                  My Registrations
                </Button>
              </Link>
            </div>
          </div>

          <!-- Registration Options -->
          <div v-else class="space-y-4">
            <!-- Age Eligibility Warning -->
            <Alert v-if="authStore.isAuthenticated && !isAgeEligible" type="error">
              This event is not available for your age group
            </Alert>

            <!-- Not Authenticated -->
            <div v-if="!authStore.isAuthenticated" class="text-center py-4">
              <p class="text-neutral-600 mb-4">Sign in to register for this event</p>
              <Link href="/auth/login" class="block mb-2">
                <Button variant="primary" size="lg" full-width>
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register" class="block">
                <Button variant="outline" size="lg" full-width>
                  Create Account
                </Button>
              </Link>
            </div>

            <!-- Registration Button -->
            <div v-else>
              <div
                v-if="event.requiresApproval"
                class="mb-4 p-3 bg-warning-50 border border-warning-200 rounded-lg text-sm text-warning-800"
              >
                <strong>Note:</strong> Your registration will require approval
              </div>

              <Button
                v-if="event.canRegister"
                variant="primary"
                size="lg"
                full-width
                :loading="registering"
                :disabled="registering || event.isFull"
                @click="handleRegister"
              >
                {{ event.isFull ? 'Event Full' : 'Register Now' }}
              </Button>

              <Alert v-else-if="event.isFull" type="error">
                This event is full
              </Alert>

              <Alert v-else-if="event.isFinished" type="warning">
                This event has ended
              </Alert>

              <Alert v-else type="info">
                Registrations are closed
              </Alert>
            </div>

            <!-- Share Button -->
            <Button
              variant="ghost"
              size="md"
              full-width
              :icon-left="ShareIcon"
              @click="copyToClipboard"
            >
              Share Event
            </Button>
          </div>

          <!-- Availability Summary -->
          <div class="mt-6 pt-6 border-t border-neutral-200">
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-600">
                {{ event.isFull ? '0' : event.availableSeats }}
              </div>
              <p class="text-sm text-neutral-600 mt-1">
                {{ event.isFull ? 'No spots available' : 'Spots available' }}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </AppLayout>
</template>