import os
from dotenv import load_dotenv

load_dotenv()

class Settings:

    APP_NAME = "SARVA AI"

    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    
    _raw_groq_model = os.getenv("GROQ_MODEL", "").strip()
    if not _raw_groq_model or "qwen" in _raw_groq_model.lower() or "scout" in _raw_groq_model.lower():
        GROQ_MODEL = "openai/gpt-oss-20b"
    else:
        GROQ_MODEL = _raw_groq_model

    _raw_max_tokens = os.getenv("MAX_OUTPUT_TOKENS", "")
    try:
        MAX_OUTPUT_TOKENS = min(int(_raw_max_tokens), 800) if _raw_max_tokens else 800
    except ValueError:
        MAX_OUTPUT_TOKENS = 800

    MONGO_URI = os.getenv("MONGO_URI")

    DATABASE_NAME = os.getenv("DATABASE_NAME")

    SECRET_KEY = os.getenv("SECRET_KEY", "super_secret_fallback_key")

    ENVIRONMENT = os.getenv("ENVIRONMENT", "development").lower()
    IS_PROD = ENVIRONMENT in ("production", "prod") or bool(os.getenv("RENDER")) or bool(os.getenv("RENDER_SERVICE_ID")) or bool(os.getenv("VERCEL"))
    INCLUDE_DEMO_TOKEN = os.getenv("INCLUDE_DEMO_TOKEN", "false" if IS_PROD else "true").lower() == "true"

    RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
    EMAIL_FROM = os.getenv("EMAIL_FROM", "SARVA AI <onboarding@resend.dev>")

    _raw_frontend_url = os.getenv("FRONTEND_URL", "").strip().rstrip("/")
    if _raw_frontend_url:
        FRONTEND_URL = _raw_frontend_url
    elif IS_PROD:
        FRONTEND_URL = "https://sarva-ai-one.vercel.app"
    else:
        FRONTEND_URL = "http://localhost:5173"

settings = Settings()