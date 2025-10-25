// inertia/components/registrations/QR.tsx
import { useRef } from 'react'
import { motion } from 'motion/react'
import {
  QrCodeIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline'
import Card from '~/components/ui/Card'
import Button from '~/components/ui/Button'

interface RegistrationQRProps {
  qrCodeImage: string
  eventName: string
  isResending: boolean
  onDownload: () => void
  onPrint: () => void
  onResend: () => void
}

export default function RegistrationQR({
  qrCodeImage,
  eventName,
  isResending,
  onDownload,
  onPrint,
  onResend,
}: RegistrationQRProps) {
  const qrRef = useRef<HTMLDivElement>(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card>
        <h2 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
          <QrCodeIcon className="w-7 h-7 text-primary-600" />
          Votre QR Code
        </h2>

        <div className="bg-neutral-50 rounded-xl p-8 text-center" ref={qrRef} id="qr-section">
          <motion.div
            className="inline-block bg-white p-6 rounded-2xl shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <img src={qrCodeImage} alt="QR Code" className="w-64 h-64 mx-auto" />
          </motion.div>

          <p className="text-sm text-neutral-600 mt-6 max-w-md mx-auto">
            Présentez ce QR code à l'entrée de l'événement pour confirmer votre présence
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Button variant="primary" iconLeft={ArrowDownTrayIcon} onClick={onDownload}>
              Télécharger
            </Button>
            <Button variant="outline" iconLeft={PrinterIcon} onClick={onPrint}>
              Imprimer
            </Button>
            <Button
              variant="outline"
              iconLeft={EnvelopeIcon}
              loading={isResending}
              disabled={isResending}
              onClick={onResend}
            >
              Renvoyer par email
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
