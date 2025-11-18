from BackEnd.config.db import engine, meta
from BackEnd.models.Orders import orders

# Create Orders table
meta.create_all(engine)

print("✓ Orders table created successfully!")
print(f"✓ Table 'Orders' created with columns: {[col.name for col in orders.columns]}")
print("\nOrders table structure:")
print("- id: Primary key (auto-increment)")
print("- order_id: Unique order identifier")
print("- customer_name: Customer full name")
print("- customer_email: Customer email")
print("- customer_phone: Customer phone number")
print("- address: Full address")
print("- city: City")
print("- state: State")
print("- pincode: Postal code")
print("- country: Country")
print("- order_items: Cart items (JSON)")
print("- total_items: Total number of items")
print("- total_price: Total order price")
print("- status: Order status (Confirmed/Shipped)")
print("- shipping_id: Shipping tracking ID")
print("- shipping_company: Shipping company name")
print("- order_date: Order creation timestamp")
print("- updated_at: Last update timestamp")
