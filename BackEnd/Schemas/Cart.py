from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CartItem(BaseModel):
    user_id: str
    product_id: int
    product_name: str
    product_price: int
    product_category: str
    product_image: Optional[str] = ""
    quantity: int = 1

class CartItemUpdate(BaseModel):
    quantity: int

class CartResponse(BaseModel):
    id: int
    user_id: str
    product_id: int
    product_name: str
    product_price: int
    product_category: str
    product_image: Optional[str]
    quantity: int
    created_at: datetime
    updated_at: datetime
