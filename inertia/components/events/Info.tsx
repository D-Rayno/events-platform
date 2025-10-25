// inertia/components/events/Info.tsx
import { motion } from 'motion/react'
import { BoltIcon } from '@heroicons/react/24/outline'
import Card from '~/components/ui/Card'

interface Event {
  id: number
  capacity: number
  registeredCount: number
  availableSeats: number
  minAge: number
  maxAge?: number
  isCheckInOpen?: boolean
}

interface EventInfoProps {
  event: Event
}

export default function EventInfo({ event }: EventInfoProps) {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {/* Event Details */}
      <Card>
        <h3 className="text-lg font-bold text-neutral-900 mb-4">Détails</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-600">Capacité</span>
            <span className="font-semibold text-neutral-900">{event.capacity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">Inscrits</span>
            <span className="font-semibold text-neutral-900">
              {event.registeredCount}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">Places restantes</span>
            <span className="font-semibold text-primary-600">{event.availableSeats}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">Âge minimum</span>
            <span className="font-semibold text-neutral-900">{event.minAge} ans</span>
          </div>
          {event.maxAge && (
            <div className="flex justify-between">
              <span className="text-neutral-600">Âge maximum</span>
              <span className="font-semibold text-neutral-900">{event.maxAge} ans</span>
            </div>
          )}
        </div>
      </Card>

      {/* Check-in Info */}
      {event.isCheckInOpen && (
        <Card variant="gradient">
          <div className="text-center">
            <BoltIcon className="w-12 h-12 text-primary-600 mx-auto mb-3" />
            <h4 className="font-bold text-neutral-900 mb-2">
              Enregistrement ouvert !
            </h4>
            <p className="text-sm text-neutral-700">
              Présentez-vous dès maintenant
            </p>
          </div>
        </Card>
      )}
    </motion.div>
  )
}