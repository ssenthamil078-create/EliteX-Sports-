import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  Search,
  UserSearch,
  Star,
  Handshake,
  MapPin,
  Trophy,
  RefreshCw,
} from 'lucide-react'

import { scoutAPI, sponsorAPI } from '@/api/sportsAPI'
import { useAuthStore } from '@/store/authStore'
import { Card, PageHeader, Button, Input, Badge } from '@/components/ui'

export default function ScoutSponsor() {
  const userId = useAuthStore((s) => s.getUserId())
  const role = useAuthStore((s) => s.getRole())

  const [tab, setTab] = useState('scout')
  const [filters, setFilters] = useState({
    sport: '',
    state: '',
    level: '',
  })

  const scoutQuery = useQuery({
    queryKey: ['scout-athletes', filters],
    queryFn: () => scoutAPI.discoverAthletes(filters).then((res) => res.data),
    enabled: tab === 'scout',
  })

  const sponsorQuery = useQuery({
    queryKey: ['sponsor-feed', filters],
    queryFn: () =>
      sponsorAPI
        .talentFeed({
          sport: filters.sport,
          state: filters.state,
        })
        .then((res) => res.data),
    enabled: tab === 'sponsor',
  })

  const shortlistMutation = useMutation({
    mutationFn: (payload) => scoutAPI.shortlist(payload),
    onSuccess: () => toast.success('Athlete shortlisted'),
    onError: (err) =>
      toast.error(err.response?.data?.detail || 'Shortlist failed'),
  })

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const clearFilters = () => {
    setFilters({
      sport: '',
      state: '',
      level: '',
    })
  }

  const athletes =
    tab === 'scout'
      ? scoutQuery.data?.athletes || []
      : sponsorQuery.data?.talent_feed || []

  const loading =
    tab === 'scout' ? scoutQuery.isLoading : sponsorQuery.isLoading

  const refresh = () => {
    if (tab === 'scout') scoutQuery.refetch()
    else sponsorQuery.refetch()
  }

  const isFetching =
    tab === 'scout' ? scoutQuery.isFetching : sponsorQuery.isFetching

  const shortlistAthlete = (athlete) => {
    if (!userId) {
      toast.error('Login again')
      return
    }

    if (role !== 'scout' && role !== 'admin') {
      toast.error('Only scout/admin can shortlist athletes')
      return
    }

    shortlistMutation.mutate({
      scout_id: userId,
      athlete_user_id: athlete.user_id || athlete.athlete_user_id,
      note: 'Shortlisted from frontend scout discovery page',
    })
  }

  return (
    <div>
      <PageHeader
        title="Scout & Sponsor Discovery"
        subtitle="Discover athlete talent for scouting, sponsorship, and opportunity matching."
        action={
          <Button onClick={refresh} loading={isFetching}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        }
      />

      <Card hover={false} className="mb-8">
        <div className="mb-5 flex flex-wrap gap-3">
          <button
            onClick={() => setTab('scout')}
            className={`rounded-2xl border px-5 py-3 text-sm font-bold transition ${
              tab === 'scout'
                ? 'border-primary bg-primary/20 text-white shadow-neon'
                : 'border-primary/20 bg-background/40 text-gray-400'
            }`}
          >
            <UserSearch className="mr-2 inline h-4 w-4" />
            Scout Athletes
          </button>

          <button
            onClick={() => setTab('sponsor')}
            className={`rounded-2xl border px-5 py-3 text-sm font-bold transition ${
              tab === 'sponsor'
                ? 'border-primary bg-primary/20 text-white shadow-neon'
                : 'border-primary/20 bg-background/40 text-gray-400'
            }`}
          >
            <Handshake className="mr-2 inline h-4 w-4" />
            Sponsor Talent Feed
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Input
            name="sport"
            value={filters.sport}
            onChange={handleChange}
            placeholder="Sport"
          />

          <Input
            name="state"
            value={filters.state}
            onChange={handleChange}
            placeholder="State"
          />

          {tab === 'scout' && (
            <Input
              name="level"
              value={filters.level}
              onChange={handleChange}
              placeholder="Level"
            />
          )}

          <Button variant="secondary" onClick={clearFilters}>
            Clear
          </Button>
        </div>
      </Card>

      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-2xl bg-primary/20 p-3 text-primary">
          <Search className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-2xl font-black">
            {tab === 'scout' ? 'Athlete Discovery' : 'Sponsor Talent Feed'}
          </h2>
          <p className="text-sm text-gray-400">
            {athletes.length} athletes found
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-3xl bg-surface/70"
            />
          ))}
        </div>
      ) : athletes.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {athletes.map((athlete, index) => (
            <Card key={athlete.user_id || athlete.athlete_user_id || index}>
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-black text-white">
                    {athlete.sport || 'Athlete'}
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">
                    {athlete.level || athlete.sponsorship_potential || 'Talent'}
                  </p>
                </div>

                <Badge
                  variant={
                    athlete.sponsorship_potential === 'High'
                      ? 'success'
                      : 'primary'
                  }
                >
                  {athlete.sponsorship_potential || athlete.level || 'Profile'}
                </Badge>
              </div>

              <div className="space-y-3 text-sm text-gray-400">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  {athlete.state || 'State not available'}
                </p>

                {athlete.age && (
                  <p>Age: {athlete.age}</p>
                )}

                <p className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-warning" />
                  {athlete.achievements || 'No achievements listed'}
                </p>

                <p className="line-clamp-3">
                  Goals: {athlete.goals || 'No goals listed'}
                </p>
              </div>

              {tab === 'scout' && (
                <Button
                  className="mt-6 w-full"
                  loading={shortlistMutation.isPending}
                  onClick={() => shortlistAthlete(athlete)}
                >
                  <Star className="h-4 w-4" />
                  Shortlist Athlete
                </Button>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card hover={false}>
          <div className="flex h-72 flex-col items-center justify-center text-center">
            <UserSearch className="mb-4 h-14 w-14 text-primary" />
            <h2 className="text-2xl font-black">No athletes found</h2>
            <p className="mt-2 max-w-md text-gray-400">
              Try changing sport, state, or level filters.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}