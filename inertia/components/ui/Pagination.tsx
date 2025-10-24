import { useMemo } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import Button from './Button'

interface Props {
  currentPage: number
  lastPage: number
  totalItems?: number
  itemsPerPage?: number
  onChangePage: (page: number) => void
}

export default function Pagination({
  currentPage,
  lastPage,
  totalItems = 0,
  itemsPerPage = 12,
  onChangePage,
}: Props) {
  const pages = useMemo(() => {
    const pagesArray: (number | string)[] = []
    const delta = 2
    const left = Math.max(1, currentPage - delta)
    const right = Math.min(lastPage, currentPage + delta)

    if (left > 1) {
      pagesArray.push(1)
      if (left > 2) pagesArray.push('...')
    }

    for (let i = left; i <= right; i++) {
      pagesArray.push(i)
    }

    if (right < lastPage) {
      if (right < lastPage - 1) pagesArray.push('...')
      pagesArray.push(lastPage)
    }

    return pagesArray
  }, [currentPage, lastPage])

  const hasPrevious = currentPage > 1
  const hasNext = currentPage < lastPage

  const goToPage = (page: number | string) => {
    if (typeof page === 'number' && page >= 1 && page <= lastPage) {
      onChangePage(page)
    }
  }

  const goToPrevious = () => {
    if (hasPrevious) {
      onChangePage(currentPage - 1)
    }
  }

  const goToNext = () => {
    if (hasNext) {
      onChangePage(currentPage + 1)
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      {/* Info */}
      {totalItems > 0 && (
        <p className="text-sm text-neutral-600">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
        </p>
      )}
      {totalItems === 0 && <div />}

      {/* Navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!hasPrevious}
          iconLeft={ChevronLeftIcon}
          onClick={goToPrevious}
        >
          Previous
        </Button>

        <div className="hidden items-center gap-1 sm:flex">
          {pages.map((page, index) => (
            <button
              key={`page-${page}-${index}`}
              onClick={() => goToPage(page)}
              disabled={page === '...'}
              className={[
                'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                page === currentPage
                  ? 'bg-primary-600 text-white shadow-md'
                  : page === '...'
                    ? 'text-neutral-500 cursor-default'
                    : 'border border-neutral-300 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 active:scale-95',
              ].join(' ')}
            >
              {page}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={!hasNext}
          iconRight={ChevronRightIcon}
          onClick={goToNext}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
