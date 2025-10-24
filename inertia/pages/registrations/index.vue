<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3'
import { ref, computed } from 'vue'
import { TrashIcon, EyeIcon, CalendarIcon, MapPinIcon } from '@heroicons/vue/24/outline'
import AppLayout from '~/components/layouts/AppLayout'
import Button from '#ui/Button.vue'
import Card from '#ui/Card.vue'
import Badge from '#ui/Badge.vue'
import Image from '#ui/Image.vue'
import { useProtectedLayout } from '#composables/use_protected_layout'

interface Registration {
  id: number
  status: 'pending' | 'confirmed' | 'attended' | 'canceled'
  qrCode: string
  registeredAt: string
  hasAttended: boolean
  event: {
    id: number
    name: string
    location: string
    startDate: string
    endDate: string
    imageUrl: string | null
    isUpcoming: boolean
    isOngoing: boolean
    isPast: boolean
  }
}

interface PageProps {
  registrations: Registration[]
}

const props = defineProps<PageProps>()

// Protect page - require authentication
useProtectedLayout({ requiresAuth: true })

const cancelingId = ref<number | null>(null)

const statusConfig = {
  pending: { label: 'Pending', color: 'warning' as const },
  confirmed: { label: 'Confirmed', color: 'success' as const },
  attended: { label: 'Attended', color: 'info' as const },
  canceled: { label: 'Canceled', color: 'error' as const },
}

const eventStatusConfig = {
  upcoming: { label: 'Upcoming', color: 'info' as const },
  ongoing: { label: 'Ongoing', color: 'warning' as const },
  finished: { label: 'Finished', color: 'neutral' as const },
}

const groupedRegistrations = computed(() => {
  const groups: Record<string, Registration[]> = {
    upcoming: [],
    past: [],
    attended: [],
  }

  props.registrations.forEach((reg) => {
    if (reg.hasAttended) {
      groups.attended.push(reg)
    } else if (reg.event.isUpcoming) {
      groups.upcoming.push(reg)
    } else {
      groups.past.push(reg)
    }
  })

  return groups
})

const cancelRegistration = (id: number) => {
  if (confirm('Are you sure you want to cancel this registration? This action cannot be undone.')) {
    cancelingId.value = id
    router.delete(`/registrations/${id}`, {
      preserveScroll: true,
      onFinish: () => {
        cancelingId.value = null
      },
    })
  }
}

const getEventStatus = (event: Registration['event']) => {
  if (event.isUpcoming) return eventStatusConfig.upcoming
  if (event.isOngoing) return eventStatusConfig.ongoing
  return eventStatusConfig.finished
}
</script>

