<script setup lang="ts">
import { Head, useForm, Link } from '@inertiajs/vue3'

const form = useForm({
    email: '',
})

const submit = () => {
    form.post('/auth/forgot-password', {
        preserveScroll: true,
    })
}
</script>

<template>

    <Head title="Mot de passe oublié" />

    <div
        class="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full">
            <!-- En-tête -->
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold text-sand-12 mb-2">Mot de passe oublié</h1>
                <p class="text-sand-11">Entrez votre email pour réinitialiser votre mot de passe</p>
            </div>

            <!-- Formulaire -->
            <div class="bg-white shadow-xl rounded-2xl p-8 border border-sand-7">
                <form @submit.prevent="submit" class="space-y-6">
                    <!-- Email -->
                    <div>
                        <label for="email" class="block text-sm font-medium text-sand-12 mb-2">
                            Adresse email
                        </label>
                        <input id="email" v-model="form.email" type="email" required autofocus
                            class="w-full px-4 py-2.5 border border-sand-7 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                            :class="{ 'border-red-500': form.errors.email }" placeholder="jean.dupont@example.com" />
                        <p v-if="form.errors.email" class="mt-1 text-sm text-red-600">
                            {{ form.errors.email }}
                        </p>
                    </div>

                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p class="text-sm text-blue-800">
                            💡 Vous recevrez un email avec un lien pour réinitialiser votre mot de passe s'il existe un
                            compte associé à cet email.
                        </p>
                    </div>

                    <!-- Bouton d'envoi -->
                    <button type="submit" :disabled="form.processing"
                        class="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                        <span v-if="!form.processing">Envoyer le lien</span>
                        <span v-else class="flex items-center">
                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            Envoi en cours...
                        </span>
                    </button>

                    <!-- Retour à la connexion -->
                    <div class="text-center text-sm text-sand-11">
                        <Link href="/auth/login" class="text-primary font-semibold hover:underline">
                        ← Retour à la connexion
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>