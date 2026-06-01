from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Environment variable ভিত্তিক কনফিগারেশন।"""

    port: int = Field(default=8000, alias="PORT")
    mongodb_url: str = Field(default="mongodb://localhost:27017", alias="MONGODB_URL")
    database_name: str = Field(default="mental_health_db", alias="DATABASE_NAME")
    secret_key: str = Field(default="mysecretkey123", alias="SECRET_KEY")
    algorithm: str = Field(default="HS256", alias="ALGORITHM")
    access_token_expire_minutes: int = Field(default=30, alias="ACCESS_TOKEN_EXPIRE_MINUTES")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """একবার settings লোড করে cache করে রাখে।"""

    return Settings()
