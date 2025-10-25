# 🎨 Theme System Documentation

## Overview

This project uses an automated theme system that generates CSS variables from a central configuration file (`inertia/theme.config.json`). This ensures consistency across the entire application including emails, web pages, and Tailwind CSS.

## Architecture

```
inertia/
├── theme.config.json          # Central theme configuration (SOURCE OF TRUTH)
├── css/
│   ├── app.css               # Main CSS file (imports theme-variables.css)
│   └── theme-variables.css   # Auto-generated CSS variables (DO NOT EDIT)
├── hooks/
│   └── useTheme.ts           # React hook for accessing theme in components

app/services/
└── email_theme_helper.ts     # Helper for email templates

scripts/
└── generate-theme.ts         # Script that generates theme-variables.css

resources/views/emails/        # Email templates using theme variables
```

## How It Works

### 1. Configuration (`inertia/theme.config.json`)

The `theme.config.json` file is the **single source of truth** for all theme-related values:

```json
{
  "app": {
    "name": "G-Agency Events",
    "tagline": "Discover amazing events"
  },
  "colors": {
    "primary": {
      "500": "#0ea5e9",
      "600": "#0284c7"
    }
  }
}
```

### 2. Automatic Generation

When you run `npm run dev` or `npm run build`, the script automatically:

1. Reads `theme.config.json`
2. Generates CSS variables in `inertia/css/theme-variables.css`
3. Makes variables available to:
   - Tailwind CSS (via `@theme` directive)
   - Regular CSS (via `var(--color-primary-500)`)
   - React components (via `useTheme()` hook)
   - Email templates (via `EmailThemeHelper`)

### 3. Generated CSS Variables

The generated file looks like:

```css
@theme {
  --color-primary-500: #0ea5e9;
  --color-primary-600: #0284c7;
  --radius-md: 0.5rem;
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

## Usage

### In React Components

```tsx
import { useTheme } from '#hooks/useTheme'

function MyComponent() {
  const { colors, appName, getColor } = useTheme()

  return <div style={{ color: colors.primary['500'] }}>{appName}</div>
}
```

### In Tailwind CSS

```tsx
<div className="bg-primary-500 text-white">Hello World</div>
```

### In Regular CSS

```css
.my-class {
  background-color: var(--color-primary-500);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}
```

### In Email Templates (Edge.js)

```html
<div style="background: {{ theme.colors.primary }};">{{ appName }}</div>
```

The `EmailThemeHelper` automatically injects:

- `theme` - Color values and fonts
- `emailStyles` - Complete inline CSS styles
- `appName` - Application name
- `appTagline` - Application tagline
- `appUrl` - Application URL
- `contactEmail` - Contact email

## Making Changes

### To Update Colors

1. Edit `inertia/theme.config.json`:

```json
{
  "colors": {
    "primary": {
      "500": "#your-new-color"
    }
  }
}
```

2. Run `npm run generate:theme` (or restart dev server)
3. Changes propagate automatically everywhere!

### To Add New Theme Variables

Add to `theme.config.json`:

```json
{
  "theme": {
    "spacing": {
      "card": "1.5rem"
    }
  }
}
```

Update `scripts/generate-theme.ts` to process the new section:

```typescript
// Add in generateThemeVariables() function
Object.entries(themeConfig.theme.spacing).forEach(([name, value]) => {
  cssContent += `  --spacing-${name}: ${value};\n`
})
```

## Email System Integration

### How Emails Get Theme Variables

1. `EmailService` imports `EmailThemeHelper`
2. `getCommonEmailVars()` generates theme data
3. Variables passed to Edge.js templates
4. Templates use inline styles with theme values

### Example Email Service Usage

```typescript
import EmailThemeHelper from '#services/email_theme_helper'

// In any email method
await mail.send((message) => {
  message
    .to(user.email)
    .subject('Your Subject')
    .htmlView('emails/your_template', {
      ...this.getCommonEmailVars(), // Injects theme
      firstName: user.firstName,
      // ... other variables
    })
})
```

### Available Email Variables

Every email template automatically receives:

```typescript
{
  theme: {
    colors: {
      primary: '#0ea5e9',
      secondary: '#a855f7',
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
      text: '#262626',
      textLight: '#525252',
      background: '#fafafa',
      border: '#e5e5e5'
    },
    fonts: {
      sans: 'Inter, system-ui, sans-serif',
      display: 'Poppins, Inter, sans-serif'
    }
  },
  emailStyles: '...complete CSS...',
  appName: 'G-Agency Events',
  appTagline: 'Découvrez et créez des événements...',
  appUrl: 'http://localhost:3333',
  contactEmail: 'contact@eventhub.dz'
}
```

## Email Template Structure

All email templates follow this structure:

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Title</title>
    <style>
      {{{ emailStyles }}}
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <h1>{{ appName }}</h1>
        <p>{{ appTagline }}</p>
      </div>

      <!-- Content -->
      <div class="content">
        <!-- Your content here -->
      </div>

      <!-- Footer -->
      <div class="footer">
        <!-- Footer content -->
      </div>
    </div>
  </body>
</html>
```

