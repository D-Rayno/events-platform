import { Head, router } from '@inertiajs/react'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  CalendarIcon,
  UsersIcon,
  TagIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import AppLayout from '~/components/layouts/AppLayout'
import Card from '~/components/ui/Card'
import Button from '~/components/ui/Button'
import Input from '~/components/ui/Input'
import Select from '~/components/ui/Select'
import Badge from '~/components/ui/Badge'
import Image from '~/components/ui/Image'
import Pagination from '~/components/ui/Pagination'
import { useTheme } from '~/hooks/useTheme'
import { formatDate, formatCurrency, truncate } from '~/lib/utils'
import { PROVINCES, EVENT_CATEGORIES } from '~/lib/constants'
import type { PaginatedResponse } from '~/types/common'

interface Event {
  id: number
  name: string
  description: string
  location: string
  province: string
  commune: string
  startDate: string
  endDate: string
  capacity: number
  registeredCount: number
  availableSeats: number
  imageUrl: string | null
  category: string
  basePrice: number
  isFull: boolean
  canRegister: boolean
  isRegistered: boolean
  isUpcoming: boolean
  isOngoing: boolean
  isFinished: boolean
}

interface Props {
  events: PaginatedResponse<Event>
  filters: {
    search?: string
    category?: string
    province?: string
  }
}

export default function EventsIndex({ events, filters }: Props) {
  const { config, getPlaceholder } = useTheme()
  const [showFilters, setShowFilters] = useState(false)
  const [localFilters, setLocalFilters] = useState(filters)

  const categoryOptions = EVENT_CATEGORIES.map((cat) => ({
    value: cat,
    label: cat,
  }))

  const provinceOptions = PROVINCES.map((p) => ({
    value: p,
    label: p,
  }))

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (localFilters.search) count++
    if (localFilters.category) count++
    if (localFilters.province) count++
    return count
  }, [localFilters])

  const handleSearch = (value: string | number) => {
    setLocalFilters({ ...localFilters, search: value.toString() })
  }

  const handleFilterChange = (key: string, value: any) => {
    setLocalFilters({ ...localFilters, [key]: value })
  }

  const applyFilters = () => {
    router.get('/events', localFilters, {
      preserveState: true,
      preserveScroll: true,
    })
    setShowFilters(false)
  }

  const clearFilters = () => {
    setLocalFilters({ search: '', category: '', province: '' })
    router.get(
      '/events',
      {},
      {
        preserveState: true,
        preserveScroll: true,
      }
    )
    setShowFilters(false)
  }

  const handlePageChange = (page: number) => {
    router.get(
      '/events',
      { ...localFilters, page },
      {
        preserveState: true,
        preserveScroll: false,
      }
    )
  }

  const getEventStatusBadge = (event: Event) => {
    if (event.isOngoing) {
      return (
        <Badge variant="info" dot pulse>
          En cours
        </Badge>
      )
    }
    if (event.isUpcoming) {
      return (
        <Badge variant="success" dot>
          À venir
        </Badge>
      )
    }
    if (event.isFinished) {
      return <Badge variant="neutral">Terminé</Badge>
    }
    return null
  }

  return (
    <>
      <Head title="Événements" />
      <AppLayout>
        {/* Hero Section */}
        <section className="relative bg-linear-to-br from-primary-600 via-primary-700 to-secondary-600 text-white py-16 -mt-8 mb-8">
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Découvrez nos événements</h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl">
                Explorez une sélection d'événements passionnants près de chez vous
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl">
                <div className="relative">
                  <Input
                    value={localFilters.search || ''}
                    onChange={handleSearch}
                    placeholder="Rechercher un événement..."
                    icon={MagnifyingGlassIcon}
                    size="lg"
                    onKeyDown={(e: React.KeyboardEvent) => {
                      if (e.key === 'Enter') applyFilters()
                    }}
                  />
                  <Button
                    variant="primary"
                    size="lg"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={applyFilters}
                  >
                    Rechercher
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters Bar */}
          <motion.div
            className="flex items-center justify-between mb-8 flex-wrap gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                iconLeft={FunnelIcon}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filtres
                {activeFiltersCount > 0 && (
                  <Badge variant="primary" size="sm" rounded>
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
              {events.meta.total} événement{events.meta.total > 1 ? 's' : ''} trouvé
              {events.meta.total > 1 ? 's' : ''}
            </p>
          </motion.div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8 overflow-hidden"
              >
                <Card variant="bordered" padding="lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                      label="Catégorie"
                      value={localFilters.category || ''}
                      onChange={(value) => handleFilterChange('category', value)}
                      options={categoryOptions}
                      placeholder="Toutes les catégories"
                      searchable
                    />
                    <Select
                      label="Wilaya"
                      value={localFilters.province || ''}
                      onChange={(value) => handleFilterChange('province', value)}
                      options={provinceOptions}
                      placeholder="Toutes les wilayas"
                      searchable
                    />
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <Button variant="ghost" onClick={() => setShowFilters(false)}>
                      Annuler
                    </Button>
                    <Button variant="primary" onClick={applyFilters}>
                      Appliquer les filtres
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Events Grid */}
          {events.data.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">Aucun événement trouvé</h3>
              <p className="text-neutral-600 mb-6">Essayez d'ajuster vos critères de recherche</p>
              <Button variant="primary" onClick={clearFilters}>
                Voir tous les événements
              </Button>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.data.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Card hoverable clickable className="h-full flex flex-col">
                      <div className="relative">
                        <Image
                          src={event.imageUrl || getPlaceholder('event')}
                          alt={event.name}
                          aspectRatio="16/9"
                          rounded="lg"
                        />
                        <div className="absolute top-3 right-3">{getEventStatusBadge(event)}</div>
                        {event.isRegistered && (
                          <div className="absolute top-3 left-3">
                            <Badge variant="success">Inscrit</Badge>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col mt-4">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <h3 className="text-lg font-bold text-neutral-900 line-clamp-2">
                            {event.name}
                          </h3>
                          <Badge variant="primary" size="sm">
                            {event.category}
                          </Badge>
                        </div>

                        <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                          {truncate(event.description, 100)}
                        </p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-neutral-700">
                            <CalendarIcon className="w-4 h-4 text-primary-600" />
                            <span>{formatDate(event.startDate)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-neutral-700">
                            <MapPinIcon className="w-4 h-4 text-primary-600" />
                            <span>
                              {event.commune}, {event.province}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-neutral-700">
                            <UsersIcon className="w-4 h-4 text-primary-600" />
                            <span>
                              {event.availableSeats} place{event.availableSeats > 1 ? 's' : ''}{' '}
                              disponible{event.availableSeats > 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-neutral-200 flex items-center justify-between">
                          <div>
                            {event.basePrice > 0 ? (
                              <p className="text-lg font-bold text-primary-600">
                                {formatCurrency(event.basePrice)}
                              </p>
                            ) : (
                              <Badge variant="success">Gratuit</Badge>
                            )}
                          </div>
                          <Button variant="primary" size="sm" href={`/events/${event.id}`}>
                            Détails
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {events.meta.last_page > 1 && (
                <motion.div
                  className="mt-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Pagination
                    currentPage={events.meta.current_page}
                    lastPage={events.meta.last_page}
                    totalItems={events.meta.total}
                    itemsPerPage={events.meta.per_page}
                    onChangePage={handlePageChange}
                  />
                </motion.div>
              )}
            </>
          )}
        </div>
      </AppLayout>
    </>
  )
}
