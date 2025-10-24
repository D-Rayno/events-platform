import { useState, useEffect } from 'react'
import { usePage } from '@inertiajs/react'
import { AnimatePresence, motion } from 'motion/react'
import Alert from '~/components/ui/Alert'
import type { AlertType } from '~/types'

interface FlashMessages {
  success?: string
  error?: string
  warning?: string
  info?: string
}

interface FlashMessage {
  type: AlertType
  message: string
}

export default function FlashMessages() {
  const { props } = usePage()
  const [dismissedMessages, setDismissedMessages] = useState<Set<string>>(new Set())
  const [mounted, setMounted] = useState(false)

  const flash = props.flash as FlashMessages | undefined

  useEffect(() => {
    setMounted(true)
  }, [])

  const visibleMessages: FlashMessage[] = []

  if (mounted && flash) {
    if (flash.success && !dismissedMessages.has('success')) {
      visibleMessages.push({ type: 'success', message: flash.success })
    }
    if (flash.error && !dismissedMessages.has('error')) {
      visibleMessages.push({ type: 'error', message: flash.error })
    }
    if (flash.warning && !dismissedMessages.has('warning')) {
      visibleMessages.push({ type: 'warning', message: flash.warning })
    }
    if (flash.info && !dismissedMessages.has('info')) {
      visibleMessages.push({ type: 'info', message: flash.info })
    }
  }

  const dismiss = (type: string) => {
    setDismissedMessages((prev) => new Set([...prev, type]))
  }

  if (visibleMessages.length === 0) return null

  return (
    <div className="fixed top-20 left-4 right-4 md:left-auto md:right-8 z-50 space-y-2 max-w-md">
      <AnimatePresence>
        {visibleMessages.map((msg) => (
          <motion.div
            key={msg.type}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Alert type={msg.type} dismissible onDismiss={() => dismiss(msg.type)}>
              {msg.message}
            </Alert>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
