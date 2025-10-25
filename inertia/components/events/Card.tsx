// inertia/components/events/EventCard.tsx - Event Card for Grid Display
import {
  TrophyIcon,
  UsersIcon,
  BoltIcon,
  CalendarIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'
import Card from '~/components/ui/Card'
import Image from '~/components/ui/Image'
import Badge from '~/components/ui/Badge'
import Button from '~/components/ui/Button'
import { useTheme } from '~/hooks/useTheme'
import { formatDate, formatCurrency, truncate, getStoragePath } from '~/lib/utils'
import type { Event } from '~/types/event'

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  const { getPlaceholder } = useTheme()

  const getEventStatusBadge = () => {
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

  const getEventTypeBadge = () => {
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

  const getDifficultyBadge = () => {
    if (!event.difficulty) return null
    const config = {
      easy: { variant: 'success' as const, label: 'Facile', icon: '😊' },
      medium: { variant: 'warning' as const, label: 'Moyen', icon: '😐' },
      hard: { variant: 'error' as const, label: 'Difficile', icon: '😰' },
      extreme: { variant: 'error' as const, label: 'Extrême', icon: '💀' },
    }
    const c = config[event.difficulty as keyof typeof config]
    return c ? (
      <Badge variant={c.variant} size="sm">
        {c.icon} {c.label}
      </Badge>
    ) : null
  }

  return (
    <Card hoverable clickable className="h-full flex flex-col overflow-hidden group">
      {/* Event Image with Badges Overlay */}
      <div className="relative overflow-hidden">
        <div className="transform transition-transform duration-300 group-hover:scale-110">
          <Image
            src={event.imageUrl ? getStoragePath(event.imageUrl) : getPlaceholder('event')}
            alt={event.name}
            aspectRatio="16/9"
            rounded="lg"
          />
        </div>

        {/* Top Right Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {getEventStatusBadge()}
          {getEventTypeBadge()}
          {event.difficulty && getDifficultyBadge()}
        </div>

        {/* Top Left - Registration Badge */}
        {!!event.isRegistered && (
          <div className="absolute top-3 left-3">
            <Badge variant="success">
              <BoltIcon className="w-3 h-3 mr-1" />
              Inscrit
            </Badge>
          </div>
        )}

        {/* Bottom Left - Prize Badge */}
        {event.prizeInformation && (
          <div className="absolute bottom-3 left-3">
            <Badge variant="warning" size="sm">
              <TrophyIcon className="w-3 h-3 mr-1" />
              Récompenses
            </Badge>
          </div>
        )}

        {/* Bottom Right - Team Badge */}
        {event.allowsTeams && (
          <div className="absolute bottom-3 right-3">
            <Badge variant="info" size="sm">
              <UsersIcon className="w-3 h-3 mr-1" />
              Équipes
            </Badge>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex-1 flex flex-col mt-4 p-4">
        {/* Event Title and Category */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-lg font-bold text-neutral-900 line-clamp-2 flex-1">
            {event.name}
          </h3>
          <Badge variant="primary" size="sm">
            {event.category}
          </Badge>
        </div>

        {/* Game Type */}
        {event.gameType && (
          <p className="text-xs text-primary-600 font-semibold mb-2">
            🎮 {event.gameType}
          </p>
        )}

        {/* Description */}
        <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
          {truncate(event.description, 100)}
        </p>

        {/* Event Details */}
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

        {/* Footer - Price and Action */}
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
  )
}