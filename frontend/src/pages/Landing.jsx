import { Link } from 'react-router-dom'
import {
  Activity,
  ArrowRight,
  BarChart3,
  Brain,
  HeartPulse,
  Languages,
  PlayCircle,
  ShieldCheck,
  Trophy,
} from 'lucide-react'

import { Button, Card, Badge } from '@/components/ui'
import AppLogo from '@/components/ui/AppLogo'

const features = [
  {
    title: 'AI Training Plans',
    desc: 'Generate personalised sports training plans using athlete profile and logs.',
    icon: Brain,
  },
  {
    title: 'Performance Analytics',
    desc: 'Track sessions, intensity, fatigue, pain, calories and skill rating.',
    icon: BarChart3,
  },
  {
    title: 'Injury Risk Prediction',
    desc: 'Detect training risk using fatigue and pain patterns.',
    icon: HeartPulse,
  },
  {
    title: 'Opportunities',
    desc: 'Find competitions, scholarships, schemes, coaches and sponsors.',
    icon: Trophy,
  },
  {
    title: 'Multilingual AI',
    desc: 'Translate sports guidance into Indian and global languages.',
    icon: Languages,
  },
  {
    title: 'Secure Platform',
    desc: 'JWT auth, privacy policy, cookie consent and account controls.',
    icon: ShieldCheck,
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-background bg-sports-glow text-white sports-grid">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/">
          <AppLogo small />
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-gray-400 md:flex">
          <a href="#features" className="hover:text-white">
            Features
          </a>

          <Link to="/legal" className="hover:text-white">
            Legal
          </Link>

          <Link to="/login" className="hover:text-white">
            Login
          </Link>
        </nav>

        <Link to="/register">
          <Button size="sm">Get Started</Button>
        </Link>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1fr_460px] lg:items-center lg:py-24">
          <div>
            <Badge>
              <Activity className="mr-2 h-3 w-3" />
              AI Sports Opportunity & Talent Intelligence
            </Badge>

            <h2 className="mt-8 text-5xl font-black leading-tight md:text-7xl">
              Train smarter.
              <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Get discovered faster.
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
              A futuristic AI-powered sports platform for athletes, coaches,
              scouts and sponsors. Track performance, predict risks, discover
              opportunities, and unlock personalised growth insights.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link to="/register">
                <Button size="lg">
                  Start Now
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>

              <Link to="/login">
                <Button size="lg" variant="secondary">
                  <PlayCircle className="h-5 w-5" />
                  Login
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl" />

            <Card hover={false} className="relative overflow-hidden">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />

              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">
                    Performance Score
                  </p>
                  <h3 className="mt-2 text-6xl font-black">92%</h3>
                </div>

                <div className="rounded-3xl bg-success/20 p-4 text-success">
                  <Trophy className="h-10 w-10" />
                </div>
              </div>

              <div className="space-y-5">
                {[
                  ['Training Load', '86%'],
                  ['Recovery Balance', '74%'],
                  ['AI Readiness', '96%'],
                  ['Opportunity Match', '89%'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-gray-400">{label}</span>
                      <span className="font-bold text-white">{value}</span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-surface">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                        style={{ width: value }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-10 text-center">
            <Badge>Platform Features</Badge>

            <h2 className="mt-5 text-4xl font-black">
              Everything an athlete needs
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-gray-400">
              From training logs to AI career planning, your platform connects
              athlete growth with real opportunities.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon

              return (
                <Card key={feature.title}>
                  <div className="mb-5 w-fit rounded-2xl bg-primary/20 p-3 text-primary">
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="text-2xl font-black">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-400">
                    {feature.desc}
                  </p>
                </Card>
              )
            })}
          </div>
        </section>
      </main>

      <footer className="border-t border-primary/15 px-6 py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} EliteX. Built for athlete
        intelligence.
      </footer>
    </div>
  )
}