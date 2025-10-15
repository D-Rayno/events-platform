// inertia/composables/use_file_upload.ts
import { ref } from 'vue'

interface UploadOptions {
  maxSize?: number // in bytes
  allowedTypes?: string[]
  multiple?: boolean
}

/**
 * File upload composable
 */
export function useFileUpload(options: UploadOptions = {}) {
  const files = ref<File[]>([])
  const previews = ref<string[]>([])
  const errors = ref<string[]>([])
  const isUploading = ref(false)

  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    multiple = false,
  } = options

  /**
   * Validate file
   * @param file - File to validate
   */
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Type de fichier non supporté: ${file.type}`,
      }
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `Fichier trop volumineux: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      }
    }

    return { valid: true }
  }

  /**
   * Handle file selection
   * @param event - File input change event
   */
  const handleFiles = (event: Event) => {
    const target = event.target as HTMLInputElement
    const selectedFiles = Array.from(target.files || [])

    errors.value = []
    const validFiles: File[] = []

    selectedFiles.forEach((file) => {
      const validation = validateFile(file)
      if (validation.valid) {
        validFiles.push(file)

        // Create preview for images
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onload = (e) => {
            previews.value.push(e.target?.result as string)
          }
          reader.readAsDataURL(file)
        }
      } else {
        errors.value.push(validation.error!)
      }
    })

    if (multiple) {
      files.value.push(...validFiles)
    } else {
      files.value = validFiles.slice(0, 1)
      previews.value = previews.value.slice(0, 1)
    }
  }

  /**
   * Remove file
   * @param index - File index
   */
  const removeFile = (index: number) => {
    files.value.splice(index, 1)

    if (previews.value[index]) {
      URL.revokeObjectURL(previews.value[index])
      previews.value.splice(index, 1)
    }
  }

  /**
   * Clear all files
   */
  const clearFiles = () => {
    previews.value.forEach((preview) => {
      if (preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    })

    files.value = []
    previews.value = []
    errors.value = []
  }

  return {
    files,
    previews,
    errors,
    isUploading,
    handleFiles,
    removeFile,
    clearFiles,
    validateFile,
  }
}
