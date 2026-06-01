from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorCollection, AsyncIOMotorDatabase

from .config import get_settings


class Database:
    """MongoDB connection manager."""

    def __init__(self) -> None:
        self._client: AsyncIOMotorClient | None = None
        self._database: AsyncIOMotorDatabase | None = None

    async def connect(self) -> None:
        """MongoDB client connect করে database ready করে।"""

        settings = get_settings()
        self._client = AsyncIOMotorClient(settings.mongodb_url)
        self._database = self._client[settings.database_name]

    async def disconnect(self) -> None:
        """MongoDB client বন্ধ করে এবং memory clean করে।"""

        if self._client is not None:
            self._client.close()
        self._client = None
        self._database = None

    def get_collection(self, collection_name: str) -> AsyncIOMotorCollection:
        """নির্দিষ্ট collection return করে।"""

        if self._database is None:
            raise RuntimeError("Database is not connected")
        return self._database[collection_name]


# পুরো অ্যাপের জন্য একটিই database instance ব্যবহার করা হচ্ছে।
database = Database()
