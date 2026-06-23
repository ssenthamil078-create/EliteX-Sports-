import { useQuery } from '@tanstack/react-query'
import {
  Activity,
  Flame,
  Gauge,
  HeartPulse,
  Timer,
  Trophy,
  TrendingUp,
  Zap,
} from 'lucide-react'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

import { useAuthStore } from '@/store/authStore'
import { analyticsAPI } from '@/api/sportsAPI'
import { Card, PageHeader, StatCard, Badge } from '@/components/ui'

export default function Analytics() {
  const userId = useAuthStore((s) => s.getUserId())

  const { data: performance, isLoading: loadingPerformance } = useQuery({
    queryKey: ['performance', userId],
    queryFn: () => analyticsAPI.performance(userId).then((res) => res.data),
    enabled: !!userId,
  })

  const { data: skill } = useQuery({
    queryKey: ['skill-rating', userId],
    queryFn: () => analyticsAPI.skillRating(userId).then((res) => res.data),
    enabled: !!userId,
  })

  const { data: radar } = useQuery({
    queryKey: ['radar', userId],
    queryFn: () => analyticsAPI.radar(userId).then((res) => res.data),
    enabled: !!userId,
  })

  const { data: improvement } = useQuery({
    queryKey: ['improvement', userId],
    queryFn: () => analyticsAPI.improvement(userId).then((res) => res.data),
    enabled: !!userId,
  })

  const radarData =
    radar?.labels?.map((label, index) => ({
      label,
      current: radar.current?.[index] ?? 0,
      previous: radar.previous?.[index] ?? 0,
    })) || []

  const improvementData =
    improvement && !improvement.message
      ? Object.entries(improvement).map(([key, value]) => ({
          name: key,
          value,
        }))
      : []

  if (loadingPerformance) {
    return (
      <div>
        <PageHeader title="Analytics" subtitle="Loading your sports performance data..." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-3xl bg-surface/70" />
          ))}
        </div>
      </div>
    )
  }

  if (!performance) {
    return (
      <div>
        <PageHeader
          title="Analytics"
          subtitle="Add training sessions to unlock analytics."
        />

        <Card>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Activity className="mb-4 h-14 w-14 text-primary" />
            <h2 className="text-2xl font-black">No analytics yet</h2>
            <p className="mt-2 max-w-md text-gray-400">
              Add at least one training log to view performance analytics.
              Add two logs to unlock radar and improvement comparison.
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Performance Analytics"
        subtitle="Track your training load, skill rating, risk level, and session improvement."
      />

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Sessions"
          value={performance.total_sessions}
          icon={Activity}
        />

        <StatCard
          label="Training Minutes"
          value={performance.total_training_minutes}
          icon={Timer}
        />

        <StatCard
          label="Calories Burned"
          value={performance.total_calories_burned}
          icon={Flame}
        />

        <StatCard
          label="Skill Rating"
          value={skill?.skill_rating || '—'}
          sub={`Score: ${skill?.skill_score ?? 0}`}
          icon={Trophy}
        />
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Avg Performance"
          value={performance.average_performance_score}
          icon={TrendingUp}
        />

        <StatCard
          label="Avg Intensity"
          value={performance.average_intensity}
          icon={Zap}
        />

        <StatCard
          label="Avg Fatigue"
          value={performance.average_fatigue}
          icon={Gauge}
        />

        <StatCard
          label="Avg Pain"
          value={performance.average_pain_level}
          icon={HeartPulse}
        />
      </div>

      <div className="mb-8 grid gap-6 xl:grid-cols-2">
        <Card hover={false}>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black">Biomechanics Radar</h2>
              <p className="text-sm text-gray-400">
                Current vs previous session comparison
              </p>
            </div>

            <Badge>
              {radarData.length >= 1 ? 'Active' : 'Need 2 sessions'}
            </Badge>
          </div>

          {radarData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(99,102,241,0.25)" />
                  <PolarAngleAxis
                    dataKey="label"
                    tick={{ fill: '#CBD5E1', fontSize: 12 }}
                  />

                  <Radar
                    name="Previous"
                    dataKey="previous"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.18}
                  />

                  <Radar
                    name="Current"
                    dataKey="current"
                    stroke="#6366F1"
                    fill="#6366F1"
                    fillOpacity={0.35}
                  />

                  <Tooltip
                    contentStyle={{
                      background: '#111827',
                      border: '1px solid rgba(99,102,241,0.35)',
                      borderRadius: '16px',
                      color: '#fff',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-80 items-center justify-center rounded-3xl border border-primary/20 bg-background/40 text-center text-gray-400">
              Add at least 2 training sessions to unlock radar chart.
            </div>
          )}
        </Card>

        <Card hover={false}>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black">Session Improvement</h2>
              <p className="text-sm text-gray-400">
                Difference between your latest two sessions
              </p>
            </div>

            <Badge>
              {improvementData.length > 0 ? 'Active' : 'Need 2 sessions'}
            </Badge>
          </div>

          {improvementData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={improvementData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(99,102,241,0.15)"
                  />

                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#CBD5E1', fontSize: 12 }}
                  />

                  <YAxis tick={{ fill: '#CBD5E1', fontSize: 12 }} />

                  <Tooltip
                    contentStyle={{
                      background: '#111827',
                      border: '1px solid rgba(99,102,241,0.35)',
                      borderRadius: '16px',
                      color: '#fff',
                    }}
                  />

                  <Bar dataKey="value" fill="#6366F1" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-80 items-center justify-center rounded-3xl border border-primary/20 bg-background/40 text-center text-gray-400">
              Add at least 2 training sessions to unlock improvement graph.
            </div>
          )}
        </Card>
      </div>

      <Card hover={false}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-black">Injury Risk Level</h2>
            <p className="text-sm text-gray-400">
              Calculated from fatigue and pain averages.
            </p>
          </div>

          <Badge
            variant={
              performance.injury_risk_level === 'High'
                ? 'danger'
                : performance.injury_risk_level === 'Medium'
                ? 'warning'
                : 'success'
            }
          >
            {performance.injury_risk_level}
          </Badge>
        </div>
      </Card>
    </div>
  )
}