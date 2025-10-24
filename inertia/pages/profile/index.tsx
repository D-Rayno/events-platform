import { Head, router } from '@inertiajs/react'
import { useState } from 'react'
import { motion } from 'motion/react'
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  CameraIcon,
  TrashIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'
import AppLayout from '~/components/layouts/AppLayout'
import Card from '~/components/ui/Card'
import Button from '~/components/ui/Button'
import Input from '~/components/ui/Input'
import Select from '~/components/ui/Select'
import Avatar from '~/components/ui/Avatar'
import Badge from '~/components/ui/Badge'
import Alert from '~/components/ui/Alert'
import Modal from '~/components/ui/Modal'
import { useValidatedForm } from '~/hooks/useValidatedForm'
import { useRouteGuard } from '~/hooks/useRouteGuard'
import { updateProfileSchema } from '~/lib/validation'
import { useFileUpload } from '~/hooks/useFileUpload'
import { PROVINCES } from '~/lib/constants'
import { formatDate } from '~/lib/utils'

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  age: number
  province: string
  commune: string
  phoneNumber?: string
  avatarUrl?: string
  isEmailVerified: boolean
  createdAt: string
}

interface Props {
  user: User
}

export default function ProfileIndex({ user }: Props) {
  useRouteGuard({ requiresAuth: true })

  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeletingAvatar, setIsDeletingAvatar] = useState(false)

  const { files, previews, handleFiles, clearFiles } = useFileUpload({
    maxSize: 2 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    multiple: false,
  })

  const { form, getError, handleBlur, shouldShowError } = useValidatedForm({
    schema: updateProfileSchema,
    initialData: {
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      province: user.province,
      commune: user.commune,
      phoneNumber: user.phoneNumber || '',
    },
  })

  const provinceOptions = PROVINCES.map((p) => ({
    value: p,
    label: p,
  }))

  const handleSubmit = async () => {
    const formData = new FormData()
    formData.append('firstName', form.data.firstName)
    formData.append('lastName', form.data.lastName)
    formData.append('age', String(form.data.age))
    formData.append('province', form.data.province)
    formData.append('commune', form.data.commune)
    if (form.data.phoneNumber) {
      formData.append('phoneNumber', form.data.phoneNumber)
    }
    if (files[0]) {
      formData.append('avatar', files[0])
    }

    router.post('/profile', formData as any, {
      preserveScroll: true,
      onSuccess: () => {
        setIsEditing(false)
        clearFiles()
      },
    })
  }

  const handleDeleteAvatar = () => {
    setIsDeletingAvatar(true)
    router.delete('/profile/avatar', {
      preserveScroll: true,
      onSuccess: () => {
        setShowDeleteModal(false)
        setIsDeletingAvatar(false)
      },
      onError: () => {
        setIsDeletingAvatar(false)
      },
    })
  }

  const handleCancel = () => {
    form.reset()
    clearFiles()
    setIsEditing(false)
  }

  return (
    <>
      <Head title="Mon Profil" />
      <AppLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Mon Profil</h1>
            <p className="text-neutral-600">
              Gérez vos informations personnelles et vos préférences
            </p>
          </motion.div>

          {/* Email Verification Alert */}
          {!user.isEmailVerified && (
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Alert type="warning">
                Votre email n'est pas encore vérifié. Veuillez vérifier votre boîte de réception.
              </Alert>
            </motion.div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card className="text-center">
                <div className="relative inline-block mb-6">
                  <Avatar
                    name={`${user.firstName} ${user.lastName}`}
                    src={user.avatarUrl}
                    size="2xl"
                    ring
                  />
                  {user.isEmailVerified && (
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-success-500 rounded-full border-4 border-white flex items-center justify-center">
                      <CheckCircleIcon className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-neutral-900 mb-1">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-neutral-600 mb-4">{user.email}</p>

                <div className="space-y-2 mb-6">
                  <Badge variant="primary" size="lg">
                    {user.age} ans
                  </Badge>
                  <p className="text-sm text-neutral-600">
                    Membre depuis {formatDate(user.createdAt)}
                  </p>
                </div>

                {!isEditing && (
                  <div className="space-y-2">
                    <Button variant="primary" fullWidth onClick={() => setIsEditing(true)}>
                      Modifier le profil
                    </Button>
                    {user.avatarUrl && (
                      <Button
                        variant="outline"
                        fullWidth
                        iconLeft={TrashIcon}
                        onClick={() => setShowDeleteModal(true)}
                      >
                        Supprimer la photo
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Information Card */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-neutral-900">Informations personnelles</h3>
                  {isEditing && (
                    <Badge variant="info" pulse>
                      Mode édition
                    </Badge>
                  )}
                </div>

                {!isEditing ? (
                  <div className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="flex items-start gap-3">
                        <UserCircleIcon className="w-6 h-6 text-primary-600 mt-1" />
                        <div>
                          <p className="text-sm font-semibold text-neutral-700">Prénom</p>
                          <p className="text-neutral-900">{user.firstName}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <UserCircleIcon className="w-6 h-6 text-primary-600 mt-1" />
                        <div>
                          <p className="text-sm font-semibold text-neutral-700">Nom</p>
                          <p className="text-neutral-900">{user.lastName}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <EnvelopeIcon className="w-6 h-6 text-primary-600 mt-1" />
                        <div>
                          <p className="text-sm font-semibold text-neutral-700">Email</p>
                          <p className="text-neutral-900">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CalendarIcon className="w-6 h-6 text-primary-600 mt-1" />
                        <div>
                          <p className="text-sm font-semibold text-neutral-700">Âge</p>
                          <p className="text-neutral-900">{user.age} ans</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPinIcon className="w-6 h-6 text-primary-600 mt-1" />
                        <div>
                          <p className="text-sm font-semibold text-neutral-700">Wilaya</p>
                          <p className="text-neutral-900">{user.province}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPinIcon className="w-6 h-6 text-primary-600 mt-1" />
                        <div>
                          <p className="text-sm font-semibold text-neutral-700">Commune</p>
                          <p className="text-neutral-900">{user.commune}</p>
                        </div>
                      </div>

                      {user.phoneNumber && (
                        <div className="flex items-start gap-3">
                          <PhoneIcon className="w-6 h-6 text-primary-600 mt-1" />
                          <div>
                            <p className="text-sm font-semibold text-neutral-700">Téléphone</p>
                            <p className="text-neutral-900">{user.phoneNumber}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Avatar Upload */}
                    <div>
                      <label className="block text-sm font-semibold text-neutral-800 mb-3">
                        Photo de profil
                      </label>
                      <div className="flex items-center gap-4">
                        <Avatar
                          name={`${form.data.firstName} ${form.data.lastName}`}
                          src={previews[0] || user.avatarUrl}
                          size="xl"
                        />
                        <div className="flex-1">
                          <input
                            type="file"
                            id="avatar"
                            accept="image/*"
                            onChange={handleFiles}
                            className="hidden"
                          />
                          <label htmlFor="avatar">
                            <Button
                              variant="outline"
                              size="sm"
                              iconLeft={CameraIcon}
                              className="cursor-pointer"
                            >
                              Changer la photo
                            </Button>
                          </label>
                          <p className="text-xs text-neutral-500 mt-2">
                            JPG, PNG ou WEBP. Max 2MB.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label="Prénom"
                        value={form.data.firstName}
                        onChange={(value) => form.setData('firstName', value as string)}
                        onBlur={() => handleBlur('firstName')}
                        error={shouldShowError('firstName') ? getError('firstName') : undefined}
                        icon={UserCircleIcon}
                        required
                        disabled={form.processing}
                      />

                      <Input
                        label="Nom"
                        value={form.data.lastName}
                        onChange={(value) => form.setData('lastName', value as string)}
                        onBlur={() => handleBlur('lastName')}
                        error={shouldShowError('lastName') ? getError('lastName') : undefined}
                        icon={UserCircleIcon}
                        required
                        disabled={form.processing}
                      />

                      <Input
                        label="Âge"
                        type="number"
                        value={form.data.age}
                        onChange={(value) => form.setData('age', value as number)}
                        onBlur={() => handleBlur('age')}
                        error={shouldShowError('age') ? getError('age') : undefined}
                        icon={CalendarIcon}
                        required
                        min={13}
                        max={120}
                        disabled={form.processing}
                      />

                      <Input
                        label="Téléphone"
                        type="tel"
                        value={form.data.phoneNumber}
                        onChange={(value) => form.setData('phoneNumber', value as string)}
                        onBlur={() => handleBlur('phoneNumber')}
                        error={shouldShowError('phoneNumber') ? getError('phoneNumber') : undefined}
                        icon={PhoneIcon}
                        placeholder="+213 555 123 456"
                        disabled={form.processing}
                      />

                      <Select
                        label="Wilaya"
                        value={form.data.province}
                        onChange={(value) => form.setData('province', value as string)}
                        options={provinceOptions}
                        error={shouldShowError('province') ? getError('province') : undefined}
                        required
                        searchable
                        disabled={form.processing}
                      />

                      <Input
                        label="Commune"
                        value={form.data.commune}
                        onChange={(value) => form.setData('commune', value as string)}
                        onBlur={() => handleBlur('commune')}
                        error={shouldShowError('commune') ? getError('commune') : undefined}
                        icon={MapPinIcon}
                        required
                        disabled={form.processing}
                      />
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-neutral-200">
                      <Button
                        variant="primary"
                        fullWidth
                        loading={form.processing}
                        disabled={form.processing}
                        onClick={handleSubmit}
                      >
                        Enregistrer les modifications
                      </Button>
                      <Button
                        variant="outline"
                        fullWidth
                        onClick={handleCancel}
                        disabled={form.processing}
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Delete Avatar Modal */}
        <Modal
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Supprimer la photo de profil"
          maxWidth="sm"
          footer={
            <div className="flex gap-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeletingAvatar}
              >
                Annuler
              </Button>
              <Button
                variant="danger"
                fullWidth
                loading={isDeletingAvatar}
                disabled={isDeletingAvatar}
                onClick={handleDeleteAvatar}
              >
                Supprimer
              </Button>
            </div>
          }
        >
          <p className="text-neutral-700">
            Êtes-vous sûr de vouloir supprimer votre photo de profil ? Cette action est
            irréversible.
          </p>
        </Modal>
      </AppLayout>
    </>
  )
}
