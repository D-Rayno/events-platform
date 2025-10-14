import { computed } from 'vue'
import themeConfig from '../info.config.json'

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
  colors: Record<string, string>
  theme: {
    borderRadius: string
    fontFamily: string
    fontSize: {
      base: string
      scale: number
    }
  }
  features: {
    enableDarkMode: boolean
    enableNotifications: boolean
    enableSearch: boolean
    enableFilters: boolean
    maxUploadSize: number
    allowedFileTypes: string[]
    itemsPerPage: number
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
}

export function useTheme() {
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
  }
}
