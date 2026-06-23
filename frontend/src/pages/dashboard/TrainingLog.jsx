import { useState } from 'react'
import toast from 'react-hot-toast'
import {
  Dumbbell,
  Flame,
  Gauge,
  HeartPulse,
  Info,
  Timer,
  Trophy,
  Zap,
} from 'lucide-react'

import { useAuthStore } from '@/store/authStore'
import { trainingAPI } from '@/api/sportsAPI'
import { Button, Card, Input, PageHeader } from '@/components/ui'

const sessionTypes = ['Running', 'Gym', 'Cricket', 'Football', 'Badminton', 'Cycling']
const durations = [15, 30, 45, 60, 90, 120]

const intensityOptions = [
  { label: 'Easy', value: 3, desc: 'Light effort, comfortable breathing' },
  { label: 'Medium', value: 5, desc: 'Moderate effort, slightly challenging' },
  { label: 'Hard', value: 8, desc: 'High effort, difficult but controlled' },
  { label: 'Max', value: 10, desc: 'Maximum effort, very intense' },
]

const performanceOptions = [
  { label: 'Poor', value: 30, emoji: '😓' },
  { label: 'Okay', value: 50, emoji: '🙂' },
  { label: 'Good', value: 75, emoji: '🔥' },
  { label: 'Excellent', value: 90, emoji: '🏆' },
]

const fatigueOptions = [
  { label: 'Fresh', value: 2 },
  { label: 'Normal', value: 4 },
  { label: 'Tired', value: 7 },
  { label: 'Exhausted', value: 10 },
]

const painOptions = [
  { label: 'No Pain', value: 0 },
  { label: 'Mild', value: 2 },
  { label: 'Moderate', value: 5 },
  { label: 'High', value: 8 },
  { label: 'Severe', value: 10 },
]

const helpText = {
  training_type: 'Choose the sport or workout category you completed.',
  duration_minutes: 'Total time spent in active training, excluding long breaks.',
  intensity: 'How hard the session felt. Easy means light effort, Max means near full effort.',
  calories_burned: 'Estimated energy burned during training. You can adjust it if needed.',
  performance_score: 'How well you performed today compared to your usual ability.',
  fatigue_level: 'How tired your body feels after training. High fatigue means you need more recovery.',
  injury_pain_level: 'Pain or discomfort felt during or after training. High pain may indicate injury risk.',
  notes: 'Write anything important: mood, weather, coach feedback, mistakes, recovery, or target for next session.',
}

function InfoTip({ text }) {
  const [open, setOpen] = useState(false)

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"
      >
        <Info className="h-3 w-3" />
      </button>

      {open && (
        <div className="absolute left-7 top-0 z-30 w-64 rounded-2xl border border-primary/20 bg-surface p-3 text-xs leading-5 text-gray-300 shadow-neon">
          {text}
        </div>
      )}
    </span>
  )
}

function FieldTitle({ icon: Icon, title, help }) {
  return (
    <div className="mb-3 flex items-center">
      {Icon && <Icon className="mr-2 h-5 w-5 text-primary" />}
      <h3 className="font-bold text-white">{title}</h3>
      <InfoTip text={help} />
    </div>
  )
}

