import { Link } from 'react-router-dom'
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react'
import { Button, Card } from '@/components/ui'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background bg-sports-glow p-6 text-white sports-grid">
      <Card hover={false} className="max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-danger/20 text-danger">
          <AlertTriangle className="h-10 w-10" />
        </div>

        <h1 className="text-6xl font-black">404</h1>

        <h2 className="mt-4 text-2xl font-black">
          Page Not Found
        </h2>

        <p className="mt-3 text-gray-400">
          The page you are looking for does not exist or may have been moved.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/dashboard">
            <Button>
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>

          <Button variant="secondary" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>
      </Card>
    </div>
  )
}