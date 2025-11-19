from sqlalchemy import Table, Column, Integer, String
from config.db import meta

products = Table(
    "products",
    meta,
    Column("id", Integer, primary_key=True),
    Column("name", String(100)),
    Column("Category", String(200)),
    Column("Price", Integer),
    Column("Description", String(200)),
    Column("Image", String(200)),
    Column("Quantity", Integer),
)
