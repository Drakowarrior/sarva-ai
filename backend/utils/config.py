import os
from dotenv import load_dotenv

load_dotenv()

class Settings:

    APP_NAME = "SARVA AI"

    GROQ_API_KEY = os.getenv("GROQ_API_KEY")

    MONGO_URI = os.getenv("MONGO_URI")

    DATABASE_NAME = os.getenv("DATABASE_NAME")

    SECRET_KEY = os.getenv("SECRET_KEY", "super_secret_fallback_key")

    ENVIRONMENT = os.getenv("ENVIRONMENT", "development").lower()
    IS_PROD = ENVIRONMENT in ("production", "prod") or bool(os.getenv("RENDER"))
    INCLUDE_DEMO_TOKEN = os.getenv("INCLUDE_DEMO_TOKEN", "false" if IS_PROD else "true").lower() == "true"

    RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
    EMAIL_FROM = os.getenv("EMAIL_FROM", "SARVA AI <onboarding@resend.dev>")
    FRONTEND_URL = os.getenv(
        "FRONTEND_URL",
        "https://sarva-ai-one.vercel.app" if IS_PROD else "http://localhost:5173"
    ).rstrip("/")

settings = Settings()