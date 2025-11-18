from BackEnd.config.db import engine, meta
from BackEnd.models.Products import products

# Create all tables
meta.create_all(engine)

print("✓ Database tables created successfully!")
print(f"✓ Table 'Products' created with columns: {[col.name for col in products.columns]}")
