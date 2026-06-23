"""
validators.py — Input sanitisation, password strength checks,
and file upload validation.
"""

import re
import html
from typing import Optional


# ─── Input sanitisation ──────────────────────────────────────────────────────

_ALLOWED_TAGS_RE = re.compile(r"<[^>]+>")


def sanitize_input(value: str) -> str:
    """
    Strip HTML tags and escape special characters to prevent XSS / injection.
    Returns an empty string if value is None.
    """
    if not value:
        return ""
    value = _ALLOWED_TAGS_RE.sub("", value)   # strip HTML tags
    value = html.escape(value)                 # escape &, <, >, ", '
    return value.strip()


# ─── Password strength ───────────────────────────────────────────────────────

def validate_password_strength(password: str) -> dict:
    """
    Enforce the following rules:
    - Minimum 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one digit
    - At least one special character

    Returns {"valid": bool, "message": str}
    """
    if len(password) < 8:
        return {"valid": False, "message": "Password must be at least 8 characters long."}
    if not re.search(r"[A-Z]", password):
        return {"valid": False, "message": "Password must contain at least one uppercase letter."}
    if not re.search(r"[a-z]", password):
        return {"valid": False, "message": "Password must contain at least one lowercase letter."}
    if not re.search(r"\d", password):
        return {"valid": False, "message": "Password must contain at least one digit."}
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>_\-]", password):
        return {
            "valid": False,
            "message": "Password must contain at least one special character (!@#$%^&* etc.).",
        }
    return {"valid": True, "message": "Password is strong."}


# ─── File upload validation ──────────────────────────────────────────────────

ALLOWED_VIDEO_TYPES = {
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "video/x-msvideo",  # .avi
}

ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}

ALLOWED_EXTENSIONS_VIDEO = {".mp4", ".webm", ".mov", ".avi"}
ALLOWED_EXTENSIONS_IMAGE = {".jpg", ".jpeg", ".png", ".webp"}

MAX_VIDEO_SIZE_MB = 100
MAX_IMAGE_SIZE_MB = 10


def validate_file_upload(
    filename: Optional[str],
    content_type: Optional[str],
    allowed_types: list = None,   # ["video", "image"] or a subset
) -> dict:
    """
    Validate a file's extension and MIME type.
    Returns {"valid": bool, "message": str}.
    """
    if allowed_types is None:
        allowed_types = ["video", "image"]

    if not filename:
        return {"valid": False, "message": "No filename provided."}

    ext = "." + filename.rsplit(".", 1)[-1].lower() if "." in filename else ""

    if "video" in allowed_types and ext in ALLOWED_EXTENSIONS_VIDEO:
        if content_type and content_type not in ALLOWED_VIDEO_TYPES:
            return {
                "valid": False,
                "message": f"Invalid MIME type '{content_type}' for video file.",
            }
        return {"valid": True, "message": "File is valid."}

    if "image" in allowed_types and ext in ALLOWED_EXTENSIONS_IMAGE:
        if content_type and content_type not in ALLOWED_IMAGE_TYPES:
            return {
                "valid": False,
                "message": f"Invalid MIME type '{content_type}' for image file.",
            }
        return {"valid": True, "message": "File is valid."}

    allowed_exts = []
    if "video" in allowed_types:
        allowed_exts += list(ALLOWED_EXTENSIONS_VIDEO)
    if "image" in allowed_types:
        allowed_exts += list(ALLOWED_EXTENSIONS_IMAGE)

    return {
        "valid": False,
        "message": (
            f"Unsupported file type '{ext}'. "
            f"Allowed extensions: {', '.join(sorted(allowed_exts))}."
        ),
    }