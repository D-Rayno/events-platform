// inertia/components/registrations/Info.tsx
import { motion } from 'motion/react'
import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import Card from '~/components/ui/Card'

export default function RegistrationInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card>
        <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
          <ExclamationTriangleIcon className="w-6 h-6 text-warning-600" />
          Informations importantes
        </h3>

        <ul className="space-y-3 text-neutral-700">
          <li className="flex items-start gap-3">
            <CheckCircleIcon className="w-5 h-5 text-success-600 mt-0.5 shrink-0" />
            <span>Arrivez 15 minutes avant le début de l'événement pour l'enregistrement</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircleIcon className="w-5 h-5 text-success-600 mt-0.5 shrink-0" />
            <span>Assurez-vous que votre QR code est lisible (téléchargé ou imprimé)</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircleIcon className="w-5 h-5 text-success-600 mt-0.5 shrink-0" />
            <span>
              En cas d'empêchement, annulez votre inscription pour libérer votre place
            </span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircleIcon className="w-5 h-5 text-success-600 mt-0.5 shrink-0" />
            <span>Munissez-vous d'une pièce d'identité pour vérification si nécessaire</span>
          </li>
        </ul>
      </Card>
    </motion.div>
  )
}