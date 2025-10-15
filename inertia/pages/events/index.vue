<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3'
import { ref, computed } from 'vue'
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, XMarkIcon, CalendarIcon, MapPinIcon, UsersIcon } from '@heroicons/vue/24/outline'
import AppLayout from '#layouts/AppLayout.vue'
import Input from '#ui/Input.vue'
import Select from '#ui/Select.vue'
import Button from '#ui/Button.vue'
import Card from '#ui/Card.vue'
import Badge from '#ui/Badge.vue'
import Image from '#ui/Image.vue'
import { PROVINCES, EVENT_CATEGORIES } from '#lib/constants'

interface Event {
  id: number
  name: string
  description: string
  location: string
  province: string
  startDate: string
  basePrice: number
  imageUrl: string | null
  category: string
  registeredCount: number
  capacity: number
  isFull: boolean
  canRegister: boolean
}

interface PageProps {
  events: {
    data: Event[]
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
    province?: string
  }
}

const props = defineProps<PageProps>()

const searchQuery = ref(props.filters.search || '')
const selectedCategory = ref(props.filters.category || '')
const selectedProvince = ref(props.filters.province || '')
const showFilters = ref(false)

const provinceOptions = PROVINCES.map((p) => ({ value: p, label: p }))
const categoryOptions = EVENT_CATEGORIES.map((c) => ({ value: c, label: c }))

const hasActiveFilters = computed(() => searchQuery.value || selectedCategory.value || selectedProvince.value)

const applyFilters = () => {
  router.get(
    '/events',
    {
      search: searchQuery.value || undefined,
      category: selectedCategory.value || undefined,
      province: selectedProvince.value || undefined,
    },
    { preserveScroll: true }
  )
  showFilters.value = false
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedProvince.value = ''
  router.get('/events', {}, { preserveScroll: true })
}

const goToPage = (page: number) => {
  router.get(
    '/events',
    {
      page,
      search: searchQuery.value || undefined,
      category: selectedCategory.value || undefined,
      province: selectedProvince.value || undefined,
    },
    { preserveScroll: true }
  )
}

const getAvailability = (event: Event) => {
  if (event.isFull) return { text: 'Full', color: 'error' }
  const available = event.capacity - event.registeredCount
  if (available <= 5) return { text: `${available} left`, color: 'warning' }
  return { text: `${available} available`, color: 'success' }
}

const pages = computed(() => {
  const total = props.events.meta.last_page
  const current = props.events.meta.current_page
  const delta = 2
  const result: (number | string)[] = []

  if (current > 1 + delta) {
    result.push(1)
    if (current > 2 + delta) result.push('...')
  }

  for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
    result.push(i)
  }

  if (current < total - delta) {
    if (current < total - 1 - delta) result.push('...')
    result.push(total)
  }

  return result
})
</script>

