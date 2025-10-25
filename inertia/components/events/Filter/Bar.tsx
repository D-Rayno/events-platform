// inertia/components/events/Filter/Bar.tsx
import { motion } from 'motion/react'
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Button from '~/components/ui/Button'
import Badge from '~/components/ui/Badge'

interface FiltersBarProps {
  activeFiltersCount: number
  showFilters: boolean
  toggleFilters: () => void
  clearFilters: () => void
  totalEvents: number
}

export default function FiltersBar({
  activeFiltersCount,
  showFilters,
  toggleFilters,
  clearFilters,
  totalEvents,
}: FiltersBarProps) {
  return (
    <motion.div
      className="flex items-center justify-between mb-8 flex-wrap gap-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="flex items-center gap-4 flex-wrap">
        <Button 
          variant={showFilters ? "primary" : "outline"}
          iconLeft={FunnelIcon} 
          onClick={toggleFilters}
        >
          {showFilters ? 'Masquer les filtres' : 'Filtres'}
          {activeFiltersCount > 0 && (
            <Badge 
              variant={showFilters ? "secondary" : "primary"} 
              size="sm" 
              rounded
              className="ml-2"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" iconLeft={XMarkIcon} onClick={clearFilters}>
            Réinitialiser
          </Button>
        )}
      </div>
      <p className="text-sm text-neutral-600">
        {totalEvents} événement{totalEvents !== 1 ? 's' : ''} trouvé{totalEvents !== 1 ? 's' : ''}
      </p>
    </motion.div>
  )
}