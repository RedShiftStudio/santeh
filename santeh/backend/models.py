from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    slug = Column(String, unique=True, index=True)
    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String, unique=True, index=True)
    name = Column(String, index=True)
    brand = Column(String, index=True)
    price = Column(Float, index=True)
    old_price = Column(Float, nullable=True)
    stock = Column(Integer, default=10)
    rating = Column(Float, default=4.9)
    reviews_count = Column(Integer, default=14)
    image_url = Column(String, default="")
    specs = Column(JSON, default={})
    category_id = Column(Integer, ForeignKey("categories.id"))
    category = relationship("Category", back_populates="products")

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String)
    customer_phone = Column(String)
    status = Column(String, default="Новый")
    total_price = Column(Float)
    items = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
