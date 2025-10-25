// inertia/components/registrations/Stats.tsx
import { motion } from 'motion/react'
import Card from '~/components/ui/Card'

interface RegistrationStatsProps {
  activeCount: number
  pastCount: number
  totalCount: number
}

export default function RegistrationStats({
  activeCount,
  pastCount,
  totalCount,
}: RegistrationStatsProps) {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="text-center">
        <div className="text-3xl font-bold text-primary-600 mb-1">{activeCount}</div>
        <p className="text-sm text-neutral-600">Inscriptions actives</p>
      </Card>
      <Card className="text-center">
        <div className="text-3xl font-bold text-info-600 mb-1">{pastCount}</div>
        <p className="text-sm text-neutral-600">Événements assistés</p>
      </Card>
      <Card className="text-center">
        <div className="text-3xl font-bold text-neutral-600 mb-1">{totalCount}</div>
        <p className="text-sm text-neutral-600">Total d'inscriptions</p>
      </Card>
    </motion.div>
  )
}
