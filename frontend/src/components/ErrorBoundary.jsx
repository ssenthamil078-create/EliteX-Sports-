import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button, Card } from '@/components/ui'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error, info) {
    console.error('Frontend Error:', error, info)
  }

  reset = () => {
    this.setState({
      hasError: false,
      error: null,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background bg-sports-glow p-6 text-white sports-grid">
          <Card hover={false} className="max-w-xl text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-danger/20 text-danger">
              <AlertTriangle className="h-10 w-10" />
            </div>

            <h1 className="text-3xl font-black">
              Something went wrong
            </h1>

            <p className="mt-3 text-gray-400">
              A frontend error occurred. You can refresh or go back to dashboard.
            </p>

            {this.state.error?.message && (
              <pre className="mt-5 overflow-x-auto rounded-2xl border border-danger/30 bg-danger/10 p-4 text-left text-sm text-red-100">
                {this.state.error.message}
              </pre>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4" />
                Reload
              </Button>

              <Button
                variant="secondary"
                onClick={() => {
                  window.location.href = '/dashboard'
                }}
              >
                Dashboard
              </Button>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}