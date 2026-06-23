import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Medal,
  Search,
  Trophy,
  Users,
  TrendingUp,
  Dumbbell,
  RefreshCw,
} from 'lucide-react'

import { leaderboardAPI } from '@/api/sportsAPI'
import { Card, PageHeader, Button, Badge, Input } from '@/components/ui'
import { SkeletonStatGrid, SkeletonTable } from '@/components/ui/Skeleton'

export default function Leaderboard() {
  const [sport, setSport] = useState('')
  const [activeSport, setActiveSport] = useState('')

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['leaderboard', activeSport],
    queryFn: () =>
      activeSport
        ? leaderboardAPI.getBySport(activeSport).then((res) => res.data)
        : leaderboardAPI.getAll().then((res) => res.data),
  })

  const board = data?.leaderboard || []

  const searchSport = (e) => {
    e.preventDefault()
    setActiveSport(sport.trim())
  }

  const clearSport = () => {
    setSport('')
    setActiveSport('')
  }

  const getRankIcon = (index) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `#${index + 1}`
  }

  const getLevelVariant = (level) => {
    if (!level) return 'gray'
    const normalized = level.toLowerCase()

    if (normalized.includes('elite') || normalized.includes('national')) {
      return 'warning'
    }

    if (normalized.includes('state') || normalized.includes('gold')) {
      return 'success'
    }

    return 'primary'
  }

  return (
    <div>
      <PageHeader
        title="Athlete Leaderboard"
        subtitle="Rank athletes by performance, consistency, intensity and recovery balance."
        action={
          <Button onClick={() => refetch()} loading={isFetching}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        }
      />

      {isLoading ? (
        <div className="mb-8">
          <SkeletonStatGrid count={3} />
        </div>
      ) : (
        <div className="mb-8 responsive-stat-grid">
          <Card hover={false}>
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-primary/20 p-3 text-primary">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Athletes</p>
                <h2 className="text-3xl font-black">
                  {data?.total_athletes ?? board.length}
                </h2>
              </div>
            </div>
          </Card>

          <Card hover={false}>
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-warning/20 p-3 text-warning">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Top Score</p>
                <h2 className="text-3xl font-black">
                  {board[0]?.leaderboard_score ?? '—'}
                </h2>
              </div>
            </div>
          </Card>

          <Card hover={false}>
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-success/20 p-3 text-success">
                <Dumbbell className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Sport Filter</p>
                <h2 className="text-2xl font-black">{activeSport || 'All'}</h2>
              </div>
            </div>
          </Card>
        </div>
      )}

      <Card hover={false} className="mb-8">
        <form onSubmit={searchSport} className="flex flex-col gap-3 md:flex-row">
          <div className="flex-1">
            <Input
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              placeholder="Filter by sport: Cricket, Football, Running..."
            />
          </div>

          <Button type="submit">
            <Search className="h-4 w-4" />
            Search
          </Button>

          <Button type="button" variant="secondary" onClick={clearSport}>
            Clear
          </Button>
        </form>
      </Card>

      <Card hover={false}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black">Ranking Table</h2>
            <p className="text-sm text-gray-400">
              Live athlete ranking from backend performance data.
            </p>
          </div>

          <Badge>{board.length} athletes</Badge>
        </div>

        {isLoading ? (
          <SkeletonTable rows={8} />
        ) : board.length > 0 ? (
          <div className="mobile-scroll">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-primary/20 text-xs uppercase tracking-wider text-gray-500">
                  <th className="px-4 py-4">Rank</th>
                  <th className="px-4 py-4">Sport</th>
                  <th className="px-4 py-4">State</th>
                  <th className="px-4 py-4">Level</th>
                  <th className="px-4 py-4">Age</th>
                  <th className="px-4 py-4">Sessions</th>
                  <th className="px-4 py-4">Avg Performance</th>
                  <th className="px-4 py-4">Score</th>
                </tr>
              </thead>

              <tbody>
                {board.map((athlete, index) => (
                  <tr
                    key={`${athlete.user_id}-${index}`}
                    className="border-b border-white/5 transition hover:bg-primary/5"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-black">
                          {getRankIcon(index)}
                        </span>
                        {index < 3 && <Medal className="h-5 w-5 text-warning" />}
                      </div>
                    </td>

                    <td className="px-4 py-4 font-semibold text-white">
                      {athlete.sport || '—'}
                    </td>

                    <td className="px-4 py-4 text-gray-400">
                      {athlete.state || '—'}
                    </td>

                    <td className="px-4 py-4">
                      <Badge variant={getLevelVariant(athlete.level)}>
                        {athlete.level || 'Unknown'}
                      </Badge>
                    </td>

                    <td className="px-4 py-4 text-gray-400">
                      {athlete.age || '—'}
                    </td>

                    <td className="px-4 py-4 text-gray-300">
                      {athlete.training_sessions}
                    </td>

                    <td className="px-4 py-4 text-gray-300">
                      {athlete.average_performance}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <div className="w-32">
                          <div className="mb-1 flex justify-between text-xs text-gray-400">
                            <span>Score</span>
                            <span>{athlete.leaderboard_score}</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-surface">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                              style={{
                                width: `${Math.min(
                                  athlete.leaderboard_score || 0,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex h-72 flex-col items-center justify-center text-center">
            <Trophy className="mb-4 h-14 w-14 text-primary" />
            <h2 className="text-2xl font-black">No leaderboard data</h2>
            <p className="mt-2 max-w-md text-gray-400">
              Create athlete profiles and add training logs to populate leaderboard ranking.
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}