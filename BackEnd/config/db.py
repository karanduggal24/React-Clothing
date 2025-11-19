from sqlalchemy import create_engine, MetaData
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")

# If DATABASE_URL is not set, construct it from individual variables
if not DATABASE_URL:
    DB_USER = os.getenv("DB_USER", "root")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "password")
    DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
    DB_PORT = os.getenv("DB_PORT", "3306")
    DB_NAME = os.getenv("DB_NAME", "clothing_store")
    DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Create engine with connection pooling settings
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # Test connections before using
    pool_recycle=280,    # Recycle connections before MySQL timeout (default 300s)
    pool_size=5,
    max_overflow=10,
    echo=False
)
meta = MetaData()

# Create a simple wrapper that provides conn interface
class DBConnection:
    def execute(self, *args, **kwargs):
        with engine.connect() as connection:
            result = connection.execute(*args, **kwargs)
            connection.commit()  # Commit after each execute
            return result
    
    def commit(self):
        pass  # No-op since we commit in execute
    
    def rollback(self):
        pass  # No-op for now

conn = DBConnection()
