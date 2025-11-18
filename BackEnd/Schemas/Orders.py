from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class OrderItem(BaseModel):
    id: str
    name: str
    price: int
    quantity: int
    category: str
    img: Optional[str] = ""

class OrderCreate(BaseModel):
    order_id: str
    customer_name: str
    customer_email: str
    customer_phone: str
    address: str
    city: str
    state: str
    pincode: str
    country: Optional[str] = "India"
    order_items: List[Dict[str, Any]]
    total_items: int
    total_price: int
    status: Optional[str] = "Confirmed"

class OrderUpdate(BaseModel):
    status: Optional[str] = None
    shipping_id: Optional[str] = None
    shipping_company: Optional[str] = None

class OrderResponse(BaseModel):
    id: int
    order_id: str
    customer_name: str
    customer_email: str
    customer_phone: str
    address: str
    city: str
    state: str
    pincode: str
    country: str
    order_items: List[Dict[str, Any]]
    total_items: int
    total_price: int
    status: str
    shipping_id: Optional[str]
    shipping_company: Optional[str]
    order_date: datetime
    updated_at: datetime
