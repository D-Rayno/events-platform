// inertia/pages/registrations/show.tsx - REFACTORED WITH COMPONENTS
import { Head, router } from '@inertiajs/react'
import { useState, useRef } from 'react'
import AppLayout from '~/components/layouts/AppLayout'
import { useRouteGuard } from '~/hooks/useRouteGuard'

// Import registration components
import RegistrationHeader from '~/components/registrations/Header'
import RegistrationStatusAlert from '~/components/registrations/Status/Alert'
import RegistrationEventInfo from '~/components/registrations/EventInfo'
import RegistrationQR from '~/components/registrations/QR'
import RegistrationInfo from '~/components/registrations/Info'
import RegistrationStatusSidebar from '~/components/registrations/Status/SideBar'
import RegistrationCancelModal from '~/components/registrations/Cancel'

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
        variant: 'warning' as const,
        text: 'En attente',
        description: 'Votre inscription est en attente de validation',
      },
      confirmed: {
        variant: 'success' as const,
        text: 'Confirmé',
        description: 'Votre inscription est confirmée',
      },
      attended: {
        variant: 'info' as const,
        text: 'Présent',
        description: 'Vous avez assisté à cet événement',
      },
      canceled: {
        variant: 'error' as const,
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

  return (
    <>
      <Head title={`Inscription - ${registration.event.name}`} />
      <AppLayout>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <RegistrationHeader
            title={`Inscription - ${registration.event.name}`}
            description="Détails de votre inscription"
          />

          {/* Status Alert */}
          <RegistrationStatusAlert statusInfo={statusInfo} />

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event Info */}
              <RegistrationEventInfo
                event={registration.event}
                createdAt={registration.createdAt}
              />

              {/* QR Code Section */}
              {(registration.status === 'confirmed' || registration.status === 'pending') && (
                <RegistrationQR
                  qrCodeImage={registration.qrCodeImage}
                  eventName={registration.event.name}
                  isResending={isResending}
                  onDownload={handleDownloadQR}
                  onPrint={handlePrint}
                  onResend={handleResendQR}
                />
              )}

              {/* Important Information */}
              <RegistrationInfo />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Status Card */}
                <RegistrationStatusSidebar
                  status={registration.status}
                  attendedAt={registration.attendedAt}
                  canCancel={canCancel}
                  onCancelClick={() => setShowCancelModal(true)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cancel Modal */}
        <RegistrationCancelModal
          show={showCancelModal}
          event={registration.event}
          isCanceling={isCanceling}
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleCancel}
        />

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
