import env from '#start/env'
import { defineConfig, transports } from '@adonisjs/mail'

const mailConfig = defineConfig({
  default: 'brevo',


  /**
   * Adresse email par défaut
   */
  from: {
    address: env.get('MAIL_FROM_ADDRESS') as string,
    name: env.get('MAIL_FROM_NAME') as string,
  },

  /**
   * Adresse email de réponse par défaut
   */
  replyTo: {
    address: env.get('MAIL_REPLY_TO_ADDRESS') as string,
    name: env.get('MAIL_REPLY_TO_NAME') as string,
  },

  /**
   * Liste des transporteurs d'emails
   */
  mailers: {
    brevo: transports.smtp({
      host: env.get('SMTP_HOST') as string,
      port: env.get('SMTP_PORT'),
      secure: false, // Brevo utilise STARTTLS
      auth: {
        user: env.get('SMTP_USERNAME') as string,
        pass: env.get('SMTP_PASSWORD') as string,
        type: "login"
      },
      tls: {
        ciphers: 'SSLv3',
      },
    }),
  },
})

export default mailConfig

declare module '@adonisjs/mail/types' {
  export interface MailersList extends InferMailers<typeof mailConfig> {}
}