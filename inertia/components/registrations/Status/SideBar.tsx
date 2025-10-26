// inertia/components/registrations/Status.tsx
import { motion } from 'motion/react'
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon as PendingIcon,
} from '@heroicons/react/24/outline'
import Card from '~/components/ui/Card'
import Button from '~/components/ui/Button'
import Badge from '~/components/ui/Badge'
import RegistrationHelp from '~/components/registrations/Help'
import { formatDateTime } from '~/lib/utils'

interface RegistrationStatusSidebarProps {
  status: 'pending' | 'confirmed' | 'attended' | 'canceled'
  attendedAt: string | null
  canCancel: boolean
  onCancelClick: () => void
}

export default function RegistrationStatusSidebar({
  status,
  attendedAt,
  canCancel,
  onCancelClick,
}: RegistrationStatusSidebarProps) {
  const getStatusInfo = () => {
    const statusMap = {
      pending: {
        icon: PendingIcon,
        variant: 'warning' as const,
        text: 'En attente',
      },
      confirmed: {
        icon: CheckCircleIcon,
        variant: 'success' as const,
        text: 'Confirmé',
      },
      attended: {
        icon: CheckCircleIcon,
        variant: 'info' as const,
        text: 'Présent',
      },
      canceled: {
        icon: XCircleIcon,
        variant: 'neutral' as const,
        text: 'Annulé',
      },
    }
    return statusMap[status]
  }

  const statusInfo = getStatusInfo()
  const StatusIcon = statusInfo.icon

  return (
    <motion.div
      className="sticky top-24 space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      {/* Status Card */}
      <Card>
        <h3 className="text-lg font-bold text-neutral-900 mb-4">Statut</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-neutral-600">État</span>
            <Badge variant={statusInfo.variant} size="lg">
              <StatusIcon className="w-4 h-4 mr-1" />
              {statusInfo.text}
            </Badge>
          </div>

          {attendedAt && (
            <div className="pt-4 border-t border-neutral-200">
              <p className="text-sm text-neutral-600 mb-1">Présence confirmée le</p>
              <p className="font-semibold text-neutral-900">{formatDateTime(attendedAt)}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Actions Card */}
      {canCancel && (
        <Card>
          <h3 className="text-lg font-bold text-neutral-900 mb-4">Actions</h3>
          <Button
            variant="outline"
            fullWidth
            iconLeft={XCircleIcon}
            onClick={onCancelClick}
          >
            Annuler l'inscription
          </Button>
          <p className="text-xs text-neutral-500 mt-3">
            Vous pouvez annuler votre inscription jusqu'au début de l'événement
          </p>
        </Card>
      )}

      {/* Help Card */}
      <RegistrationHelp />
    </motion.div>
  )
}