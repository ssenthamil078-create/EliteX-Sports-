import AppRoutes from '@/routes/AppRoutes'
import CookieConsent from '@/components/layout/CookieConsent'
import useSessionTimeout from '@/hooks/useSessionTimeout'
import ErrorBoundary from '@/components/ErrorBoundary'

export default function App() {
  useSessionTimeout()

  return (
    <ErrorBoundary>
      <AppRoutes />
      <CookieConsent />
    </ErrorBoundary>
  )
}