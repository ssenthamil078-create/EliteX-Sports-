from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from uuid import UUID


# ─────────────────────────────────────────────
# AUTH SCHEMAS
# ─────────────────────────────────────────────

class RegisterUser(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str


class LoginUser(BaseModel):
    email: EmailStr
    password: str
    remember_me: Optional[bool] = False


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None


class CookieConsentRequest(BaseModel):
    user_id: Optional[str] = None   # optional — guests can also save prefs
    analytics_cookies: bool = False
    preference_cookies: bool = False


# ─────────────────────────────────────────────
# ATHLETE
# ─────────────────────────────────────────────

class AthleteProfileCreate(BaseModel):
    user_id: str
    age: int
    state: str
    sport: str
    level: str
    achievements: Optional[str] = None
    income_category: Optional[str] = None
    language: Optional[str] = None
    injury_history: Optional[str] = None
    goals: Optional[str] = None


# ─────────────────────────────────────────────
# TRAINING
# ─────────────────────────────────────────────

class TrainingLogCreate(BaseModel):
    user_id: UUID
    training_type: str
    duration_minutes: int
    intensity: int
    calories_burned: int
    performance_score: int
    fatigue_level: int
    injury_pain_level: int
    notes: Optional[str] = None

    @field_validator("intensity")
    @classmethod
    def intensity_range(cls, v):
        if not 1 <= v <= 10:
            raise ValueError("intensity must be between 1 and 10")
        return v

    @field_validator("fatigue_level")
    @classmethod
    def fatigue_range(cls, v):
        if not 1 <= v <= 10:
            raise ValueError("fatigue_level must be between 1 and 10")
        return v

    @field_validator("injury_pain_level")
    @classmethod
    def pain_range(cls, v):
        if not 0 <= v <= 10:
            raise ValueError("injury_pain_level must be between 0 and 10")
        return v

    @field_validator("performance_score")
    @classmethod
    def performance_range(cls, v):
        if not 1 <= v <= 100:
            raise ValueError("performance_score must be between 1 and 100")
        return v


# ─────────────────────────────────────────────
# NOTIFICATIONS
# ─────────────────────────────────────────────

class NotificationCreate(BaseModel):
    user_id: str
    notification_type: str
    title: str
    message: str
    priority: str = "Medium"

    @field_validator("priority")
    @classmethod
    def priority_valid(cls, v):
        if v not in ["Low", "Medium", "High"]:
            raise ValueError("priority must be Low, Medium, or High")
        return v


# ─────────────────────────────────────────────
# SCOUT
# ─────────────────────────────────────────────

class ScoutShortlistCreate(BaseModel):
    scout_id: str
    athlete_user_id: str
    note: Optional[str] = None


# ─────────────────────────────────────────────
# COACH
# ─────────────────────────────────────────────

class TrainingPlanCreate(BaseModel):
    coach_id: str
    athlete_user_id: str
    title: str
    description: str
    duration_weeks: int
    focus_area: str
    difficulty_level: str

    @field_validator("difficulty_level")
    @classmethod
    def difficulty_valid(cls, v):
        if v not in ["Beginner", "Intermediate", "Advanced", "Elite"]:
            raise ValueError("difficulty_level must be Beginner, Intermediate, Advanced, or Elite")
        return v


# ─────────────────────────────────────────────
# MENTORSHIP
# ─────────────────────────────────────────────

class MentorshipRequestCreate(BaseModel):
    mentee_user_id: str
    mentor_user_id: str
    message: Optional[str] = None


# ─────────────────────────────────────────────
# CERTIFICATE
# ─────────────────────────────────────────────

class CertificateCreate(BaseModel):
    user_id: str
    certificate_title: str
    issued_by: str
    issue_date: str
    certificate_url: str


# ─────────────────────────────────────────────
# VIDEO
# ─────────────────────────────────────────────

class VideoAnalysisCreate(BaseModel):
    user_id: str
    video_title: str
    sport: str
    video_url: str


# ─────────────────────────────────────────────
# AI REQUESTS
# ─────────────────────────────────────────────

class AIChatRequest(BaseModel):
    user_id: str
    message: str


class AITrainingPlanRequest(BaseModel):
    user_id: str


class AISmartNotificationRequest(BaseModel):
    user_id: str
    notification_context: str


class MultilingualResponseRequest(BaseModel):
    message: str
    target_language: str


# ─────────────────────────────────────────────
# POSE ANALYSIS
# ─────────────────────────────────────────────

class PoseAnalysisRequest(BaseModel):
    user_id: str
    video_path: str
    sport: str

class CompetitionCreate(BaseModel):
    name: str
    sport: str
    level: str
    venue: str
    date: str
    registration_fee: str
    age_category: str
    eligibility: str
    organizer: str
    application_link: str


class CompetitionUpdate(BaseModel):
    name: Optional[str] = None
    sport: Optional[str] = None
    level: Optional[str] = None
    venue: Optional[str] = None
    date: Optional[str] = None
    registration_fee: Optional[str] = None
    age_category: Optional[str] = None
    eligibility: Optional[str] = None
    organizer: Optional[str] = None
    application_link: Optional[str] = None
class ScholarshipCreate(BaseModel):
    name: str
    provider: str
    amount: str
    sport_eligibility: str
    age_category: str
    eligibility_criteria: str
    application_link: str
    deadline: str


class ScholarshipUpdate(BaseModel):
    name: Optional[str] = None
    provider: Optional[str] = None
    amount: Optional[str] = None
    sport_eligibility: Optional[str] = None
    age_category: Optional[str] = None
    eligibility_criteria: Optional[str] = None
    application_link: Optional[str] = None
    deadline: Optional[str] = None