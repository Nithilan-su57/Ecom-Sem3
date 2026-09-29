from pydantic import BaseModel
from typing import List, Optional

class UserRegister(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class ProductCreate(BaseModel):
    name: str
    category: str
    price: float
    stock: int
    image: Optional[str] = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80"

class ProductUpdate(BaseModel):
    price: float
    stock: int

class CartItem(BaseModel):
    productId: int
    qty: int
    price: float

class OrderCreate(BaseModel):
    userId: int
    items: List[CartItem]
    total: float

class OrderStatusUpdate(BaseModel):
    status: str