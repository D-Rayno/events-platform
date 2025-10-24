import { Head, router } from '@inertiajs/react'
import { useState } from 'react'
import { motion } from 'motion/react'
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
  ExclamationTriangleIcon,
  TrophyIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import AppLayout from '~/components/layouts/AppLayout'
import Card from '~/components/ui/Card'
import Button from '~/components/ui/Button'
import Badge from '~/components/ui/Badge'
import Image from '~/components/ui/Image'
import Modal from '~/components/ui/Modal'
import Alert from '~/components/ui/Alert'
import { useTheme } from '~/hooks/useTheme'
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
  tags?: string[]
  basePrice: number
  youthPrice?: number
  seniorPrice?: number
  minAge: number
  maxAge?: number
  status: string
  requiresApproval: boolean
  registrationStartDate?: string
  registrationEndDate?: string
  isFull: boolean
  canRegister: boolean
  isUpcoming: boolean
  isOngoing: boolean
  isFinished: boolean
  eventType?: string
  gameType?: string
  difficulty?: string
  durationMinutes?: number
  physicalIntensity?: string
  allowsTeams?: boolean
  teamRegistration?: string
  minTeamSize?: number
  maxTeamSize?: number
  prizeInformation?: string
  requiredItems?: string[]
  prohibitedItems?: string[]
  safetyRequirements?: string[]
  specialInstructions?: string
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
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const isAgeEligible = userAge
    ? userAge >= event.minAge && (!event.maxAge || userAge <= event.maxAge)
    : true

  const handleRegister = () => {
    if (!userAge) {
      router.visit('/auth/login')
      return
    }

    if (!isAgeEligible) {
      return
    }

    setIsRegistering(true)
    router.post(
      `/events/${event.id}/register`,
      {},
      {
        preserveScroll: true,
        onSuccess: () => {
          setShowRegisterModal(false)
          setIsRegistering(false)
        },
        onError: () => {
          setIsRegistering(false)
        },
      }
    )
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.name,
          text: event.description,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Lien copié dans le presse-papiers !')
    }
  }

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

  const getDifficultyBadge = () => {
    if (!event.difficulty) return null
    const colors = {
      easy: 'success' as const,
      medium: 'warning' as const,
      hard: 'error' as const,
      extreme: 'error' as const,
    }
    const labels = {
      easy: 'Facile',
      medium: 'Moyen',
      hard: 'Difficile',
      extreme: 'Extrême',
    }
    return (
      <Badge variant={colors[event.difficulty as keyof typeof colors]} size="lg">
        {labels[event.difficulty as keyof typeof labels]}
      </Badge>
    )
  }

  return (
    <>
      <Head title={event.name} />
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button variant="ghost" iconLeft={ArrowLeftIcon} href="/events">
              Retour aux événements
            </Button>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card padding="none" className="overflow-hidden">
                  <div className="relative">
                    <Image
                      src={event.imageUrl || getPlaceholder('event')}
                      alt={event.name}
                      aspectRatio="16/9"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      {getStatusBadge()}
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

              {/* Event Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Card>
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <Badge variant="primary" size="lg">
                          {event.category}
                        </Badge>
                        {event.gameType && (
                          <Badge variant="secondary" size="lg">
                            {event.gameType}
                          </Badge>
                        )}
                        {getDifficultyBadge()}
                      </div>
                      <h1 className="text-4xl font-bold text-neutral-900 mb-4">{event.name}</h1>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        iconLeft={isFavorite ? HeartSolidIcon : HeartIcon}
                        onClick={() => setIsFavorite(!isFavorite)}
                        className={isFavorite ? 'text-error-600 border-error-600' : ''}
                      >
                        {isFavorite ? 'Sauvegardé' : 'Sauvegarder'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        iconLeft={ShareIcon}
                        onClick={handleShare}
                      >
                        Partager
                      </Button>
                    </div>
                  </div>

                  <div className="prose max-w-none text-neutral-700 mb-6">
                    <p className="text-lg leading-relaxed">{event.description}</p>
                  </div>

                  {/* Key Info Grid */}
                  <div className="grid sm:grid-cols-2 gap-4 p-6 bg-neutral-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <CalendarIcon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-700">Date de début</p>
                        <p className="text-neutral-900">{formatDateTime(event.startDate)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                        <ClockIcon className="w-5 h-5 text-secondary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-700">Date de fin</p>
                        <p className="text-neutral-900">{formatDateTime(event.endDate)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                        <MapPinIcon className="w-5 h-5 text-success-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-700">Lieu</p>
                        <p className="text-neutral-900">
                          {event.commune}, {event.province}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-info-100 rounded-lg flex items-center justify-center">
                        <UsersIcon className="w-5 h-5 text-info-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-700">Places disponibles</p>
                        <p className="text-neutral-900">
                          {event.availableSeats} / {event.capacity}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Game-specific Info */}
              {event.eventType === 'game' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <Card>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
                      <TrophyIcon className="w-7 h-7 text-primary-600" />
                      Informations du jeu
                    </h2>

                    <div className="space-y-6">
                      {event.durationMinutes && (
                        <div>
                          <p className="text-sm font-semibold text-neutral-700 mb-2">Durée</p>
                          <p className="text-neutral-900">{event.durationMinutes} minutes</p>
                        </div>
                      )}

                      {event.physicalIntensity && (
                        <div>
                          <p className="text-sm font-semibold text-neutral-700 mb-2">
                            Intensité physique
                          </p>
                          <Badge
                            variant={
                              event.physicalIntensity === 'high'
                                ? 'error'
                                : event.physicalIntensity === 'medium'
                                  ? 'warning'
                                  : 'success'
                            }
                          >
                            {event.physicalIntensity === 'high'
                              ? 'Intense'
                              : event.physicalIntensity === 'medium'
                                ? 'Modérée'
                                : 'Faible'}
                          </Badge>
                        </div>
                      )}

                      {event.allowsTeams && (
                        <div>
                          <p className="text-sm font-semibold text-neutral-700 mb-2">Équipes</p>
                          <p className="text-neutral-900">
                            {event.minTeamSize} à {event.maxTeamSize} joueurs par équipe
                          </p>
                        </div>
                      )}

                      {event.prizeInformation && (
                        <div>
                          <p className="text-sm font-semibold text-neutral-700 mb-2">Récompenses</p>
                          <p className="text-neutral-900">{event.prizeInformation}</p>
                        </div>
                      )}

                      {event.requiredItems && event.requiredItems.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-neutral-700 mb-2">
                            Objets requis
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {event.requiredItems.map((item) => (
                              <Badge key={item} variant="info">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {event.prohibitedItems && event.prohibitedItems.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-neutral-700 mb-2">
                            Objets interdits
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {event.prohibitedItems.map((item) => (
                              <Badge key={item} variant="error">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Safety Requirements */}
              {event.safetyRequirements && event.safetyRequirements.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <Card>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
                      <ShieldCheckIcon className="w-7 h-7 text-success-600" />
                      Consignes de sécurité
                    </h2>
                    <ul className="space-y-3">
                      {event.safetyRequirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircleIcon className="w-5 h-5 text-success-600 mt-0.5 shrink-0" />
                          <span className="text-neutral-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </motion.div>
              )}

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <Card>
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
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                className="sticky top-24 space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {/* Registration Card */}
                <Card>
                  <h3 className="text-xl font-bold text-neutral-900 mb-4">Inscription</h3>

                  {/* Price */}
                  <div className="mb-6">
                    {event.basePrice > 0 ? (
                      <div className="space-y-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-primary-600">
                            {formatCurrency(event.basePrice)}
                          </span>
                          <span className="text-neutral-600">par personne</span>
                        </div>
                        {event.youthPrice && (
                          <p className="text-sm text-neutral-600">
                            Jeunes (-26 ans) : {formatCurrency(event.youthPrice)}
                          </p>
                        )}
                        {event.seniorPrice && (
                          <p className="text-sm text-neutral-600">
                            Seniors (60+ ans) : {formatCurrency(event.seniorPrice)}
                          </p>
                        )}
                      </div>
                    ) : (
                      <Badge variant="success" size="lg">
                        Gratuit
                      </Badge>
                    )}
                  </div>

                  {/* Age Restriction Alert */}
                  {!isAgeEligible && userAge && (
                    <Alert type="error">
                      Cet événement est réservé aux personnes de {event.minAge}{' '}
                      {event.maxAge ? `à ${event.maxAge}` : 'ans et plus'}.
                    </Alert>
                  )}

                  {/* Registration Status */}
                  {isRegistered ? (
                    <div className="space-y-3">
                      <Alert type="success">
                        <div className="flex items-center gap-2">
                          <CheckCircleIcon className="w-5 h-5" />
                          <span className="font-semibold">Vous êtes inscrit !</span>
                        </div>
                      </Alert>
                      <Button
                        variant="outline"
                        fullWidth
                        href={`/registrations/${registration?.id}`}
                      >
                        Voir mon inscription
                      </Button>
                    </div>
                  ) : event.isFull ? (
                    <Alert type="warning">
                      <div className="flex items-center gap-2">
                        <XCircleIcon className="w-5 h-5" />
                        <span className="font-semibold">Complet</span>
                      </div>
                    </Alert>
                  ) : event.canRegister && isAgeEligible ? (
                    <Button
                      variant="gradient"
                      size="lg"
                      fullWidth
                      onClick={() => setShowRegisterModal(true)}
                    >
                      S'inscrire maintenant
                    </Button>
                  ) : (
                    <Button variant="outline" size="lg" fullWidth disabled>
                      Inscriptions fermées
                    </Button>
                  )}

                  {/* Registration Info */}
                  {event.requiresApproval && (
                    <p className="text-sm text-neutral-600 mt-4">
                      <ExclamationTriangleIcon className="w-4 h-4 inline mr-1" />
                      L'inscription nécessite une approbation
                    </p>
                  )}
                </Card>

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
              </motion.div>
            </div>
          </div>
        </div>

        {/* Registration Confirmation Modal */}
        <Modal
          show={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          title="Confirmer l'inscription"
          maxWidth="md"
          footer={
            <div className="flex gap-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowRegisterModal(false)}
                disabled={isRegistering}
              >
                Annuler
              </Button>
              <Button
                variant="primary"
                fullWidth
                loading={isRegistering}
                disabled={isRegistering}
                onClick={handleRegister}
              >
                Confirmer l'inscription
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <p className="text-neutral-700">
              Vous êtes sur le point de vous inscrire à l'événement <strong>{event.name}</strong>.
            </p>

            <div className="bg-neutral-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Date</span>
                <span className="font-semibold">{formatDate(event.startDate)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Lieu</span>
                <span className="font-semibold">
                  {event.commune}, {event.province}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Prix</span>
                <span className="font-semibold text-primary-600">
                  {event.basePrice > 0 ? formatCurrency(event.basePrice) : 'Gratuit'}
                </span>
              </div>
            </div>

            {event.requiresApproval && (
              <Alert type="info">
                Votre inscription sera soumise à validation par les organisateurs.
              </Alert>
            )}
          </div>
        </Modal>
      </AppLayout>
    </>
  )
}
