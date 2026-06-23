import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  UserRound,
  MapPin,
  Trophy,
  Target,
  Languages,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react'

import { athleteAPI } from '@/api/sportsAPI'
import { useAuthStore } from '@/store/authStore'
import { Card, PageHeader, Button, Input, Badge, StatCard } from '@/components/ui'

export default function AthleteProfile() {
  const userId = useAuthStore((s) => s.getUserId())
  const queryClient = useQueryClient()

  const [form, setForm] = useState({
    age: '',
    state: '',
    sport: '',
    level: 'Beginner',
    achievements: '',
    income_category: 'General',
    language: 'Tamil',
    injury_history: '',
    goals: '',
  })

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['athlete-profile', userId],
    queryFn: () => athleteAPI.getProfile(userId).then((res) => res.data),
    enabled: !!userId,
    retry: false,
    onSuccess: (profile) => {
      setForm((prev) => ({
        ...prev,
        ...profile,
      }))
    },
  })

  const createMutation = useMutation({
    mutationFn: (payload) => athleteAPI.createProfile(payload),
    onSuccess: () => {
      toast.success('Athlete profile saved')
      queryClient.invalidateQueries({ queryKey: ['athlete-profile', userId] })
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || 'Failed to save profile')
    },
  })

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const submit = (e) => {
    e.preventDefault()

    if (!userId) {
      toast.error('User ID missing. Login again.')
      return
    }

    createMutation.mutate({
      user_id: userId,
      age: Number(form.age),
      state: form.state,
      sport: form.sport,
      level: form.level,
      achievements: form.achievements,
      income_category: form.income_category,
      language: form.language,
      injury_history: form.injury_history,
      goals: form.goals,
    })
  }

  return (
    <div>
      <PageHeader
        title="Athlete Profile"
        subtitle="Create your athlete identity for AI recommendations, training plans, mentorship, and analytics."
        action={
          <Button onClick={() => refetch()} loading={isFetching} variant="secondary">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        }
      />

      {data && !isError && (
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <StatCard label="Sport" value={data.sport || '—'} icon={Trophy} />
          <StatCard label="State" value={data.state || '—'} icon={MapPin} />
          <StatCard label="Level" value={data.level || '—'} icon={ShieldCheck} />
          <StatCard label="Age" value={data.age || '—'} icon={UserRound} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card hover={false}>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-primary/20 p-3 text-primary">
              <UserRound className="h-7 w-7" />
            </div>

            <div>
              <h2 className="text-2xl font-black">Profile Details</h2>
              <p className="text-sm text-gray-400">
                This information powers your AI sports experience.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-2xl bg-surface/70" />
              ))}
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Age"
                  name="age"
                  type="number"
                  value={form.age}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="State"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="Tamil Nadu"
                  required
                />

                <Input
                  label="Sport"
                  name="sport"
                  value={form.sport}
                  onChange={handleChange}
                  placeholder="Cricket, Football, Running..."
                  required
                />

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-300">
                    Level
                  </span>
                  <select
                    name="level"
                    value={form.level}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option>Beginner</option>
                    <option>District</option>
                    <option>State</option>
                    <option>National</option>
                    <option>Elite</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-300">
                    Income Category
                  </span>
                  <select
                    name="income_category"
                    value={form.income_category}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option>General</option>
                    <option>Low Income</option>
                    <option>Middle Income</option>
                    <option>Scholarship Needed</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-300">
                    Preferred Language
                  </span>
                  <select
                    name="language"
                    value={form.language}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option>Tamil</option>
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Telugu</option>
                    <option>Malayalam</option>
                    <option>Kannada</option>
                  </select>
                </label>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Achievements
                </label>
                <textarea
                  name="achievements"
                  rows={3}
                  value={form.achievements}
                  onChange={handleChange}
                  className="input-field resize-none"
                  placeholder="Mention medals, tournaments, certificates..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Injury History
                </label>
                <textarea
                  name="injury_history"
                  rows={3}
                  value={form.injury_history}
                  onChange={handleChange}
                  className="input-field resize-none"
                  placeholder="Mention previous injuries if any..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Goals
                </label>
                <textarea
                  name="goals"
                  rows={3}
                  value={form.goals}
                  onChange={handleChange}
                  className="input-field resize-none"
                  placeholder="Example: Improve endurance, participate in state-level competitions..."
                />
              </div>

              <Button className="w-full" loading={createMutation.isPending}>
                Save Athlete Profile
              </Button>
            </form>
          )}
        </Card>

        <div className="space-y-6">
          <Card hover={false}>
            <h2 className="mb-4 text-xl font-black">Profile Powers</h2>

            <div className="space-y-3">
              <Badge>AI Recommendations</Badge>
              <Badge>Training Plans</Badge>
              <Badge>Career Path</Badge>
              <Badge>Mentorship Matching</Badge>
              <Badge>Scholarship Matching</Badge>
            </div>
          </Card>

          <Card hover={false}>
            <div className="mb-4 flex items-center gap-3">
              <Target className="h-6 w-6 text-warning" />
              <h2 className="text-xl font-black">Important</h2>
            </div>

            <p className="text-sm leading-7 text-gray-400">
              Your backend currently supports creating and fetching profile.
              If you already created a profile, creating again may show “Profile already exists”.
              Later we can add an update-profile route in backend.
            </p>
          </Card>

          <Card hover={false}>
            <div className="mb-4 flex items-center gap-3">
              <Languages className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-black">Language</h2>
            </div>

            <p className="text-sm leading-7 text-gray-400">
              Preferred language helps multilingual AI generate athlete-friendly guidance.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}