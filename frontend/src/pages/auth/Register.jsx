import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authAPI } from '@/api'
import { Button, Card, Input } from '@/components/ui'

export default function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'athlete',
  })

  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!acceptedTerms) {
      toast.error('Please accept Terms and Privacy Policy')
      return
    }

    setLoading(true)

    try {
      await authAPI.register(form)
      toast.success('Account created. Please login.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background bg-sports-glow p-6 sports-grid">
      <Card className="w-full max-w-lg" hover={false}>
        <h1 className="mb-2 text-3xl font-black">Create your account</h1>
        <p className="mb-8 text-gray-400">
          Join the AI sports performance platform.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-300">
              Role
            </span>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="input-field"
            >
              <option value="athlete">Athlete</option>
              <option value="coach">Coach</option>
              <option value="scout">Scout</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <label className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-background/40 p-4 text-sm text-gray-400">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 h-4 w-4 accent-primary"
            />

            <span>
              I agree to the{' '}
              <a href="/legal/terms" className="text-primary hover:text-accent">
                Terms & Conditions
              </a>
              ,{' '}
              <a href="/legal/privacy" className="text-primary hover:text-accent">
                Privacy Policy
              </a>{' '}
              and{' '}
              <a href="/legal/disclaimer" className="text-primary hover:text-accent">
                Disclaimer
              </a>
              .
            </span>
          </label>

          <Button className="w-full" loading={loading}>
            Register
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-accent">
            Login
          </Link>
        </p>
      </Card>
    </div>
  )
}