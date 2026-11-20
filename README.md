# Сантех — Интернет-магазин сантехники (FastAPI + Next.js + PostgreSQL/SQLite)

## Быстрый запуск
1. (Опционально) Запустите PostgreSQL через Docker: `docker-compose up -d`. По умолчанию Backend использует локальную SQLite базу `santeh.db` для мгновенного запуска.
2. **Backend**:
   ```bash
   cd backend
   python -m venv venv
   # Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```
3. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
Откройте в браузере:
- Витрина магазина: http://localhost:3000
- Панель администратора: http://localhost:3000/admin
- Сравнение товаров: http://localhost:3000/compare
- Корзина: http://localhost:3000/cart
- Документация API: http://localhost:8000/docs
