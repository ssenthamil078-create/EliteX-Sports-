import { Link } from 'react-router-dom'
import {
  FileText,
  Shield,
  Cookie,
  AlertTriangle,
  ArrowRight,
  Scale,
} from 'lucide-react'

import { Card, PageHeader, Badge } from '@/components/ui'

const legalPages = [
  {
    title: 'Terms & Conditions',
    description:
      'Rules for using the platform, account responsibilities, API usage and service limitations.',
    path: '/legal/terms',
    icon: FileText,
    badge: 'Usage Rules',
  },
  {
    title: 'Privacy Policy',
    description:
      'Explains what user data is collected, why it is collected, and how it is protected.',
    path: '/legal/privacy',
    icon: Shield,
    badge: 'Data Safety',
  },
  {
    title: 'Cookie Policy',
    description:
      'Details essential, analytics and preference cookies used by the platform.',
    path: '/legal/cookies',
    icon: Cookie,
    badge: 'Cookies',
  },
  {
    title: 'Disclaimer',
    description:
      'Important limitations for sports predictions, AI insights, medical risk and opportunity data.',
    path: '/legal/disclaimer',
    icon: AlertTriangle,
    badge: 'Limitations',
  },
]

export default function LegalCenter() {
  return (
    <div>
      <PageHeader
        title="Legal Policy Center"
        subtitle="All platform policies, user responsibilities and AI sports disclaimers in one place."
      />

      <div className="mb-8 rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/20 via-surface/80 to-accent/10 p-8 shadow-neon">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-accent shadow-neon">
            <Scale className="h-10 w-10 text-white" />
          </div>

          <div>
            <Badge>Professional Compliance</Badge>

            <h2 className="mt-4 text-3xl font-black text-white">
              Build user trust with transparent policies
            </h2>

            <p className="mt-3 max-w-3xl text-gray-400">
              These pages help explain how the AI sports platform should be used,
              what data is handled, how cookies work, and what limitations apply
              to AI-generated recommendations and sports predictions.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {legalPages.map((page) => {
          const Icon = page.icon

          return (
            <Link key={page.path} to={page.path}>
              <Card className="h-full">
                <div className="mb-5 flex items-start justify-between">
                  <div className="rounded-2xl bg-primary/20 p-3 text-primary">
                    <Icon className="h-7 w-7" />
                  </div>

                  <Badge>{page.badge}</Badge>
                </div>

                <h3 className="text-2xl font-black text-white">
                  {page.title}
                </h3>

                <p className="mt-3 min-h-[120px] text-sm leading-7 text-gray-400">
                  {page.description}
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-bold text-primary">
                  Read Policy
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}