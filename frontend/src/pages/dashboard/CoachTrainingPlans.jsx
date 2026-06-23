import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  ClipboardList,
  Send,
  RefreshCw,
  Dumbbell,
  Search,
  UserRound,
} from 'lucide-react'

import { coachAPI, scoutAPI } from '@/api/sportsAPI'
import { useAuthStore } from '@/store/authStore'
import { Card, PageHeader, Button, Input, Badge } from '@/components/ui'

export default function CoachTrainingPlans() {
  const userId = useAuthStore((s) => s.getUserId())
  const role = useAuthStore((s) => s.getRole())
  const queryClient = useQueryClient()

  const [search, setSearch] = useState('')
  const [selectedAthlete, setSelectedAthlete] = useState(null)

  const [form, setForm] = useState({
    athlete_user_id: '',
    title: '',
    description: '',
    duration_weeks: 4,
    focus_area: '',
    difficulty_level: 'Beginner',
  })

  const { data: athleteData, isLoading: loadingAthletes } = useQuery({
  queryKey: ['coach-athletes'],
  queryFn: () => scoutAPI.discoverAthletes().then((res) => res.data),
})

  

  const athletes = athleteData?.athletes || []

  const filteredAthletes = useMemo(() => {
    return athletes.filter((athlete) =>
      JSON.stringify(athlete)
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  }, [athletes, search])

  const {
    data: plansData,
    isLoading: loadingPlans,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['coach-training-plans', form.athlete_user_id],
    queryFn: () =>
      coachAPI
        .getTrainingPlans(form.athlete_user_id)
        .then((res) => res.data),
    enabled: !!form.athlete_user_id,
  })

  const createMutation = useMutation({
    mutationFn: (payload) => coachAPI.createTrainingPlan(payload),
    onSuccess: () => {
      toast.success('Training plan created')
      queryClient.invalidateQueries({ queryKey: ['coach-training-plans'] })

      setForm((prev) => ({
        ...prev,
        title: '',
        description: '',
        duration_weeks: 4,
        focus_area: '',
        difficulty_level: 'Beginner',
      }))
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || 'Failed to create plan')
    },
  })

  const selectAthlete = (athlete) => {
    setSelectedAthlete(athlete)

    setForm((prev) => ({
      ...prev,
      athlete_user_id: athlete.user_id,
    }))

    toast.success('Athlete selected')
  }

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const submit = (e) => {
    e.preventDefault()

    if (role !== 'coach' && role !== 'admin') {
      toast.error('Only coach/admin can create training plans')
      return
    }

    if (!form.athlete_user_id) {
      toast.error('Please select an athlete first')
      return
    }

    createMutation.mutate({
      coach_id: userId,
      athlete_user_id: form.athlete_user_id,
      title: form.title,
      description: form.description,
      duration_weeks: Number(form.duration_weeks),
      focus_area: form.focus_area,
      difficulty_level: form.difficulty_level,
    })
  }

  const plans = plansData?.training_plans || []

  return (
    <div>
      <PageHeader
        title="Coach Training Plans"
        subtitle="Select an athlete and create structured training plans without manually entering UUIDs."
        action={
          <Button
            onClick={() => refetch()}
            loading={isFetching}
            disabled={!form.athlete_user_id}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Plans
          </Button>
        }
      />

      <div className="responsive-page-grid">
        <div className="space-y-6">
          <Card hover={false}>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl bg-primary/20 p-3 text-primary">
                <Search className="h-7 w-7" />
              </div>

              <div>
                <h2 className="text-2xl font-black">Select Athlete</h2>
                <p className="text-sm text-gray-400">
                  Search athlete by sport, state, level, or achievements.
                </p>
              </div>
            </div>

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search athlete..."
            />

            <div className="mt-5 max-h-[420px] space-y-3 overflow-y-auto pr-2">
              {loadingAthletes ? (
                [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-24 animate-pulse rounded-3xl bg-surface/70"
                  />
                ))
              ) : filteredAthletes.length > 0 ? (
                filteredAthletes.map((athlete) => {
                  const isSelected =
                    selectedAthlete?.user_id === athlete.user_id

                  return (
                    <button
                      key={athlete.user_id}
                      onClick={() => selectAthlete(athlete)}
                      className={`w-full rounded-3xl border p-4 text-left transition ${
                        isSelected
                          ? 'border-primary bg-primary/20 shadow-neon'
                          : 'border-primary/20 bg-background/40 hover:border-primary/50'
                      }`}
                    >
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-black text-white">
                            {athlete.sport || 'Athlete'}
                          </h3>

                          <p className="text-sm text-gray-400">
                            {athlete.state || 'State not available'}
                          </p>
                        </div>

                        <Badge>
                          {athlete.level || 'Level'}
                        </Badge>
                      </div>

                      <p className="line-clamp-2 text-sm text-gray-500">
                        {athlete.achievements || 'No achievements listed'}
                      </p>
                    </button>
                  )
                })
              ) : (
                <div className="rounded-3xl border border-dashed border-primary/20 p-6 text-center text-gray-500">
                  No athletes found.
                </div>
              )}
            </div>
          </Card>

          {selectedAthlete && (
            <Card hover={false}>
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-success/20 p-3 text-success">
                  <UserRound className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="text-xl font-black">Selected Athlete</h2>
                  <p className="text-sm text-gray-400">
                    This athlete will receive the plan.
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-400">
                <p>Sport: {selectedAthlete.sport}</p>
                <p>State: {selectedAthlete.state}</p>
                <p>Level: {selectedAthlete.level}</p>
                <p className="break-all text-xs text-gray-600">
                  User ID: {selectedAthlete.user_id}
                </p>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card hover={false}>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl bg-primary/20 p-3 text-primary">
                <ClipboardList className="h-7 w-7" />
              </div>

              <div>
                <h2 className="text-2xl font-black">Create Plan</h2>
                <p className="text-sm text-gray-400">
                  Build a coach-created training roadmap.
                </p>
              </div>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <Input
                label="Plan Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="4 Week Speed Improvement Plan"
                required
              />

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Description
                </label>

                <textarea
                  name="description"
                  rows={5}
                  value={form.description}
                  onChange={handleChange}
                  className="input-field resize-none"
                  placeholder="Plan details, weekly activities, recovery notes..."
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Duration Weeks"
                  type="number"
                  name="duration_weeks"
                  value={form.duration_weeks}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Focus Area"
                  name="focus_area"
                  value={form.focus_area}
                  onChange={handleChange}
                  placeholder="Endurance, speed, strength..."
                  required
                />
              </div>

              <label className="block">
                <span className="mb-2 block text-sm text-gray-300">
                  Difficulty
                </span>

                <select
                  name="difficulty_level"
                  value={form.difficulty_level}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                  <option>Elite</option>
                </select>
              </label>

              <Button
                className="w-full"
                loading={createMutation.isPending}
                disabled={!form.athlete_user_id}
              >
                <Send className="h-4 w-4" />
                Create Training Plan
              </Button>
            </form>
          </Card>

          <Card hover={false}>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">Existing Plans</h2>
                <p className="text-sm text-gray-400">
                  Plans assigned to the selected athlete.
                </p>
              </div>

              <Badge>{plans.length} plans</Badge>
            </div>

            {!form.athlete_user_id ? (
              <div className="flex h-56 flex-col items-center justify-center text-center">
                <UserRound className="mb-4 h-12 w-12 text-primary" />
                <h2 className="text-xl font-black">Select athlete first</h2>
                <p className="mt-2 text-sm text-gray-400">
                  Choose an athlete to view assigned plans.
                </p>
              </div>
            ) : loadingPlans ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-24 animate-pulse rounded-3xl bg-surface/70"
                  />
                ))}
              </div>
            ) : plans.length > 0 ? (
              <div className="space-y-4">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="rounded-3xl border border-primary/20 bg-background/40 p-5"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-black text-white">
                          {plan.title}
                        </h3>

                        <p className="text-sm text-gray-400">
                          {plan.focus_area}
                        </p>
                      </div>

                      <Badge>{plan.difficulty_level}</Badge>
                    </div>

                    <p className="mb-4 text-sm leading-7 text-gray-400">
                      {plan.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="success">
                        {plan.duration_weeks} weeks
                      </Badge>

                      <Badge variant="primary">
                        Coach Assigned
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-56 flex-col items-center justify-center text-center">
                <Dumbbell className="mb-4 h-12 w-12 text-primary" />
                <h2 className="text-xl font-black">No plans found</h2>
                <p className="mt-2 text-sm text-gray-400">
                  Create the first training plan for this athlete.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}