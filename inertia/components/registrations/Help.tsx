// inertia/components/registrations/Help.tsx
import { motion } from 'motion/react'
import Card from '~/components/ui/Card'
import Button from '~/components/ui/Button'

export default function RegistrationHelp() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card>
        <h3 className="text-lg font-bold text-neutral-900 mb-3">Besoin d'aide ?</h3>
        <p className="text-sm text-neutral-600 mb-4">
          Si vous rencontrez un problème avec votre inscription, contactez-nous.
        </p>
        <Button variant="outline" fullWidth href="mailto:support@eventhub.dz">
          Contacter le support
        </Button>
      </Card>
    </motion.div>
  )
}
