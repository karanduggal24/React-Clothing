from sqlalchemy import create_engine, MetaData
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:password@127.0.0.1:3306/clothing_store")

engine = create_engine(DATABASE_URL)
meta = MetaData()
conn = engine.connect()
