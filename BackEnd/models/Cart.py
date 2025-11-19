from sqlalchemy import Table, Column, Integer, String, DateTime
from sqlalchemy.sql import func
from config.db import meta

cart = Table(
    "cart",
    meta,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("user_id", String(100)),  # Can be user email or session ID
    Column("product_id", Integer),  # Reference to Products table (no FK constraint for simplicity)
    Column("product_name", String(100)),
    Column("product_price", Integer),
    Column("product_category", String(200)),
    Column("product_image", String(500)),
    Column("quantity", Integer, default=1),
    Column("created_at", DateTime, server_default=func.now()),
    Column("updated_at", DateTime, server_default=func.now(), onupdate=func.now()),
)
