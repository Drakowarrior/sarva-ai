import os
from dotenv import load_dotenv

load_dotenv()

class Settings:

    APP_NAME = "SARVA AI"

    GROQ_API_KEY = os.getenv("GROQ_API_KEY")

    MONGO_URI = os.getenv("MONGO_URI")

    DATABASE_NAME = os.getenv("DATABASE_NAME")

    SECRET_KEY = os.getenv("SECRET_KEY", "super_secret_fallback_key")

settings = Settings()