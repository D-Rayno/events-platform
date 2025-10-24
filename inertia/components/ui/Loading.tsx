import { motion } from 'motion/react'

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars'
  label?: string
  fullscreen?: boolean
  color?: 'primary' | 'secondary' | 'white'
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
}

const colorClasses = {
  primary: 'border-primary-200 border-t-primary-600',
  secondary: 'border-secondary-200 border-t-secondary-600',
  white: 'border-white/20 border-t-white',
}

const dotColorClasses = {
  primary: 'bg-primary-600',
  secondary: 'bg-secondary-600',
  white: 'bg-white',
}

export default function Loading({
  size = 'md',
  variant = 'spinner',
  label,
  fullscreen = false,
  color = 'primary',
}: Props) {
  return (
    <div
      className={`${fullscreen ? 'fixed inset-0 bg-white/90 backdrop-blur-sm z-50' : ''} flex items-center justify-center`}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        {variant === 'spinner' && (
          <motion.div
            className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full border-4`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {/* Dots */}
        {variant === 'dots' && (
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className={`${dotColorClasses[color]} w-3 h-3 rounded-full`}
                animate={{ y: [-8, 0, -8] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
        )}

        {/* Pulse */}
        {variant === 'pulse' && (
          <div className="relative">
            <motion.div
              className={`${sizeClasses[size]} ${dotColorClasses[color]} rounded-full`}
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        )}

        {/* Bars */}
        {variant === 'bars' && (
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className={`${dotColorClasses[color]} w-2 rounded-full`}
                animate={{ height: ['16px', '40px', '16px'] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </div>
        )}

        {/* Label */}
        {label && (
          <motion.p
            className="text-sm font-medium text-neutral-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {label}
          </motion.p>
        )}
      </div>
    </div>
  )
}