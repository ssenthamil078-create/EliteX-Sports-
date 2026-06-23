import api from './index'

export const athleteAPI = {
  createProfile: (payload) => api.post('/athlete/profile', payload),
  getProfile: (userId) => api.get(`/athlete/profile/${userId}`),
  getWeeklySummary: (userId) =>
  api.get(`/athlete/weekly-summary/${userId}`),
}

export const trainingAPI = {
  addLog: (payload) => api.post('/training/log', payload),
  getLogs: (userId) => api.get(`/training/history/${userId}`),
  getReadiness: (userId) =>
  api.get(`/athlete/readiness/${userId}`),
}

export const analyticsAPI = {
  performance: (userId) => api.get(`/analytics/performance/${userId}`),
  skillRating: (userId) => api.get(`/analytics/skill-rating/${userId}`),
  radar: (userId) => api.get(`/performance/radar/${userId}`),
  improvement: (userId) => api.get(`/performance/improvement/${userId}`),
  timeline: (userId) => api.get(`/performance/timeline/${userId}`),
}

export const insightAPI = {
  injuryRisk: (userId) => api.get(`/injury-risk/${userId}`),
  careerPath: (userId) => api.get(`/career-path/${userId}`),
}

export const aiAPI = {
  chat: (payload) => api.post('/ai/chat', payload),
  trainingPlan: (payload) => api.post('/ai/training-plan', payload),
  scoutInsight: (userId) => api.get(`/ai/scout-insight/${userId}`),
  smartNotification: (payload) => api.post('/ai/smart-notification', payload),
  performancePrediction: (userId) =>
    api.get(`/ai/performance-prediction/${userId}`),
  multilingualResponse: (payload) =>
    api.post('/ai/multilingual-response', payload),
}

export const leaderboardAPI = {
  getAll: () => api.get('/leaderboard'),
  getBySport: (sport) => api.get(`/leaderboard/${sport}`),
}

export const notificationAPI = {
  create: (payload) => api.post('/notifications/create', payload),
  getAll: (userId) => api.get(`/notifications/${userId}`),
  markRead: (id) => api.patch(`/notifications/read/${id}`),
  delete: (id) => api.delete(`/notifications/${id}`),
}

export const opportunityAPI = {
  feed: () => api.get('/opportunities/feed'),
  competitions: (userId) => api.get(`/recommendations/competitions/${userId}`),
  scholarships: (userId) => api.get(`/recommendations/scholarships/${userId}`),
  schemes: (userId) => api.get(`/recommendations/schemes/${userId}`),
}

export const mentorshipAPI = {
  getMatches: (userId) => api.get(`/mentorship/matches/${userId}`),
  sendRequest: (payload) => api.post('/mentorship/request', payload),
}

export const certificateAPI = {
  upload: (payload) => api.post('/certificates/upload', payload),
  getUserCertificates: (userId) => api.get(`/certificates/user/${userId}`),
  verify: (certificateId) => api.get(`/certificates/verify/${certificateId}`),
}

export const scoutAPI = {
  discoverAthletes: (params = {}) => api.get('/scouts/athletes', { params }),
  shortlist: (payload) => api.post('/scouts/shortlist', payload),
  getShortlisted: (scoutId) => api.get(`/scouts/shortlisted/${scoutId}`),
}

export const sponsorAPI = {
  talentFeed: (params = {}) => api.get('/sponsors/talent-feed', { params }),
}

export const coachAPI = {
  createTrainingPlan: (payload) => api.post('/coach/training-plan', payload),
  getTrainingPlans: (athleteUserId) =>
    api.get(`/coach/training-plans/${athleteUserId}`),
}

export const videoAPI = {
  createAnalysis: (payload) => api.post('/video-analysis/create', payload),

  uploadPoseVideo: ({ userId, sport, video }) => {
    const formData = new FormData()
    formData.append('video', video)

    return api.post('/pose-analysis/upload', formData, {
      params: {
        user_id: userId,
        sport,
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  getPoseReports: (userId) => api.get(`/pose-analysis/reports/${userId}`),
}

export const projectAPI = {
  status: () => api.get('/project/status'),
}

export const smartNotificationAPI = {
  generate: (userId) =>
    api.post(`/ai/smart-notification/${userId}`),
}
export const adminOpportunityAPI = {
  getCompetitions: () => api.get('/admin/competitions'),
  createCompetition: (payload) => api.post('/admin/competitions', payload),
  updateCompetition: (id, payload) => api.put(`/admin/competitions/${id}`, payload),
  deleteCompetition: (id) => api.delete(`/admin/competitions/${id}`),

  getScholarships: () => api.get('/admin/scholarships'),
  createScholarship: (payload) => api.post('/admin/scholarships', payload),
  updateScholarship: (id, payload) => api.put(`/admin/scholarships/${id}`, payload),
  deleteScholarship: (id) => api.delete(`/admin/scholarships/${id}`),
}

