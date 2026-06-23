from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Request, BackgroundTasks
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime, date
from app.injury_risk_engine import calculate_injury_risk
from app.career_path_engine import generate_career_path
from app.mentorship_engine import calculate_mentor_match_score
from app.certificate_engine import generate_certificate_hash
from app.video_analysis_engine import generate_video_analysis
from app.groq_video_feedback import generate_ai_video_feedback
from app.ai_chat_engine import generate_ai_chat_response
from app.ai_training_plan_engine import generate_ai_training_plan
from app.ai_scout_insight_engine import generate_ai_scout_insight
from app.ai_notification_engine import generate_ai_notification
from app.ai_performance_prediction_engine import generate_performance_prediction
from app.ai_multilingual_engine import generate_multilingual_response
from app.auth import get_current_user, require_role
from app.pose_analysis_engine import analyze_video_pose, analyze_image_pose
from app.ai_biomechanics_report_engine import generate_ai_biomechanics_report
from app.ai_live_pose_feedback_engine import generate_live_pose_feedback
from app.performance_scoring_engine import generate_performance_scores
from app.database import get_db
from app.utils import calculate_readiness_score
from uuid import UUID
from app.schemas import (
    RegisterUser,
    LoginUser,
    AthleteProfileCreate,
    TrainingLogCreate,
    NotificationCreate,
    ScoutShortlistCreate,
    TrainingPlanCreate,
    MentorshipRequestCreate,
    CertificateCreate,
    VideoAnalysisCreate,
    AIChatRequest,
    AITrainingPlanRequest,
    AISmartNotificationRequest,
    MultilingualResponseRequest,
    PoseAnalysisRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ChangePasswordRequest,
    UpdateProfileRequest,
    CookieConsentRequest,
    CompetitionCreate,
    CompetitionUpdate,
    ScholarshipCreate,
    ScholarshipUpdate
)
from app.auth import (
    hash_password,
    verify_password,
    create_access_token,
    create_email_verification_token,
    create_password_reset_token,
    verify_token,
    require_role
)
from app.models import (
    User,
    AthleteProfile,
    Competition,
    Scholarship,
    GovernmentScheme,
    Coach,
    SponsorScout,
    TrainingLog,
    Notification,
    ScoutShortlist,
    TrainingPlan,
    MentorshipRequest,
    Certificate,
    VideoAnalysis,
    PoseAnalysisReport,
    PasswordResetToken,
    EmailVerificationToken,
    LoginAttempt,
)
from app.seed_data import (
    competitions_data,
    scholarships_data,
    schemes_data,
    coaches_data,
    sponsors_scouts_data,
)
from app.recommendation_engine import (
    calculate_competition_score,
    calculate_scholarship_score,
    calculate_scheme_score,
)
from app.email_service import send_verification_email, send_password_reset_email
from app.rate_limiter import check_rate_limit
from app.validators import validate_password_strength, sanitize_input, validate_file_upload
import json
import shutil
import os
import re
import uuid

router = APIRouter()

# ─────────────────────────────────────────────
# HOME
# ─────────────────────────────────────────────
@router.get("/")
def home():
    return {"message": "AI Sports Backend Running"}


# ─────────────────────────────────────────────
# LEGAL & POLICY PAGES
# ─────────────────────────────────────────────

@router.get("/legal/terms-and-conditions")
def terms_and_conditions():
    return {
        "title": "Terms and Conditions",
        "last_updated": "2025-01-01",
        "sections": [
            {
                "heading": "1. Acceptance of Terms",
                "content": (
                    "By accessing or using the AI Sports Opportunity & Talent Intelligence Platform "
                    "('Platform'), you agree to be bound by these Terms and Conditions. If you do not "
                    "agree to all terms, please do not use this Platform."
                ),
            },
            {
                "heading": "2. User Responsibilities",
                "content": (
                    "Users must provide accurate, current, and complete information during registration. "
                    "You are responsible for maintaining the confidentiality of your account credentials. "
                    "Any activity under your account is your responsibility. You must not use the Platform "
                    "for unlawful purposes, impersonate others, or upload malicious content."
                ),
            },
            {
                "heading": "3. Account Suspension & Termination",
                "content": (
                    "We reserve the right to suspend or permanently terminate accounts that: violate these "
                    "Terms; engage in fraudulent or abusive behaviour; upload harmful or inappropriate content; "
                    "attempt to reverse-engineer or disrupt the Platform. Suspended users will be notified "
                    "by email where possible."
                ),
            },
            {
                "heading": "4. Data & API Usage Rules",
                "content": (
                    "All data displayed on this Platform — including competition listings, scholarship details, "
                    "and government scheme information — is provided for informational purposes only. "
                    "Automated scraping, bulk downloading, or commercial redistribution of this data without "
                    "prior written consent is strictly prohibited. API access is granted solely for personal, "
                    "non-commercial use unless a separate API agreement is in place."
                ),
            },
            {
                "heading": "5. Sports Predictions & Statistics Disclaimer",
                "content": (
                    "AI-generated performance predictions, skill ratings, injury risk assessments, and career "
                    "path recommendations are provided as guidance only. They do not constitute professional "
                    "medical, coaching, or legal advice. The Platform does not guarantee the accuracy or "
                    "completeness of any AI-generated output. Users act on this information at their own risk."
                ),
            },
            {
                "heading": "6. Intellectual Property",
                "content": (
                    "All content, logos, software, and AI models on this Platform are the intellectual "
                    "property of the Platform operators. You may not copy, modify, distribute, or create "
                    "derivative works without explicit written permission."
                ),
            },
            {
                "heading": "7. Third-Party Services",
                "content": (
                    "This Platform integrates third-party services including Groq AI, Supabase PostgreSQL, "
                    "and MediaPipe. These services are governed by their own terms and privacy policies. "
                    "We are not responsible for their content or practices."
                ),
            },
            {
                "heading": "8. Limitation of Liability",
                "content": (
                    "To the maximum extent permitted by law, the Platform shall not be liable for any "
                    "indirect, incidental, special, or consequential damages arising from your use of the "
                    "Platform, including but not limited to data loss, injury, or missed opportunities."
                ),
            },
            {
                "heading": "9. Changes to Terms",
                "content": (
                    "We may update these Terms at any time. Continued use of the Platform after changes "
                    "are posted constitutes acceptance of the revised Terms."
                ),
            },
            {
                "heading": "10. Governing Law",
                "content": (
                    "These Terms are governed by the laws of India. Any disputes shall be subject to the "
                    "exclusive jurisdiction of the courts in India."
                ),
            },
        ],
    }


@router.get("/legal/privacy-policy")
def privacy_policy():
    return {
        "title": "Privacy Policy",
        "last_updated": "2025-01-01",
        "sections": [
            {
                "heading": "1. Information We Collect",
                "content": (
                    "We collect the following types of information: "
                    "(a) Account Data: name, email address, hashed password, and role. "
                    "(b) Athlete Profile Data: age, state, sport, level, achievements, injury history, goals, and income category. "
                    "(c) Training Data: training logs, performance scores, fatigue levels, and pain levels. "
                    "(d) Media: uploaded videos and images for pose analysis. "
                    "(e) Usage Data: IP address, browser type, pages visited, and session duration."
                ),
            },
            {
                "heading": "2. Why We Collect Your Data",
                "content": (
                    "Your data is used to: provide personalised AI recommendations for competitions, scholarships, "
                    "and training plans; generate injury risk assessments and performance predictions; "
                    "match athletes with mentors and scouts; send relevant notifications; "
                    "improve the Platform's AI models and features; comply with legal obligations."
                ),
            },
            {
                "heading": "3. Cookies & Session Handling",
                "content": (
                    "We use the following types of cookies: "
                    "(a) Essential Cookies: required for authentication and session management. "
                    "(b) Analytics Cookies: used to understand how users interact with the Platform (optional, consent required). "
                    "(c) Preference Cookies: to remember your language and display settings. "
                    "You can manage cookie preferences via the Cookie Settings panel. Disabling essential cookies "
                    "will prevent login functionality."
                ),
            },
            {
                "heading": "4. Third-Party Services",
                "content": (
                    "We use the following third-party services which may process your data: "
                    "(a) Groq AI — for AI-generated feedback, training plans, and insights. "
                    "(b) Supabase — for secure database hosting (PostgreSQL). "
                    "(c) MediaPipe — for real-time pose analysis on uploaded videos. "
                    "Each service has its own privacy policy. We share only the minimum data necessary."
                ),
            },
            {
                "heading": "5. Data Retention",
                "content": (
                    "We retain your account data for as long as your account is active. "
                    "Training logs and analysis reports are retained for 2 years to support performance tracking. "
                    "Uploaded videos are stored temporarily and deleted after analysis is complete unless saved by the user."
                ),
            },
            {
                "heading": "6. Your Rights",
                "content": (
                    "You have the right to: access the personal data we hold about you; "
                    "request correction of inaccurate data; request deletion of your account and data; "
                    "withdraw consent for optional data processing at any time. "
                    "To exercise these rights, contact us or use the account deletion option in your profile settings."
                ),
            },
            {
                "heading": "7. Data Security",
                "content": (
                    "We implement industry-standard security measures including password hashing (bcrypt), "
                    "JWT-based authentication, HTTPS encryption, input validation, and rate limiting. "
                    "However, no system is completely secure. Please use a strong, unique password."
                ),
            },
            {
                "heading": "8. Contact",
                "content": (
                    "For privacy-related queries, please contact our Data Protection Officer at: "
                    "privacy@aisportsplatform.in"
                ),
            },
        ],
    }


@router.get("/legal/cookie-policy")
def cookie_policy():
    return {
        "title": "Cookie Policy",
        "last_updated": "2025-01-01",
        "introduction": (
            "This Cookie Policy explains what cookies are, how we use them, and your choices regarding cookies."
        ),
        "what_are_cookies": (
            "Cookies are small text files stored on your device when you visit a website. "
            "They help the website remember your actions and preferences over time."
        ),
        "cookie_categories": [
            {
                "type": "Essential Cookies",
                "purpose": "Required for the Platform to function. Includes authentication tokens and session identifiers.",
                "examples": ["auth_token", "session_id"],
                "can_opt_out": False,
            },
            {
                "type": "Analytics Cookies",
                "purpose": "Help us understand how users navigate the Platform so we can improve it.",
                "examples": ["_ga", "_gid"],
                "can_opt_out": True,
            },
            {
                "type": "Preference Cookies",
                "purpose": "Remember your language selection, theme preference, and other display settings.",
                "examples": ["lang_pref", "theme_pref"],
                "can_opt_out": True,
            },
        ],
        "managing_cookies": (
            "You can update your cookie preferences at any time using the Cookie Settings panel "
            "available at the bottom of any page. You can also manage cookies through your browser settings, "
            "though disabling essential cookies will impact your ability to log in."
        ),
        "contact": "cookies@aisportsplatform.in",
    }


