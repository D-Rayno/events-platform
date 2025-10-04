<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3'

const props = defineProps<{
    token: string
}>()

const form = useForm({
    token: props.token,
    password: '',
    password_confirmation: '',
})

const submit = () => {
    form.post('/auth/reset-password', {
        preserveScroll: true,
    })
}
</script>

<template>

    <Head title="Réinitialiser le mot de passe" />

    <div
        class="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full">
            <!-- En-tête -->
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold text-sand-12 mb-2">Nouveau mot de passe</h1>
                <p class="text-sand-11">Choisissez un nouveau mot de passe sécurisé</p>
            </div>

            <!-- Formulaire -->
            <div class="bg-white shadow-xl rounded-2xl p-8 border border-sand-7">
                <form @submit.prevent="submit" class="space-y-6">
                    <!-- Nouveau mot de passe -->
                    <div>
                        <label for="password" class="block text-sm font-medium text-sand-12 mb-2">
                            Nouveau mot de passe
                        </label>
                        <input id="password" v-model="form.password" type="password" required autofocus
                            class="w-full px-4 py-2.5 border border-sand-7 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                            :class="{ 'border-red-500': form.errors.password }" placeholder="••••••••" />
                        <p v-if="form.errors.password" class="mt-1 text-sm text-red-600">
                            {{ form.errors.password }}
                        </p>
                        <p class="mt-1 text-xs text-sand-10">Minimum 8 caractères</p>
                    </div>

                    <!-- Confirmer le mot de passe -->
                    <div>
                        <label for="password_confirmation" class="block text-sm font-medium text-sand-12 mb-2">
                            Confirmer le mot de passe
                        </label>
                        <input id="password_confirmation" v-model="form.password_confirmation" type="password" required
                            class="w-full px-4 py-2.5 border border-sand-7 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                            placeholder="••••••••" />
                    </div>

                    <!-- Bouton de réinitialisation -->
                    <button type="submit" :disabled="form.processing"
                        class="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                        <span v-if="!form.processing">Réinitialiser le mot de passe</span>
                        <span v-else class="flex items-center">
                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            Réinitialisation...
                        </span>
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>