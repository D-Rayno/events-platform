import { Link } from '@inertiajs/react'
import { motion } from 'motion/react'
import { useTheme } from '~/hooks/useTheme'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'gradient'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  href?: string
  type?: 'button' | 'submit' | 'reset'
  iconLeft?: React.ComponentType<{ className?: string }>
  iconRight?: React.ComponentType<{ className?: string }>
  rounded?: 'sm' | 'md' | 'lg' | 'full'
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  pulse?: boolean
  onClick?: () => void
  className?: string
  children: React.ReactNode
}

const baseClasses =
  'inline-flex cursor-pointer items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group'

const variantClasses = {
  primary:
    'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white focus:ring-primary-500/30 shadow-md hover:shadow-lg',
  secondary:
    'bg-gradient-to-r from-secondary-600 to-secondary-700 hover:from-secondary-700 hover:to-secondary-800 text-white focus:ring-secondary-500/30 shadow-md hover:shadow-lg',
  outline:
    'border-2 border-neutral-300 hover:border-primary-600 hover:bg-primary-50 text-neutral-700 hover:text-primary-700 focus:ring-primary-500/20',
  ghost:
    'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 focus:ring-neutral-500/20',
  danger:
    'bg-gradient-to-r from-error-600 to-error-700 hover:from-error-700 hover:to-error-800 text-white focus:ring-error-500/30 shadow-md hover:shadow-lg',
  success:
    'bg-gradient-to-r from-success-600 to-success-700 hover:from-success-700 hover:to-success-800 text-white focus:ring-success-500/30 shadow-md hover:shadow-lg',
  gradient:
    'bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-size-200 hover:bg-pos-100 text-white focus:ring-primary-500/30 shadow-md hover:shadow-xl',
}

const sizeClasses = {
  xs: 'px-3 py-1.5 text-xs gap-1.5',
  sm: 'px-4 py-2 text-sm gap-2',
  md: 'px-5 py-2.5 text-base gap-2',
  lg: 'px-6 py-3 text-lg gap-2.5',
  xl: 'px-8 py-4 text-xl gap-3',
}

const roundedClasses = {
  sm: 'rounded-md',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  full: 'rounded-full',
}

const shadowClasses = {
  none: '',
  sm: 'shadow-sm hover:shadow',
  md: 'shadow-md hover:shadow-lg',
  lg: 'shadow-lg hover:shadow-xl',
  xl: 'shadow-xl hover:shadow-2xl',
}

const iconSizes = {
  xs: 'w-3.5 h-3.5',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-7 h-7',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  href,
  type = 'button',
  iconLeft: IconLeft,
  iconRight: IconRight,
  rounded = 'lg',
  shadow = 'md',
  pulse = false,
  onClick,
  className = '',
  children,
}: ButtonProps) {
  const { getAnimation } = useTheme()
  const isDisabled = disabled || loading

  const buttonClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    roundedClasses[rounded],
    shadowClasses[shadow],
    fullWidth ? 'w-full' : '',
    pulse ? 'animate-pulse' : '',
    className,
  ].join(' ')

  const content = (
    <>
      {/* Enhanced Shimmer Effect */}
      {!loading && !disabled && (
        <>
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/30 to-transparent" />
          
          {/* Glow effect on hover */}
          <motion.span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)',
            }}
          />
        </>
      )}

      {/* Loading State */}
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <motion.svg
            className={iconSizes[size]}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </motion.svg>
          <span>Loading...</span>
        </span>
      ) : (
        <span className="relative z-10 inline-flex items-center gap-2">
          {IconLeft && (
            <motion.span
              initial={{ x: 0 }}
              whileHover={{ x: -2 }}
              transition={{ duration: 0.2 }}
            >
              <IconLeft className={iconSizes[size]} />
            </motion.span>
          )}
          {children}
          {IconRight && (
            <motion.span
              initial={{ x: 0 }}
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              <IconRight className={iconSizes[size]} />
            </motion.span>
          )}
        </span>
      )}
    </>
  )

  const motionProps = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    whileHover: isDisabled ? {} : { 
      scale: 1.03,
      y: -2,
      transition: { duration: 0.2 }
    },
    whileTap: isDisabled ? {} : { 
      scale: 0.97,
      y: 0,
      transition: { duration: 0.1 }
    },
    transition: { duration: getAnimation('fast') / 1000 },
  }

  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        <motion.div {...motionProps} className="w-full flex items-center justify-center">
          {content}
        </motion.div>
      </Link>
    )
  }

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={buttonClasses}
      {...motionProps}
    >
      {content}
    </motion.button>
  )
}