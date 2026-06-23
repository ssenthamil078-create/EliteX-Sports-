import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  Upload,
  Video,
  Brain,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  Download,
  Activity,
  Gauge,
  Dumbbell,
  Sparkles,
} from 'lucide-react'

import { videoAPI } from '@/api/sportsAPI'
import { useAuthStore } from '@/store/authStore'
import { Card, PageHeader, Button, Input, Badge } from '@/components/ui'

function getRiskLevel(score) {
  if (score >= 75) return { label: 'Safe', variant: 'success', text: 'Movement quality looks strong.' }
  if (score >= 50) return { label: 'Moderate', variant: 'warning', text: 'Some correction is recommended.' }
  return { label: 'High Risk', variant: 'danger', text: 'Technique needs focused improvement.' }
}

function ScoreCard({ label, value, icon: Icon }) {
  const score = Number(value || 0)

  return (
    <div className="rounded-3xl border border-primary/20 bg-background/50 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="rounded-2xl bg-primary/20 p-3 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-2xl font-black">{score}</span>
      </div>

      <p className="mb-3 text-sm font-semibold text-gray-300">{label}</p>

      <div className="h-3 overflow-hidden rounded-full bg-surface">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
    </div>
  )
}

function parseReportText(text = '') {
  const lines = text.split('\n').filter(Boolean)

  return {
    strengths: lines.filter((line) =>
      /strength|good|excellent|stable|positive/i.test(line)
    ),
    improvements: lines.filter((line) =>
      /improve|weak|correct|focus|need|issue|risk/i.test(line)
    ),
    drills: lines.filter((line) =>
      /drill|exercise|practice|recommended|training/i.test(line)
    ),
  }
}
function getSportMistakeConfig(sport = 'Running') {
  const normalized = sport.toLowerCase()

  if (normalized.includes('cricket')) {
    return {
      title: 'Cricket Bowling Mistake Map',
      subtitle: 'Sport-specific biomechanical focus for bowling, throwing and follow-through.',
      markers: [
        { label: 'Shoulder Load', scoreKey: 'posture_score', className: 'left-[150px] top-24', note: 'Watch shoulder overload' },
        { label: 'Spine Bend', scoreKey: 'stability_score', className: 'left-[15px] top-36', note: 'Control trunk flexion' },
        { label: 'Hip Rotation', scoreKey: 'mobility_score', className: 'left-[145px] top-48', note: 'Improve hip drive' },
        { label: 'Front Knee', scoreKey: 'balance_score', className: 'left-[15px] top-[285px]', note: 'Stabilize landing leg' },
        { label: 'Follow-through', scoreKey: 'symmetry_score', className: 'left-[145px] top-[315px]', note: 'Balance release phase' },
      ],
    }
  }

  if (normalized.includes('football')) {
    return {
      title: 'Football Movement Mistake Map',
      subtitle: 'Focus areas for cutting, kicking, acceleration and landing stability.',
      markers: [
        { label: 'Core Control', scoreKey: 'stability_score', className: 'left-[150px] top-32', note: 'Improve body control' },
        { label: 'Hip Mobility', scoreKey: 'mobility_score', className: 'left-[10px] top-48', note: 'Open hip range' },
        { label: 'Kicking Symmetry', scoreKey: 'symmetry_score', className: 'left-[145px] top-56', note: 'Balance both sides' },
        { label: 'Knee Stability', scoreKey: 'balance_score', className: 'left-[5px] top-[285px]', note: 'Avoid knee collapse' },
        { label: 'Ankle Control', scoreKey: 'posture_score', className: 'left-[145px] top-[335px]', note: 'Improve landing control' },
      ],
    }
  }

  if (normalized.includes('badminton')) {
    return {
      title: 'Badminton Movement Mistake Map',
      subtitle: 'Focus areas for lunges, smash mechanics, shoulder control and recovery footwork.',
      markers: [
        { label: 'Shoulder Control', scoreKey: 'posture_score', className: 'left-[150px] top-24', note: 'Control smash shoulder' },
        { label: 'Core Rotation', scoreKey: 'stability_score', className: 'left-[15px] top-40', note: 'Improve trunk rotation' },
        { label: 'Lunge Balance', scoreKey: 'balance_score', className: 'left-[145px] top-[275px]', note: 'Stabilize lunges' },
        { label: 'Hip Mobility', scoreKey: 'mobility_score', className: 'left-[10px] top-56', note: 'Increase court reach' },
        { label: 'Footwork Symmetry', scoreKey: 'symmetry_score', className: 'left-[145px] top-[330px]', note: 'Balance left/right movement' },
      ],
    }
  }

  return {
    title: 'Running Mistake Map',
    subtitle: 'Focus areas for posture, stride balance, hip control and landing mechanics.',
    markers: [
      { label: 'Trunk Lean', scoreKey: 'posture_score', className: 'left-[150px] top-24', note: 'Reduce excessive lean' },
      { label: 'Core Stability', scoreKey: 'stability_score', className: 'left-[10px] top-40', note: 'Improve torso control' },
      { label: 'Hip Drop', scoreKey: 'symmetry_score', className: 'left-[145px] top-52', note: 'Check left/right imbalance' },
      { label: 'Knee Tracking', scoreKey: 'balance_score', className: 'left-[5px] top-[285px]', note: 'Avoid inward knee movement' },
      { label: 'Ankle Landing', scoreKey: 'mobility_score', className: 'left-[145px] top-[335px]', note: 'Improve foot strike' },
    ],
  }
}

