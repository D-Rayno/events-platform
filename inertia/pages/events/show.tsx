import { Head, router } from '@inertiajs/react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  ClockIcon,
  TagIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  ShareIcon,
  HeartIcon,
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import AppLayout from '~/components/layouts/AppLayout'
import Card from '~/components/ui/Card'
import Button from '~/components/ui/Button'
import Badge from '~/components/ui/Badge'
import Image from '~/components/ui/Image'
import Alert from '~/components/ui/Alert'
import Modal from '~/components/ui/Modal'
import { useTheme } from '~/hooks/useTheme'
import { useRouteGuard } from '~/hooks/useRouteGuard'
import { useAuthStore } from '~/stores/auth'
import { formatDate, formatDateTime, formatCurrency } from '~/lib/utils'

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
  tags: string[]
  basePrice: number
  youthPrice: number | null
  seniorPrice: number | null
  minAge: number
  maxAge: number | null
  status: string
  requiresApproval: boolean
  registrationStartDate: string | null
  registrationEndDate: string | null
  isFull: boolean
  canRegister: boolean
  isUpcoming: boolean
  isOngoing: boolean
  isFinished: boolean
}

interface Registration {
  id: number
  status: string
  createdAt: string
}

interface Props {
  event: Event
  registration: Registration | null
  isRegistered: boolean
  userAge?: number
}

