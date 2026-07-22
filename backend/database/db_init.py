import logging
from database.mongodb import db

logger = logging.getLogger("db_init")

async def init_db_indexes():
    """
    Initializes unique indexes and compound indexes in MongoDB to guarantee 
    integrity, relationship validity, and performant query lookups.
    """
    try:
        logger.info("Initializing database indexes...")
        
        # 1. Users Indexes
        await db.users.create_index("email", unique=True)
        await db.users.create_index("username", unique=True)
        logger.info("User indexes created/verified successfully.")
        
        # 2. Organizations Indexes
        await db.organizations.create_index("organizationName", unique=True)
        logger.info("Organization indexes created/verified successfully.")
        
        # 3. Organization Members (Compound unique index)
        # Prevents duplicate memberships for the same user in the same organization
        await db.organization_members.create_index(
            [("organizationId", 1), ("userId", 1)], 
            unique=True
        )
        logger.info("Organization member compound indexes verified successfully.")
        
        # 4. Invitations Indexes
        await db.invitations.create_index("inviteToken", unique=True)
        await db.invitations.create_index("invitedEmail")
        logger.info("Invitation indexes verified successfully.")
        
        # 5. Sessions/Chats & Logs
        await db.sessions.create_index([("organizationId", 1), ("userId", 1)])
        await db.activity_logs.create_index("organizationId")
        await db.notifications.create_index("userId")
        
        logger.info("Database index initialization finished successfully.")
    except Exception as e:
        logger.error(f"Error initializing database indexes: {e}", exc_info=True)
