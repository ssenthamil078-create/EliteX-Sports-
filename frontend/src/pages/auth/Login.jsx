import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  Eye,
  EyeOff,
  Activity,
  Dumbbell,
  Trophy,
  Zap,
} from 'lucide-react'

import { authAPI } from '@/api'
import { useAuthStore } from '@/store/authStore'
import { Button, Card, Input, Badge } from '@/components/ui'
import AppLogo from '@/components/ui/AppLogo'

export default function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const [showPassword, setShowPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!acceptedTerms) {
      toast.error('Please accept Terms, Privacy Policy and Sports AI Disclaimer')
      return
    }

    setLoading(true)

    try {
      const response = await authAPI.login(form)
      login(response.data)

      toast.success('Login successful')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="elitex-3d-bg relative min-h-screen overflow-hidden text-white sports-grid">
  <div className="elitex-3d-content"></div>
      <div className="absolute inset-0 bg-sports-glow" />

      <motion.div
        animate={{ y: [0, -18, 0], rotate: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
        className="absolute left-10 top-20 hidden h-28 w-28 items-center justify-center rounded-[2rem] border border-primary/30 bg-primary/10 shadow-neon backdrop-blur-xl lg:flex"
      >
        <Trophy className="h-12 w-12 text-warning" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 7 }}
        className="absolute bottom-24 left-32 hidden h-24 w-24 items-center justify-center rounded-[2rem] border border-accent/30 bg-accent/10 shadow-neon backdrop-blur-xl lg:flex"
      >
        <Dumbbell className="h-10 w-10 text-accent" />
      </motion.div>

      <motion.div
        animate={{ y: [0, -22, 0], rotate: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
        className="absolute right-16 top-28 hidden h-24 w-24 items-center justify-center rounded-[2rem] border border-success/30 bg-success/10 shadow-neon backdrop-blur-xl lg:flex"
      >
        <Activity className="h-10 w-10 text-success" />
      </motion.div>

      <div className="relative mx-auto grid min-h-screen max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[1fr_460px] lg:items-center">
        <motion.section
          initial={{ opacity: 0, x: -35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="hidden lg:block"
        >
          <Badge>
            <Zap className="mr-2 h-3 w-3" />
            AI Sports Performance Platform
          </Badge>

          <h1 className="mt-8 text-6xl font-black leading-tight">
            Your sports journey
            <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              starts with data.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
            Track training sessions, understand your performance, discover
            competitions, reduce injury risk, and unlock AI-powered athlete
            guidance.
          </p>

          <div className="mt-10 grid max-w-xl gap-4 sm:grid-cols-3">
            {[
              ['Performance', '92%'],
              ['AI Readiness', '98%'],
              ['Opportunity Match', '87%'],
            ].map(([label, value]) => (
              <Card key={label} hover={false} className="p-5">
                <p className="text-sm text-gray-400">{label}</p>
                <h3 className="mt-2 text-3xl font-black">{value}</h3>
              </Card>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 35, rotateX: -8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Card hover={false} className="relative overflow-hidden">
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/25 blur-3xl" />

            <div className="relative">
              <div className="mb-8 flex justify-center">
                <AppLogo />
              </div>

              <div className="mb-8 text-center">
                <h2 className="text-4xl font-black">
                  Enter the Arena
                </h2>
                <p className="mt-3 text-gray-400">
                  Login to access your athlete command center.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Email"
                  type="email"
                  placeholder="athlete@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  required
                />

                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={form.password}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-[42px] text-gray-500 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-400">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-primary"
                    />
                    Remember me
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-primary hover:text-accent"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <label className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-background/40 p-4 text-sm text-gray-400">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 accent-primary"
                  />

                  <span>
                    I agree to the Terms & Conditions, Privacy Policy and
                    Sports AI Disclaimer.
                  </span>
                </label>

                <Button type="submit" className="w-full" loading={loading}>
                  Login to Dashboard
                </Button>
              </form>

              <p className="mt-8 text-center text-sm text-gray-400">
                New athlete here?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-primary hover:text-accent"
                >
                  Create account
                </Link>
              </p>
            </div>
          </Card>
        </motion.section>
      </div>
    </div>
  )
}