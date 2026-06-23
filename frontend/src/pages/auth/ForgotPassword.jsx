import { useState } from 'react'
import toast from 'react-hot-toast'
import { authAPI } from '@/api'
import { Button, Card, Input } from '@/components/ui'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authAPI.forgotPassword({ email })
      toast.success(res.data.message || 'Reset link sent if account exists')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background bg-sports-glow p-6 sports-grid">
      <Card className="w-full max-w-md" hover={false}>
        <h1 className="mb-2 text-3xl font-black">Forgot password</h1>
        <p className="mb-8 text-gray-400">Enter your email to receive reset instructions.</p>

        <form onSubmit={submit} className="space-y-4">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Button className="w-full" loading={loading}>Send reset link</Button>
        </form>
      </Card>
    </div>
  )
}
