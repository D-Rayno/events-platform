// scripts/generate-theme.cjs
const fs = require('fs')
const path = require('path')

const themeConfigTsPath = path.join(__dirname, '../config/theme.ts')
const inertiaThemeConfigPath = path.join(__dirname, '../inertia/theme.config.json')
const outputCssPath = path.join(__dirname, '../inertia/css/theme-variables.css')

function loadThemeFromTypeScript() {
  console.log('📋 Loading theme configuration from config/theme.ts...')
  
  // Check if theme.ts exists
  if (!fs.existsSync(themeConfigTsPath)) {
    console.error('❌ config/theme.ts not found!')
    console.log('💡 Creating a default config/theme.ts...')
    
    const defaultThemeTs = `// config/theme.ts
export default {
  app: {
    name: 'G-Agency Events',
    tagline: 'Découvrez et créez des événements inoubliables',
    description: 'La plateforme moderne pour organiser et participer aux meilleurs événements près de chez vous'
  },
  branding: {
    logo: {
      text: 'G-Agency Events',
      icon: '🎪',
      url: '/'
    },
    favicon: '/favicon.ico'
  },
  colors: {
    primary: {
      '50': '#f0f9ff',
      '100': '#e0f2fe',
      '200': '#bae6fd',
      '300': '#7dd3fc',
      '400': '#38bdf8',
      '500': '#0ea5e9',
      '600': '#0284c7',
      '700': '#0369a1',
      '800': '#075985',
      '900': '#0c4a6e',
      '950': '#082f49',
      DEFAULT: '#0ea5e9'
    },
    secondary: {
      '50': '#faf5ff',
      '100': '#f3e8ff',
      '200': '#e9d5ff',
      '300': '#d8b4fe',
      '400': '#c084fc',
      '500': '#a855f7',
      '600': '#9333ea',
      '700': '#7e22ce',
      '800': '#6b21a8',
      '900': '#581c87',
      '950': '#3b0764',
      DEFAULT: '#a855f7'
    },
    success: {
      '50': '#f0fdf4',
      '100': '#dcfce7',
      '200': '#bbf7d0',
      '300': '#86efac',
      '400': '#4ade80',
      '500': '#22c55e',
      '600': '#16a34a',
      '700': '#15803d',
      '800': '#166534',
      '900': '#14532d',
      DEFAULT: '#22c55e'
    },
    error: {
      '50': '#fef2f2',
      '100': '#fee2e2',
      '200': '#fecaca',
      '300': '#fca5a5',
      '400': '#f87171',
      '500': '#ef4444',
      '600': '#dc2626',
      '700': '#b91c1c',
      '800': '#991b1b',
      '900': '#7f1d1d',
      DEFAULT: '#ef4444'
    },
    warning: {
      '50': '#fffbeb',
      '100': '#fef3c7',
      '200': '#fde68a',
      '300': '#fcd34d',
      '400': '#fbbf24',
      '500': '#f59e0b',
      '600': '#d97706',
      '700': '#b45309',
      '800': '#92400e',
      '900': '#78350f',
      DEFAULT: '#f59e0b'
    },
    info: {
      '50': '#eff6ff',
      '100': '#dbeafe',
      '200': '#bfdbfe',
      '300': '#93c5fd',
      '400': '#60a5fa',
      '500': '#3b82f6',
      '600': '#2563eb',
      '700': '#1d4ed8',
      '800': '#1e40af',
      '900': '#1e3a8a',
      DEFAULT: '#3b82f6'
    },
    neutral: {
      '50': '#fafafa',
      '100': '#f5f5f5',
      '200': '#e5e5e5',
      '300': '#d4d4d4',
      '400': '#a3a3a3',
      '500': '#737373',
      '600': '#525252',
      '700': '#404040',
      '800': '#262626',
      '900': '#171717',
      '950': '#0a0a0a',
      DEFAULT: '#737373'
    }
  },
  theme: {
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
      '2xl': '1.5rem',
      full: '9999px'
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      display: ['Poppins', 'Inter', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace']
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem'
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    }
  },
  features: {
    enableDarkMode: false,
    enableNotifications: true,
    enableSearch: true,
    enableFilters: true,
    maxUploadSize: 5242880,
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    itemsPerPage: 12,
    enableAnimations: true,
    enableSocialSharing: true
  },
  social: {
    facebook: 'https://facebook.com/gagncy',
    twitter: 'https://twitter.com/gagncy',
    instagram: 'https://instagram.com/gagncy',
    linkedin: 'https://linkedin.com/company/gagncy'
  },
  contact: {
    email: 'contact@g-agency.dz',
    phone: '+213 555 123 456',
    address: 'Algiers, Algérie'
  },
  seo: {
    defaultTitle: 'G-Agency Events - Plateforme d\\'Événements en Algérie',
    titleTemplate: '%s | G-Agency Events',
    description: 'Découvrez et participez aux meilleurs événements près de chez vous. Conférences, ateliers, concerts et plus encore.',
    keywords: ['événements', 'algérie', 'conférences', 'ateliers', 'concerts'],
    ogImage: '/images/og-image.jpg'
  },
  animations: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500
    },
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
} as const
`
    
    const configDir = path.join(__dirname, '../config')
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true })
    }
    
    fs.writeFileSync(themeConfigTsPath, defaultThemeTs)
    console.log('✅ Created default config/theme.ts')
  }
  
  // Create a temporary JS file to load the TypeScript config
  const tempJsPath = path.join(__dirname, '../build/theme-temp.js')
  
  try {
    // Compile TypeScript to JavaScript
    console.log('🔨 Compiling TypeScript config...')
    
    // Ensure build directory exists
    const buildDir = path.join(__dirname, '../build')
    if (!fs.existsSync(buildDir)) {
      fs.mkdirSync(buildDir, { recursive: true })
    }
    
    // Use ts-node to compile and execute
    const tsNodePath = path.join(__dirname, '../node_modules/.bin/ts-node')
    
    // Create a simple loader script
    const loaderScript = `
const theme = require('${themeConfigTsPath.replace(/\\/g, '/')}').default;
console.log(JSON.stringify(theme));
`
    
    const loaderPath = path.join(__dirname, '../build/theme-loader.js')
    fs.writeFileSync(loaderPath, loaderScript)
    
    // Execute with node (since config/theme.ts should export a plain object)
    let themeJson
    try {
      // Try direct require if it's already compiled
      delete require.cache[require.resolve(themeConfigTsPath)]
      const themeModule = require(themeConfigTsPath)
      const themeData = themeModule.default || themeModule
      themeJson = JSON.stringify(themeData, null, 2)
    } catch (err) {
      // Fallback: read as text and extract the object
      console.log('⚠️  Direct require failed, parsing TypeScript file...')
      const tsContent = fs.readFileSync(themeConfigTsPath, 'utf-8')
      
      // Extract the exported object (simple parser)
      const match = tsContent.match(/export default\s+(\{[\s\S]+\})\s+as const/m)
      if (!match) {
        throw new Error('Could not parse theme.ts - invalid format')
      }
      
      // Use eval to parse the object (safe since it's our own config file)
      const themeData = eval(`(${match[1]})`)
      themeJson = JSON.stringify(themeData, null, 2)
    }
    
    // Write to inertia folder
    fs.writeFileSync(inertiaThemeConfigPath, themeJson)
    console.log('✅ Generated inertia/theme.config.json from config/theme.ts\n')
    
    // Clean up temp files
    if (fs.existsSync(loaderPath)) {
      fs.unlinkSync(loaderPath)
    }
    if (fs.existsSync(tempJsPath)) {
      fs.unlinkSync(tempJsPath)
    }
    
    return JSON.parse(themeJson)
    
  } catch (error) {
    console.error('❌ Error loading TypeScript config:', error.message)
    throw error
  }
}

