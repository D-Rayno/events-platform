// inertia/pages/errors/not_found.tsx
import { Head } from '@inertiajs/react'
import { motion } from 'motion/react'
import { HomeIcon, ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Button from '~/components/ui/Button'

export default function NotFound() {
  return (
    <>
      <Head title="Page non trouvée" />
      <div className="min-h-screen bg-linear-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4">
        <motion.div
          className="text-center max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Animated 404 */}
          <motion.div
            className="mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 200 }}
          >
            <motion.h1
              className="text-9xl font-bold bg-linear-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            >
              404
            </motion.h1>
          </motion.div>

          {/* Icon Animation */}
          <motion.div
            className="mb-6"
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-8xl">🔍</span>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Page non trouvée</h2>
            <p className="text-xl text-neutral-600 mb-8 max-w-lg mx-auto">
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée. Vérifiez l'URL ou
              retournez à l'accueil.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="gradient"
                size="lg"
                iconLeft={HomeIcon}
                href="/"
                className="shadow-lg"
              >
                Retour à l'accueil
              </Button>
              <Button
                variant="outline"
                size="lg"
                iconLeft={ArrowLeftIcon}
                onClick={() => window.history.back()}
              >
                Page précédente
              </Button>
            </div>
          </motion.div>

          {/* Suggestions */}
          <motion.div
            className="mt-12 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-neutral-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="font-semibold text-neutral-900 mb-3 flex items-center justify-center gap-2">
              <MagnifyingGlassIcon className="w-5 h-5" />
              Pages populaires
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              <a
                href="/events"
                className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors border border-primary-200"
              >
                Événements
              </a>
              <a
                href="/registrations"
                className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors border border-primary-200"
              >
                Mes inscriptions
              </a>
              <a
                href="/profile"
                className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors border border-primary-200"
              >
                Mon profil
              </a>
            </div>
          </motion.div>

          {/* Help Text */}
          <motion.p
            className="mt-8 text-sm text-neutral-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Si vous pensez qu'il s'agit d'une erreur, veuillez{' '}
            <a href="mailto:contact@eventhub.dz" className="text-primary-600 hover:underline">
              nous contacter
            </a>
          </motion.p>
        </motion.div>
      </div>
    </>
  )
}
