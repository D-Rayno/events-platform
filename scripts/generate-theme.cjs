// scripts/generate-theme.cjs
const fs = require('fs')
const path = require('path')

const themeConfigPath = path.join(__dirname, '../inertia/theme.config.json')
const outputCssPath = path.join(__dirname, '../inertia/css/theme-variables.css')

function generateThemeVariables() {
  console.log('🎨 Generating theme variables from theme.config.json...')

  // Read theme config
  const themeConfig = JSON.parse(fs.readFileSync(themeConfigPath, 'utf-8'))

  let cssContent = '/* Auto-generated from theme.config.json - DO NOT EDIT MANUALLY */\n\n'
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
  console.log(`✅ Theme variables generated at: ${outputCssPath}\n`)
}

// Run the generator
generateThemeVariables()
