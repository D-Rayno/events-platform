import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'

export default class UserController {
  /**
   * Liste tous les utilisateurs avec filtres
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 50)
    const search = request.input('search')
    const isBlocked = request.input('is_blocked')
    const isVerified = request.input('is_verified')

    let query = User.query().orderBy('created_at', 'desc')

    // Recherche
    if (search) {
      query = query.where((q) => {
        q.whereLike('first_name', `%${search}%`)
          .orWhereLike('last_name', `%${search}%`)
          .orWhereLike('email', `%${search}%`)
      })
    }

    // Filtrer par statut bloqué
    if (isBlocked !== undefined) {
      query = query.where('is_blocked', isBlocked === 'true')
    }

    // Filtrer par email vérifié
    if (isVerified !== undefined) {
      query = query.where('is_email_verified', isVerified === 'true')
    }

    const users = await query
      .withCount('registrations', (q) => {
        q.whereIn('status', ['confirmed', 'attended'])
      })
      .paginate(page, limit)

    return response.ok({
      success: true,
      data: users.all().map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email,
        age: user.age,
        province: user.province,
        commune: user.commune,
        phoneNumber: user.phoneNumber,
        isEmailVerified: user.isEmailVerified,
        isActive: user.isActive,
        isBlocked: user.isBlocked,
        registrationsCount: user.$extras.registrations_count || 0,
        createdAt: user.createdAt.toISO(),
      })),
      meta: users.getMeta(),
    })
  }

  /**
   * Affiche les détails d'un utilisateur
   */
  async show({ params, response }: HttpContext) {
    const user = await User.query()
      .where('id', params.id)
      .preload('registrations', (q) => {
        q.preload('event').orderBy('created_at', 'desc')
      })
      .first()

    if (!user) {
      return response.notFound({
        error: 'Utilisateur non trouvé',
        message: "Cet utilisateur n'existe pas.",
      })
    }

    // Statistiques des inscriptions
    const stats = {
      total: user.registrations.length,
      confirmed: user.registrations.filter((r) => r.status === 'confirmed').length,
      attended: user.registrations.filter((r) => r.status === 'attended').length,
      canceled: user.registrations.filter((r) => r.status === 'canceled').length,
    }

    return response.ok({
      success: true,
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email,
        age: user.age,
        province: user.province,
        commune: user.commune,
        phoneNumber: user.phoneNumber,
        avatarUrl: user.avatarUrl,
        isEmailVerified: user.isEmailVerified,
        emailVerifiedAt: user.emailVerifiedAt?.toISO(),
        isActive: user.isActive,
        isBlocked: user.isBlocked,
        createdAt: user.createdAt.toISO(),
        stats,
        registrations: user.registrations.map((reg) => ({
          id: reg.id,
          status: reg.status,
          attendedAt: reg.attendedAt?.toISO(),
          createdAt: reg.createdAt.toISO(),
          event: {
            id: reg.event.id,
            name: reg.event.name,
            location: reg.event.location,
            startDate: reg.event.startDate.toISO(),
            endDate: reg.event.endDate.toISO(),
          },
        })),
      },
    })
  }

  /**
   * Bloque ou débloque un utilisateur
   */
  async toggleBlock({ params, response }: HttpContext) {
    const user = await User.find(params.id)

    if (!user) {
      return response.notFound({
        error: 'Utilisateur non trouvé',
        message: "Cet utilisateur n'existe pas.",
      })
    }

    try {
      user.isBlocked = !user.isBlocked
      await user.save()

      return response.ok({
        success: true,
        message: user.isBlocked ? 'Utilisateur bloqué avec succès' : 'Utilisateur débloqué avec succès',
        data: {
          id: user.id,
          isBlocked: user.isBlocked,
        },
      })
    } catch (error) {
      console.error('Erreur lors du blocage/déblocage:', error)
      return response.internalServerError({
        error: 'Erreur serveur',
        message: 'Une erreur est survenue.',
      })
    }
  }

  /**
   * Active ou désactive un utilisateur
   */
  async toggleActive({ params, response }: HttpContext) {
    const user = await User.find(params.id)

    if (!user) {
      return response.notFound({
        error: 'Utilisateur non trouvé',
        message: "Cet utilisateur n'existe pas.",
      })
    }

    try {
      user.isActive = !user.isActive
      await user.save()

      return response.ok({
        success: true,
        message: user.isActive ? 'Utilisateur activé avec succès' : 'Utilisateur désactivé avec succès',
        data: {
          id: user.id,
          isActive: user.isActive,
        },
      })
    } catch (error) {
      console.error("Erreur lors de l'activation/désactivation:", error)
      return response.internalServerError({
        error: 'Erreur serveur',
        message: 'Une erreur est survenue.',
      })
    }
  }

  /**
   * Supprime un utilisateur
   */
  async destroy({ params, response }: HttpContext) {
    const user = await User.find(params.id)

    if (!user) {
      return response.notFound({
        error: 'Utilisateur non trouvé',
        message: "Cet utilisateur n'existe pas.",
      })
    }

    try {
      // Vérifier s'il y a des inscriptions actives
      const activeRegistrations = await db
        .from('registrations')
        .where('user_id', user.id)
        .whereIn('status', ['confirmed', 'attended'])
        .count('* as total')

      const count = activeRegistrations[0].total

      if (count > 0) {
        return response.badRequest({
          error: 'Suppression impossible',
          message: `Cet utilisateur a ${count} inscription(s) active(s). Veuillez les gérer avant de supprimer l'utilisateur.`,
        })
      }

      await user.delete()

      return response.ok({
        success: true,
        message: 'Utilisateur supprimé avec succès',
      })
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error)
      return response.internalServerError({
        error: 'Erreur serveur',
        message: 'Une erreur est survenue lors de la suppression.',
      })
    }
  }

  /**
   * Statistiques des utilisateurs
   */
  async stats({ response }: HttpContext) {
    const totalResult = await User.query().count('* as total').first()
    const verifiedResult = await User.query().where('is_email_verified', true).count('* as total').first()
    const blockedResult = await User.query().where('is_blocked', true).count('* as total').first()
    const activeResult = await User.query().where('is_active', true).count('* as total').first()

    return response.ok({
      success: true,
      data: {
        total: Number(totalResult?.$extras.total ?? 0),
        verified: Number(verifiedResult?.$extras.total ?? 0),
        blocked: Number(blockedResult?.$extras.total ?? 0),
        active: Number(activeResult?.$extras.total ?? 0),
      },
    })
  }
}