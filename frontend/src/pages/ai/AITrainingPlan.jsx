import { useQuery } from '@tanstack/react-query'
import { Brain, Sparkles, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

import { aiAPI } from '@/api/sportsAPI'
import { useAuthStore } from '@/store/authStore'
import { Card, Button, PageHeader, Badge } from '@/components/ui'

export default function AITrainingPlan() {
  const userId = useAuthStore((s) => s.getUserId())

  const {
    data,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['ai-training-plan', userId],
    queryFn: () =>
      aiAPI.trainingPlan({
        user_id: userId,
      }).then((res) => res.data),

    enabled: !!userId,
    retry: false,
  })

  const regenerate = async () => {
    toast.loading('Generating AI plan...', {
      id: 'ai-plan',
    })

    try {
      await refetch()

      toast.success('AI plan regenerated!', {
        id: 'ai-plan',
      })
    } catch {
      toast.error('Failed to generate plan', {
        id: 'ai-plan',
      })
    }
  }

  return (
    <div>
      <PageHeader
        title="AI Training Plan"
        subtitle="Personalized AI-generated sports training roadmap."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <Card hover={false}>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-primary/20 p-3">
                <Brain className="h-7 w-7 text-primary" />
              </div>

              <div>
                <h2 className="text-2xl font-black">
                  AI Coach Assistant
                </h2>

                <p className="text-sm text-gray-400">
                  Dynamic training intelligence
                </p>
              </div>
            </div>

            <Button
              onClick={regenerate}
              loading={isFetching}
            >
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-5 animate-pulse rounded-xl bg-surface"
                />
              ))}
            </div>
          ) : data?.ai_training_plan ? (
            <div className="rounded-3xl border border-primary/20 bg-background/40 p-6">
              <div className="prose prose-invert max-w-none">
                <p className="whitespace-pre-wrap text-gray-200 leading-8">
                  {data.ai_training_plan}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-primary/30 bg-background/30 text-center">
              <Brain className="mb-4 h-14 w-14 text-primary" />

              <h2 className="text-2xl font-black">
                No AI plan available
              </h2>

              <p className="mt-2 max-w-md text-gray-400">
                Add athlete profile and training sessions to unlock
                AI-generated plans.
              </p>
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <Card hover={false}>
            <div className="mb-4 flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-warning" />

              <h2 className="text-xl font-black">
                AI Features
              </h2>
            </div>

            <div className="space-y-3">
              <Badge>Performance Optimization</Badge>
              <Badge>Fatigue Analysis</Badge>
              <Badge>Recovery Intelligence</Badge>
              <Badge>Injury Prevention</Badge>
              <Badge>Weekly Scheduling</Badge>
            </div>
          </Card>

          <Card hover={false}>
            <h2 className="mb-4 text-xl font-black">
              AI Status
            </h2>

            <div className="space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Neural Engine</span>
                  <span>98%</span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-surface">
                  <div className="h-full w-[98%] rounded-full bg-primary" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Prediction Accuracy</span>
                  <span>94%</span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-surface">
                  <div className="h-full w-[94%] rounded-full bg-secondary" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Recovery Tracking</span>
                  <span>89%</span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-surface">
                  <div className="h-full w-[89%] rounded-full bg-accent" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}