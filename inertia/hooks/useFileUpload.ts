import { useState } from 'react';

interface UploadOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  multiple?: boolean;
}

/**
 * File upload React hook
 */
export function useFileUpload(options: UploadOptions = {}) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isUploading] = useState(false);

  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    multiple = false,
  } = options;

  /**
   * Validate file
   * @param file - File to validate
   */
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Type de fichier non supporté: ${file.type}`,
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `Fichier trop volumineux: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      };
    }

    return { valid: true };
  };

  /**
   * Handle file selection
   * @param event - File input change event
   */
  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);

    setErrors([]);
    const validFiles: File[] = [];

    selectedFiles.forEach((file) => {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push(file);

        // Create preview for images
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setPreviews((prev) => [...prev, e.target?.result as string]);
          };
          reader.readAsDataURL(file);
        }
      } else {
        setErrors((prev) => [...prev, validation.error!]);
      }
    });

    if (multiple) {
      setFiles((prev) => [...prev, ...validFiles]);
      setPreviews((prev) => [...prev]);
    } else {
      setFiles(validFiles.slice(0, 1));
      setPreviews((prev) => prev.slice(0, 1));
    }
  };

  /**
   * Remove file
   * @param index - File index
   */
  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });

    setPreviews((prev) => {
      const newPreviews = [...prev];
      if (newPreviews[index]) {
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
      }
      return newPreviews;
    });
  };

  /**
   * Clear all files
   */
  const clearFiles = () => {
    previews.forEach((preview) => {
      if (preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    });

    setFiles([]);
    setPreviews([]);
    setErrors([]);
  };

  return {
    files,
    previews,
    errors,
    isUploading,
    handleFiles,
    removeFile,
    clearFiles,
    validateFile,
  };
}