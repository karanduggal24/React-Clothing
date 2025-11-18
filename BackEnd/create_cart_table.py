from BackEnd.config.db import engine, meta
from BackEnd.models.Cart import cart

# Create Cart table
meta.create_all(engine)

print("✓ Cart table created successfully!")
print(f"✓ Table 'Cart' created with columns: {[col.name for col in cart.columns]}")
print("\nCart table structure:")
print("- id: Primary key (auto-increment)")
print("- user_id: User identifier (email or session ID)")
print("- product_id: Foreign key to Products table")
print("- product_name: Product name (denormalized for quick access)")
print("- product_price: Product price at time of adding to cart")
print("- product_category: Product category")
print("- product_image: Product image URL/base64")
print("- quantity: Number of items")
print("- created_at: Timestamp when added to cart")
print("- updated_at: Timestamp when last updated")
