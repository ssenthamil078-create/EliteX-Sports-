import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Award,
  Dumbbell,
  FileText,
  Medal,
  Share2,
  Trophy,
} from 'lucide-react'
import toast from 'react-hot-toast'

import { athleteAPI, trainingAPI, certificateAPI } from '@/api/sportsAPI'
import { Card, Button, Badge } from '@/components/ui'
import AppLogo from '@/components/ui/AppLogo'
import { SkeletonGrid } from '@/components/ui/Skeleton'

export default function PublicAthleteProfile() {
  const { userId } = useParams()

  const { data: profileData, isLoading: loadingProfile } = useQuery({
    queryKey: ['public-profile', userId],
    queryFn: () => athleteAPI.getProfile(userId).then((res) => res.data),
    enabled: !!userId,
    retry: false,
  })

  const { data: trainingData } = useQuery({
    queryKey: ['public-training', userId],
    queryFn: () => trainingAPI.getLogs(userId).then((res) => res.data),
    enabled: !!userId,
    retry: false,
  })

  const { data: certData } = useQuery({
    queryKey: ['public-certificates', userId],
    queryFn: () => certificateAPI.getUserCertificates(userId).then((res) => res.data),
    enabled: !!userId,
    retry: false,
  })

  const profile = profileData || {}
  const logs = trainingData?.training_history || []
  const certificates = certData?.certificates || []

  const avgScore = logs.length
    ? Math.round(
        logs.reduce((sum, log) => sum + Number(log.performance_score || 0), 0) /
          logs.length
      )
    : 0

  const shareProfile = async () => {
    await navigator.clipboard.writeText(window.location.href)
    toast.success('Public profile link copied')
  }

  return (
    <div className="min-h-screen bg-background bg-sports-glow text-white sports-grid">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <Link to="/">
          <AppLogo small />
        </Link>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={shareProfile}>
            <Share2 className="h-4 w-4" />
            Share
          </Button>

          <Link to="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 pb-16">
        {loadingProfile ? (
          <SkeletonGrid count={6} />
        ) : !profileData ? (
          <Card hover={false}>
            <div className="flex h-96 flex-col items-center justify-center text-center">
              <FileText className="mb-4 h-14 w-14 text-primary" />
              <h1 className="text-3xl font-black">Athlete profile not found</h1>
              <p className="mt-3 max-w-md text-gray-400">
                This public athlete profile is unavailable or the profile has not been created yet.
              </p>
            </div>
          </Card>
        ) : (
          <>
            <section className="mb-8 overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/20 via-surface/80 to-accent/10 p-6 shadow-neon lg:p-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-center">
                <div>
                  <Badge>EliteX Public Athlete Profile</Badge>

                  <h1 className="mt-5 text-5xl font-black leading-tight">
                    {profile.name || profile.full_name || 'Athlete'}
                  </h1>

                  <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-300">
                    {profile.sport || 'Sports'} athlete from {profile.state || 'India'}, competing at{' '}
                    {profile.level || 'developing'} level.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Badge variant="success">{profile.sport || 'Sport'}</Badge>
                    <Badge>{profile.level || 'Level'}</Badge>
                    <Badge>{profile.state || 'State'}</Badge>
                  </div>
                </div>

                <Card hover={false}>
                  <Trophy className="mb-4 h-12 w-12 text-warning" />
                  <p className="text-sm text-gray-400">Sponsor Visibility</p>
                  <h2 className="mt-2 text-4xl font-black">
                    {avgScore >= 75 ? 'High' : avgScore >= 50 ? 'Medium' : 'Growing'}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-gray-400">
                    Based on training consistency, certificates and performance score.
                  </p>
                </Card>
              </div>
            </section>

            <section className="mb-8 responsive-stat-grid">
              <Stat icon={Dumbbell} label="Training Sessions" value={logs.length} />
              <Stat icon={Trophy} label="Average Score" value={avgScore || '—'} />
              <Stat icon={Award} label="Certificates" value={certificates.length} />
              <Stat icon={Medal} label="Level" value={profile.level || '—'} />
            </section>

            <section className="grid gap-6 lg:grid-cols-[1fr_420px]">
              <Card hover={false}>
                <h2 className="mb-5 text-2xl font-black">Athlete Story</h2>

                <div className="space-y-6">
                  <InfoBlock
                    title="Achievements"
                    text={profile.achievements || 'Achievements will be updated soon.'}
                  />

                  <InfoBlock
                    title="Goals"
                    text={profile.goals || 'Goals will be updated soon.'}
                  />

                  <InfoBlock
                    title="Why support this athlete?"
                    text="This athlete is actively tracking training, performance and growth through EliteX sports intelligence."
                  />
                </div>
              </Card>

              <Card hover={false}>
                <h2 className="mb-5 text-2xl font-black">Recent Performance</h2>

                {logs.length > 0 ? (
                  <div className="space-y-4">
                    {logs.slice(0, 5).map((log) => (
                      <div
                        key={log.id}
                        className="rounded-2xl border border-primary/20 bg-background/40 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <h3 className="font-black text-white">{log.training_type}</h3>
                            <p className="text-xs text-gray-500">
                              {log.created_at
                                ? new Date(log.created_at).toLocaleDateString()
                                : 'Recent session'}
                            </p>
                          </div>

                          <Badge variant="success">Score {log.performance_score}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No public training data available yet.</p>
                )}
              </Card>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

function Stat({ icon: Icon, label, value }) {
  return (
    <Card hover={false}>
      <Icon className="mb-4 h-8 w-8 text-primary" />
      <p className="text-sm text-gray-400">{label}</p>
      <h2 className="mt-2 text-3xl font-black">{value}</h2>
    </Card>
  )
}

function InfoBlock({ title, text }) {
  return (
    <div className="rounded-3xl border border-primary/20 bg-background/40 p-5">
      <h3 className="mb-2 font-black text-white">{title}</h3>
      <p className="text-sm leading-7 text-gray-400">{text}</p>
    </div>
  )
}