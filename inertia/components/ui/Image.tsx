import { useState, useMemo } from 'react'
import { PhotoIcon } from '@heroicons/react/24/outline'

interface Props {
  src?: string
  alt?: string
  fallback?: string
  aspectRatio?: '1/1' | '4/3' | '16/9' | '21/9' | 'auto'
  objectFit?: 'cover' | 'contain' | 'fill' | 'none'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  loading?: 'lazy' | 'eager'
}

const aspectRatioClasses = {
  '1/1': 'aspect-square',
  '4/3': 'aspect-[4/3]',
  '16/9': 'aspect-video',
  '21/9': 'aspect-[21/9]',
  'auto': '',
}

const objectFitClasses = {
  cover: 'object-cover',
  contain: 'object-contain',
  fill: 'object-fill',
  none: 'object-none',
}

const roundedClasses = {
  none: '',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
}

export default function ImageComponent({
  src,
  alt = 'Image',
  fallback,
  aspectRatio = 'auto',
  objectFit = 'cover',
  rounded = 'md',
  loading = 'lazy',
}: Props) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const containerClasses = [
    'relative overflow-hidden bg-neutral-100',
    aspectRatioClasses[aspectRatio],
    roundedClasses[rounded],
  ].join(' ')

  const imageClasses = [
    'w-full h-full transition-opacity duration-300',
    objectFitClasses[objectFit],
    imageLoaded ? 'opacity-100' : 'opacity-0',
  ].join(' ')

  const handleLoad = () => {
    setImageLoaded(true)
  }

  const handleError = () => {
    setImageError(true)
  }

  const displaySrc = useMemo(() => {
    if (imageError && fallback) {
      return fallback
    }
    return src
  }, [imageError, fallback, src])

  return (
    <div className={containerClasses}>
      {/* Skeleton loader */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-linear-to-r from-neutral-100 via-neutral-200 to-neutral-100 animate-pulse" />
      )}

      {/* Error placeholder */}
      {imageError && !fallback && (
        <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
          <PhotoIcon className="w-12 h-12" />
        </div>
      )}

      {/* Image */}
      {displaySrc && (
        <img
          src={displaySrc}
          alt={alt}
          className={imageClasses}
          loading={loading}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  )
}