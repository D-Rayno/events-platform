// inertia/components/registrations/Header.tsx
import { motion } from 'motion/react'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Button from '~/components/ui/Button'

interface RegistrationHeaderProps {
  title: string
  description: string
}

export default function RegistrationHeader({ title, description }: RegistrationHeaderProps) {
  return (
    <>
      <motion.div className="mb-6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <Button variant="ghost" iconLeft={ArrowLeftIcon} href="/registrations">
          Retour à mes inscriptions
        </Button>
      </motion.div>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">{title}</h1>
        <p className="text-neutral-600">{description}</p>
      </motion.div>
    </>
  )
}
