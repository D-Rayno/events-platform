import { Head, router } from '@inertiajs/react'
import { useState, useRef } from 'react'
import { motion } from 'motion/react'
import {
  ArrowLeftIcon,
  QrCodeIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import AppLayout from '~/components/layouts/AppLayout'
import Card from '~/components/ui/Card'
import Button from '~/components/ui/Button'
import Badge from '~/components/ui/Badge'
import Image from '~/components/ui/Image'
import Modal from '~/components/ui/Modal'
import Alert from '~/components/ui/Alert'
import { useRouteGuard } from '~/hooks/useRouteGuard'
import { useTheme } from '~/hooks/useTheme'
import { formatDate, formatDateTime } from '~/lib/utils'

interface Event {
  id: number
  name: string
  description: string
  location: string
  province: string
  commune: string
  startDate: string
  endDate: string
  imageUrl: string | null
  category: string
  status: string
}

interface Registration {
  id: number
  status: 'pending' | 'confirmed' | 'attended' | 'canceled'
  qrCode: string
  qrCodeImage: string
  attendedAt: string | null
  createdAt: string
  event: Event
}

interface Props {
  registration: Registration
}

export default function RegistrationShow({ registration }: Props) {
  useRouteGuard({ requiresAuth: true, requiresVerification: true })

  const { getPlaceholder } = useTheme()
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [isCanceling, setIsCanceling] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)

  const canCancel =
    (registration.status === 'confirmed' || registration.status === 'pending') &&
    new Date(registration.event.startDate) > new Date()

  const getStatusInfo = () => {
    const statusMap = {
      pending: {
        icon: ClockIcon,
        variant: 'warning' as const,
        text: 'En attente',
        description: 'Votre inscription est en attente de validation',
      },
      confirmed: {
        icon: CheckCircleIcon,
        variant: 'success' as const,
        text: 'Confirmé',
        description: 'Votre inscription est confirmée',
      },
      attended: {
        icon: CheckCircleIcon,
        variant: 'info' as const,
        text: 'Présent',
        description: 'Vous avez assisté à cet événement',
      },
      canceled: {
        icon: XCircleIcon,
        variant: 'neutral' as const,
        text: 'Annulé',
        description: 'Cette inscription a été annulée',
      },
    }
    return statusMap[registration.status]
  }

  const handleCancel = () => {
    setIsCanceling(true)
    router.delete(`/registrations/${registration.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        setShowCancelModal(false)
        setIsCanceling(false)
        router.visit('/registrations')
      },
      onError: () => {
        setIsCanceling(false)
      },
    })
  }

  const handleResendQR = () => {
    setIsResending(true)
    router.post(
      `/registrations/${registration.id}/resend-qr`,
      {},
      {
        preserveScroll: true,
        onFinish: () => setIsResending(false),
      }
    )
  }

  const handleDownloadQR = () => {
    const link = document.createElement('a')
    link.href = registration.qrCodeImage
    link.download = `qr-code-${registration.event.name.replace(/\s+/g, '-')}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePrint = () => {
    window.print()
  }

  const statusInfo = getStatusInfo()
  const StatusIcon = statusInfo.icon

  return (
    <>
      <Head title={`Inscription - ${registration.event.name}`} />
      <AppLayout>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button variant="ghost" iconLeft={ArrowLeftIcon} href="/registrations">
              Retour à mes inscriptions
            </Button>
          </motion.div>

          {/* Status Alert */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Alert
              type={
                statusInfo.variant === 'success'
                  ? 'success'
                  : statusInfo.variant === 'warning'
                    ? 'warning'
                    : statusInfo.variant === 'info'
                      ? 'info'
                      : 'error'
              }
            >
              <div className="flex items-center gap-3">
                <StatusIcon className="w-6 h-6" />
                <div>
                  <p className="font-semibold">{statusInfo.text}</p>
                  <p className="text-sm">{statusInfo.description}</p>
                </div>
              </div>
            </Alert>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Card>
                  <div className="flex gap-6">
                    <div className="w-32 shrink-0">
                      <Image
                        src={registration.event.imageUrl || getPlaceholder('event')}
                        alt={registration.event.name}
                        aspectRatio="1/1"
                        rounded="lg"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <Badge variant="primary" className="mb-2">
                            {registration.event.category}
                          </Badge>
                          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                            {registration.event.name}
                          </h1>
                        </div>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3 text-neutral-700">
                          <CalendarIcon className="w-5 h-5 text-primary-600" />
                          <span>{formatDateTime(registration.event.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-neutral-700">
                          <MapPinIcon className="w-5 h-5 text-primary-600" />
                          <span>
                            {registration.event.location}, {registration.event.province}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-neutral-700">
                          <ClockIcon className="w-5 h-5 text-primary-600" />
                          <span>Inscrit le {formatDateTime(registration.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <Button
                          variant="outline"
                          size="sm"
                          href={`/events/${registration.event.id}`}
                        >
                          Voir l'événement
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* QR Code Section */}
              {(registration.status === 'confirmed' || registration.status === 'pending') && (
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

                    <div className="bg-neutral-50 rounded-xl p-8 text-center" ref={qrRef}>
                      <motion.div
                        className="inline-block bg-white p-6 rounded-2xl shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <img
                          src={registration.qrCodeImage}
                          alt="QR Code"
                          className="w-64 h-64 mx-auto"
                        />
                      </motion.div>

                      <p className="text-sm text-neutral-600 mt-6 max-w-md mx-auto">
                        Présentez ce QR code à l'entrée de l'événement pour confirmer votre
                        présence
                      </p>

                      <div className="flex flex-wrap justify-center gap-3 mt-6">
                        <Button
                          variant="primary"
                          iconLeft={ArrowDownTrayIcon}
                          onClick={handleDownloadQR}
                        >
                          Télécharger
                        </Button>
                        <Button variant="outline" iconLeft={PrinterIcon} onClick={handlePrint}>
                          Imprimer
                        </Button>
                        <Button
                          variant="outline"
                          iconLeft={EnvelopeIcon}
                          loading={isResending}
                          disabled={isResending}
                          onClick={handleResendQR}
                        >
                          Renvoyer par email
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Important Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <Card>
                  <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                    <ExclamationTriangleIcon className="w-6 h-6 text-warning-600" />
                    Informations importantes
                  </h3>

                  <ul className="space-y-3 text-neutral-700">
                    <li className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-success-600 mt-0.5 shrink-0" />
                      <span>
                        Arrivez 15 minutes avant le début de l'événement pour l'enregistrement
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-success-600 mt-0.5 shrink-0" />
                      <span>Assurez-vous que votre QR code est lisible (téléchargé ou imprimé)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-success-600 mt-0.5 shrink-0" />
                      <span>
                        En cas d'empêchement, annulez votre inscription pour libérer votre place
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-success-600 mt-0.5 shrink-0" />
                      <span>
                        Munissez-vous d'une pièce d'identité pour vérification si nécessaire
                      </span>
                    </li>
                  </ul>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
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

                    {registration.attendedAt && (
                      <div className="pt-4 border-t border-neutral-200">
                        <p className="text-sm text-neutral-600 mb-1">Présence confirmée le</p>
                        <p className="font-semibold text-neutral-900">
                          {formatDateTime(registration.attendedAt)}
                        </p>
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
                      onClick={() => setShowCancelModal(true)}
                      className="text-error-600 border-error-600 hover:bg-error-50"
                    >
                      Annuler l'inscription
                    </Button>
                    <p className="text-xs text-neutral-500 mt-3">
                      Vous pouvez annuler votre inscription jusqu'au début de l'événement
                    </p>
                  </Card>
                )}

                {/* Help Card */}
                <Card>
                  <h3 className="text-lg font-bold text-neutral-900 mb-3">Besoin d'aide ?</h3>
                  <p className="text-sm text-neutral-600 mb-4">
                    Si vous rencontrez un problème avec votre inscription, contactez-nous.
                  </p>
                  <Button variant="outline" fullWidth href="mailto:support@eventhub.dz">
                    Contacter le support
                  </Button>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Cancel Modal */}
        <Modal
          show={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          title="Annuler l'inscription"
          maxWidth="md"
          footer={
            <div className="flex gap-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowCancelModal(false)}
                disabled={isCanceling}
              >
                Garder l'inscription
              </Button>
              <Button
                variant="danger"
                fullWidth
                loading={isCanceling}
                disabled={isCanceling}
                onClick={handleCancel}
              >
                Confirmer l'annulation
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Alert type="warning">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="w-5 h-5 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Attention</p>
                  <p className="text-sm">
                    Cette action est irréversible. Vous devrez vous réinscrire si vous changez
                    d'avis.
                  </p>
                </div>
              </div>
            </Alert>

            <p className="text-neutral-700">
              Êtes-vous sûr de vouloir annuler votre inscription à{' '}
              <strong>{registration.event.name}</strong> ?
            </p>

            <div className="bg-neutral-50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Événement</span>
                <span className="font-semibold">{registration.event.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Date</span>
                <span className="font-semibold">
                  {formatDate(registration.event.startDate)}
                </span>
              </div>
            </div>
          </div>
        </Modal>

        {/* Print Styles */}
        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            ${qrRef.current ? '#qr-section, #qr-section *' : ''} {
              visibility: visible;
            }
            #qr-section {
              position: absolute;
              left: 0;
              top: 0;
            }
          }
        `}</style>
      </AppLayout>
    </>
  )
}