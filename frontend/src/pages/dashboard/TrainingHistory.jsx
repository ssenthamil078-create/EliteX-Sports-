import { useQuery } from '@tanstack/react-query'
import {
  History,
  Dumbbell,
  Timer,
  Flame,
  Gauge,
  HeartPulse,
  Trophy,
  RefreshCw,
} from 'lucide-react'

import { trainingAPI } from '@/api/sportsAPI'
import { useAuthStore } from '@/store/authStore'
import { Card, PageHeader, Button, Badge } from '@/components/ui'
import { SkeletonStatGrid, SkeletonTable } from '@/components/ui/Skeleton'

export default function TrainingHistory() {
  const userId = useAuthStore((s) => s.getUserId())

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['training-history', userId],
    queryFn: () => trainingAPI.getLogs(userId).then((res) => res.data),
    enabled: !!userId,
  })

  const logs = data?.training_history || []

  return (
    <div>
      <PageHeader
        title="Training History"
        subtitle="View all logged training sessions and performance details."
        action={
          <Button onClick={() => refetch()} loading={isFetching}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        }
      />

      {isLoading ? (
        <div className="mb-8">
          <SkeletonStatGrid count={3} />
        </div>
      ) : (
        <div className="mb-8 responsive-stat-grid">
          <Card hover={false}>
            <History className="mb-4 h-8 w-8 text-primary" />
            <p className="text-sm text-gray-400">Total Logs</p>
            <h2 className="mt-2 text-3xl font-black">
              {data?.total_logs ?? 0}
            </h2>
          </Card>

          <Card hover={false}>
            <Trophy className="mb-4 h-8 w-8 text-warning" />
            <p className="text-sm text-gray-400">Latest Score</p>
            <h2 className="mt-2 text-3xl font-black">
              {logs[0]?.performance_score ?? '—'}
            </h2>
          </Card>

          <Card hover={false}>
            <Dumbbell className="mb-4 h-8 w-8 text-success" />
            <p className="text-sm text-gray-400">Latest Type</p>
            <h2 className="mt-2 text-2xl font-black">
              {logs[0]?.training_type || '—'}
            </h2>
          </Card>
        </div>
      )}

      <Card hover={false}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black">Session Timeline</h2>
            <p className="text-sm text-gray-400">
              Your most recent training sessions are shown first.
            </p>
          </div>

          <Badge>{logs.length} sessions</Badge>
        </div>

        {isLoading ? (
          <SkeletonTable rows={5} />
        ) : logs.length > 0 ? (
          <div className="space-y-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className="rounded-3xl border border-primary/20 bg-background/40 p-5"
              >
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-xl font-black text-white">
                      {log.training_type}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {log.created_at
                        ? new Date(log.created_at).toLocaleString()
                        : 'Unknown time'}
                    </p>
                  </div>

                  <Badge variant="success">Score {log.performance_score}</Badge>
                </div>

                <div className="responsive-card-grid">
                  <Metric icon={Timer} label="Duration" value={`${log.duration_minutes} min`} />
                  <Metric icon={Gauge} label="Intensity" value={log.intensity} />
                  <Metric icon={Flame} label="Calories" value={log.calories_burned} />
                  <Metric icon={Dumbbell} label="Fatigue" value={log.fatigue_level} />
                  <Metric icon={HeartPulse} label="Pain" value={log.injury_pain_level} />
                </div>

                {log.notes && (
                  <div className="mt-4 rounded-2xl border border-primary/20 bg-background/50 p-4 text-sm leading-7 text-gray-400">
                    {log.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-72 flex-col items-center justify-center text-center">
            <History className="mb-4 h-14 w-14 text-primary" />
            <h2 className="text-2xl font-black">No training history</h2>
            <p className="mt-2 max-w-md text-gray-400">
              Add training sessions to build your performance timeline.
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-background/50 p-4">
      <Icon className="mb-2 h-5 w-5 text-primary" />
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 font-black text-white">{value}</p>
    </div>
  )
}