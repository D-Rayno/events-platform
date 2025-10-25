// inertia/pages/events/index.tsx - IMPROVED VERSION
import { Head, router } from '@inertiajs/react'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  CalendarIcon,
  UsersIcon,
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
  const { getPlaceholder } = useTheme()
  const [showFilters, setShowFilters] = useState(false)
  
  // Local state for immediate UI updates
  const [searchValue, setSearchValue] = useState(filters.search || '')
  const [categoryValue, setCategoryValue] = useState(filters.category || '')
  const [provinceValue, setProvinceValue] = useState(filters.province || '')

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
    if (filters.search) count++
    if (filters.category) count++
    if (filters.province) count++
    return count
  }, [filters])

  // Auto-apply filters when dropdown values change
  const applyFiltersAutomatically = (newFilters: any) => {
    router.get('/events', newFilters, {
      preserveState: true,
      preserveScroll: true,
      only: ['events', 'filters'],
    })
  }

  const handleSearchSubmit = () => {
    applyFiltersAutomatically({
      search: searchValue,
      category: categoryValue,
      province: provinceValue,
    })
  }

  const handleCategoryChange = (value: string | number) => {
    const newCategory = value as string
    setCategoryValue(newCategory)
    applyFiltersAutomatically({
      search: searchValue,
      category: newCategory,
      province: provinceValue,
    })
  }

  const handleProvinceChange = (value: string | number) => {
    const newProvince = value as string
    setProvinceValue(newProvince)
    applyFiltersAutomatically({
      search: searchValue,
      category: categoryValue,
      province: newProvince,
    })
  }

  const clearFilters = () => {
    setSearchValue('')
    setCategoryValue('')
    setProvinceValue('')
    router.get('/events', {}, {
      preserveState: true,
      preserveScroll: true,
      only: ['events', 'filters'],
    })
    setShowFilters(false)
  }

  const handlePageChange = (page: number) => {
    router.get('/events', {
      search: searchValue,
      category: categoryValue,
      province: provinceValue,
      page,
    }, {
      preserveState: true,
      preserveScroll: false,
      only: ['events'],
    })
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
        <section className="relative bg-linear-to-br from-primary-600 via-primary-700 to-secondary-600 text-white py-20 -mt-8 mb-12">
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-4">Découvrez nos événements</h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl">
                Explorez une sélection d'événements passionnants près de chez vous
              </p>

              {/* Search Bar */}
              <div className="w-full">
                <div className="flex gap-3">
                  <div className="flex-1 text-gray-900">
                    <Input
                      value={searchValue}
                      onChange={(value) => setSearchValue(value as string)}
                      placeholder="Rechercher un événement..."
                      icon={MagnifyingGlassIcon}
                      size="lg"
                      onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === 'Enter') handleSearchSubmit()
                      }}
                    />
                  </div>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleSearchSubmit}
                    className="shadow-lg"
                  >
                    Rechercher
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
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

          {/* Filters Panel - FIXED: Added z-index and proper positioning */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8 relative z-20"
              >
                <Card variant="bordered" padding="lg" className="overflow-visible">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative z-30">
                      <Select
                        label="Catégorie"
                        value={categoryValue}
                        onChange={handleCategoryChange}
                        options={categoryOptions}
                        placeholder="Toutes les catégories"
                        searchable
                      />
                    </div>
                    <div className="relative z-20">
                      <Select
                        label="Wilaya"
                        value={provinceValue}
                        onChange={handleProvinceChange}
                        options={provinceOptions}
                        placeholder="Toutes les wilayas"
                        searchable
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <Button variant="ghost" onClick={() => setShowFilters(false)}>
                      Fermer
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.data.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Card hoverable clickable className="h-full flex flex-col overflow-hidden">
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

                      <div className="flex-1 flex flex-col mt-4 p-4">
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
                            <CalendarIcon className="w-4 h-4 text-primary-600 shrink-0" />
                            <span>{formatDate(event.startDate)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-neutral-700">
                            <MapPinIcon className="w-4 h-4 text-primary-600 shrink-0" />
                            <span className="truncate">
                              {event.commune}, {event.province}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-neutral-700">
                            <UsersIcon className="w-4 h-4 text-primary-600 shrink-0" />
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