<template>
  <Head title="My Registrations" />

  <AppLayout>
    <!-- Header -->
    <div class="mb-8">
      <h1
        class="text-4xl font-bold text-neutral-900 mb-2"
        v-motion
        :initial="{ opacity: 0, y: -20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }"
      >
        My Event Registrations
      </h1>
      <p
        class="text-neutral-600"
        v-motion
        :initial="{ opacity: 0, y: -10 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 400, delay: 100 } }"
      >
        Manage your event registrations and view your QR codes
      </p>
    </div>

    <!-- Stats -->
    <div
      class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 400, delay: 150 } }"
    >
      <Card class="text-center">
        <div class="text-3xl font-bold text-primary-600">{{ props.registrations.length }}</div>
        <div class="text-sm text-neutral-600 mt-1">Total Registrations</div>
      </Card>
      <Card class="text-center">
        <div class="text-3xl font-bold text-info-600">
          {{ groupedRegistrations.upcoming.length }}
        </div>
        <div class="text-sm text-neutral-600 mt-1">Upcoming Events</div>
      </Card>
      <Card class="text-center">
        <div class="text-3xl font-bold text-success-600">
          {{ groupedRegistrations.attended.length }}
        </div>
        <div class="text-sm text-neutral-600 mt-1">Events Attended</div>
      </Card>
    </div>

    <!-- Upcoming Registrations -->
    <section v-if="groupedRegistrations.upcoming.length > 0" class="mb-12">
      <h2 class="text-2xl font-bold text-neutral-900 mb-6">Upcoming Events</h2>
      <div class="space-y-4">
        <div
          v-for="(reg, index) in groupedRegistrations.upcoming"
          :key="reg.id"
          v-motion
          :initial="{ opacity: 0, x: -20 }"
          :enter="{
            opacity: 1,
            x: 0,
            transition: { duration: 300, delay: index * 50 },
          }"
        >
          <Card class="overflow-hidden hover:shadow-lg transition-shadow">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
              <!-- Image -->
              <div class="relative h-40 md:h-full rounded-lg overflow-hidden bg-neutral-200">
                <Image
                  :src="reg.event.imageUrl as string | undefined"
                  :alt="reg.event.name"
                  aspect-ratio="16/9"
                  class="group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <!-- Content -->
              <div class="md:col-span-2 space-y-3">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <h3 class="text-lg font-bold text-neutral-900">{{ reg.event.name }}</h3>
                    <Badge
                      :variant="statusConfig[reg.status].color"
                      size="sm"
                      class="mt-2"
                    >
                      {{ statusConfig[reg.status].label }}
                    </Badge>
                  </div>
                  <Badge
                    :variant="getEventStatus(reg.event).color"
                    size="sm"
                  >
                    {{ getEventStatus(reg.event).label }}
                  </Badge>
                </div>

                <div class="space-y-2 text-sm">
                  <div class="flex items-center gap-2 text-neutral-600">
                    <CalendarIcon class="w-4 h-4 flex-shrink-0 text-primary-500" />
                    <span>{{ reg.event.startDate }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-neutral-600">
                    <MapPinIcon class="w-4 h-4 flex-shrink-0 text-primary-500" />
                    <span>{{ reg.event.location }}</span>
                  </div>
                </div>

                <p class="text-xs text-neutral-500">
                  Registered on {{ reg.registeredAt }}
                </p>
              </div>

              <!-- Actions -->
              <div class="flex flex-col gap-2">
                <Link
                  :href="`/registrations/${reg.id}`"
                  class="flex-1"
                >
                  <Button variant="primary" size="md" full-width :icon-left="EyeIcon">
                    View QR Code
                  </Button>
                </Link>

                <Button
                  v-if="reg.event.isUpcoming && reg.status !== 'canceled'"
                  variant="danger"
                  size="md"
                  full-width
                  :icon-left="TrashIcon"
                  :loading="cancelingId === reg.id"
                  :disabled="cancelingId === reg.id"
                  @click="cancelRegistration(reg.id)"
                >
                  Cancel
                </Button>

                <Link :href="`/events/${reg.event.id}`" class="flex-1">
                  <Button variant="ghost" size="md" full-width>
                    Event Details
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>

    <!-- Past Registrations -->
    <section v-if="groupedRegistrations.past.length > 0" class="mb-12">
      <h2 class="text-2xl font-bold text-neutral-900 mb-6">Past Events</h2>
      <div class="space-y-4">
        <div
          v-for="(reg, index) in groupedRegistrations.past"
          :key="reg.id"
          v-motion
          :initial="{ opacity: 0, x: -20 }"
          :enter="{
            opacity: 1,
            x: 0,
            transition: { duration: 300, delay: index * 50 },
          }"
        >
          <Card class="overflow-hidden opacity-75 hover:opacity-100 transition-opacity">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
              <!-- Image -->
              <div class="relative h-40 md:h-full rounded-lg overflow-hidden bg-neutral-200">
                <Image
                  :src="reg.event.imageUrl as string | undefined"
                  :alt="reg.event.name"
                  aspect-ratio="16/9"
                />
              </div>

              <!-- Content -->
              <div class="md:col-span-3 space-y-3">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <h3 class="text-lg font-bold text-neutral-900">{{ reg.event.name }}</h3>
                    <Badge
                      :variant="statusConfig[reg.status].color"
                      size="sm"
                      class="mt-2"
                    >
                      {{ statusConfig[reg.status].label }}
                    </Badge>
                  </div>
                  <Badge variant="neutral" size="sm">
                    Finished
                  </Badge>
                </div>

                <div class="space-y-2 text-sm">
                  <div class="flex items-center gap-2 text-neutral-600">
                    <CalendarIcon class="w-4 h-4 flex-shrink-0" />
                    <span>{{ reg.event.endDate }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-neutral-600">
                    <MapPinIcon class="w-4 h-4 flex-shrink-0" />
                    <span>{{ reg.event.location }}</span>
                  </div>
                </div>

                <div v-if="reg.hasAttended" class="inline-flex items-center gap-1 text-success-600 text-sm font-medium">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Attendance Confirmed
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>

    <!-- Empty State -->
    <div v-if="props.registrations.length === 0" class="text-center py-16">
      <div class="text-6xl mb-4">📋</div>
      <h3 class="text-2xl font-bold text-neutral-900 mb-2">No Registrations Yet</h3>
      <p class="text-neutral-600 mb-6">
        You haven't registered for any events. Start exploring and register for upcoming events!
      </p>
      <Link href="/events">
        <Button variant="primary" size="lg">
          Discover Events
        </Button>
      </Link>
    </div>
  </AppLayout>
</template>