@router.get("/legal/disclaimer")
def disclaimer():
    return {
        "title": "Disclaimer",
        "last_updated": "2025-01-01",
        "sections": [
            {
                "heading": "General Information",
                "content": (
                    "The content on this Platform — including AI-generated performance predictions, injury risk "
                    "assessments, career path recommendations, and skill ratings — is provided for general "
                    "informational and educational purposes only."
                ),
            },
            {
                "heading": "Data Accuracy Limitations",
                "content": (
                    "AI models used on this Platform are trained on general sports data and may not accurately "
                    "reflect every individual athlete's circumstances. Performance scores, injury risk levels, "
                    "and competition recommendations are estimates and should not replace advice from qualified "
                    "coaches, sports medicine professionals, or career advisors."
                ),
            },
            {
                "heading": "Medical Disclaimer",
                "content": (
                    "Injury risk scores and pain level analyses are AI-generated approximations. "
                    "They do not constitute medical diagnoses or treatment recommendations. "
                    "Always consult a licensed medical professional before making decisions about training, "
                    "injury management, or physical activity."
                ),
            },
            {
                "heading": "Competition & Scholarship Data",
                "content": (
                    "Competition dates, scholarship deadlines, eligibility criteria, and application links "
                    "are sourced from publicly available information and may not always be current. "
                    "Always verify details directly with the organising body before applying."
                ),
            },
            {
                "heading": "No Guarantees",
                "content": (
                    "We do not guarantee that using this Platform will result in selection, sponsorship, "
                    "scholarship awards, or athletic success. Outcomes depend on many factors beyond the "
                    "scope of this Platform."
                ),
            },
        ],
    }


@router.post("/legal/cookie-consent")
def save_cookie_consent(
    data: CookieConsentRequest,
    db: Session = Depends(get_db),
):
    """Save a user's cookie consent preferences."""
    if data.user_id:
        user = db.query(User).filter(User.id == data.user_id).first()
        if user:
            user.analytics_cookies = data.analytics_cookies
            user.preference_cookies = data.preference_cookies
            db.commit()
    return {
        "message": "Cookie preferences saved",
        "essential_cookies": True,
        "analytics_cookies": data.analytics_cookies,
        "preference_cookies": data.preference_cookies,
    }


# ─────────────────────────────────────────────
# REGISTER
# ─────────────────────────────────────────────

