import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'

const TIMEOUT_MINUTES = 30
const TIMEOUT_MS = TIMEOUT_MINUTES * 60 * 1000

export default function useSessionTimeout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const logout = useAuthStore((s) => s.logout)

  useEffect(() => {
    if (!isAuthenticated) return

    let timer

    const resetTimer = () => {
      clearTimeout(timer)

      timer = setTimeout(() => {
        logout()
        toast.error('Session expired due to inactivity')
        window.location.href = '/login'
      }, TIMEOUT_MS)
    }

    const events = [
      'mousemove',
      'keydown',
      'click',
      'scroll',
      'touchstart',
    ]

    events.forEach((event) =>
      window.addEventListener(event, resetTimer)
    )

    resetTimer()

    return () => {
      clearTimeout(timer)

      events.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      )
    }
  }, [isAuthenticated, logout])
}