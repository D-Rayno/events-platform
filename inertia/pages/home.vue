<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from '@heroicons/vue/24/outline'
import AppLayout from '~/components/layouts/AppLayout.vue'
import Button from '#ui/Button.vue'
import Card from '#ui/Card.vue'
import { use_theme } from '~/composables/use_theme'

const { config, appName, appTagline } = use_theme()

const features = [
  {
    icon: CalendarIcon,
    title: 'Événements Variés',
    description: "Des conférences aux concerts, trouvez l'événement parfait pour vous",
    color: 'from-sky-500 to-blue-600',
  },
  {
    icon: MapPinIcon,
    title: 'Partout en Algérie',
    description: 'Découvrez des événements dans toutes les wilayas du pays',
    color: 'from-purple-500 to-pink-600',
  },
  {
    icon: UsersIcon,
    title: 'Communauté Active',
    description: 'Rejoignez des milliers de participants passionnés',
    color: 'from-orange-500 to-red-600',
  },
  {
    icon: SparklesIcon,
    title: 'Inscription Facile',
    description: 'Réservez votre place en quelques clics avec QR code',
    color: 'from-green-500 to-emerald-600',
  },
]

const benefits = [
  'Inscription rapide et sécurisée',
  'QR codes pour un accès facile',
  'Notifications pour vos événements',
  'Gestion de vos inscriptions',
  'Support 24/7',
  'Paiement sécurisé',
]

const stats = [
  { label: 'Événements', value: '500+', icon: CalendarIcon },
  { label: 'Participants', value: '10K+', icon: UsersIcon },
  { label: 'Villes', value: '48', icon: MapPinIcon },
]
</script>

