<script setup lang="ts">
import { Head, useForm, Link } from '@inertiajs/vue3'
import { ref } from 'vue'
import { PROVINCES } from '../../lib/constants'

const form = useForm({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    password_confirmation: '',
    age: '',
    province: '',
    commune: '',
    phoneNumber: '',
})

const provinces = ref(PROVINCES)

const submit = () => {
    form.post('/auth/register', {
        preserveScroll: true,
    })
}
</script>

<template>

    <Head title="Inscription" />

    <div
        class="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-2xl w-full">
            <!-- En-tête -->
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold text-sand-12 mb-2">Créer un compte</h1>
                <p class="text-sand-11">Rejoignez notre plateforme d'événements</p>
            </div>

            <!-- Formulaire -->
            <div class="bg-white shadow-xl rounded-2xl p-8 border border-sand-7">
                <form @submit.prevent="submit" class="space-y-6">
                    <!-- Prénom & Nom -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="firstName" class="block text-sm font-medium text-sand-12 mb-2">
                                Prénom <span class="text-red-500">*</span>
                            </label>
                            <input id="firstName" v-model="form.firstName" type="text" required
                                class="w-full px-4 py-2.5 border border-sand-7 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                :class="{ 'border-red-500': form.errors.firstName }" placeholder="Jean" />
                            <p v-if="form.errors.firstName" class="mt-1 text-sm text-red-600">
                                {{ form.errors.firstName }}
                            </p>
                        </div>

                        <div>
                            <label for="lastName" class="block text-sm font-medium text-sand-12 mb-2">
                                Nom <span class="text-red-500">*</span>
                            </label>
                            <input id="lastName" v-model="form.lastName" type="text" required
                                class="w-full px-4 py-2.5 border border-sand-7 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                :class="{ 'border-red-500': form.errors.lastName }" placeholder="Dupont" />
                            <p v-if="form.errors.lastName" class="mt-1 text-sm text-red-600">
                                {{ form.errors.lastName }}
                            </p>
                        </div>
                    </div>

                    <!-- Email -->
                    <div>
                        <label for="email" class="block text-sm font-medium text-sand-12 mb-2">
                            Adresse email <span class="text-red-500">*</span>
                        </label>
                        <input id="email" v-model="form.email" type="email" required
                            class="w-full px-4 py-2.5 border border-sand-7 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                            :class="{ 'border-red-500': form.errors.email }" placeholder="jean.dupont@example.com" />
                        <p v-if="form.errors.email" class="mt-1 text-sm text-red-600">
                            {{ form.errors.email }}
                        </p>
                    </div>

                    <!-- Mot de passe -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="password" class="block text-sm font-medium text-sand-12 mb-2">
                                Mot de passe <span class="text-red-500">*</span>
                            </label>
                            <input id="password" v-model="form.password" type="password" required
                                class="w-full px-4 py-2.5 border border-sand-7 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                :class="{ 'border-red-500': form.errors.password }" placeholder="••••••••" />
                            <p v-if="form.errors.password" class="mt-1 text-sm text-red-600">
                                {{ form.errors.password }}
                            </p>
                        </div>

                        <div>
                            <label for="password_confirmation" class="block text-sm font-medium text-sand-12 mb-2">
                                Confirmer le mot de passe <span class="text-red-500">*</span>
                            </label>
                            <input id="password_confirmation" v-model="form.password_confirmation" type="password"
                                required
                                class="w-full px-4 py-2.5 border border-sand-7 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                placeholder="••••••••" />
                        </div>
                    </div>

                    <!-- Âge -->
                    <div>
                        <label for="age" class="block text-sm font-medium text-sand-12 mb-2">
                            Âge <span class="text-red-500">*</span>
                        </label>
                        <input id="age" v-model="form.age" type="number" required min="13" max="120"
                            class="w-full px-4 py-2.5 border border-sand-7 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                            :class="{ 'border-red-500': form.errors.age }" placeholder="25" />
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
                            <select id="province" v-model="form.province" required
                                class="w-full px-4 py-2.5 border border-sand-7 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                :class="{ 'border-red-500': form.errors.province }">
                                <option value="" disabled>Sélectionnez une province</option>
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
                            <input id="commune" v-model="form.commune" type="text" required
                                class="w-full px-4 py-2.5 border border-sand-7 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                :class="{ 'border-red-500': form.errors.commune }" placeholder="Ex: Bab Ezzouar" />
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
                        <input id="phoneNumber" v-model="form.phoneNumber" type="tel"
                            class="w-full px-4 py-2.5 border border-sand-7 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                            :class="{ 'border-red-500': form.errors.phoneNumber }" placeholder="+213 555 123 456" />
                        <p v-if="form.errors.phoneNumber" class="mt-1 text-sm text-red-600">
                            {{ form.errors.phoneNumber }}
                        </p>
                    </div>

                    <!-- Bouton d'inscription -->
                    <button type="submit" :disabled="form.processing"
                        class="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                        <span v-if="!form.processing">S'inscrire</span>
                        <span v-else class="flex items-center">
                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            Inscription en cours...
                        </span>
                    </button>

                    <!-- Lien vers la connexion -->
                    <div class="text-center text-sm text-sand-11">
                        Vous avez déjà un compte ?
                        <Link href="/auth/login" class="text-primary font-semibold hover:underline">
                        Se connecter
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>