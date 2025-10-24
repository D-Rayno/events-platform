import { Head, Link } from '@inertiajs/react'
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  SparklesIcon as SparklesOutlineIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'
import { SparklesIcon as SparklesSolidIcon } from '@heroicons/react/24/solid'
import AppLayout from '~/components/layouts/AppLayout'
import Button from '~/components/ui/Button'
import Card from '~/components/ui/Card'
import { useTheme } from '~/hooks/useTheme'
import { motion } from 'motion/react'

export default function Home() {
  const { config, appName, appTagline } = useTheme()

  const features = [
    {
      icon: CalendarIcon,
      title: 'Varied Events',
      description: 'From conferences to concerts, find the perfect event for you',
      color: 'from-sky-500 to-blue-600',
    },
    {
      icon: MapPinIcon,
      title: 'Across Algeria',
      description: 'Discover events in all wilayas of the country',
      color: 'from-purple-500 to-pink-600',
    },
    {
      icon: UsersIcon,
      title: 'Active Community',
      description: 'Join thousands of passionate participants',
      color: 'from-orange-500 to-red-600',
    },
    {
      icon: SparklesOutlineIcon,
      title: 'Easy Registration',
      description: 'Book your spot in a few clicks with QR code',
      color: 'from-green-500 to-emerald-600',
    },
  ]

  const benefits = [
    'Quick and secure registration',
    'QR codes for easy access',
    'Notifications for your events',
    'Manage your registrations',
    '24/7 support',
    'Secure payment',
  ]

  const stats = [
    { label: 'Events', value: '500+', icon: CalendarIcon },
    { label: 'Participants', value: '10K+', icon: UsersIcon },
    { label: 'Cities', value: '48', icon: MapPinIcon },
  ]

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Participant',
      content:
        'EventHub has revolutionized how I discover and attend events. The QR code system is genius!',
      avatar: '/images/banner-default.jpg',
    },
    {
      name: 'Ahmed K.',
      role: 'Organizer',
      content:
        'Managing registrations has never been easier. Our attendance rate increased by 40%!',
      avatar: '/images/banner-default.jpg',
    },
    {
      name: 'Fatima Z.',
      role: 'Speaker',
      content: 'The platform connects me with the right audience. Professional and user-friendly.',
      avatar: '/images/banner-default.jpg',
    },
  ]

  return (
    <>
      <Head>
        <title>{config.seo.defaultTitle}</title>
        <meta name="description" content={config.seo.description} />
        <meta name="keywords" content={config.seo.keywords.join(', ')} />
      </Head>

      <AppLayout>
        {/* Hero Section */}
        <section
          className="relative min-h-[80vh] flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden"
          style={{ backgroundImage: `url(${config.images.banner.home})` }}
        >
          <div className="absolute inset-0 bg-linear-to-br from-primary-900/80 to-secondary-900/80 backdrop-blur-sm" />

          <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {appName}
            </motion.h1>

            <motion.p
              className="text-xl md:text-3xl text-white/90 mb-10"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {appTagline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button
                as={Link}
                href="/events"
                variant="gradient"
                size="xl"
                iconRight={ArrowRightIcon}
                className="shadow-2xl hover:shadow-primary-500/30 transition-shadow"
              >
                Discover Events
              </Button>
            </motion.div>
          </div>

          {/* Floating elements */}
          <motion.div
            className="absolute top-20 left-10 text-6xl animate-float"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 0.5 }}
          >
            🎉
          </motion.div>
          <motion.div
            className="absolute bottom-20 right-20 text-6xl animate-float"
            style={{ animationDelay: '1s' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 0.6 }}
          >
            🎟️
          </motion.div>
          <motion.div
            className="absolute top-40 right-40 text-6xl animate-float"
            style={{ animationDelay: '2s' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 0.7 }}
          >
            📍
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              className="text-4xl font-bold text-center text-neutral-900 mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Why Choose {appName}?
            </motion.h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card hoverable className="h-full">
                    <div
                      className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-linear-to-br ${feature.color} flex items-center justify-center shadow-lg`}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-3 text-center">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-600 text-center">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-linear-to-br from-primary-50 to-secondary-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-neutral-900 mb-8">
                  Experience the Best Event Platform
                </h2>
                <p className="text-xl text-neutral-700 mb-10">
                  Join thousands of satisfied users who trust {appName} for their event needs.
                </p>
                <ul className="space-y-4 mb-10">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3 text-neutral-800">
                      <CheckCircleIcon className="w-6 h-6 text-green-500" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Button
                  as={Link}
                  href="/register"
                  variant="primary"
                  size="lg"
                  iconLeft={SparklesSolidIcon}
                >
                  Get Started Free
                </Button>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <img
                  src={config.images.placeholder.event}
                  alt="Event Platform"
                  className="rounded-3xl shadow-2xl rotate-3"
                />
                <img
                  src={config.images.placeholder.user}
                  alt="Mobile App"
                  className="absolute -bottom-10 -left-20 w-64 rounded-2xl shadow-xl -rotate-6"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-100 mb-6">
                    <stat.icon className="w-10 h-10 text-primary-600" />
                  </div>
                  <h3 className="text-5xl font-bold text-neutral-900 mb-2">{stat.value}</h3>
                  <p className="text-neutral-600">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              className="text-4xl font-bold text-center text-neutral-900 mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              What Our Users Say
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={testimonial.name} variant="elevated" hoverable className="flex flex-col">
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-neutral-900">{testimonial.name}</h4>
                      <p className="text-sm text-neutral-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-neutral-700 flex-grow">"{testimonial.content}"</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              className="text-4xl font-bold text-center text-neutral-900 mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Get in Touch
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8">
              <Card hoverable className="text-center">
                <div className="text-5xl mb-4">✉️</div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">Email</h3>
                <p className="text-neutral-600 mb-4">{config.contact.email}</p>
                <a
                  href={`mailto:${config.contact.email}`}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Contact Us
                </a>
              </Card>

              <Card hoverable className="text-center">
                <div className="text-5xl mb-4">📱</div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">Phone</h3>
                <p className="text-neutral-600 mb-4">{config.contact.phone}</p>
                <a
                  href={`tel:${config.contact.phone}`}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Call
                </a>
              </Card>

              <Card hoverable className="text-center">
                <div className="text-5xl mb-4">📍</div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">Address</h3>
                <p className="text-neutral-600 mb-4">{config.contact.address}</p>
                <span className="text-primary-600 font-medium">Visit Us</span>
              </Card>
            </div>
          </div>
        </section>
      </AppLayout>
      <style>{`
        /* Custom animations */
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </>
  )
}
