// inertia/services/registration.service.ts
import { router } from '@inertiajs/vue3'

/**
 * Registration service
 * Handles all registration-related operations
 */
class RegistrationService {
  /**
   * Fetch user registrations
   */
  async fetchRegistrations() {
    return new Promise((resolve) => {
      router.visit('/registrations', {
        onSuccess: () => resolve(true),
      })
    })
  }

  /**
   * Get registration details
   * @param id - Registration ID
   */
  async getRegistration(id: number) {
    return new Promise((resolve) => {
      router.visit(`/registrations/${id}`, {
        onSuccess: () => resolve(true),
      })
    })
  }

  /**
   * Cancel registration
   * @param id - Registration ID
   */
  async cancel(id: number) {
    return new Promise((resolve, reject) => {
      router.delete(`/registrations/${id}`, {
        preserveScroll: true,
        onSuccess: () => resolve(true),
        onError: (errors) => reject(errors),
      })
    })
  }

  /**
   * Download QR code
   * @param qrCodeImage - Base64 QR code image
   * @param eventName - Event name for filename
   */
  downloadQRCode(qrCodeImage: string, eventName: string) {
    const link = document.createElement('a')
    link.href = qrCodeImage
    link.download = `qr-code-${eventName.replace(/\s+/g, '-').toLowerCase()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  /**
   * Print ticket
   */
  printTicket() {
    window.print()
  }

  /**
   * Get registration status badge
   * @param status - Registration status
   */
  getStatusBadge(status: string): { text: string; color: string } {
    const badges: Record<string, { text: string; color: string }> = {
      pending: { text: 'En attente', color: 'yellow' },
      confirmed: { text: 'Confirmé', color: 'green' },
      attended: { text: 'Présent', color: 'blue' },
      canceled: { text: 'Annulé', color: 'gray' },
    }

    return badges[status] || { text: status, color: 'gray' }
  }

  /**
   * Check if registration can be canceled
   * @param registration - Registration data
   */
  canCancel(registration: any): boolean {
    return (
      (registration.status === 'confirmed' || registration.status === 'pending') &&
      registration.event.isUpcoming
    )
  }

  /**
   * Group registrations by status
   * @param registrations - Array of registrations
   */
  groupByStatus(registrations: any[]): Record<string, any[]> {
    return registrations.reduce(
      (acc, reg) => {
        const status = reg.status
        if (!acc[status]) {
          acc[status] = []
        }
        acc[status].push(reg)
        return acc
      },
      {} as Record<string, any[]>
    )
  }
}

export const registrationService = new RegistrationService()
