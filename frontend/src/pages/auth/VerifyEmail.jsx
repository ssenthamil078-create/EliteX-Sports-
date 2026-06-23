import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, MailCheck, XCircle } from 'lucide-react'

import { authAPI } from '@/api'
import { Button, Card } from '@/components/ui'

export default function VerifyEmail() {
  const { token } = useParams()

  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('Verifying your email...')

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await authAPI.verifyEmail(token)
        setStatus('success')
        setMessage(res.data.message || 'Email verified successfully.')
      } catch (err) {
        setStatus('error')
        setMessage(err.response?.data?.detail || 'Email verification failed.')
      }
    }

    if (token) verify()
  }, [token])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background bg-sports-glow p-6 sports-grid">
      <Card className="w-full max-w-md text-center" hover={false}>
        {status === 'loading' && (
          <>
            <div className="mx-auto mb-5 flex h-16 w-16 animate-pulse items-center justify-center rounded-3xl bg-primary/20 text-primary">
              <MailCheck className="h-8 w-8" />
            </div>

            <h1 className="text-3xl font-black">Verifying Email</h1>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-success/20 text-success">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <h1 className="text-3xl font-black">Email Verified</h1>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-danger/20 text-danger">
              <XCircle className="h-8 w-8" />
            </div>

            <h1 className="text-3xl font-black">Verification Failed</h1>
          </>
        )}

        <p className="mt-3 text-gray-400">{message}</p>

        <div className="mt-8">
          <Link to="/login">
            <Button className="w-full">
              Go to Login
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}