import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface Props {
  value?: string | number;
  onChange?: (value: string | number) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  iconRight?: React.ComponentType<{ className?: string }>;
  type?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  autoFocus?: boolean;
  [key: string]: any;
}

export default function Password({
  value = '',
  onChange,
  onBlur,
  onFocus,
  label,
  error,
  hint,
  required = false,
  icon: Icon,
  iconRight: IconRight,
  type = 'text',
  size = 'md',
  disabled = false,
  autoFocus = false,
  ...rest
}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const inputType = useMemo(() => {
    if (type === 'password') {
      return showPassword ? 'text' : 'password';
    }
    return type;
  }, [type, showPassword]);

  const sizeClasses = {
    sm: 'px-3.5 py-2.5 text-sm',
    md: 'px-4 py-3.5 text-base',
    lg: 'px-5 py-4 text-lg',
  };

  const inputClasses = [
    'w-full border-2 rounded-xl font-medium transition-all duration-300 ease-out',
    'placeholder:text-gray-400 placeholder:font-normal',
    'focus:outline-none',
    'disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500 disabled:border-gray-200',
    error
      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 bg-red-50/30 text-red-900'
      : isFocused
        ? 'border-blue-500 ring-4 ring-blue-500/20 bg-white shadow-xl shadow-blue-500/10 scale-[1.01]'
        : hasValue
          ? 'border-gray-300 bg-white shadow-sm'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white',
    sizeClasses[size],
    Icon ? 'pl-12' : '',
    IconRight || type === 'password' ? 'pr-12' : '',
  ].join(' ');

  const iconSize = useMemo(() => {
    const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };
    return sizes[size];
  }, [size]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-2 group">
      {label && (
        <label
          className="block text-sm font-semibold text-gray-900 transition-all duration-300 group-hover:text-blue-600 group-hover:translate-x-0.5"
        >
          <motion.span initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            {label}
            {required && <span className="text-red-500 ml-1 animate-pulse">*</span>}
          </motion.span>
        </label>
      )}

      <motion.div
        className="relative"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05 }}
      >
        {Icon && (
          <div
            className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 pointer-events-none z-10 ${
              error ? 'text-red-500 scale-110' : isFocused ? 'text-blue-600 scale-110 rotate-12' : 'text-gray-400'
            }`}
          >
            <Icon className={iconSize} />
          </div>
        )}

        <input
          value={value}
          type={inputType}
          className={inputClasses}
          disabled={disabled}
          autoFocus={autoFocus}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          {...rest}
        />

        {(IconRight || type === 'password') && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer">
            {type === 'password' && !disabled ? (
              <button
                type="button"
                onClick={togglePassword}
                className="text-gray-400 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeSlashIcon className={iconSize} /> : <EyeIcon className={iconSize} />}
              </button>
            ) : (
              IconRight && <IconRight className={`${iconSize} text-gray-400`} />
            )}
          </div>
        )}

        <div
          className={`absolute inset-0 rounded-xl pointer-events-none transition-all duration-300 ${
            isFocused ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="absolute inset-0 rounded-xl bg-linear-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 animate-gradient" />
        </div>

        {isFocused && !error && (
          <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-white/20 to-transparent" />
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, translateY: -1, scale: 0.95 }}
            animate={{ opacity: 1, translateY: 0, scale: 1 }}
            exit={{ opacity: 0, translateY: -1, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex items-start gap-2 text-sm text-red-600 font-medium "
          >
            <svg className="w-4 h-4 mt-0.5 shrink-0 animate-bounce-subtle" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
            <span className="animate-slide-in-left">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hint && !error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="text-sm text-gray-500 flex items-center gap-1.5"
          >
            <svg className="w-4 h-4 animate-pulse-subtle" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                clipRule="evenodd"
              />
            </svg>
            {hint}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}