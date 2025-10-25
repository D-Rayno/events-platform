import { Head } from '@inertiajs/react'
import { useMemo } from 'react'
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
import AppLayout from '~/components/layouts/AppLayout'
import Card from '~/components/ui/Card'
import Button from '~/components/ui/Button'
import Badge from '~/components/ui/Badge'
import Image from '~/components/ui/Image'
import { useRouteGuard } from '~/hooks/useRouteGuard'
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

interface Props {
  registrations: Registration[]
}

export default function RegistrationsIndex({ registrations }: Props) {
  useRouteGuard({ requiresAuth: true, requiresVerification: true })

  const { getPlaceholder } = useTheme()

  const groupedRegistrations = useMemo(() => {
    return {
      active: registrations.filter((r) => r.status === 'confirmed' || r.status === 'pending'),
      past: registrations.filter((r) => r.status === 'attended'),
      canceled: registrations.filter((r) => r.status === 'canceled'),
    }
  }, [registrations])

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { variant: 'warning' as const, icon: PendingIcon, text: 'En attente' },
      confirmed: { variant: 'success' as const, icon: CheckCircleIcon, text: 'Confirmé' },
      attended: { variant: 'info' as const, icon: CheckCircleIcon, text: 'Présent' },
      canceled: { variant: 'neutral' as const, icon: XCircleIcon, text: 'Annulé' },
    }
    return badges[status as keyof typeof badges] || badges.pending
  }

  const renderRegistrationCard = (registration: Registration, index: number) => {
    const statusBadge = getStatusBadge(registration.status)
    const StatusIcon = statusBadge.icon

    return (
      <motion.div
        key={registration.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
      >
        <Card hoverable className="group">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Event Image */}
            <div className="sm:w-48 shrink-0">
              <Image
                src={registration.event.imageUrl ? getStoragePath(registration.event.imageUrl) : getPlaceholder('event')}
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

  if (registrations.length === 0) {
    return (
      <>
        <Head title="Mes Inscriptions" />
        <AppLayout>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-6xl mb-4">📋</div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Aucune inscription pour le moment
              </h2>
              <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                Commencez à explorer nos événements et inscrivez-vous à ceux qui vous intéressent
              </p>
              <Button variant="primary" size="lg" href="/events" iconRight={ArrowRightIcon}>
                Découvrir les événements
              </Button>
            </motion.div>
          </div>
        </AppLayout>
      </>
    )
  }

  return (
    <>
      <Head title="Mes Inscriptions" />
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Mes Inscriptions</h1>
            <p className="text-neutral-600">
              Gérez vos inscriptions et accédez à vos QR codes d'événements
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">
                {groupedRegistrations.active.length}
              </div>
              <p className="text-sm text-neutral-600">Inscriptions actives</p>
            </Card>
            <Card className="text-center">
              <div className="text-3xl font-bold text-info-600 mb-1">
                {groupedRegistrations.past.length}
              </div>
              <p className="text-sm text-neutral-600">Événements assistés</p>
            </Card>
            <Card className="text-center">
              <div className="text-3xl font-bold text-neutral-600 mb-1">{registrations.length}</div>
              <p className="text-sm text-neutral-600">Total d'inscriptions</p>
            </Card>
          </motion.div>

          {/* Active Registrations */}
          {groupedRegistrations.active.length > 0 && (
            <motion.div
              className="mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
                <div className="w-2 h-8 bg-primary-600 rounded-full" />
                Inscriptions actives
              </h2>
              <div className="space-y-4">
                {groupedRegistrations.active.map((reg, index) =>
                  renderRegistrationCard(reg, index)
                )}
              </div>
            </motion.div>
          )}

          {/* Past Events */}
          {groupedRegistrations.past.length > 0 && (
            <motion.div
              className="mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
                <div className="w-2 h-8 bg-info-600 rounded-full" />
                Événements passés
              </h2>
              <div className="space-y-4">
                {groupedRegistrations.past.map((reg, index) => renderRegistrationCard(reg, index))}
              </div>
            </motion.div>
          )}

          {/* Canceled */}
          {groupedRegistrations.canceled.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
                <div className="w-2 h-8 bg-neutral-400 rounded-full" />
                Inscriptions annulées
              </h2>
              <div className="space-y-4">
                {groupedRegistrations.canceled.map((reg, index) =>
                  renderRegistrationCard(reg, index)
                )}
              </div>
            </motion.div>
          )}
        </div>
      </AppLayout>
    </>
  )
}
