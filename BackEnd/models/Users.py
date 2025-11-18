from sqlalchemy import Table, Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from config.db import meta

users = Table(
    "Users",
    meta,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("email", String(100), unique=True, nullable=False),
    Column("password", String(255), nullable=False),  # Will store hashed password
    Column("name", String(100), nullable=False),
    Column("phone", String(20)),
    Column("role", String(20), default="user"),  # 'admin' or 'user'
    Column("is_active", Boolean, default=True),
    Column("created_at", DateTime, server_default=func.now()),
    Column("updated_at", DateTime, server_default=func.now(), onupdate=func.now()),
)