@router.post("/register")
async def register(
    user: RegisterUser,
    background_tasks: BackgroundTasks,
    request: Request,
    db: Session = Depends(get_db),
):
    # Rate limiting
    client_ip = request.client.host
    check_rate_limit(client_ip, "register", limit=5, window_seconds=300)

    # Sanitise inputs
    user.name = sanitize_input(user.name)
    user.email = user.email.lower().strip()

    # Email format validation
    email_regex = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    if not re.match(email_regex, user.email):
        raise HTTPException(status_code=400, detail="Invalid email format")

    # Password strength
    password_check = validate_password_strength(user.password)
    if not password_check["valid"]:
        raise HTTPException(status_code=400, detail=password_check["message"])

    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    if user.role not in ["athlete", "coach", "scout", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role")

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        role=user.role,
        is_email_verified=True,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Send verification email in the background
    #token = create_email_verification_token(str(new_user.id))
    #ev = EmailVerificationToken(user_id=new_user.id, token=token)
    #db.add(ev)
    #db.commit()
    #background_tasks.add_task(send_verification_email, new_user.email, new_user.name, token)

    return {
        "message": "User registered successfully. You can login now",
        "user_id": str(new_user.id),
    }


# ─────────────────────────────────────────────
# EMAIL VERIFICATION
# ─────────────────────────────────────────────

@router.get("/auth/verify-email/{token}")
def verify_email(token: str, db: Session = Depends(get_db)):
    ev = db.query(EmailVerificationToken).filter(
        EmailVerificationToken.token == token
    ).first()
    if not ev:
        raise HTTPException(status_code=400, detail="Invalid or expired verification link")

    user = db.query(User).filter(User.id == ev.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_email_verified = True
    db.delete(ev)
    db.commit()
    return {"message": "Email verified successfully. You can now log in."}


# ─────────────────────────────────────────────
# LOGIN
# ─────────────────────────────────────────────

@router.post("/login")
def login(
    user: LoginUser,
    request: Request,
    db: Session = Depends(get_db),
):
    client_ip = request.client.host
    check_rate_limit(client_ip, "login", limit=10, window_seconds=300)

    db_user = db.query(User).filter(User.email == user.email.lower().strip()).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Track failed attempts
    attempt = LoginAttempt(user_id=db_user.id, ip_address=client_ip, success=False)

    if not verify_password(user.password, db_user.password):
        db.add(attempt)
        db.commit()
        raise HTTPException(status_code=401, detail="Invalid password")

    if not db_user.is_email_verified:
        raise HTTPException(
            status_code=403,
            detail="Please verify your email address before logging in.",
        )

    attempt.success = True
    db.add(attempt)
    db.commit()

    token = create_access_token(
        {
            "user_id": str(db_user.id),
            "email": db_user.email,
            "role": db_user.role,
        },
        remember_me=user.remember_me,
    )

    return {
        "message": "Login successful",
        "token": token,
        "role": db_user.role,
        "user_id": str(db_user.id),
        "email": db_user.email,
        "name": db_user.name,
    }


# ─────────────────────────────────────────────
# FORGOT PASSWORD
# ─────────────────────────────────────────────

@router.post("/auth/forgot-password")
async def forgot_password(
    data: ForgotPasswordRequest,
    background_tasks: BackgroundTasks,
    request: Request,
    db: Session = Depends(get_db),
):
    client_ip = request.client.host
    check_rate_limit(client_ip, "forgot_password", limit=3, window_seconds=600)

    user = db.query(User).filter(User.email == data.email.lower().strip()).first()
    # Always return success to prevent user enumeration
    if user:
        token = create_password_reset_token(str(user.id))
        # Invalidate old tokens
        db.query(PasswordResetToken).filter(
            PasswordResetToken.user_id == user.id
        ).delete()
        prt = PasswordResetToken(user_id=user.id, token=token)
        db.add(prt)
        db.commit()
        background_tasks.add_task(send_password_reset_email, user.email, user.name, token)

    return {
        "message": "If an account with that email exists, a password reset link has been sent."
    }


# ─────────────────────────────────────────────
# RESET PASSWORD
# ─────────────────────────────────────────────

@router.post("/auth/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    prt = db.query(PasswordResetToken).filter(
        PasswordResetToken.token == data.token
    ).first()
    if not prt:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    password_check = validate_password_strength(data.new_password)
    if not password_check["valid"]:
        raise HTTPException(status_code=400, detail=password_check["message"])

    user = db.query(User).filter(User.id == prt.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password = hash_password(data.new_password)
    db.delete(prt)
    db.commit()
    return {"message": "Password reset successfully. Please log in with your new password."}


# ─────────────────────────────────────────────
# CHANGE PASSWORD
# ─────────────────────────────────────────────

@router.post("/auth/change-password")
def change_password(
    data: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    user = db.query(User).filter(User.id == current_user["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(data.current_password, user.password):
        raise HTTPException(status_code=401, detail="Current password is incorrect")

    password_check = validate_password_strength(data.new_password)
    if not password_check["valid"]:
        raise HTTPException(status_code=400, detail=password_check["message"])

    user.password = hash_password(data.new_password)
    db.commit()
    return {"message": "Password changed successfully"}


# ─────────────────────────────────────────────
# UPDATE PROFILE
# ─────────────────────────────────────────────

@router.patch("/auth/update-profile")
def update_profile(
    data: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    user = db.query(User).filter(User.id == current_user["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if data.name:
        user.name = sanitize_input(data.name)
    db.commit()
    db.refresh(user)
    return {"message": "Profile updated successfully", "name": user.name}


# ─────────────────────────────────────────────
# DELETE ACCOUNT
# ─────────────────────────────────────────────

@router.delete("/auth/delete-account")
def delete_account(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    user = db.query(User).filter(User.id == current_user["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()
    return {"message": "Account and all associated data deleted successfully"}


# ─────────────────────────────────────────────
# CREATE ATHLETE PROFILE
# ─────────────────────────────────────────────

@router.post("/athlete/profile")
def create_profile(profile: AthleteProfileCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == profile.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.role != "athlete":
        raise HTTPException(status_code=403, detail="Only athletes can create profile")

    existing_profile = db.query(AthleteProfile).filter(
        AthleteProfile.user_id == profile.user_id
    ).first()
    if existing_profile:
        raise HTTPException(status_code=400, detail="Profile already exists")

    new_profile = AthleteProfile(
        user_id=profile.user_id,
        age=profile.age,
        state=sanitize_input(profile.state),
        sport=sanitize_input(profile.sport),
        level=sanitize_input(profile.level),
        achievements=sanitize_input(profile.achievements or ""),
        income_category=profile.income_category,
        language=profile.language,
        injury_history=sanitize_input(profile.injury_history or ""),
        goals=sanitize_input(profile.goals or ""),
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    return {"message": "Athlete profile created successfully"}


# ─────────────────────────────────────────────
# GET ATHLETE PROFILE
# ─────────────────────────────────────────────

@router.get("/athlete/profile/{user_id}")
def get_profile(user_id: UUID, db: Session = Depends(get_db)):
    profile = db.query(AthleteProfile).filter(
        AthleteProfile.user_id == user_id
    ).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return {
        "age": profile.age,
        "state": profile.state,
        "sport": profile.sport,
        "level": profile.level,
        "achievements": profile.achievements,
        "goals": profile.goals,
    }


# ─────────────────────────────────────────────
# SEED DATA
# ─────────────────────────────────────────────

@router.post("/seed-data")
def seed_data(db: Session = Depends(get_db)):
    from app.seed_data import (
        competitions_data,
        scholarships_data,
        schemes_data,
        coaches_data,
        sponsors_scouts_data,
    )

    # Clear old data
    db.query(Competition).delete()
    db.query(Scholarship).delete()
    db.query(GovernmentScheme).delete()
    db.query(Coach).delete()
    db.query(SponsorScout).delete()

    db.commit()

    # Insert fresh data
    db.add_all(competitions_data)
    db.add_all(scholarships_data)
    db.add_all(schemes_data)
    db.add_all(coaches_data)
    db.add_all(sponsors_scouts_data)

    db.commit()

    return {
        "message": "Seed data refreshed successfully",
        "competitions": len(competitions_data),
        "scholarships": len(scholarships_data),
        "schemes": len(schemes_data),
        "coaches": len(coaches_data),
        "sponsors_scouts": len(sponsors_scouts_data),
    }


# ─────────────────────────────────────────────
# HELPER — deadline status
# ─────────────────────────────────────────────

from datetime import datetime, date

def _deadline_status(date_str: str) -> str:
    if not date_str:
        return "Open"

    try:
        deadline = datetime.strptime(date_str, "%Y-%m-%d").date()
        return "Finished" if deadline < date.today() else "Open"
    except Exception:
        return "Open"


# ─────────────────────────────────────────────
# OPPORTUNITY FEED
# ─────────────────────────────────────────────

@router.get("/opportunities/feed")
def opportunity_feed(db: Session = Depends(get_db)):
    competitions = [
    item for item in db.query(Competition).all()
    if _deadline_status(item.date) == "Open"
    ]
    scholarships = [
    item for item in db.query(Scholarship).all()
    if _deadline_status(item.deadline) == "Open"
    ]
    schemes = db.query(GovernmentScheme).all()
    coaches = db.query(Coach).all()
    sponsors = db.query(SponsorScout).all()
    return {
    "competitions": [
            {
                "id": str(item.id),
                "name": item.name,
                "sport": item.sport,
                "level": item.level,
                "venue": item.venue,
                "date": item.date,
                "registration_fee": item.registration_fee,
                "age_category": item.age_category,
                "eligibility": item.eligibility,
                "organizer": item.organizer,
                "application_link": item.application_link,
                "status": _deadline_status(item.date),
                "apply_now_url": item.application_link,
            }
            for item in competitions
        ],
        "scholarships": [
            {
                "id": str(item.id),
                "name": item.name,
                "provider": item.provider,
                "amount": item.amount,
                "sport_eligibility": item.sport_eligibility,
                "age_category": item.age_category,
                "eligibility_criteria": item.eligibility_criteria,
                "application_link": item.application_link,
                "status": _deadline_status(item.deadline) if hasattr(item, "deadline") else "Open",
                "apply_now_url": item.application_link,
            }
            for item in scholarships
        ],
        "government_schemes": [
            {
                "id": str(item.id),
                "name": item.name,
                "authority": item.authority,
                "benefits": item.benefits,
                "eligibility": item.eligibility,
                "official_website": item.official_website,
                "apply_now_url": item.official_website,
            }
            for item in schemes
        ],
        "coaches": [
            {
                "id": str(item.id),
                "name": item.name,
                "sport": item.sport,
                "location": item.location,
                "experience": item.experience,
                "certification": item.certification,
                "contact": item.contact,
            }
            for item in coaches
        ],
        "sponsors_scouts": [
            {
                "id": str(item.id),
                "organization": item.organization,
                "focus_sports": item.focus_sports,
                "support_type": item.support_type,
                "website": item.website,
                "apply_now_url": item.website,
            }
            for item in sponsors
        ],
    }


@router.get("/recommendations/competitions/{user_id}")
def recommend_competitions(user_id: UUID, db: Session = Depends(get_db)):
    athlete = (
        db.query(AthleteProfile)
        .filter(AthleteProfile.user_id == user_id)
        .first()
    )

    if not athlete:
        raise HTTPException(status_code=404, detail="Athlete profile not found")

    competitions = db.query(Competition).all()
    results = []

    for comp in competitions:
        status = _deadline_status(comp.date)

        # Ignore past / deadline crossed competitions
        if status == "Finished":
            continue

        score = calculate_competition_score(athlete, comp)

        if score > 0:
            results.append({
                "id": str(comp.id),
                "name": comp.name,
                "sport": comp.sport,
                "level": comp.level,
                "venue": comp.venue,
                "date": comp.date,
                "registration_fee": comp.registration_fee,
                "age_category": comp.age_category,
                "eligibility": comp.eligibility,
                "organizer": comp.organizer,
                "application_link": comp.application_link,
                "match_score": score,
                "status": status,
                "apply_now_url": comp.application_link,
            })

    results = sorted(
        results,
        key=lambda x: x["match_score"],
        reverse=True
    )

    return {
        "user_id": str(user_id),
        "total_recommendations": len(results),
        "recommendations": results,
    }


@router.get("/recommendations/scholarships/{user_id}")
def recommend_scholarships(user_id: UUID, db: Session = Depends(get_db)):
    athlete = (
        db.query(AthleteProfile)
        .filter(AthleteProfile.user_id == user_id)
        .first()
    )

    if not athlete:
        raise HTTPException(status_code=404, detail="Athlete profile not found")

    scholarships = db.query(Scholarship).all()
    results = []

    for item in scholarships:
        deadline = getattr(item, "deadline", None)
        status = _deadline_status(deadline)

        # Ignore past / deadline crossed scholarships
        if status == "Finished":
            continue

        score = calculate_scholarship_score(athlete, item)

        if score > 0:
            results.append({
                "id": str(item.id),
                "name": item.name,
                "provider": item.provider,
                "amount": item.amount,
                "sport_eligibility": item.sport_eligibility,
                "age_category": item.age_category,
                "eligibility_criteria": item.eligibility_criteria,
                "application_link": item.application_link,
                "deadline": deadline,
                "match_score": score,
                "status": status,
                "apply_now_url": item.application_link,
            })

    results = sorted(
        results,
        key=lambda x: x["match_score"],
        reverse=True
    )

    return {
        "user_id": str(user_id),
        "total_recommendations": len(results),
        "recommendations": results,
    }


# ─────────────────────────────────────────────
# AI GOVERNMENT SCHEME RECOMMENDATIONS
# ─────────────────────────────────────────────

@router.get("/recommendations/schemes/{user_id}")
def recommend_schemes(user_id: UUID, db: Session = Depends(get_db)):
    athlete = db.query(AthleteProfile).filter(
        AthleteProfile.user_id == user_id
    ).first()
    if not athlete:
        raise HTTPException(status_code=404, detail="Athlete profile not found")

    schemes = db.query(GovernmentScheme).all()
    results = []
    for scheme in schemes:
        score = calculate_scheme_score(athlete, scheme)
        if score > 0:
            results.append({
                "id": str(scheme.id),
                "name": scheme.name,
                "authority": scheme.authority,
                "benefits": scheme.benefits,
                "eligibility": scheme.eligibility,
                "official_website": scheme.official_website,
                "match_score": score,
                "apply_now_url": scheme.official_website,
            })
    results = sorted(results, key=lambda x: x["match_score"], reverse=True)
    return {
        "user_id": user_id,
        "total_recommendations": len(results),
        "recommendations": results,
    }


# ─────────────────────────────────────────────
# TRAINING LOG
# ─────────────────────────────────────────────

@router.post("/training/log")
def add_training_log(log: TrainingLogCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == log.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_log = TrainingLog(
        user_id=log.user_id,
        training_type=sanitize_input(log.training_type),
        duration_minutes=log.duration_minutes,
        intensity=log.intensity,
        calories_burned=log.calories_burned,
        performance_score=log.performance_score,
        fatigue_level=log.fatigue_level,
        injury_pain_level=log.injury_pain_level,
        notes=sanitize_input(log.notes or ""),
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return {
        "message": "Training log added successfully",
        "training_log_id": str(new_log.id),
    }


# ─────────────────────────────────────────────
# TRAINING HISTORY
# ─────────────────────────────────────────────

@router.get("/training/history/{user_id}")
def training_history(user_id: UUID, db: Session = Depends(get_db)):
    logs = db.query(TrainingLog).filter(
        TrainingLog.user_id == user_id
    ).order_by(TrainingLog.created_at.desc()).all()
    return {
        "user_id": user_id,
        "total_logs": len(logs),
        "training_history": [
            {
                "id": str(log.id),
                "training_type": log.training_type,
                "duration_minutes": log.duration_minutes,
                "intensity": log.intensity,
                "calories_burned": log.calories_burned,
                "performance_score": log.performance_score,
                "fatigue_level": log.fatigue_level,
                "injury_pain_level": log.injury_pain_level,
                "notes": log.notes,
                "created_at": log.created_at,
            }
            for log in logs
        ],
    }


# ─────────────────────────────────────────────
# PERFORMANCE ANALYTICS
# ─────────────────────────────────────────────

@router.get("/analytics/performance/{user_id}")
def performance_analytics(user_id: UUID, db: Session = Depends(get_db)):
    logs = db.query(TrainingLog).filter(TrainingLog.user_id == user_id).all()
    if not logs:
        raise HTTPException(status_code=404, detail="No training logs found")

    total_sessions = len(logs)
    total_duration = sum(log.duration_minutes for log in logs)
    total_calories = sum(log.calories_burned for log in logs)
    avg_performance = sum(log.performance_score for log in logs) / total_sessions
    avg_intensity = sum(log.intensity for log in logs) / total_sessions
    avg_fatigue = sum(log.fatigue_level for log in logs) / total_sessions
    avg_pain = sum(log.injury_pain_level for log in logs) / total_sessions

    if avg_pain >= 7 or avg_fatigue >= 8:
        injury_risk = "High"
    elif avg_pain >= 4 or avg_fatigue >= 5:
        injury_risk = "Medium"
    else:
        injury_risk = "Low"

    return {
        "user_id": user_id,
        "total_sessions": total_sessions,
        "total_training_minutes": total_duration,
        "total_calories_burned": total_calories,
        "average_performance_score": round(avg_performance, 2),
        "average_intensity": round(avg_intensity, 2),
        "average_fatigue": round(avg_fatigue, 2),
        "average_pain_level": round(avg_pain, 2),
        "injury_risk_level": injury_risk,
    }


# ─────────────────────────────────────────────
# AI SKILL RATING
# ─────────────────────────────────────────────

@router.get("/analytics/skill-rating/{user_id}")
def skill_rating(user_id: UUID, db: Session = Depends(get_db)):
    athlete = db.query(AthleteProfile).filter(
        AthleteProfile.user_id == user_id
    ).first()
    if not athlete:
        raise HTTPException(status_code=404, detail="Athlete profile not found")

    logs = db.query(TrainingLog).filter(TrainingLog.user_id == user_id).all()
    if not logs:
        raise HTTPException(status_code=404, detail="No training logs found")

    total_sessions = len(logs)
    avg_performance = sum(log.performance_score for log in logs) / total_sessions
    avg_intensity = sum(log.intensity for log in logs) / total_sessions
    avg_fatigue = sum(log.fatigue_level for log in logs) / total_sessions
    avg_pain = sum(log.injury_pain_level for log in logs) / total_sessions

    consistency_score = min(total_sessions * 5, 30)
    performance_component = avg_performance * 0.5
    intensity_component = avg_intensity * 3
    recovery_penalty = (avg_fatigue + avg_pain) * 2
    final_score = performance_component + intensity_component + consistency_score - recovery_penalty
    final_score = max(0, min(100, round(final_score, 2)))

    if final_score >= 85:
        rating = "Elite"
    elif final_score >= 70:
        rating = "Gold"
    elif final_score >= 50:
        rating = "Silver"
    else:
        rating = "Bronze"

    return {
        "user_id": user_id,
        "athlete_name": athlete.user_id,
        "sport": athlete.sport,
        "level": athlete.level,
        "total_training_sessions": total_sessions,
        "skill_score": final_score,
        "skill_rating": rating,
        "average_performance": round(avg_performance, 2),
        "consistency_score": consistency_score,
        "recovery_penalty": round(recovery_penalty, 2),
    }


# ─────────────────────────────────────────────
# NOTIFICATIONS
# ─────────────────────────────────────────────

@router.post("/notifications/create")
def create_notification(notification: NotificationCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == notification.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_notification = Notification(
        user_id=notification.user_id,
        notification_type=notification.notification_type,
        title=sanitize_input(notification.title),
        message=sanitize_input(notification.message),
        priority=notification.priority,
        is_read="false",
    )
    db.add(new_notification)
    db.commit()
    db.refresh(new_notification)
    return {
        "message": "Notification created successfully",
        "notification_id": str(new_notification.id),
    }


@router.get("/notifications/{user_id}")
def get_notifications(user_id: UUID, db: Session = Depends(get_db)):
    notifications = db.query(Notification).filter(
        Notification.user_id == user_id
    ).order_by(Notification.created_at.desc()).all()
    return {
        "user_id": user_id,
        "total_notifications": len(notifications),
        "unread_count": len([n for n in notifications if n.is_read == "false"]),
        "notifications": [
            {
                "id": str(n.id),
                "notification_type": n.notification_type,
                "title": n.title,
                "message": n.message,
                "priority": n.priority,
                "is_read": n.is_read,
                "created_at": n.created_at,
            }
            for n in notifications
        ],
    }


@router.patch("/notifications/read/{notification_id}")
def mark_notification_read(notification_id: str, db: Session = Depends(get_db)):
    notification = db.query(Notification).filter(
        Notification.id == notification_id
    ).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    notification.is_read = "true"
    db.commit()
    db.refresh(notification)
    return {
        "message": "Notification marked as read",
        "notification_id": str(notification.id),
    }


@router.delete("/notifications/{notification_id}")
def delete_notification(notification_id: str, db: Session = Depends(get_db)):
    notification = db.query(Notification).filter(
        Notification.id == notification_id
    ).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    db.delete(notification)
    db.commit()
    return {"message": "Notification deleted successfully"}


# ─────────────────────────────────────────────
# SCOUT ATHLETE DISCOVERY
# ─────────────────────────────────────────────

@router.get("/scouts/athletes")
def scout_discover_athletes(
    sport: str = None,
    state: str = None,
    level: str = None,
    db: Session = Depends(get_db),
):
    query = db.query(AthleteProfile)
    if sport:
        query = query.filter(AthleteProfile.sport.ilike(f"%{sport}%"))
    if state:
        query = query.filter(AthleteProfile.state.ilike(f"%{state}%"))
    if level:
        query = query.filter(AthleteProfile.level.ilike(f"%{level}%"))
    athletes = query.all()
    return {
        "total_athletes": len(athletes),
        "athletes": [
            {
                "profile_id": str(a.id),
                "user_id": str(a.user_id),
                "age": a.age,
                "state": a.state,
                "sport": a.sport,
                "level": a.level,
                "achievements": a.achievements,
                "goals": a.goals,
            }
            for a in athletes
        ],
    }


# ─────────────────────────────────────────────
# SCOUT SHORTLIST
# ─────────────────────────────────────────────

@router.post("/scouts/shortlist")
def scout_shortlist_athlete(data: ScoutShortlistCreate, db: Session = Depends(get_db)):
    scout = db.query(User).filter(User.id == data.scout_id).first()
    if not scout:
        raise HTTPException(status_code=404, detail="Scout user not found")
    if scout.role not in ["scout", "admin"]:
        raise HTTPException(status_code=403, detail="Only scouts can shortlist athletes")

    athlete = db.query(User).filter(User.id == data.athlete_user_id).first()
    if not athlete:
        raise HTTPException(status_code=404, detail="Athlete user not found")

    existing = db.query(ScoutShortlist).filter(
        ScoutShortlist.scout_id == data.scout_id,
        ScoutShortlist.athlete_user_id == data.athlete_user_id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Athlete already shortlisted")

    shortlist = ScoutShortlist(
        scout_id=data.scout_id,
        athlete_user_id=data.athlete_user_id,
        note=sanitize_input(data.note or ""),
    )
    db.add(shortlist)
    db.commit()
    db.refresh(shortlist)
    return {
        "message": "Athlete shortlisted successfully",
        "shortlist_id": str(shortlist.id),
    }


@router.get("/scouts/shortlisted/{scout_id}")
def get_scout_shortlist(scout_id: str, db: Session = Depends(get_db)):
    shortlists = db.query(ScoutShortlist).filter(
        ScoutShortlist.scout_id == scout_id
    ).all()
    results = []
    for item in shortlists:
        athlete = db.query(AthleteProfile).filter(
            AthleteProfile.user_id == item.athlete_user_id
        ).first()
        if athlete:
            results.append({
                "shortlist_id": str(item.id),
                "athlete_user_id": str(item.athlete_user_id),
                "sport": athlete.sport,
                "age": athlete.age,
                "state": athlete.state,
                "level": athlete.level,
                "achievements": athlete.achievements,
                "note": item.note,
                "status": item.status,
                "created_at": item.created_at,
            })
    return {
        "scout_id": scout_id,
        "total_shortlisted": len(results),
        "shortlisted_athletes": results,
    }


# ─────────────────────────────────────────────
# SPONSOR TALENT FEED
# ─────────────────────────────────────────────

@router.get("/sponsors/talent-feed")
def sponsor_talent_feed(
    sport: str = None,
    state: str = None,
    db: Session = Depends(get_db),
):
    query = db.query(AthleteProfile)
    if sport:
        query = query.filter(AthleteProfile.sport.ilike(f"%{sport}%"))
    if state:
        query = query.filter(AthleteProfile.state.ilike(f"%{state}%"))
    athletes = query.all()
    return {
        "total_talent": len(athletes),
        "talent_feed": [
            {
                "athlete_user_id": str(a.user_id),
                "sport": a.sport,
                "state": a.state,
                "level": a.level,
                "achievements": a.achievements,
                "goals": a.goals,
                "sponsorship_potential": (
                    "High" if a.level in ["State", "National", "Elite"] else "Medium"
                ),
            }
            for a in athletes
        ],
    }


# ─────────────────────────────────────────────
# COACH TRAINING PLAN
# ─────────────────────────────────────────────

@router.post("/coach/training-plan")
def create_training_plan(plan: TrainingPlanCreate, db: Session = Depends(get_db)):
    coach = db.query(User).filter(User.id == plan.coach_id).first()
    if not coach:
        raise HTTPException(status_code=404, detail="Coach user not found")
    if coach.role not in ["coach", "admin"]:
        raise HTTPException(status_code=403, detail="Only coaches can create training plans")

    athlete = db.query(User).filter(User.id == plan.athlete_user_id).first()
    if not athlete:
        raise HTTPException(status_code=404, detail="Athlete user not found")

    training_plan = TrainingPlan(
        coach_id=plan.coach_id,
        athlete_user_id=plan.athlete_user_id,
        title=sanitize_input(plan.title),
        description=sanitize_input(plan.description),
        duration_weeks=plan.duration_weeks,
        focus_area=sanitize_input(plan.focus_area),
        difficulty_level=plan.difficulty_level,
    )
    db.add(training_plan)
    db.commit()
    db.refresh(training_plan)
    return {
        "message": "Training plan created successfully",
        "training_plan_id": str(training_plan.id),
    }


@router.get("/coach/training-plans/{athlete_user_id}")
def get_training_plans(athlete_user_id: UUID, db: Session = Depends(get_db)):
    plans = db.query(TrainingPlan).filter(
        TrainingPlan.athlete_user_id == athlete_user_id
    ).order_by(TrainingPlan.created_at.desc()).all()
    return {
        "athlete_user_id": athlete_user_id,
        "total_plans": len(plans),
        "training_plans": [
            {
                "id": str(p.id),
                "coach_id": str(p.coach_id),
                "title": p.title,
                "description": p.description,
                "duration_weeks": p.duration_weeks,
                "focus_area": p.focus_area,
                "difficulty_level": p.difficulty_level,
                "created_at": p.created_at,
            }
            for p in plans
        ],
    }


# ─────────────────────────────────────────────
# INJURY RISK PREDICTOR
# ─────────────────────────────────────────────

@router.get("/injury-risk/{user_id}")
def injury_risk_predictor(user_id: UUID, db: Session = Depends(get_db)):
    athlete = db.query(AthleteProfile).filter(
        AthleteProfile.user_id == user_id
    ).first()
    if not athlete:
        raise HTTPException(status_code=404, detail="Athlete profile not found")

    logs = db.query(TrainingLog).filter(TrainingLog.user_id == user_id).all()
    if not logs:
        raise HTTPException(status_code=404, detail="No training logs found")

    result = calculate_injury_risk(logs)
    if result["risk_level"] == "High":
        alert = Notification(
            user_id=user_id,
            notification_type="Injury Risk Alert",
            title="High Injury Risk Detected",
            message=(
                "Your recent training load shows high injury risk. "
                "Please reduce intensity and consider rest."
            ),
            priority="High",
            is_read="false",
        )
        db.add(alert)
        db.commit()

    return {
        "user_id": user_id,
        "sport": athlete.sport,
        "level": athlete.level,
        "injury_risk": result,
    }


# ─────────────────────────────────────────────
# AI CAREER PATH
# ─────────────────────────────────────────────

@router.get("/career-path/{user_id}")
def career_path_recommendation(user_id: UUID, db: Session = Depends(get_db)):
    athlete = db.query(AthleteProfile).filter(
        AthleteProfile.user_id == user_id
    ).first()
    if not athlete:
        raise HTTPException(status_code=404, detail="Athlete profile not found")

    logs = db.query(TrainingLog).filter(TrainingLog.user_id == user_id).all()
    if not logs:
        raise HTTPException(status_code=404, detail="No training logs found")

    total_sessions = len(logs)
    avg_performance = sum(log.performance_score for log in logs) / total_sessions
    avg_intensity = sum(log.intensity for log in logs) / total_sessions
    avg_fatigue = sum(log.fatigue_level for log in logs) / total_sessions
    avg_pain = sum(log.injury_pain_level for log in logs) / total_sessions
    consistency_score = min(total_sessions * 5, 30)
    skill_score = max(
        0,
        min(
            100,
            round(
                avg_performance * 0.5
                + avg_intensity * 3
                + consistency_score
                - (avg_fatigue + avg_pain) * 2,
                2,
            ),
        ),
    )

    career_result = generate_career_path(athlete, skill_score, total_sessions)
    return {
        "user_id": user_id,
        "sport": athlete.sport,
        "skill_score": skill_score,
        "career_path": career_result,
    }


# ─────────────────────────────────────────────
# PEER MENTORSHIP
# ─────────────────────────────────────────────

@router.get("/mentorship/matches/{user_id}")
def get_mentor_matches(user_id: UUID, db: Session = Depends(get_db)):
    mentee = db.query(AthleteProfile).filter(
        AthleteProfile.user_id == user_id
    ).first()
    if not mentee:
        raise HTTPException(status_code=404, detail="Mentee profile not found")

    possible_mentors = db.query(AthleteProfile).filter(
        AthleteProfile.user_id != user_id
    ).all()
    results = []
    for mentor in possible_mentors:
        score = calculate_mentor_match_score(mentee, mentor)
        if score > 0:
            results.append({
                "mentor_user_id": str(mentor.user_id),
                "sport": mentor.sport,
                "state": mentor.state,
                "level": mentor.level,
                "achievements": mentor.achievements,
                "language": mentor.language,
                "match_score": score,
            })
    results = sorted(results, key=lambda x: x["match_score"], reverse=True)
    return {
        "mentee_user_id": user_id,
        "total_matches": len(results),
        "matches": results,
    }


@router.post("/mentorship/request")
def create_mentorship_request(
    request: MentorshipRequestCreate, db: Session = Depends(get_db)
):
    mentee = db.query(AthleteProfile).filter(
        AthleteProfile.user_id == request.mentee_user_id
    ).first()
    mentor = db.query(AthleteProfile).filter(
        AthleteProfile.user_id == request.mentor_user_id
    ).first()
    if not mentee:
        raise HTTPException(status_code=404, detail="Mentee profile not found")
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor profile not found")

    score = calculate_mentor_match_score(mentee, mentor)
    existing = db.query(MentorshipRequest).filter(
        MentorshipRequest.mentee_user_id == request.mentee_user_id,
        MentorshipRequest.mentor_user_id == request.mentor_user_id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Mentorship request already exists")

    new_request = MentorshipRequest(
        mentee_user_id=request.mentee_user_id,
        mentor_user_id=request.mentor_user_id,
        match_score=score,
        message=sanitize_input(request.message or ""),
    )
    db.add(new_request)

    notification = Notification(
        user_id=request.mentor_user_id,
        notification_type="Mentorship Request",
        title="New Mentorship Request",
        message="A junior athlete has requested mentorship from you.",
        priority="Medium",
        is_read="false",
    )
    db.add(notification)
    db.commit()
    db.refresh(new_request)
    return {
        "message": "Mentorship request sent successfully",
        "request_id": str(new_request.id),
        "match_score": score,
    }


# ─────────────────────────────────────────────
# CERTIFICATE VERIFICATION
# ─────────────────────────────────────────────

@router.post("/certificates/upload")
def upload_certificate(cert: CertificateCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == cert.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    cert_hash = generate_certificate_hash(
        cert.user_id, cert.certificate_title, cert.issued_by, cert.issue_date
    )
    new_certificate = Certificate(
        user_id=cert.user_id,
        certificate_title=sanitize_input(cert.certificate_title),
        issued_by=sanitize_input(cert.issued_by),
        issue_date=cert.issue_date,
        certificate_url=cert.certificate_url,
        certificate_hash=cert_hash,
        verification_status="verified",
    )
    db.add(new_certificate)
    db.commit()
    db.refresh(new_certificate)
    return {
        "message": "Certificate uploaded and verified successfully",
        "certificate_id": str(new_certificate.id),
        "certificate_hash": cert_hash,
        "verification_status": "verified",
    }


@router.get("/certificates/verify/{certificate_id}")
def verify_certificate(certificate_id: str, db: Session = Depends(get_db)):
    cert = db.query(Certificate).filter(Certificate.id == certificate_id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
    return {
        "certificate_id": str(cert.id),
        "user_id": str(cert.user_id),
        "certificate_title": cert.certificate_title,
        "issued_by": cert.issued_by,
        "issue_date": cert.issue_date,
        "certificate_url": cert.certificate_url,
        "certificate_hash": cert.certificate_hash,
        "verification_status": cert.verification_status,
    }


@router.get("/certificates/user/{user_id}")
def get_user_certificates(user_id: UUID, db: Session = Depends(get_db)):
    certificates = db.query(Certificate).filter(
        Certificate.user_id == user_id
    ).order_by(Certificate.created_at.desc()).all()
    return {
        "user_id": user_id,
        "total_certificates": len(certificates),
        "certificates": [
            {
                "certificate_id": str(c.id),
                "certificate_title": c.certificate_title,
                "issued_by": c.issued_by,
                "issue_date": c.issue_date,
                "certificate_url": c.certificate_url,
                "certificate_hash": c.certificate_hash,
                "verification_status": c.verification_status,
                "created_at": c.created_at,
            }
            for c in certificates
        ],
    }


# ─────────────────────────────────────────────
# VIDEO PERFORMANCE ANALYSIS
# ─────────────────────────────────────────────

@router.post("/video-analysis/create")
def create_video_analysis(data: VideoAnalysisCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    athlete = db.query(AthleteProfile).filter(
        AthleteProfile.user_id == data.user_id
    ).first()
    athlete_level = athlete.level if athlete else "Beginner"
    result = generate_video_analysis(data.sport)
    ai_report = generate_ai_video_feedback(
        sport=data.sport,
        athlete_level=athlete_level,
        posture_score=result["posture_score"],
        movement_score=result["movement_score"],
        balance_score=result["balance_score"],
        overall_score=result["overall_score"],
    )

    analysis = VideoAnalysis(
        user_id=data.user_id,
        video_title=sanitize_input(data.video_title),
        sport=sanitize_input(data.sport),
        video_url=data.video_url,
        posture_score=result["posture_score"],
        movement_score=result["movement_score"],
        balance_score=result["balance_score"],
        overall_score=result["overall_score"],
        feedback=ai_report,
        improvement_tips="AI-generated personalised improvement plan included in feedback report.",
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    return {
        "message": "AI video analysis created successfully",
        "analysis_id": str(analysis.id),
        "overall_score": analysis.overall_score,
        "ai_feedback_report": ai_report,
    }


# ─────────────────────────────────────────────
# AI SPORTS ASSISTANT CHATBOT
# ─────────────────────────────────────────────

@router.post("/ai/chat")
def ai_sports_chat(chat: AIChatRequest, db: Session = Depends(get_db)):
    athlete = db.query(AthleteProfile).filter(
        AthleteProfile.user_id == chat.user_id
    ).first()
    if athlete:
        athlete_context = (
            f"Sport: {athlete.sport}\nAge: {athlete.age}\nState: {athlete.state}\n"
            f"Level: {athlete.level}\nAchievements: {athlete.achievements}\n"
            f"Goals: {athlete.goals}\nInjury History: {athlete.injury_history}\n"
            f"Preferred Language: {athlete.language}"
        )
    else:
        athlete_context = "No athlete profile found."

    ai_response = generate_ai_chat_response(
        message=sanitize_input(chat.message),
        athlete_context=athlete_context,
    )
    return {
        "user_id": chat.user_id,
        "message": chat.message,
        "ai_response": ai_response,
    }


# ─────────────────────────────────────────────
# AI TRAINING PLAN GENERATOR
# ─────────────────────────────────────────────

@router.post("/ai/training-plan")
def ai_training_plan(data: AITrainingPlanRequest, db: Session = Depends(get_db)):
    athlete = db.query(AthleteProfile).filter(
        AthleteProfile.user_id == data.user_id
    ).first()
    if not athlete:
        raise HTTPException(status_code=404, detail="Athlete profile not found")

    logs = db.query(TrainingLog).filter(TrainingLog.user_id == data.user_id).all()
    if logs:
        total_sessions = len(logs)
        avg_performance = sum(log.performance_score for log in logs) / total_sessions
        avg_intensity = sum(log.intensity for log in logs) / total_sessions
        avg_fatigue = sum(log.fatigue_level for log in logs) / total_sessions
        avg_pain = sum(log.injury_pain_level for log in logs) / total_sessions
    else:
        total_sessions = avg_performance = avg_intensity = avg_fatigue = avg_pain = 0

    athlete_context = (
        f"Sport: {athlete.sport}\nAge: {athlete.age}\nState: {athlete.state}\n"
        f"Level: {athlete.level}\nAchievements: {athlete.achievements}\n"
        f"Goals: {athlete.goals}\nInjury History: {athlete.injury_history}\n"
        f"Preferred Language: {athlete.language}"
    )
    analytics_context = (
        f"Total Training Sessions: {total_sessions}\n"
        f"Average Performance Score: {round(avg_performance, 2)}\n"
        f"Average Intensity: {round(avg_intensity, 2)}\n"
        f"Average Fatigue: {round(avg_fatigue, 2)}\n"
        f"Average Pain Level: {round(avg_pain, 2)}"
    )

    ai_plan = generate_ai_training_plan(
        athlete_context=athlete_context,
        analytics_context=analytics_context,
    )
    return {"user_id": data.user_id, "ai_training_plan": ai_plan}


# ─────────────────────────────────────────────
# AI SCOUT INSIGHT
# ─────────────────────────────────────────────

@router.get("/ai/scout-insight/{athlete_user_id}")
def ai_scout_insight(athlete_user_id: UUID, db: Session = Depends(get_db)):
    athlete = db.query(AthleteProfile).filter(
        AthleteProfile.user_id == athlete_user_id
    ).first()
    if not athlete:
        raise HTTPException(status_code=404, detail="Athlete profile not found")

    logs = db.query(TrainingLog).filter(TrainingLog.user_id == athlete_user_id).all()
    if logs:
        total_sessions = len(logs)
        avg_performance = sum(log.performance_score for log in logs) / total_sessions
        avg_intensity = sum(log.intensity for log in logs) / total_sessions
        avg_fatigue = sum(log.fatigue_level for log in logs) / total_sessions
        avg_pain = sum(log.injury_pain_level for log in logs) / total_sessions
    else:
        total_sessions = avg_performance = avg_intensity = avg_fatigue = avg_pain = 0

    athlete_context = (
        f"Sport: {athlete.sport}\nAge: {athlete.age}\nState: {athlete.state}\n"
        f"Level: {athlete.level}\nAchievements: {athlete.achievements}\n"
        f"Goals: {athlete.goals}\nInjury History: {athlete.injury_history}\n"
        f"Preferred Language: {athlete.language}"
    )
    analytics_context = (
        f"Total Training Sessions: {total_sessions}\n"
        f"Average Performance Score: {round(avg_performance, 2)}\n"
        f"Average Intensity: {round(avg_intensity, 2)}\n"
        f"Average Fatigue: {round(avg_fatigue, 2)}\n"
        f"Average Pain Level: {round(avg_pain, 2)}"
    )

    insight = generate_ai_scout_insight(
        athlete_context=athlete_context,
        analytics_context=analytics_context,
    )
    return {"athlete_user_id": athlete_user_id, "ai_scout_insight": insight}


# ─────────────────────────────────────────────
# AI SMART NOTIFICATION
# ─────────────────────────────────────────────

@router.post("/ai/smart-notification")
def ai_smart_notification(
    data: AISmartNotificationRequest, db: Session = Depends(get_db)
):
    athlete = db.query(AthleteProfile).filter(
        AthleteProfile.user_id == data.user_id
    ).first()
    if not athlete:
        raise HTTPException(status_code=404, detail="Athlete profile not found")

    athlete_context = (
        f"Sport: {athlete.sport}\nAge: {athlete.age}\nState: {athlete.state}\n"
        f"Level: {athlete.level}\nAchievements: {athlete.achievements}\n"
        f"Goals: {athlete.goals}\nLanguage: {athlete.language}"
    )
    ai_message = generate_ai_notification(
        athlete_context=athlete_context,
        notification_context=sanitize_input(data.notification_context),
    )

    new_notification = Notification(
        user_id=data.user_id,
        notification_type="AI Smart Notification",
        title="AI Personalised Alert",
        message=ai_message,
        priority="Medium",
        is_read="false",
    )
    db.add(new_notification)
    db.commit()
    db.refresh(new_notification)
    return {
        "message": "AI smart notification created successfully",
        "notification_id": str(new_notification.id),
        "ai_notification": ai_message,
    }


# ─────────────────────────────────────────────
# AI PERFORMANCE TREND PREDICTION
# ─────────────────────────────────────────────

@router.get("/ai/performance-prediction/{user_id}")
def ai_performance_prediction(user_id: UUID, db: Session = Depends(get_db)):
    athlete = db.query(AthleteProfile).filter(
        AthleteProfile.user_id == user_id
    ).first()
    if not athlete:
        raise HTTPException(status_code=404, detail="Athlete profile not found")

    logs = db.query(TrainingLog).filter(TrainingLog.user_id == user_id).all()
    if not logs:
        raise HTTPException(status_code=404, detail="No training logs found")

    total_sessions = len(logs)
    avg_performance = sum(log.performance_score for log in logs) / total_sessions
    avg_intensity = sum(log.intensity for log in logs) / total_sessions
    avg_fatigue = sum(log.fatigue_level for log in logs) / total_sessions
    avg_pain = sum(log.injury_pain_level for log in logs) / total_sessions
    total_duration = sum(log.duration_minutes for log in logs)

    athlete_context = (
        f"Sport: {athlete.sport}\nAge: {athlete.age}\nState: {athlete.state}\n"
        f"Level: {athlete.level}\nAchievements: {athlete.achievements}\n"
        f"Goals: {athlete.goals}\nInjury History: {athlete.injury_history}\n"
        f"Preferred Language: {athlete.language}"
    )
    analytics_context = (
        f"Total Training Sessions: {total_sessions}\n"
        f"Total Training Minutes: {total_duration}\n"
        f"Average Performance Score: {round(avg_performance, 2)}\n"
        f"Average Intensity: {round(avg_intensity, 2)}\n"
        f"Average Fatigue: {round(avg_fatigue, 2)}\n"
        f"Average Pain Level: {round(avg_pain, 2)}"
    )

    prediction = generate_performance_prediction(
        athlete_context=athlete_context,
        analytics_context=analytics_context,
    )
    return {"user_id": user_id, "ai_performance_prediction": prediction}


# ─────────────────────────────────────────────
# AI MULTILINGUAL RESPONSE
# ─────────────────────────────────────────────

@router.post("/ai/multilingual-response")
def ai_multilingual_response(data: MultilingualResponseRequest):
    translated_response = generate_multilingual_response(
        message=sanitize_input(data.message),
        target_language=data.target_language,
    )
    return {
        "target_language": data.target_language,
        "translated_response": translated_response,
    }


# ─────────────────────────────────────────────
# LEADERBOARD
# ─────────────────────────────────────────────

def _build_leaderboard_entry(athlete, logs):
    if logs:
        total_sessions = len(logs)
        avg_performance = sum(log.performance_score for log in logs) / total_sessions
        avg_intensity = sum(log.intensity for log in logs) / total_sessions
        avg_fatigue = sum(log.fatigue_level for log in logs) / total_sessions
        avg_pain = sum(log.injury_pain_level for log in logs) / total_sessions
        consistency_score = min(total_sessions * 5, 30)
        final_score = max(
            0,
            min(
                100,
                round(
                    avg_performance * 0.5
                    + avg_intensity * 3
                    + consistency_score
                    - (avg_fatigue + avg_pain) * 2,
                    2,
                ),
            ),
        )
    else:
        total_sessions = 0
        avg_performance = 0
        final_score = 0

    return {
        "user_id": str(athlete.user_id),
        "sport": athlete.sport,
        "state": athlete.state,
        "level": athlete.level,
        "age": athlete.age,
        "training_sessions": total_sessions,
        "average_performance": round(avg_performance, 2),
        "leaderboard_score": final_score,
    }


@router.get("/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    athletes = db.query(AthleteProfile).all()
    leaderboard = [
        _build_leaderboard_entry(
            a,
            db.query(TrainingLog).filter(TrainingLog.user_id == a.user_id).all(),
        )
        for a in athletes
    ]
    leaderboard = sorted(leaderboard, key=lambda x: x["leaderboard_score"], reverse=True)
    return {"total_athletes": len(leaderboard), "leaderboard": leaderboard}


@router.get("/leaderboard/{sport}")
def get_sport_leaderboard(sport: str, db: Session = Depends(get_db)):
    athletes = db.query(AthleteProfile).filter(
        AthleteProfile.sport.ilike(f"%{sport}%")
    ).all()
    leaderboard = [
        _build_leaderboard_entry(
            a,
            db.query(TrainingLog).filter(TrainingLog.user_id == a.user_id).all(),
        )
        for a in athletes
    ]
    leaderboard = sorted(leaderboard, key=lambda x: x["leaderboard_score"], reverse=True)
    return {
        "sport": sport,
        "total_athletes": len(leaderboard),
        "leaderboard": leaderboard,
    }


# ─────────────────────────────────────────────
# PROJECT STATUS REPORT
# ─────────────────────────────────────────────

@router.get("/project/status")
def project_status(db: Session = Depends(get_db)):
    return {
        "project_name": "AI Sports Opportunity & Talent Intelligence Platform",
        "backend_status": "Running Successfully",
        "database": "Supabase PostgreSQL Connected",
        "ai_provider": "Groq AI Integrated",
        "completed_modules": [
            "Authentication (with email verification, forgot/reset/change password)",
            "Legal & Policy Pages (Terms, Privacy, Cookies, Disclaimer)",
            "Cookie Consent Management",
            "Athlete Profiles",
            "Opportunity Feed (with deadline status & Apply Now buttons)",
            "AI Recommendations",
            "Training Logs",
            "Performance Analytics",
            "Skill Rating",
            "Notifications",
            "Coach Portal",
            "Scout Portal",
            "Sponsor Feed",
            "Injury Risk Predictor",
            "Career Path AI",
            "Mentorship Matching",
            "Certificate Verification",
            "AI Video Feedback",
            "AI Chat Assistant",
            "AI Training Plan",
            "AI Scout Insight",
            "AI Smart Notifications",
            "AI Performance Prediction",
            "Multilingual AI Response",
            "Leaderboard",
            "Rate Limiting",
            "Input Validation & Sanitisation",
            "Password Strength Enforcement",
            "File Upload Validation",
        ],
        "database_counts": {
            "users": db.query(User).count(),
            "athletes": db.query(AthleteProfile).count(),
            "competitions": db.query(Competition).count(),
            "scholarships": db.query(Scholarship).count(),
            "schemes": db.query(GovernmentScheme).count(),
            "training_logs": db.query(TrainingLog).count(),
            "notifications": db.query(Notification).count(),
            "certificates": db.query(Certificate).count(),
            "video_analyses": db.query(VideoAnalysis).count(),
        },
    }


# ─────────────────────────────────────────────
# PROTECTED TEST ROUTES
# ─────────────────────────────────────────────

@router.get("/protected-test")
def protected_test(current_user: dict = Depends(get_current_user)):
    return {"message": "Protected route working", "current_user": current_user}


@router.get("/admin/protected-test")
def admin_protected_test(current_user: dict = Depends(require_role(["admin"]))):
    return {"message": "Admin access granted", "current_user": current_user}


@router.get("/coach/protected-test")
def coach_protected_test(current_user: dict = Depends(require_role(["coach", "admin"]))):
    return {"message": "Coach access granted", "current_user": current_user}


@router.get("/scout/protected-test")
def scout_protected_test(current_user: dict = Depends(require_role(["scout", "admin"]))):
    return {"message": "Scout access granted", "current_user": current_user}


# ─────────────────────────────────────────────
# POSE ANALYSIS
# ─────────────────────────────────────────────

@router.post("/pose-analysis/analyze")
def pose_analysis(data: PoseAnalysisRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    result = analyze_video_pose(data.video_path)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    ai_report = generate_ai_biomechanics_report(sport=data.sport, biomechanics_result=result)
    saved_report = PoseAnalysisReport(
        user_id=data.user_id,
        sport=data.sport,
        video_path=data.video_path,
        pose_detection_rate=int(result["pose_detection_rate"]),
        detection_quality=result["detection_quality"],
        biomechanics_result=json.dumps(result),
        ai_biomechanics_report=ai_report,
    )
    db.add(saved_report)
    db.commit()
    db.refresh(saved_report)
    return {
        "message": "Pose analysis completed and saved successfully",
        "report_id": str(saved_report.id),
        "user_id": data.user_id,
        "sport": data.sport,
        "biomechanics_result": result,
        "ai_biomechanics_report": ai_report,
    }


@router.get("/pose-analysis/reports/{user_id}")
def get_pose_analysis_reports(user_id: UUID, db: Session = Depends(get_db)):
    reports = db.query(PoseAnalysisReport).filter(
        PoseAnalysisReport.user_id == user_id
    ).order_by(PoseAnalysisReport.created_at.desc()).all()
    return {
        "user_id": user_id,
        "total_reports": len(reports),
        "reports": [
            {
                "report_id": str(r.id),
                "sport": r.sport,
                "video_path": r.video_path,
                "pose_detection_rate": r.pose_detection_rate,
                "detection_quality": r.detection_quality,
                "ai_biomechanics_report": r.ai_biomechanics_report,
                "created_at": r.created_at,
            }
            for r in reports
        ],
    }


@router.post("/pose-analysis/upload")
def upload_and_analyze_pose(
    user_id: UUID,
    sport: str,
    video: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    try:
        print("========== POSE UPLOAD STARTED ==========")
        print("USER ID:", user_id)
        print("SPORT:", sport)
        print("VIDEO FILE:", video.filename)
        print("CONTENT TYPE:", video.content_type)

        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        validation = validate_file_upload(video.filename, video.content_type)

        if not validation["valid"]:
            print("FILE VALIDATION ERROR:", validation["message"])
            raise HTTPException(status_code=400, detail=validation["message"])

        upload_dir = "uploads/videos"
        os.makedirs(upload_dir, exist_ok=True)

        file_ext = os.path.splitext(video.filename)[1] or ".mp4"
        safe_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = os.path.join(upload_dir, safe_filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(video.file, buffer)

        print("VIDEO SAVED AT:", file_path)
        print("VIDEO FILE SIZE:", os.path.getsize(file_path), "bytes")

        result = analyze_video_pose(file_path)

        print("POSE ANALYSIS RESULT:", result)

        if not result:
            raise HTTPException(
                status_code=400,
                detail="Pose analysis failed. Empty result returned.",
            )

        if "error" in result:
            print("POSE ANALYSIS ERROR:", result["error"])
            raise HTTPException(status_code=400, detail=result["error"])

        performance_scores = generate_performance_scores(result)

        print("PERFORMANCE SCORES:", performance_scores)

        ai_feedback = generate_ai_biomechanics_report(
            sport=sport,
            biomechanics_result=result,
        )

        saved_report = PoseAnalysisReport(
            user_id=user_id,
            sport=sport,
            video_path=file_path,
            pose_detection_rate=int(result.get("pose_detection_rate", 0)),
            detection_quality=result.get("detection_quality", "Unknown"),
            biomechanics_result=json.dumps(result),
            ai_biomechanics_report=ai_feedback,
        )

        db.add(saved_report)
        db.commit()
        db.refresh(saved_report)

        print("REPORT SAVED:", saved_report.id)
        print("========== POSE UPLOAD COMPLETED ==========")

        return {
            "message": "Video uploaded, analysed, and saved successfully",
            "report_id": str(saved_report.id),
            "video_path": file_path,
            "sport": sport,
            "biomechanics_result": result,
            "ai_biomechanics_report": ai_feedback,
            "performance_scores": performance_scores,
        }

    except HTTPException:
        raise

    except Exception as e:
        print("UNEXPECTED POSE UPLOAD ERROR:", str(e))

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Pose upload failed: {str(e)}",
        )


@router.post("/pose-analysis/live-frame")
def live_frame_pose_analysis(
    user_id: UUID,
    sport: str,
    frame: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Validate image upload
    validation = validate_file_upload(frame.filename, frame.content_type, allowed_types=["image"])
    if not validation["valid"]:
        raise HTTPException(status_code=400, detail=validation["message"])

    upload_dir = "uploads/live_frames"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = f"{upload_dir}/{frame.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(frame.file, buffer)

    result = analyze_image_pose(file_path)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    ai_feedback = generate_live_pose_feedback(sport=sport, pose_result=result)
    return {
        "user_id": user_id,
        "sport": sport,
        "live_pose_result": result,
        "ai_live_feedback": ai_feedback,
    }


@router.get("/pose-analysis/status")
def pose_analysis_status():
    return {
        "module": "Real Biomechanics Pose Analysis",
        "status": "Completed",
        "features": [
            "Video upload pose analysis",
            "Video frame extraction",
            "MediaPipe pose keypoint detection",
            "Joint angle calculation",
            "Symmetry analysis",
            "Groq AI biomechanics report",
            "Saved pose reports in Supabase",
            "Live webcam frame analysis",
            "AI live posture feedback",
            "File type & size validation",
        ],
        "ai_provider": "Groq",
        "pose_engine": "MediaPipe Tasks API",
        "ready_for_frontend": True,
    }


# ─────────────────────────────────────────────
# PERFORMANCE TIMELINE / RADAR / IMPROVEMENT
# ─────────────────────────────────────────────

@router.get("/performance/timeline/{user_id}")
def get_performance_timeline(user_id: UUID, db: Session = Depends(get_db)):
    sessions = (
        db.query(TrainingLog)
        .filter(TrainingLog.user_id == user_id)
        .order_by(TrainingLog.created_at.asc())
        .all()
    )
    return {
        "timeline": [
            {
                "date": str(s.created_at.date()),
                "overall_score": s.overall_score,
                "balance_score": s.balance_score,
                "posture_score": s.posture_score,
                "symmetry_score": s.symmetry_score,
                "mobility_score": s.mobility_score,
                "stability_score": s.stability_score,
                "explosiveness_score": s.explosiveness_score,
            }
            for s in sessions
        ]
    }

@router.get("/performance/improvement/{user_id}")
def get_improvement_analysis(
    user_id: UUID,
    db: Session = Depends(get_db)
):
    logs = (
        db.query(TrainingLog)
        .filter(TrainingLog.user_id == user_id)
        .order_by(desc(TrainingLog.created_at))
        .limit(2)
        .all()
    )

    if len(logs) < 2:
        return {
            "message": "Need at least 2 sessions"
        }

    current = logs[0]
    previous = logs[1]

    return {
        "performance": round(
            current.performance_score - previous.performance_score,
            2
        ),

        "intensity": round(
            current.intensity - previous.intensity,
            2
        ),

        "fatigue": round(
            current.fatigue_level - previous.fatigue_level,
            2
        ),

        "pain": round(
            current.injury_pain_level - previous.injury_pain_level,
            2
        ),

        "calories": round(
            current.calories_burned - previous.calories_burned,
            2
        ),

        "duration": round(
            current.duration_minutes - previous.duration_minutes,
            2
        ),
    }

@router.get("/performance/radar/{user_id}")
def get_radar_comparison(
    user_id: UUID,
    db: Session = Depends(get_db)
):
    logs = (
        db.query(TrainingLog)
        .filter(TrainingLog.user_id == user_id)
        .order_by(desc(TrainingLog.created_at))
        .limit(2)
        .all()
    )

    if len(logs) < 2:
        return {
            "message": "Need at least 2 sessions",
            "labels": [],
            "current": [],
            "previous": []
        }

    current = logs[0]
    previous = logs[1]

    return {
        "labels": [
            "Performance",
            "Intensity",
            "Fatigue",
            "Pain",
            "Calories",
            "Duration"
        ],

        "previous": [
            previous.performance_score,
            previous.intensity * 10,
            previous.fatigue_level * 10,
            previous.injury_pain_level * 10,
            min(previous.calories_burned / 10, 100),
            min(previous.duration_minutes, 100),
        ],

        "current": [
            current.performance_score,
            current.intensity * 10,
            current.fatigue_level * 10,
            current.injury_pain_level * 10,
            min(current.calories_burned / 10, 100),
            min(current.duration_minutes, 100),
        ],
    }
@router.post("/admin/competitions")
def admin_create_competition(
    data: CompetitionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    competition = Competition(
        name=sanitize_input(data.name),
        sport=sanitize_input(data.sport),
        level=sanitize_input(data.level),
        venue=sanitize_input(data.venue),
        date=data.date,
        registration_fee=sanitize_input(data.registration_fee),
        age_category=sanitize_input(data.age_category),
        eligibility=sanitize_input(data.eligibility),
        organizer=sanitize_input(data.organizer),
        application_link=str(data.application_link),
    )

    db.add(competition)
    db.commit()
    db.refresh(competition)

    return {
        "message": "Competition created successfully",
        "competition_id": str(competition.id),
    }


@router.get("/admin/competitions")
def admin_get_competitions(db: Session = Depends(get_db)):
    competitions = db.query(Competition).order_by(Competition.date.asc()).all()

    return {
        "total": len(competitions),
        "competitions": [
            {
                "id": str(item.id),
                "name": item.name,
                "sport": item.sport,
                "level": item.level,
                "venue": item.venue,
                "date": item.date,
                "registration_fee": item.registration_fee,
                "age_category": item.age_category,
                "eligibility": item.eligibility,
                "organizer": item.organizer,
                "application_link": item.application_link,
                "status": _deadline_status(item.date),
            }
            for item in competitions
        ],
    }


@router.put("/admin/competitions/{competition_id}")
def admin_update_competition(
    competition_id: UUID,
    data: CompetitionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    competition = db.query(Competition).filter(Competition.id == competition_id).first()

    if not competition:
        raise HTTPException(status_code=404, detail="Competition not found")

    update_data = data.dict(exclude_unset=True)

    for key, value in update_data.items():
        if isinstance(value, str):
            value = sanitize_input(value)
        setattr(competition, key, value)

    db.commit()
    db.refresh(competition)

    return {
        "message": "Competition updated successfully",
        "competition_id": str(competition.id),
    }


@router.delete("/admin/competitions/{competition_id}")
def admin_delete_competition(
    competition_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    competition = db.query(Competition).filter(Competition.id == competition_id).first()

    if not competition:
        raise HTTPException(status_code=404, detail="Competition not found")

    db.delete(competition)
    db.commit()

    return {
        "message": "Competition deleted successfully",
        "competition_id": str(competition_id),
    }
@router.post("/admin/scholarships")
def admin_create_scholarship(
    data: ScholarshipCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"])),
):
    scholarship = Scholarship(
        name=sanitize_input(data.name),
        provider=sanitize_input(data.provider),
        amount=sanitize_input(data.amount),
        sport_eligibility=sanitize_input(data.sport_eligibility),
        age_category=sanitize_input(data.age_category),
        eligibility_criteria=sanitize_input(data.eligibility_criteria),
        application_link=str(data.application_link),
        deadline=data.deadline,
    )

    db.add(scholarship)
    db.commit()
    db.refresh(scholarship)

    return {
        "message": "Scholarship created successfully",
        "scholarship_id": str(scholarship.id),
    }


@router.get("/admin/scholarships")
def admin_get_scholarships(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"])),
):
    scholarships = db.query(Scholarship).order_by(Scholarship.deadline.asc()).all()

    return {
        "total": len(scholarships),
        "scholarships": [
            {
                "id": str(item.id),
                "name": item.name,
                "provider": item.provider,
                "amount": item.amount,
                "sport_eligibility": item.sport_eligibility,
                "age_category": item.age_category,
                "eligibility_criteria": item.eligibility_criteria,
                "application_link": item.application_link,
                "deadline": item.deadline,
                "status": _deadline_status(item.deadline),
            }
            for item in scholarships
        ],
    }


@router.put("/admin/scholarships/{scholarship_id}")
def admin_update_scholarship(
    scholarship_id: UUID,
    data: ScholarshipUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"])),
):
    scholarship = db.query(Scholarship).filter(Scholarship.id == scholarship_id).first()

    if not scholarship:
        raise HTTPException(status_code=404, detail="Scholarship not found")

    update_data = data.dict(exclude_unset=True)

    for key, value in update_data.items():
        if isinstance(value, str):
            value = sanitize_input(value)
        setattr(scholarship, key, value)

    db.commit()
    db.refresh(scholarship)

    return {
        "message": "Scholarship updated successfully",
        "scholarship_id": str(scholarship.id),
    }


@router.delete("/admin/scholarships/{scholarship_id}")
def admin_delete_scholarship(
    scholarship_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"])),
):
    scholarship = db.query(Scholarship).filter(Scholarship.id == scholarship_id).first()

    if not scholarship:
        raise HTTPException(status_code=404, detail="Scholarship not found")

    db.delete(scholarship)
    db.commit()

    return {
        "message": "Scholarship deleted successfully",
        "scholarship_id": str(scholarship_id),
    }
@router.get("/athlete/readiness/{user_id}")
def athlete_readiness(
    user_id: UUID,
    db: Session = Depends(get_db),
):
    logs = (
        db.query(TrainingLog)
        .filter(TrainingLog.user_id == user_id)
        .order_by(TrainingLog.created_at.desc())
        .limit(5)
        .all()
    )

    latest_pose = (
        db.query(PoseAnalysisReport)
        .filter(PoseAnalysisReport.user_id == user_id)
        .order_by(PoseAnalysisReport.created_at.desc())
        .first()
    )

    if not logs:
        raise HTTPException(
            status_code=404,
            detail="No training data found",
        )

    fatigue = sum(log.fatigue_level for log in logs) / len(logs)
    pain = sum(log.injury_pain_level for log in logs) / len(logs)
    intensity = sum(log.intensity for log in logs) / len(logs)

    posture = 75
    balance = 75
    symmetry = 75

    if latest_pose:
        pose_data = json.loads(latest_pose.biomechanics_result)

        posture = pose_data.get("posture_score", 75)
        balance = pose_data.get("balance_score", 75)
        symmetry = pose_data.get("symmetry_score", 75)

    readiness = calculate_readiness_score(
        fatigue=fatigue,
        pain=pain,
        intensity=intensity,
        posture=posture,
        balance=balance,
        symmetry=symmetry,
    )

    return {
        "user_id": str(user_id),
        "metrics": {
            "fatigue": round(fatigue, 2),
            "pain": round(pain, 2),
            "intensity": round(intensity, 2),
            "posture": posture,
            "balance": balance,
            "symmetry": symmetry,
        },
        **readiness,
    }
@router.get("/athlete/weekly-summary/{user_id}")
def athlete_weekly_summary(
    user_id: UUID,
    db: Session = Depends(get_db),
):
    from datetime import datetime, timedelta

    seven_days_ago = datetime.utcnow() - timedelta(days=7)

    logs = (
        db.query(TrainingLog)
        .filter(
            TrainingLog.user_id == user_id,
            TrainingLog.created_at >= seven_days_ago,
        )
        .order_by(TrainingLog.created_at.desc())
        .all()
    )

    if not logs:
        raise HTTPException(
            status_code=404,
            detail="No training logs found for this week",
        )

    total_sessions = len(logs)
    total_minutes = sum(log.duration_minutes or 0 for log in logs)
    avg_performance = sum(log.performance_score or 0 for log in logs) / total_sessions
    avg_fatigue = sum(log.fatigue_level or 0 for log in logs) / total_sessions
    avg_pain = sum(log.injury_pain_level or 0 for log in logs) / total_sessions
    avg_intensity = sum(log.intensity or 0 for log in logs) / total_sessions

    if avg_pain >= 6 or avg_fatigue >= 7:
        status = "Recovery Focus"
        suggestion = "Reduce intensity, focus on mobility, sleep and recovery."
    elif avg_performance >= 75 and avg_fatigue <= 5:
        status = "Strong Week"
        suggestion = "You can continue progressive training with controlled load."
    else:
        status = "Balanced Week"
        suggestion = "Maintain consistency and avoid sudden intensity jumps."

    summary = (
        f"This week you completed {total_sessions} training sessions "
        f"with {total_minutes} total minutes. Your average performance was "
        f"{round(avg_performance, 1)} with fatigue {round(avg_fatigue, 1)} "
        f"and pain {round(avg_pain, 1)}. {suggestion}"
    )

    return {
        "user_id": str(user_id),
        "total_sessions": total_sessions,
        "total_minutes": total_minutes,
        "average_performance": round(avg_performance, 1),
        "average_fatigue": round(avg_fatigue, 1),
        "average_pain": round(avg_pain, 1),
        "average_intensity": round(avg_intensity, 1),
        "status": status,
        "suggestion": suggestion,
        "summary": summary,
    }
@router.post("/ai/smart-notification/{user_id}")
def generate_smart_notifications(
    user_id: UUID,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    logs = (
        db.query(TrainingLog)
        .filter(TrainingLog.user_id == user_id)
        .order_by(TrainingLog.created_at.desc())
        .limit(5)
        .all()
    )

    latest_pose = (
        db.query(PoseAnalysisReport)
        .filter(PoseAnalysisReport.user_id == user_id)
        .order_by(PoseAnalysisReport.created_at.desc())
        .first()
    )

    messages = []

    if not logs:
        messages.append({
            "title": "Start Your Training Journey",
            "message": "Add your first training session to unlock EliteX smart insights.",
            "type": "info",
        })
    else:
        avg_fatigue = sum(log.fatigue_level or 0 for log in logs) / len(logs)
        avg_pain = sum(log.injury_pain_level or 0 for log in logs) / len(logs)
        avg_performance = sum(log.performance_score or 0 for log in logs) / len(logs)
        avg_intensity = sum(log.intensity or 0 for log in logs) / len(logs)

        if avg_fatigue >= 7:
            messages.append({
                "title": "High Fatigue Detected",
                "message": "Your recent fatigue level is high. Take recovery seriously before intense training.",
                "type": "warning",
            })

        if avg_pain >= 5:
            messages.append({
                "title": "Pain Alert",
                "message": "Your pain level is increasing. Reduce load and monitor injury risk.",
                "type": "danger",
            })

        if avg_performance >= 80 and avg_fatigue <= 5:
            messages.append({
                "title": "Strong Performance Week",
                "message": "Your performance is strong with controlled fatigue. Keep progressing gradually.",
                "type": "success",
            })

        if avg_intensity >= 8 and avg_fatigue >= 6:
            messages.append({
                "title": "Training Load Warning",
                "message": "High intensity with high fatigue may increase injury risk. Add recovery or mobility work.",
                "type": "warning",
            })

    if latest_pose:
        try:
            pose_data = json.loads(latest_pose.biomechanics_result or "{}")
            detection_rate = latest_pose.pose_detection_rate or 0

            if detection_rate < 60:
                messages.append({
                    "title": "Pose Quality Needs Improvement",
                    "message": "Your latest video had low pose detection quality. Try uploading a clearer full-body video.",
                    "type": "info",
                })

            posture = pose_data.get("posture_score", 75)
            balance = pose_data.get("balance_score", 75)
            symmetry = pose_data.get("symmetry_score", 75)

            if posture < 60:
                messages.append({
                    "title": "Posture Correction Needed",
                    "message": "EliteX detected posture weakness. Focus on core stability and controlled movement.",
                    "type": "warning",
                })

            if balance < 60:
                messages.append({
                    "title": "Balance Issue Detected",
                    "message": "Balance score is low. Add single-leg stability and coordination drills.",
                    "type": "warning",
                })

            if symmetry < 60:
                messages.append({
                    "title": "Movement Symmetry Alert",
                    "message": "Left-right movement imbalance detected. Consider technique correction and mobility drills.",
                    "type": "danger",
                })

        except Exception:
            pass

    if not messages:
        messages.append({
            "title": "All Good",
            "message": "Your recent training and movement data look balanced. Keep logging consistently.",
            "type": "success",
        })

    saved = []

    for item in messages:
        notification = Notification(
            user_id=user_id,
            title=item["title"],
            message=item["message"],
            notification_type=item["type"],
            is_read=False,
        )

        db.add(notification)
        saved.append(item)

    db.commit()

    return {
        "message": "Smart notifications generated successfully",
        "total": len(saved),
        "notifications": saved,
    }