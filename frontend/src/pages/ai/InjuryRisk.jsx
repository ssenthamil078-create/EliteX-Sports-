import { useQuery } from '@tanstack/react-query'
import {
  AlertTriangle,
  HeartPulse,
  ShieldCheck,
  Activity,
  RefreshCw,
} from 'lucide-react'

import { insightAPI } from '@/api/sportsAPI'
import { useAuthStore } from '@/store/authStore'
import { Card, PageHeader, Button, Badge, StatCard } from '@/components/ui'

export default function InjuryRisk() {
  const userId = useAuthStore((s) => s.getUserId())

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['injury-risk', userId],
    queryFn: () => insightAPI.injuryRisk(userId).then((res) => res.data),
    enabled: !!userId,
    retry: false,
  })

  const risk = data?.injury_risk
  const level = risk?.risk_level || 'Unknown'

  const badgeVariant =
    level === 'High'
      ? 'danger'
      : level === 'Medium'
      ? 'warning'
      : level === 'Low'
      ? 'success'
      : 'gray'

  return (
    <div>
      <PageHeader
        title="Injury Risk Predictor"
        subtitle="AI-assisted injury risk monitoring using fatigue and pain levels."
        action={
          <Button onClick={() => refetch()} loading={isFetching}>
            <RefreshCw className="h-4 w-4" />
            Recheck Risk
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-3xl bg-surface/70" />
          ))}
        </div>
      ) : risk ? (
        <>
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <StatCard
              label="Risk Level"
              value={level}
              icon={HeartPulse}
            />

            <StatCard
              label="Sport"
              value={data?.sport || '—'}
              icon={Activity}
            />

            <StatCard
              label="Athlete Level"
              value={data?.level || '—'}
              icon={ShieldCheck}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <Card hover={false}>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black">Risk Report</h2>
                  <p className="text-sm text-gray-400">
                    Based on your recent training logs.
                  </p>
                </div>

                <Badge variant={badgeVariant}>{level}</Badge>
              </div>

              <div className="rounded-3xl border border-primary/20 bg-background/40 p-6">
                <pre className="whitespace-pre-wrap text-sm leading-7 text-gray-200">
                  {JSON.stringify(risk, null, 2)}
                </pre>
              </div>

              {level === 'High' && (
                <div className="mt-6 flex gap-4 rounded-3xl border border-danger/40 bg-danger/10 p-5">
                  <AlertTriangle className="h-6 w-6 shrink-0 text-danger" />
                  <div>
                    <h3 className="font-bold text-red-200">
                      High injury risk detected
                    </h3>
                    <p className="mt-1 text-sm text-red-100/80">
                      Reduce training load, prioritise recovery, and consider consulting a coach or medical professional.
                    </p>
                  </div>
                </div>
              )}
            </Card>

            <Card hover={false}>
              <h2 className="mb-4 text-xl font-black">Risk Guide</h2>

              <div className="space-y-4 text-sm text-gray-400">
                <div className="rounded-2xl border border-success/30 bg-success/10 p-4">
                  <p className="font-bold text-green-200">Low</p>
                  <p>Training load appears manageable.</p>
                </div>

                <div className="rounded-2xl border border-warning/30 bg-warning/10 p-4">
                  <p className="font-bold text-yellow-200">Medium</p>
                  <p>Monitor fatigue and pain carefully.</p>
                </div>

                <div className="rounded-2xl border border-danger/30 bg-danger/10 p-4">
                  <p className="font-bold text-red-200">High</p>
                  <p>Recovery is strongly recommended.</p>
                </div>
              </div>
            </Card>
          </div>
        </>
      ) : (
        <Card hover={false}>
          <div className="flex h-72 flex-col items-center justify-center text-center">
            <HeartPulse className="mb-4 h-14 w-14 text-primary" />
            <h2 className="text-2xl font-black">Risk prediction locked</h2>
            <p className="mt-2 max-w-md text-gray-400">
              Add training logs and athlete profile to unlock injury risk prediction.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}