<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3'
import { ref } from 'vue'
import { UserIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, CakeIcon, TrashIcon } from '@heroicons/vue/24/outline'
import AppLayout from '~/components/layouts/AppLayout'
import Input from '#ui/Input.vue'
import Select from '#ui/Select.vue'
import Button from '#ui/Button.vue'
import Card from '#ui/Card.vue'
import Avatar from '#ui/Avatar.vue'
import { useProtectedLayout } from '#composables/use_protected_layout'
import { PROVINCES } from '#lib/constants'

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  age: number
  province: string
  commune: string
  phoneNumber: string | null
  avatarUrl: string | null
  isEmailVerified: boolean
  createdAt: string
}

interface PageProps {
  user: User
}

const props = defineProps<PageProps>()

// Protect page - require authentication
useProtectedLayout({ requiresAuth: true })

const form = useForm({
  firstName: props.user.firstName,
  lastName: props.user.lastName,
  age: props.user.age,
  province: props.user.province,
  commune: props.user.commune,
  phoneNumber: props.user.phoneNumber || '',
  avatar: null as File | null,
})

const provinces = PROVINCES.map((p) => ({ value: p, label: p }))
const previewUrl = ref<string | null>(null)
const showDeleteConfirm = ref(false)

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    form.avatar = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const submit = () => {
  form.post('/profile', {
    preserveScroll: true,
    onSuccess: () => {
      previewUrl.value = null
    },
  })
}

const deleteAvatar = () => {
  showDeleteConfirm.value = true
}

const confirmDeleteAvatar = () => {
  form.delete('/profile/avatar', {
    preserveScroll: true,
    onSuccess: () => {
      showDeleteConfirm.value = false
    },
  })
}
</script>

<template>
  <Head title="My Profile" />

  <AppLayout>
    <!-- Header -->
    <div
      class="mb-8"
      v-motion
      :initial="{ opacity: 0, y: -20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }"
    >
      <h1 class="text-4xl font-bold text-neutral-900 mb-2">My Profile</h1>
      <p class="text-neutral-600">Manage your personal information and preferences</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Sidebar -->
      <div class="lg:col-span-1">
        <Card
          class="sticky top-20"
          v-motion
          :initial="{ opacity: 0, x: -20 }"
          :enter="{ opacity: 1, x: 0, transition: { duration: 400, delay: 100 } }"
        >
          <!-- Avatar Section -->
          <div class="text-center pb-6 border-b border-neutral-200">
            <div class="relative inline-block mb-4">
              <Avatar
                :src="previewUrl || user.avatarUrl as string | undefined"
                :name="`${user.firstName} ${user.lastName}`"
                size="xl"
              />
              <label
                for="avatar-input"
                class="absolute bottom-0 right-0 bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-full cursor-pointer transition shadow-lg"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </label>
              <input
                id="avatar-input"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                @change="handleFileChange"
                class="hidden"
              />
            </div>

            <h2 class="text-2xl font-bold text-neutral-900">
              {{ user.firstName }} {{ user.lastName }}
            </h2>
            <p class="text-neutral-600 mt-1">{{ user.email }}</p>

            <!-- Email Verification Status -->
            <div class="mt-4 pt-4 border-t border-neutral-200">
              <div class="flex items-center justify-center gap-2">
                <div
                  :class="[
                    'w-3 h-3 rounded-full',
                    user.isEmailVerified ? 'bg-success-500' : 'bg-warning-500',
                  ]"
                />
                <span class="text-sm font-medium text-neutral-700">
                  {{ user.isEmailVerified ? 'Email Verified' : 'Email Pending Verification' }}
                </span>
              </div>
            </div>

            <!-- Member Since -->
            <p class="text-xs text-neutral-500 mt-3">
              Member since {{ new Date(user.createdAt).toLocaleDateString() }}
            </p>
          </div>

          <!-- Delete Avatar Button -->
          <div v-if="user.avatarUrl && !previewUrl" class="pt-4">
            <Button
              variant="danger"
              size="sm"
              full-width
              :icon-left="TrashIcon"
              @click="deleteAvatar"
            >
              Delete Photo
            </Button>
          </div>
        </Card>
      </div>

      <!-- Main Form -->
      <div class="lg:col-span-2">
        <Card
          v-motion
          :initial="{ opacity: 0, x: 20 }"
          :enter="{ opacity: 1, x: 0, transition: { duration: 400, delay: 150 } }"
        >
          <form @submit.prevent="submit" class="space-y-6">
            <!-- Avatar Upload Preview -->
            <div v-if="previewUrl" class="p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <p class="text-sm font-medium text-primary-900 mb-2">
                New photo ready to upload
              </p>
              <div class="flex items-center justify-between">
                <img :src="previewUrl" alt="Preview" class="h-16 w-16 object-cover rounded" />
                <Button variant="primary" size="sm" type="submit" :loading="form.processing">
                  Save Photo
                </Button>
              </div>
            </div>

            <!-- Personal Information Section -->
            <div>
              <h3 class="text-lg font-semibold text-neutral-900 mb-4">Personal Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  v-model="form.firstName"
                  type="text"
                  label="First Name"
                  :icon="UserIcon"
                  required
                  :error="form.errors.firstName"
                />
                <Input
                  v-model="form.lastName"
                  type="text"
                  label="Last Name"
                  :icon="UserIcon"
                  required
                  :error="form.errors.lastName"
                />
              </div>
            </div>

            <!-- Contact Information Section -->
            <div>
              <h3 class="text-lg font-semibold text-neutral-900 mb-4">Contact Information</h3>
              <div class="space-y-4">
                <Input
                  :value="user.email"
                  type="email"
                  label="Email Address"
                  :icon="EnvelopeIcon"
                  disabled
                  hint="Email cannot be changed"
                />
                <Input
                  v-model="form.phoneNumber"
                  type="tel"
                  label="Phone Number (Optional)"
                  :icon="PhoneIcon"
                  placeholder="+213 5XX XX XX XX"
                  :error="form.errors.phoneNumber"
                />
              </div>
            </div>

            <!-- Location & Age Section -->
            <div>
              <h3 class="text-lg font-semibold text-neutral-900 mb-4">Location & Age</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  v-model.number="form.age"
                  type="number"
                  label="Age"
                  :icon="CakeIcon"
                  min="13"
                  max="120"
                  required
                  :error="form.errors.age"
                />
                <Select
                  v-model="form.province"
                  label="Province"
                  :options="provinces"
                  required
                  :error="form.errors.province"
                  searchable
                />
                <Input
                  v-model="form.commune"
                  type="text"
                  label="Commune"
                  :icon="MapPinIcon"
                  required
                  :error="form.errors.commune"
                />
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 pt-4 border-t border-neutral-200">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                :loading="form.processing"
                :disabled="form.processing"
                class="flex-1"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <Card class="max-w-md w-full">
        <h3 class="text-xl font-bold text-neutral-900 mb-2">Delete Photo?</h3>
        <p class="text-neutral-600 mb-6">
          Are you sure you want to delete your profile photo? This action cannot be undone.
        </p>
        <div class="flex gap-3">
          <Button
            variant="ghost"
            class="flex-1"
            @click="showDeleteConfirm = false"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            class="flex-1"
            :loading="form.processing"
            @click="confirmDeleteAvatar"
          >
            Delete
          </Button>
        </div>
      </Card>
    </div>
  </AppLayout>
</template>