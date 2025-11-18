from pydantic import BaseModel

class Product(BaseModel):
    name: str
    Category: str
    Price: int
    Description: str
    Image: str
    Quantity: int
