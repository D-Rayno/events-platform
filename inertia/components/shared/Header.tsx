import { useState, useRef, useEffect } from 'react'
import { Link, router, usePage } from '@inertiajs/react'
import { Bars3Icon, XMarkIcon, ChevronDownIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'motion/react'
import Button from '~/components/ui/Button'
import Avatar from '~/components/ui/Avatar'
import { useAuthStore } from '~/stores/auth'
import { useTheme } from '~/hooks/useTheme'

export default function Header() {
  // Use auth store instead of prop
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)
  const fullName = useAuthStore((s) => s.fullName)
  const avatarUrl = useAuthStore((s) => s.avatarUrl)

  const { props } = usePage()
  const { config } = useTheme()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const isActive = (name: string): boolean => {
    return props.component?.startsWith(name) || false
  }

  const navLinks = [
    { label: 'Événements', href: '/events', name: 'events' },
    {
      label: 'Mes Inscriptions',
      href: '/registrations',
      name: 'registrations',
      auth: true,
    },
    { label: 'Profil', href: '/profile', name: 'profile', auth: true },
  ]

  const activeLinks = navLinks.filter((link) => !link.auth || isAuthenticated)

  const handleLogout = () => {
    router.post(
      '/auth/logout',
      {},
      {
        onSuccess: () => {
          setUserMenuOpen(false)
        },
      }
    )
  }

  // Close user menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [userMenuOpen])

  return (
    <motion.header
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-neutral-200/80 shadow-sm"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-linear-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <span className="text-2xl">{config.branding.logo.icon}</span>
            </div>
            <span className="text-xl font-bold bg-linear-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent hidden sm:inline group-hover:from-primary-700 group-hover:to-secondary-700 transition-all">
              {config.branding.logo.text}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {activeLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.05 }}
              >
                <Link
                  href={link.href}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group ${
                    isActive(link.name)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  {isActive(link.name) && (
                    <div className="absolute inset-0 bg-linear-to-r from-primary-500/10 to-secondary-500/10 rounded-xl" />
                  )}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Authenticated User */}
            {isAuthenticated && user ? (
              <div className="hidden md:flex items-center gap-4" ref={userMenuRef}>
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-50 transition-all group"
                    aria-label="Menu utilisateur"
                    aria-expanded={userMenuOpen}
                  >
                    <Avatar name={fullName} src={avatarUrl || undefined} size="sm" />
                    <div className="hidden lg:block text-left">
                      <div className="text-sm font-medium text-neutral-900 group-hover:text-primary-600 transition-colors">
                        {user.firstName}
                      </div>
                      <div className="text-xs text-neutral-500">Mon compte</div>
                    </div>
                    <ChevronDownIcon
                      className={`w-4 h-4 text-neutral-600 transition-all duration-300 ${
                        userMenuOpen ? 'rotate-180 text-primary-600' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden"
                      >
                        <div className="px-4 py-4 border-b border-neutral-100 bg-linear-to-r from-primary-50 to-secondary-50">
                          <div className="flex items-center gap-3">
                            <Avatar name={fullName} src={avatarUrl || undefined} size="md" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-neutral-900 truncate">
                                {fullName}
                              </p>
                              <p className="text-xs text-neutral-600 truncate">{user.email}</p>
                            </div>
                          </div>
                        </div>

                        <div className="py-2">
                          <Link
                            href="/profile"
                            className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <UserCircleIcon className="w-5 h-5" />
                            <span>Mon profil</span>
                          </Link>

                          <Link
                            href="/registrations"
                            className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                            </svg>
                            <span>Mes inscriptions</span>
                          </Link>
                        </div>

                        <div className="border-t border-neutral-100">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-error-600 hover:bg-error-50 transition-colors"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                            <span>Déconnexion</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  href="/auth/login"
                  className="hidden sm:inline-flex"
                >
                  Connexion
                </Button>
                <Button variant="primary" size="sm" href="/auth/register">
                  S'inscrire
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-neutral-100 rounded-xl transition-colors"
              aria-label="Menu de navigation"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6 text-neutral-700" />
              ) : (
                <Bars3Icon className="w-6 h-6 text-neutral-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-neutral-200 py-4 space-y-2 bg-white/95 backdrop-blur-lg overflow-hidden"
            >
              {activeLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(link.name)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {!isAuthenticated && (
                <div className="pt-2 border-t border-neutral-200 space-y-2 mt-4">
                  <Link
                    href="/auth/login"
                    className="block px-4 py-3 text-center rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block px-4 py-3 text-center rounded-xl text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    S'inscrire
                  </Link>
                </div>
              )}

              {isAuthenticated && (
                <div className="pt-2 border-t border-neutral-200 mt-4">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      handleLogout()
                    }}
                    className="block w-full px-4 py-3 text-center rounded-xl text-sm font-medium text-error-600 hover:bg-error-50 transition-all"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
