import { usePage, Link } from '@inertiajs/react'
import { motion } from 'motion/react'
import { useState } from 'react'
import Alert from '~/components/ui/Alert'
import { useTheme } from '~/hooks/useTheme'

interface FlashMessages {
  success?: string
  error?: string
  info?: string
  warning?: string
}

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { props } = usePage()
  const { config } = useTheme()
  const [dismissedFlash, setDismissedFlash] = useState<Set<string>>(new Set())

  const flash = props.flash as FlashMessages | undefined

  const visibleFlash = flash
    ? Object.entries(flash).filter(
        ([key, value]) => value && !dismissedFlash.has(key)
      )
    : []

  const dismissFlash = (type: string) => {
    setDismissedFlash((prev) => new Set([...prev, type]))
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 via-white to-primary-100 flex flex-col relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-200/30 rounded-full blur-3xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
        />
      </div>

      {/* Header with Logo */}
      <motion.header
        className="relative py-6 px-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <motion.div
              className="w-12 h-12 bg-linear-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            >
              <span className="text-xl font-bold text-white">
                {config.branding.logo.icon}
              </span>
            </motion.div>
            <span className="text-xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors duration-300">
              {config.branding.logo.text}
            </span>
          </Link>
        </div>
      </motion.header>

      {/* Flash Messages */}
      {visibleFlash.length > 0 && (
        <div className="relative px-4 pb-4">
          <div className="max-w-md mx-auto space-y-2">
            {visibleFlash.map(([type, message]) => (
              <Alert
                key={type}
                type={type as any}
                dismissible
                onDismiss={() => dismissFlash(type)}
              >
                {message}
              </Alert>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <motion.footer
        className="relative py-6 text-center text-sm text-neutral-600"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <p>
          &copy; {new Date().getFullYear()} {config.branding.logo.text}. Tous
          droits réservés.
        </p>
      </motion.footer>
    </div>
  )
}