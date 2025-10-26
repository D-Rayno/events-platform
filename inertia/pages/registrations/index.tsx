// inertia/pages/registrations/index.tsx - REFACTORED WITH COMPONENTS
import { Head } from '@inertiajs/react'
import { useMemo } from 'react'
import AppLayout from '~/components/layouts/AppLayout'
import { useRouteGuard } from '~/hooks/useRouteGuard'

// Import registration components
import RegistrationHeader from '~/components/registrations/Header'
import RegistrationStats from '~/components/registrations/Stats'
import RegistrationList from '~/components/registrations/List'
import RegistrationEmpty from '~/components/registrations/Status/Empty'

interface Event {
  id: number
  name: string
  location: string
  startDate: string
  endDate: string
  imageUrl: string | null
  status: string
}

interface Registration {
  id: number
  status: 'pending' | 'confirmed' | 'attended' | 'canceled'
  qrCode: string
  attendedAt: string | null
  createdAt: string
  event: Event
}

interface Props {
  registrations: Registration[]
}

export default function RegistrationsIndex({ registrations }: Props) {
  useRouteGuard({ requiresAuth: true, requiresVerification: true })

  const groupedRegistrations = useMemo(() => {
    return {
      active: registrations.filter((r) => r.status === 'confirmed' || r.status === 'pending'),
      past: registrations.filter((r) => r.status === 'attended'),
      canceled: registrations.filter((r) => r.status === 'canceled'),
    }
  }, [registrations])

  if (registrations.length === 0) {
    return (
      <>
        <Head title="Mes Inscriptions" />
        <AppLayout>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <RegistrationEmpty />
          </div>
        </AppLayout>
      </>
    )
  }

  return (
    <>
      <Head title="Mes Inscriptions" />
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <RegistrationHeader
            title="Mes Inscriptions"
            description="Gérez vos inscriptions et accédez à vos QR codes d'événements"
          />

          {/* Stats */}
          <RegistrationStats
            activeCount={groupedRegistrations.active.length}
            pastCount={groupedRegistrations.past.length}
            totalCount={registrations.length}
          />

          {/* Active Registrations */}
          <RegistrationList
            registrations={groupedRegistrations.active}
            title="Inscriptions actives"
            accentColor="primary"
            delay={0.2}
          />

          {/* Past Events */}
          <RegistrationList
            registrations={groupedRegistrations.past}
            title="Événements passés"
            accentColor="info"
            delay={0.3}
          />

          {/* Canceled */}
          <RegistrationList
            registrations={groupedRegistrations.canceled}
            title="Inscriptions annulées"
            accentColor="neutral"
            delay={0.4}
          />
        </div>
      </AppLayout>
    </>
  )
}