<template>
  <Head title="Events" />

  <AppLayout layout="full">
    <!-- Hero Section -->
    <div
      class="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12 md:py-16"
      v-motion
      :initial="{ opacity: 0, y: -20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Discover Events</h1>
        <p class="text-white/90 text-lg">Explore amazing events happening near you</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Filters Section -->
      <div class="mb-8">
        <!-- Mobile Filter Toggle -->
        <div class="md:hidden mb-4">
          <Button
            variant="outline"
            size="sm"
            @click="showFilters = !showFilters"
            :icon-right="showFilters ? XMarkIcon : AdjustmentsHorizontalIcon"
            full-width
          >
            {{ showFilters ? 'Hide Filters' : 'Show Filters' }}
          </Button>
        </div>

        <!-- Filter Panel -->
        <div
          :class="[
            'grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white rounded-xl border border-neutral-200',
            !showFilters && 'hidden md:grid',
          ]"
          v-motion
          :initial="{ opacity: 0, y: -10 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 300, delay: 100 } }"
        >
          <Input
            v-model="searchQuery"
            type="text"
            placeholder="Search events..."
            :icon="MagnifyingGlassIcon"
            @keyup.enter="applyFilters"
          />

          <Select
            v-model="selectedCategory"
            placeholder="All Categories"
            :options="categoryOptions"
            searchable
          />

          <Select
            v-model="selectedProvince"
            placeholder="All Provinces"
            :options="provinceOptions"
            searchable
          />

          <div class="flex gap-2 col-span-1 md:col-span-1">
            <Button variant="primary" @click="applyFilters" class="flex-1">
              Filter
            </Button>
            <Button
              v-if="hasActiveFilters"
              variant="outline"
              @click="clearFilters"
              class="flex-1"
            >
              Clear
            </Button>
          </div>
        </div>

        <!-- Active Filters Badge -->
        <div
          v-if="hasActiveFilters"
          class="mt-4 flex flex-wrap gap-2"
          v-motion
          :initial="{ opacity: 0 }"
          :enter="{ opacity: 1, transition: { delay: 150 } }"
        >
          <Badge
            v-if="searchQuery"
            variant="primary"
            rounded
            dot
          >
            Search: {{ searchQuery }}
          </Badge>
          <Badge
            v-if="selectedCategory"
            variant="primary"
            rounded
            dot
          >
            {{ selectedCategory }}
          </Badge>
          <Badge
            v-if="selectedProvince"
            variant="primary"
            rounded
            dot
          >
            {{ selectedProvince }}
          </Badge>
        </div>
      </div>

      <!-- Results Info -->
      <div class="flex justify-between items-center mb-6">
        <p class="text-neutral-600">
          Showing <span class="font-semibold text-neutral-900">{{ props.events.data.length }}</span>
          of
          <span class="font-semibold text-neutral-900">{{ props.events.meta.total }}</span>
          events
        </p>
      </div>

      <!-- Events Grid -->
      <div
        v-if="props.events.data.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
      >
        <Link
          v-for="(event, index) in props.events.data"
          :key="event.id"
          :href="`/events/${event.id}`"
          class="group"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{
            opacity: 1,
            y: 0,
            transition: { duration: 400, delay: Math.min(index * 50, 300) },
          }"
        >
          <Card hoverable class="h-full flex flex-col overflow-hidden">
            <!-- Image -->
            <div class="relative h-48 overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200">
              <Image
                :src="event.imageUrl as string | undefined"
                :alt="event.name"
                aspect-ratio="16/9"
                class="group-hover:scale-105 transition-transform duration-300"
              />
              <!-- Category Badge -->
              <Badge
                variant="secondary"
                size="sm"
                class="absolute top-3 left-3"
              >
                {{ event.category }}
              </Badge>
              <!-- Price Badge -->
              <Badge
                :variant="event.basePrice === 0 ? 'success' : 'primary'"
                size="sm"
                class="absolute top-3 right-3"
              >
                {{ event.basePrice === 0 ? 'Free' : `$${event.basePrice}` }}
              </Badge>
            </div>

            <!-- Content -->
            <div class="flex-1 p-5 flex flex-col">
              <h3 class="text-lg font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                {{ event.name }}
              </h3>

              <p class="text-sm text-neutral-600 mb-4 line-clamp-2">
                {{ event.description }}
              </p>

              <!-- Info Grid -->
              <div class="space-y-2 mb-4 text-sm">
                <div class="flex items-center gap-2 text-neutral-600">
                  <CalendarIcon class="w-4 h-4 flex-shrink-0 text-primary-500" />
                  <span>{{ event.startDate }}</span>
                </div>

                <div class="flex items-center gap-2 text-neutral-600">
                  <MapPinIcon class="w-4 h-4 flex-shrink-0 text-primary-500" />
                  <span>{{ event.location }}</span>
                </div>

                <div class="flex items-center gap-2">
                  <UsersIcon class="w-4 h-4 flex-shrink-0 text-primary-500" />
                  <span
                    :class="[
                      'text-sm font-medium',
                      event.isFull ? 'text-error-600' : getAvailability(event).color === 'warning' ? 'text-warning-600' : 'text-success-600',
                    ]"
                  >
                    {{ getAvailability(event).text }}
                  </span>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="mb-4">
                <div class="h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300"
                    :style="{ width: `${Math.min((event.registeredCount / event.capacity) * 100, 100)}%` }"
                  />
                </div>
                <p class="text-xs text-neutral-500 mt-1">
                  {{ event.registeredCount }} / {{ event.capacity }} registered
                </p>
              </div>

              <!-- Status -->
              <div class="pt-4 border-t border-neutral-200">
                <Badge
                  :variant="event.canRegister ? 'success' : event.isFull ? 'error' : 'warning'"
                  size="sm"
                  class="w-full justify-center"
                >
                  {{ event.canRegister ? 'Registration Open' : event.isFull ? 'Full' : 'Closed' }}
                </Badge>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <div class="text-6xl mb-4">🔍</div>
        <h3 class="text-2xl font-bold text-neutral-900 mb-2">No Events Found</h3>
        <p class="text-neutral-600 mb-6">Try adjusting your filters to discover more events</p>
        <Button variant="primary" @click="clearFilters">
          Clear Filters
        </Button>
      </div>

      <!-- Pagination -->
      <div
        v-if="props.events.meta.last_page > 1"
        class="flex justify-center items-center gap-2 mt-12"
        v-motion
        :initial="{ opacity: 0, y: 10 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 200 } }"
      >
        <Button
          v-if="props.events.meta.current_page > 1"
          variant="outline"
          size="sm"
          @click="goToPage(props.events.meta.current_page - 1)"
        >
          Previous
        </Button>

        <div class="flex gap-1">
          <button
            v-for="page in pages"
            :key="page"
            @click="typeof page === 'number' && goToPage(page)"
            :disabled="page === '...'"
            :class="[
              'px-3 py-2 rounded-lg font-medium transition-all',
              page === props.events.meta.current_page
                ? 'bg-primary-600 text-white shadow-md'
                : page === '...'
                  ? 'text-neutral-500 cursor-default'
                  : 'border border-neutral-300 text-neutral-700 hover:border-primary-300 hover:bg-primary-50',
            ]"
          >
            {{ page }}
          </button>
        </div>

        <Button
          v-if="props.events.meta.current_page < props.events.meta.last_page"
          variant="outline"
          size="sm"
          @click="goToPage(props.events.meta.current_page + 1)"
        >
          Next
        </Button>
      </div>
    </div>
  </AppLayout>
</template>