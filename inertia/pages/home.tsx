// inertia/pages/home.tsx - IMPROVED VERSION
import { Head } from '@inertiajs/react'
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  SparklesIcon as SparklesOutlineIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline'
import { SparklesIcon as SparklesSolidIcon } from '@heroicons/react/24/solid'
import AppLayout from '~/components/layouts/AppLayout'
import Button from '~/components/ui/Button'
import Card from '~/components/ui/Card'
import Badge from '~/components/ui/Badge'
import { useTheme } from '~/hooks/useTheme'
import { useAuthStore } from '~/stores/auth'
import { motion } from 'motion/react'

export default function Home() {
  const { config, appName, appTagline } = useTheme()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated())
  const user = useAuthStore((s) => s.user)

  const features = [
    {
      icon: CalendarIcon,
      title: 'Événements variés',
      description: 'Des conférences aux concerts, trouvez l\'événement parfait pour vous',
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
      title: 'Communauté active',
      description: 'Rejoignez des milliers de participants passionnés',
      color: 'from-orange-500 to-red-600',
    },
    {
      icon: SparklesOutlineIcon,
      title: 'Inscription facile',
      description: 'Réservez votre place en quelques clics avec QR code',
      color: 'from-green-500 to-emerald-600',
    },
  ]

  const benefits = [
    'Inscription rapide et sécurisée',
    'Codes QR pour un accès facile',
    'Notifications pour vos événements',
    'Gérez vos inscriptions',
    'Support 24/7',
    'Paiement sécurisé',
  ]

  const stats = [
    { label: 'Événements', value: '500+', icon: CalendarIcon },
    { label: 'Participants', value: '10K+', icon: UsersIcon },
    { label: 'Villes', value: '48', icon: MapPinIcon },
  ]

  return (
    <>
      <Head>
        <title>{config.seo.defaultTitle}</title>
        <meta name="description" content={config.seo.description} />
        <meta name="keywords" content={config.seo.keywords.join(', ')} />
      </Head>

      <AppLayout>
        {/* Hero Section */}
        <section
          className="relative min-h-[85vh] flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden"
          style={{ backgroundImage: `url(${config.images.banner.home})` }}
        >
          <div className="absolute inset-0 bg-linear-to-br from-primary-900/90 via-primary-800/85 to-secondary-900/90 backdrop-blur-sm" />

          <div className="relative z-10 text-center max-w-5xl mx-auto px-6 py-20">
            {isAuthenticated && user && (
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge variant="success" size="lg">
                  <SparklesSolidIcon className="w-5 h-5 mr-2" />
                  Bienvenue, {user.firstName}! 🎉
                </Badge>
              </motion.div>
            )}

            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {appName}
            </motion.h1>

            <motion.p
              className="text-xl md:text-3xl text-white/95 mb-12 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {appTagline}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button
                href="/events"
                variant="gradient"
                size="xl"
                iconRight={ArrowRightIcon}
                className="shadow-2xl hover:shadow-primary-500/30 transition-shadow min-w-[220px]"
              >
                Découvrir les événements
              </Button>

              {!isAuthenticated && (
                <Button
                  href="/auth/register"
                  variant="outline"
                  size="xl"
                  iconLeft={RocketLaunchIcon}
                  className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 min-w-[220px]"
                >
                  Créer un compte
                </Button>
              )}

              {isAuthenticated && (
                <Button
                  href="/registrations"
                  variant="outline"
                  size="xl"
                  className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 min-w-[220px]"
                >
                  Mes inscriptions
                </Button>
              )}
            </motion.div>
          </div>

          {/* Floating elements */}
          <motion.div
            className="absolute top-20 left-10 text-6xl animate-float opacity-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 0.5 }}
          >
            🎉
          </motion.div>
          <motion.div
            className="absolute bottom-20 right-20 text-6xl animate-float opacity-30"
            style={{ animationDelay: '1s' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 0.6 }}
          >
            🎟️
          </motion.div>
          <motion.div
            className="absolute top-40 right-40 text-6xl animate-float opacity-30"
            style={{ animationDelay: '2s' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 0.7 }}
          >
            📍
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
                Pourquoi choisir {appName}?
              </h2>
              <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                Découvrez tous les avantages de notre plateforme d'événements
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card hoverable className="h-full text-center">
                    <motion.div
                      className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-linear-to-br ${feature.color} flex items-center justify-center shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-600">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-linear-to-br from-primary-50 to-secondary-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-lg mb-6">
                    <stat.icon className="w-10 h-10 text-primary-600" />
                  </div>
                  <motion.h3
                    className="text-5xl font-bold text-neutral-900 mb-2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: index * 0.2 + 0.2 }}
                    viewport={{ once: true }}
                  >
                    {stat.value}
                  </motion.h3>
                  <p className="text-neutral-600 text-lg">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
                  Découvrez la meilleure plateforme d'événements
                </h2>
                <p className="text-xl text-neutral-700 mb-10">
                  Rejoignez des milliers d'utilisateurs satisfaits qui font confiance à {appName} pour leurs besoins en événements.
                </p>
                <ul className="space-y-4 mb-10">
                  {benefits.map((benefit, index) => (
                    <motion.li
                      key={benefit}
                      className="flex items-center gap-3 text-neutral-800"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                        <CheckCircleIcon className="w-4 h-4 text-green-600" />
                      </div>
                      <span>{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
                {!isAuthenticated && (
                  <Button
                    href="/auth/register"
                    variant="gradient"
                    size="lg"
                    iconLeft={SparklesSolidIcon}
                    className="shadow-xl"
                  >
                    Commencer gratuitement
                  </Button>
                )}
                {isAuthenticated && (
                  <Button
                    href="/events"
                    variant="gradient"
                    size="lg"
                    iconRight={ArrowRightIcon}
                    className="shadow-xl"
                  >
                    Explorer les événements
                  </Button>
                )}
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="relative z-10"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={config.images.placeholder.event}
                    alt="Plateforme d'événements"
                    className="rounded-3xl shadow-2xl"
                  />
                </motion.div>
                <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary-200 rounded-full opacity-20 blur-3xl" />
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-secondary-200 rounded-full opacity-20 blur-3xl" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-linear-to-br from-primary-600 via-primary-700 to-secondary-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Prêt à découvrir des événements incroyables?
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                Rejoignez notre communauté dès aujourd'hui et ne manquez plus jamais un événement près de chez vous.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!isAuthenticated ? (
                  <>
                    <Button
                      href="/auth/register"
                      variant="primary"
                      size="xl"
                      className="bg-white text-primary-600 hover:bg-neutral-100 shadow-xl min-w-[200px]"
                    >
                      S'inscrire gratuitement
                    </Button>
                    <Button
                      href="/events"
                      variant="outline"
                      size="xl"
                      className="border-white text-white hover:bg-white/10 min-w-[200px]"
                    >
                      Voir les événements
                    </Button>
                  </>
                ) : (
                  <Button
                    href="/events"
                    variant="primary"
                    size="xl"
                    iconRight={ArrowRightIcon}
                    className="bg-white text-primary-600 hover:bg-neutral-100 shadow-xl min-w-[250px]"
                  >
                    Explorer les événements
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              className="text-4xl font-bold text-center text-neutral-900 mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Contactez-nous
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Card hoverable className="text-center h-full">
                  <div className="text-5xl mb-4">✉️</div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">Email</h3>
                  <p className="text-neutral-600 mb-4">{config.contact.email}</p>
                  <a
                    href={`mailto:${config.contact.email}`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Nous contacter
                  </a>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card hoverable className="text-center h-full">
                  <div className="text-5xl mb-4">📱</div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">Téléphone</h3>
                  <p className="text-neutral-600 mb-4">{config.contact.phone}</p>
                  <a
                    href={`tel:${config.contact.phone}`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Appeler
                  </a>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card hoverable className="text-center h-full">
                  <div className="text-5xl mb-4">📍</div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">Adresse</h3>
                  <p className="text-neutral-600 mb-4">{config.contact.address}</p>
                  <span className="text-primary-600 font-medium">Nous visiter</span>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </AppLayout>
    </>
  )
}