<template>
  <Head>
    <title>{{ config.seo.defaultTitle }}</title>
    <meta name="description" :content="config.seo.description" />
    <meta name="keywords" :content="config.seo.keywords.join(', ')" />
  </Head>

  <AppLayout>
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden"
    >
      <!-- Animated Background Elements -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          class="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl"
          v-motion
          :initial="{ scale: 0, opacity: 0 }"
          :enter="{ scale: 1, opacity: 1, transition: { duration: 1500, delay: 200 } }"
        />
        <div
          class="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-200/30 rounded-full blur-3xl"
          v-motion
          :initial="{ scale: 0, opacity: 0 }"
          :enter="{ scale: 1, opacity: 1, transition: { duration: 1500, delay: 400 } }"
        />
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Left Content -->
          <div class="space-y-8">
            <div
              v-motion
              :initial="{ opacity: 0, y: 30 }"
              :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }"
            >
              <div
                class="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full mb-6"
              >
                <SparklesIcon class="w-5 h-5 text-primary-600" />
                <span class="text-sm font-semibold text-primary-700"
                  >Plateforme N°1 en Algérie</span
                >
              </div>

              <h1 class="text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight">
                {{ appName }}
              </h1>
              <p class="text-2xl text-primary-600 font-medium mt-4">
                {{ appTagline }}
              </p>
              <p class="text-xl text-neutral-600 mt-6">
                {{ config.app.description }}
              </p>
            </div>

            <div
              class="flex flex-col sm:flex-row gap-4"
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200 } }"
            >
              <Button
                variant="primary"
                size="lg"
                href="/events"
                :icon-right="ArrowRightIcon"
                class="group"
              >
                Découvrir les événements
              </Button>
              <Button variant="outline" size="lg" href="/auth/register"> Créer un compte </Button>
            </div>

            <!-- Stats -->
            <div
              class="grid grid-cols-3 gap-6 pt-8"
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 400 } }"
            >
              <div
                v-for="(stat, index) in stats"
                :key="index"
                class="text-center"
                v-motion
                :initial="{ opacity: 0, scale: 0.8 }"
                :enter="{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 500, delay: 600 + index * 100 },
                }"
              >
                <component :is="stat.icon" class="w-8 h-8 mx-auto text-primary-600 mb-2" />
                <div class="text-3xl font-bold text-neutral-900">{{ stat.value }}</div>
                <div class="text-sm text-neutral-600">{{ stat.label }}</div>
              </div>
            </div>
          </div>

          <!-- Right Image/Illustration -->
          <div
            class="relative"
            v-motion
            :initial="{ opacity: 0, x: 50 }"
            :enter="{ opacity: 1, x: 0, transition: { duration: 800, delay: 300 } }"
          >
            <div
              class="relative aspect-square rounded-3xl bg-gradient-to-br from-primary-400 to-secondary-500 p-1 shadow-2xl"
            >
              <div
                class="h-full w-full rounded-3xl bg-white flex items-center justify-center text-9xl"
              >
                {{ config.branding.logo.icon }}
              </div>
            </div>

            <!-- Floating Cards -->
            <div
              class="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4"
              v-motion
              :initial="{ opacity: 0, y: -20 }"
              :enter="{
                opacity: 1,
                y: 0,
                transition: { duration: 600, delay: 800 },
              }"
            >
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircleIcon class="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div class="text-sm font-medium text-neutral-900">Inscription</div>
                  <div class="text-xs text-neutral-600">En 2 minutes</div>
                </div>
              </div>
            </div>

            <div
              class="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4"
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :enter="{
                opacity: 1,
                y: 0,
                transition: { duration: 600, delay: 1000 },
              }"
            >
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <SparklesIcon class="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div class="text-sm font-medium text-neutral-900">QR Code</div>
                  <div class="text-xs text-neutral-600">Accès rapide</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          class="text-center mb-16"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        >
          <h2 class="text-4xl font-bold text-neutral-900 mb-4">Pourquoi choisir EventHub ?</h2>
          <p class="text-xl text-neutral-600 max-w-2xl mx-auto">
            La plateforme la plus simple et complète pour découvrir et participer aux événements
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card
            v-for="(feature, index) in features"
            :key="index"
            hoverable
            class="group"
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :visibleOnce="{
              opacity: 1,
              y: 0,
              transition: { duration: 500, delay: index * 100 },
            }"
          >
            <div class="text-center space-y-4">
              <div
                :class="[
                  'w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300',
                  feature.color,
                ]"
              >
                <component :is="feature.icon" class="w-8 h-8 text-white" />
              </div>
              <h3 class="text-xl font-bold text-neutral-900">{{ feature.title }}</h3>
              <p class="text-neutral-600">{{ feature.description }}</p>
            </div>
          </Card>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="py-24 bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div
            v-motion
            :initial="{ opacity: 0, x: -50 }"
            :visibleOnce="{ opacity: 1, x: 0, transition: { duration: 800 } }"
          >
            <h2 class="text-4xl font-bold text-neutral-900 mb-6">
              Une expérience utilisateur exceptionnelle
            </h2>
            <p class="text-xl text-neutral-600 mb-8">
              Nous avons pensé à tout pour rendre votre expérience aussi fluide que possible
            </p>

            <div class="grid grid-cols-2 gap-4">
              <div
                v-for="(benefit, index) in benefits"
                :key="index"
                class="flex items-start gap-3"
                v-motion
                :initial="{ opacity: 0, x: -20 }"
                :visibleOnce="{
                  opacity: 1,
                  x: 0,
                  transition: { duration: 400, delay: index * 80 },
                }"
              >
                <CheckCircleIcon class="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span class="text-neutral-700">{{ benefit }}</span>
              </div>
            </div>

            <div class="mt-8">
              <Button variant="primary" size="lg" href="/auth/register">
                Commencer maintenant
              </Button>
            </div>
          </div>

          <div
            class="relative"
            v-motion
            :initial="{ opacity: 0, x: 50 }"
            :visibleOnce="{ opacity: 1, x: 0, transition: { duration: 800 } }"
          >
            <div class="grid grid-cols-2 gap-4">
              <Card
                v-for="i in 4"
                :key="i"
                class="aspect-square flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100"
                v-motion
                :initial="{ opacity: 0, scale: 0.8 }"
                :visibleOnce="{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 500, delay: i * 100 },
                }"
              >
                <div class="text-6xl opacity-50">{{ config.branding.logo.icon }}</div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section
      class="py-24 bg-gradient-to-br from-primary-600 to-secondary-600 text-white relative overflow-hidden"
    >
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"
        />
        <div
          class="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"
        />
      </div>

      <div
        class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 800 } }"
      >
        <h2 class="text-4xl lg:text-5xl font-bold mb-6">
          Prêt à découvrir votre prochain événement ?
        </h2>
        <p class="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Rejoignez des milliers d'utilisateurs qui font confiance à EventHub pour vivre des
          expériences inoubliables
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="secondary"
            size="lg"
            href="/events"
            class="bg-white text-primary-600 hover:bg-neutral-50"
          >
            Voir les événements
          </Button>
          <Button
            variant="outline"
            size="lg"
            href="/auth/register"
            class="border-white text-white hover:bg-white/10"
          >
            Créer un compte gratuit
          </Button>
        </div>
      </div>
    </section>

    <!-- FAQ/Support Section -->
    <section class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          class="text-center mb-16"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        >
          <h2 class="text-4xl font-bold text-neutral-900 mb-4">Besoin d'aide ?</h2>
          <p class="text-xl text-neutral-600">Notre équipe est là pour vous accompagner</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <Card
            hoverable
            class="text-center"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 500 } }"
          >
            <div class="text-5xl mb-4">📧</div>
            <h3 class="text-xl font-bold text-neutral-900 mb-2">Email</h3>
            <p class="text-neutral-600 mb-4">{{ config.contact.email }}</p>
            <a
              :href="`mailto:${config.contact.email}`"
              class="text-primary-600 hover:text-primary-700 font-medium"
            >
              Nous contacter
            </a>
          </Card>

          <Card
            hoverable
            class="text-center"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 500, delay: 100 } }"
          >
            <div class="text-5xl mb-4">📱</div>
            <h3 class="text-xl font-bold text-neutral-900 mb-2">Téléphone</h3>
            <p class="text-neutral-600 mb-4">{{ config.contact.phone }}</p>
            <a
              :href="`tel:${config.contact.phone}`"
              class="text-primary-600 hover:text-primary-700 font-medium"
            >
              Appeler
            </a>
          </Card>

          <Card
            hoverable
            class="text-center"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 500, delay: 200 } }"
          >
            <div class="text-5xl mb-4">📍</div>
            <h3 class="text-xl font-bold text-neutral-900 mb-2">Adresse</h3>
            <p class="text-neutral-600 mb-4">{{ config.contact.address }}</p>
            <span class="text-primary-600 font-medium">Visitez-nous</span>
          </Card>
        </div>
      </div>
    </section>
  </AppLayout>
</template>

<style scoped>
/* Add smooth scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Custom animations */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
</style>
