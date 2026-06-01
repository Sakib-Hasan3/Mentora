from pydantic import BaseModel, Field


EMAIL_PATTERN = r"^[^\s@]+@[^\s@]+\.[^\s@]+$"


class SignupRequest(BaseModel):
    """সাইনআপ রিকোয়েস্টের ভ্যালিডেশন স্কিমা।"""

    name: str = Field(min_length=2, max_length=100)
    email: str = Field(pattern=EMAIL_PATTERN, max_length=255)
    password: str = Field(min_length=6, max_length=128)


class LoginRequest(BaseModel):
    """লগইন রিকোয়েস্টের ভ্যালিডেশন স্কিমা।"""

    email: str = Field(pattern=EMAIL_PATTERN, max_length=255)
    password: str = Field(min_length=6, max_length=128)


class UserResponse(BaseModel):
    """সেফ ইউজার response shape — password থাকে না।"""

    id: str
    name: str
    email: str
    is_active: bool


class SignupResponse(BaseModel):
    success: bool = True
    message: str
    user: UserResponse
    token: str


class LoginResponse(BaseModel):
    success: bool = True
    message: str
    user: UserResponse
    token: str


class ErrorResponse(BaseModel):
    success: bool = False
    message: str
