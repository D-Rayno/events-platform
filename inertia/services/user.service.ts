// inertia/services/user.service.ts
import { router } from '@inertiajs/vue3'
import { useAuthStore } from '~/stores/auth'
import type { UpdateProfileData } from '~/types/user'

/**
 * User service
 * Handles all user-related operations
 */
class UserService {
  /**
   * Update user profile
   * @param data - Profile data to update
   */
  async updateProfile(data: UpdateProfileData) {
    return new Promise((resolve, reject) => {
      router.post('/profile', data, {
        preserveScroll: true,
        onSuccess: () => {
          // Update auth store with new data
          const authStore = useAuthStore()
          authStore.updateUser(data)
          resolve(true)
        },
        onError: (errors) => reject(errors),
      })
    })
  }

  /**
   * Delete user avatar
   */
  async deleteAvatar() {
    return new Promise((resolve, reject) => {
      router.delete('/profile/avatar', {
        preserveScroll: true,
        onSuccess: () => {
          const authStore = useAuthStore()
          authStore.updateUser({ avatar: undefined })
          resolve(true)
        },
        onError: (errors) => reject(errors),
      })
    })
  }

  /**
   * Get user initials from name
   * @param firstName - User first name
   * @param lastName - User last name
   */
  getInitials(firstName: string, lastName: string): string {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  /**
   * Get user full name
   * @param firstName - User first name
   * @param lastName - User last name
   */
  getFullName(firstName: string, lastName: string): string {
    return `${firstName} ${lastName}`
  }

  /**
   * Get user avatar URL
   * @param avatarUrl - Avatar path
   */
  getAvatarUrl(avatarUrl: string | null | undefined): string | null {
    if (!avatarUrl) return null
    return avatarUrl.startsWith('http') ? avatarUrl : `/uploads/${avatarUrl}`
  }

  /**
   * Validate file for avatar upload
   * @param file - File to validate
   */
  validateAvatarFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 2 * 1024 * 1024 // 2MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Format de fichier non supporté. Utilisez JPG, PNG ou WEBP.',
      }
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'Le fichier est trop volumineux. Taille maximale : 2 Mo.',
      }
    }

    return { valid: true }
  }

  /**
   * Create preview URL from file
   * @param file - Image file
   */
  createPreviewUrl(file: File): string {
    return URL.createObjectURL(file)
  }

  /**
   * Revoke preview URL
   * @param url - URL to revoke
   */
  revokePreviewUrl(url: string) {
    URL.revokeObjectURL(url)
  }
}

export const userService = new UserService()