## Available Email CSS Classes

The `EmailThemeHelper` provides these pre-styled classes:

### Layout

- `.container` - Main email container (600px max-width)
- `.header` - Gradient header with brand colors
- `.content` - Main content area with padding
- `.footer` - Footer with dark background

### Components

- `.button` - Primary CTA button with gradient
- `.info-box` - Information box with left border
- `.warning-box` - Warning box (yellow)
- `.success-box` - Success box (green)
- `.qr-code-box` - Dashed border box for QR codes
- `.feature-grid` - Container for feature items
- `.feature-item` - Individual feature with background
- `.feature-title` - Feature title text
- `.feature-description` - Feature description text

### Example Usage

```html
<div class="info-box">
  <h2>Event Details</h2>
  <p><strong>Date:</strong> {{ eventDate }}</p>
</div>

<div class="warning-box">
  <p><strong>Important:</strong> Don't forget your QR code!</p>
</div>

<a href="{{ url }}" class="button"> View Event </a>
```

## Commands

### Generate Theme Variables

```bash
npm run generate:theme
```

### Development (auto-generates theme)

```bash
npm run dev
```

### Production Build (auto-generates theme)

```bash
npm run build
```

## File Structure

```
📁 Project Root
├── 📁 inertia/
│   ├── 📄 theme.config.json          ← Edit this to change theme
│   ├── 📁 css/
│   │   ├── 📄 app.css                ← Imports theme-variables.css
│   │   └── 📄 theme-variables.css    ← Auto-generated, don't edit
│   └── 📁 hooks/
│       └── 📄 useTheme.ts            ← React hook
├── 📁 app/services/
│   └── 📄 email_theme_helper.ts      ← Email theme helper
├── 📁 scripts/
│   └── 📄 generate-theme.ts          ← Generation script
└── 📁 resources/views/emails/
    ├── 📄 verify_email.edge
    ├── 📄 reset_password.edge
    ├── 📄 welcome.edge
    ├── 📄 event_registration.edge
    └── 📄 event_reminder.edge
```

## Best Practices

### ✅ Do's

- **Always** edit `theme.config.json` for theme changes
- Use the `useTheme()` hook in React components
- Use Tailwind classes when possible (`bg-primary-500`)
- Test emails after theme changes
- Run `generate:theme` after pulling changes

### ❌ Don'ts

- **Never** edit `theme-variables.css` directly (it's auto-generated)
- Don't hardcode colors in components
- Don't use inline styles with hardcoded theme values
- Don't skip the theme generation script

## Troubleshooting

### Theme changes not appearing?

1. Make sure you saved `theme.config.json`
2. Run `npm run generate:theme`
3. Restart dev server if needed
4. Clear browser cache

### Email styles not working?

1. Check that `EmailThemeHelper.getEmailStyles()` is called
2. Verify `{{{ emailStyles }}}` (triple braces) in template
3. Use inline styles for critical CSS (email clients)
4. Test in multiple email clients

### TypeScript errors with theme?

1. Restart TypeScript server in your editor
2. Run `npm run typecheck`
3. Check that theme.config.json is valid JSON

## Advanced Customization

### Adding Custom Color Scales

```json
{
  "colors": {
    "brand": {
      "50": "#fef2f2",
      "100": "#fee2e2",
      "500": "#ef4444",
      "900": "#7f1d1d",
      "DEFAULT": "#ef4444"
    }
  }
}
```

### Custom Font Families

```json
{
  "theme": {
    "fontFamily": {
      "heading": ["Montserrat", "sans-serif"],
      "body": ["Open Sans", "sans-serif"]
    }
  }
}
```

### Custom Shadows

```json
{
  "theme": {
    "shadows": {
      "glow": "0 0 20px rgba(14, 165, 233, 0.5)",
      "inner": "inset 0 2px 4px rgba(0, 0, 0, 0.1)"
    }
  }
}
```

## Migration Guide

### From Hardcoded Values

**Before:**

```tsx
<div style={{ backgroundColor: '#0ea5e9' }}>
```

**After:**

```tsx
const { colors } = useTheme()
<div style={{ backgroundColor: colors.primary['500'] }}>
// or use Tailwind:
<div className="bg-primary-500">
```

### Emails Before/After

**Before:**

```html
<div style="background-color: #0ea5e9;"></div>
```

**After:**

```html
<div style="background-color: {{ theme.colors.primary }};"></div>
```

## Support

For issues or questions:

1. Check this documentation
2. Review `theme.config.json` syntax
3. Run `npm run generate:theme` manually
4. Check console for errors

## Summary

- 📝 Edit `theme.config.json` for all theme changes
- 🔄 Theme auto-generates on dev/build
- 🎨 Use everywhere: React, Tailwind, CSS, Emails
- ✨ One source of truth = consistent design
- 🚀 No manual CSS variable updates needed

Happy theming! 🎉
