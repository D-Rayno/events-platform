<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import { EnvelopeIcon, ArrowLeftIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'
import AuthLayout from '~/components/layouts/AuthLayout.vue'
import Input from '#ui/Input.vue'
import Button from '#ui/Button.vue'
import Alert from '#ui/Alert.vue'
import { use_vlidated_form } from '~/composables/use_validated_form'
import { forgotPasswordSchema } from '~/lib/validation'

const { form, getError, validateField, validateAll, clearError } = use_vlidated_form(forgotPasswordSchema, {
  email: '',
})

const handleSubmit = async () => {
  const isValid = await validateAll()
  if (!isValid) return

  form.post('/auth/forgot-password', {
    preserveScroll: true,
  })
}

const handleBlur = (field: 'email') => {
  validateField(field)
}
</script>

<template>
  <Head>
    <title>Mot de passe oublié - Réinitialisez votre accès</title>
    <meta name="description" content="Réinitialisez votre mot de passe en quelques étapes simples. Recevez un lien de réinitialisation par email." />
    <meta name="robots" content="noindex, nofollow" />
  </Head>

  <AuthLayout>
    <div class="w-full max-w-md" v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }">
      <!-- Header -->
      <header class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4" v-motion :initial="{ scale: 0 }" :enter="{ scale: 1, transition: { delay: 100, type: 'spring' } }">
          <EnvelopeIcon class="w-8 h-8 text-primary-600" />
        </div>
        <h1 class="text-3xl font-bold text-sand-12 mb-2">
          Mot de passe oublié ?
        </h1>
        <p class="text-sand-11">
          Pas de souci, nous allons vous aider à le récupérer
        </p>
      </header>

      <!-- Form Card -->
      <section class="bg-white shadow-xl rounded-2xl p-8 border border-sand-6" aria-label="Formulaire de réinitialisation">
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
            autofocus
            autocomplete="email"
            @blur="handleBlur('email')"
            @input="clearError('email')"
          />

          <!-- Info Alert -->
          <Alert type="info" v-motion :initial="{ opacity: 0, y: -10 }" :enter="{ opacity: 1, y: 0, transition: { delay: 150 } }">
            <div class="flex items-start gap-2">
              <InformationCircleIcon class="w-5 h-5 shrink-0 mt-0.5" />
              <p class="text-sm">
                Vous recevrez un email avec un lien pour réinitialiser votre mot de passe si un compte existe avec cette adresse.
              </p>
            </div>
          </Alert>

          <!-- Submit Button -->
          <Button
            type="submit"
            variant="primary"
            size="lg"
            :loading="form.processing"
            :disabled="form.processing"
            full-width
          >
            Envoyer le lien de réinitialisation
          </Button>

          <!-- Back to Login -->
          <div class="text-center" v-motion :initial="{ opacity: 0 }" :enter="{ opacity: 1, transition: { delay: 200 } }">
            <Link
              href="/auth/login"
              class="inline-flex items-center gap-2 text-sm text-sand-11 hover:text-sand-12 font-medium transition-colors group"
            >
              <ArrowLeftIcon class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Retour à la connexion
            </Link>
          </div>
        </form>
      </section>
    </div>
  </AuthLayout>
</template>