function generateThemeVariables(themeConfig) {
  console.log('🎨 Generating CSS theme variables...')

  let cssContent = '/* Auto-generated from config/theme.ts - DO NOT EDIT MANUALLY */\n\n'
  cssContent += '@theme {\n'

  // Generate color variables
  console.log('  ✓ Processing colors...')
  Object.entries(themeConfig.colors).forEach(([colorName, shades]) => {
    Object.entries(shades).forEach(([shade, value]) => {
      if (shade === 'DEFAULT') {
        cssContent += `  --color-${colorName}: ${value};\n`
      } else {
        cssContent += `  --color-${colorName}-${shade}: ${value};\n`
      }
    })
  })

  cssContent += '\n'

  // Generate border radius variables
  console.log('  ✓ Processing border radius...')
  Object.entries(themeConfig.theme.borderRadius).forEach(([name, value]) => {
    cssContent += `  --radius-${name}: ${value};\n`
  })

  cssContent += '\n'

  // Generate shadow variables
  console.log('  ✓ Processing shadows...')
  Object.entries(themeConfig.theme.shadows).forEach(([name, value]) => {
    cssContent += `  --shadow-${name}: ${value};\n`
  })

  cssContent += '\n'

  // Generate font family variables
  console.log('  ✓ Processing fonts...')
  Object.entries(themeConfig.theme.fontFamily).forEach(([name, value]) => {
    const fontValue = Array.isArray(value) ? value.join(', ') : value
    cssContent += `  --font-${name}: ${fontValue};\n`
  })

  cssContent += '\n'

  // Generate font size variables
  console.log('  ✓ Processing font sizes...')
  Object.entries(themeConfig.theme.fontSize).forEach(([name, value]) => {
    cssContent += `  --font-size-${name}: ${value};\n`
  })

  cssContent += '}\n'

  // Write to file
  fs.writeFileSync(outputCssPath, cssContent)
  console.log(`✅ Theme CSS variables generated at: ${outputCssPath}\n`)
}

// Run both operations
try {
  const themeConfig = loadThemeFromTypeScript()
  generateThemeVariables(themeConfig)
  console.log('🎉 Theme setup completed successfully!')
  console.log('\n📋 Summary:')
  console.log(`   Source:  config/theme.ts`)
  console.log(`   JSON:    inertia/theme.config.json`)
  console.log(`   CSS:     inertia/css/theme-variables.css`)
} catch (error) {
  console.error('❌ Error during theme setup:', error.message)
  console.error(error.stack)
  process.exit(1)
}