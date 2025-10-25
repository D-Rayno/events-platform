// inertia/components/events/Hero.tsx
import { motion } from 'motion/react'
import {
  FireIcon,
  TrophyIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import Button from '~/components/ui/Button'
import Input from '~/components/ui/Input'
import type { FilterStats } from '~/types/event'

interface HeroSectionProps {
  filterStats?: FilterStats
  searchValue: string
  onSearchChange: (value: string) => void
  onSearchSubmit: () => void
}

export default function HeroSection({
  filterStats,
  searchValue,
  onSearchChange,
  onSearchSubmit,
}: HeroSectionProps) {
  return (
    <section className="relative bg-linear-to-br from-primary-600 via-primary-700 to-secondary-600 text-white py-20 -mt-8 mb-12 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />
      <motion.div
        className="absolute top-10 right-10 text-primary-200/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <SparklesIcon className="w-32 h-32" />
      </motion.div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-linear-to-r from-white to-primary-100 bg-clip-text text-transparent">
            Découvrez nos événements
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Explorez une sélection d'événements passionnants près de chez vous
          </p>
          {filterStats && (
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <FireIcon className="w-5 h-5" />
                <span className="text-sm font-medium">{filterStats.total} événements</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <TrophyIcon className="w-5 h-5" />
                <span className="text-sm font-medium">{filterStats.gameEvents} jeux</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <SparklesIcon className="w-5 h-5" />
                <span className="text-sm font-medium">{filterStats.freeEvents} gratuits</span>
              </div>
            </div>
          )}
          <div className="w-full">
            <div className="flex gap-3">
              <div className="flex-1 text-gray-900">
                <Input
                  value={searchValue}
                  onChange={onSearchChange as (value: string | number) => void}
                  placeholder="Rechercher un événement..."
                  icon={MagnifyingGlassIcon}
                  size="lg"
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === 'Enter') onSearchSubmit()
                  }}
                />
              </div>
              <Button variant="primary" size="lg" onClick={onSearchSubmit} className="shadow-lg">
                Rechercher
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}