// inertia/pages/events/show.tsx - REFACTORED WITH COMPONENTS
import { Head, router } from '@inertiajs/react'
import { useState } from 'react'
import AppLayout from '~/components/layouts/AppLayout'
import Modal from '~/components/ui/Modal'
import Button from '~/components/ui/Button'
import Alert from '~/components/ui/Alert'
import EventHeader from '~/components/events/Header'
import EventDetails from '~/components/events/Details'
import EventGameInfo from '~/components/events/GameInfo'
import RegistrationCard from '~/components/events/EventRegistrationCard'
import EventInfo from '~/components/events/Info'
import SimilarEvents from '~/components/events/Similar'
import { formatDate, formatCurrency } from '~/lib/utils'
import type { Event, Registration, SimilarEvent } from '~/types/event'

interface Props {
  event: Event
  registration: Registration | null
  isRegistered: boolean
  userAge?: number
  similarEvents?: SimilarEvent[]
}

export default function EventShow({ 
  event, 
  registration, 
  isRegistered, 
  userAge, 
  similarEvents = [] 
}: Props) {
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

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

  return (
    <>
      <Head title={event.name} />
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Event Header */}
          <EventHeader
            event={event}
            isRegistered={isRegistered}
            onShare={handleShare}
          />

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event Details */}
              <EventDetails event={event} />

              {/* Game-specific Information */}
              {event.eventType === 'game' && (
                <EventGameInfo gameInfo={event} />
              )}

              {/* Similar Events */}
              {similarEvents.length > 0 && (
                <SimilarEvents similarEvents={similarEvents} />
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Registration Card */}
                <RegistrationCard
                  event={event}
                  registration={registration}
                  isRegistered={isRegistered}
                  userAge={userAge}
                  onRegisterClick={() => setShowRegisterModal(true)}
                />

                {/* Event Info */}
                <EventInfo event={event} />
              </div>
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

            <div className="bg-linear-to-br from-neutral-50 to-primary-50 rounded-xl p-4 space-y-2">
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
                  {userAge && event.userPrice !== undefined
                    ? formatCurrency(event.userPrice)
                    : event.basePrice > 0
                      ? formatCurrency(event.basePrice)
                      : 'Gratuit'}
                </span>
              </div>
            </div>

            {!!event.requiresApproval && (
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