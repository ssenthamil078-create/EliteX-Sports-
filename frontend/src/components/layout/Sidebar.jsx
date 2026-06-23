import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity,
  Award,
  Bell,
  Brain,
  ClipboardList,
  Dumbbell,
  FileText,
  History,
  Home,
  LogOut,
  Server,
  Settings,
  ShieldCheck,
  Sparkles,
  Trophy,
  User,
  Users,
  UserSearch,
  Video,
  X,
} from 'lucide-react'

import { useAuthStore } from '@/store/authStore'
import AppLogo from '@/components/ui/AppLogo'

const commonLinks = []


const athleteLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/competitions', label: 'Opportunities', icon: Trophy },

  { to: '/profile', label: 'Athlete Profile', icon: User },
  { to: '/portfolio', label: 'Athlete Portfolio', icon: FileText },
  { to: '/certificates', label: 'Certificates', icon: Award },

  { to: '/analytics', label: 'Analysis', icon: Activity },
  { to: '/pose-analysis', label: 'Pose Analysis', icon: Video },
  { to: '/training-log', label: 'Training Log', icon: Dumbbell },
  { to: '/training-history', label: 'Training History', icon: History },

  { to: '/recommendations', label: 'AI Recommendation', icon: Sparkles },
  { to: '/ai-hub', label: 'AI Hub', icon: Brain },
  { to: '/mentorship', label: 'Mentorship', icon: Users },

  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { to: '/legal', label: 'Legal Center', icon: FileText },
  { to: '/settings', label: 'Settings', icon: Settings },
]

const coachLinks = [
  { to: '/coach-plans', label: 'Coach Plans', icon: ClipboardList },
  { to: '/scout-sponsor', label: 'Athlete Discovery', icon: UserSearch },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { to: '/ai-chat', label: 'AI Coach Chat', icon: Brain },
]

const scoutLinks = [
  { to: '/scout-sponsor', label: 'Scout Discovery', icon: UserSearch },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { to: '/ai-hub', label: 'AI Hub', icon: Brain },
]

const adminLinks = [
  { to: '/admin', label: 'Admin Panel', icon: ShieldCheck, danger: true },
  { to: '/project-status', label: 'Project Status', icon: Server },
  { to: '/scout-sponsor', label: 'Scout & Sponsor', icon: UserSearch },
  { to: '/coach-plans', label: 'Coach Plans', icon: ClipboardList },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { to: '/admin/opportunities', label: 'Manage Opportunities', icon: Trophy, danger: true },
]

function getRoleLinks(role) {
  if (role === 'admin') {
    return [
      ...commonLinks,
      ...adminLinks,
      ...athleteLinks,
      ...coachLinks,
      ...scoutLinks,
    ]
  }

  if (role === 'coach') {
    return [...commonLinks, ...coachLinks]
  }

  if (role === 'scout') {
    return [...commonLinks, ...scoutLinks]
  }

  return [...commonLinks, ...athleteLinks]
}

function SidebarLink({ to, label, icon: Icon, danger = false, onClick }) {
  return (
    <NavLink to={to} onClick={onClick}>
      {({ isActive }) => (
        <motion.div
          whileHover={{ x: 5, scale: 1.01 }}
          className={[
            'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all',
            isActive
              ? danger
                ? 'bg-danger/20 text-white shadow-neon border border-danger/30'
                : 'bg-primary/20 text-white shadow-neon border border-primary/30'
              : danger
              ? 'text-red-300 hover:bg-danger/10 hover:text-white'
              : 'text-gray-400 hover:bg-white/5 hover:text-white',
          ].join(' ')}
        >
          <Icon className="h-5 w-5" />
          {label}
        </motion.div>
      )}
    </NavLink>
  )
}

function SidebarContent({ onClose }) {
  const logout = useAuthStore((state) => state.logout)
  const role = useAuthStore((state) => state.getRole())

  const links = getRoleLinks(role)

  const uniqueLinks = links.filter(
    (link, index, self) =>
      index === self.findIndex((item) => item.to === link.to)
  )

  const handleLogout = () => {
    logout()
    if (onClose) onClose()
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between gap-3">
        <AppLogo small />

        {onClose && (
          <button
            onClick={onClose}
            className="rounded-2xl border border-primary/20 bg-background/50 p-2 text-gray-300 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="mb-5 rounded-2xl border border-primary/20 bg-background/40 px-4 py-3">
        <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
          Current Mode
        </p>
        <p className="mt-1 text-sm font-bold text-primary">
          {role ? role.toUpperCase() : 'ATHLETE'}
        </p>
      </div>

      <nav className="space-y-2">
        {uniqueLinks.map((item) => (
          <SidebarLink key={item.to} {...item} onClick={onClose} />
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-8 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-400 transition-all hover:bg-danger/10 hover:text-red-300"
      >
        <LogOut className="h-5 w-5" />
        Logout
      </button>
    </>
  )
}

export default function Sidebar({ mobileOpen = false, onClose }) {
  return (
    <>
      <aside className="fixed left-0 top-0 hidden h-screen w-80 overflow-y-auto border-r border-primary/15 bg-surface/60 p-5 backdrop-blur-xl lg:block">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            <motion.aside
              className="fixed left-0 top-0 z-50 h-screen w-[86vw] max-w-sm overflow-y-auto border-r border-primary/15 bg-surface/95 p-5 backdrop-blur-xl lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
            >
              <SidebarContent onClose={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}