from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import models

DATABASE_URL = "sqlite:///./santeh.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="SantehDNS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.on_event("startup")
def seed_data():
    db = SessionLocal()
    if db.query(models.Category).count() == 0:
        cats = [
            models.Category(name="Смесители", slug="faucets"),
            models.Category(name="Ванны", slug="baths"),
            models.Category(name="Унитазы и инсталляции", slug="toilets"),
            models.Category(name="Душевые системы", slug="showers"),
        ]
        db.add_all(cats)
        db.commit()

        products = [
            models.Product(sku="5012941", name="Смеситель для раковины Grohe Eurosmart 23322001", brand="Grohe", price=11490, old_price=13990, stock=15, category_id=1, specs={"Материал": "Латунь", "Цвет": "Хром", "Гарантия": "5 лет"}),
            models.Product(sku="5018832", name="Смеситель для ванны Hansgrohe Logis 71400000", brand="Hansgrohe", price=14890, old_price=16500, stock=8, category_id=1, specs={"Материал": "Латунь", "Цвет": "Хром", "Термостат": "Нет"}),
            models.Product(sku="5024110", name="Ванна акриловая Cersanit Lorena 170x70", brand="Cersanit", price=18990, old_price=22000, stock=4, category_id=2, specs={"Материал": "Акрил", "Длина": "170 см", "Объем": "185 л"}),
            models.Product(sku="5039912", name="Унитаз подвесной Roca Gap Clean Rim безободковый", brand="Roca", price=16490, old_price=19990, stock=12, category_id=3, specs={"Материал": "Санфарфор", "Выпуск": "Горизонтальный", "Микролифт": "Да"}),
            models.Product(sku="5041005", name="Душевая система AM.PM X-Joy с тропическим душем", brand="AM.PM", price=24990, old_price=29990, stock=6, category_id=4, specs={"Материал": "Латунь/ABS", "Цвет": "Черный матовый", "Тропический душ": "Да"}),
        ]
        db.add_all(products)
        db.commit()
    db.close()

class ProductCreate(BaseModel):
    sku: str
    name: str
    brand: str
    price: float
    old_price: Optional[float] = None
    stock: int
    category_id: int
    specs: Dict[str, Any] = {}

class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    total_price: float
    items: List[Dict[str, Any]]

@app.get("/api/categories")
def get_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()

@app.get("/api/products")
def get_products(category_id: Optional[int] = None, brand: Optional[str] = None, search: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(models.Product)
    if category_id:
        q = q.filter(models.Product.category_id == category_id)
    if brand:
        q = q.filter(models.Product.brand == brand)
    if search:
        q = q.filter(models.Product.name.ilike(f"%{search}%"))
    return q.all()

@app.post("/api/orders")
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    db_order = models.Order(**order.dict())
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

@app.post("/api/admin/products")
def admin_create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_prod = models.Product(**product.dict())
    db.add(db_prod)
    db.commit()
    db.refresh(db_prod)
    return db_prod

@app.delete("/api/admin/products/{product_id}")
def admin_delete_product(product_id: int, db: Session = Depends(get_db)):
    prod = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Не найдено")
    db.delete(prod)
    db.commit()
    return {"ok": True}

@app.get("/api/admin/orders")
def admin_get_orders(db: Session = Depends(get_db)):
    return db.query(models.Order).order_by(models.Order.id.desc()).all()

@app.patch("/api/admin/orders/{order_id}")
def admin_update_order(order_id: int, status: str, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if order:
        order.status = status
        db.commit()
    return order
