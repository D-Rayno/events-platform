import type { HttpContext } from '@adonisjs/core/http'
import { updateProfileValidator } from '#validators/update_profile'
import drive from '@adonisjs/drive/services/main'
import { cuid } from '@adonisjs/core/helpers'

export default class ProfileController {
  /**
   * Affiche la page de profil
   */
  async show({ inertia, auth }: HttpContext) {
    const user = auth.user!
<<<<<<< HEAD

=======
    
>>>>>>> 47214e9 (feat: admin api's & user profile management, events and registration for both web and api)
    return inertia.render('profile/show', {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        province: user.province,
        commune: user.commune,
        phoneNumber: user.phoneNumber,
        avatarUrl: user.avatarUrl,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt.toFormat('dd/MM/yyyy'),
      },
    })
  }

  /**
   * Met à jour le profil
   */
  async update({ request, response, auth, session }: HttpContext) {
    try {
      const user = auth.user!
      const data = await request.validateUsing(updateProfileValidator)

      // Mise à jour des informations de base
      user.firstName = data.firstName
      user.lastName = data.lastName
      user.age = data.age
      user.province = data.province
      user.commune = data.commune
      user.phoneNumber = data.phoneNumber || null

      // Gestion de l'avatar
      if (data.avatar) {
        // Supprimer l'ancien avatar si existant
        if (user.avatarUrl) {
          try {
            await drive.use().delete(user.avatarUrl)
          } catch (error) {
<<<<<<< HEAD
            console.error("Erreur lors de la suppression de l'ancien avatar:", error)
=======
            console.error('Erreur lors de la suppression de l\'ancien avatar:', error)
>>>>>>> 47214e9 (feat: admin api's & user profile management, events and registration for both web and api)
          }
        }

        // Sauvegarder le nouveau avatar
        const fileName = `${cuid()}.${data.avatar.extname}`
        const filePath = `avatars/${fileName}`
<<<<<<< HEAD

=======
        
>>>>>>> 47214e9 (feat: admin api's & user profile management, events and registration for both web and api)
        await data.avatar.move(filePath)
        user.avatarUrl = filePath
      }

      await user.save()

      session.flash('success', 'Votre profil a été mis à jour avec succès.')
      return response.redirect().back()
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error)
      session.flash('error', 'Une erreur est survenue lors de la mise à jour.')
      return response.redirect().back()
    }
  }

  /**
   * Supprime l'avatar
   */
  async deleteAvatar({ response, auth, session }: HttpContext) {
    try {
      const user = auth.user!

      if (user.avatarUrl) {
        await drive.use().delete(user.avatarUrl)
        user.avatarUrl = null
        await user.save()
<<<<<<< HEAD

=======
        
>>>>>>> 47214e9 (feat: admin api's & user profile management, events and registration for both web and api)
        session.flash('success', 'Votre photo de profil a été supprimée.')
      }

      return response.redirect().back()
    } catch (error) {
<<<<<<< HEAD
      console.error("Erreur lors de la suppression de l'avatar:", error)
=======
      console.error('Erreur lors de la suppression de l\'avatar:', error)
>>>>>>> 47214e9 (feat: admin api's & user profile management, events and registration for both web and api)
      session.flash('error', 'Une erreur est survenue.')
      return response.redirect().back()
    }
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 47214e9 (feat: admin api's & user profile management, events and registration for both web and api)
