import { useQuery } from '@tanstack/react-query'
import {
  Map,
  Trophy,
  Target,
  GraduationCap,
  RefreshCw,
  Rocket,
} from 'lucide-react'

import { insightAPI } from '@/api/sportsAPI'
import { useAuthStore } from '@/store/authStore'
import { Card, PageHeader, Button, Badge, StatCard } from '@/components/ui'

export default function CareerPath() {
  const userId = useAuthStore((s) => s.getUserId())

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['career-path', userId],
    queryFn: () => insightAPI.careerPath(userId).then((res) => res.data),
    enabled: !!userId,
    retry: false,
  })

  return (
    <div>
      <PageHeader
        title="AI Career Path"
        subtitle="Personalised roadmap for athlete growth, competitions, and future opportunities."
        action={
          <Button onClick={() => refetch()} loading={isFetching}>
            <RefreshCw className="h-4 w-4" />
            Regenerate
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-3xl bg-surface/70" />
          ))}
        </div>
      ) : data?.career_path ? (
        <>
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <StatCard
              label="Sport"
              value={data.sport || '—'}
              icon={Trophy}
            />

            <StatCard
              label="Skill Score"
              value={data.skill_score ?? '—'}
              icon={Target}
            />

            <StatCard
              label="Career Mode"
              value="AI Roadmap"
              icon={Rocket}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <Card hover={false}>
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-2xl bg-primary/20 p-3 text-primary">
                  <Map className="h-7 w-7" />
                </div>

                <div>
                  <h2 className="text-2xl font-black">
                    Recommended Career Path
                  </h2>

                  <p className="text-sm text-gray-400">
                    Based on profile, skill score, and training consistency.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-primary/20 bg-background/40 p-6">
                <p className="whitespace-pre-wrap leading-8 text-gray-200">
                  {typeof data.career_path === 'string'
                    ? data.career_path
                    : JSON.stringify(data.career_path, null, 2)}
                </p>
              </div>
            </Card>

            <div className="space-y-6">
              <Card hover={false}>
                <h2 className="mb-4 text-xl font-black">
                  Growth Checklist
                </h2>

                <div className="space-y-3">
                  <Badge>Improve consistency</Badge>
                  <Badge>Join competitions</Badge>
                  <Badge>Build certificates</Badge>
                  <Badge>Connect with mentors</Badge>
                  <Badge>Track performance</Badge>
                </div>
              </Card>

              <Card hover={false}>
                <div className="mb-4 flex items-center gap-3">
                  <GraduationCap className="h-6 w-6 text-warning" />
                  <h2 className="text-xl font-black">
                    Career Guidance
                  </h2>
                </div>

                <p className="text-sm leading-7 text-gray-400">
                  Use this AI roadmap as guidance only. Continue working with
                  coaches, mentors, and verified sports professionals before
                  making major career decisions.
                </p>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <Card hover={false}>
          <div className="flex h-72 flex-col items-center justify-center text-center">
            <Map className="mb-4 h-14 w-14 text-primary" />
            <h2 className="text-2xl font-black">
              Career path locked
            </h2>
            <p className="mt-2 max-w-md text-gray-400">
              Add athlete profile and training logs to unlock AI career roadmap.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}