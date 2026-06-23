import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (loginResponse) => {
        const userData = {
          id: loginResponse.user_id || loginResponse.id,
          user_id: loginResponse.user_id || loginResponse.id,
          name: loginResponse.name,
          email: loginResponse.email,
          role: loginResponse.role,
        }

        const token = loginResponse.token || loginResponse.access_token

        localStorage.setItem('token', token)

        set({
          user: userData,
          token,
          isAuthenticated: true,
        })
      },

      logout: () => {
        localStorage.removeItem('token')
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },

      updateUser: (updates) =>
        set((state) => ({
          user: {
            ...state.user,
            ...updates,
          },
        })),

      getRole: () => get().user?.role || null,

      getUserId: () =>
        get().user?.user_id ||
        get().user?.id ||
        null,

      getUserEmail: () => get().user?.email || null,
    }),
    {
      name: 'ai-sports-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
