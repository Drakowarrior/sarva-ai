from fastapi import APIRouter
from database.mongodb import db

router = APIRouter(
    prefix="/api",
    tags=["Health"]
)

@router.get("/health")
async def health_check():

    try:
        await db.command("ping")

        return {
            "status": "healthy",
            "database": "connected"
        }

    except Exception as e:

        return {
            "status": "unhealthy",
            "error": str(e)
        }