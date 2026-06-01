from fastapi import APIRouter, HTTPException, status

from auth.schemas.auth import ErrorResponse, LoginRequest, LoginResponse, SignupRequest, SignupResponse
from auth.services.auth_service import AuthService
from core.database import database

router = APIRouter(prefix="/auth", tags=["Auth"])


def get_auth_service() -> AuthService:
    """একই database instance ব্যবহার করে service বানায়।"""

    return AuthService(database)


@router.post(
    "/signup",
    response_model=SignupResponse,
    responses={
        409: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
    },
)
async def signup(payload: SignupRequest):
    """নতুন account তৈরি করে token ফিরিয়ে দেয়।"""

    try:
        return await get_auth_service().signup(payload)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"সার্ভার ত্রুটি: {exc}",
        ) from exc


@router.post(
    "/login",
    response_model=LoginResponse,
    responses={
        401: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
    },
)
async def login(payload: LoginRequest):
    """ইউজার লগইন করে token ফিরিয়ে দেয়।"""

    try:
        return await get_auth_service().login(payload)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"সার্ভার ত্রুটি: {exc}",
        ) from exc
