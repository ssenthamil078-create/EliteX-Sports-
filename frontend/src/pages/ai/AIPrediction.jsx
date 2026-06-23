import { useQuery } from '@tanstack/react-query'
import { TrendingUp, BrainCircuit, Activity, Sparkles } from 'lucide-react'
import { aiAPI } from '@/api/sportsAPI'
import { useAuthStore } from '@/store/authStore'
import { Card, PageHeader, Button, Badge } from '@/components/ui'

export default function AIPrediction() {
  const userId = useAuthStore((s) => s.getUserId())

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['ai-performance-prediction', userId],
    queryFn: () => aiAPI.performancePrediction(userId).then((res) => res.data),
    enabled: !!userId,
    retry: false,
  })

  return (
    <div>
      <PageHeader
        title="AI Performance Prediction"
        subtitle="Forecast your future sports performance using AI insights."
        action={
          <Button onClick={() => refetch()} loading={isFetching}>
            <Sparkles className="h-4 w-4" />
            Predict Again
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <Card hover={false}>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-primary/20 p-3 text-primary">
              <TrendingUp className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-2xl font-black">Prediction Report</h2>
              <p className="text-sm text-gray-400">
                Generated from your training logs and athlete profile.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-5 animate-pulse rounded-xl bg-surface" />
              ))}
            </div>
          ) : data?.ai_performance_prediction ? (
            <div className="rounded-3xl border border-primary/20 bg-background/40 p-6">
              <p className="whitespace-pre-wrap leading-8 text-gray-200">
                {data.ai_performance_prediction}
              </p>
            </div>
          ) : (
            <div className="flex h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-primary/30 bg-background/30 text-center">
              <BrainCircuit className="mb-4 h-14 w-14 text-primary" />
              <h2 className="text-2xl font-black">Prediction locked</h2>
              <p className="mt-2 max-w-md text-gray-400">
                Add training logs and athlete profile to unlock AI performance prediction.
              </p>
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <Card hover={false}>
            <h2 className="mb-4 text-xl font-black">Prediction Inputs</h2>
            <div className="space-y-3">
              <Badge>Performance Score</Badge>
              <Badge>Training Intensity</Badge>
              <Badge>Fatigue Level</Badge>
              <Badge>Pain Level</Badge>
              <Badge>Total Duration</Badge>
            </div>
          </Card>

          <Card hover={false}>
            <div className="mb-4 flex items-center gap-3">
              <Activity className="h-6 w-6 text-success" />
              <h2 className="text-xl font-black">AI Engine</h2>
            </div>

            <div className="space-y-4 text-sm text-gray-400">
              <p>Uses your recent training trend to generate a future performance forecast.</p>
              <p>For best results, add at least 3–5 training logs.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}