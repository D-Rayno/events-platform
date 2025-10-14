import { z } from 'zod'

// Messages d'erreur personnalisés en français
const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type) {
    if (issue.expected === 'string') {
      return { message: 'Ce champ doit être une chaîne de caractères' }
    }
    if (issue.expected === 'number') {
      return { message: 'Ce champ doit être un nombre' }
    }
  }

  if (issue.code === z.ZodIssueCode.too_small) {
    if (issue.type === 'string') {
      return { message: `Ce champ doit contenir au moins ${issue.minimum} caractères` }
    }
    if (issue.type === 'number') {
      return { message: `La valeur doit être supérieure ou égale à ${issue.minimum}` }
    }
  }

  if (issue.code === z.ZodIssueCode.too_big) {
    if (issue.type === 'string') {
      return { message: `Ce champ ne doit pas dépasser ${issue.maximum} caractères` }
    }
    if (issue.type === 'number') {
      return { message: `La valeur doit être inférieure ou égale à ${issue.maximum}` }
    }
  }

  return { message: ctx.defaultError }
}

z.setErrorMap(customErrorMap)

// Schémas de validation
export const registerSchema = z.object({
  firstName: z
    .string({ required_error: 'Le prénom est requis' })
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(100, 'Le prénom ne doit pas dépasser 100 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s-]+$/, 'Le prénom ne doit contenir que des lettres'),

  lastName: z
    .string({ required_error: 'Le nom est requis' })
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne doit pas dépasser 100 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s-]+$/, 'Le nom ne doit contenir que des lettres'),

  email: z
    .string({ required_error: "L'email est requis" })
    .email('Adresse email invalide')
    .max(254, "L'email ne doit pas dépasser 254 caractères"),

  password: z
    .string({ required_error: 'Le mot de passe est requis' })
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .max(100, 'Le mot de passe ne doit pas dépasser 100 caractères')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
    ),

  password_confirmation: z.string({ required_error: 'La confirmation est requise' }),

  age: z
    .number({ required_error: "L'âge est requis", invalid_type_error: "L'âge doit être un nombre" })
    .int("L'âge doit être un nombre entier")
    .min(13, 'Vous devez avoir au moins 13 ans')
    .max(120, 'Âge invalide'),

  province: z
    .string({ required_error: 'La province est requise' })
    .min(1, 'Veuillez sélectionner une province'),

  commune: z
    .string({ required_error: 'La commune est requise' })
    .min(2, 'La commune doit contenir au moins 2 caractères')
    .max(100, 'La commune ne doit pas dépasser 100 caractères'),

  phoneNumber: z
    .string()
    .regex(/^(\+213|0)[567]\d{8}$/, 'Numéro de téléphone algérien invalide')
    .optional()
    .or(z.literal('')),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['password_confirmation'],
})

export const loginSchema = z.object({
  email: z
    .string({ required_error: "L'email est requis" })
    .email('Adresse email invalide'),

  password: z
    .string({ required_error: 'Le mot de passe est requis' })
    .min(1, 'Le mot de passe est requis'),
})

export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: "L'email est requis" })
    .email('Adresse email invalide'),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token invalide'),
  
  password: z
    .string({ required_error: 'Le mot de passe est requis' })
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .max(100, 'Le mot de passe ne doit pas dépasser 100 caractères')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
    ),

  password_confirmation: z.string({ required_error: 'La confirmation est requise' }),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['password_confirmation'],
})

export const updateProfileSchema = z.object({
  firstName: z
    .string({ required_error: 'Le prénom est requis' })
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(100, 'Le prénom ne doit pas dépasser 100 caractères'),

  lastName: z
    .string({ required_error: 'Le nom est requis' })
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne doit pas dépasser 100 caractères'),

  age: z
    .number({ required_error: "L'âge est requis" })
    .int("L'âge doit être un nombre entier")
    .min(13, 'Vous devez avoir au moins 13 ans')
    .max(120, 'Âge invalide'),

  province: z.string({ required_error: 'La province est requise' }),

  commune: z
    .string({ required_error: 'La commune est requise' })
    .min(2, 'La commune doit contenir au moins 2 caractères'),

  phoneNumber: z
    .string()
    .regex(/^(\+213|0)[567]\d{8}$/, 'Numéro de téléphone algérien invalide')
    .optional()
    .or(z.literal('')),
})

// Types TypeScript extraits des schémas
export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>