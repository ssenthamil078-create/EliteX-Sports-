import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Activity,
  ArrowRight,
  Brain,
  Database,
  Dumbbell,
  HeartPulse,
  Settings,
  ShieldCheck,
  Sparkles,
  Trophy,
  Video,
  ClipboardList,
  UserSearch,
} from 'lucide-react'

import { healthAPI } from '@/api'
import { Card, PageHeader, StatCard, Badge } from '@/components/ui'
import { useAuthStore } from '@/store/authStore'
import ReadinessWidget from '@/components/dashboard/ReadinessWidget'
import WeeklySummaryWidget from '@/components/dashboard/WeeklySummaryWidget'
import { SkeletonStatGrid } from '@/components/ui/Skeleton'

const roleCards = {
  athlete: [
    {
      title: 'Log Training',
      desc: 'Add today’s session and unlock analytics.',
      path: '/training-log',
      icon: Dumbbell,
    },
    {
      title: 'Analytics',
      desc: 'Track scores, fatigue, pain and performance.',
      path: '/analytics',
      icon: Activity,
    },
    {
      title: 'AI Training Plan',
      desc: 'Generate personalised AI training plan.',
      path: '/ai-training-plan',
      icon: Brain,
    },
    {
      title: 'AI Recommendations',
      desc: 'Find competitions, scholarships and schemes.',
      path: '/recommendations',
      icon: Sparkles,
    },
    {
      title: 'Pose Analysis',
      desc: 'Upload a video for AI biomechanics report.',
      path: '/pose-analysis',
      icon: Video,
    },
    {
      title: 'Athlete Portfolio',
      desc: 'Generate sponsor-ready athlete profile.',
      path: '/portfolio',
      icon: Trophy,
    },
  ],

  coach: [
    {
      title: 'Coach Plans',
      desc: 'Create structured plans for athletes.',
      path: '/coach-plans',
      icon: ClipboardList,
    },
    {
      title: 'Athlete Discovery',
      desc: 'Discover athlete profiles and performance.',
      path: '/scout-sponsor',
      icon: UserSearch,
    },
    {
      title: 'AI Coach Chat',
      desc: 'Ask AI for coaching ideas and session guidance.',
      path: '/ai-chat',
      icon: Brain,
    },
    {
      title: 'Leaderboard',
      desc: 'Compare athletes by score and training performance.',
      path: '/leaderboard',
      icon: Trophy,
    },
  ],

  scout: [
    {
      title: 'Scout Discovery',
      desc: 'Find and shortlist athlete talent.',
      path: '/scout-sponsor',
      icon: UserSearch,
    },
    {
      title: 'Leaderboard',
      desc: 'Compare top athletes by score.',
      path: '/leaderboard',
      icon: Trophy,
    },
    {
      title: 'AI Hub',
      desc: 'Use AI-supported athlete intelligence.',
      path: '/ai-hub',
      icon: Brain,
    },
  ],

  admin: [
    {
      title: 'Admin Panel',
      desc: 'View secure platform overview.',
      path: '/admin',
      icon: ShieldCheck,
    },
    {
      title: 'Manage Opportunities',
      desc: 'Add, edit and delete competitions and scholarships.',
      path: '/admin/opportunities',
      icon: Trophy,
    },
    {
      title: 'Project Status',
      desc: 'Check backend modules and database counts.',
      path: '/project-status',
      icon: Database,
    },
    {
      title: 'Settings',
      desc: 'Manage account and security settings.',
      path: '/settings',
      icon: Settings,
    },
  ],
}

function getRoleLabel(role) {
  if (role === 'admin') return 'Admin Control'
  if (role === 'coach') return 'Coach Console'
  if (role === 'scout') return 'Scout Console'
  return 'Athlete Mode'
}

export default function Dashboard() {
  const user = useAuthStore((state) => state.user)
  const role = useAuthStore((state) => state.getRole())

  const { data, isLoading } = useQuery({
    queryKey: ['project-status'],
    queryFn: () => healthAPI.projectStatus().then((res) => res.data),
    retry: false,
  })

  const counts = data?.database_counts || {}
  const cards = roleCards[role] || roleCards.athlete

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Your responsive EliteX sports intelligence control center."
      />

      <section className="mb-8 overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/20 via-surface/80 to-accent/10 p-5 shadow-neon sm:p-6 lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <Badge>{getRoleLabel(role)}</Badge>

            <h1 className="mt-4 break-words text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              Welcome, {user?.name || 'Athlete'}
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-400 sm:text-base">
              EliteX personalizes this dashboard based on your role. Track
              performance, access AI insights, discover opportunities and manage
              your sports growth from one place.
            </p>
          </div>

          <div className="relative mx-auto flex h-40 w-40 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-background/40 sm:h-48 sm:w-48 lg:mx-0">
            <div className="absolute inset-4 rounded-full bg-primary/20 blur-2xl" />
            <Brain className="relative h-20 w-20 text-primary sm:h-24 sm:w-24" />
          </div>
        </div>
      </section>

      <div className="mb-8">
        <ReadinessWidget />
      </div>
      <div className="mb-8">
        <WeeklySummaryWidget />
        </div>
        {isLoading ? (
  <div className="mb-8">
    <SkeletonStatGrid count={4} />
  </div>
) : (
  <div className="mb-8 responsive-stat-grid">
    <StatCard
      label="Users"
      value={counts.users ?? '—'}
      icon={ShieldCheck}
    />

    <StatCard
      label="Athletes"
      value={counts.athletes ?? '—'}
      icon={Dumbbell}
    />

    <StatCard
      label="Training Logs"
      value={counts.training_logs ?? '—'}
      icon={Activity}
    />

    <StatCard
      label="AI Modules"
      value="8+"
      icon={Brain}
    />
  </div>
)}

      <section className="mb-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black">Quick Actions</h2>
            <p className="mt-1 text-sm text-gray-400">
              Recommended shortcuts for your current role.
            </p>
          </div>

          <Badge>{role || 'athlete'}</Badge>
        </div>
      </section>

      <div className="responsive-card-grid">
        {cards.map((card) => {
          const Icon = card.icon

          return (
            <Link key={card.path} to={card.path}>
              <Card className="h-full">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="rounded-2xl bg-primary/20 p-3 text-primary">
                    <Icon className="h-7 w-7" />
                  </div>

                  <ArrowRight className="h-5 w-5 shrink-0 text-gray-500" />
                </div>

                <h3 className="text-xl font-black text-white sm:text-2xl">
                  {card.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-400">
                  {card.desc}
                </p>
              </Card>
            </Link>
          )
        })}
      </div>
      

      {role === 'athlete' && (
        <section className="mt-8 rounded-[2rem] border border-primary/20 bg-background/40 p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <HeartPulse className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-black">Today’s Athlete Focus</h2>
          </div>

          <div className="responsive-card-grid">
            <FocusCard
              title="Recovery"
              text="Watch fatigue and pain level before pushing high intensity."
            />
            <FocusCard
              title="Consistency"
              text="Daily logs improve prediction accuracy and recommendations."
            />
            <FocusCard
              title="Movement Quality"
              text="Upload pose analysis videos to detect posture and balance issues."
            />
          </div>
        </section>
      )}
    </div>
  )
}

function FocusCard({ title, text }) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-surface/40 p-4">
      <h3 className="font-black text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-gray-400">{text}</p>
    </div>
  )
}