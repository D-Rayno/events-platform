// inertia/components/events/Filter/Panel.tsx
import { motion, AnimatePresence } from 'motion/react'
import { FunnelIcon } from '@heroicons/react/24/outline'
import Button from '~/components/ui/Button'
import Select from '~/components/ui/Select'
import Card from '~/components/ui/Card'
import { PROVINCES, EVENT_CATEGORIES } from '~/lib/constants'
import type { EventFilters } from '~/types/event'

interface FiltersPanelProps {
  showFilters: boolean
  localFilters: EventFilters & { search: string }
  onFilterChange: (key: string, value: string) => void
  onApplyFilters: () => void
  onClose: () => void
}

// Category options
const categoryOptions = EVENT_CATEGORIES.map((cat) => ({ value: cat, label: cat }))

// Province options
const provinceOptions = PROVINCES.map((p) => ({ value: p, label: p }))

// Event type options
const eventTypeOptions = [
  { value: '', label: 'Tous les types' },
  { value: 'normal', label: '🎪 Événements normaux' },
  { value: 'game', label: '🎮 Événements de jeu' },
]

// Game type options
const gameTypeOptions = [
  { value: '', label: 'Tous les jeux' },
  { value: 'squid-game', label: '🦑 Squid Game' },
  { value: 'werewolf', label: '🐺 Loup-Garou' },
  { value: 'escape-room', label: '🔐 Escape Room' },
  { value: 'treasure-hunt', label: '🗺️ Chasse au trésor' },
  { value: 'obstacle-course', label: "🏃 Parcours d'obstacles" },
]

// Difficulty options
const difficultyOptions = [
  { value: '', label: 'Toutes difficultés' },
  { value: 'easy', label: '😊 Facile' },
  { value: 'medium', label: '😐 Moyen' },
  { value: 'hard', label: '😰 Difficile' },
  { value: 'extreme', label: '💀 Extrême' },
]

// Price range options
const priceRangeOptions = [
  { value: '', label: 'Tous les prix' },
  { value: 'free', label: '💚 Gratuit' },
  { value: 'paid', label: '💰 Payant (0-1000 DZD)' },
  { value: 'premium', label: '💎 Premium (1000+ DZD)' },
]

// Status options
const statusOptions = [
  { value: '', label: 'Tous les statuts' },
  { value: 'upcoming', label: '📅 À venir' },
  { value: 'ongoing', label: '⚡ En cours' },
]

export default function FiltersPanel({
  showFilters,
  localFilters,
  onFilterChange,
  onApplyFilters,
  onClose,
}: FiltersPanelProps) {
  return (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 overflow-hidden"
        >
          <Card variant="bordered" padding="lg" className="overflow-visible">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-primary-600" />
              Filtres de recherche
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Category Filter */}
              <Select
                label="Catégorie"
                value={localFilters.category || ''}
                onChange={(val) => onFilterChange('category', val as string)}
                options={[{ value: '', label: 'Toutes les catégories' }, ...categoryOptions]}
                searchable
              />

              {/* Province Filter */}
              <Select
                label="Wilaya"
                value={localFilters.province || ''}
                onChange={(val) => onFilterChange('province', val as string)}
                options={[{ value: '', label: 'Toutes les wilayas' }, ...provinceOptions]}
                searchable
              />

              {/* Event Type Filter */}
              <Select
                label="Type d'événement"
                value={localFilters.eventType || ''}
                onChange={(val) => onFilterChange('eventType', val as string)}
                options={eventTypeOptions}
              />

              {/* Game Type Filter */}
              <Select
                label="Type de jeu"
                value={localFilters.gameType || ''}
                onChange={(val) => onFilterChange('gameType', val as string)}
                options={gameTypeOptions}
                disabled={localFilters.eventType === 'normal'}
                hint={
                  localFilters.eventType === 'normal'
                    ? 'Disponible pour les événements de jeu uniquement'
                    : undefined
                }
              />

              {/* Difficulty Filter */}
              <Select
                label="Difficulté"
                value={localFilters.difficulty || ''}
                onChange={(val) => onFilterChange('difficulty', val as string)}
                options={difficultyOptions}
                disabled={localFilters.eventType === 'normal'}
                hint={
                  localFilters.eventType === 'normal'
                    ? 'Disponible pour les événements de jeu uniquement'
                    : undefined
                }
              />

              {/* Price Range Filter */}
              <Select
                label="Prix"
                value={localFilters.priceRange || ''}
                onChange={(val) => onFilterChange('priceRange', val as string)}
                options={priceRangeOptions}
              />

              {/* Status Filter */}
              <Select
                label="Statut"
                value={localFilters.status || ''}
                onChange={(val) => onFilterChange('status', val as string)}
                options={statusOptions}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="ghost" onClick={onClose}>
                Fermer
              </Button>
              <Button variant="primary" onClick={onApplyFilters}>
                Appliquer les filtres
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