function BodyMistakeMap({ scores = {}, sport = 'Running' }) {
  const config = getSportMistakeConfig(sport)

  const issueColor = (score) => {
    if (score >= 75) return 'bg-success'
    if (score >= 50) return 'bg-warning'
    return 'bg-danger'
  }

  const issueLabel = (score) => {
    if (score >= 75) return 'Good'
    if (score >= 50) return 'Needs Work'
    return 'High Issue'
  }

  return (
    <div className="rounded-3xl border border-primary/20 bg-background/40 p-6">
      <h2 className="mb-2 text-2xl font-black">{config.title}</h2>
      <p className="mb-6 text-sm text-gray-400">{config.subtitle}</p>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="relative mx-auto h-[420px] w-[240px]">
          <div className="absolute left-1/2 top-0 h-16 w-16 -translate-x-1/2 rounded-full border-4 border-primary/40 bg-primary/10" />
          <div className="absolute left-1/2 top-20 h-36 w-24 -translate-x-1/2 rounded-[3rem] border-4 border-primary/40 bg-primary/10" />
          <div className="absolute left-4 top-28 h-28 w-8 -rotate-12 rounded-full border-4 border-primary/40 bg-primary/10" />
          <div className="absolute right-4 top-28 h-28 w-8 rotate-12 rounded-full border-4 border-primary/40 bg-primary/10" />
          <div className="absolute left-[76px] top-56 h-36 w-9 rotate-6 rounded-full border-4 border-primary/40 bg-primary/10" />
          <div className="absolute right-[76px] top-56 h-36 w-9 -rotate-6 rounded-full border-4 border-primary/40 bg-primary/10" />

          {config.markers.map((marker) => {
            const value = Number(scores[marker.scoreKey] || 0)

            return (
              <Marker
                key={marker.label}
                label={marker.label}
                value={value}
                className={marker.className}
                color={issueColor(value)}
              />
            )
          })}
        </div>

        <div className="space-y-3">
          {config.markers.map((marker) => {
            const value = Number(scores[marker.scoreKey] || 0)

            return (
              <div
                key={marker.label}
                className="rounded-2xl border border-primary/20 bg-background/50 p-4"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="font-black text-white">{marker.label}</h3>
                  <Badge
                    variant={
                      value >= 75 ? 'success' : value >= 50 ? 'warning' : 'danger'
                    }
                  >
                    {issueLabel(value)}
                  </Badge>
                </div>

                <p className="text-sm leading-6 text-gray-400">{marker.note}</p>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    style={{ width: `${Math.min(value, 100)}%` }}
                  />
                </div>

                <p className="mt-2 text-xs text-gray-500">Score: {value}/100</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
        <Legend color="bg-success" label="Good" />
        <Legend color="bg-warning" label="Needs Work" />
        <Legend color="bg-danger" label="High Issue" />
      </div>
    </div>
  )
}

function Marker({ label, value, color, className }) {
  return (
    <div className={`absolute ${className}`}>
      <div className={`h-5 w-5 animate-ping rounded-full ${color}`} />
      <div className={`absolute left-0 top-0 h-5 w-5 rounded-full ${color}`} />

      <div className="mt-2 min-w-[90px] rounded-xl border border-primary/20 bg-surface/90 px-3 py-2 text-xs shadow-neon">
        <p className="font-bold text-white">{label}</p>
        <p className="text-gray-400">{value}/100</p>
      </div>
    </div>
  )
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-background/50 p-2">
      <span className={`h-3 w-3 rounded-full ${color}`} />
      <span className="text-gray-400">{label}</span>
    </div>
  )
}
function getSportJointLabels(sport = 'Running') {
  const s = sport.toLowerCase()

  if (s.includes('cricket')) {
    return {
      shoulder: 'Shoulder Rotation',
      spine: 'Trunk Angle',
      hip: 'Hip Drive',
      knee: 'Front Knee Angle',
    }
  }

  if (s.includes('football')) {
    return {
      shoulder: 'Upper Body Control',
      spine: 'Core Alignment',
      hip: 'Hip Mobility',
      knee: 'Knee Stability',
    }
  }

  if (s.includes('badminton')) {
    return {
      shoulder: 'Smash Shoulder',
      spine: 'Core Rotation',
      hip: 'Lunge Mobility',
      knee: 'Landing Stability',
    }
  }

  return {
    shoulder: 'Arm Swing',
    spine: 'Trunk Lean',
    hip: 'Hip Alignment',
    knee: 'Knee Tracking',
  }
}

function SkeletonPoseOverlay({ scores = {}, sport = 'Running' }) {
  const posture = Number(scores.posture_score || 0)
  const balance = Number(scores.balance_score || 0)
  const symmetry = Number(scores.symmetry_score || 0)
  const mobility = Number(scores.mobility_score || 0)

  const labels = getSportJointLabels(sport)

  const tilt = posture < 50 ? -12 : posture < 75 ? -6 : 0
  const hipShift = balance < 50 ? 18 : balance < 75 ? 8 : 0
  const armShift = symmetry < 50 ? 18 : symmetry < 75 ? 8 : 0

  const shoulderAngle = 80 + Math.round(symmetry / 5)
  const trunkAngle = Math.round(posture * 0.2)
  const hipAngle = 100 + Math.round(mobility / 2)
  const kneeAngle = 100 + Math.round(balance / 2)

  return (
    <div className="rounded-3xl border border-primary/20 bg-background/40 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-black">Sport Biomechanics Overlay</h2>
        <p className="mt-2 text-sm text-gray-400">
          AI-estimated joint alignment and movement quality indicators.
        </p>
      </div>

      <div className="grid w-full gap-6 xl:grid-cols-2">
          <div className="absolute inset-0 opacity-30 sports-grid" />
          <div className="relative mx-auto h-[430px] w-full max-w-[520px] overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-b from-surface/80 to-background/80">
          <div
            className="absolute left-1/2 top-14 h-[330px] w-[230px] -translate-x-1/2 transition-all duration-700"
            style={{
              transform: `translateX(-50%) rotate(${tilt}deg)`,
            }}
          >
            <Joint className="left-[100px] top-0" />

            <Bone className="left-[68px] top-[65px] w-[95px]" />
            <Joint className="left-[63px] top-[58px]" />
            <Joint className="left-[158px] top-[58px]" />

            <Bone className="left-[110px] top-[75px] h-[108px] w-1" vertical />

            <Bone className="left-[48px] top-[84px] h-[92px] w-1 rotate-[22deg]" vertical />
            <Bone className="left-[172px] top-[84px] h-[92px] w-1 -rotate-[22deg]" vertical />

            <Joint
              className="left-[42px] top-[168px]"
              style={{ transform: `translateX(-${armShift}px)` }}
            />

            <Joint
              className="left-[178px] top-[168px]"
              style={{ transform: `translateX(${armShift}px)` }}
            />

            <div style={{ transform: `translateX(${hipShift}px)` }}>
              <Bone className="left-[78px] top-[188px] w-[76px]" />
              <Joint className="left-[73px] top-[181px]" />
              <Joint className="left-[149px] top-[181px]" />

              <Bone className="left-[88px] top-[204px] h-[102px] w-1 rotate-[10deg]" vertical />
              <Bone className="left-[144px] top-[204px] h-[102px] w-1 -rotate-[10deg]" vertical />

              <Joint className="left-[98px] top-[300px]" />
              <Joint className="left-[134px] top-[300px]" />
            </div>
          </div>

          <AngleTag value={`${shoulderAngle}°`} className="left-6 top-6" />
          <AngleTag value={`${trunkAngle}°`} className="right-6 top-28" />
          <AngleTag value={`${hipAngle}°`} className="left-6 bottom-28" />
          <AngleTag value={`${kneeAngle}°`} className="right-6 bottom-10" />
        </div>
        <div className="flex h-full min-w-0 flex-col justify-center space-y-4 rounded-3xl border border-primary/20 bg-background/40 p-5">
          <JointMetric label={labels.shoulder} value={shoulderAngle} />
          <JointMetric label={labels.spine} value={trunkAngle} />
          <JointMetric label={labels.hip} value={hipAngle} />
          <JointMetric label={labels.knee} value={kneeAngle} />
        </div>
      </div>
    </div>
  )
}

function AngleTag({ value, className }) {
  return (
    <div
      className={`absolute rounded-xl border border-primary/20 bg-background/80 px-3 py-2 text-xs font-black text-primary ${className}`}
    >
      {value}
    </div>
  )
}

function JointMetric({ label, value }) {
  return (
    <div className="min-w-0 rounded-2xl border border-primary/20 bg-background/50 p-4">
      <div className="flex items-center justify-between">
        <span className="text-gray-400">{label}</span>
        <span className="font-black text-white">
          {value}°
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
          style={{ width: `${Math.min(value, 180) / 1.8}%` }}
        />
      </div>
    </div>
  )
}

function Joint({ className = '', style }) {
  return (
    <div
      style={style}
      className={`absolute h-5 w-5 rounded-full bg-warning shadow-[0_0_18px_rgba(245,158,11,0.8)] ${className}`}
    />
  )
}

function Bone({ className = '', vertical = false }) {
  return (
    <div
      className={`absolute rounded-full bg-primary shadow-[0_0_18px_rgba(99,102,241,0.8)] ${
        vertical ? 'h-20 w-1' : 'h-1'
      } ${className}`}
    />
  )
}

function MiniBadge({ label, value }) {
  return (
    <div className="rounded-xl border border-primary/20 bg-background/70 p-2 text-center">
      <p className="text-gray-500">{label}</p>
      <p className="font-black text-white">{value}</p>
    </div>
  )
}
function getSportRiskConfig(sport = 'Running') {
  const s = sport.toLowerCase()

  if (s.includes('cricket')) {
    return [
      {
        label: 'Shoulder Risk',
        scoreKey: 'posture_score',
        reason: 'Bowling and throwing load may stress the shoulder.',
      },
      {
        label: 'Lower Back Risk',
        scoreKey: 'stability_score',
        reason: 'Poor trunk control can increase back strain.',
      },
      {
        label: 'Front Knee Risk',
        scoreKey: 'balance_score',
        reason: 'Landing instability can stress the front knee.',
      },
      {
        label: 'Hip Rotation Risk',
        scoreKey: 'mobility_score',
        reason: 'Limited hip drive affects bowling mechanics.',
      },
    ]
  }

  if (s.includes('football')) {
    return [
      {
        label: 'Knee Risk',
        scoreKey: 'balance_score',
        reason: 'Poor cutting and landing control can increase knee stress.',
      },
      {
        label: 'Ankle Risk',
        scoreKey: 'stability_score',
        reason: 'Low stability may affect landing and direction changes.',
      },
      {
        label: 'Hip Risk',
        scoreKey: 'mobility_score',
        reason: 'Limited hip mobility can reduce kicking efficiency.',
      },
      {
        label: 'Core Risk',
        scoreKey: 'posture_score',
        reason: 'Weak posture control affects acceleration and turning.',
      },
    ]
  }

  if (s.includes('badminton')) {
    return [
      {
        label: 'Shoulder Risk',
        scoreKey: 'posture_score',
        reason: 'Smash mechanics may overload the shoulder.',
      },
      {
        label: 'Knee Risk',
        scoreKey: 'balance_score',
        reason: 'Repeated lunges can stress knees if landing is unstable.',
      },
      {
        label: 'Ankle Risk',
        scoreKey: 'stability_score',
        reason: 'Quick changes of direction require strong ankle control.',
      },
      {
        label: 'Hip Mobility Risk',
        scoreKey: 'mobility_score',
        reason: 'Limited hip mobility affects court reach and recovery.',
      },
    ]
  }

  return [
    {
      label: 'Knee Risk',
      scoreKey: 'balance_score',
      reason: 'Poor knee tracking may increase running injury risk.',
    },
    {
      label: 'Ankle Risk',
      scoreKey: 'mobility_score',
      reason: 'Weak foot strike or landing may stress the ankle.',
    },
    {
      label: 'Hip Risk',
      scoreKey: 'symmetry_score',
      reason: 'Hip drop or imbalance can affect stride efficiency.',
    },
    {
      label: 'Lower Back Risk',
      scoreKey: 'posture_score',
      reason: 'Excessive trunk lean can increase back load.',
    },
  ]
}

function calculateRiskFromScore(score) {
  const safeScore = Number(score || 0)
  return Math.max(0, Math.min(100, 100 - safeScore))
}

function getRiskVariant(risk) {
  if (risk >= 70) return 'danger'
  if (risk >= 40) return 'warning'
  return 'success'
}

function getRiskText(risk) {
  if (risk >= 70) return 'High'
  if (risk >= 40) return 'Moderate'
  return 'Low'
}

function InjuryRiskHeatmap({ scores = {}, sport = 'Running' }) {
  const risks = getSportRiskConfig(sport).map((item) => {
    const score = Number(scores[item.scoreKey] || 0)
    const risk = calculateRiskFromScore(score)

    return {
      ...item,
      score,
      risk,
      level: getRiskText(risk),
      variant: getRiskVariant(risk),
    }
  })

  const highestRisk = risks.reduce(
    (max, item) => (item.risk > max.risk ? item : max),
    risks[0]
  )

  return (
    <div className="rounded-3xl border border-primary/20 bg-background/40 p-6">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-black">Injury Risk Heatmap</h2>
          <p className="mt-2 text-sm text-gray-400">
            Sport-specific injury risk estimated from posture, balance,
            mobility, symmetry and stability.
          </p>
        </div>

        <Badge variant={highestRisk.variant}>
          Highest: {highestRisk.label}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {risks.map((item) => (
          <div
            key={item.label}
            className="rounded-3xl border border-primary/20 bg-background/50 p-5"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="font-black text-white">{item.label}</h3>
              <Badge variant={item.variant}>{item.level}</Badge>
            </div>

            <div className="relative mb-4 h-24 overflow-hidden rounded-2xl bg-surface">
              <div
                className={[
                  'absolute bottom-0 left-0 right-0 transition-all duration-700',
                  item.variant === 'danger'
                    ? 'bg-danger/70'
                    : item.variant === 'warning'
                    ? 'bg-warning/70'
                    : 'bg-success/70',
                ].join(' ')}
                style={{ height: `${item.risk}%` }}
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-black text-white">
                  {item.risk}%
                </span>
              </div>
            </div>

            <p className="text-sm leading-6 text-gray-400">
              {item.reason}
            </p>

            <p className="mt-3 text-xs text-gray-500">
              Related score: {item.score}/100
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PoseAnalysis() {
  const userId = useAuthStore((s) => s.getUserId())
  const queryClient = useQueryClient()

  const [sport, setSport] = useState('Running')
  const [video, setVideo] = useState(null)
  const [latestResult, setLatestResult] = useState(null)

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['pose-reports', userId],
    queryFn: () => videoAPI.getPoseReports(userId).then((res) => res.data),
    enabled: !!userId,
  })

  const uploadMutation = useMutation({
    mutationFn: () =>
      videoAPI.uploadPoseVideo({
        userId,
        sport,
        video,
      }),
    onSuccess: (res) => {
      toast.success('Video uploaded and analysed')
      setLatestResult(res.data)
      setVideo(null)
      queryClient.invalidateQueries({ queryKey: ['pose-reports', userId] })
    },
    onError: (err) => {
      const detail = err.response?.data?.detail
      const message = Array.isArray(detail)
        ? detail.map((e) => e.msg).join(', ')
        : detail || 'Pose analysis failed'

      toast.error(message)
    },
  })

  const submit = (e) => {
    e.preventDefault()

    if (!video) {
      toast.error('Please select a video')
      return
    }

    uploadMutation.mutate()
  }

  const reports = data?.reports || []

  const activeReport = latestResult || reports[0]

  const performanceScores =
    activeReport?.performance_scores || activeReport?.performanceScores || {}

  const overallScore =
    performanceScores.overall_score ||
    activeReport?.overall_score ||
    activeReport?.pose_detection_rate ||
    0

  const risk = getRiskLevel(Number(overallScore))

  const feedbackText =
    activeReport?.ai_biomechanics_report ||
    activeReport?.ai_feedback ||
    ''

  const feedbackGroups = useMemo(
    () => parseReportText(feedbackText),
    [feedbackText]
  )

  const downloadReport = () => {
    if (!activeReport) {
      toast.error('No report available')
      return
    }

    const content = `
EliteX Pose Analysis Report

Sport: ${activeReport.sport || sport}
Overall Score: ${overallScore}
Risk Level: ${risk.label}

AI Feedback:
${feedbackText || 'No AI feedback available'}

Raw Scores:
${JSON.stringify(performanceScores, null, 2)}
`.trim()

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'elitex-pose-analysis-report.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <PageHeader
        title="Pose Analysis"
        subtitle="Upload sports videos for AI biomechanics feedback, score tracking and movement risk insights."
        action={
          <Button onClick={() => refetch()} loading={isFetching}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <Card hover={false}>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-primary/20 p-3 text-primary">
              <Upload className="h-7 w-7" />
            </div>

            <div>
              <h2 className="text-2xl font-black">Upload Video</h2>
              <p className="text-sm text-gray-400">
                Upload a training video for AI movement analysis.
              </p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <Input
              label="Sport"
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              placeholder="Running, Cricket, Football..."
              required
            />

            <label className="block">
              <span className="mb-2 block text-sm text-gray-300">
                Training Video
              </span>

              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideo(e.target.files?.[0])}
                className="input-field"
              />
            </label>

            {video && (
              <div className="rounded-2xl border border-primary/20 bg-background/50 p-4 text-sm text-gray-400">
                Selected: {video.name}
              </div>
            )}

            <Button className="w-full" loading={uploadMutation.isPending}>
              <Video className="h-4 w-4" />
              Upload & Analyse
            </Button>
          </form>

          {uploadMutation.isPending && (
            <div className="mt-6 rounded-3xl border border-primary/20 bg-primary/10 p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 animate-spin items-center justify-center rounded-full border-4 border-primary/30 border-t-primary">
                <Brain className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-black">Analyzing biomechanics...</h3>
              <p className="mt-2 text-sm text-gray-400">
                EliteX AI is scanning movement quality, posture and balance.
              </p>
            </div>
          )}
        </Card>

        <div className="space-y-6">
          {activeReport ? (
            <>
              <Card hover={false}>
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-black">AI Score Dashboard</h2>
                    <p className="text-sm text-gray-400">
                      Latest biomechanics performance summary.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Badge variant={risk.variant}>{risk.label}</Badge>
                    <Button size="sm" variant="secondary" onClick={downloadReport}>
                      <Download className="h-4 w-4" />
                      Report
                    </Button>
                  </div>
                </div>

                <div className="mb-6 rounded-3xl border border-primary/20 bg-background/40 p-5">
                  <div className="flex items-center gap-4">
                    {risk.variant === 'danger' ? (
                      <AlertTriangle className="h-8 w-8 text-danger" />
                    ) : (
                      <ShieldCheck className="h-8 w-8 text-success" />
                    )}

                    <div>
                      <h3 className="text-xl font-black">
                        Movement Risk: {risk.label}
                      </h3>
                      <p className="text-sm text-gray-400">{risk.text}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                    <BodyMistakeMap scores={performanceScores}
                    sport={activeReport?.sport || sport } />
                    </div>
                <div className="mb-6 w-full overflow-hidden">
                    <SkeletonPoseOverlay scores={performanceScores}
                    sport={activeReport?.sport || sport} />
                    </div>
                <div className="mb-6">
                  <InjuryRiskHeatmap
                  scores={performanceScores}
                  sport={activeReport?.sport || sport}
                  />
                  </div>

                <div className="responsive-card-grid">
                  <ScoreCard label="Overall Score" value={overallScore} icon={Sparkles} />
                  <ScoreCard label="Balance" value={performanceScores.balance_score} icon={Activity} />
                  <ScoreCard label="Posture" value={performanceScores.posture_score} icon={Gauge} />
                  <ScoreCard label="Symmetry" value={performanceScores.symmetry_score} icon={Dumbbell} />
                  <ScoreCard label="Explosiveness" value={performanceScores.explosiveness_score} icon={Activity} />
                  <ScoreCard label="Mobility" value={performanceScores.mobility_score} icon={Video} />
                  <ScoreCard label="Stability" value={performanceScores.stability_score} icon={ShieldCheck} />
                </div>
              </Card>

              <Card hover={false}>
                <div className="mb-5 flex items-center gap-3">
                  <Brain className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-black">AI Coach Feedback</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <FeedbackBox
                    title="Strengths"
                    items={feedbackGroups.strengths}
                    fallback="Stable movements and positive patterns will appear here."
                    variant="success"
                  />

                  <FeedbackBox
                    title="Improvements"
                    items={feedbackGroups.improvements}
                    fallback="Correction points will appear here."
                    variant="warning"
                  />

                  <FeedbackBox
                    title="Recommended Drills"
                    items={feedbackGroups.drills}
                    fallback="Recommended drills will appear here."
                    variant="primary"
                  />
                </div>

                <div className="mt-5 rounded-3xl border border-primary/20 bg-background/40 p-5">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-gray-300">
                    {feedbackText || 'No AI feedback available.'}
                  </p>
                </div>
              </Card>
            </>
          ) : (
            <Card hover={false}>
              <div className="flex h-72 flex-col items-center justify-center text-center">
                <Video className="mb-4 h-14 w-14 text-primary" />
                <h2 className="text-2xl font-black">No analysis yet</h2>
                <p className="mt-2 max-w-md text-gray-400">
                  Upload a sports video to generate score cards, risk indicator and AI coach feedback.
                </p>
              </div>
            </Card>
          )}

          <Card hover={false}>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">Video History</h2>
                <p className="text-sm text-gray-400">
                  Previous uploaded pose analysis reports.
                </p>
              </div>

              <Badge>{reports.length} reports</Badge>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 animate-pulse rounded-3xl bg-surface/70" />
                ))}
              </div>
            ) : reports.length > 0 ? (
              <div className="space-y-4">
                {reports.map((report) => (
                  <button
                    key={report.report_id || report.id}
                    onClick={() => setLatestResult(report)}
                    className="w-full rounded-3xl border border-primary/20 bg-background/40 p-5 text-left transition hover:border-primary/50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-black text-white">
                          {report.sport}
                        </h3>
                        <p className="text-sm text-gray-400">
                          Detection Quality: {report.detection_quality}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {report.created_at
                            ? new Date(report.created_at).toLocaleString()
                            : 'Unknown time'}
                        </p>
                      </div>

                      <Badge variant="success">
                        {report.pose_detection_rate || 0}%
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-gray-500">
                No reports found.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

function FeedbackBox({ title, items, fallback, variant }) {
  return (
    <div className="rounded-3xl border border-primary/20 bg-background/40 p-5">
      <Badge variant={variant}>{title}</Badge>

      <div className="mt-4 space-y-2">
        {items.length > 0 ? (
          items.slice(0, 4).map((item, index) => (
            <p key={index} className="text-sm leading-6 text-gray-400">
              • {item}
            </p>
          ))
        ) : (
          <p className="text-sm leading-6 text-gray-500">{fallback}</p>
        )}
      </div>
    </div>
  )
}