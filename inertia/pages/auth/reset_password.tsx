import { Head, Link } from '@inertiajs/react'
import { motion } from 'motion/react'
import { LockClosedIcon, ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import AuthLayout from '~/components/layouts/AuthLayout'
import Input from '~/components/ui/Input'
import Button from '~/components/ui/Button'
import Alert from '~/components/ui/Alert'
import { useValidatedForm } from '~/hooks/useValidatedForm'
import { resetPasswordSchema } from '~/lib/validation'
import { useRouteGuard } from '~/hooks/useRouteGuard'

interface Props {
  token: string
}

export default function ResetPassword({ token }: Props) {
  useRouteGuard({ requiresGuest: true })

  const { form, getError, handleBlur, submit, shouldShowError } = useValidatedForm({
    schema: resetPasswordSchema,
    initialData: {
      token: token,
      password: '',
      password_confirmation: '',
    },
  })

  const handleSubmit = async () => {
    await submit('post', '/auth/reset-password')
  }

  const passwordRequirements = [
    { text: 'Au moins 8 caractères', met: form.data.password.length >= 8 },
    { text: 'Une lettre majuscule', met: /[A-Z]/.test(form.data.password) },
    { text: 'Une lettre minuscule', met: /[a-z]/.test(form.data.password) },
    { text: 'Un chiffre', met: /\d/.test(form.data.password) },
  ]

  return (
    <>
      <Head title="Réinitialiser le mot de passe" />
      <AuthLayout>
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 md:p-10">
            {/* Header */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LockClosedIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Nouveau mot de passe</h1>
              <p className="text-neutral-600">
                Choisissez un mot de passe sécurisé pour votre compte
              </p>
            </motion.div>

            {/* Info Alert */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Alert type="info">
                Votre nouveau mot de passe doit respecter les critères de sécurité ci-dessous.
              </Alert>
            </motion.div>

            {/* Form */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <Input
                  label="Nouveau mot de passe"
                  type="password"
                  value={form.data.password}
                  onChange={(value) => form.setData('password', value as string)}
                  onBlur={() => handleBlur('password')}
                  error={shouldShowError('password') ? getError('password') : undefined}
                  icon={LockClosedIcon}
                  placeholder="••••••••"
                  required
                  autoFocus
                  disabled={form.processing}
                />

                {/* Password Requirements */}
                {form.data.password && (
                  <motion.div
                    className="mt-4 p-4 bg-neutral-50 rounded-xl"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-sm font-semibold text-neutral-700 mb-3">
                      Critères de sécurité :
                    </p>
                    <div className="space-y-2">
                      {passwordRequirements.map((req, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <CheckCircleIcon
                            className={`w-5 h-5 ${
                              req.met ? 'text-success-600' : 'text-neutral-300'
                            }`}
                          />
                          <span
                            className={`text-sm ${
                              req.met ? 'text-success-700' : 'text-neutral-600'
                            }`}
                          >
                            {req.text}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <Input
                  label="Confirmer le mot de passe"
                  type="password"
                  value={form.data.password_confirmation}
                  onChange={(value) => form.setData('password_confirmation', value as string)}
                  onBlur={() => handleBlur('password_confirmation')}
                  error={
                    shouldShowError('password_confirmation')
                      ? getError('password_confirmation')
                      : undefined
                  }
                  icon={LockClosedIcon}
                  placeholder="••••••••"
                  required
                  disabled={form.processing}
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <Button
                  variant="gradient"
                  size="lg"
                  fullWidth
                  loading={form.processing}
                  disabled={form.processing}
                  onClick={handleSubmit}
                >
                  Réinitialiser le mot de passe
                </Button>
              </motion.div>

              {/* Back to Login */}
              <motion.div
                className="text-center pt-4 border-t border-neutral-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
              >
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  Retour à la connexion
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Security Tips */}
          <motion.div
            className="mt-6 text-center bg-neutral-100/50 backdrop-blur-sm rounded-2xl p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            <p className="text-sm text-neutral-700 mb-2">
              <strong>Conseils de sécurité :</strong>
            </p>
            <ul className="text-xs text-neutral-600 space-y-1">
              <li>• N'utilisez pas le même mot de passe sur plusieurs sites</li>
              <li>• Évitez les informations personnelles facilement devinables</li>
              <li>• Changez votre mot de passe régulièrement</li>
            </ul>
          </motion.div>
        </motion.div>
      </AuthLayout>
    </>
  )
}
