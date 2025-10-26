// inertia/hooks/useTheme.ts
import { useCallback, useMemo } from 'react'
import themeConfigJson from '../theme.config.json'

/* ---------- Types (copied from original composable) ---------- */
export interface ColorScale {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
  950?: string
  DEFAULT: string
}

export interface ThemeConfig {
  app: {
    name: string
    tagline: string
    description: string
  }
  branding: {
    logo: {
      text: string
      icon: string
      url: string
    }
    favicon: string
  }
  images: {
    banner: Record<string, string>
    placeholder: Record<string, string>
  }
  colors: {
    primary: ColorScale
    secondary: ColorScale
    success: ColorScale
    error: ColorScale
    warning: ColorScale
    info: ColorScale
    neutral: ColorScale
  }
  theme: {
    borderRadius: Record<string, string>
    fontFamily: Record<string, string | string[]>
    fontSize: Record<string, string>
    shadows: Record<string, string>
  }
  features: {
    enableDarkMode: boolean
    enableNotifications: boolean
    enableSearch: boolean
    enableFilters: boolean
    maxUploadSize: number
    allowedFileTypes: string[]
    itemsPerPage: number
    enableAnimations: boolean
    enableSocialSharing: boolean
  }
  social: Record<string, string>
  contact: {
    email: string
    phone: string
    address: string
  }
  seo: {
    defaultTitle: string
    titleTemplate: string
    description: string
    keywords: string[]
    ogImage: string
  }
  animations: {
    duration: {
      fast: number
      normal: number
      slow: number
    }
    easing: string
  }
}

/* ---------- Hook ---------- */
export function useTheme() {
  // themeConfigJson is static JSON; memoize the typed object for TS niceness
  const config = useMemo<ThemeConfig>(() => themeConfigJson as unknown as ThemeConfig, [])

  // small memoized getters (cheap but keeps parity with Vue computed)
  const appName = useMemo(() => config.app.name, [config])
  const appTagline = useMemo(() => config.app.tagline, [config])
  const logo = useMemo(() => config.branding.logo, [config])
  const colors = useMemo(() => config.colors, [config])
  const features = useMemo(() => config.features, [config])

  const getBannerImage = useCallback(
    (page: string = 'default') => {
      return config.images.banner[page] || config.images.banner.default
    },
    [config]
  )

  const getPlaceholder = useCallback(
    (type: string = 'event') => {
      return config.images.placeholder[type] || config.images.placeholder.event
    },
    [config]
  )

  const getSocialLinks = useCallback(() => config.social, [config])
  const getContactInfo = useCallback(() => config.contact, [config])

  const formatTitle = useCallback(
    (pageTitle?: string) => {
      if (!pageTitle) return config.seo.defaultTitle
      return config.seo.titleTemplate.replace('%s', pageTitle)
    },
    [config]
  )

  const getColor = useCallback(
    (colorPath: string) => {
      const parts = colorPath.split('.').filter(Boolean)
      let value: any = config.colors as any
      for (const part of parts) {
        if (value == null) break
        value = value[part]
      }
      return value ?? colorPath
    },
    [config]
  )

  const getAnimation = useCallback(
    (speed: 'fast' | 'normal' | 'slow' = 'normal') => {
      return config.animations.duration[speed]
    },
    [config]
  )

  return {
    // raw config
    config,

    // basic values
    appName,
    appTagline,
    logo,
    colors,
    features,

    // helpers
    getBannerImage,
    getPlaceholder,
    getSocialLinks,
    getContactInfo,
    formatTitle,
    getColor,
    getAnimation,
  } as const
}
