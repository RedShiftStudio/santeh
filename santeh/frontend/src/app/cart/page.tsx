"use client";
import { useState } from "react";
import Header from "@/components/Header";
import { useStore } from "@/context/StoreContext";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);

  const total = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("http://localhost:8000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: name,
        customer_phone: phone,
        total_price: total,
        items: cart.map((i) => ({ name: i.product.name, qty: i.qty, price: i.product.price })),
      }),
    });
    clearCart();
    setDone(true);
  };

  return (
    <div>
      <Header />
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Корзина</h1>
        {done ? (
          <div className="bg-green-50 border border-green-200 p-6 rounded-xl text-green-800 font-semibold">
            Заказ успешно оформлен! Менеджер свяжется с вами в ближайшее время.
          </div>
        ) : cart.length === 0 ? (
          <div className="bg-white p-8 rounded-xl text-center text-gray-500">Корзина пуста</div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-3">
              {cart.map(({ product, qty }) => (
                <div key={product.id} className="bg-white p-4 rounded-xl flex justify-between items-center shadow-sm">
                  <div>
                    <div className="font-semibold">{product.name}</div>
                    <div className="text-sm text-gray-500">{qty} шт. × {product.price.toLocaleString()} ₽</div>
                  </div>
                  <button onClick={() => removeFromCart(product.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleOrder} className="bg-white p-5 rounded-xl shadow-sm space-y-4 h-fit">
              <div className="text-lg font-bold">Итого: {total.toLocaleString()} ₽</div>
              <input required placeholder="Ваше имя" value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 rounded" />
              <input required placeholder="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border p-2 rounded" />
              <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg">
                Оформить заказ
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
