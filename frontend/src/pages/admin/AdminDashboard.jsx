import { useQuery } from '@tanstack/react-query'
import {
  ShieldCheck,
  Users,
  Dumbbell,
  Trophy,
  Bell,
  Award,
  Video,
  Database,
  RefreshCw,
} from 'lucide-react'

import { projectAPI } from '@/api/sportsAPI'
import { Card, PageHeader, Button, Badge, StatCard } from '@/components/ui'

export default function AdminDashboard() {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['admin-project-status'],
    queryFn: () => projectAPI.status().then((res) => res.data),
  })

  const counts = data?.database_counts || {}

  return (
    <div>
      <PageHeader
        title="Admin Control Center"
        subtitle="Secure admin-only platform overview for monitoring users, athletes, training logs, AI modules and database health."
        action={
          <Button onClick={() => refetch()} loading={isFetching}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        }
      />

      <Card hover={false} className="mb-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-3xl bg-primary/20 p-4 text-primary">
              <ShieldCheck className="h-9 w-9" />
            </div>

            <div>
              <h2 className="text-2xl font-black">Admin Access Verified</h2>
              <p className="text-sm text-gray-400">
                This page is protected by frontend role guard. Backend protected admin routes can also be checked separately.
              </p>
            </div>
          </div>

          <Badge variant="success">Admin Only</Badge>
        </div>
      </Card>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-3xl bg-surface/70" />
          ))}
        </div>
      ) : (
        <>
          <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Users" value={counts.users ?? 0} icon={Users} />
            <StatCard label="Athletes" value={counts.athletes ?? 0} icon={Dumbbell} />
            <StatCard label="Competitions" value={counts.competitions ?? 0} icon={Trophy} />
            <StatCard label="Training Logs" value={counts.training_logs ?? 0} icon={Database} />
            <StatCard label="Notifications" value={counts.notifications ?? 0} icon={Bell} />
            <StatCard label="Certificates" value={counts.certificates ?? 0} icon={Award} />
            <StatCard label="Video Analyses" value={counts.video_analyses ?? 0} icon={Video} />
            <StatCard label="Schemes" value={counts.schemes ?? 0} icon={ShieldCheck} />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
            <Card hover={false}>
              <h2 className="mb-5 text-2xl font-black">Completed Backend Modules</h2>

              <div className="grid gap-3 md:grid-cols-2">
                {data?.completed_modules?.map((module) => (
                  <div
                    key={module}
                    className="rounded-2xl border border-primary/20 bg-background/40 p-4 text-sm text-gray-300"
                  >
                    ✅ {module}
                  </div>
                ))}
              </div>
            </Card>

            <div className="space-y-6">
              <Card hover={false}>
                <h2 className="mb-4 text-2xl font-black">System Status</h2>

                <div className="space-y-4">
                  <InfoRow label="Backend" value={data?.backend_status} />
                  <InfoRow label="Database" value={data?.database} />
                  <InfoRow label="AI Provider" value={data?.ai_provider} />
                </div>
              </Card>

              <Card hover={false}>
                <h2 className="mb-4 text-2xl font-black">Security Notes</h2>

                <div className="space-y-3 text-sm leading-7 text-gray-400">
                  <p>• Frontend route is protected using role-based guard.</p>
                  <p>• Backend should also protect admin APIs using require_role(["admin"]).</p>
                  <p>• Never expose admin actions to normal users.</p>
                  <p>• Add audit logs later for production-level security.</p>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-primary/20 bg-background/40 p-4">
      <span className="text-gray-400">{label}</span>
      <Badge>{value || 'Unknown'}</Badge>
    </div>
  )
}