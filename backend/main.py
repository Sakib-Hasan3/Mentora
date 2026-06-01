from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from auth import auth_router
from core.database import database


@asynccontextmanager
async def lifespan(app: FastAPI):
    """অ্যাপ শুরু হলে database connect, বন্ধ হলে disconnect করে।"""

    await database.connect()
    try:
        yield
    finally:
        await database.disconnect()


app = FastAPI(title="Mentora Auth API", lifespan=lifespan)

# বাংলা ফ্রন্টএন্ড থেকে কল করার জন্য CORS অনুমতি দেওয়া হচ্ছে।
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)


@app.get("/")
async def root():
    """হোম endpoint — সার্ভার চলছে কি না বোঝার জন্য।"""

    return {
        "success": True,
        "message": "Mentora Auth API is running",
    }


@app.get("/health")
async def health():
    """সাধারণ health check endpoint।"""

    return {
        "success": True,
        "message": "OK",
    }
