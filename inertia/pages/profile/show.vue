<script setup lang="ts">
import { Head, useForm, router } from '@inertiajs/vue3'
import { ref } from 'vue'
import { PROVINCES } from '../../lib/constants'

const props = defineProps<{
  user: {
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
}>()

const form = useForm({
  firstName: props.user.firstName,
  lastName: props.user.lastName,
  age: props.user.age,
  province: props.user.province,
  commune: props.user.commune,
  phoneNumber: props.user.phoneNumber || '',
  avatar: null as File | null,
})

const provinces = ref(PROVINCES)
const previewUrl = ref<string | null>(null)

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
  if (confirm('Êtes-vous sûr de vouloir supprimer votre photo de profil ?')) {
    router.delete('/profile/avatar', {
      preserveScroll: true,
    })
  }
}
</script>

<template>
  <Head title="Mon profil" />

  <div
    class="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-4xl mx-auto">
      <!-- En-tête -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-sand-12 mb-2">Mon profil</h1>
        <p class="text-sand-11">Gérez vos informations personnelles</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Sidebar avec avatar et infos -->
        <div class="lg:col-span-1">
          <div class="bg-white shadow-xl rounded-2xl p-6 border border-sand-7 space-y-6">
            <!-- Avatar -->
            <div class="text-center">
              <div class="relative inline-block">
                <div
                  class="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-4xl font-bold text-primary overflow-hidden"
                >
                  <img
                    v-if="previewUrl || user.avatarUrl"
                    :src="previewUrl || `/uploads/${user.avatarUrl}`"
                    alt="Avatar"
                    class="w-full h-full object-cover"
                  />
                  <span v-else>{{ user.firstName[0] }}{{ user.lastName[0] }}</span>
                </div>

                <button
                  v-if="user.avatarUrl && !previewUrl"
                  @click="deleteAvatar"
                  type="button"
                  class="absolute bottom-0 right-0 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition"
                  title="Supprimer la photo"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <h2 class="mt-4 text-xl font-semibold text-sand-12">
                {{ user.firstName }} {{ user.lastName }}
              </h2>
              <p class="text-sand-11">{{ user.email }}</p>
            </div>

            <!-- Statut de vérification -->
            <div class="pt-4 border-t border-sand-6">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-sand-11">Email vérifié</span>
                <span
                  v-if="user.isEmailVerified"
                  class="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded"
                >
                  ✓ Vérifié
                </span>
                <span
                  v-else
                  class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded"
                >
                  En attente
                </span>
              </div>
              <div class="text-sm text-sand-11">
                Membre depuis : <span class="font-medium text-sand-12">{{ user.createdAt }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Formulaire de modification -->
        <div class="lg:col-span-2">
          <div class="bg-white shadow-xl rounded-2xl p-8 border border-sand-7">
            <form @submit.prevent="submit" class="space-y-6">
              <!-- Photo de profil -->
              <div>
                <label class="block text-sm font-medium text-sand-12 mb-2"> Photo de profil </label>
                <input
                  type="file"
                  @change="handleFileChange"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  class="w-full px-4 py-2.5 border border-sand-7 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  :class="{ 'border-red-500': form.errors.avatar }"
                />
                <p v-if="form.errors.avatar" class="mt-1 text-sm text-red-600">
                  {{ form.errors.avatar }}
                </p>
                <p class="mt-1 text-xs text-sand-10">
                  Formats acceptés : JPG, PNG, WEBP (max 2 Mo)
                </p>
              </div>

              <!-- Prénom & Nom -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="firstName" class="block text-sm font-medium text-sand-12 mb-2">
                    Prénom <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="firstName"
                    v-model="form.firstName"
                    type="text"
                    required
                    class="w-full px-4 py-2.5 border border-sand-7 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    :class="{ 'border-red-500': form.errors.firstName }"
                  />
                  <p v-if="form.errors.firstName" class="mt-1 text-sm text-red-600">
                    {{ form.errors.firstName }}
                  </p>
                </div>

                <div>
                  <label for="lastName" class="block text-sm font-medium text-sand-12 mb-2">
                    Nom <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="lastName"
                    v-model="form.lastName"
                    type="text"
                    required
                    class="w-full px-4 py-2.5 border border-sand-7 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    :class="{ 'border-red-500': form.errors.lastName }"
                  />
                  <p v-if="form.errors.lastName" class="mt-1 text-sm text-red-600">
                    {{ form.errors.lastName }}
                  </p>
                </div>
              </div>

              <!-- Âge -->
              <div>
                <label for="age" class="block text-sm font-medium text-sand-12 mb-2">
                  Âge <span class="text-red-500">*</span>
                </label>
                <input
                  id="age"
                  v-model="form.age"
                  type="number"
                  required
                  min="13"
                  max="120"
                  class="w-full px-4 py-2.5 border border-sand-7 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  :class="{ 'border-red-500': form.errors.age }"
                />
                <p v-if="form.errors.age" class="mt-1 text-sm text-red-600">
                  {{ form.errors.age }}
                </p>
              </div>

              <!-- Province & Commune -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="province" class="block text-sm font-medium text-sand-12 mb-2">
                    Province <span class="text-red-500">*</span>
                  </label>
                  <select
                    id="province"
                    v-model="form.province"
                    required
                    class="w-full px-4 py-2.5 border border-sand-7 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    :class="{ 'border-red-500': form.errors.province }"
                  >
                    <option v-for="prov in provinces" :key="prov" :value="prov">
                      {{ prov }}
                    </option>
                  </select>
                  <p v-if="form.errors.province" class="mt-1 text-sm text-red-600">
                    {{ form.errors.province }}
                  </p>
                </div>

                <div>
                  <label for="commune" class="block text-sm font-medium text-sand-12 mb-2">
                    Commune <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="commune"
                    v-model="form.commune"
                    type="text"
                    required
                    class="w-full px-4 py-2.5 border border-sand-7 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    :class="{ 'border-red-500': form.errors.commune }"
                  />
                  <p v-if="form.errors.commune" class="mt-1 text-sm text-red-600">
                    {{ form.errors.commune }}
                  </p>
                </div>
              </div>

              <!-- Numéro de téléphone -->
              <div>
                <label for="phoneNumber" class="block text-sm font-medium text-sand-12 mb-2">
                  Numéro de téléphone <span class="text-sand-10">(optionnel)</span>
                </label>
                <input
                  id="phoneNumber"
                  v-model="form.phoneNumber"
                  type="tel"
                  class="w-full px-4 py-2.5 border border-sand-7 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  :class="{ 'border-red-500': form.errors.phoneNumber }"
                  placeholder="+213 555 123 456"
                />
                <p v-if="form.errors.phoneNumber" class="mt-1 text-sm text-red-600">
                  {{ form.errors.phoneNumber }}
                </p>
              </div>

              <!-- Bouton de sauvegarde -->
              <button
                type="submit"
                :disabled="form.processing"
                class="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <span v-if="!form.processing">Enregistrer les modifications</span>
                <span v-else class="flex items-center">
                  <svg
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Enregistrement...
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
