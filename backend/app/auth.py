from passlib.context import CryptContext
from jose import jwt, JWTError 
from datetime import datetime, timedelta
import os
import secrets
from typing import List 
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, Depends, status
from datetime import datetime, timedelta, timezone 
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(password: str, hashed_password: str):
    return pwd_context.verify(password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(days=7)

    to_encode.update({"exp": expire})

    token = jwt.encode(
        to_encode,
        JWT_SECRET,
        algorithm=JWT_ALGORITHM
    )

    return token
security = HTTPBearer()

SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-production-use-a-long-random-string")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))
REMEMBER_ME_EXPIRE_DAYS = int(os.getenv("REMEMBER_ME_EXPIRE_DAYS", 30))
 
# ─── Password hashing ────────────────────────────────────────────────────────
 
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
 
 
def hash_password(plain: str) -> str:
    return pwd_context.hash(plain)
 
 
def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)
 
 
# ─── JWT helpers ─────────────────────────────────────────────────────────────
 
def create_access_token(data: dict, remember_me: bool = False) -> str:
    to_encode = data.copy()
    if remember_me:
        expire = datetime.now(timezone.utc) + timedelta(days=REMEMBER_ME_EXPIRE_DAYS)
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
 
 
def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
 
 
# ─── Email verification & password-reset tokens ───────────────────────────────
# These are simple URL-safe random tokens stored in the DB (not JWTs), so they
# can be invalidated individually without needing token blacklisting.
 
def create_email_verification_token(user_id: str) -> str:
    """Return a 64-char cryptographically-secure random token."""
    return secrets.token_urlsafe(48)
 
 
def create_password_reset_token(user_id: str) -> str:
    """Return a 64-char cryptographically-secure random token."""
    return secrets.token_urlsafe(48)
 
 
# ─── Bearer auth dependency ──────────────────────────────────────────────────
 
bearer_scheme = HTTPBearer()
 
 
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> dict:
    token = credentials.credentials
    payload = verify_token(token)
    if "user_id" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    return payload
 
 
def require_role(allowed_roles: List[str]):
    """Factory that returns a dependency enforcing role-based access control."""
 
    def _check(current_user: dict = Depends(get_current_user)) -> dict:
        if current_user.get("role") not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {allowed_roles}",
            )
        return current_user
 
    return _check
 