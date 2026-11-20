"use client";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Product } from "@/context/StoreContext";
import { Trash2, PlusCircle } from "lucide-react";

export default function AdminPage() {
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("Grohe");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("1");
  const [material, setMaterial] = useState("Латунь");

  const loadData = () => {
    fetch("http://localhost:8000/api/products").then((r) => r.json()).then(setProducts);
    fetch("http://localhost:8000/api/admin/orders").then((r) => r.json()).then(setOrders);
  };

  useEffect(() => { loadData(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("http://localhost:8000/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sku, name, brand,
        price: parseFloat(price),
        stock: 10,
        category_id: parseInt(categoryId),
        specs: { "Материал": material }
      }),
    });
    setSku(""); setName(""); setPrice("");
    loadData();
  };

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:8000/api/admin/products/${id}`, { method: "DELETE" });
    loadData();
  };

  const handleStatusChange = async (id: number, status: string) => {
    await fetch(`http://localhost:8000/api/admin/orders/${id}?status=${encodeURIComponent(status)}`, { method: "PATCH" });
    loadData();
  };

  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Панель администратора СантехDNS</h1>
          <div className="flex gap-2">
            <button onClick={() => setTab("products")} className={`px-4 py-2 rounded-lg font-semibold ${tab === "products" ? "bg-orange-500 text-white" : "bg-white"}`}>
              Товары ({products.length})
            </button>
            <button onClick={() => setTab("orders")} className={`px-4 py-2 rounded-lg font-semibold ${tab === "orders" ? "bg-orange-500 text-white" : "bg-white"}`}>
              Заказы ({orders.length})
            </button>
          </div>
        </div>

        {tab === "products" ? (
          <div className="grid grid-cols-3 gap-6">
            <form onSubmit={handleAdd} className="bg-white p-5 rounded-xl shadow-sm space-y-3 h-fit">
              <h2 className="font-bold flex items-center gap-2"><PlusCircle size={18} className="text-orange-500" /> Добавить товар</h2>
              <input required placeholder="Код (SKU)" value={sku} onChange={(e) => setSku(e.target.value)} className="w-full border p-2 rounded" />
              <input required placeholder="Название" value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 rounded" />
              <input required placeholder="Бренд" value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full border p-2 rounded" />
              <input required type="number" placeholder="Цена ₽" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border p-2 rounded" />
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full border p-2 rounded">
                <option value="1">Смесители</option>
                <option value="2">Ванны</option>
                <option value="3">Унитазы</option>
                <option value="4">Душевые системы</option>
              </select>
              <input placeholder="Материал" value={material} onChange={(e) => setMaterial(e.target.value)} className="w-full border p-2 rounded" />
              <button type="submit" className="w-full bg-orange-500 text-white font-bold py-2.5 rounded-lg hover:bg-orange-600">
                Создать товар
              </button>
            </form>

            <div className="col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Название</th>
                    <th className="p-3">Цена</th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b">
                      <td className="p-3 text-gray-500">{p.sku}</td>
                      <td className="p-3 font-medium">{p.name}</td>
                      <td className="p-3 font-bold">{p.price.toLocaleString()} ₽</td>
                      <td className="p-3 text-right">
                        <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4">№</th>
                  <th className="p-4">Клиент</th>
                  <th className="p-4">Сумма</th>
                  <th className="p-4">Статус</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b">
                    <td className="p-4 font-bold">#{o.id}</td>
                    <td className="p-4">{o.customer_name} ({o.customer_phone})</td>
                    <td className="p-4 font-bold">{o.total_price.toLocaleString()} ₽</td>
                    <td className="p-4">
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className="border rounded p-1.5 bg-gray-50"
                      >
                        <option>Новый</option>
                        <option>В сборке</option>
                        <option>Доставлен</option>
                        <option>Отменен</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
