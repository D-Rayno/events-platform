// inertia/components/events/Grid.tsx
import { motion } from 'motion/react'
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  TrophyIcon,
  BoltIcon,
} from '@heroicons/react/24/outline'
import Card from '~/components/ui/Card'
import Button from '~/components/ui/Button'
import Badge from '~/components/ui/Badge'
import Image from '~/components/ui/Image'
import { useTheme } from '~/hooks/useTheme'
import { formatDate, formatCurrency, truncate, getStoragePath } from '~/lib/utils'

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
  imageUrl: string | null
  category: string
  basePrice: number
  isFull: boolean
  canRegister: boolean
  isRegistered: boolean
  isUpcoming: boolean
  isOngoing: boolean
  isFinished: boolean
  eventType?: string | null
  gameType?: string | null
  difficulty?: string | null
  prizeInformation?: string | null
  allowsTeams?: boolean
}

interface EventsGridProps {
  events: Event[]
}

export default function EventsGrid({ events }: EventsGridProps) {
  const { getPlaceholder } = useTheme()

  const getEventStatusBadge = (event: Event) => {
    if (event.isOngoing) {
      return (
        <Badge variant="info" dot pulse size="sm">
          En cours
        </Badge>
      )
    }
    if (event.isUpcoming) {
      return (
        <Badge variant="success" dot size="sm">
          À venir
        </Badge>
      )
    }
    if (event.isFinished) {
      return (
        <Badge variant="neutral" size="sm">
          Terminé
        </Badge>
      )
    }
    return null
  }

  const getEventTypeBadge = (event: Event) => {
    if (event.eventType === 'game') {
      return (
        <Badge variant="secondary" size="sm">
          <TrophyIcon className="w-3 h-3 mr-1" />
          Jeu
        </Badge>
      )
    }
    return null
  }

  const getDifficultyBadge = (difficulty?: string | null) => {
    if (!difficulty) return null
    const config = {
      easy: { variant: 'success' as const, label: 'Facile', icon: '😊' },
      medium: { variant: 'warning' as const, label: 'Moyen', icon: '😐' },
      hard: { variant: 'error' as const, label: 'Difficile', icon: '😰' },
      extreme: { variant: 'error' as const, label: 'Extrême', icon: '💀' },
    }
    const c = config[difficulty as keyof typeof config]
    return c ? (
      <Badge variant={c.variant} size="sm">
        {c.icon} {c.label}
      </Badge>
    ) : null
  }

  if (events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16"
      >
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-2xl font-bold text-neutral-900 mb-2">Aucun événement trouvé</h3>
        <p className="text-neutral-600 mb-6">Essayez d'ajuster vos critères de recherche</p>
      </motion.div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          <Card hoverable clickable className="h-full flex flex-col overflow-hidden group">
            <div className="relative overflow-hidden">
              <div className="transform transition-transform duration-300 group-hover:scale-110">
                <Image
                  src={event.imageUrl ? getStoragePath(event.imageUrl) : getPlaceholder('event')}
                  alt={event.name}
                  aspectRatio="16/9"
                  rounded="lg"
                />
              </div>

              {/* Badges Overlay */}
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                {getEventStatusBadge(event)}
                {getEventTypeBadge(event)}
                {event.difficulty && getDifficultyBadge(event.difficulty)}
              </div>

              {/* Registration Badge */}
              {!!event.isRegistered && (
                <div className="absolute top-3 left-3">
                  <Badge variant="success">
                    <BoltIcon className="w-3 h-3 mr-1" />
                    Inscrit
                  </Badge>
                </div>
              )}

              {/* Prize Badge for Game Events */}
              {event.prizeInformation && (
                <div className="absolute bottom-3 left-3">
                  <Badge variant="warning" size="sm">
                    <TrophyIcon className="w-3 h-3 mr-1" />
                    Récompenses
                  </Badge>
                </div>
              )}

              {/* Team Event Badge */}
              {!!event.allowsTeams && (
                <div className="absolute bottom-3 right-3">
                  <Badge variant="info" size="sm">
                    <UsersIcon className="w-3 h-3 mr-1" />
                    Équipes
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col mt-4 p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="text-lg font-bold text-neutral-900 line-clamp-2 flex-1">
                  {event.name}
                </h3>
                <Badge variant="primary" size="sm">
                  {event.category}
                </Badge>
              </div>

              {/* Game Type Display */}
              {event.gameType && (
                <p className="text-xs text-primary-600 font-semibold mb-2">🎮 {event.gameType}</p>
              )}

              <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                {truncate(event.description, 100)}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-neutral-700">
                  <CalendarIcon className="w-4 h-4 text-primary-600 shrink-0" />
                  <span>{formatDate(event.startDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-700">
                  <MapPinIcon className="w-4 h-4 text-primary-600 shrink-0" />
                  <span className="truncate">
                    {event.commune}, {event.province}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-700">
                  <UsersIcon className="w-4 h-4 text-primary-600 shrink-0" />
                  <span>
                    {event.availableSeats} place{event.availableSeats > 1 ? 's' : ''} disponible
                    {event.availableSeats > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-neutral-200 flex items-center justify-between">
                <div>
                  {event.basePrice > 0 ? (
                    <p className="text-lg font-bold text-primary-600">
                      {formatCurrency(event.basePrice)}
                    </p>
                  ) : (
                    <Badge variant="success">Gratuit</Badge>
                  )}
                </div>
                <Button variant="primary" size="sm" href={`/events/${event.id}`}>
                  Détails
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
