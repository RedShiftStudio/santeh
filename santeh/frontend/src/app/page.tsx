"use client";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Product, useStore } from "@/context/StoreContext";
import { Heart, BarChart2, Star, CheckCircle2, Droplets } from "lucide-react";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [selectedCat, setSelectedCat] = useState<number | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [search, setSearch] = useState("");
  const { addToCart, toggleFavorite, toggleCompare, favorites, compare } = useStore();

  useEffect(() => {
    fetch("http://localhost:8000/api/categories").then((r) => r.json()).then(setCategories);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCat) params.append("category_id", String(selectedCat));
    if (selectedBrand) params.append("brand", selectedBrand);
    if (search) params.append("search", search);
    fetch(`http://localhost:8000/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then(setProducts);
  }, [selectedCat, selectedBrand, search]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearch={setSearch} />

      <main className="max-w-7xl w-full mx-auto px-4 py-6 flex gap-6">
        <aside className="w-64 shrink-0 space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="font-bold text-sm uppercase text-gray-400 mb-3">Категории</h3>
            <ul className="space-y-1.5 text-sm">
              <li>
                <button
                  onClick={() => setSelectedCat(null)}
                  className={`w-full text-left px-2 py-1.5 rounded ${!selectedCat ? "bg-orange-50 text-orange-600 font-semibold" : "hover:bg-gray-50"}`}
                >
                  Все товары
                </button>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => setSelectedCat(c.id)}
                    className={`w-full text-left px-2 py-1.5 rounded ${selectedCat === c.id ? "bg-orange-50 text-orange-600 font-semibold" : "hover:bg-gray-50"}`}
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="font-bold text-sm uppercase text-gray-400 mb-3">Производитель</h3>
            {["", "Grohe", "Hansgrohe", "Cersanit", "Roca", "AM.PM"].map((b) => (
              <label key={b} className="flex items-center gap-2 text-sm py-1 cursor-pointer">
                <input
                  type="radio"
                  name="brand"
                  checked={selectedBrand === b}
                  onChange={() => setSelectedBrand(b)}
                  className="accent-orange-500"
                />
                <span>{b || "Все бренды"}</span>
              </label>
            ))}
          </div>
        </aside>

        <section className="flex-1 space-y-3">
          <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
            <h1 className="text-xl font-bold">Каталог сантехники ({products.length})</h1>
            <span className="text-sm text-gray-500">Сортировка: По популярности</span>
          </div>

          {products.map((p) => {
            const isFav = favorites.some((i) => i.id === p.id);
            const isComp = compare.some((i) => i.id === p.id);

            return (
              <div key={p.id} className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition flex gap-6 items-center">
                <div className="w-36 h-36 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400 shrink-0">
                  <Droplets size={36} className="text-orange-400 mb-1" />
                  <span className="text-[11px] font-semibold">{p.brand}</span>
                </div>

                <div className="flex-1">
                  <div className="text-xs text-gray-400 mb-1">Код товара: {p.sku}</div>
                  <h2 className="font-semibold text-base hover:text-orange-500 cursor-pointer mb-2">{p.name}</h2>

                  <div className="text-xs text-gray-500 mb-3">
                    {Object.entries(p.specs).map(([k, v]) => `${k}: ${v}`).join(" • ")}
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded font-medium">
                      <Star size={14} className="text-orange-500 fill-orange-500" /> {p.rating} ({p.reviews_count})
                    </span>
                    <span className="flex items-center gap-1 text-green-600 font-medium">
                      <CheckCircle2 size={14} /> В наличии ({p.stock} шт.)
                    </span>
                  </div>
                </div>

                <div className="w-48 text-right border-l pl-5">
                  {p.old_price && <div className="text-xs text-gray-400 line-through">{p.old_price.toLocaleString()} ₽</div>}
                  <div className="text-2xl font-bold mb-3">{p.price.toLocaleString()} ₽</div>

                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => toggleCompare(p)}
                      title="Сравнить"
                      className={`p-2.5 rounded-lg border ${isComp ? "border-orange-500 text-orange-500 bg-orange-50" : "hover:bg-gray-100"}`}
                    >
                      <BarChart2 size={18} />
                    </button>
                    <button
                      onClick={() => toggleFavorite(p)}
                      title="В избранное"
                      className={`p-2.5 rounded-lg border ${isFav ? "border-orange-500 text-orange-500 bg-orange-50" : "hover:bg-gray-100"}`}
                    >
                      <Heart size={18} />
                    </button>
                    <button
                      onClick={() => addToCart(p)}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg transition"
                    >
                      Купить
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}
