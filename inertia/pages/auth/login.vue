<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import { ref, onMounted } from 'vue'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/vue/24/outline'
import AuthLayout from '~/components/layouts/AuthLayout.vue'
import Input from '#ui/Input.vue'
import Button from '#ui/Button.vue'
import { use_vlidated_form } from '~/composables/use_validated_form'
import { loginSchema } from '~/lib/validation'
import { useAuthMiddleware } from '~/composables/use_auth_middleware'
import { useRouteGuard } from '~/composables/use_route_guard'

// Guard: only guests can access
useRouteGuard({ requiresGuest: true })

const { handlePostLoginRedirect } = useAuthMiddleware()
const rememberMe = ref(false)

const { form, getError, validateField, validateAll, clearError } = use_vlidated_form(loginSchema, {
  email: '',
  password: '',
})

/**
 * Handle form submission
 */
const handleSubmit = async () => {
  const isValid = await validateAll()
  if (!isValid) return

  form.post('/auth/login', {
    preserveScroll: true,
    onSuccess: () => {
      handlePostLoginRedirect()
    },
  })
}

/**
 * Handle field blur for validation
 */
const handleBlur = (field: 'email' | 'password') => {
  validateField(field)
}

// Focus email input on mount
onMounted(() => {
  const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement
  emailInput?.focus()
})
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
        <h1
          class="text-3xl font-bold text-sand-12 mb-2"
          v-motion
          :initial="{ opacity: 0, y: -10 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 300, delay: 100 } }"
        >
          Bon retour parmi nous
        </h1>
        <p
          class="text-sand-11"
          v-motion
          :initial="{ opacity: 0, y: -10 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 300, delay: 150 } }"
        >
          Connectez-vous pour continuer votre expérience
        </p>
      </header>

      <!-- Form Card -->
      <section
        class="bg-white shadow-xl rounded-2xl p-8 border border-sand-6"
        aria-label="Formulaire de connexion"
        v-motion
        :initial="{ opacity: 0, scale: 0.95 }"
        :enter="{ opacity: 1, scale: 1, transition: { duration: 400, delay: 200 } }"
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

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <label
              class="flex items-center gap-2 cursor-pointer group"
              v-motion
              :initial="{ opacity: 0, x: -10 }"
              :enter="{ opacity: 1, x: 0, transition: { duration: 300, delay: 250 } }"
            >
              <input
                v-model="rememberMe"
                type="checkbox"
                class="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-0 transition-all"
              />
              <span class="text-sm text-sand-11 group-hover:text-sand-12 transition-colors">
                Se souvenir de moi
              </span>
            </label>

            <Link
              href="/auth/forgot-password"
              class="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors hover:underline"
              v-motion
              :initial="{ opacity: 0, x: 10 }"
              :enter="{ opacity: 1, x: 0, transition: { duration: 300, delay: 250 } }"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <!-- Submit Button -->
          <div
            v-motion
            :initial="{ opacity: 0, y: 10 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 300, delay: 300 } }"
          >
            <Button
              type="submit"
              variant="primary"
              size="lg"
              :loading="form.processing"
              :disabled="form.processing"
              full-width
            >
              <template v-if="!form.processing"> Se connecter </template>
              <template v-else> Connexion en cours... </template>
            </Button>
          </div>

          <!-- Register Link -->
          <p
            class="text-center text-sm text-sand-11"
            v-motion
            :initial="{ opacity: 0 }"
            :enter="{ opacity: 1, transition: { delay: 350 } }"
          >
            Vous n'avez pas de compte ?
            <Link
              href="/auth/register"
              class="text-primary-600 hover:text-primary-700 font-semibold transition-colors hover:underline"
            >
              Créer un compte
            </Link>
          </p>
        </form>
      </section>

      <!-- Additional Info -->
      <div
        class="mt-6 text-center text-xs text-sand-10"
        v-motion
        :initial="{ opacity: 0 }"
        :enter="{ opacity: 1, transition: { delay: 400 } }"
      >
        <p>
          En vous connectant, vous acceptez nos
          <a href="#" class="text-primary-600 hover:underline">Conditions d'utilisation</a>
          et notre
          <a href="#" class="text-primary-600 hover:underline">Politique de confidentialité</a>
        </p>
      </div>
    </div>
  </AuthLayout>
</template>
