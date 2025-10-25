// inertia/components/registrations/Cancel.tsx
import Modal from '~/components/ui/Modal'
import Button from '~/components/ui/Button'
import Alert from '~/components/ui/Alert'
import { formatDate } from '~/lib/utils'

interface Event {
  id: number
  name: string
  startDate: string
}

interface RegistrationCancelModalProps {
  show: boolean
  event: Event
  isCanceling: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function RegistrationCancelModal({
  show,
  event,
  isCanceling,
  onClose,
  onConfirm,
}: RegistrationCancelModalProps) {
  return (
    <Modal
      show={show}
      onClose={onClose}
      title="Annuler l'inscription"
      maxWidth="md"
      footer={
        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={onClose} disabled={isCanceling}>
            Garder l'inscription
          </Button>
          <Button
            variant="danger"
            fullWidth
            loading={isCanceling}
            disabled={isCanceling}
            onClick={onConfirm}
          >
            Confirmer l'annulation
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Alert type="warning">
          <div>
            <p className="font-semibold mb-1">Attention</p>
            <p className="text-sm">
              Cette action est irréversible. Vous devrez vous réinscrire si vous changez d'avis.
            </p>
          </div>
        </Alert>

        <p className="text-neutral-700">
          Êtes-vous sûr de vouloir annuler votre inscription à <strong>{event.name}</strong> ?
        </p>

        <div className="bg-neutral-50 rounded-xl p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-600">Événement</span>
            <span className="font-semibold">{event.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">Date</span>
            <span className="font-semibold">{formatDate(event.startDate)}</span>
          </div>
        </div>
      </div>
    </Modal>
  )
}
