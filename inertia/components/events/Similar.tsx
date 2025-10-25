// inertia/components/events/Similar.tsx
import { motion } from 'motion/react'
import { TrophyIcon } from '@heroicons/react/24/outline'
import Card from '~/components/ui/Card'
import Image from '~/components/ui/Image'
import Badge from '~/components/ui/Badge'
import { getStoragePath, formatCurrency } from '~/lib/utils'
import { useTheme } from '~/hooks/useTheme'
import type { SimilarEvent } from '~/types/event'

interface SimilarEventsProps {
  similarEvents: SimilarEvent[]
}

export default function SimilarEvents({ similarEvents }: SimilarEventsProps) {
  const { getPlaceholder } = useTheme()

  if (similarEvents.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card>
        <h3 className="text-xl font-bold text-neutral-900 mb-6">Événements similaires</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {similarEvents.map((similar) => (
            <a key={similar.id} href={`/events/${similar.id}`} className="group block">
              <div className="relative mb-3 overflow-hidden rounded-lg">
                <div className="transform transition-transform duration-300 group-hover:scale-110">
                  <Image
                    src={
                      similar.imageUrl ? getStoragePath(similar.imageUrl) : getPlaceholder('event')
                    }
                    alt={similar.name}
                    aspectRatio="16/9"
                  />
                </div>
                {similar.eventType === 'game' && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" size="sm">
                      <TrophyIcon className="w-3 h-3" />
                    </Badge>
                  </div>
                )}
              </div>
              <h4 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                {similar.name}
              </h4>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">{similar.province}</span>
                {similar.basePrice > 0 ? (
                  <span className="font-semibold text-primary-600">
                    {formatCurrency(similar.basePrice)}
                  </span>
                ) : (
                  <Badge variant="success" size="sm">
                    Gratuit
                  </Badge>
                )}
              </div>
            </a>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}