export default function EventShow({ event, registration, isRegistered, userAge }: Props) {
  const { getPlaceholder } = useTheme()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  const handleRegister = () => {
    if (!isAuthenticated) {
      router.visit('/auth/login')
      return
    }

    setShowRegisterModal(true)
  }

  const confirmRegistration = () => {
    setIsRegistering(true)
    router.post(`/events/${event.id}/register`, {}, {
      onSuccess: () => {
        setShowRegisterModal(false)
        setIsRegistering(false)
      },
      onError: () => {
        setIsRegistering(false)
      },
    })
  }

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited)
    // TODO: Implement favorite functionality
  }

  const shareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: event.name,
        text: event.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      // Show toast notification
    }
  }

  const getRegistrationButton = () => {
    if (isRegistered) {
      return (
        <Button
          variant="success"
          size="lg"
          iconLeft={CheckCircleIcon}
          href={`/registrations/${registration?.id}`}
        >
          Voir mon inscription
        </Button>
      )
    }

    if (!event.canRegister) {
      if (event.isFull) {
        return (
          <Button variant="outline" size="lg" disabled iconLeft={XCircleIcon}>
            Complet
          </Button>
        )
      }
      if (event.isFinished) {
        return (
          <Button variant="outline" size="lg" disabled>
            Événement terminé
          </Button>
        )
      }
      return (
        <Button variant="outline" size="lg" disabled>
          Inscriptions fermées
        </Button>
      )
    }

    return (
      <Button
        variant="gradient"
        size="lg"
        onClick={handleRegister}
      >
        S'inscrire maintenant
      </Button>
    )
  }

  const getEventStatusBadge = () => {
    if (event.isOngoing) {
      return <Badge variant="info" dot pulse size="lg">En cours</Badge>
    }
    if (event.isUpcoming) {
      return <Badge variant="success" dot size="lg">À venir</Badge>
    }
    if (event.isFinished) {
      return <Badge variant="neutral" size="lg">Terminé</Badge>
    }
    return null
  }

  const getPriceDisplay = () => {
    if (event.basePrice === 0) {
      return <Badge variant="success" size="lg">Gratuit</Badge>
    }

    if (userAge && event.youthPrice && userAge < 26) {
      return (
        <div>
          <p className="text-3xl font-bold text-primary-600">
            {formatCurrency(event.youthPrice)}
          </p>
          <p className="text-sm text-neutral-600">Tarif jeune</p>
        </div>
      )
    }

    if (userAge && event.seniorPrice && userAge >= 60) {
      return (
        <div>
          <p className="text-3xl font-bold text-primary-600">
            {formatCurrency(event.seniorPrice)}
          </p>
          <p className="text-sm text-neutral-600">Tarif senior</p>
        </div>
      )
    }

    return (
      <div>
        <p className="text-3xl font-bold text-primary-600">
          {formatCurrency(event.basePrice)}
        </p>
        <p className="text-sm text-neutral-600">Tarif normal</p>
      </div>
    )
  }

  return (
    <>
      <Head title={event.name} />
      <AppLayout>
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            iconLeft={ArrowIcon}
            onClick={() => router.visit('/events')}
          >
            Retour aux événements
          </Button>
        </div>

        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] mb-8">
          <Image
            src={event.imageUrl || getPlaceholder('event')}
            alt={event.name}
            aspectRatio="auto"
            objectFit="cover"
            className="absolute inset-0 w-full h-full"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  {getEventStatusBadge()}
                  <Badge variant="primary" size="lg">{event.category}</Badge>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {event.name}
                </h1>
                <div className="flex flex-wrap gap-4 text-white/90">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    <span>{formatDate(event.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-5 h-5" />
                    <span>{event.commune}, {event.province}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UsersIcon className="w-5 h-5" />
                    <span>{event.availableSeats} places disponibles</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                    Description
                  </h2>
                  <div className="prose prose-neutral max-w-none">
                    <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                      {event.description}
                    </p>
                  </div>
                </Card>
              </motion.div>

              {/* Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                    Informations pratiques
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <CalendarIcon className="w-6 h-6 text-primary-600 mt-1" />
                      <div>
                        <p className="font-semibold text-neutral-900 mb-1">Début</p>
                        <p className="text-neutral-600">{formatDateTime(event.startDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CalendarIcon className="w-6 h-6 text-primary-600 mt-1" />
                      <div>
                        <p className="font-semibold text-neutral-900 mb-1">Fin</p>
                        <p className="text-neutral-600">{formatDateTime(event.endDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPinIcon className="w-6 h-6 text-primary-600 mt-1" />
                      <div>
                        <p className="font-semibold text-neutral-900 mb-1">Lieu</p>
                        <p className="text-neutral-600">{event.location}</p>
                        <p className="text-sm text-neutral-500">{event.commune}, {event.province}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <UsersIcon className="w-6 h-6 text-primary-600 mt-1" />
                      <div>
                        <p className="font-semibold text-neutral-900 mb-1">Capacité</p>
                        <p className="text-neutral-600">
                          {event.registeredCount} / {event.capacity} inscrits
                        </p>
                        <div className="w-full bg-neutral-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full transition-all"
                            style={{ width: `${(event.registeredCount / event.capacity) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Age Requirements */}
                  {(event.minAge || event.maxAge) && (
                    <div className="mt-6 pt-6 border-t border-neutral-200">
                      <h3 className="font-semibold text-neutral-900 mb-2">
                        Conditions d'âge
                      </h3>
                      <p className="text-neutral-600">
                        {event.maxAge
                          ? `De ${event.minAge} à ${event.maxAge} ans`
                          : `${event.minAge} ans et plus`}
                      </p>
                    </div>
                  )}

                  {/* Registration Period */}
                  {(event.registrationStartDate || event.registrationEndDate) && (
                    <div className="mt-6 pt-6 border-t border-neutral-200">
                      <h3 className="font-semibold text-neutral-900 mb-2">
                        Période d'inscription
                      </h3>
                      <p className="text-neutral-600">
                        {event.registrationStartDate && (
                          <span>Du {formatDate(event.registrationStartDate)} </span>
                        )}
                        {event.registrationEndDate && (
                          <span>au {formatDate(event.registrationEndDate)}</span>
                        )}
                      </p>
                    </div>
                  )}
                </Card>
              </motion.div>

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                      Tags
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag) => (
                        <Badge key={tag} variant="neutral" size="lg">
                          <TagIcon className="w-4 h-4 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Registration Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card variant="elevated" className="sticky top-8">
                  <div className="text-center mb-6">
                    {getPriceDisplay()}
                  </div>

                  {event.requiresApproval && !isRegistered && (
                    <Alert type="info" className="mb-4">
                      Cette inscription nécessite une validation
                    </Alert>
                  )}

                  {getRegistrationButton()}

                  <div className="flex gap-2 mt-4">
                    <Button