// inertia/components/registrations/List.tsx
import { motion } from 'motion/react'
import RegistrationCard from './Card'

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

interface RegistrationListProps {
  registrations: Registration[]
  title: string
  accentColor: 'primary' | 'info' | 'neutral'
  delay?: number
}

const accentColorClasses = {
  primary: 'bg-primary-600',
  info: 'bg-info-600',
  neutral: 'bg-neutral-400',
}

export default function RegistrationList({
  registrations,
  title,
  accentColor,
  delay = 0,
}: RegistrationListProps) {
  if (registrations.length === 0) return null

  return (
    <motion.div
      className="mb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay }}
    >
      <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
        <div className={`w-2 h-8 ${accentColorClasses[accentColor]} rounded-full`} />
        {title}
      </h2>
      <div className="space-y-4">
        {registrations.map((registration, index) => (
          <RegistrationCard key={registration.id} registration={registration} index={index} />
        ))}
      </div>
    </motion.div>
  )
}
