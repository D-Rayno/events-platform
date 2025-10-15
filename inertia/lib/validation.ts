import * as yup from 'yup'

// Configuration des messages en français
yup.setLocale({
  mixed: {
    default: 'Ce champ est invalide',
    required: 'Ce champ est requis',
    notType: 'Format invalide',
  },
  string: {
    min: ({ min }) => `Ce champ doit contenir au moins ${min} caractères`,
    max: ({ max }) => `Ce champ ne doit pas dépasser ${max} caractères`,
    email: 'Adresse email invalide',
    url: 'URL invalide',
  },
  number: {
    min: ({ min }) => `La valeur doit être supérieure ou égale à ${min}`,
    max: ({ max }) => `La valeur doit être inférieure ou égale à ${max}`,
    integer: 'La valeur doit être un nombre entier',
  },
})

// Schémas de validation
export const registerSchema = yup.object({
  firstName: yup
    .string()
    .required('Le prénom est requis')
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(100, 'Le prénom ne doit pas dépasser 100 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s-]+$/, 'Le prénom ne doit contenir que des lettres'),

  lastName: yup
    .string()
    .required('Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne doit pas dépasser 100 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s-]+$/, 'Le nom ne doit contenir que des lettres'),

  email: yup
    .string()
    .required("L'email est requis")
    .email('Adresse email invalide')
    .max(254, "L'email ne doit pas dépasser 254 caractères"),

  password: yup
    .string()
    .required('Le mot de passe est requis')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .max(100, 'Le mot de passe ne doit pas dépasser 100 caractères')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
    ),

  password_confirmation: yup
    .string()
    .required('La confirmation est requise')
    .oneOf([yup.ref('password')], 'Les mots de passe ne correspondent pas'),

  age: yup
    .number()
    .required("L'âge est requis")
    .integer("L'âge doit être un nombre entier")
    .min(13, 'Vous devez avoir au moins 13 ans')
    .max(120, 'Âge invalide'),

  province: yup.string().required('La province est requise'),

  commune: yup
    .string()
    .required('La commune est requise')
    .min(2, 'La commune doit contenir au moins 2 caractères')
    .max(100, 'La commune ne doit pas dépasser 100 caractères'),

  phoneNumber: yup
    .string()
    .matches(/^(\+213|0)[567]\d{8}$/, 'Numéro de téléphone algérien invalide')
    .optional(),
})

export const loginSchema = yup.object({
  email: yup.string().required("L'email est requis").email('Adresse email invalide'),
  password: yup.string().required('Le mot de passe est requis'),
})

export const forgotPasswordSchema = yup.object({
  email: yup.string().required("L'email est requis").email('Adresse email invalide'),
})

export const resetPasswordSchema = yup.object({
  token: yup.string().required('Token invalide'),
  password: yup
    .string()
    .required('Le mot de passe est requis')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .max(100, 'Le mot de passe ne doit pas dépasser 100 caractères')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
    ),
  password_confirmation: yup
    .string()
    .required('La confirmation est requise')
    .oneOf([yup.ref('password')], 'Les mots de passe ne correspondent pas'),
})

export const updateProfileSchema = yup.object({
  firstName: yup
    .string()
    .required('Le prénom est requis')
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(100, 'Le prénom ne doit pas dépasser 100 caractères'),

  lastName: yup
    .string()
    .required('Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne doit pas dépasser 100 caractères'),

  age: yup
    .number()
    .required("L'âge est requis")
    .integer("L'âge doit être un nombre entier")
    .min(13, 'Vous devez avoir au moins 13 ans')
    .max(120, 'Âge invalide'),

  province: yup.string().required('La province est requise'),

  commune: yup
    .string()
    .required('La commune est requise')
    .min(2, 'La commune doit contenir au moins 2 caractères'),

  phoneNumber: yup
    .string()
    .matches(/^(\+213|0)[567]\d{8}$/, 'Numéro de téléphone algérien invalide')
    .optional(),
})

// Types TypeScript
export type RegisterFormData = yup.InferType<typeof registerSchema>
export type LoginFormData = yup.InferType<typeof loginSchema>
export type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>
export type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>
export type UpdateProfileFormData = yup.InferType<typeof updateProfileSchema>