function OptionGrid({ options, selected, onSelect }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {options.map((item) => {
        const active = selected === item.value

        return (
          <button
            type="button"
            key={item.label}
            onClick={() => onSelect(item.value)}
            className={[
              'rounded-2xl border p-4 text-left transition',
              active
                ? 'border-primary bg-primary/20 text-white shadow-neon'
                : 'border-primary/20 bg-background/40 text-gray-400 hover:border-primary/50 hover:text-white',
            ].join(' ')}
          >
            {item.emoji && <div className="mb-2 text-2xl">{item.emoji}</div>}
            <p className="font-black">{item.label}</p>
            <p className="mt-1 text-xs text-gray-500">
              Score: {item.value}
            </p>
            {item.desc && (
              <p className="mt-2 text-xs leading-5 text-gray-500">
                {item.desc}
              </p>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default function TrainingLog() {
  const userId = useAuthStore((s) => s.getUserId())

  const [form, setForm] = useState({
    training_type: 'Running',
    duration_minutes: 45,
    intensity: 5,
    calories_burned: 300,
    performance_score: 75,
    fatigue_level: 4,
    injury_pain_level: 0,
    notes: '',
  })

  const [loading, setLoading] = useState(false)

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const estimateCalories = () => {
    const estimated = Math.round(
      Number(form.duration_minutes) * Number(form.intensity) * 1.25
    )

    update('calories_burned', estimated)
    toast.success('Calories estimated')
  }

  const submit = async (e) => {
    e.preventDefault()

    if (!userId) {
      toast.error('User ID missing. Login again.')
      return
    }

    setLoading(true)

    try {
      await trainingAPI.addLog({
        user_id: userId,
        training_type: form.training_type,
        duration_minutes: Number(form.duration_minutes),
        intensity: Number(form.intensity),
        calories_burned: Number(form.calories_burned),
        performance_score: Number(form.performance_score),
        fatigue_level: Number(form.fatigue_level),
        injury_pain_level: Number(form.injury_pain_level),
        notes: form.notes,
      })

      toast.success('Training session added successfully')

      setForm({
        training_type: 'Running',
        duration_minutes: 45,
        intensity: 5,
        calories_burned: 300,
        performance_score: 75,
        fatigue_level: 4,
        injury_pain_level: 0,
        notes: '',
      })
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to add session')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Training Log"
        subtitle="Add a session quickly using simple tap-based choices and helpful category explanations."
      />

      <Card hover={false}>
        <form onSubmit={submit} className="space-y-8">
          <section>
            <FieldTitle
              icon={Dumbbell}
              title="Training Type"
              help={helpText.training_type}
            />

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              {sessionTypes.map((type) => {
                const active = form.training_type === type

                return (
                  <button
                    type="button"
                    key={type}
                    onClick={() => update('training_type', type)}
                    className={[
                      'rounded-2xl border px-4 py-3 text-sm font-bold transition',
                      active
                        ? 'border-primary bg-primary/20 text-white shadow-neon'
                        : 'border-primary/20 bg-background/40 text-gray-400 hover:text-white',
                    ].join(' ')}
                  >
                    {type}
                  </button>
                )
              })}
            </div>

            <div className="mt-4">
              <Input
                label="Or type custom training"
                value={form.training_type}
                onChange={(e) => update('training_type', e.target.value)}
                placeholder="Example: Sprint drills"
              />
            </div>
          </section>

          <section>
            <FieldTitle
              icon={Timer}
              title="Duration"
              help={helpText.duration_minutes}
            />

            <div className="flex flex-wrap gap-3">
              {durations.map((min) => (
                <button
                  type="button"
                  key={min}
                  onClick={() => update('duration_minutes', min)}
                  className={[
                    'rounded-2xl border px-5 py-3 text-sm font-black transition',
                    form.duration_minutes === min
                      ? 'border-primary bg-primary/20 text-white shadow-neon'
                      : 'border-primary/20 bg-background/40 text-gray-400 hover:text-white',
                  ].join(' ')}
                >
                  {min} min
                </button>
              ))}
            </div>

            <div className="mt-4 max-w-xs">
              <Input
                label="Custom duration"
                type="number"
                value={form.duration_minutes}
                onChange={(e) => update('duration_minutes', e.target.value)}
              />
            </div>
          </section>

          <section>
            <FieldTitle
              icon={Zap}
              title="Intensity"
              help={helpText.intensity}
            />

            <OptionGrid
              options={intensityOptions}
              selected={form.intensity}
              onSelect={(value) => update('intensity', value)}
            />
          </section>

          <section>
            <FieldTitle
              icon={Trophy}
              title="Performance"
              help={helpText.performance_score}
            />

            <OptionGrid
              options={performanceOptions}
              selected={form.performance_score}
              onSelect={(value) => update('performance_score', value)}
            />
          </section>

          <section>
            <FieldTitle
              icon={Gauge}
              title="Fatigue Level"
              help={helpText.fatigue_level}
            />

            <OptionGrid
              options={fatigueOptions}
              selected={form.fatigue_level}
              onSelect={(value) => update('fatigue_level', value)}
            />
          </section>

          <section>
            <FieldTitle
              icon={HeartPulse}
              title="Pain Level"
              help={helpText.injury_pain_level}
            />

            <OptionGrid
              options={painOptions}
              selected={form.injury_pain_level}
              onSelect={(value) => update('injury_pain_level', value)}
            />
          </section>

          <section>
            <FieldTitle
              icon={Flame}
              title="Calories Burned"
              help={helpText.calories_burned}
            />

            <div className="grid gap-4 md:grid-cols-[1fr_220px]">
              <Input
                type="number"
                value={form.calories_burned}
                onChange={(e) => update('calories_burned', e.target.value)}
                placeholder="300"
              />

              <Button type="button" variant="secondary" onClick={estimateCalories}>
                Estimate Calories
              </Button>
            </div>
          </section>

          <section>
            <FieldTitle
              icon={Info}
              title="Session Notes"
              help={helpText.notes}
            />

            <textarea
              rows={4}
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              placeholder="Example: Felt strong today, but slight knee discomfort after sprinting..."
              className="input-field resize-none"
            />
          </section>

          <Button type="submit" loading={loading} className="w-full">
            <Dumbbell className="h-4 w-4" />
            Save Training Session
          </Button>
        </form>
      </Card>
    </div>
  )
}