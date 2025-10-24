import { useMemo } from 'react'
import { motion } from 'motion/react'

interface Props {
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  label?: string
  error?: string
  hint?: string
  required?: boolean
  rows?: number
  maxLength?: number
  showCount?: boolean
  resize?: boolean
  [key: string]: any
}

export default function TextArea({
  value = '',
  onChange,
  onBlur,
  label,
  error,
  hint,
  required = false,
  rows = 4,
  maxLength,
  showCount = false,
  resize = true,
  ...rest
}: Props) {
  const textareaClasses = useMemo(
    () =>
      [
        'w-full px-4 py-2.5 border rounded-lg transition-all duration-200 placeholder:text-neutral-400',
        'focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none',
        'disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-500',
        error
          ? 'border-error-500 focus:ring-error-500/20 focus:border-error-500'
          : 'border-neutral-300 hover:border-neutral-400',
        resize ? 'resize-y' : 'resize-none',
      ].join(' '),
    [error, resize]
  )

  const characterCount = useMemo(() => {
    const length = value?.length || 0
    if (maxLength) {
      return `${length}/${maxLength}`
    }
    return `${length}`
  }, [value, maxLength])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value)
    }
  }

  const handleBlur = () => {
    if (onBlur) onBlur()
  }

  return (
    <div className="space-y-2">
      {(label || showCount) && (
        <div className="flex items-center justify-between">
          {label && (
            <label className="block text-sm font-medium text-neutral-700">
              {label}
              {required && <span className="text-error-500 ml-0.5">*</span>}
            </label>
          )}
          {showCount && <span className="text-xs text-neutral-500">{characterCount}</span>}
        </div>
      )}

      <motion.textarea
        value={value}
        rows={rows}
        maxLength={maxLength}
        className={textareaClasses}
        onChange={handleChange}
        onBlur={handleBlur}
        {...rest}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      />

      {error && (
        <motion.p
          className="text-sm text-error-600 flex items-start gap-1"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.15 }}
        >
          <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </motion.p>
      )}

      {hint && !error && <p className="text-sm text-neutral-500">{hint}</p>}
    </div>
  )
}
