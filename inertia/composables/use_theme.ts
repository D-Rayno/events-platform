import { computed } from 'vue'
import themeConfig from '../theme.config.json'

interface ColorScale {
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

export function use_theme() {
  const config = computed<ThemeConfig>(() => themeConfig as ThemeConfig)

  const appName = computed(() => config.value.app.name)
  const appTagline = computed(() => config.value.app.tagline)
  const logo = computed(() => config.value.branding.logo)
  const colors = computed(() => config.value.colors)
  const features = computed(() => config.value.features)

  const getBannerImage = (page: string = 'default') => {
    return config.value.images.banner[page] || config.value.images.banner.default
  }

  const getPlaceholder = (type: string = 'event') => {
    return config.value.images.placeholder[type] || config.value.images.placeholder.event
  }

  const getSocialLinks = () => config.value.social
  const getContactInfo = () => config.value.contact

  const formatTitle = (pageTitle?: string) => {
    if (!pageTitle) return config.value.seo.defaultTitle
    return config.value.seo.titleTemplate.replace('%s', pageTitle)
  }

  const getColor = (colorPath: string) => {
    const parts = colorPath.split('.')
    let value: any = themeConfig.colors
    for (const part of parts) {
      value = value?.[part]
    }
    return value || colorPath
  }

  const getAnimation = (speed: 'fast' | 'normal' | 'slow' = 'normal') => {
    return themeConfig.animations.duration[speed]
  }

  return {
    config,
    appName,
    appTagline,
    logo,
    colors,
    features,
    getBannerImage,
    getPlaceholder,
    getSocialLinks,
    getContactInfo,
    formatTitle,
    getColor,
    getAnimation,
  }
}
