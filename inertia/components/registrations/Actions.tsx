// inertia/components/registrations/Actions.tsx
import { motion } from 'motion/react'
import { XCircleIcon } from '@heroicons/react/24/outline'
import Card from '~/components/ui/Card'
import Button from '~/components/ui/Button'

interface RegistrationActionsProps {
  canCancel: boolean
  onCancelClick: () => void
}

export default function RegistrationActions({
  canCancel,
  onCancelClick,
}: RegistrationActionsProps) {
  if (!canCancel) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card>
        <h3 className="text-lg font-bold text-neutral-900 mb-4">Actions</h3>
        <Button
          variant="outline"
          fullWidth
          iconLeft={XCircleIcon}
          onClick={onCancelClick}
          className="text-error-600 border-error-600 hover:bg-error-50"
        >
          Annuler l'inscription
        </Button>
        <p className="text-xs text-neutral-500 mt-3">
          Vous pouvez annuler votre inscription jusqu'au début de l'événement
        </p>
      </Card>
    </motion.div>
  )
}
