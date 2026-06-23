import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, Search, UserCircle, X } from 'lucide-react'

import { useAuthStore } from '@/store/authStore'
import Badge from '@/components/ui/Badge'

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/notifications': 'Notifications',
  '/competitions': 'Opportunities',
  '/profile': 'Athlete Profile',
  '/portfolio': 'Athlete Portfolio',
  '/certificates': 'Certificates',
  '/analytics': 'Analysis',
  '/pose-analysis': 'Pose Analysis',
  '/training-log': 'Training Log',
  '/training-history': 'Training History',
  '/recommendations': 'AI Recommendations',
  '/ai-hub': 'AI Hub',
  '/mentorship': 'Mentorship',
  '/leaderboard': 'Leaderboard',
  '/legal': 'Legal Center',
  '/settings': 'Settings',
  '/admin': 'Admin Panel',
  '/admin/opportunities': 'Manage Opportunities',
}

const searchablePages = [
  { title: 'Dashboard', path: '/dashboard', keywords: 'home overview stats readiness weekly summary' },
  { title: 'Notifications', path: '/notifications', keywords: 'alerts smart notification ai messages' },
  { title: 'Opportunities', path: '/competitions', keywords: 'competition scholarship scheme sponsor coach opportunity' },
  { title: 'Athlete Profile', path: '/profile', keywords: 'profile personal sport state level athlete' },
  { title: 'Athlete Portfolio', path: '/portfolio', keywords: 'portfolio sponsor pitch pdf qr public profile' },
  { title: 'Certificates', path: '/certificates', keywords: 'certificate upload verify achievement' },
  { title: 'Analysis', path: '/analytics', keywords: 'analytics performance chart score fatigue pain' },
  { title: 'Pose Analysis', path: '/pose-analysis', keywords: 'video biomechanics posture balance skeleton avatar' },
  { title: 'Training Log', path: '/training-log', keywords: 'add session workout intensity calories fatigue pain' },
  { title: 'Training History', path: '/training-history', keywords: 'history logs sessions timeline previous training' },
  { title: 'AI Recommendation', path: '/recommendations', keywords: 'recommend competition scholarship schemes ai' },
  { title: 'AI Hub', path: '/ai-hub', keywords: 'chat ai multilingual training plan' },
  { title: 'Mentorship', path: '/mentorship', keywords: 'mentor coach request guidance' },
  { title: 'Leaderboard', path: '/leaderboard', keywords: 'rank ranking top athletes score' },
  { title: 'Legal Center', path: '/legal', keywords: 'terms privacy cookie disclaimer legal' },
  { title: 'Settings', path: '/settings', keywords: 'account password delete profile settings' },
  { title: 'Admin Panel', path: '/admin', keywords: 'admin dashboard secure' },
  { title: 'Manage Opportunities', path: '/admin/opportunities', keywords: 'admin add edit delete competitions scholarships' },
]

export default function Topbar({ onMenuClick }) {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const role = useAuthStore((state) => state.getRole())

  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  const currentTitle = pageTitles[location.pathname] || 'EliteX'

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()

    if (!q) return []

    return searchablePages
      .filter((page) => {
        const haystack = `${page.title} ${page.keywords}`.toLowerCase()
        return haystack.includes(q)
      })
      .slice(0, 6)
  }, [query])

  const goToPage = (path) => {
    navigate(path)
    setQuery('')
    setFocused(false)
  }

  const submitSearch = (e) => {
    e.preventDefault()

    if (results[0]) {
      goToPage(results[0].path)
    }
  }

  return (
    <header className="sticky top-3 z-30 mb-5 rounded-3xl border border-primary/15 bg-surface/80 px-3 py-3 backdrop-blur-xl md:mb-8 md:px-5">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <button
          onClick={onMenuClick}
          className="flex shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-background/50 p-3 text-gray-300 hover:text-white lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-black text-white sm:text-2xl">
            {currentTitle}
          </h1>
          <p className="hidden text-sm text-gray-500 sm:block">
            EliteX Sports Intelligence
          </p>
        </div>

        <div className="relative hidden min-w-0 flex-1 xl:block">
          <form
            onSubmit={submitSearch}
            className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-background/50 px-4 py-3 text-gray-500"
          >
            <Search className="h-4 w-4 shrink-0" />

            <input
              value={query}
              onFocus={() => setFocused(true)}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search features, pages, opportunities..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-gray-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>

          {focused && query && (
            <div className="absolute left-0 right-0 top-14 z-50 rounded-3xl border border-primary/20 bg-surface/95 p-3 shadow-neon backdrop-blur-xl">
              {results.length > 0 ? (
                <div className="space-y-2">
                  {results.map((item) => (
                    <button
                      key={item.path}
                      onMouseDown={() => goToPage(item.path)}
                      className="w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold text-gray-300 transition hover:bg-primary/10 hover:text-white"
                    >
                      {item.title}
                      <span className="ml-2 text-xs text-gray-500">
                        {item.path}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="px-4 py-3 text-sm text-gray-500">
                  No matching page found.
                </p>
              )}
            </div>
          )}
        </div>

        <Link
          to="/profile"
          className="flex min-w-0 shrink-0 items-center gap-2 rounded-2xl border border-primary/20 bg-background/60 px-2 py-2 transition hover:border-primary/40 sm:px-3"
        >
          <UserCircle className="h-7 w-7 shrink-0 text-primary" />

          <div className="hidden min-w-0 sm:block">
            <p className="max-w-[130px] truncate text-sm font-semibold text-white md:max-w-[180px]">
              {user?.name || 'Athlete'}
            </p>

            <Badge variant="primary">
              {role || user?.role || 'user'}
            </Badge>
          </div>
        </Link>
      </div>
    </header>
  )
}