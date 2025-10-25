// inertia/components/registrations/Card.tsx
import { motion } from 'motion/react'
import {
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  QrCodeIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon as PendingIcon,
} from '@heroicons/react/24/outline'
import Card from '~/components/ui/Card'
import Button from '~/components/ui/Button'
import Badge from '~/components/ui/Badge'
import Image from '~/components/ui/Image'
import { useTheme } from '~/hooks/useTheme'
import { formatDate, formatDateTime, getStoragePath } from '~/lib/utils'

interface Event {
  id: number
  name: string
  location: string
  startDate: string
  endDate: string
  imageUrl: string | null
  status: string
}

interface Registration {
  id: number
  status: 'pending' | 'confirmed' | 'attended' | 'canceled'
  qrCode: string
  attendedAt: string | null
  createdAt: string
  event: Event
}

interface RegistrationCardProps {
  registration: Registration
  index: number
}

export default function RegistrationCard({ registration, index }: RegistrationCardProps) {
  const { getPlaceholder } = useTheme()

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { variant: 'warning' as const, icon: PendingIcon, text: 'En attente' },
      confirmed: { variant: 'success' as const, icon: CheckCircleIcon, text: 'Confirmé' },
      attended: { variant: 'info' as const, icon: CheckCircleIcon, text: 'Présent' },
      canceled: { variant: 'neutral' as const, icon: XCircleIcon, text: 'Annulé' },
    }
    return badges[status as keyof typeof badges] || badges.pending
  }

  const statusBadge = getStatusBadge(registration.status)
  const StatusIcon = statusBadge.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card hoverable className="group">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Event Image */}
          <div className="sm:w-48 shrink-0">
            <Image
              src={
                registration.event.imageUrl
                  ? getStoragePath(registration.event.imageUrl)
                  : getPlaceholder('event')
              }
              alt={registration.event.name}
              aspectRatio="16/9"
              rounded="lg"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-neutral-900 line-clamp-1 mb-2 group-hover:text-primary-600 transition-colors">
                  {registration.event.name}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-600">
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{formatDate(registration.event.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{registration.event.location}</span>
                  </div>
                </div>
              </div>

              <Badge variant={statusBadge.variant} size="lg" dot>
                <StatusIcon className="w-4 h-4 mr-1.5" />
                {statusBadge.text}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm text-neutral-500 mb-4">
              <ClockIcon className="w-4 h-4" />
              <span>Inscrit le {formatDateTime(registration.createdAt)}</span>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="primary"
                size="sm"
                href={`/registrations/${registration.id}`}
                iconRight={ArrowRightIcon}
              >
                Voir les détails
              </Button>

              {(registration.status === 'confirmed' || registration.status === 'pending') && (
                <Button
                  variant="outline"
                  size="sm"
                  href={`/registrations/${registration.id}`}
                  iconLeft={QrCodeIcon}
                >
                  QR Code
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}