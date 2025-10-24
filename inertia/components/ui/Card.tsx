// inertia/components/ui/Card.tsx
import { motion } from 'motion/react'
import { useTheme } from '~/hooks/useTheme'

interface CardProps {
  variant?: 'default' | 'bordered' | 'elevated' | 'gradient' | 'glass'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  hoverable?: boolean
  clickable?: boolean
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
  children: React.ReactNode
}

const variantClasses = {
  default: 'bg-white border border-neutral-200 shadow-sm',
  bordered: 'bg-white border-2 border-neutral-300',
  elevated: 'bg-white shadow-xl border border-neutral-100',
  gradient:
    'bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/30 border border-neutral-200 shadow-lg',
  glass: 'bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg',
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
}

const roundedClasses = {
  sm: 'rounded-md',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
  '2xl': 'rounded-3xl',
}

export default function Card({
  variant = 'default',
  padding = 'md',
  hoverable = false,
  clickable = false,
  rounded = 'xl',
  className = '',
  children,
}: CardProps) {
  const { getAnimation } = useTheme()

  const cardClasses = [
    'transition-all duration-300',
    variantClasses[variant],
    paddingClasses[padding],
    roundedClasses[rounded],
    hoverable && 'hover:shadow-2xl hover:-translate-y-2',
    clickable && 'cursor-pointer active:scale-[0.98]',
    className,
  ].join(' ')

  return (
    <motion.div
      className={cardClasses}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: getAnimation('normal') / 1000 }}
      whileHover={hoverable ? { y: -8, transition: { duration: getAnimation('fast') / 1000 } } : {}}
    >
      {children}
    </motion.div>
  )
}