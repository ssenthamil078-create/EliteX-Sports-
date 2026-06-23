import { useQuery } from '@tanstack/react-query'
import {
  CalendarDays,
  Clock,
  Dumbbell,
  HeartPulse,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

import { athleteAPI } from '@/api/sportsAPI'
import { useAuthStore } from '@/store/authStore'
import { Card, Badge } from '@/components/ui'

export default function WeeklySummaryWidget() {
  const userId = useAuthStore((s) => s.getUserId())

  const { data, isLoading, isError } = useQuery({
    queryKey: ['weekly-summary', userId],
    queryFn: () => athleteAPI.getWeeklySummary(userId).then((res) => res.data),
    enabled: !!userId,
    retry: false,
  })

  if (isLoading) {
    return (
      <Card hover={false}>
        <div className="h-64 animate-pulse rounded-3xl bg-surface/70" />
      </Card>
    )
  }

  if (isError || !data) {
    return (
      <Card hover={false}>
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <CalendarDays className="mb-4 h-14 w-14 text-primary" />
          <h2 className="text-2xl font-black">Weekly Summary Locked</h2>
          <p className="mt-2 max-w-md text-sm text-gray-400">
            Add training logs this week to generate your EliteX weekly sports summary.
          </p>
        </div>
      </Card>
    )
  }

  const variant =
    data.status === 'Strong Week'
      ? 'success'
      : data.status === 'Recovery Focus'
      ? 'danger'
      : 'warning'

  return (
    <Card hover={false}>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <Badge variant={variant}>{data.status}</Badge>

          <h2 className="mt-4 text-3xl font-black">
            Weekly AI Summary
          </h2>

          <p className="mt-2 text-sm leading-7 text-gray-400">
            {data.summary}
          </p>
        </div>

        <Sparkles className="h-10 w-10 text-warning" />
      </div>

      <div className="responsive-stat-grid">
        <Metric icon={Dumbbell} label="Sessions" value={data.total_sessions} />
        <Metric icon={Clock} label="Minutes" value={data.total_minutes} />
        <Metric icon={TrendingUp} label="Performance" value={data.average_performance} />
        <Metric icon={HeartPulse} label="Fatigue" value={data.average_fatigue} />
      </div>

      <div className="mt-6 rounded-3xl border border-primary/20 bg-background/40 p-5">
        <h3 className="mb-2 font-black text-white">EliteX Suggestion</h3>
        <p className="text-sm leading-7 text-gray-400">
          {data.suggestion}
        </p>
      </div>
    </Card>
  )
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-background/40 p-4">
      <Icon className="mb-2 h-5 w-5 text-primary" />
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-black text-white">{value ?? '—'}</p>
    </div>
  )
}