// inertia/components/registrations/StatusAlert.tsx
import { motion } from 'motion/react'
import Alert from '~/components/ui/Alert'

interface StatusInfo {
  variant: 'success' | 'warning' | 'info' | 'error'
  text: string
  description: string
}

interface RegistrationStatusAlertProps {
  statusInfo: StatusInfo
}

export default function RegistrationStatusAlert({ statusInfo }: RegistrationStatusAlertProps) {
  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Alert type={statusInfo.variant}>
        <div>
          <p className="font-semibold">{statusInfo.text}</p>
          <p className="text-sm">{statusInfo.description}</p>
        </div>
      </Alert>
    </motion.div>
  )
}