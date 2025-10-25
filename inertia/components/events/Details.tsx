// inertia/components/events/Details.tsx
import { motion } from 'motion/react'
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  ClockIcon,
  TagIcon,
} from '@heroicons/react/24/outline'
import Card from '~/components/ui/Card'
import Badge from '~/components/ui/Badge'
import { formatDateTime } from '~/lib/utils'

interface Event {
  id: number
  name: string
  description: string
  location: string
  province: string
  commune: string
  startDate: string
  endDate: string
  capacity: number
  registeredCount: number
  availableSeats: number
  category: string
  tags?: string[]
  gameSummary?: string
}

interface EventDetailsProps {
  event: Event
}

export default function EventDetails({ event }: EventDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card>
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">{event.name}</h1>
          
          {/* Game Summary */}
          {event.gameSummary && (
            <p className="text-primary-600 font-medium mb-4">
              {event.gameSummary}
            </p>
          )}
        </div>

        <div className="prose max-w-none text-neutral-700 mb-6">
          <p className="text-lg leading-relaxed">{event.description}</p>
        </div>

        {/* Key Info Grid */}
        <div className="grid sm:grid-cols-2 gap-4 p-6 bg-linear-to-br from-neutral-50 to-primary-50/30 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
              <CalendarIcon className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-700">Date de début</p>
              <p className="text-neutral-900">{formatDateTime(event.startDate)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center shrink-0">
              <ClockIcon className="w-5 h-5 text-secondary-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-700">Date de fin</p>
              <p className="text-neutral-900">{formatDateTime(event.endDate)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center shrink-0">
              <MapPinIcon className="w-5 h-5 text-success-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-700">Lieu</p>
              <p className="text-neutral-900">{event.location}</p>
              <p className="text-sm text-neutral-600">
                {event.commune}, {event.province}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-info-100 rounded-lg flex items-center justify-center shrink-0">
              <UsersIcon className="w-5 h-5 text-info-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-neutral-700">Places disponibles</p>
              <p className="text-neutral-900">
                {event.availableSeats} / {event.capacity}
              </p>
              <div className="mt-1 w-full bg-neutral-200 rounded-full h-2">
                <div
                  className="bg-info-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min((event.registeredCount / event.capacity) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <TagIcon className="w-5 h-5 text-primary-600" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <Badge key={tag} variant="neutral">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  )
}