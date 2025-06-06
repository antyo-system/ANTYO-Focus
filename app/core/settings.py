from functools import lru_cache
from pydantic import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"

    class Config:
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    return Settings()
