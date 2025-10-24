<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { LockClosedIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'
import AuthLayout from '~/components/layouts/AuthLayout'
import Input from '#ui/Input.vue'
import Button from '#ui/Button.vue'
import { use_vlidated_form } from '~/composables/use_validated_form'
import { resetPasswordSchema } from '~/lib/validation'

const props = defineProps<{
  token: string
}>()

const { form, getError, validateField, validateAll, clearError } = use_vlidated_form(
  resetPasswordSchema,
  {
    token: props.token,
    password: '',
    password_confirmation: '',
  }
)

const handleSubmit = async () => {
  const isValid = await validateAll()
  if (!isValid) return

  form.post('/auth/reset-password', {
    preserveScroll: true,
  })
}

const handleBlur = (field: 'password' | 'password_confirmation') => {
  validateField(field)
}

const passwordRequirements = [
  { label: 'Au moins 8 caractères', met: form.password.length >= 8 },
  { label: 'Une lettre majuscule', met: /[A-Z]/.test(form.password) },
  { label: 'Une lettre minuscule', met: /[a-z]/.test(form.password) },
  { label: 'Un chiffre', met: /\d/.test(form.password) },
]
</script>

<template>
  <Head>
    <title>Réinitialiser le mot de passe - Créez un nouveau mot de passe</title>
    <meta
      name="description"
      content="Définissez un nouveau mot de passe sécurisé pour votre compte."
    />
    <meta name="robots" content="noindex, nofollow" />
  </Head>

  <AuthLayout>
    <div
      class="w-full max-w-md"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }"
    >
      <!-- Header -->
      <header class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4"
          v-motion
          :initial="{ scale: 0 }"
          :enter="{ scale: 1, transition: { delay: 100, type: 'spring' } }"
        >
          <LockClosedIcon class="w-8 h-8 text-primary-600" />
        </div>
        <h1 class="text-3xl font-bold text-sand-12 mb-2">Nouveau mot de passe</h1>
        <p class="text-sand-11">Choisissez un mot de passe fort et sécurisé</p>
      </header>

      <!-- Form Card -->
      <section
        class="bg-white shadow-xl rounded-2xl p-8 border border-sand-6"
        aria-label="Formulaire de réinitialisation"
      >
        <form @submit.prevent="handleSubmit" class="space-y-6" novalidate>
          <!-- Password -->
          <Input
            v-model="form.password"
            type="password"
            label="Nouveau mot de passe"
            placeholder="••••••••"
            :icon="LockClosedIcon"
            :error="getError('password')"
            required
            autofocus
            autocomplete="new-password"
            @blur="handleBlur('password')"
            @input="clearError('password')"
          />

          <!-- Password Requirements -->
          <div
            class="space-y-2"
            v-if="form.password"
            v-motion
            :initial="{ opacity: 0, height: 0 }"
            :enter="{ opacity: 1, height: 'auto', transition: { duration: 300 } }"
          >
            <p class="text-sm font-medium text-sand-11">Exigences du mot de passe :</p>
            <ul class="space-y-1">
              <li
                v-for="(req, index) in passwordRequirements"
                :key="index"
                class="flex items-center gap-2 text-sm transition-colors"
                :class="req.met ? 'text-success-600' : 'text-sand-10'"
                v-motion
                :initial="{ opacity: 0, x: -10 }"
                :enter="{ opacity: 1, x: 0, transition: { delay: 50 * index } }"
              >
                <CheckCircleIcon
                  class="w-4 h-4 shrink-0"
                  :class="req.met ? 'opacity-100' : 'opacity-30'"
                />
                {{ req.label }}
              </li>
            </ul>
          </div>

          <!-- Confirm Password -->
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

          <!-- Submit Button -->
          <Button
            type="submit"
            variant="primary"
            size="lg"
            :loading="form.processing"
            :disabled="form.processing"
            full-width
          >
            Réinitialiser le mot de passe
          </Button>
        </form>
      </section>
    </div>
  </AuthLayout>
</template>
