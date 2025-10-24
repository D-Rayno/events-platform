import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDownIcon, CheckIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useTheme } from '~/hooks/useTheme'
import { createPortal } from 'react-dom'

interface Option {
  value: string | number
  label: string
  disabled?: boolean
  icon?: React.ComponentType<{ className?: string }>
  description?: string
}

interface Props {
  value?: string | number
  onChange?: (value: string | number) => void
  options: Option[]
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  required?: boolean
  searchable?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function Select({
  value,
  onChange,
  options,
  label,
  placeholder = 'Sélectionner une option',
  error,
  hint,
  required = false,
  searchable = false,
  disabled = false,
  size = 'md',
}: Props) {
  const { getAnimation } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const triggerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })

  const selectedOption = useMemo(() => {
    return options.find((opt) => opt.value === value)
  }, [options, value])

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery) return options
    const query = searchQuery.toLowerCase()
    return options.filter((opt) => opt.label.toLowerCase().includes(query))
  }, [searchable, searchQuery, options])

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
  }

  const triggerClasses = [
    'w-full flex items-center justify-between border-2 rounded-xl transition-all duration-300 cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
    error
      ? 'border-error-300 hover:border-error-400 bg-error-50/30'
      : isOpen
        ? 'border-primary-500 ring-4 ring-primary-500/20 bg-white shadow-lg'
        : 'border-neutral-200 hover:border-neutral-300 bg-white',
    sizeClasses[size],
  ].join(' ')

  const selectOption = (option: Option) => {
    if (option.disabled) return
    if (onChange) onChange(option.value)
    setIsOpen(false)
    setSearchQuery('')
  }

  // Update dropdown position when opened or on scroll/resize
  const updateDropdownPosition = () => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top
      const dropdownHeight = 300 // approximate max height

      // Decide if dropdown should open above or below
      const shouldOpenAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow

      setDropdownPosition({
        top: shouldOpenAbove ? rect.top + window.scrollY - dropdownHeight - 8 : rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      })
    }
  }

  useEffect(() => {
    updateDropdownPosition()
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleScroll = () => updateDropdownPosition()
    const handleResize = () => updateDropdownPosition()

    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleResize)
    }
  }, [isOpen])

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Close on escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  return (
    <div className="space-y-2 relative">
      {label && (
        <motion.label
          className="block text-sm font-semibold text-neutral-800"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </motion.label>
      )}

      <div ref={triggerRef}>
        <motion.div
          className={triggerClasses}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          whileTap={{ scale: disabled ? 1 : 0.98 }}
        >
          <span className={selectedOption ? 'text-neutral-900 font-medium' : 'text-neutral-400'}>
            {selectedOption ? (
              <span className="flex items-center gap-2">
                {selectedOption.icon && <selectedOption.icon className="w-5 h-5" />}
                {selectedOption.label}
              </span>
            ) : (
              placeholder
            )}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: getAnimation('fast') / 1000 }}
          >
            <ChevronDownIcon className="w-5 h-5 text-neutral-400" />
          </motion.div>
        </motion.div>
      </div>

      {/* Portal for dropdown */}
      {isOpen &&
        createPortal(
          <AnimatePresence>
            <motion.div
              ref={dropdownRef}
              className="fixed bg-white rounded-xl shadow-2xl border-2 border-neutral-200 overflow-hidden"
              style={{
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                width: `${dropdownPosition.width}px`,
                zIndex: 9999,
              }}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{
                duration: getAnimation('normal') / 1000,
                type: 'spring',
                stiffness: 300,
              }}
            >
              {searchable && (
                <div className="p-3 border-b border-neutral-200 bg-neutral-50">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      type="text"
                      placeholder="Rechercher..."
                      className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                    />
                  </div>
                </div>
              )}

              <div className="max-h-72 overflow-y-auto">
                {filteredOptions.map((option, index) => (
                  <motion.div
                    key={option.value}
                    className={`px-4 py-3 cursor-pointer transition-all duration-150 ${
                      option.disabled
                        ? 'opacity-50 cursor-not-allowed'
                        : option.value === value
                          ? 'bg-primary-50 text-primary-700'
                          : 'hover:bg-neutral-50'
                    }`}
                    onClick={() => selectOption(option)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={!option.disabled ? { x: 4 } : {}}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {option.icon && <option.icon className="w-5 h-5" />}
                        <div>
                          <div className="font-medium">{option.label}</div>
                          {option.description && (
                            <div className="text-xs text-neutral-500 mt-0.5">
                              {option.description}
                            </div>
                          )}
                        </div>
                      </div>
                      {option.value === value && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <CheckIcon className="w-5 h-5 text-primary-600" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {filteredOptions.length === 0 && (
                  <div className="px-4 py-8 text-center text-neutral-500">
                    <p className="text-sm">Aucun résultat trouvé</p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}

      {(error || hint) && (
        <motion.p
          className={`text-sm flex items-center gap-1.5 ${error ? 'text-error-600 font-medium' : 'text-neutral-500'}`}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error && (
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {error || hint}
        </motion.p>
      )}
    </div>
  )
}