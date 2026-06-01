from fastapi import HTTPException, status

from auth.models.user import UserModel
from auth.schemas.auth import LoginRequest, LoginResponse, SignupRequest, SignupResponse, UserResponse
from core.database import Database
from core.security import create_token, hash_password, verify_password


class AuthService:
    """লগইন ও সাইনআপের ব্যবসায়িক লজিক।"""

    def __init__(self, database: Database) -> None:
        self.database = database
        self.collection = database.get_collection(UserModel.collection_name)

    async def signup(self, payload: SignupRequest) -> SignupResponse:
        """নতুন ইউজার তৈরি করে এবং token দেয়।"""

        normalized_email = payload.email.strip().lower()
        existing_user = await self.collection.find_one({"email": normalized_email})

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="এই ইমেইল দিয়ে আগে থেকেই অ্যাকাউন্ট আছে",
            )

        hashed_password = hash_password(payload.password)
        user_document = UserModel.create(
            name=payload.name,
            email=normalized_email,
            hashed_password=hashed_password,
        )

        insert_result = await self.collection.insert_one(user_document)
        saved_user = {
            **user_document,
            "_id": insert_result.inserted_id,
        }
        token = create_token(subject=str(insert_result.inserted_id))

        return SignupResponse(
            message="অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে",
            user=UserModel.from_db(saved_user),
            token=token,
        )

    async def login(self, payload: LoginRequest) -> LoginResponse:
        """ইউজার যাচাই করে token দেয়।"""

        normalized_email = payload.email.strip().lower()
        user_document = await self.collection.find_one({"email": normalized_email})

        if not user_document:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="ইমেইল বা পাসওয়ার্ড ভুল",
            )

        if not verify_password(payload.password, user_document["hashed_password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="ইমেইল বা পাসওয়ার্ড ভুল",
            )

        token = create_token(subject=str(user_document["_id"]))

        return LoginResponse(
            message="সফলভাবে লগইন হয়েছে",
            user=UserModel.from_db(user_document),
            token=token,
        )
