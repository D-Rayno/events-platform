import React, { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { createPortal } from 'react-dom'
import { useTheme } from '~/hooks/useTheme'

interface Props {
  show?: boolean
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
  closable?: boolean
  title?: string
  closeOnBackdrop?: boolean
  onClose?: () => void
  children?: React.ReactNode
  footer?: React.ReactNode
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  full: 'max-w-full mx-4',
}

export default function Modal({
  show = false,
  maxWidth = 'md',
  closable = true,
  title,
  closeOnBackdrop = true,
  onClose,
  children,
  footer,
}: Props) {
  const { getAnimation } = useTheme()

  const close = () => {
    if (closable && onClose) onClose()
  }

  const handleBackdropClick = () => {
    if (closeOnBackdrop) close()
  }

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [show])

  if (!show) return null

  const modalContent = (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: getAnimation('fast') / 1000 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleBackdropClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className={`w-full bg-white rounded-2xl shadow-2xl relative z-10 ${maxWidthClasses[maxWidth]}`}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: getAnimation('normal') / 1000, type: 'spring', stiffness: 300 }}
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            {(title || closable) && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
                {title && (
                  <motion.h3
                    className="text-xl font-bold text-neutral-900"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {title}
                  </motion.h3>
                )}
                {closable && (
                  <motion.button
                    onClick={close}
                    className="text-neutral-400 hover:text-neutral-600 transition-colors rounded-lg p-2 hover:bg-neutral-100"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Close"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </motion.button>
                )}
              </div>
            )}

            {/* Body */}
            <motion.div
              className="px-6 py-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {children}
            </motion.div>

            {/* Footer */}
            {footer && (
              <motion.div
                className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 rounded-b-2xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {footer}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return createPortal(modalContent, document.body)
}