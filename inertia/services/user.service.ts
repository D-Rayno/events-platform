// inertia/services/user.service.ts
import { router } from '@inertiajs/vue3'
import { useAuthStore } from '~/stores/auth'
import type { UpdateProfileData, User } from '~/types/user'

class UserService {
  async updateProfile(data: UpdateProfileData) {
    return new Promise((resolve, reject) => {
      router.post('/profile', data as any, {
        preserveScroll: true,
        onSuccess: () => {
          const authStore = useAuthStore()
          authStore.updateUser(data as Partial<User>)
          resolve(true)
        },
        onError: (errors) => reject(errors),
      })
    })
  }

  async deleteAvatar() {
    return new Promise((resolve, reject) => {
      router.delete('/profile/avatar', {
        preserveScroll: true,
        onSuccess: () => {
          const authStore = useAuthStore()
          authStore.updateUser({ avatarUrl: null })
          resolve(true)
        },
        onError: (errors) => reject(errors),
      })
    })
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  getFullName(firstName: string, lastName: string): string {
    return `${firstName} ${lastName}`
  }

  getAvatarUrl(avatarUrl: string | null | undefined): string | null {
    if (!avatarUrl) return null
    return avatarUrl.startsWith('http') ? avatarUrl : `/uploads/${avatarUrl}`
  }

  validateAvatarFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 2 * 1024 * 1024
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Format non supporté. Utilisez JPG, PNG ou WEBP.',
      }
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'Fichier trop volumineux (max 2 Mo).',
      }
    }

    return { valid: true }
  }

  createPreviewUrl(file: File): string {
    return URL.createObjectURL(file)
  }

  revokePreviewUrl(url: string) {
    URL.revokeObjectURL(url)
  }
}

export const userService = new UserService()
