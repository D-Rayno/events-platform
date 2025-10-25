// inertia/components/events/RegistrationCard.tsx
import { BoltIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import Card from '~/components/ui/Card'
import Button from '~/components/ui/Button'
import Badge from '~/components/ui/Badge'
import Alert from '~/components/ui/Alert'
import { formatCurrency } from '~/lib/utils'
import type { Event, Registration } from '~/types/event'

interface RegistrationCardProps {
  event: Event
  registration: Registration | null
  isRegistered: boolean
  userAge?: number
  onRegisterClick: () => void
}

export default function RegistrationCard({
  event,
  registration,
  isRegistered,
  userAge,
  onRegisterClick,
}: RegistrationCardProps) {
  const isAgeEligible = userAge
    ? userAge >= event.minAge && (!event.maxAge || userAge <= event.maxAge)
    : true

  return (
    <Card variant="elevated">
      <h3 className="text-xl font-bold text-neutral-900 mb-4">Inscription</h3>
      
      {/* Price Display */}
      <div className="mb-6">
        {event.basePrice > 0 ? (
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary-600">
                {userAge && event.userPrice !== undefined
                  ? formatCurrency(event.userPrice)
                  : formatCurrency(event.basePrice)}
              </span>
              <span className="text-neutral-600">par personne</span>
            </div>
            {event.youthPrice && (
              <p className="text-sm text-neutral-600">
                👤 Jeunes (-26 ans) : {formatCurrency(event.youthPrice)}
              </p>
            )}
            {event.seniorPrice && (
              <p className="text-sm text-neutral-600">
                👴 Seniors (60+ ans) : {formatCurrency(event.seniorPrice)}
              </p>
            )}
          </div>
        ) : (
          <Badge variant="success" size="lg">
            💚 Gratuit
          </Badge>
        )}
      </div>

      {/* Age Restriction Warning */}
      {!isAgeEligible && userAge && (
        <Alert type="error">
          Cet événement est réservé aux personnes de {event.minAge}{' '}
          {event.maxAge ? `à ${event.maxAge}` : 'ans et plus'}.
        </Alert>
      )}

      {/* Registration Actions */}
      {isRegistered ? (
        <div className="space-y-3">
          <Alert type="success">
            <CheckCircleIcon className="w-5 h-5 mr-2" />
            <span className="font-semibold">Vous êtes inscrit !</span>
          </Alert>
          <Button variant="outline" fullWidth href={`/registrations/${registration?.id}`}>
            Voir mon inscription
          </Button>
        </div>
      ) : event.isFull ? (
        <Alert type="warning">
          <span className="font-semibold">🚫 Complet</span>
        </Alert>
      ) : event.canRegister && isAgeEligible ? (
        <Button
          variant="gradient"
          size="lg"
          fullWidth
          onClick={onRegisterClick}
          iconLeft={BoltIcon}
        >
          S'inscrire maintenant
        </Button>
      ) : (
        <Button variant="outline" size="lg" fullWidth disabled>
          Inscriptions fermées
        </Button>
      )}

      {/* Approval Notice */}
      {!!event.requiresApproval && (
        <p className="text-sm text-neutral-600 mt-4 flex items-center gap-2">
          <ExclamationTriangleIcon className="w-4 h-4" />
          L'inscription nécessite une approbation
        </p>
      )}
    </Card>
  )
}