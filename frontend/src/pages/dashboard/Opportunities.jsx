import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Trophy,
  GraduationCap,
  Building2,
  UserCheck,
  Handshake,
  ExternalLink,
  RefreshCw,
} from 'lucide-react'

import { opportunityAPI } from '@/api/sportsAPI'
import { SkeletonGrid } from '@/components/ui/Skeleton'
import { Card, PageHeader, Button, Badge, Input } from '@/components/ui'

const tabs = [
  { key: 'competitions', label: 'Competitions', icon: Trophy },
  { key: 'scholarships', label: 'Scholarships', icon: GraduationCap },
  { key: 'government_schemes', label: 'Schemes', icon: Building2 },
  { key: 'coaches', label: 'Coaches', icon: UserCheck },
  { key: 'sponsors_scouts', label: 'Sponsors', icon: Handshake },
]

function isOpenItem(item) {
  if (item.status === 'Finished') return false

  const dateValue = item.date || item.deadline

  if (dateValue) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const itemDate = new Date(dateValue)
    if (!Number.isNaN(itemDate.getTime()) && itemDate < today) {
      return false
    }
  }

  return true
}

function OpportunityCard({ item }) {
  const title =
    item.name ||
    item.organization ||
    item.provider ||
    item.authority ||
    'Opportunity'

  const subtitle =
    item.sport ||
    item.sport_eligibility ||
    item.focus_sports ||
    item.location ||
    item.level ||
    'Sports Opportunity'

  const link =
    item.apply_now_url ||
    item.application_link ||
    item.official_website ||
    item.website

  return (
    <Card hover>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-white">{title}</h3>
          <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
        </div>

        <Badge variant="success">{item.status || 'Open'}</Badge>
      </div>

      <div className="space-y-2 text-sm text-gray-400">
        {item.level && <p>Level: {item.level}</p>}
        {item.venue && <p>Venue: {item.venue}</p>}
        {item.date && <p>Date: {item.date}</p>}
        {item.deadline && <p>Deadline: {item.deadline}</p>}
        {item.amount && <p>Amount: {item.amount}</p>}
        {item.age_category && <p>Age: {item.age_category}</p>}
        {item.registration_fee && <p>Fee: {item.registration_fee}</p>}
        {item.experience && <p>Experience: {item.experience}</p>}
        {item.support_type && <p>Support: {item.support_type}</p>}
      </div>

      <div className="mt-5 line-clamp-3 text-sm leading-6 text-gray-500">
        {item.eligibility ||
          item.eligibility_criteria ||
          item.benefits ||
          item.certification ||
          item.organizer ||
          'Useful opportunity for athletes.'}
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
}

export default function Opportunities() {
  const [activeTab, setActiveTab] = useState('competitions')
  const [search, setSearch] = useState('')

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['opportunities-feed'],
    queryFn: () => opportunityAPI.feed().then((res) => res.data),
  })

  const items = useMemo(() => {
    const list = data?.[activeTab] || []

    return list
      .filter(isOpenItem)
      .filter((item) =>
        JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 20)
  }, [data, activeTab, search])

  const ActiveIcon =
    tabs.find((tab) => tab.key === activeTab)?.icon || Trophy

  return (
    <div>
      <PageHeader
        title="Sports Opportunities"
        subtitle="Explore present and future competitions, scholarships, schemes, coaches, and sponsors."
        action={
          <Button onClick={() => refetch()} loading={isFetching}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        }
      />

      <Card hover={false} className="mb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-3">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                  activeTab === key
                    ? 'border-primary bg-primary/20 text-white shadow-neon'
                    : 'border-primary/20 bg-background/40 text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          <div className="w-full lg:max-w-sm">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search opportunities..."
            />
          </div>
        </div>
      </Card>

      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-2xl bg-primary/20 p-3 text-primary">
          <ActiveIcon className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-2xl font-black capitalize">
            {activeTab.replaceAll('_', ' ')}
          </h2>
          <p className="text-sm text-gray-400">
            Showing open and future items only. Maximum 20 displayed.
          </p>
        </div>
      </div>

      {isLoading ? (
        <SkeletonGrid count={9} />
      ) : items.length > 0 ? (
        <div className="responsive-card-grid">
          {items.map((item, index) => (
            <OpportunityCard key={item.id || index} item={item} />
          ))}
        </div>
      ) : (
        <Card hover={false}>
          <div className="flex h-72 flex-col items-center justify-center text-center">
            <Trophy className="mb-4 h-14 w-14 text-primary" />
            <h2 className="text-2xl font-black">No active opportunities</h2>
            <p className="mt-2 max-w-md text-gray-400">
              Past or deadline-crossed items are hidden. Add present/future data
              from Admin Opportunities Manager.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}