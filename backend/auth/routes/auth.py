from fastapi import APIRouter, HTTPException, status
from auth.schemas.auth import SignupRequest, LoginRequest
from auth.services.auth_service import AuthService
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from core.database import db
from core.security import create_token
from auth.routes.auth_otp import router as otp_router
from core.config import settings
from auth.services.firebase_auth import verify_firebase_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Include OTP routes nested inside /auth prefix
router.include_router(otp_router)

@router.post("/signup")
async def signup(user_data: SignupRequest):
    result = await AuthService.signup(user_data)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    return result

@router.post("/login")
async def login(login_data: LoginRequest):
    result = await AuthService.login(login_data)
    if not result["success"]:
        raise HTTPException(status_code=401, detail=result["message"])
    return result

class GoogleLoginRequest(BaseModel):
    token: str

@router.post("/google")
async def google_login(data: GoogleLoginRequest):
    token = data.token
    
    # 1. Dev mode fallback check
    if settings.is_development and token.startswith("dev-token-"):
        # Format: dev-token-email:name
        try:
            parts = token.replace("dev-token-", "").split(":")
            email_lower = parts[0].lower().strip()
            name = parts[1] if len(parts) > 1 else email_lower.split("@")[0]
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid developer token format.")
    else:
        # Real Firebase token validation
        if not settings.FIREBASE_PROJECT_ID:
            raise HTTPException(
                status_code=500,
                detail="Firebase Project ID is not configured on the server."
            )
        
        payload = await verify_firebase_token(token, settings.FIREBASE_PROJECT_ID)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="গুগল সাইন-ইন যাচাই করা ব্যর্থ হয়েছে"
            )
            
        email_lower = payload.get("email", "").lower().strip()
        name = payload.get("name", "Google User")

    if not email_lower:
        raise HTTPException(
            status_code=400,
            detail="গুগল অ্যাকাউন্ট থেকে ইমেল পাওয়া যায়নি"
        )
        
    user = await db.get_collection("users").find_one({"email": email_lower})
    is_sakib = email_lower == "sakib@gmail.com"
    
    if not user:
        # Register user on the fly if this email does not exist
        user_doc = {
            "name": name,
            "email": email_lower,
            "hashed_password": "",  # Passwordless login
            "is_active": True,
            "user_type": "paid" if is_sakib else "free",
            "subscription": "premium" if is_sakib else "free",
            "is_admin": is_sakib,
            "created_at": datetime.utcnow()
        }
        result = await db.get_collection("users").insert_one(user_doc)
        user = user_doc
        user["_id"] = result.inserted_id
    elif is_sakib and (user.get("user_type") != "paid" or user.get("subscription") != "premium" or not user.get("is_admin")):
        # Promote to premium/admin if not already updated
        await db.get_collection("users").update_one(
            {"_id": user["_id"]},
            {"$set": {
                "user_type": "paid",
                "subscription": "premium",
                "is_admin": True
            }}
        )
        user["user_type"] = "paid"
        user["subscription"] = "premium"
        user["is_admin"] = True
        
    user_id = str(user["_id"])
    token_str = create_token({"sub": user_id, "email": user["email"]})
    
    return {
        "success": True,
        "message": "গুগল লগইন সফল হয়েছে!",
        "token": token_str,
        "user": {
            "id": user_id,
            "name": user.get("name"),
            "email": user.get("email"),
            "is_active": user.get("is_active", True),
            "user_type": user.get("user_type", "free"),
            "subscription": user.get("subscription", "free"),
            "is_admin": user.get("is_admin", False)
        }
    }


