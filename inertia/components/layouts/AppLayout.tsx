import { motion } from 'motion/react'
import Header from '~/components/shared/Header'
import Footer from '~/components/shared/Footer'
import FlashMessage from '~/components/shared/FlashMessage'

interface AppLayoutProps {
  children: React.ReactNode
  showHeader?: boolean
  showFooter?: boolean
  containerClass?: string
  layout?: 'default' | 'auth' | 'full'
}

export default function AppLayout({
  children,
  showHeader = true,
  showFooter = true,
  containerClass = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8',
  layout = 'default',
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col antialiased">
      {showHeader && <Header />}
      <FlashMessage />

      <motion.main
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {layout === 'full' ? (
          <div className="w-full">{children}</div>
        ) : (
          <div className={containerClass}>{children}</div>
        )}
      </motion.main>

      {showFooter && <Footer />}
    </div>
  )
}