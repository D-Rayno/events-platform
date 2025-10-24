import { BaseCommand } from '@adonisjs/core/ace'
import { CommandOptions } from '@adonisjs/core/types/ace'
import { randomBytes } from 'node:crypto'

export default class GenerateAdminToken extends BaseCommand {
  static commandName = 'generate:admin-token'
  static description = 'Génère un nouveau token pour l\'API admin'

  static options: CommandOptions = {
    startApp: false,
  }

  async run() {
    const token = randomBytes(32).toString('hex')

    this.logger.info('Nouveau token admin généré avec succès!')
    this.logger.info('')
    this.logger.info('Copiez ce token dans votre fichier .env:')
    this.logger.info('')
    this.logger.success(`ADMIN_API_TOKEN=${token}`)
    this.logger.info('')
    this.logger.warning('⚠️  Conservez ce token en sécurité!')
    this.logger.warning('⚠️  Ne le partagez jamais publiquement')
    this.logger.info('')
    this.logger.info('Ce token permettra l\'accès à l\'API admin sur plusieurs appareils.')
  }
}