import { Routes, Route, Navigate } from 'react-router-dom'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import AdminRoute from '@/components/auth/AdminRoute'
import AppLayout from '@/layouts/AppLayout'

import Landing from '@/pages/Landing'
import NotFound from '@/pages/NotFound'

import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import ForgotPassword from '@/pages/auth/ForgotPassword'
import ResetPassword from '@/pages/auth/ResetPassword'
import VerifyEmail from '@/pages/auth/VerifyEmail'

import Dashboard from '@/pages/dashboard/Dashboard'
import AthleteProfile from '@/pages/dashboard/AthleteProfile'
import TrainingLog from '@/pages/dashboard/TrainingLog'
import TrainingHistory from '@/pages/dashboard/TrainingHistory'
import Analytics from '@/pages/dashboard/Analytics'
import Leaderboard from '@/pages/dashboard/Leaderboard'
import Notifications from '@/pages/dashboard/Notifications'
import Opportunities from '@/pages/dashboard/Opportunities'
import Recommendations from '@/pages/dashboard/Recommendations'
import Mentorship from '@/pages/dashboard/Mentorship'
import Certificates from '@/pages/dashboard/Certificates'
import ScoutSponsor from '@/pages/dashboard/ScoutSponsor'
import CoachTrainingPlans from '@/pages/dashboard/CoachTrainingPlans'
import PoseAnalysis from '@/pages/dashboard/PoseAnalysis'
import ProjectStatus from '@/pages/dashboard/ProjectStatus'
import Settings from '@/pages/dashboard/Settings'

import AIHub from '@/pages/ai/AIHub'
import AITrainingPlan from '@/pages/ai/AITrainingPlan'
import AIPrediction from '@/pages/ai/AIPrediction'
import InjuryRisk from '@/pages/ai/InjuryRisk'
import CareerPath from '@/pages/ai/CareerPath'
import AIChat from '@/pages/ai/AIChat'
import AIMultilingual from '@/pages/ai/AIMultilingual'

import LegalCenter from '@/pages/legal/LegalCenter'
import LegalPage from '@/pages/legal/LegalPage'

import AdminDashboard from '@/pages/admin/AdminDashboard'
import AthletePortfolio from '@/pages/dashboard/AthletePortfolio'
import AdminOpportunities from '@/pages/admin/AdminOpportunities'
import PublicAthleteProfile from '@/pages/public/PublicAthleteProfile'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/profile" element={<AthleteProfile />} />
          <Route path="/training-log" element={<TrainingLog />} />
          <Route path="/training-history" element={<TrainingHistory />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/leaderboard" element={<Leaderboard />} />

          <Route path="/ai-hub" element={<AIHub />} />
          <Route path="/ai-training-plan" element={<AITrainingPlan />} />
          <Route path="/ai-prediction" element={<AIPrediction />} />
          <Route path="/injury-risk" element={<InjuryRisk />} />
          <Route path="/career-path" element={<CareerPath />} />
          <Route path="/ai-chat" element={<AIChat />} />
          <Route path="/ai-multilingual" element={<AIMultilingual />} />

          <Route path="/competitions" element={<Opportunities />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/mentorship" element={<Mentorship />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/scout-sponsor" element={<ScoutSponsor />} />
          <Route path="/coach-plans" element={<CoachTrainingPlans />} />
          <Route path="/pose-analysis" element={<PoseAnalysis />} />
          <Route path="/project-status" element={<ProjectStatus />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/portfolio" element={<AthletePortfolio />} />
          <Route path="/admin/opportunities" element={<AdminOpportunities />} />

          <Route path="/legal" element={<LegalCenter />} />
          <Route path="/legal/:type" element={<LegalPage />} />
          <Route path="/athlete/:userId" element={<PublicAthleteProfile />} />


          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}