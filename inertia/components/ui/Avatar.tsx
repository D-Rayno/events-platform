// inertia/components/ui/Avatar.tsx
import { useState } from 'react'
import { motion } from 'motion/react'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import { useTheme } from '~/hooks/useTheme'

interface AvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  shape?: 'circle' | 'square' | 'rounded'
  status?: 'online' | 'offline' | 'away' | 'busy'
  ring?: boolean
  ringColor?: string
}

const sizeClasses = {
  'xs': 'w-6 h-6 text-xs',
  'sm': 'w-8 h-8 text-sm',
  'md': 'w-10 h-10 text-base',
  'lg': 'w-12 h-12 text-lg',
  'xl': 'w-16 h-16 text-xl',
  '2xl': 'w-20 h-20 text-2xl',
}

const shapeClasses = {
  circle: 'rounded-full',
  square: 'rounded-none',
  rounded: 'rounded-xl',
}

const statusColors = {
  online: 'bg-success-500 ring-white',
  offline: 'bg-neutral-400 ring-white',
  away: 'bg-warning-500 ring-white',
  busy: 'bg-error-500 ring-white',
}

const statusSize = {
  'xs': 'w-1.5 h-1.5',
  'sm': 'w-2 h-2',
  'md': 'w-2.5 h-2.5',
  'lg': 'w-3 h-3',
  'xl': 'w-3.5 h-3.5',
  '2xl': 'w-4 h-4',
}

export default function Avatar({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  shape = 'circle',
  status,
  ring = false,
  ringColor,
}: AvatarProps) {
  const { getAnimation } = useTheme()
  const [imageError, setImageError] = useState(false)

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : ''

  const showImage = src && !imageError

  return (
    <motion.div
      className="relative inline-block"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: getAnimation('fast') / 1000 }}
    >
      <div
        className={`flex items-center justify-center overflow-hidden transition-all duration-300 ${
          sizeClasses[size]
        } ${shapeClasses[shape]} ${
          showImage
            ? ''
            : 'bg-linear-to-br from-primary-400 to-secondary-500 text-white font-bold'
        } ${ring && 'ring-4 ring-primary-500/20'}`}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : initials ? (
          <span>{initials}</span>
        ) : (
          <UserCircleIcon className="w-full h-full text-neutral-300" />
        )}
      </div>

      {status && (
        <motion.span
          className={`absolute bottom-0 right-0 rounded-full border-2 ${statusColors[status]} ${statusSize[size]}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 500 }}
          title={status}
        />
      )}
    </motion.div>
  )
}
