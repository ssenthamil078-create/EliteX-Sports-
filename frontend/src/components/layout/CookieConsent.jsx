import { useState } from 'react'
import toast from 'react-hot-toast'
import { Cookie, Settings } from 'lucide-react'
import { legalAPI } from '@/api'
import { useAuthStore } from '@/store/authStore'
import { Button, Card } from '@/components/ui'

export default function CookieConsent() {
  const userId = useAuthStore((s) => s.getUserId())
  const [show, setShow] = useState(() => {
    return localStorage.getItem('cookie-consent-saved') !== 'true'
  })

  const [analytics, setAnalytics] = useState(false)
  const [preferences, setPreferences] = useState(true)

  if (!show) return null

  const saveConsent = async (acceptAll = false) => {
    const payload = {
      user_id: userId,
      analytics_cookies: acceptAll ? true : analytics,
      preference_cookies: acceptAll ? true : preferences,
    }

    try {
      if (userId) {
        await legalAPI.saveCookieConsent(payload)
      }

      localStorage.setItem('cookie-consent-saved', 'true')
      toast.success('Cookie preferences saved')
      setShow(false)
    } catch {
      toast.error('Failed to save cookies')
    }
  }

  return (
    <div className="fixed bottom-5 left-5 right-5 z-[999] mx-auto max-w-4xl">
      <Card hover={false} className="border-primary/40">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-4">
            <div className="rounded-2xl bg-primary/20 p-3 text-primary">
              <Cookie className="h-7 w-7" />
            </div>

            <div>
              <h2 className="text-xl font-black text-white">
                Cookie Preferences
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                We use essential cookies for login and security. You can also allow
                analytics and preference cookies to improve your experience.
              </p>

              <div className="mt-4 space-y-3">
                <label className="flex items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-background/40 p-3">
                  <span className="text-sm text-gray-300">Analytics Cookies</span>
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="h-5 w-5 accent-primary"
                  />
                </label>

                <label className="flex items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-background/40 p-3">
                  <span className="text-sm text-gray-300">Preference Cookies</span>
                  <input
                    type="checkbox"
                    checked={preferences}
                    onChange={(e) => setPreferences(e.target.checked)}
                    className="h-5 w-5 accent-primary"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex min-w-[180px] flex-col gap-3">
            <Button onClick={() => saveConsent(true)}>
              Accept All
            </Button>

            <Button variant="secondary" onClick={() => saveConsent(false)}>
              <Settings className="h-4 w-4" />
              Save Choice
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}