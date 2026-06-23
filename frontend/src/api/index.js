import axios from 'axios'
import toast from 'react-hot-toast'

// Reads from VITE_API_BASE_URL env var; falls back to localhost for local dev
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('ai-sports-auth')
  let token = null

  try {
    token = JSON.parse(raw)?.state?.token
  } catch {
    token = localStorage.getItem('token')
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      'Request failed'

    toast.error(String(message))
    return Promise.reject(error)
  }
)

export default api

export const authAPI = {
  register: (payload) => api.post('/register', payload),
  login: (payload) => api.post('/login', payload),
  forgotPassword: (payload) => api.post('/auth/forgot-password', payload),
  resetPassword: (payload) => api.post('/auth/reset-password', payload),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  changePassword: (payload) => api.post('/auth/change-password', payload),
  updateProfile: (payload) => api.patch('/auth/update-profile', payload),
  deleteAccount: () => api.delete('/auth/delete-account'),
}

export const legalAPI = {
  terms: () => api.get('/legal/terms-and-conditions'),
  privacy: () => api.get('/legal/privacy-policy'),
  cookies: () => api.get('/legal/cookie-policy'),
  disclaimer: () => api.get('/legal/disclaimer'),
  saveCookieConsent: (payload) => api.post('/legal/cookie-consent', payload),
}

export const healthAPI = {
  home: () => api.get('/docs'),
  projectStatus: () => api.get('/project/status'),
}
