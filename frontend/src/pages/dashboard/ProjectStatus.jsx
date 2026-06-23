import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  Server,
  Database,
  Brain,
  Send,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react'

import { projectAPI, smartNotificationAPI } from '@/api/sportsAPI'
import { useAuthStore } from '@/store/authStore'
import { Card, PageHeader, Button, Badge, Input } from '@/components/ui'

export default function ProjectStatus() {
  const userId = useAuthStore((s) => s.getUserId())
  const [context, setContext] = useState('Notify me about my sports progress and training consistency.')

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['project-status'],
    queryFn: () => projectAPI.status().then((res) => res.data),
  })

  const smartMutation = useMutation({
    mutationFn: (payload) => smartNotificationAPI.create(payload),
    onSuccess: () => toast.success('AI smart notification created'),
    onError: (err) =>
      toast.error(err.response?.data?.detail || 'Failed to create notification'),
  })

  const sendSmartNotification = () => {
    smartMutation.mutate({
      user_id: userId,
      notification_context: context,
    })
  }

  return (
    <div>
      <PageHeader
        title="Project Status"
        subtitle="Monitor backend health, database counts, and generate AI smart notifications."
        action={
          <Button onClick={() => refetch()} loading={isFetching}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        }
      />

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card hover={false}>
          <Server className="mb-4 h-8 w-8 text-primary" />
          <p className="text-sm text-gray-400">Backend</p>
          <h2 className="mt-2 text-2xl font-black">
            {data?.backend_status || 'Checking'}
          </h2>
        </Card>

        <Card hover={false}>
          <Database className="mb-4 h-8 w-8 text-success" />
          <p className="text-sm text-gray-400">Database</p>
          <h2 className="mt-2 text-xl font-black">
            {data?.database || 'Unknown'}
          </h2>
        </Card>

        <Card hover={false}>
          <Brain className="mb-4 h-8 w-8 text-warning" />
          <p className="text-sm text-gray-400">AI Provider</p>
          <h2 className="mt-2 text-2xl font-black">
            {data?.ai_provider || 'Unknown'}
          </h2>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <Card hover={false}>
          <h2 className="mb-5 text-2xl font-black">Completed Modules</h2>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-2xl bg-surface/70" />
              ))}
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {data?.completed_modules?.map((module) => (
                <div
                  key={module}
                  className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-background/40 p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  <span className="text-sm text-gray-300">{module}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <Card hover={false}>
            <h2 className="mb-5 text-2xl font-black">Database Counts</h2>

            <div className="space-y-3">
              {Object.entries(data?.database_counts || {}).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-2xl border border-primary/20 bg-background/40 p-4"
                >
                  <span className="capitalize text-gray-400">
                    {key.replaceAll('_', ' ')}
                  </span>
                  <Badge>{value}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card hover={false}>
            <h2 className="mb-4 text-2xl font-black">AI Smart Notification</h2>

            <div className="space-y-4">
              <Input
                label="Notification Context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />

              <Button
                className="w-full"
                onClick={sendSmartNotification}
                loading={smartMutation.isPending}
              >
                <Send className="h-4 w-4" />
                Generate Notification
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}