from sqlalchemy import Table, Column, Integer, String, DateTime, Text, JSON
from sqlalchemy.sql import func
from config.db import meta

orders = Table(
    "Orders",
    meta,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("order_id", String(100), unique=True),  # Unique order ID
    Column("customer_name", String(100)),
    Column("customer_email", String(100)),
    Column("customer_phone", String(20)),
    Column("address", Text),
    Column("city", String(100)),
    Column("state", String(100)),
    Column("pincode", String(20)),
    Column("country", String(100)),
    Column("order_items", JSON),  # Store cart items as JSON
    Column("total_items", Integer),
    Column("total_price", Integer),
    Column("status", String(50), default="Confirmed"),
    Column("shipping_id", String(100)),
    Column("shipping_company", String(100)),
    Column("order_date", DateTime, server_default=func.now()),
    Column("updated_at", DateTime, server_default=func.now(), onupdate=func.now()),
)
