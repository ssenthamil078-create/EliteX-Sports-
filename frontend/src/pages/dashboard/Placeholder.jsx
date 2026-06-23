import { PageHeader, Card } from '@/components/ui'

export default function Placeholder({ title = 'Coming Soon', subtitle = 'This feature will be connected in the next phase.' }) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />
      <Card>
        <p className="text-gray-400">
          Phase 1 shell is ready. This module will be implemented in the next phase with real backend integration.
        </p>
      </Card>
    </div>
  )
}
