// app/services/email_theme_service.ts
import themeConfig from '../../inertia/theme.config.json' with { type: 'json' }

export interface EmailTheme {
  colors: {
    primary: string
    secondary: string
    success: string
    error: string
    warning: string
    info: string
    text: string
    textLight: string
    background: string
    border: string
  }
  fonts: {
    sans: string
    display: string
  }
  appName: string
  appTagline: string
}

export class EmailThemeService {
  static getTheme(): EmailTheme {
    return {
      colors: {
        primary: themeConfig.colors.primary['500'],
        secondary: themeConfig.colors.secondary['500'],
        success: themeConfig.colors.success['500'],
        error: themeConfig.colors.error['500'],
        warning: themeConfig.colors.warning['500'],
        info: themeConfig.colors.info['500'],
        text: themeConfig.colors.neutral['800'],
        textLight: themeConfig.colors.neutral['600'],
        background: themeConfig.colors.neutral['50'],
        border: themeConfig.colors.neutral['200'],
      },
      fonts: {
        sans: Array.isArray(themeConfig.theme.fontFamily.sans)
          ? themeConfig.theme.fontFamily.sans.join(', ')
          : themeConfig.theme.fontFamily.sans,
        display: Array.isArray(themeConfig.theme.fontFamily.display)
          ? themeConfig.theme.fontFamily.display.join(', ')
          : themeConfig.theme.fontFamily.display,
      },
      appName: themeConfig.app.name,
      appTagline: themeConfig.app.tagline,
    }
  }

  /**
   * Generate inline styles for email templates
   */
  static getEmailStyles(): string {
    const theme = this.getTheme()

    return `
      body {
        font-family: ${theme.fonts.sans};
        line-height: 1.6;
        color: ${theme.colors.text};
        background-color: ${theme.colors.background};
        margin: 0;
        padding: 0;
      }
      
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      
      .header {
        background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%);
        padding: 40px 20px;
        text-align: center;
        color: white;
      }
      
      .header h1 {
        margin: 0;
        font-size: 28px;
        font-family: ${theme.fonts.display};
        font-weight: 700;
      }
      
      .content {
        padding: 40px 30px;
      }
      
      .content p {
        margin-bottom: 20px;
        color: ${theme.colors.textLight};
        font-size: 16px;
      }
      
      .button {
        display: inline-block;
        padding: 14px 32px;
        background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%);
        color: white !important;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 600;
        margin: 20px 0;
        transition: opacity 0.3s;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      
      .button:hover {
        opacity: 0.9;
      }
      
      .info-box {
        background-color: ${theme.colors.background};
        padding: 24px;
        border-radius: 12px;
        margin: 24px 0;
        border-left: 4px solid ${theme.colors.primary};
      }
      
      .info-box h2 {
        margin: 0 0 16px 0;
        color: ${theme.colors.primary};
        font-size: 20px;
        font-weight: 600;
      }
      
      .info-box p {
        margin: 8px 0;
        color: ${theme.colors.text};
      }
      
      .info-box strong {
        color: ${theme.colors.text};
        font-weight: 600;
      }
      
      .warning-box {
        padding: 16px;
        background-color: #FFF3CD;
        border-left: 4px solid ${theme.colors.warning};
        border-radius: 8px;
        margin: 20px 0;
      }
      
      .warning-box p {
        margin: 0;
        color: #856404;
      }
      
      .success-box {
        padding: 16px;
        background-color: #D1FAE5;
        border-left: 4px solid ${theme.colors.success};
        border-radius: 8px;
        margin: 20px 0;
      }
      
      .success-box p {
        margin: 0;
        color: #065F46;
      }
      
      .qr-code-box {
        text-align: center;
        padding: 24px;
        background-color: #ffffff;
        border: 2px dashed ${theme.colors.primary};
        border-radius: 12px;
        margin: 24px 0;
      }
      
      .qr-code-box p {
        margin: 10px 0 0 0;
        font-size: 14px;
        color: ${theme.colors.textLight};
      }
      
      .footer {
        background-color: ${theme.colors.text};
        padding: 30px 20px;
        text-align: center;
        font-size: 13px;
        color: ${theme.colors.textLight};
      }
      
      .footer a {
        color: ${theme.colors.primary};
        text-decoration: none;
      }
      
      .feature-grid {
        margin: 24px 0;
      }
      
      .feature-item {
        background: ${theme.colors.background};
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 12px;
        border-left: 3px solid ${theme.colors.primary};
      }
      
      .feature-title {
        font-weight: 600;
        color: ${theme.colors.text};
        margin-bottom: 4px;
        font-size: 16px;
      }
      
      .feature-description {
        color: ${theme.colors.textLight};
        font-size: 14px;
        margin: 0;
      }
      
      @media only screen and (max-width: 600px) {
        .container {
          margin: 20px 10px;
          border-radius: 8px;
        }
        
        .content {
          padding: 24px 20px;
        }
        
        .header {
          padding: 30px 20px;
        }
        
        .header h1 {
          font-size: 24px;
        }
      }
    `
  }
}

export default EmailThemeService
