from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

from .config import get_settings


# bcrypt ব্যবহার করে password hash/verify করা হচ্ছে।
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """পাসওয়ার্ড hash করে দেয়।"""

    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Plain password আর hashed password মিলিয়ে দেখে।"""

    return pwd_context.verify(plain_password, hashed_password)


def create_token(subject: str, expires_delta: timedelta | None = None) -> str:
    """JWT token তৈরি করে।"""

    settings = get_settings()
    expire_delta = expires_delta or timedelta(minutes=settings.access_token_expire_minutes)
    expire_at = datetime.now(timezone.utc) + expire_delta
    payload = {"sub": subject, "exp": expire_at}
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def decode_token(token: str) -> dict:
    """JWT token ডিকোড করে payload return করে।"""

    settings = get_settings()

    try:
        return jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    except JWTError as exc:
        raise ValueError("Invalid or expired token") from exc
