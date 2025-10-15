<script setup lang="ts">
import { ref, computed } from 'vue'
import { router } from '@inertiajs/vue3'
import Input from '#ui/Input.vue'
import TextArea from '#ui/TextArea.vue'
import Select from '#ui/Select.vue'
import Button from '#ui/Button.vue'
import Card from '#ui/Card.vue'
import { use_vlidated_form } from '~/composables/use_validated_form'
import { createEventSchema } from '~/lib/validation'
import { PROVINCES, EVENT_CATEGORIES } from '~/lib/constants'
import { CalendarIcon, MapPinIcon, UsersIcon, CurrencyDollarIcon } from '@heroicons/vue/24/outline'

interface Props {
  event?: any
  mode?: 'create' | 'edit'
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create',
})

const emit = defineEmits<{
  success: []
  cancel: []
}>()

const currentStep = ref(1)
const totalSteps = 4

const { form, getError, validateField, validateAll, clearError } = use_vlidated_form(
  createEventSchema,
  props.event || {
    name: '',
    description: '',
    location: '',
    province: '',
    commune: '',
    startDate: '',
    endDate: '',
    capacity: '',
    minAge: 13,
    maxAge: '',
    basePrice: 0,
    youthPrice: '',
    seniorPrice: '',
    category: '',
    tags: [],
    isPublic: true,
    requiresApproval: false,
    registrationStartDate: '',
    registrationEndDate: '',
    // Game fields
    eventType: 'normal',
    gameType: '',
    difficulty: '',
    durationMinutes: '',
    physicalIntensity: 'medium',
    allowsTeams: false,
    teamRegistration: 'individual',
    minTeamSize: '',
    maxTeamSize: '',
    maxTeams: '',
    autoTeamFormation: false,
    requiredItems: [],
    prohibitedItems: [],
    safetyRequirements: [],
    waiverRequired: false,
    rulesDocumentUrl: '',
    checkInTime: '',
    briefingDurationMinutes: '',
    prizeInformation: '',
    prizePool: '',
    winnerAnnouncement: '',
    photographyAllowed: true,
    liveStreaming: false,
    specialInstructions: '',
  }
)

const provinceOptions = PROVINCES.map(p => ({ value: p, label: p }))
const categoryOptions = EVENT_CATEGORIES.map(c => ({ value: c, label: c }))

const eventTypeOptions = [
  { value: 'normal', label: 'Événement Normal' },
  { value: 'game', label: 'Jeu/Compétition' },
]

const difficultyOptions = [
  { value: 'easy', label: 'Facile' },
  { value: 'medium', label: 'Moyen' },
  { value: 'hard', label: 'Difficile' },
  { value: 'extreme', label: 'Extrême' },
]

const intensityOptions = [
  { value: 'low', label: 'Faible' },
  { value: 'medium', label: 'Modérée' },
  { value: 'high', label: 'Intense' },
]

const teamRegistrationOptions = [
  { value: 'individual', label: 'Individuel uniquement' },
  { value: 'team', label: 'Équipes uniquement' },
  { value: 'both', label: 'Les deux' },
]

const isGameEvent = computed(() => form.eventType === 'game')

const canProgress = computed(() => {
  switch (currentStep.value) {
    case 1:
      return form.name && form.description && form.category
    case 2:
      return form.location && form.province && form.commune && form.startDate && form.endDate
    case 3:
      return form.capacity && form.minAge
    case 4:
      return true
    default:
      return false
  }
})

