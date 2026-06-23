import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  Users,
  Handshake,
  Send,
  Trophy,
  MapPin,
  Languages,
  RefreshCw,
} from 'lucide-react'

import { mentorshipAPI } from '@/api/sportsAPI'
import { useAuthStore } from '@/store/authStore'
import { Card, PageHeader, Button, Badge } from '@/components/ui'

export default function Mentorship() {
  const userId = useAuthStore((s) => s.getUserId())
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [message, setMessage] = useState('')

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['mentorship-matches', userId],
    queryFn: () => mentorshipAPI.getMatches(userId).then((res) => res.data),
    enabled: !!userId,
    retry: false,
  })

  const requestMutation = useMutation({
    mutationFn: (payload) => mentorshipAPI.sendRequest(payload),
    onSuccess: () => {
      toast.success('Mentorship request sent')
      setSelectedMentor(null)
      setMessage('')
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || 'Failed to send request')
    },
  })

  const matches = data?.matches || []

  const sendRequest = () => {
    if (!selectedMentor) return

    requestMutation.mutate({
      mentee_user_id: userId,
      mentor_user_id: selectedMentor.mentor_user_id,
      message,
    })
  }

  return (
    <div>
      <PageHeader
        title="Peer Mentorship"
        subtitle="Find athletes who can guide you based on sport, level, state, language, and achievements."
        action={
          <Button onClick={() => refetch()} loading={isFetching}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        }
      />

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card hover={false}>
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-primary/20 p-3 text-primary">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Matches</p>
              <h2 className="text-3xl font-black">
                {data?.total_matches ?? 0}
              </h2>
            </div>
          </div>
        </Card>

        <Card hover={false}>
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-success/20 p-3 text-success">
              <Handshake className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Mentorship Mode</p>
              <h2 className="text-2xl font-black">Peer Match</h2>
            </div>
          </div>
        </Card>

        <Card hover={false}>
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-warning/20 p-3 text-warning">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Best Match</p>
              <h2 className="text-3xl font-black">
                {matches[0]?.match_score ?? '—'}%
              </h2>
            </div>
          </div>
        </Card>
      </div>

      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-72 animate-pulse rounded-3xl bg-surface/70" />
          ))}
        </div>
      ) : matches.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {matches.map((mentor) => (
            <Card key={mentor.mentor_user_id}>
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-black text-white">
                    {mentor.sport || 'Athlete Mentor'}
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">
                    {mentor.level || 'Level not specified'}
                  </p>
                </div>

                <Badge variant={mentor.match_score >= 70 ? 'success' : 'primary'}>
                  {mentor.match_score}% Match
                </Badge>
              </div>

              <div className="space-y-3 text-sm text-gray-400">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  {mentor.state || 'State not available'}
                </p>

                <p className="flex items-center gap-2">
                  <Languages className="h-4 w-4 text-primary" />
                  {mentor.language || 'Language not available'}
                </p>

                <p className="line-clamp-3">
                  Achievements: {mentor.achievements || 'No achievements listed'}
                </p>
              </div>

              <Button
                className="mt-6 w-full"
                onClick={() => setSelectedMentor(mentor)}
              >
                <Handshake className="h-4 w-4" />
                Request Mentorship
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <Card hover={false}>
          <div className="flex h-72 flex-col items-center justify-center text-center">
            <Users className="mb-4 h-14 w-14 text-primary" />
            <h2 className="text-2xl font-black">No mentor matches</h2>
            <p className="mt-2 max-w-md text-gray-400">
              Create your athlete profile first. More matches appear when other athletes are available.
            </p>
          </div>
        </Card>
      )}

      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <Card hover={false} className="w-full max-w-lg">
            <h2 className="text-2xl font-black">Send Mentorship Request</h2>

            <p className="mt-2 text-sm text-gray-400">
              Request mentorship from {selectedMentor.sport} athlete.
            </p>

            <div className="mt-5 rounded-2xl border border-primary/20 bg-background/50 p-4">
              <p className="font-bold text-white">{selectedMentor.level}</p>
              <p className="text-sm text-gray-400">{selectedMentor.state}</p>
              <Badge className="mt-3">{selectedMentor.match_score}% Match</Badge>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm text-gray-300">
                Message
              </label>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="input-field resize-none"
                placeholder="Introduce yourself and explain why you want mentorship..."
              />
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                className="flex-1"
                onClick={sendRequest}
                loading={requestMutation.isPending}
              >
                <Send className="h-4 w-4" />
                Send Request
              </Button>

              <Button
                className="flex-1"
                variant="secondary"
                onClick={() => setSelectedMentor(null)}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}