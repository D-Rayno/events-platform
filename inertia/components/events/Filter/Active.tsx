// inertia/components/events/Filter/Active.tsx
import { motion } from 'motion/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Badge from '~/components/ui/Badge'
import { router } from '@inertiajs/react'
import type { EventFilters } from '~/types/event'

interface ActiveFiltersProps {
  filters: EventFilters
  onFilterChange: (key: string, value: string) => void
}

export default function ActiveFilters({ filters, onFilterChange }: ActiveFiltersProps) {
  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  if (activeFiltersCount === 0) return null

  const handleRemoveFilter = (key: keyof EventFilters) => {
    onFilterChange(key, '')
    const newFilters = { ...filters }
    delete newFilters[key]
    router.get('/events', newFilters, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  return (
    <motion.div
      className="flex flex-wrap gap-2 mb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {filters.category && (
        <Badge variant="primary">
          Catégorie: {filters.category}
          <button
            onClick={() => handleRemoveFilter('category')}
            className="ml-2 hover:text-primary-800"
            aria-label="Retirer le filtre catégorie"
          >
            <XMarkIcon className="w-3 h-3" />
          </button>
        </Badge>
      )}
      {filters.province && (
        <Badge variant="primary">
          Wilaya: {filters.province}
          <button
            onClick={() => handleRemoveFilter('province')}
            className="ml-2 hover:text-primary-800"
            aria-label="Retirer le filtre wilaya"
          >
            <XMarkIcon className="w-3 h-3" />
          </button>
        </Badge>
      )}
      {filters.eventType && (
        <Badge variant="secondary">
          Type: {filters.eventType === 'game' ? 'Jeu' : 'Normal'}
          <button
            onClick={() => handleRemoveFilter('eventType')}
            className="ml-2 hover:text-secondary-800"
            aria-label="Retirer le filtre type"
          >
            <XMarkIcon className="w-3 h-3" />
          </button>
        </Badge>
      )}
      {filters.gameType && (
        <Badge variant="info">
          Jeu: {filters.gameType}
          <button
            onClick={() => handleRemoveFilter('gameType')}
            className="ml-2 hover:text-info-800"
            aria-label="Retirer le filtre type de jeu"
          >
            <XMarkIcon className="w-3 h-3" />
          </button>
        </Badge>
      )}
      {filters.difficulty && (
        <Badge variant="warning">
          Difficulté: {filters.difficulty}
          <button
            onClick={() => handleRemoveFilter('difficulty')}
            className="ml-2 hover:text-warning-800"
            aria-label="Retirer le filtre difficulté"
          >
            <XMarkIcon className="w-3 h-3" />
          </button>
        </Badge>
      )}
      {filters.priceRange && (
        <Badge variant="success">
          Prix: {filters.priceRange}
          <button
            onClick={() => handleRemoveFilter('priceRange')}
            className="ml-2 hover:text-success-800"
            aria-label="Retirer le filtre prix"
          >
            <XMarkIcon className="w-3 h-3" />
          </button>
        </Badge>
      )}
      {filters.status && (
        <Badge variant="neutral">
          Statut: {filters.status}
          <button
            onClick={() => handleRemoveFilter('status')}
            className="ml-2 hover:text-neutral-800"
            aria-label="Retirer le filtre statut"
          >
            <XMarkIcon className="w-3 h-3" />
          </button>
        </Badge>
      )}
    </motion.div>
  )
}