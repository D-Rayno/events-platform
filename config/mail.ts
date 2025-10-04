import env from '#start/env'
import { defineConfig, transports } from '@adonisjs/mail'

const mailConfig = defineConfig({
  default: 'brevo',

<<<<<<< HEAD
   /**
    * The mailers object can be used to configure multiple mailers
    * each using a different transport or same transport with different
    * options.
   */
  mailers: {     
    brevo: transports.brevo({
      key: env.get('BREVO_API_KEY'),
      baseUrl: 'https://api.brevo.com/v3',
    }),
     
=======
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
>>>>>>> 47214e9 (feat: admin api's & user profile management, events and registration for both web and api)
  },
})

export default mailConfig

declare module '@adonisjs/mail/types' {
  export interface MailersList extends InferMailers<typeof mailConfig> {}
}