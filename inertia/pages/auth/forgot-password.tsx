import { Head, Link } from '@inertiajs/react'
import { motion } from 'motion/react'
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import AuthLayout from '~/components/layouts/AuthLayout'
import Input from '~/components/ui/Input'
import Button from '~/components/ui/Button'
import Alert from '~/components/ui/Alert'
import { useValidatedForm } from '~/hooks/useValidatedForm'
import { forgotPasswordSchema } from '~/lib/validation'
import { useRouteGuard } from '~/hooks/useRouteGuard'

export default function ForgotPassword() {
  useRouteGuard({ requiresGuest: true })

  const { form, getError, handleBlur, submit, shouldShowError } = useValidatedForm({
    schema: forgotPasswordSchema,
    initialData: {
      email: '',
    },
  })

  const handleSubmit = async () => {
    await submit('post', '/auth/forgot-password')
  }

  return (
    <>
      <Head title="Mot de passe oublié" />
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
                <EnvelopeIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Mot de passe oublié ?</h1>
              <p className="text-neutral-600">
                Pas de problème ! Entrez votre email et nous vous enverrons un lien de
                réinitialisation.
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
                Vous recevrez un email avec un lien pour réinitialiser votre mot de passe s'il
                existe un compte associé à cet email.
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
                  label="Adresse email"
                  type="email"
                  value={form.data.email}
                  onChange={(value) => form.setData('email', value as string)}
                  onBlur={() => handleBlur('email')}
                  error={shouldShowError('email') ? getError('email') : undefined}
                  icon={EnvelopeIcon}
                  placeholder="votre.email@exemple.com"
                  required
                  autoFocus
                  disabled={form.processing}
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <Button
                  variant="gradient"
                  size="lg"
                  fullWidth
                  loading={form.processing}
                  disabled={form.processing}
                  onClick={handleSubmit}
                >
                  Envoyer le lien de réinitialisation
                </Button>
              </motion.div>

              {/* Back to Login */}
              <motion.div
                className="text-center pt-4 border-t border-neutral-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
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

          {/* Additional Help */}
          <motion.div
            className="mt-6 text-center bg-neutral-100/50 backdrop-blur-sm rounded-2xl p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            <p className="text-sm text-neutral-700 mb-2">
              <strong>Besoin d'aide ?</strong>
            </p>
            <p className="text-xs text-neutral-600">
              Si vous n'avez pas reçu l'email après quelques minutes, vérifiez votre dossier spam ou
              contactez notre support.
            </p>
          </motion.div>
        </motion.div>
      </AuthLayout>
    </>
  )
}
