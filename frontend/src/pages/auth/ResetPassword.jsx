import { useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { LockKeyhole } from 'lucide-react'

import { authAPI } from '@/api'
import { Button, Card, Input } from '@/components/ui'

export default function ResetPassword() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    token: params.get('token') || '',
    new_password: '',
  })

  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await authAPI.resetPassword(form)
      toast.success('Password reset successfully')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background bg-sports-glow p-6 sports-grid">
      <Card className="w-full max-w-md" hover={false}>
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/20 text-primary">
            <LockKeyhole className="h-8 w-8" />
          </div>

          <h1 className="text-3xl font-black">Reset Password</h1>
          <p className="mt-2 text-sm text-gray-400">
            Enter reset token and your new password.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Input
            label="Reset Token"
            value={form.token}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, token: e.target.value }))
            }
            required
          />

          <Input
            label="New Password"
            type="password"
            value={form.new_password}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, new_password: e.target.value }))
            }
            required
          />

          <Button className="w-full" loading={loading}>
            Reset Password
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Remember password?{' '}
          <Link to="/login" className="text-primary hover:text-accent">
            Login
          </Link>
        </p>
      </Card>
    </div>
  )
}