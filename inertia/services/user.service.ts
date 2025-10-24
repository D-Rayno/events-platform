// inertia/services/user.service.ts
import { router } from '@inertiajs/react'
import { useAuthStore } from '~/stores/auth'
import type { UpdateProfileData, User } from '~/types/user'

class UserService {
  async updateProfile(data: UpdateProfileData): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // If avatar is a File, send as FormData
      const hasFile = data.avatar instanceof File

      if (hasFile) {
        const form = new FormData()
        if (typeof data.firstName !== 'undefined') form.append('firstName', String(data.firstName))
        if (typeof data.lastName !== 'undefined') form.append('lastName', String(data.lastName))
        if (typeof data.age !== 'undefined') form.append('age', String(data.age))
        if (typeof data.province !== 'undefined') form.append('province', String(data.province))
        if (typeof data.commune !== 'undefined') form.append('commune', String(data.commune))
        if (typeof data.phoneNumber !== 'undefined')
          form.append('phoneNumber', String(data.phoneNumber))
        // append file (server should expect "avatar")
        if (data.avatar) form.append('avatar', data.avatar)

        router.post('/profile', form as any, {
          preserveScroll: true,
          preserveState: true,
          onSuccess: (page: any) => {
            const authStore = useAuthStore()
            // server response should include updated user — fallback to partial updates
            const updatedUser = page.props?.auth?.user ?? null
            if (updatedUser) {
              authStore.updateUser(updatedUser as Partial<User>)
            } else {
              // Use provided partial data as best-effort update
              authStore.updateUser(data as Partial<User>)
            }
            resolve(true)
          },
          onError: (errors: any) => reject(errors),
        })
      } else {
        // plain object payload
        const payload: Record<string, any> = {}
        if (typeof data.firstName !== 'undefined') payload.firstName = data.firstName
        if (typeof data.lastName !== 'undefined') payload.lastName = data.lastName
        if (typeof data.age !== 'undefined') payload.age = data.age
        if (typeof data.province !== 'undefined') payload.province = data.province
        if (typeof data.commune !== 'undefined') payload.commune = data.commune
        if (typeof data.phoneNumber !== 'undefined') payload.phoneNumber = data.phoneNumber
        if (typeof data.avatarUrl !== 'undefined') payload.avatarUrl = data.avatarUrl

        router.post('/profile', payload as any, {
          preserveScroll: true,
          onSuccess: (page: any) => {
            const authStore = useAuthStore()
            const updatedUser = page.props?.auth?.user ?? null
            if (updatedUser) {
              authStore.updateUser(updatedUser as Partial<User>)
            } else {
              authStore.updateUser(data as Partial<User>)
            }
            resolve(true)
          },
          onError: (errors: any) => reject(errors),
        })
      }
    })
  }

  async deleteAvatar(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      router.delete('/profile/avatar', {
        preserveScroll: true,
        onSuccess: (page: any) => {
          const authStore = useAuthStore()
          // server may return updated user
          const updatedUser = page.props?.auth?.user ?? null
          if (updatedUser) {
            authStore.updateUser(updatedUser as Partial<User>)
          } else {
            authStore.updateUser({ avatarUrl: null })
          }
          resolve(true)
        },
        onError: (errors: any) => reject(errors),
      })
    })
  }

  getInitials(firstName: string, lastName: string): string {
    const f = firstName?.trim() || ''
    const l = lastName?.trim() || ''
    const fi = f ? f[0] : ''
    const li = l ? l[0] : ''
    return `${fi}${li}`.toUpperCase()
  }

  getFullName(firstName: string, lastName: string): string {
    const f = firstName?.trim() || ''
    const l = lastName?.trim() || ''
    return `${f} ${l}`.trim()
  }

  getAvatarUrl(avatarUrl: string | null | undefined): string | null {
    if (!avatarUrl) return null
    return avatarUrl.startsWith('http') ? avatarUrl : `/uploads/${avatarUrl}`
  }

  validateAvatarFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 2 * 1024 * 1024 // 2MB
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

  revokePreviewUrl(url: string): void {
    try {
      URL.revokeObjectURL(url)
    } catch (e) {
      // ignore invalid urls
    }
  }
}

export const userService = new UserService()
