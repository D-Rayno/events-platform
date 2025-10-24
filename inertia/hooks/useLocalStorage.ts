import { useState, useEffect } from 'react'

/**
 * Local storage React hook
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    const storedValue = localStorage.getItem(key)
    return storedValue ? JSON.parse(storedValue) : defaultValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  const remove = () => {
    localStorage.removeItem(key)
    setValue(defaultValue)
  }

  return {
    value,
    setValue,
    remove,
  }
}
