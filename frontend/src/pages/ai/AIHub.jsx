import { Link } from 'react-router-dom'
import {
  Brain,
  Activity,
  HeartPulse,
  Map,
  MessageCircle,
  Languages,
  Video,
  Sparkles,
  ArrowRight,
} from 'lucide-react'

import { Card, PageHeader, Badge } from '@/components/ui'

const aiFeatures = [
  {
    title: 'AI Training Plan',
    description: 'Generate personalised training roadmap from athlete profile and logs.',
    path: '/ai-training-plan',
    icon: Brain,
    badge: 'Coach AI',
  },
  {
    title: 'Performance Prediction',
    description: 'Predict future performance based on recent training trends.',
    path: '/ai-prediction',
    icon: Activity,
    badge: 'Forecast',
  },
  {
    title: 'Injury Risk',
    description: 'Detect possible injury risk using fatigue and pain patterns.',
    path: '/injury-risk',
    icon: HeartPulse,
    badge: 'Safety',
  },
  {
    title: 'Career Path AI',
    description: 'Get a personalised sports career growth roadmap.',
    path: '/career-path',
    icon: Map,
    badge: 'Roadmap',
  },
  {
    title: 'AI Sports Chat',
    description: 'Ask your AI coach about training, recovery, and competitions.',
    path: '/ai-chat',
    icon: MessageCircle,
    badge: 'Assistant',
  },
  {
    title: 'Multilingual AI',
    description: 'Translate sports guidance into Indian and global languages.',
    path: '/ai-multilingual',
    icon: Languages,
    badge: 'Language',
  },
  {
    title: 'Pose Analysis',
    description: 'Upload training videos for AI biomechanics feedback.',
    path: '/pose-analysis',
    icon: Video,
    badge: 'Vision AI',
  },
]

export default function AIHub() {
  return (
    <div>
      <PageHeader
        title="AI Sports Hub"
        subtitle="A futuristic command center for all AI-powered sports intelligence tools."
      />

      <div className="mb-8 overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/20 via-surface/80 to-accent/10 p-8 shadow-neon">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
          <div>
            <Badge>
              <Sparkles className="mr-2 h-3 w-3" />
              AI Engine Active
            </Badge>

            <h2 className="mt-6 text-4xl font-black leading-tight md:text-6xl">
              Train with intelligence.
              <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Improve with data.
              </span>
            </h2>

            <p className="mt-5 max-w-2xl text-gray-300">
              Use athlete profile, training logs, analytics, and AI engines to generate insights,
              predictions, career roadmaps, recovery advice, and multilingual coaching guidance.
            </p>
          </div>

          <div className="relative mx-auto h-72 w-72">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute inset-8 rounded-full border border-primary/30 bg-background/60 backdrop-blur-xl" />
            <div className="absolute inset-20 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-neon">
              <Brain className="h-20 w-20 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {aiFeatures.map((feature) => {
          const Icon = feature.icon

          return (
            <Link key={feature.path} to={feature.path}>
              <Card className="h-full">
                <div className="mb-5 flex items-start justify-between">
                  <div className="rounded-2xl bg-primary/20 p-3 text-primary">
                    <Icon className="h-7 w-7" />
                  </div>

                  <Badge>{feature.badge}</Badge>
                </div>

                <h3 className="text-2xl font-black text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 min-h-[72px] text-sm leading-7 text-gray-400">
                  {feature.description}
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-bold text-primary">
                  Open Feature
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}