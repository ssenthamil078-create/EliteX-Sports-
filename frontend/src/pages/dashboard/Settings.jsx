import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  Settings as SettingsIcon,
  UserRound,
  Lock,
  Cookie,
  Trash2,
  Save,
} from 'lucide-react'

import { authAPI, legalAPI } from '@/api'
import { useAuthStore } from '@/store/authStore'
import { Card, PageHeader, Button, Input, Badge } from '@/components/ui'

export default function Settings() {
  const user = useAuthStore((s) => s.user)
  const userId = useAuthStore((s) => s.getUserId())
  const updateUser = useAuthStore((s) => s.updateUser)
  const logout = useAuthStore((s) => s.logout)

  const [profileName, setProfileName] = useState(user?.name || '')

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
  })

  const [cookies, setCookies] = useState({
    analytics_cookies: false,
    preference_cookies: true,
  })

  const updateProfileMutation = useMutation({
    mutationFn: (payload) => authAPI.updateProfile(payload),
    onSuccess: (res) => {
      toast.success('Profile updated')
      updateUser({ name: res.data.name || profileName })
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || 'Profile update failed')
    },
  })

  const changePasswordMutation = useMutation({
    mutationFn: (payload) => authAPI.changePassword(payload),
    onSuccess: () => {
      toast.success('Password changed successfully')
      setPasswordForm({
        current_password: '',
        new_password: '',
      })
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || 'Password change failed')
    },
  })

  const cookieMutation = useMutation({
    mutationFn: (payload) => legalAPI.saveCookieConsent(payload),
    onSuccess: () => {
      toast.success('Cookie preferences saved')
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || 'Cookie save failed')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => authAPI.deleteAccount(),
    onSuccess: () => {
      toast.success('Account deleted')
      logout()
      window.location.href = '/login'
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || 'Account deletion failed')
    },
  })

  const submitProfile = (e) => {
    e.preventDefault()

    updateProfileMutation.mutate({
      name: profileName,
    })
  }

  const submitPassword = (e) => {
    e.preventDefault()

    changePasswordMutation.mutate(passwordForm)
  }

  const saveCookies = () => {
    cookieMutation.mutate({
      user_id: userId,
      analytics_cookies: cookies.analytics_cookies,
      preference_cookies: cookies.preference_cookies,
    })
  }

  const deleteAccount = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    )

    if (confirmed) {
      deleteMutation.mutate()
    }
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Manage your account, security, privacy and app preferences."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card hover={false}>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-primary/20 p-3 text-primary">
              <UserRound className="h-7 w-7" />
            </div>

            <div>
              <h2 className="text-2xl font-black">Profile Settings</h2>
              <p className="text-sm text-gray-400">
                Update your display name.
              </p>
            </div>
          </div>

          <form onSubmit={submitProfile} className="space-y-4">
            <Input
              label="Name"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              required
            />

            <Input
              label="Email"
              value={user?.email || ''}
              disabled
            />

            <Input
              label="Role"
              value={user?.role || ''}
              disabled
            />

            <Button loading={updateProfileMutation.isPending}>
              <Save className="h-4 w-4" />
              Save Profile
            </Button>
          </form>
        </Card>

        <Card hover={false}>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-warning/20 p-3 text-warning">
              <Lock className="h-7 w-7" />
            </div>

            <div>
              <h2 className="text-2xl font-black">Change Password</h2>
              <p className="text-sm text-gray-400">
                Use a strong password for better security.
              </p>
            </div>
          </div>

          <form onSubmit={submitPassword} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={passwordForm.current_password}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  current_password: e.target.value,
                }))
              }
              required
            />

            <Input
              label="New Password"
              type="password"
              value={passwordForm.new_password}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  new_password: e.target.value,
                }))
              }
              required
            />

            <Button loading={changePasswordMutation.isPending}>
              <Lock className="h-4 w-4" />
              Change Password
            </Button>
          </form>
        </Card>

        <Card hover={false}>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-success/20 p-3 text-success">
              <Cookie className="h-7 w-7" />
            </div>

            <div>
              <h2 className="text-2xl font-black">Cookie Preferences</h2>
              <p className="text-sm text-gray-400">
                Manage analytics and preference cookies.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between rounded-2xl border border-primary/20 bg-background/40 p-4">
              <div>
                <p className="font-bold text-white">Essential Cookies</p>
                <p className="text-sm text-gray-400">
                  Required for login and security.
                </p>
              </div>

              <Badge variant="success">Always On</Badge>
            </label>

            <label className="flex items-center justify-between rounded-2xl border border-primary/20 bg-background/40 p-4">
              <div>
                <p className="font-bold text-white">Analytics Cookies</p>
                <p className="text-sm text-gray-400">
                  Help improve platform performance.
                </p>
              </div>

              <input
                type="checkbox"
                checked={cookies.analytics_cookies}
                onChange={(e) =>
                  setCookies((prev) => ({
                    ...prev,
                    analytics_cookies: e.target.checked,
                  }))
                }
                className="h-5 w-5 accent-primary"
              />
            </label>

            <label className="flex items-center justify-between rounded-2xl border border-primary/20 bg-background/40 p-4">
              <div>
                <p className="font-bold text-white">Preference Cookies</p>
                <p className="text-sm text-gray-400">
                  Remember language and display preferences.
                </p>
              </div>

              <input
                type="checkbox"
                checked={cookies.preference_cookies}
                onChange={(e) =>
                  setCookies((prev) => ({
                    ...prev,
                    preference_cookies: e.target.checked,
                  }))
                }
                className="h-5 w-5 accent-primary"
              />
            </label>

            <Button onClick={saveCookies} loading={cookieMutation.isPending}>
              <Cookie className="h-4 w-4" />
              Save Cookies
            </Button>
          </div>
        </Card>

        <Card hover={false}>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-danger/20 p-3 text-danger">
              <Trash2 className="h-7 w-7" />
            </div>

            <div>
              <h2 className="text-2xl font-black">Danger Zone</h2>
              <p className="text-sm text-gray-400">
                Permanently delete your account.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-danger/30 bg-danger/10 p-5">
            <p className="text-sm leading-7 text-red-100/80">
              Deleting your account removes your profile and associated data.
              This action cannot be undone.
            </p>

            <Button
              variant="danger"
              className="mt-5"
              onClick={deleteAccount}
              loading={deleteMutation.isPending}
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}