const nextStep = async () => {
  // Validate current step fields
  const isValid = await validateCurrentStep()
  if (isValid && currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const validateCurrentStep = async (): Promise<boolean> => {
  const fieldsToValidate: Record<number, string[]> = {
    1: ['name', 'description', 'category'],
    2: ['location', 'province', 'commune', 'startDate', 'endDate'],
    3: ['capacity', 'minAge'],
    4: [],
  }

  const fields = fieldsToValidate[currentStep.value] || []
  let isValid = true

  for (const field of fields) {
    const result = await validateField(field)
    if (!result) isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  const isValid = await validateAll()
  if (!isValid) return

  const url = props.mode === 'create' ? '/api/admin/events' : `/api/admin/events/${props.event.id}`
  const method = props.mode === 'create' ? 'post' : 'put'

  router[method](url, form.data(), {
    preserveScroll: true,
    onSuccess: () => {
      emit('success')
    },
  })
}

const handleCancel = () => {
  emit('cancel')
}

const addTag = (tag: string) => {
  if (tag && !form.tags.includes(tag)) {
    form.tags.push(tag)
  }
}

const removeTag = (index: number) => {
  form.tags.splice(index, 1)
}

const addItem = (list: 'requiredItems' | 'prohibitedItems' | 'safetyRequirements', item: string) => {
  if (item && !form[list].includes(item)) {
    form[list].push(item)
  }
}

const removeItem = (list: 'requiredItems' | 'prohibitedItems' | 'safetyRequirements', index: number) => {
  form[list].splice(index, 1)
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <!-- Progress Steps -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div
          v-for="step in totalSteps"
          :key="step"
          class="flex items-center flex-1"
        >
          <div class="flex items-center">
            <div
              :class="[
                'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all',
                step === currentStep
                  ? 'border-primary-600 bg-primary-600 text-white'
                  : step < currentStep
                    ? 'border-success-600 bg-success-600 text-white'
                    : 'border-neutral-300 bg-white text-neutral-500',
              ]"
            >
              <span v-if="step < currentStep">✓</span>
              <span v-else>{{ step }}</span>
            </div>
          </div>
          <div
            v-if="step < totalSteps"
            :class="[
              'flex-1 h-1 mx-2 transition-all',
              step < currentStep ? 'bg-success-600' : 'bg-neutral-200',
            ]"
          />
        </div>
      </div>
      <div class="flex justify-between mt-2">
        <span class="text-xs text-neutral-600">Informations</span>
        <span class="text-xs text-neutral-600">Lieu & Dates</span>
        <span class="text-xs text-neutral-600">Capacité</span>
        <span class="text-xs text-neutral-600">Options</span>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Step 1: Basic Info -->
      <Card v-show="currentStep === 1">
        <h2 class="text-2xl font-bold text-neutral-900 mb-6">Informations de base</h2>
        
        <div class="space-y-4">
          <Input
            v-model="form.name"
            label="Nom de l'événement"
            placeholder="Ex: Conférence Tech 2025"
            :error="getError('name')"
            required
            @blur="validateField('name')"
            @input="clearError('name')"
          />

          <TextArea
            v-model="form.description"
            label="Description"
            placeholder="Décrivez votre événement..."
            :rows="6"
            :error="getError('description')"
            required
            show-count
            :max-length="2000"
            @blur="validateField('description')"
            @input="clearError('description')"
          />

          <Select
            v-model="form.category"
            label="Catégorie"
            placeholder="Sélectionnez une catégorie"
            :options="categoryOptions"
            :error="getError('category')"
            required
            @change="clearError('category')"
          />

          <Select
            v-model="form.eventType"
            label="Type d'événement"
            :options="eventTypeOptions"
            :error="getError('eventType')"
          />

          <div v-if="isGameEvent" class="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 class="font-semibold text-purple-900">Configuration Jeu/Compétition</h3>
            
            <Input
              v-model="form.gameType"
              label="Type de jeu"
              placeholder="Ex: Squid Game, Escape Room, etc."
              :error="getError('gameType')"
            />

            <Select
              v-model="form.difficulty"
              label="Difficulté"
              placeholder="Sélectionnez la difficulté"
              :options="difficultyOptions"
              :error="getError('difficulty')"
            />

            <Input
              v-model.number="form.durationMinutes"
              type="number"
              label="Durée du jeu (minutes)"
              placeholder="120"
              :error="getError('durationMinutes')"
            />

            <Select
              v-model="form.physicalIntensity"
              label="Intensité physique"
              :options="intensityOptions"
              :error="getError('physicalIntensity')"
            />
          </div>
        </div>
      </Card>

      <!-- Step 2: Location & Dates -->
      <Card v-show="currentStep === 2">
        <h2 class="text-2xl font-bold text-neutral-900 mb-6">Lieu et dates</h2>
        
        <div class="space-y-4">
          <Input
            v-model="form.location"
            label="Lieu"
            placeholder="Ex: Centre des conventions"
            :icon="MapPinIcon"
            :error="getError('location')"
            required
            @blur="validateField('location')"
            @input="clearError('location')"
          />

          <div class="grid grid-cols-2 gap-4">
            <Select
              v-model="form.province"
              label="Province"
              placeholder="Sélectionnez"
              :options="provinceOptions"
              :error="getError('province')"
              required
              searchable
              @change="clearError('province')"
            />

            <Input
              v-model="form.commune"
              label="Commune"
              placeholder="Ex: Bab Ezzouar"
              :error="getError('commune')"
              required
              @blur="validateField('commune')"
              @input="clearError('commune')"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <Input
              v-model="form.startDate"
              type="datetime-local"
              label="Date de début"
              :icon="CalendarIcon"
              :error="getError('startDate')"
              required
              @blur="validateField('startDate')"
              @input="clearError('startDate')"
            />

            <Input
              v-model="form.endDate"
              type="datetime-local"
              label="Date de fin"
              :icon="CalendarIcon"
              :error="getError('endDate')"
              required
              @blur="validateField('endDate')"
              @input="clearError('endDate')"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <Input
              v-model="form.registrationStartDate"
              type="datetime-local"
              label="Début des inscriptions"
              hint="Optionnel"
            />

            <Input
              v-model="form.registrationEndDate"
              type="datetime-local"
              label="Fin des inscriptions"
              hint="Optionnel"
            />
          </div>

          <Input
            v-if="isGameEvent"
            v-model="form.checkInTime"
            type="datetime-local"
            label="Heure d'enregistrement"
            hint="Quand les participants doivent arriver"
          />
        </div>
      </Card>

      <!-- Step 3: Capacity & Pricing -->
      <Card v-show="currentStep === 3">
        <h2 class="text-2xl font-bold text-neutral-900 mb-6">Capacité et tarification</h2>
        
        <div class="space-y-4">
          <Input
            v-model.number="form.capacity"
            type="number"
            label="Capacité totale"
            placeholder="100"
            :icon="UsersIcon"
            :error="getError('capacity')"
            required
            min="1"
            @blur="validateField('capacity')"
            @input="clearError('capacity')"
          />

          <div class="grid grid-cols-2 gap-4">
            <Input
              v-model.number="form.minAge"
              type="number"
              label="Âge minimum"
              placeholder="13"
              :error="getError('minAge')"
              required
              min="0"
            />

            <Input
              v-model.number="form.maxAge"
              type="number"
              label="Âge maximum"
              placeholder="Optionnel"
              hint="Laissez vide pour pas de limite"
            />
          </div>

          <div class="grid grid-cols-3 gap-4">
            <Input
              v-model.number="form.basePrice"
              type="number"
              label="Prix de base"
              placeholder="0"
              :icon="CurrencyDollarIcon"
              :error="getError('basePrice')"
              min="0"
              step="0.01"
            />

            <Input
              v-model.number="form.youthPrice"
              type="number"
              label="Prix jeune (-26 ans)"
              placeholder="Optionnel"
              min="0"
              step="0.01"
            />

            <Input
              v-model.number="form.seniorPrice"
              type="number"
              label="Prix senior (60+ ans)"
              placeholder="Optionnel"
              min="0"
              step="0.01"
            />
          </div>

          <!-- Team Configuration -->
          <div v-if="isGameEvent" class="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div class="flex items-center gap-2">
              <input
                v-model="form.allowsTeams"
                type="checkbox"
                class="w-4 h-4 rounded border-neutral-300 text-primary-600"
              />
              <label class="font-medium text-blue-900">Autoriser les équipes</label>
            </div>

            <div v-if="form.allowsTeams" class="space-y-4">
              <Select
                v-model="form.teamRegistration"
                label="Mode d'inscription"
                :options="teamRegistrationOptions"
              />

              <div class="grid grid-cols-3 gap-4">
                <Input
                  v-model.number="form.minTeamSize"
                  type="number"
                  label="Taille min équipe"
                  placeholder="2"
                  min="1"
                />

                <Input
                  v-model.number="form.maxTeamSize"
                  type="number"
                  label="Taille max équipe"
                  placeholder="5"
                  min="1"
                />

                <Input
                  v-model.number="form.maxTeams"
                  type="number"
                  label="Nb max équipes"
                  placeholder="20"
                  min="1"
                />
              </div>

              <div class="flex items-center gap-2">
                <input
                  v-model="form.autoTeamFormation"
                  type="checkbox"
                  class="w-4 h-4 rounded border-neutral-300 text-primary-600"
                />
                <label class="text-sm text-blue-900">Formation automatique des équipes</label>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <!-- Step 4: Additional Options -->
      <Card v-show="currentStep === 4">
        <h2 class="text-2xl font-bold text-neutral-900 mb-6">Options supplémentaires</h2>
        
        <div class="space-y-6">
          <div class="flex items-center gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="form.isPublic"
                type="checkbox"
                class="w-4 h-4 rounded border-neutral-300 text-primary-600"
              />
              <span>Événement public</span>
            </label>

            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="form.requiresApproval"
                type="checkbox"
                class="w-4 h-4 rounded border-neutral-300 text-primary-600"
              />
              <span>Approbation requise</span>
            </label>
          </div>

          <div v-if="isGameEvent" class="space-y-4">
            <TextArea
              v-model="form.prizeInformation"
              label="Informations sur les prix"
              placeholder="Décrivez les prix et récompenses..."
              :rows="3"
            />

            <Input
              v-model.number="form.prizePool"
              type="number"
              label="Cagnotte totale"
              placeholder="10000"
              min="0"
            />

            <Input
              v-model="form.winnerAnnouncement"
              type="datetime-local"
              label="Annonce des gagnants"
            />

            <TextArea
              v-model="form.specialInstructions"
              label="Instructions spéciales"
              placeholder="Informations importantes pour les participants..."
              :rows="4"
            />

            <div class="flex items-center gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="form.photographyAllowed"
                  type="checkbox"
                  class="w-4 h-4 rounded border-neutral-300 text-primary-600"
                />
                <span class="text-sm">Photos autorisées</span>
              </label>

              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="form.liveStreaming"
                  type="checkbox"
                  class="w-4 h-4 rounded border-neutral-300 text-primary-600"
                />
                <span class="text-sm">Live streaming</span>
              </label>

              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="form.waiverRequired"
                  type="checkbox"
                  class="w-4 h-4 rounded border-neutral-300 text-primary-600"
                />
                <span class="text-sm">Décharge requise</span>
              </label>
            </div>
          </div>
        </div>
      </Card>

      <!-- Navigation Buttons -->
      <div class="flex justify-between gap-4">
        <Button
          v-if="currentStep > 1"
          type="button"
          variant="outline"
          @click="previousStep"
        >
          Précédent
        </Button>

        <div class="flex gap-2 ml-auto">
          <Button
            type="button"
            variant="ghost"
            @click="handleCancel"
          >
            Annuler
          </Button>

          <Button
            v-if="currentStep < totalSteps"
            type="button"
            variant="primary"
            :disabled="!canProgress"
            @click="nextStep"
          >
            Suivant
          </Button>

          <Button
            v-else
            type="submit"
            variant="primary"
            :loading="form.processing"
            :disabled="form.processing"
          >
            {{ mode === 'create' ? 'Créer l\'événement' : 'Sauvegarder' }}
          </Button>
        </div>
      </div>
    </form>
  </div>
</template>