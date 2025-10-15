<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import { UserIcon, EnvelopeIcon, LockClosedIcon, PhoneIcon } from '@heroicons/vue/24/outline'
import AuthLayout from '~/components/layouts/AuthLayout.vue'
import Input from '#ui/Input.vue'
import Select from '#ui/Select.vue'
import Button from '#ui/Button.vue'
import { use_vlidated_form } from '~/composables/use_validated_form'
import { registerSchema } from '~/lib/validation'
import { PROVINCES } from '~/lib/constants'

const { form, getError, validateField, validateAll, clearError } = use_vlidated_form(
  registerSchema,
  {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    password_confirmation: '',
    age: '',
    province: '',
    commune: '',
    phoneNumber: '',
  }
)

const provinceOptions = PROVINCES.map((p) => ({ value: p, label: p }))

const handleSubmit = async () => {
  const isValid = await validateAll()
  if (!isValid) return

  form.post('/auth/register', {
    preserveScroll: true,
  })
}

const handleBlur = (field: keyof typeof form.data) => {
  validateField(field)
}
</script>

<template>
  <Head>
    <title>Inscription - Créez votre compte</title>
    <meta
      name="description"
      content="Créez votre compte gratuitement pour découvrir et vous inscrire aux meilleurs événements près de chez vous."
    />
    <meta name="robots" content="noindex, nofollow" />
  </Head>

  <AuthLayout>
    <div
      class="w-full max-w-2xl"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }"
    >
      <!-- Header -->
      <header class="text-center mb-8">
        <h1 class="text-3xl font-bold text-sand-12 mb-2">Créez votre compte</h1>
        <p class="text-sand-11">Rejoignez notre communauté d'événements</p>
      </header>

      <!-- Form Card -->
      <section
        class="bg-white shadow-xl rounded-2xl p-8 border border-sand-6"
        aria-label="Formulaire d'inscription"
      >
        <form @submit.prevent="handleSubmit" class="space-y-6" novalidate>
          <!-- Name Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              v-model="form.firstName"
              type="text"
              label="Prénom"
              placeholder="Jean"
              :icon="UserIcon"
              :error="getError('firstName')"
              required
              autocomplete="given-name"
              @blur="handleBlur('firstName')"
              @input="clearError('firstName')"
            />

            <Input
              v-model="form.lastName"
              type="text"
              label="Nom"
              placeholder="Dupont"
              :icon="UserIcon"
              :error="getError('lastName')"
              required
              autocomplete="family-name"
              @blur="handleBlur('lastName')"
              @input="clearError('lastName')"
            />
          </div>

          <!-- Email -->
          <Input
            v-model="form.email"
            type="email"
            label="Adresse email"
            placeholder="jean.dupont@example.com"
            :icon="EnvelopeIcon"
            :error="getError('email')"
            required
            autocomplete="email"
            @blur="handleBlur('email')"
            @input="clearError('email')"
          />

          <!-- Password Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              v-model="form.password"
              type="password"
              label="Mot de passe"
              placeholder="••••••••"
              :icon="LockClosedIcon"
              :error="getError('password')"
              hint="Min. 8 caractères, 1 majuscule, 1 chiffre"
              required
              autocomplete="new-password"
              @blur="handleBlur('password')"
              @input="clearError('password')"
            />

            <Input
              v-model="form.password_confirmation"
              type="password"
              label="Confirmer le mot de passe"
              placeholder="••••••••"
              :icon="LockClosedIcon"
              :error="getError('password_confirmation')"
              required
              autocomplete="new-password"
              @blur="handleBlur('password_confirmation')"
              @input="clearError('password_confirmation')"
            />
          </div>

          <!-- Age -->
          <Input
            v-model="form.age"
            type="number"
            label="Âge"
            placeholder="25"
            :error="getError('age')"
            required
            min="13"
            max="120"
            @blur="handleBlur('age')"
            @input="clearError('age')"
          />

          <!-- Location Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              v-model="form.province"
              label="Province"
              placeholder="Sélectionnez une province"
              :options="provinceOptions"
              :error="getError('province')"
              required
              @blur="handleBlur('province')"
              @change="clearError('province')"
            />

            <Input
              v-model="form.commune"
              type="text"
              label="Commune"
              placeholder="Ex: Bab Ezzouar"
              :error="getError('commune')"
              required
              @blur="handleBlur('commune')"
              @input="clearError('commune')"
            />
          </div>

          <!-- Phone Number -->
          <Input
            v-model="form.phoneNumber"
            type="tel"
            label="Numéro de téléphone"
            placeholder="+213 555 123 456"
            :icon="PhoneIcon"
            :error="getError('phoneNumber')"
            hint="Optionnel - Format: +213 5XX XX XX XX"
            autocomplete="tel"
            @blur="handleBlur('phoneNumber')"
            @input="clearError('phoneNumber')"
          />

          <!-- Submit Button -->
          <Button
            type="submit"
            variant="primary"
            size="lg"
            :loading="form.processing"
            :disabled="form.processing"
            full-width
          >
            Créer mon compte
          </Button>

          <!-- Login Link -->
          <p
            class="text-center text-sm text-sand-11"
            v-motion
            :initial="{ opacity: 0 }"
            :enter="{ opacity: 1, transition: { delay: 150 } }"
          >
            Vous avez déjà un compte ?
            <Link
              href="/auth/login"
              class="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
            >
              Se connecter
            </Link>
          </p>
        </form>
      </section>
    </div>
  </AuthLayout>
</template>
