// inertia/components/registrations/Empty.tsx
import { motion } from 'motion/react'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import Button from '~/components/ui/Button'

export default function RegistrationEmpty() {
  return (
    <motion.div
      className="text-center py-16"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-6xl mb-4">📋</div>
      <h2 className="text-2xl font-bold text-neutral-900 mb-2">
        Aucune inscription pour le moment
      </h2>
      <p className="text-neutral-600 mb-6 max-w-md mx-auto">
        Commencez à explorer nos événements et inscrivez-vous à ceux qui vous intéressent
      </p>
      <Button variant="primary" size="lg" href="/events" iconRight={ArrowRightIcon}>
        Découvrir les événements
      </Button>
    </motion.div>
  )
}