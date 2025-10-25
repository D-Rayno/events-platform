// inertia/components/events/Header.tsx
import { motion } from 'motion/react'
import {
  ArrowLeftIcon,
  ShareIcon,
  HeartIcon,
  CheckCircleIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import Card from '~/components/ui/Card'
import Image from '~/components/ui/Image'
import Badge from '~/components/ui/Badge'
import Button from '~/components/ui/Button'
import { useTheme } from '~/hooks/useTheme'
import { getStoragePath } from '~/lib/utils'
import type { Event } from '~/types/event'

interface EventHeaderProps {
  event: Event
  isRegistered: boolean
  isFavorite: boolean
  onToggleFavorite: () => void
  onShare: () => void
}

export default function EventHeader({
  event,
  isRegistered,
  isFavorite,
  onToggleFavorite,
  onShare,
}: EventHeaderProps) {
  const { getPlaceholder } = useTheme()

  const getStatusBadge = () => {
    if (event.isOngoing) {
      return (
        <Badge variant="info" size="lg" dot pulse>
          En cours
        </Badge>
      )
    }
    if (event.isUpcoming) {
      return (
        <Badge variant="success" size="lg" dot>
          À venir
        </Badge>
      )
    }
    return (
      <Badge variant="neutral" size="lg">
        Terminé
      </Badge>
    )
  }

  const getEventTypeBadge = () => {
    if (event.eventType === 'game') {
      return (
        <Badge variant="secondary" size="lg">
          <TrophyIcon className="w-5 h-5 mr-1" />
          Événement de jeu
        </Badge>
      )
    }
    return null
  }

  const getDifficultyBadge = () => {
    if (!event.difficulty) return null
    const colors = {
      easy: 'success' as const,
      medium: 'warning' as const,
      hard: 'error' as const,
      extreme: 'error' as const,
    }
    const labels = {
      easy: '😊 Facile',
      medium: '😐 Moyen',
      hard: '😰 Difficile',
      extreme: '💀 Extrême',
    }
    return (
      <Badge variant={colors[event.difficulty as keyof typeof colors]} size="lg">
        {labels[event.difficulty as keyof typeof labels]}
      </Badge>
    )
  }

  return (
    <>
      <motion.div className="mb-6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <Button variant="ghost" iconLeft={ArrowLeftIcon} href="/events">
          Retour aux événements
        </Button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card padding="none" className="overflow-hidden">
          <div className="relative">
            <Image
              src={event.imageUrl ? getStoragePath(event.imageUrl) : getPlaceholder('event')}
              alt={event.name}
              aspectRatio="16/9"
            />
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              {getStatusBadge()}
              {getEventTypeBadge()}
              {isRegistered && (
                <Badge variant="success" size="lg">
                  <CheckCircleIcon className="w-5 h-5 mr-1" />
                  Inscrit
                </Badge>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant="primary" size="lg">
                {event.category}
              </Badge>
              {event.gameType && (
                <Badge variant="secondary" size="lg">
                  🎮 {event.gameType}
                </Badge>
              )}
              {getDifficultyBadge()}
            </div>
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">{event.name}</h1>
            {event.gameSummary && (
              <p className="text-primary-600 font-medium mb-4">{event.gameSummary}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              iconLeft={isFavorite ? HeartSolidIcon : HeartIcon}
              onClick={onToggleFavorite}
              className={isFavorite ? 'text-error-600 border-error-600' : ''}
            >
              {isFavorite ? 'Sauvegardé' : 'Sauvegarder'}
            </Button>
            <Button variant="outline" size="sm" iconLeft={ShareIcon} onClick={onShare}>
              Partager
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  )
}