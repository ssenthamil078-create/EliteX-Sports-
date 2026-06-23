import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Trophy,
  GraduationCap,
  Building2,
  ExternalLink,
  RefreshCw,
  Sparkles,
} from 'lucide-react'

import { opportunityAPI } from '@/api/sportsAPI'
import { useAuthStore } from '@/store/authStore'
import { Card, PageHeader, Button, Badge } from '@/components/ui'

const tabs = [
  { key: 'competitions', label: 'Competitions', icon: Trophy },
  { key: 'scholarships', label: 'Scholarships', icon: GraduationCap },
  { key: 'schemes', label: 'Schemes', icon: Building2 },
]

export default function Recommendations() {
  const userId = useAuthStore((s) => s.getUserId())
  const [tab, setTab] = useState('competitions')

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['recommendations', tab, userId],
    queryFn: () => {
      if (tab === 'competitions') {
        return opportunityAPI.competitions(userId).then((res) => res.data)
      }

      if (tab === 'scholarships') {
        return opportunityAPI.scholarships(userId).then((res) => res.data)
      }

      return opportunityAPI.schemes(userId).then((res) => res.data)
    },
    enabled: !!userId,
    retry: false,
  })

  const items = data?.recommendations || []
  const ActiveIcon = tabs.find((item) => item.key === tab)?.icon || Trophy

  return (
    <div>
      <PageHeader
        title="AI Recommendations"
        subtitle="Personalised competitions, scholarships and schemes matched to your athlete profile."
        action={
          <Button onClick={() => refetch()} loading={isFetching}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        }
      />

      <Card hover={false} className="mb-8">
        <div className="flex flex-wrap gap-3">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-bold transition ${
                tab === key
                  ? 'border-primary bg-primary/20 text-white shadow-neon'
                  : 'border-primary/20 bg-background/40 text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </Card>

      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-2xl bg-primary/20 p-3 text-primary">
          <ActiveIcon className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-2xl font-black capitalize">
            Recommended {tab}
          </h2>
          <p className="text-sm text-gray-400">
            {items.length} AI matched results
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-3xl bg-surface/70"
            />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => {
            const title =
              item.name ||
              item.provider ||
              item.authority ||
              'Recommendation'

            const link =
              item.apply_now_url ||
              item.application_link ||
              item.official_website

            return (
              <Card key={item.id || index}>
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black text-white">
                      {title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-400">
                      {item.sport ||
                        item.sport_eligibility ||
                        item.provider ||
                        item.authority ||
                        'Sports opportunity'}
                    </p>
                  </div>

                  <Badge variant="success">
                    {item.match_score ?? 0}% Match
                  </Badge>
                </div>

                <div className="space-y-2 text-sm text-gray-400">
                  {item.level && <p>Level: {item.level}</p>}
                  {item.venue && <p>Venue: {item.venue}</p>}
                  {item.date && <p>Date: {item.date}</p>}
                  {item.amount && <p>Amount: {item.amount}</p>}
                  {item.age_category && <p>Age: {item.age_category}</p>}
                  {item.registration_fee && <p>Fee: {item.registration_fee}</p>}
                  {item.status && <p>Status: {item.status}</p>}
                </div>

                <div className="mt-5 line-clamp-4 text-sm leading-7 text-gray-500">
                  {item.eligibility ||
                    item.eligibility_criteria ||
                    item.benefits ||
                    item.organizer ||
                    'Recommended based on your athlete profile.'}
                </div>

                {link && (
                  <Button
                    className="mt-6 w-full"
                    onClick={() => window.open(link, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Apply Now
                  </Button>
                )}
              </Card>
            )
          })}
        </div>
      ) : (
        <Card hover={false}>
          <div className="flex h-72 flex-col items-center justify-center text-center">
            <Sparkles className="mb-4 h-14 w-14 text-primary" />
            <h2 className="text-2xl font-black">
              No recommendations yet
            </h2>

            <p className="mt-2 max-w-md text-gray-400">
              Create your athlete profile first. Recommendations depend on
              sport, level, state, age and eligibility.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}