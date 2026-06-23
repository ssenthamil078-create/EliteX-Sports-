"""
email_service.py — Transactional email helpers.

Configure the following environment variables:
    SMTP_HOST      e.g. smtp.gmail.com
    SMTP_PORT      e.g. 587
    SMTP_USER      your sending email address
    SMTP_PASSWORD  your SMTP password / app password
    FRONTEND_URL   e.g. https://yourapp.com  (used to build links)

If SMTP_USER is not set, the functions log the email to stdout (dev mode).
"""

import os
import smtplib
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

logger = logging.getLogger(__name__)

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")


def _send_email(to_email: str, subject: str, html_body: str) -> None:
    """Send an HTML email. Falls back to console logging in dev mode."""
    if not SMTP_USER:
        logger.info(
            "[DEV EMAIL] To: %s | Subject: %s\n%s", to_email, subject, html_body
        )
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = SMTP_USER
    msg["To"] = to_email
    msg.attach(MIMEText(html_body, "html"))

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.ehlo()
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(SMTP_USER, to_email, msg.as_string())
        logger.info("Email sent to %s (subject: %s)", to_email, subject)
    except Exception as exc:
        logger.error("Failed to send email to %s: %s", to_email, exc)


# ─── Templates ───────────────────────────────────────────────────────────────

def send_verification_email(email: str, name: str, token: str) -> None:
    link = f"{FRONTEND_URL}/verify-email/{token}"
    subject = "Verify your AI Sports Platform email address"
    html = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
      <h2 style="color:#2563eb;">Welcome to AI Sports Platform, {name}!</h2>
      <p>Thank you for registering. Please verify your email address to activate your account.</p>
      <a href="{link}"
         style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;
                border-radius:6px;text-decoration:none;font-weight:bold;margin:16px 0;">
        Verify Email Address
      </a>
      <p style="color:#666;font-size:13px;">
        This link is valid for 24 hours. If you did not register, please ignore this email.
      </p>
      <p style="color:#666;font-size:12px;">
        Or copy this URL into your browser:<br/>
        <a href="{link}" style="color:#2563eb;">{link}</a>
      </p>
    </div>
    """
    _send_email(email, subject, html)


def send_password_reset_email(email: str, name: str, token: str) -> None:
    link = f"{FRONTEND_URL}/reset-password/{token}"
    subject = "Reset your AI Sports Platform password"
    html = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
      <h2 style="color:#dc2626;">Password Reset Request</h2>
      <p>Hi {name},</p>
      <p>We received a request to reset your password. Click the button below to set a new password.</p>
      <a href="{link}"
         style="display:inline-block;padding:12px 24px;background:#dc2626;color:#fff;
                border-radius:6px;text-decoration:none;font-weight:bold;margin:16px 0;">
        Reset Password
      </a>
      <p style="color:#666;font-size:13px;">
        This link is valid for 1 hour. If you did not request a password reset,
        please ignore this email — your password will not change.
      </p>
      <p style="color:#666;font-size:12px;">
        Or copy this URL into your browser:<br/>
        <a href="{link}" style="color:#dc2626;">{link}</a>
      </p>
    </div>
    """
    _send_email(email, subject, html)