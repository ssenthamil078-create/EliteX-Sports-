from sqlalchemy import Column, String, Integer, Text, ForeignKey, TIMESTAMP, Float, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.database import Base
import uuid


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)
    # New auth fields
    is_email_verified = Column(Boolean, default=False, nullable=False)
    analytics_cookies = Column(Boolean, default=False)
    preference_cookies = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class AthleteProfile(Base):
    __tablename__ = "athlete_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
    )
    age = Column(Integer)
    state = Column(String)
    sport = Column(String)
    level = Column(String)
    achievements = Column(Text)
    income_category = Column(String)
    language = Column(String)
    injury_history = Column(Text)
    goals = Column(Text)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class Competition(Base):
    __tablename__ = "competitions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    sport = Column(String)
    level = Column(String)
    venue = Column(String)
    date = Column(String)          # expected format YYYY-MM-DD for deadline check
    registration_fee = Column(String)
    age_category = Column(String)
    eligibility = Column(Text)
    organizer = Column(String)
    application_link = Column(Text)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class Scholarship(Base):
    __tablename__ = "scholarships"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    provider = Column(String)
    amount = Column(String)
    sport_eligibility = Column(String)
    age_category = Column(String)
    eligibility_criteria = Column(Text)
    application_link = Column(Text)
    deadline = Column(String)      # YYYY-MM-DD for deadline status check
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class GovernmentScheme(Base):
    __tablename__ = "government_schemes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    authority = Column(String)
    benefits = Column(Text)
    eligibility = Column(Text)
    official_website = Column(Text)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class Coach(Base):
    __tablename__ = "coaches"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    sport = Column(String)
    location = Column(String)
    experience = Column(String)
    certification = Column(String)
    contact = Column(String)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class SponsorScout(Base):
    __tablename__ = "sponsors_scouts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization = Column(String, nullable=False)
    focus_sports = Column(String)
    support_type = Column(String)
    website = Column(Text)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class TrainingLog(Base):
    __tablename__ = "training_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
    )
    training_type = Column(String)
    duration_minutes = Column(Integer)
    intensity = Column(Integer)         # 1–10
    calories_burned = Column(Integer)
    performance_score = Column(Integer) # 1–100
    fatigue_level = Column(Integer)     # 1–10
    injury_pain_level = Column(Integer) # 0–10
    notes = Column(Text)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
    )
    notification_type = Column(String)
    title = Column(String)
    message = Column(Text)
    priority = Column(String)  # Low | Medium | High
    is_read = Column(String, default="false")
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class ScoutShortlist(Base):
    __tablename__ = "scout_shortlists"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scout_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    athlete_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    note = Column(Text)
    status = Column(String, default="shortlisted")
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class TrainingPlan(Base):
    __tablename__ = "training_plans"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    coach_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    athlete_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    title = Column(String)
    description = Column(Text)
    duration_weeks = Column(Integer)
    focus_area = Column(String)
    difficulty_level = Column(String)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class MentorshipRequest(Base):
    __tablename__ = "mentorship_requests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    mentee_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    mentor_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    match_score = Column(Integer)
    status = Column(String, default="pending")
    message = Column(Text)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    certificate_title = Column(String)
    issued_by = Column(String)
    issue_date = Column(String)
    certificate_url = Column(Text)
    certificate_hash = Column(Text)
    verification_status = Column(String, default="verified")
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class VideoAnalysis(Base):
    __tablename__ = "video_analyses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    video_title = Column(String)
    sport = Column(String)
    video_url = Column(Text)
    posture_score = Column(Integer)
    movement_score = Column(Integer)
    balance_score = Column(Integer)
    overall_score = Column(Integer)
    feedback = Column(Text)
    improvement_tips = Column(Text)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class PoseAnalysisReport(Base):
    __tablename__ = "pose_analysis_reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    sport = Column(String)
    video_path = Column(Text)
    pose_detection_rate = Column(Integer)
    detection_quality = Column(String)
    biomechanics_result = Column(Text)
    ai_biomechanics_report = Column(Text)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())




# ─── New tables for auth features ───────────────────────────────────────────

class EmailVerificationToken(Base):
    """Stores single-use tokens for email address verification."""
    __tablename__ = "email_verification_tokens"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    token = Column(String, unique=True, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class PasswordResetToken(Base):
    """Stores single-use tokens for password reset links."""
    __tablename__ = "password_reset_tokens"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    token = Column(String, unique=True, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class LoginAttempt(Base):
    """Audit table for tracking login attempts (success & failure)."""
    __tablename__ = "login_attempts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    ip_address = Column(String)
    success = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())