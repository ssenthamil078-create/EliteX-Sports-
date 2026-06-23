import { useQuery } from '@tanstack/react-query'
import {
  Activity,
  AlertTriangle,
  BatteryCharging,
  HeartPulse,
  ShieldCheck,
} from 'lucide-react'

import { athleteAPI } from '@/api/sportsAPI'
import { useAuthStore } from '@/store/authStore'
import { Card, Badge } from '@/components/ui'

function getVariant(risk) {
  if (risk === 'Low') return 'success'
  if (risk === 'Moderate') return 'warning'
  return 'danger'
}

export default function ReadinessWidget() {
  const userId = useAuthStore((s) => s.getUserId())

  const { data, isLoading, isError } = useQuery({
    queryKey: ['athlete-readiness', userId],
    queryFn: () => athleteAPI.getReadiness(userId).then((res) => res.data),
    enabled: !!userId,
    retry: false,
  })

  if (isLoading) {
    return (
      <Card hover={false}>
        <div className="h-72 animate-pulse rounded-3xl bg-surface/70" />
      </Card>
    )
  }

  if (isError || !data) {
    return (
      <Card hover={false}>
        <div className="flex h-72 flex-col items-center justify-center text-center">
          <BatteryCharging className="mb-4 h-14 w-14 text-primary" />
          <h2 className="text-2xl font-black">Readiness Locked</h2>
          <p className="mt-2 max-w-md text-sm text-gray-400">
            Add training logs and pose analysis to unlock your daily readiness score.
          </p>
        </div>
      </Card>
    )
  }

  const score = data.readiness_score || 0
  const risk = data.injury_risk || 'Moderate'
  const variant = getVariant(risk)

  return (
    <Card hover={false}>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <Badge variant={variant}>Injury Risk: {risk}</Badge>

          <h2 className="mt-4 text-3xl font-black">
            Athlete Readiness
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Daily sports readiness based on training load, pain, fatigue and pose quality.
          </p>
        </div>

        {risk === 'High' ? (
          <AlertTriangle className="h-10 w-10 text-danger" />
        ) : (
          <ShieldCheck className="h-10 w-10 text-success" />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:items-center">
        <div className="relative mx-auto flex h-56 w-56 items-center justify-center rounded-full border border-primary/20 bg-background/50">
          <div
            className="absolute inset-4 rounded-full"
            style={{
              background: `conic-gradient(rgb(99 102 241) ${score * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
            }}
          />

          <div className="relative flex h-40 w-40 flex-col items-center justify-center rounded-full bg-surface shadow-neon">
            <span className="text-5xl font-black">{score}</span>
            <span className="text-sm text-gray-400">/100</span>
          </div>
        </div>

        <div>
          <div className="mb-5 rounded-3xl border border-primary/20 bg-background/40 p-5">
            <h3 className="text-xl font-black">{data.status}</h3>
            <p className="mt-2 text-sm leading-7 text-gray-400">
              {data.recovery_advice}
            </p>
          </div>

          <div className="responsive-card-grid">
            <Metric label="Fatigue" value={data.metrics?.fatigue} icon={BatteryCharging} />
            <Metric label="Pain" value={data.metrics?.pain} icon={HeartPulse} />
            <Metric label="Intensity" value={data.metrics?.intensity} icon={Activity} />
            <Metric label="Posture" value={data.metrics?.posture} icon={ShieldCheck} />
          </div>
        </div>
      </div>
    </Card>
  )
}

function Metric({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-background/40 p-4">
      <Icon className="mb-2 h-5 w-5 text-primary" />
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-black text-white">
        {value ?? '—'}
      </p>
    </div>
  )
}