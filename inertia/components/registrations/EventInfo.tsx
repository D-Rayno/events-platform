// inertia/components/registrations/EventInfo.tsx
import { motion } from 'motion/react'
import { CalendarIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline'
import Card from '~/components/ui/Card'
import Badge from '~/components/ui/Badge'
import Button from '~/components/ui/Button'
import Image from '~/components/ui/Image'
import { useTheme } from '~/hooks/useTheme'
import { formatDateTime, getStoragePath } from '~/lib/utils'

interface Event {
  id: number
  name: string
  description: string
  location: string
  province: string
  commune: string
  startDate: string
  endDate: string
  imageUrl: string | null
  category: string
  status: string
}

interface RegistrationEventInfoProps {
  event: Event
  createdAt: string
}

export default function RegistrationEventInfo({ event, createdAt }: RegistrationEventInfoProps) {
  const { getPlaceholder } = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card>
        <div className="flex gap-6">
          <div className="w-32 shrink-0">
            <Image
              src={event.imageUrl ? getStoragePath(event.imageUrl) : getPlaceholder('event')}
              alt={event.name}
              aspectRatio="1/1"
              rounded="lg"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <Badge variant="primary" className="mb-2">
                  {event.category}
                </Badge>
                <h1 className="text-2xl font-bold text-neutral-900 mb-2">{event.name}</h1>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-neutral-700">
                <CalendarIcon className="w-5 h-5 text-primary-600" />
                <span>{formatDateTime(event.startDate)}</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-700">
                <MapPinIcon className="w-5 h-5 text-primary-600" />
                <span>
                  {event.location}, {event.province}
                </span>
              </div>
              <div className="flex items-center gap-3 text-neutral-700">
                <ClockIcon className="w-5 h-5 text-primary-600" />
                <span>Inscrit le {formatDateTime(createdAt)}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" size="sm" href={`/events/${event.id}`}>
                Voir l'événement
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
