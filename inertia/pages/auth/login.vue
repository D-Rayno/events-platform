<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/vue/24/outline'
import AuthLayout from '~/components/layouts/AuthLayout.vue'
import Input from '#ui/Input.vue'
import Button from '#ui/Button.vue'
import { use_vlidated_form } from '~/composables/use_validated_form'
import { loginSchema } from '~/lib/validation'

const { form, getError, validateField, validateAll, clearError } = use_vlidated_form(loginSchema, {
  email: '',
  password: '',
})

const handleSubmit = async () => {
  const isValid = await validateAll()
  if (!isValid) return

  form.post('/auth/login', {
    preserveScroll: true,
    onSuccess: () => {
      // Auth store will be updated via shared data
    },
  })
}

const handleBlur = (field: 'email' | 'password') => {
  validateField(field)
}
</script>

<template>
  <Head>
    <title>Connexion - Accédez à votre compte</title>
    <meta
      name="description"
      content="Connectez-vous à votre compte pour gérer vos inscriptions aux événements et accéder à votre profil."
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
        <h1 class="text-3xl font-bold text-sand-12 mb-2">Bon retour parmi nous</h1>
        <p class="text-sand-11">Connectez-vous pour continuer votre expérience</p>
      </header>

      <!-- Form Card -->
      <section
        class="bg-white shadow-xl rounded-2xl p-8 border border-sand-6"
        aria-label="Formulaire de connexion"
      >
        <form @submit.prevent="handleSubmit" class="space-y-6" novalidate>
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

          <!-- Password -->
          <Input
            v-model="form.password"
            type="password"
            label="Mot de passe"
            placeholder="••••••••"
            :icon="LockClosedIcon"
            :error="getError('password')"
            required
            autocomplete="current-password"
            @blur="handleBlur('password')"
            @input="clearError('password')"
          />

          <!-- Forgot Password Link -->
          <div class="flex justify-end">
            <Link
              href="/auth/forgot-password"
              class="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
              v-motion
              :initial="{ opacity: 0 }"
              :enter="{ opacity: 1, transition: { delay: 100 } }"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <!-- Submit Button -->
          <Button
            type="submit"
            variant="primary"
            size="lg"
            :loading="form.processing"
            :disabled="form.processing"
            full-width
          >
            Se connecter
          </Button>

          <!-- Register Link -->
          <p
            class="text-center text-sm text-sand-11"
            v-motion
            :initial="{ opacity: 0 }"
            :enter="{ opacity: 1, transition: { delay: 150 } }"
          >
            Vous n'avez pas de compte ?
            <Link
              href="/auth/register"
              class="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
            >
              Créer un compte
            </Link>
          </p>
        </form>
      </section>
    </div>
  </AuthLayout>
</template>
